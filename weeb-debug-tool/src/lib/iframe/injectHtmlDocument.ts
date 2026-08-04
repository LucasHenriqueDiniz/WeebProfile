/**
 * Build HTML document with injected bridge script for iframe
 */

import type { PreviewKind } from "./iframeProtocol"

export function buildSrcDoc(params: { kind: PreviewKind; htmlOrSvg: string; css: string; bridgeJs: string }) {
  const { kind, htmlOrSvg, css, bridgeJs } = params

  // evita scroll interno do iframe: bbox fica estável
  const baseCss = `
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
    #__dbg_root { position: relative; width: 100%; height: 100%; }
    /* highlights in-iframe (opcional) */
    [data-dbg-selected="1"] { outline: 2px solid rgba(255,255,0,0.9); outline-offset: 1px; }
    [data-dbg-hovered="1"] { outline: 1px dashed rgba(0,255,255,0.9); outline-offset: 1px; }
  `

  const body = kind === "react" ? htmlOrSvg : htmlOrSvg

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1" />
  <style>${baseCss}\n${css || ""}</style>
</head>
<body>
  <div id="__dbg_root">${body}</div>
  <script>${bridgeJs}</script>
</body>
</html>`
}
