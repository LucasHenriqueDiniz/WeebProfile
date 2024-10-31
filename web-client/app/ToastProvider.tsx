"use client"
import * as Toast from "@radix-ui/react-toast"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { MdError } from "react-icons/md"

interface ToastProviderProps {
  children: React.ReactNode
}

const ToastContext = createContext<{
  sendToast: (args: { title: string; description?: string; error?: boolean }) => void
}>({
  sendToast: () => {},
})

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastOpen, setToastOpen] = useState<boolean>(false)
  const toastDescriptionRef = useRef<string | null>(null)
  const toastTitleRef = useRef<string>("This is a title")
  const [error, setError] = useState<boolean>(false)
  const timerRef = useRef<number>(0)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  function sendToast({ title, description }: { title: string; description?: string; error?: boolean }) {
    setToastOpen(false)
    setError(false)

    if (error) {
      setError(true)
    }
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (description) {
        toastDescriptionRef.current = description
      }
      toastTitleRef.current = title
      setToastOpen(true)
    }, 100)
  }

  return (
    <ToastContext.Provider value={{ sendToast }}>
      <Toast.Provider swipeDirection='right'>
        {children}
        <Toast.Root className='ToastRoot' open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Title className={`ToastTitle ${error ? "error" : ""}`}>
            <>
              {error && <MdError />}
              {toastTitleRef.current}
            </>
          </Toast.Title>
          {toastDescriptionRef.current && (
            <Toast.Description asChild className={`ToastDescription ${error ? "error" : ""}`}>
              <p>{toastDescriptionRef.current}</p>
            </Toast.Description>
          )}
        </Toast.Root>
        <Toast.Viewport className='ToastViewport' />
      </Toast.Provider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export default ToastProvider
