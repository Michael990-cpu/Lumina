"use client"
import { Languages, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", nativeName: "Português" },
  { code: "ru", name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "it", name: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
]

interface LanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
  isTranslating?: boolean
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, isTranslating }: LanguageSelectorProps) {
  const selectedLang = languages.find((lang) => lang.code === selectedLanguage) || languages[0]

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-48 bg-white/80 border-white/30">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedLang.flag}</span>
            <span className="font-medium">{selectedLang.nativeName}</span>
            {isTranslating && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-3 w-full">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
                {language.code === selectedLanguage && <Check className="h-4 w-4 text-green-600 ml-auto" />}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Badge variant="outline" className="bg-white/20 text-white border-white/30">
        <Languages className="h-3 w-3 mr-1" />
        Auto-translate
      </Badge>
    </div>
  )
}
