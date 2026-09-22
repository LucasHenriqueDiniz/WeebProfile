// Teste simples para verificar React
import React from "react"

console.log("React version:", React.version)
console.log("React createElement:", React.createElement)

// Testar JSX
const element = React.createElement("div", { className: "test" }, "Hello World")
console.log("Element created:", element)

// Testar renderToString
import { renderToString } from "react-dom/server"
const html = renderToString(element)
console.log("HTML rendered:", html)
