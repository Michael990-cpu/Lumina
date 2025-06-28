import { type NextRequest, NextResponse } from "next/server"

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY

interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

async function translateText(text: string, targetLang: string, sourceLang = "auto"): Promise<string> {
  // If target language is English, return original text
  if (targetLang === "en") {
    return text
  }

  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.log("No Google Translate API key, using fallback")
    // Better fallback with language indicator
    const langNames: { [key: string]: string } = {
      es: "Spanish",
      fr: "French",
      de: "German",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      pt: "Portuguese",
      ru: "Russian",
      ar: "Arabic",
      hi: "Hindi",
      it: "Italian",
    }

    return `[Translated to ${langNames[targetLang] || targetLang.toUpperCase()}] ${text}`
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang,
          format: "text",
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Translation API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    if (!data.data?.translations?.[0]?.translatedText) {
      throw new Error("Invalid translation response")
    }

    return data.data.translations[0].translatedText
  } catch (error) {
    console.error("Translation error:", error)
    // Fallback with error indicator
    return `[Translation Error - ${targetLang.toUpperCase()}] ${text}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = "auto" }: TranslationRequest = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 })
    }

    const translatedText = await translateText(text, targetLanguage, sourceLanguage)

    return NextResponse.json({
      translatedText,
      sourceLanguage,
      targetLanguage,
    })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json({ error: "Failed to translate text" }, { status: 500 })
  }
}
