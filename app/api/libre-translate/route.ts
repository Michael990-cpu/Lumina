import { type NextRequest, NextResponse } from "next/server"

const LIBRETRANSLATE_URL = "https://libretranslate.de/translate/" // trailing slash avoids 301

interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

interface LibreTranslateResponse {
  translatedText: string
}

async function translateWithLibre(text: string, targetLang: string, sourceLang = "en"): Promise<string> {
  if (targetLang === sourceLang) return text

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3_000) // 3-s timeout

  /**
   * Makes one request and – if we hit an HTTP redirect –
   * follows it once by reading the Location header.
   */
  const doFetch = async (url: string): Promise<Response> => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "LuminaSearch/1.0",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
      redirect: "manual", // we handle 30x ourselves
      signal: controller.signal,
    })

    // LibreTranslate sometimes returns 301 / 307: follow once
    if ([301, 302, 307, 308].includes(res.status)) {
      const next = res.headers.get("location")
      if (!next) throw new Error(`Redirect with no Location header (status ${res.status})`)
      return fetch(next, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "LuminaSearch/1.0",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: "text",
        }),
        signal: controller.signal,
      })
    }
    return res
  }

  try {
    const response = await doFetch(LIBRETRANSLATE_URL)
    clearTimeout(timer)

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`LibreTranslate API error: ${response.status} – ${err}`)
    }

    const data = (await response.json()) as { translatedText?: string }
    if (!data.translatedText) throw new Error("Missing translatedText field")

    return data.translatedText
  } catch (err) {
    console.error("LibreTranslate error:", err)
    // graceful fallback
    const langTag = targetLang.toUpperCase()
    return `[${langTag}] ${text}`
  }
}

// Simple fallback translation for common terms
function getFallbackTranslation(text: string, targetLang: string): string {
  const translations: { [key: string]: { [key: string]: string } } = {
    fr: {
      "artificial intelligence": "intelligence artificielle",
      "machine learning": "apprentissage automatique",
      "quantum computing": "informatique quantique",
      "climate change": "changement climatique",
      "renewable energy": "énergie renouvelable",
      "What is": "Qu'est-ce que",
      "How does": "Comment",
      The: "Le",
      and: "et",
      or: "ou",
      but: "mais",
      with: "avec",
      for: "pour",
    },
    es: {
      "artificial intelligence": "inteligencia artificial",
      "machine learning": "aprendizaje automático",
      "quantum computing": "computación cuántica",
      "climate change": "cambio climático",
      "renewable energy": "energía renovable",
      "What is": "Qué es",
      "How does": "Cómo",
      The: "El",
      and: "y",
      or: "o",
      but: "pero",
      with: "con",
      for: "para",
    },
    de: {
      "artificial intelligence": "künstliche Intelligenz",
      "machine learning": "maschinelles Lernen",
      "quantum computing": "Quantencomputing",
      "climate change": "Klimawandel",
      "renewable energy": "erneuerbare Energie",
      "What is": "Was ist",
      "How does": "Wie",
      The: "Der",
      and: "und",
      or: "oder",
      but: "aber",
      with: "mit",
      for: "für",
    },
  }

  const langTranslations = translations[targetLang]
  if (!langTranslations) return text

  let translatedText = text
  for (const [english, translated] of Object.entries(langTranslations)) {
    const regex = new RegExp(`\\b${english}\\b`, "gi")
    translatedText = translatedText.replace(regex, translated)
  }

  return translatedText !== text ? translatedText : text
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = "en" }: TranslationRequest = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 })
    }

    // Handle empty or very short text
    if (text.trim().length < 2) {
      return NextResponse.json({
        translatedText: text,
        sourceLanguage,
        targetLanguage,
      })
    }

    const translatedText = await translateWithLibre(text, targetLanguage, sourceLanguage)

    return NextResponse.json({
      translatedText,
      sourceLanguage,
      targetLanguage,
      success: true,
    })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      {
        error: "Failed to translate text",
        translatedText: `[Translation Error] ${(await request.json()).text}`,
        success: false,
      },
      { status: 500 },
    )
  }
}
