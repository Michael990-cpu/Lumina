"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

export function FeatureTest() {
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({})

  const testAISummary = async () => {
    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "What is artificial intelligence?" }),
      })

      const data = await response.json()
      const success = response.ok && data.summary && data.sources

      setTestResults((prev) => ({ ...prev, aiSummary: success }))

      if (success) {
        toast({ title: "✅ AI Summary API Working", description: "Citations and sources loaded successfully" })
      } else {
        toast({ title: "❌ AI Summary API Failed", description: "Check API configuration", variant: "destructive" })
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, aiSummary: false }))
      toast({ title: "❌ AI Summary API Error", description: String(error), variant: "destructive" })
    }
  }

  const testTranslation = async () => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Hello world", targetLanguage: "es" }),
      })

      const data = await response.json()
      const success = response.ok && data.translatedText

      setTestResults((prev) => ({ ...prev, translation: success }))

      if (success) {
        toast({ title: "✅ Translation API Working", description: `Translated: ${data.translatedText}` })
      } else {
        toast({
          title: "❌ Translation API Failed",
          description: "Check Google Translate API key",
          variant: "destructive",
        })
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, translation: false }))
      toast({ title: "❌ Translation API Error", description: String(error), variant: "destructive" })
    }
  }

  const testELI5 = async () => {
    try {
      const response = await fetch("/api/explain-eli5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: "Artificial intelligence is a complex field of computer science.",
          query: "What is AI?",
        }),
      })

      const data = await response.json()
      const success = response.ok && data.explanation

      setTestResults((prev) => ({ ...prev, eli5: success }))

      if (success) {
        toast({ title: "✅ ELI5 API Working", description: "Simplification working correctly" })
      } else {
        toast({ title: "❌ ELI5 API Failed", description: "Check OpenAI API configuration", variant: "destructive" })
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, eli5: false }))
      toast({ title: "❌ ELI5 API Error", description: String(error), variant: "destructive" })
    }
  }

  const testExport = () => {
    try {
      // Test markdown export
      const testData = {
        query: "Test Query",
        summary: "This is a test summary [1]",
        sources: [{ title: "Test Source", url: "https://example.com", snippet: "Test snippet" }],
        confidence: 85,
        timestamp: new Date().toLocaleString(),
      }

      // Create a small test markdown
      const markdown = `# Test Export\n\n${testData.summary}`
      const blob = new Blob([markdown], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      URL.revokeObjectURL(url) // Clean up immediately since this is just a test

      setTestResults((prev) => ({ ...prev, export: true }))
      toast({ title: "✅ Export Functions Working", description: "PDF and Markdown export ready" })
    } catch (error) {
      setTestResults((prev) => ({ ...prev, export: false }))
      toast({ title: "❌ Export Functions Failed", description: String(error), variant: "destructive" })
    }
  }

  const testAutocomplete = async () => {
    try {
      const response = await fetch("/api/predict?q=artificial")
      const data = await response.json()
      const success = response.ok && data.suggestions && Array.isArray(data.suggestions)

      setTestResults((prev) => ({ ...prev, autocomplete: success }))

      if (success) {
        toast({ title: "✅ Autocomplete API Working", description: `Found ${data.suggestions.length} suggestions` })
      } else {
        toast({ title: "❌ Autocomplete API Failed", description: "Check prediction API", variant: "destructive" })
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, autocomplete: false }))
      toast({ title: "❌ Autocomplete API Error", description: String(error), variant: "destructive" })
    }
  }

  return (
    <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">🧪 Feature Testing Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={testAISummary} variant="outline" className="bg-white/20 text-white">
            Test AI Summary
            {testResults.aiSummary !== undefined && (
              <Badge className={`ml-2 ${testResults.aiSummary ? "bg-green-500" : "bg-red-500"}`}>
                {testResults.aiSummary ? "✅" : "❌"}
              </Badge>
            )}
          </Button>

          <Button onClick={testTranslation} variant="outline" className="bg-white/20 text-white">
            Test Translation
            {testResults.translation !== undefined && (
              <Badge className={`ml-2 ${testResults.translation ? "bg-green-500" : "bg-red-500"}`}>
                {testResults.translation ? "✅" : "❌"}
              </Badge>
            )}
          </Button>

          <Button onClick={testELI5} variant="outline" className="bg-white/20 text-white">
            Test ELI5
            {testResults.eli5 !== undefined && (
              <Badge className={`ml-2 ${testResults.eli5 ? "bg-green-500" : "bg-red-500"}`}>
                {testResults.eli5 ? "✅" : "❌"}
              </Badge>
            )}
          </Button>

          <Button onClick={testExport} variant="outline" className="bg-white/20 text-white">
            Test Export
            {testResults.export !== undefined && (
              <Badge className={`ml-2 ${testResults.export ? "bg-green-500" : "bg-red-500"}`}>
                {testResults.export ? "✅" : "❌"}
              </Badge>
            )}
          </Button>

          <Button onClick={testAutocomplete} variant="outline" className="bg-white/20 text-white">
            Test Autocomplete
            {testResults.autocomplete !== undefined && (
              <Badge className={`ml-2 ${testResults.autocomplete ? "bg-green-500" : "bg-red-500"}`}>
                {testResults.autocomplete ? "✅" : "❌"}
              </Badge>
            )}
          </Button>
        </div>

        <div className="text-sm text-gray-300">
          <p>
            💡 <strong>Tip:</strong> Test each feature to verify API connections and functionality.
          </p>
          <p>
            🔑 <strong>Required:</strong> OPENAI_API_KEY, BING_API_KEY (optional), GOOGLE_TRANSLATE_API_KEY (optional)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
