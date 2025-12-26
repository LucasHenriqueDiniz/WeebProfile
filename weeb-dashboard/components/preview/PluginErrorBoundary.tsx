"use client"

import React, { Component, ReactNode } from "react"

interface PluginErrorBoundaryProps {
  pluginName: string
  children: ReactNode
}

interface PluginErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary for individual plugin rendering
 * 
 * If a plugin fails to render, this boundary catches the error
 * and displays a fallback UI instead of crashing the entire preview.
 */
export class PluginErrorBoundary extends Component<PluginErrorBoundaryProps, PluginErrorBoundaryState> {
  constructor(props: PluginErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): PluginErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Plugin ${this.props.pluginName} failed to render:`, error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Plugin {this.props.pluginName} falhou ao renderizar
              </h3>
              {this.state.error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {this.state.error.message || "Erro desconhecido"}
                </p>
              )}
              <button
                onClick={this.handleRetry}
                className="mt-2 text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
