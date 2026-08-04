/**
 * Bridge Script - Runs inside iframe
 *
 * This is injected as a string into the iframe document.
 * It handles communication between iframe and parent window.
 */

import type { PreviewKind } from "./iframeProtocol"

// ⚠️ isso vira string. mantenha sem imports/exports.
export function makeBridgeScript(kind: PreviewKind): string {
  return `
  (function() {
    var KIND = ${JSON.stringify(kind)};
    var selectedId = null;
    var hoveredId = null;

    function send(msg) { window.parent && window.parent.postMessage(msg, "*"); }

    function getDebugIdFromTarget(target) {
      var el = target && target.nodeType === 1 ? target : (target && target.parentElement);
      while (el) {
        var id = el.getAttribute && el.getAttribute("data-debug-id");
        if (id) return { id: id, el: el };
        el = el.parentElement;
      }
      return null;
    }

    function bboxOf(el) {
      var r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    }

    function parseStyleAttr(style) {
      var out = {};
      if (!style) return out;
      style.split(";").forEach(function(part) {
        var idx = part.indexOf(":");
        if (idx === -1) return;
        var k = part.slice(0, idx).trim();
        var v = part.slice(idx + 1).trim();
        if (k) out[k] = v;
      });
      return out;
    }

    function attrsOf(el) {
      var out = {};
      if (!el.attributes) return out;
      for (var i = 0; i < el.attributes.length; i++) {
        var a = el.attributes[i];
        out[a.name] = a.value;
      }
      return out;
    }

    var DEFAULT_IMPORTANT = [
      "font-family","font-size","font-weight","line-height","letter-spacing",
      "color","background-color","opacity",
      "display","position","top","left","right","bottom","width","height",
      "margin-top","margin-right","margin-bottom","margin-left",
      "padding-top","padding-right","padding-bottom","padding-left",
      "border-top-width","border-right-width","border-bottom-width","border-left-width",
      "border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius",
      "fill","stroke","stroke-width","vector-effect","shape-rendering","text-rendering"
    ];

    function computedOf(el, mode, importantProps) {
      var cs = window.getComputedStyle(el);
      var out = {};
      if (mode === "all") {
        for (var i = 0; i < cs.length; i++) {
          var prop = cs[i];
          out[prop] = (cs.getPropertyValue(prop) || "").trim();
        }
        return out;
      }
      var list = (importantProps && importantProps.length) ? importantProps : DEFAULT_IMPORTANT;
      for (var j = 0; j < list.length; j++) {
        var p = list[j];
        out[p] = (cs.getPropertyValue(p) || "").trim();
      }
      return out;
    }

    function varsOf(el, varNames) {
      var cs = window.getComputedStyle(el);
      var out = {};
      if (!varNames || !varNames.length) return out;
      for (var i = 0; i < varNames.length; i++) {
        var v = varNames[i];
        out[v] = (cs.getPropertyValue(v) || "").trim();
      }
      return out;
    }

    function clearMarks(attr) {
      var marked = document.querySelectorAll("[" + attr + "='1']");
      for (var i = 0; i < marked.length; i++) marked[i].removeAttribute(attr);
    }

    function setMark(debugId, attr) {
      if (!debugId) return;
      var el = document.querySelector("[data-debug-id='" + CSS.escape(debugId) + "']");
      if (el) el.setAttribute(attr, "1");
    }

    // events
    document.addEventListener("click", function(ev) {
      var found = getDebugIdFromTarget(ev.target);
      if (!found) return;
      selectedId = found.id;
      send({ type: "DBG_EVENT_SELECT", payload: { debugId: found.id, bbox: bboxOf(found.el), kind: KIND } });
    }, true);

    var hoverRaf = 0;
    document.addEventListener("mousemove", function(ev) {
      if (hoverRaf) return;
      hoverRaf = requestAnimationFrame(function() {
        hoverRaf = 0;
        var found = getDebugIdFromTarget(ev.target);
        var next = found ? found.id : null;
        if (next === hoveredId) return;
        hoveredId = next;
        send({ type: "DBG_EVENT_HOVER", payload: { debugId: next, bbox: found ? bboxOf(found.el) : undefined, kind: KIND } });
      });
    }, { passive: true });

    window.addEventListener("message", function(ev) {
      var msg = ev.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "DBG_SET_HIGHLIGHT") {
        clearMarks("data-dbg-selected");
        clearMarks("data-dbg-hovered");
        setMark(msg.payload && msg.payload.selectedDebugId, "data-dbg-selected");
        setMark(msg.payload && msg.payload.hoveredDebugId, "data-dbg-hovered");
        return;
      }

      if (msg.type === "DBG_RPC_REQUEST") {
        var requestId = msg.requestId;
        var payload = msg.payload || {};
        try {
          if (payload.method === "ping") {
            send({ type: "DBG_RPC_RESPONSE", requestId: requestId, ok: true, result: { kind: KIND } });
            return;
          }

          if (payload.method === "scrollIntoView") {
            var id = payload.params && payload.params.debugId;
            var el = id ? document.querySelector("[data-debug-id='" + CSS.escape(id) + "']") : null;
            if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", inline: "center" });
            send({ type: "DBG_RPC_RESPONSE", requestId: requestId, ok: true, result: true });
            return;
          }

          if (payload.method === "getSnapshot") {
            var id2 = payload.params && payload.params.debugId;
            var el2 = id2 ? document.querySelector("[data-debug-id='" + CSS.escape(id2) + "']") : null;
            if (!el2) {
              send({ type: "DBG_RPC_RESPONSE", requestId: requestId, ok: false, error: "Element not found for debugId: " + id2 });
              return;
            }
            var mode = (payload.params && payload.params.mode) || "important";
            var importantProps = payload.params && payload.params.importantProps;
            var varNames = payload.params && payload.params.varNames;

            var snap = {
              debugId: id2,
              tagName: (el2.tagName || "").toLowerCase(),
              classList: el2.classList ? Array.from(el2.classList) : [],
              attributes: attrsOf(el2),
              inlineStyle: parseStyleAttr(el2.getAttribute("style") || ""),
              computedStyle: computedOf(el2, mode, importantProps),
              cssVars: varsOf(el2, varNames),
              bbox: bboxOf(el2)
            };
            send({ type: "DBG_RPC_RESPONSE", requestId: requestId, ok: true, result: snap });
            return;
          }

          send({ type: "DBG_RPC_RESPONSE", requestId: requestId, ok: false, error: "Unknown method" });
        } catch (e) {
          send({ type: "DBG_RPC_RESPONSE", requestId: requestId, ok: false, error: String(e && e.message ? e.message : e) });
        }
      }
    });

    send({ type: "DBG_READY", payload: { kind: KIND } });
  })();
  `
}
