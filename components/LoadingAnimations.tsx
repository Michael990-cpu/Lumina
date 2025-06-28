"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Globe, Languages, Search, Sparkles } from "lucide-react"

interface LoadingAnimationsProps {
  type: "search" | "translate" | "eli5" | "export"
  message?: string
  progress?: number
}

export function LoadingAnimations({ type, message, progress }: LoadingAnimationsProps) {
  const [dots, setDots] = useState("")
  const [currentStep, setCurrentStep] = useState(0)

  const steps = {
    search: [
      { icon: Search, text: "Analyzing your query", color: "text-blue-400" },
      { icon: Globe, text: "Searching the web", color: "text-green-400" },
      { icon: Brain, text: "Processing with AI", color: "text-purple-400" },
      { icon: Sparkles, text: "Generating insights", color: "text-yellow-400" },
    ],
    translate: [
      { icon: Languages, text: "Detecting language", color: "text-blue-400" },
      { icon: Globe, text: "Connecting to translator", color: "text-green-400" },
      { icon: Zap, text: "Translating content", color: "text-purple-400" },
    ],
    eli5: [
      { icon: Brain, text: "Understanding complexity", color: "text-blue-400" },
      { icon: Sparkles, text: "Simplifying language", color: "text-green-400" },
      { icon: Zap, text: "Making it fun", color: "text-yellow-400" },
    ],
    export: [
      { icon: Search, text: "Gathering content", color: "text-blue-400" },
      { icon: Zap, text: "Formatting document", color: "text-green-400" },
      { icon: Sparkles, text: "Finalizing export", color: "text-purple-400" },
    ],
  }

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Step progression
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps[type].length)
    }, 1500)
    return () => clearInterval(stepInterval)
  }, [type])

  const currentStepData = steps[type][currentStep]

  return (
    <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Main Loading Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              {/* Spinning outer ring */}
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>

              {/* Pulsing inner circle */}
              <div className="absolute inset-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse flex items-center justify-center">
                <currentStepData.icon className={`h-8 w-8 ${currentStepData.color}`} />
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              {currentStepData.text}
              {dots}
            </h3>
            {message && <p className="text-gray-300">{message}</p>}
          </div>

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full h-2" />
              <p className="text-sm text-gray-400">{Math.round(progress)}% complete</p>
            </div>
          )}

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {steps[type].map((step, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-cyan-400 scale-125" : index < currentStep ? "bg-green-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Fun Loading Messages */}
          <div className="text-sm text-gray-400 italic">
            {type === "search" && <p>🔍 Searching through millions of sources...</p>}
            {type === "translate" && <p>🌍 Breaking down language barriers...</p>}
            {type === "eli5" && <p>🧒 Making complex things simple...</p>}
            {type === "export" && <p>📄 Preparing your document...</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
