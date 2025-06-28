"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"

interface VoiceSearchFeedbackProps {
  isListening: boolean
  onToggleListening: () => void
  transcript?: string
  confidence?: number
}

export function VoiceSearchFeedback({
  isListening,
  onToggleListening,
  transcript = "",
  confidence = 0,
}: VoiceSearchFeedbackProps) {
  const [audioLevel, setAudioLevel] = useState(0)
  const [waveformData, setWaveformData] = useState<number[]>(new Array(20).fill(0))
  const animationRef = useRef<number>()

  // Simulate audio level and waveform when listening
  useEffect(() => {
    if (isListening) {
      const animate = () => {
        // Simulate audio input with random values
        const newLevel = Math.random() * 100
        setAudioLevel(newLevel)

        // Update waveform data
        setWaveformData((prev) => {
          const newData = [...prev.slice(1), newLevel]
          return newData
        })

        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setAudioLevel(0)
      setWaveformData(new Array(20).fill(0))
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isListening])

  if (!isListening && !transcript) return null

  return (
    <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Microphone Icon with Pulse */}
          <div className="relative inline-block">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/50" : "bg-green-500"
              }`}
            >
              {isListening ? <Mic className="h-8 w-8 text-white" /> : <Volume2 className="h-8 w-8 text-white" />}
            </div>

            {/* Ripple Effect */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
                <div
                  className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-10"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </>
            )}
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {isListening ? "Listening..." : "Voice Input Complete"}
            </h3>
            <p className="text-gray-300 text-sm">
              {isListening ? "Speak clearly into your microphone" : "Processing your voice input"}
            </p>
          </div>

          {/* Waveform Visualization */}
          <div className="flex items-center justify-center space-x-1 h-16">
            {waveformData.map((level, index) => (
              <div
                key={index}
                className={`w-2 bg-gradient-to-t transition-all duration-150 rounded-full ${
                  isListening ? "from-cyan-400 to-purple-400" : "from-gray-400 to-gray-600"
                }`}
                style={{
                  height: `${Math.max(4, (level / 100) * 48)}px`,
                  opacity: isListening ? 0.7 + (level / 100) * 0.3 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Audio Level Indicator */}
          {isListening && (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-400">Audio Level:</span>
                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-red-400 transition-all duration-150 rounded-full"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Transcript:</span>
                {confidence > 0 && (
                  <span className="text-xs text-gray-300">{Math.round(confidence * 100)}% confidence</span>
                )}
              </div>
              <p className="text-white text-left">"{transcript}"</p>
            </div>
          )}

          {/* Control Button */}
          <Button
            onClick={onToggleListening}
            variant={isListening ? "destructive" : "default"}
            className={`transition-all duration-300 ${
              isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>

          {/* Tips */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>💡 Tip: Speak clearly and avoid background noise</p>
            <p>🎤 Supported: Questions, commands, and search queries</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
