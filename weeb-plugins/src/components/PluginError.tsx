import React from "react"
import { RenderBasedOnStyle } from "../templates/RenderBasedOnStyle"

export type ErrorType = 'config' | 'api' | 'auth' | 'network' | 'server' | 'rate_limit' | 'data' | 'unknown'

interface PluginErrorProps {
  pluginName: string
  error: Error | string
  errorType?: ErrorType
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
  showIcon?: boolean
  compact?: boolean
}

export function PluginError({
  pluginName,
  error,
  errorType = 'unknown',
  style = 'default',
  size = 'half',
  showIcon = true,
  compact = false
}: PluginErrorProps): React.ReactElement {

  const errorMessage = typeof error === "string" ? error : error.message
  const errorName = typeof error === "string" ? "Error" : error.name

  // Detectar tipo de erro baseado na mensagem se não foi especificado
  const detectedErrorType = errorType !== 'unknown' ? errorType : detectErrorType(errorMessage)

  function detectErrorType(message: string): ErrorType {
    const msg = message.toLowerCase()
    if (msg.includes('api key') || msg.includes('apikey') || msg.includes('username') || msg.includes('token') || msg.includes('config')) {
      return 'config'
    }
    if (msg.includes('unauthorized') || msg.includes('forbidden') || msg.includes('invalid credentials') || msg.includes('auth')) {
      return 'auth'
    }
    if (msg.includes('network') || msg.includes('timeout') || msg.includes('connection') || msg.includes('fetch')) {
      return 'network'
    }
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
      return 'rate_limit'
    }
    if (msg.includes('server') || msg.includes('500') || msg.includes('503') || msg.includes('502')) {
      return 'server'
    }
    if (msg.includes('api') && (msg.includes('error') || msg.includes('failed') || msg.includes('invalid'))) {
      return 'api'
    }
    if (msg.includes('no data') || msg.includes('empty') || msg.includes('not found')) {
      return 'data'
    }
    return 'unknown'
  }

  const getErrorDetails = () => {
    switch (detectedErrorType) {
      case 'config':
        return {
          title: 'Configuration Required',
          message: 'Missing or invalid configuration settings',
          suggestion: 'Please check your plugin settings and add the required API keys or credentials',
          icon: '🔧',
          color: 'orange'
        }
      case 'auth':
        return {
          title: 'Authentication Failed',
          message: 'Invalid or expired credentials',
          suggestion: 'Please verify your API keys and try again',
          icon: '🔐',
          color: 'red'
        }
      case 'network':
        return {
          title: 'Network Error',
          message: 'Unable to connect to the service',
          suggestion: 'Check your internet connection and try again later',
          icon: '🌐',
          color: 'blue'
        }
      case 'rate_limit':
        return {
          title: 'Rate Limit Exceeded',
          message: 'Too many requests to the service',
          suggestion: 'Please wait a few minutes before trying again',
          icon: '⏱️',
          color: 'yellow'
        }
      case 'server':
        return {
          title: 'Server Error',
          message: 'The external service is experiencing issues',
          suggestion: 'The service may be temporarily unavailable, try again later',
          icon: '🖥️',
          color: 'red'
        }
      case 'api':
        return {
          title: 'API Error',
          message: 'External service returned an error',
          suggestion: 'Check the service status or try again later',
          icon: '🔌',
          color: 'orange'
        }
      case 'data':
        return {
          title: 'No Data Available',
          message: 'No data found for this request',
          suggestion: 'Try different settings or check if your account has content',
          icon: '📭',
          color: 'gray'
        }
      default:
        return {
          title: 'Plugin Error',
          message: errorMessage || 'An unexpected error occurred',
          suggestion: 'Please check plugin configuration and try again',
          icon: '❌',
          color: 'red'
        }
    }
  }

  const { title, message, suggestion, icon, color } = getErrorDetails()

  if (style === "terminal") {
    if (compact) {
      return (
        <div className="text-red-400 text-xs">
          <span className="font-bold">{icon} {pluginName}:</span> {message}
        </div>
      )
    }

    return (
      <div className="terminal-error border-red-500 bg-red-950/20 p-3 rounded">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-400">{icon}</span>
          <span className="text-red-300 font-bold uppercase text-sm">{title}</span>
        </div>
        <div className="text-red-200 text-sm mb-1">
          <strong>Plugin:</strong> {pluginName}
        </div>
        <div className="text-red-300 text-sm mb-2">{message}</div>
        <div className="text-red-400 text-xs">
          💡 {suggestion}
        </div>
      </div>
    )
  }

  // Default style
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
        {showIcon && <span>{icon}</span>}
        <div>
          <div className="font-medium text-red-800">{pluginName}: {title}</div>
          <div className="text-red-600 text-xs">{message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full flex items-center justify-center py-2 p-4 border rounded-lg ${
      color === 'red' ? 'border-red-200 bg-red-50' :
      color === 'orange' ? 'border-orange-200 bg-orange-50' :
      color === 'blue' ? 'border-blue-200 bg-blue-50' :
      color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
      'border-gray-200 bg-gray-50'
    }`}>
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          {showIcon && <span className="text-2xl">{icon}</span>}
          <div className={`text-sm font-bold uppercase tracking-wide ${
            color === 'red' ? 'text-red-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'blue' ? 'text-blue-600' :
            color === 'yellow' ? 'text-yellow-600' :
            'text-gray-600'
          }`}>
            {title}
          </div>
        </div>
        <div className={`text-sm font-medium mb-1 ${
          color === 'red' ? 'text-red-800' :
          color === 'orange' ? 'text-orange-800' :
          color === 'blue' ? 'text-orange-800' :
          color === 'yellow' ? 'text-yellow-800' :
          'text-gray-800'
        }`}>
          {pluginName}
        </div>
        <div className={`text-sm mb-2 ${
          color === 'red' ? 'text-red-700' :
          color === 'orange' ? 'text-orange-700' :
          color === 'blue' ? 'text-blue-700' :
          color === 'yellow' ? 'text-yellow-700' :
          'text-gray-700'
        }`}>
          {message}
        </div>
        <div className={`text-xs ${
          color === 'red' ? 'text-red-600' :
          color === 'orange' ? 'text-orange-600' :
          color === 'blue' ? 'text-blue-600' :
          color === 'yellow' ? 'text-yellow-600' :
          'text-gray-600'
        }`}>
          💡 {suggestion}
        </div>
      </div>
    </div>
  )
}




