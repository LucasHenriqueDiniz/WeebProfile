import type { ServerResponse } from "node:http"
import { AppError } from "../../core/errors/AppError"
import { LoggerFactory } from "../logging/LoggerFactory"

export class ErrorHandler {
  private logger = LoggerFactory.getLogger("ErrorHandler")

  handle(error: Error, res: ServerResponse): void {
    let statusCode = 500
    let response: Record<string, unknown> = {
      error: "Internal Server Error",
      code: "INTERNAL_ERROR",
      timestamp: new Date().toISOString(),
    }

    if (error instanceof AppError) {
      statusCode = error.statusCode
      response = {
        error: error.message,
        code: error.code,
        timestamp: error.timestamp,
        ...(error.context && { context: error.context }),
      }

      // Log detalhado para erros operacionais
      if (error.isOperational) {
        this.logger.warn("Operational error", {
          code: error.code,
          message: error.message,
          context: error.context,
          statusCode: error.statusCode,
        })
      } else {
        // Log como erro para problemas inesperados
        this.logger.error("Unexpected application error", error, {
          code: error.code,
          context: error.context,
        })
      }
    } else {
      // Erro não tratado - log completo
      this.logger.error("Unhandled error", error)

      // Em desenvolvimento, incluir stack trace
      if (process.env.NODE_ENV === "development") {
        response.stack = error.stack
        response.details = {
          name: error.name,
          message: error.message,
        }
      }
    }

    res.writeHead(statusCode, { "Content-Type": "application/json" })
    res.end(JSON.stringify(response))
  }

  // Middleware para Express (se migrar para Express)
  middleware() {
    return (error: Error, _req: unknown, res: unknown, _next: unknown) => {
      this.handle(error, res as ServerResponse)
    }
  }

  // Método para criar respostas de erro consistentes
  static createErrorResponse(error: AppError | Error): Record<string, unknown> {
    if (error instanceof AppError) {
      return {
        error: error.message,
        code: error.code,
        timestamp: error.timestamp,
        ...(error.context && { context: error.context }),
      }
    }

    return {
      error: "Internal Server Error",
      code: "INTERNAL_ERROR",
      timestamp: new Date().toISOString(),
    }
  }

  // Método para log de erros
  logError(error: Error, context?: Record<string, unknown>): void {
    if (error instanceof AppError) {
      if (error.isOperational) {
        this.logger.warn("Operational error", {
          code: error.code,
          message: error.message,
          context: error.context,
          statusCode: error.statusCode,
          ...context,
        })
      } else {
        this.logger.error("Unexpected application error", error, {
          code: error.code,
          context: error.context,
          ...context,
        })
      }
    } else {
      this.logger.error("Unhandled error", error, context)
    }
  }
}
