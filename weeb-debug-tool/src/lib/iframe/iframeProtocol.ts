/**
 * Iframe Communication Protocol
 *
 * Types and utilities for communication between parent window and iframe previews
 */

export type PreviewKind = "react" | "svg"

export type BBox = { x: number; y: number; width: number; height: number }

export type StyleSnapshot = {
  debugId?: string
  tagName: string
  classList: string[]
  attributes: Record<string, string>
  inlineStyle: Record<string, string>
  computedStyle: Record<string, string>
  cssVars: Record<string, string>
  bbox: BBox
}

export type RpcMethod = "getSnapshot" | "scrollIntoView" | "ping"

export type RpcRequest =
  // Record<string, never> rather than {}: `{}` in TypeScript means "any non-null
  // value", not "an object with no properties", so it accepted anything at all.
  | { method: "ping"; params?: Record<string, never> }
  | { method: "scrollIntoView"; params: { debugId: string } }
  | {
      method: "getSnapshot"
      params: { debugId: string; mode: "important" | "all"; varNames?: string[]; importantProps?: string[] }
    }

export type ParentToIframe =
  | { type: "DBG_INIT"; payload: { kind: PreviewKind } }
  | { type: "DBG_SET_HIGHLIGHT"; payload: { selectedDebugId?: string | null; hoveredDebugId?: string | null } }
  | { type: "DBG_RPC_REQUEST"; requestId: string; payload: RpcRequest }

export type IframeToParent =
  | { type: "DBG_READY"; payload: { kind: PreviewKind } }
  | { type: "DBG_EVENT_SELECT"; payload: { debugId: string; bbox: BBox; kind: PreviewKind } }
  | { type: "DBG_EVENT_HOVER"; payload: { debugId: string | null; bbox?: BBox; kind: PreviewKind } }
  | { type: "DBG_RPC_RESPONSE"; requestId: string; ok: boolean; result?: any; error?: string }

export function makeRequestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function postToIframe(iframe: HTMLIFrameElement, msg: ParentToIframe) {
  iframe.contentWindow?.postMessage(msg, "*")
}

export function isIframeMessage(data: any): data is IframeToParent {
  return data && typeof data === "object" && typeof data.type === "string" && data.type.startsWith("DBG_")
}
