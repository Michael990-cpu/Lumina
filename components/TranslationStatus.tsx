"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Languages, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface TranslationStatusProps {
  isTranslating: boolean
  progress: number
  selectedLanguage: string
  hasTranslatedContent: boolean
  error?: string
}

export function TranslationStatus({
  isTranslating,
  progress,
  selectedLanguage,
  hasTranslatedContent,
  error,
}: TranslationStatusProps) {
  if (selectedLanguage === "en") {
    return null
  }

  if (error) {
    return (
      <Alert className="mb-4 bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Translation failed: {error}. Showing original content.
        </AlertDescription>
      </Alert>
    )
  }

  if (isTranslating) {
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertDescription className="text-blue-800 flex items-center gap-2">
          <span>Translating content...</span>
          <Progress value={progress} className="w-24 h-2" />
          <span className="text-sm">{Math.round(progress)}%</span>
        </AlertDescription>
      </Alert>
    )
  }

  if (hasTranslatedContent) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span>Content successfully translated</span>
          <Badge variant="outline" className="text-xs">
            LibreTranslate
          </Badge>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
