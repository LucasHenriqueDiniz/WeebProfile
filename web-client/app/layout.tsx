import React from "react"

import "./global.css"
import ToastProvider from "./ToastProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-light-theme='light' data-dark-theme='dark'>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
