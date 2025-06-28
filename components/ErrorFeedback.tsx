"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Wifi, Key, RefreshCw, Info, CheckCircle } from "lucide-react"

interface ErrorFeedbackProps {
  type: "api-key" | "network" | "translation" | "search" | "general" | "success"
  message: string
  details?: string
  onRetry?: () => void
  showFallback?: boolean
}

export function ErrorFeedback({ type, message, details, onRetry, showFallback }: ErrorFeedbackProps) {
  const getIcon = () => {
    switch (type) {
      case "api-key":
        return <Key className="h-5 w-5" />
      case "network":
        return <Wifi className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "api-key":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-red-50 border-red-200 text-red-800"
    }
  }

  const getTitle = () => {
    switch (type) {
      case "api-key":
        return "API Configuration"
      case "network":
        return "Connection Issue"
      case "translation":
        return "Translation Notice"
      case "search":
        return "Search Issue"
      case "success":
        return "Success"
      default:
        return "Notice"
    }
  }

  return (
    <Alert className={`mb-4 ${getColor()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <div className="font-medium mb-1">{getTitle()}</div>
          <AlertDescription className="mb-2">{message}</AlertDescription>
          {details && <p className="text-sm opacity-80 mb-3">{details}</p>}

          <div className="flex items-center gap-2">
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry} className="h-8">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}

            {showFallback && (
              <Badge variant="outline" className="text-xs">
                <Info className="h-3 w-3 mr-1" />
                Using fallback
              </Badge>
            )}

            {type === "api-key" && (
              <Badge variant="outline" className="text-xs">
                <Key className="h-3 w-3 mr-1" />
                Limited functionality
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Alert>
  )
}
