"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Languages, Globe, Loader2, CheckCircle, AlertCircle, ChevronDown } from "lucide-react"
import { Tooltip } from "./Tooltip"

interface LibreLanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
  isTranslating?: boolean
  onTranslateResults?: () => void
}

const LIBRE_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
]

export function LibreLanguageSelector({
  selectedLanguage,
  onLanguageChange,
  isTranslating = false,
  onTranslateResults,
}: LibreLanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const currentLanguage = LIBRE_LANGUAGES.find((lang) => lang.code === selectedLanguage) || LIBRE_LANGUAGES[0]
  const isRTL = ["ar", "he", "fa", "ur"].includes(selectedLanguage)

  const filteredLanguages = LIBRE_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode)
    setIsOpen(false)
    setSearchTerm("")
  }

  const popularLanguages = LIBRE_LANGUAGES.filter((lang) =>
    ["en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru"].includes(lang.code),
  )

  return (
    <div className="relative">
      <Tooltip content="Select language for translation">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="text-lg mr-2">{currentLanguage.flag}</span>
              <Languages className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{currentLanguage.name}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </>
          )}
        </Button>
      </Tooltip>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card
            className={`w-full max-w-md max-h-[80vh] overflow-hidden bg-white shadow-2xl ${isRTL ? "rtl" : "ltr"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className={`p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 ${isRTL ? "text-right" : "text-left"}`}
            >
              <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Select Language
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  ✕
                </Button>
              </div>

              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />

              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Free Translation
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  LibreTranslate
                </Badge>
              </div>
            </div>

            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {!searchTerm && (
                <div className="p-4 border-b bg-gray-50">
                  <h4 className={`text-sm font-medium text-gray-700 mb-3 ${isRTL ? "text-right" : "text-left"}`}>
                    Popular Languages
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {popularLanguages.map((language) => (
                      <Button
                        key={language.code}
                        variant={selectedLanguage === language.code ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleLanguageSelect(language.code)}
                        className={`justify-start h-auto p-2 ${
                          selectedLanguage === language.code ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        } ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                      >
                        <span className="text-lg mr-2">{language.flag}</span>
                        <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                          <span className="text-sm font-medium">{language.name}</span>
                          <span className="text-xs opacity-70">{language.nativeName}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-2">
                {filteredLanguages.length === 0 ? (
                  <div className={`text-center py-8 text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No languages found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredLanguages.map((language) => (
                      <Button
                        key={language.code}
                        variant={selectedLanguage === language.code ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleLanguageSelect(language.code)}
                        className={`w-full justify-start h-auto p-3 ${
                          selectedLanguage === language.code ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        } ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                      >
                        <span className="text-lg mr-3">{language.flag}</span>
                        <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                          <span className="font-medium">{language.name}</span>
                          <span className="text-sm opacity-70">{language.nativeName}</span>
                        </div>
                        {selectedLanguage === language.code && <CheckCircle className="h-4 w-4 ml-auto text-white" />}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>

            {onTranslateResults && selectedLanguage !== "en" && (
              <div className="p-4 border-t bg-gray-50">
                <Button
                  onClick={() => {
                    onTranslateResults()
                    setIsOpen(false)
                  }}
                  disabled={isTranslating}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4 mr-2" />
                      Translate Current Results
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
