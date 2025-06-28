// Client-side translation utility as backup
export async function translateTextClient(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === "en") return text

  try {
    // Try direct API call from client
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLanguage,
        format: "text",
      }),
    })

    if (!response.ok) {
      throw new Error(`Client translation failed: ${response.status}`)
    }

    const data = await response.json()
    return data.translatedText || text
  } catch (error) {
    console.error("Client translation error:", error)

    // Fallback to simple replacements
    return getSimpleTranslation(text, targetLanguage)
  }
}

function getSimpleTranslation(text: string, targetLang: string): string {
  const commonPhrases: { [key: string]: { [key: string]: string } } = {
    fr: {
      "What is": "Qu'est-ce que",
      "How does": "Comment",
      "artificial intelligence": "intelligence artificielle",
      "machine learning": "apprentissage automatique",
      "quantum computing": "informatique quantique",
      "climate change": "changement climatique",
      "renewable energy": "énergie renouvelable",
      research: "recherche",
      technology: "technologie",
      computer: "ordinateur",
      science: "science",
      study: "étude",
      analysis: "analyse",
      development: "développement",
      system: "système",
      process: "processus",
      method: "méthode",
    },
    es: {
      "What is": "Qué es",
      "How does": "Cómo",
      "artificial intelligence": "inteligencia artificial",
      "machine learning": "aprendizaje automático",
      "quantum computing": "computación cuántica",
      "climate change": "cambio climático",
      "renewable energy": "energía renovable",
      research: "investigación",
      technology: "tecnología",
      computer: "computadora",
      science: "ciencia",
      study: "estudio",
      analysis: "análisis",
      development: "desarrollo",
      system: "sistema",
      process: "proceso",
      method: "método",
    },
    de: {
      "What is": "Was ist",
      "How does": "Wie",
      "artificial intelligence": "künstliche Intelligenz",
      "machine learning": "maschinelles Lernen",
      "quantum computing": "Quantencomputing",
      "climate change": "Klimawandel",
      "renewable energy": "erneuerbare Energie",
      research: "Forschung",
      technology: "Technologie",
      computer: "Computer",
      science: "Wissenschaft",
      study: "Studie",
      analysis: "Analyse",
      development: "Entwicklung",
      system: "System",
      process: "Prozess",
      method: "Methode",
    },
  }

  const translations = commonPhrases[targetLang]
  if (!translations) {
    return `[${targetLang.toUpperCase()}] ${text}`
  }

  let translated = text
  for (const [english, target] of Object.entries(translations)) {
    const regex = new RegExp(`\\b${english}\\b`, "gi")
    translated = translated.replace(regex, target)
  }

  return translated
}
