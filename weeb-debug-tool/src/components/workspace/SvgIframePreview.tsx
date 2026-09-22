/**
 * SVG Iframe Preview
 *
 * Renders SVG in an iframe with bridge script for inspection
 */

import { useEffect, useRef, useState } from "react"
import type { StyleSnapshot } from "../../lib/iframe/iframeProtocol"
import { buildSrcDoc } from "../../lib/iframe/injectHtmlDocument"
import { makeBridgeScript } from "../../lib/iframe/bridgeScript"
import {
  postToIframe,
  isIframeMessage,
  makeRequestId,
  type IframeToParent,
  type ParentToIframe,
} from "../../lib/iframe/iframeProtocol"

interface SvgIframePreviewProps {
  svg: string
  background?: "light" | "dark"
  onElementSelect?: (snapshot: StyleSnapshot | null) => void // Disabled - SVG is view-only
  selectedDebugId?: string | null
  hoveredDebugId?: string | null
  onElementHover?: (debugId: string | null) => void
}

export default function SvgIframePreview({
  svg,
  background = "dark",
  onElementSelect,
  selectedDebugId,
  hoveredDebugId,
  onElementHover,
}: SvgIframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)
  const pendingRequestsRef = useRef<Map<string, { resolve: (value: any) => void; reject: (error: any) => void }>>(
    new Map()
  )

  // Build srcDoc with bridge script
  // For SVG, we need to wrap it in HTML structure
  const svgHtml = `<div id="__dbg_svg_container">${svg}</div>`
  const srcDoc = buildSrcDoc({
    kind: "svg",
    htmlOrSvg: svgHtml,
    css: "", // SVG already has styles embedded
    bridgeJs: makeBridgeScript("svg"),
  })

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isIframeMessage(event.data)) return

      const msg = event.data as IframeToParent

      if (msg.type === "DBG_READY") {
        setIsReady(true)
        // Send init message
        if (iframeRef.current) {
          postToIframe(iframeRef.current, { type: "DBG_INIT", payload: { kind: "svg" } })
        }
        return
      }

      if (msg.type === "DBG_EVENT_SELECT") {
        // SVG preview is view-only - selection disabled
        return
      }

      if (msg.type === "DBG_EVENT_HOVER") {
        onElementHover?.(msg.payload.debugId || null)
        return
      }

      if (msg.type === "DBG_RPC_RESPONSE") {
        const pending = pendingRequestsRef.current.get(msg.requestId)
        if (pending) {
          pendingRequestsRef.current.delete(msg.requestId)
          if (msg.ok) {
            pending.resolve(msg.result)
          } else {
            pending.reject(new Error(msg.error || "RPC failed"))
          }
        }
        return
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [onElementSelect, onElementHover])

  // Request snapshot via RPC
  const requestSnapshot = async (debugId: string, mode: "important" | "all" = "important"): Promise<StyleSnapshot> => {
    if (!iframeRef.current) throw new Error("Iframe not ready")

    const requestId = makeRequestId()
    const request: ParentToIframe = {
      type: "DBG_RPC_REQUEST",
      requestId,
      payload: {
        method: "getSnapshot",
        params: {
          debugId,
          mode,
        },
      },
    }

    return new Promise((resolve, reject) => {
      pendingRequestsRef.current.set(requestId, { resolve, reject })
      postToIframe(iframeRef.current!, request)

      // Timeout after 5 seconds
      setTimeout(() => {
        if (pendingRequestsRef.current.has(requestId)) {
          pendingRequestsRef.current.delete(requestId)
          reject(new Error("Snapshot request timeout"))
        }
      }, 5000)
    })
  }

  // Update highlights when selection changes
  useEffect(() => {
    if (!iframeRef.current || !isReady) return

    postToIframe(iframeRef.current, {
      type: "DBG_SET_HIGHLIGHT",
      payload: {
        selectedDebugId: selectedDebugId || null,
        hoveredDebugId: hoveredDebugId || null,
      },
    })
  }, [selectedDebugId, hoveredDebugId, isReady])

  const bgColor = background === "light" ? "#ffffff" : "#0d1117"
  const borderColor = background === "light" ? "#d0d7de" : "#30363d"

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}
