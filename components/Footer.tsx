"use client"

import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, FileText, Mail, Github, Twitter, Globe, Heart, X } from "lucide-react"

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const PrivacyModal = () => (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          setShowPrivacy(false)
        }
      }}
    >
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white relative">
        {/* Prominent Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Policy
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivacy(false)}
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </div>
        </div>

        <CardContent className="space-y-4 text-sm p-6">
          <div>
            <h3 className="font-semibold mb-2">Information We Collect</h3>
            <p className="text-gray-600 mb-2">
              Lumina AI Search Engine collects minimal information to provide you with the best search experience:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Search queries to provide relevant results</li>
              <li>Usage analytics to improve our service (anonymized)</li>
              <li>Account information if you choose to sign up (email, name)</li>
              <li>Preferences and settings for personalization</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>To provide search results and AI-powered summaries</li>
              <li>To translate content using LibreTranslate (free service)</li>
              <li>To save your search history and preferences (locally stored)</li>
              <li>To improve our algorithms and user experience</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Data Storage & Security</h3>
            <p className="text-gray-600 mb-2">Your privacy is our priority:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Search history is stored locally in your browser</li>
              <li>We use HTTPS encryption for all communications</li>
              <li>No personal data is sold to third parties</li>
              <li>You can delete your data at any time</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Third-Party Services</h3>
            <p className="text-gray-600 mb-2">We integrate with these services to enhance functionality:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>OpenAI API for AI-powered summaries (optional)</li>
              <li>Bing Search API for web results (optional)</li>
              <li>LibreTranslate for free translation services</li>
              <li>Google Translate API for enhanced translation (optional)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Your Rights</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your search history</li>
              <li>Opt-out of analytics</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Contact Us:</strong> If you have questions about this Privacy Policy, please contact us at
              privacy@lumina-ai.com
            </p>
          </div>

          <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          {/* Bottom Close Button */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <Button onClick={() => setShowPrivacy(false)} className="bg-red-500 hover:bg-red-600 text-white">
              <X className="h-4 w-4 mr-2" />
              Close Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const TermsModal = () => (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          setShowTerms(false)
        }
      }}
    >
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white relative">
        {/* Prominent Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms of Service
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTerms(false)}
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </div>
        </div>

        <CardContent className="space-y-4 text-sm p-6">
          <div>
            <h3 className="font-semibold mb-2">Acceptance of Terms</h3>
            <p className="text-gray-600 mb-2">
              By accessing and using Lumina AI Search Engine, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Use License</h3>
            <p className="text-gray-600 mb-2">
              Permission is granted to temporarily use Lumina AI Search Engine for personal, non-commercial transitory
              viewing only. This includes the license to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Search for information using our AI-powered platform</li>
              <li>Use translation and summarization features</li>
              <li>Export search results for personal use</li>
              <li>Create an account to save preferences</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Prohibited Uses</h3>
            <p className="text-gray-600 mb-2">You may not:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use automated tools to scrape or harvest data</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Disclaimer</h3>
            <p className="text-gray-600 mb-2">
              The information provided by Lumina AI Search Engine is for general informational purposes only. While we
              strive for accuracy, we make no representations or warranties about the completeness, accuracy,
              reliability, or suitability of the information.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Limitations</h3>
            <p className="text-gray-600 mb-2">
              In no event shall Lumina AI Search Engine or its suppliers be liable for any damages arising out of the
              use or inability to use the service.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Changes to Terms:</strong> We reserve the right to revise these terms at any time. Continued use
              of the service constitutes acceptance of revised terms.
            </p>
          </div>

          <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          {/* Bottom Close Button */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <Button onClick={() => setShowTerms(false)} className="bg-red-500 hover:bg-red-600 text-white">
              <X className="h-4 w-4 mr-2" />
              Close Terms of Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <>
      <footer className="mt-16 bg-white/5 backdrop-blur-lg border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">Lumina</span>
              </div>
              <p className="text-gray-300 text-sm">
                AI-powered knowledge discovery with free multilingual translation. Search smarter, learn faster.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Free to Use
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Privacy First
                </Badge>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Features</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• AI-Powered Search</li>
                <li>• Free Translation</li>
                <li>• Voice Search</li>
                <li>• Image Analysis</li>
                <li>• ELI5 Explanations</li>
                <li>• Export Results</li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrivacy(true)}
                    className="text-gray-300 hover:text-white p-0 h-auto"
                  >
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTerms(true)}
                    className="text-gray-300 hover:text-white p-0 h-auto"
                  >
                    Terms of Service
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0 h-auto">
                    Cookie Policy
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0 h-auto">
                    GDPR Compliance
                  </Button>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Connect</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white justify-start p-0 h-auto">
                  <Mail className="h-4 w-4 mr-2" />
                  support@lumina-ai.com
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white justify-start p-0 h-auto">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white justify-start p-0 h-auto">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white justify-start p-0 h-auto">
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2024 Lumina AI Search Engine. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Powered by:</span>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                OpenAI
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                LibreTranslate
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                Vercel
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showPrivacy && <PrivacyModal />}
      {showTerms && <TermsModal />}
    </>
  )
}
