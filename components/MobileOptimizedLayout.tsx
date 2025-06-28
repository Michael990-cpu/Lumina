"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Search,
  History,
  Settings,
  User,
  Languages,
  Moon,
  Sun,
  Mic,
  Camera,
  Filter,
  SortAsc,
} from "lucide-react"

interface MobileOptimizedLayoutProps {
  children: React.ReactNode
  onVoiceSearch?: () => void
  onImageSearch?: () => void
  onHistoryOpen?: () => void
  onSettingsOpen?: () => void
  isListening?: boolean
  currentUser?: any
  selectedLanguage?: string
  onLanguageChange?: (lang: string) => void
}

export function MobileOptimizedLayout({
  children,
  onVoiceSearch,
  onImageSearch,
  onHistoryOpen,
  onSettingsOpen,
  isListening,
  currentUser,
  selectedLanguage,
  onLanguageChange,
}: MobileOptimizedLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Lumina</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoiceSearch}
              className={`text-white hover:bg-white/20 ${isListening ? "bg-red-500 animate-pulse" : ""}`}
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={onImageSearch} className="text-white hover:bg-white/20">
              <Camera className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* User Section */}
                {currentUser ? (
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{currentUser.name}</div>
                          <div className="text-sm text-gray-600">{currentUser.email}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button className="w-full justify-start" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onHistoryOpen?.()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Search History
                  </Button>

                  <Button variant="ghost" className="w-full justify-start" onClick={toggleDarkMode}>
                    {isDarkMode ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        Dark Mode
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onSettingsOpen?.()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>

                {/* Language Selector */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Languages className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Language</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "es", name: "Español", flag: "🇪🇸" },
                      { code: "fr", name: "Français", flag: "🇫🇷" },
                      { code: "de", name: "Deutsch", flag: "🇩🇪" },
                      { code: "ar", name: "العربية", flag: "🇸🇦" },
                      { code: "zh", name: "中文", flag: "🇨🇳" },
                    ].map((lang) => (
                      <Button
                        key={lang.code}
                        variant={selectedLanguage === lang.code ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          onLanguageChange?.(lang.code)
                          setIsMobileMenuOpen(false)
                        }}
                        className="justify-start text-xs"
                      >
                        <span className="mr-1">{lang.flag}</span>
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* App Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Free to Use
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Privacy First
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">AI-powered search with free translation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-20">{children}</div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="flex items-center justify-around p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onHistoryOpen}
            className="flex flex-col items-center gap-1 text-white hover:bg-white/20"
          >
            <History className="h-5 w-5" />
            <span className="text-xs">History</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/20">
            <Filter className="h-5 w-5" />
            <span className="text-xs">Filter</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/20">
            <SortAsc className="h-5 w-5" />
            <span className="text-xs">Sort</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsOpen}
            className="flex flex-col items-center gap-1 text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
