import { translateTextClient } from "./clientTranslate"

interface SearchResult {
  title: string
  url: string
  snippet: string
  displayUrl?: string
}

interface TranslationResult {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  success?: boolean
}

export async function translateText(text: string, targetLanguage: string, sourceLanguage = "en"): Promise<string> {
  if (targetLanguage === sourceLanguage) return text

  try {
    // First try server-side translation
    const response = await fetch("/api/libre-translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage,
      }),
    })

    if (response.ok) {
      const data: TranslationResult = await response.json()
      if (data.success && data.translatedText) {
        return data.translatedText
      }
    }

    // Fallback to client-side translation
    console.log("Falling back to client-side translation")
    return await translateTextClient(text, targetLanguage)
  } catch (error) {
    console.error("Translation error:", error)

    // Final fallback to client-side
    try {
      return await translateTextClient(text, targetLanguage)
    } catch (clientError) {
      console.error("Client translation error:", clientError)
      return text // Return original text if all fails
    }
  }
}

export async function translateSearchResults(
  results: SearchResult[],
  targetLanguage: string,
  sourceLanguage = "en",
  onProgress?: (progress: number) => void,
): Promise<SearchResult[]> {
  if (targetLanguage === sourceLanguage) {
    return results
  }

  const translatedResults: SearchResult[] = []

  for (let i = 0; i < results.length; i++) {
    const result = results[i]

    try {
      // Translate title and snippet with retry logic
      const [translatedTitle, translatedSnippet] = await Promise.all([
        translateWithRetry(result.title, targetLanguage, sourceLanguage),
        translateWithRetry(result.snippet, targetLanguage, sourceLanguage),
      ])

      translatedResults.push({
        ...result,
        title: translatedTitle,
        snippet: translatedSnippet,
      })

      // Report progress
      if (onProgress) {
        onProgress(((i + 1) / results.length) * 100)
      }
    } catch (error) {
      console.error(`Failed to translate result ${i}:`, error)
      // Keep original result on translation failure
      translatedResults.push(result)
    }

    // Small delay to avoid overwhelming the API
    if (i < results.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  return translatedResults
}

async function translateWithRetry(
  text: string,
  targetLanguage: string,
  sourceLanguage = "en",
  maxRetries = 2,
): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await translateText(text, targetLanguage, sourceLanguage)
      if (result && result !== text) {
        return result
      }
    } catch (error) {
      lastError = error as Error
      if (attempt < maxRetries) {
        // Wait longer between retries
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  console.error(`Translation failed after ${maxRetries + 1} attempts:`, lastError)
  return text // Return original text if all retries fail
}

export async function translateSummary(
  summary: string,
  targetLanguage: string,
  sourceLanguage = "en",
): Promise<string> {
  if (targetLanguage === sourceLanguage) {
    return summary
  }

  try {
    // Split summary into smaller chunks to improve translation quality
    const sentences = summary.split(/(?<=[.!?])\s+/)
    const translatedSentences: string[] = []

    for (const sentence of sentences) {
      if (sentence.trim()) {
        const translated = await translateWithRetry(sentence.trim(), targetLanguage, sourceLanguage)
        translatedSentences.push(translated)

        // Small delay between sentences
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    return translatedSentences.join(" ")
  } catch (error) {
    console.error("Summary translation error:", error)
    return summary
  }
}

// Utility to get language name
export function getLanguageName(code: string): string {
  const languageNames: { [key: string]: string } = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    ar: "Arabic",
    zh: "Chinese",
    yo: "Yoruba",
  }

  return languageNames[code] || code.toUpperCase()
}

// Utility to detect if text needs translation
export function needsTranslation(targetLanguage: string, sourceLanguage = "en"): boolean {
  return targetLanguage !== sourceLanguage
}

// Alternative translation service URLs (for future use)
export const TRANSLATION_SERVICES = {
  libretranslate: "https://libretranslate.de/translate",
  mymemory: "https://api.mymemory.translated.net/get",
  // Add more services as needed
}
