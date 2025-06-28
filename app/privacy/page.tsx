import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Shield className="h-8 w-8" />
                </div>
                Privacy Policy
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Your privacy is our priority. Learn how we protect and handle your data.
              </p>
              <Badge variant="outline" className="w-fit mt-2 bg-green-100 text-green-800 border-green-200">
                Last updated: {new Date().toLocaleDateString()}
              </Badge>
            </CardHeader>
          </Card>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-white">
              <div className="prose prose-lg max-w-none text-white">
                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                <p className="text-gray-300 mb-4">
                  Lumina AI Search Engine is designed with privacy in mind. We collect minimal information necessary to
                  provide you with the best search experience:
                </p>

                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Data We Collect:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Search Queries:</strong> To provide relevant results and improve our service
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Usage Analytics:</strong> Anonymized data to understand how our service is used
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Account Information:</strong> Email and name if you choose to create an account
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Preferences:</strong> Language settings and search preferences
                      </span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Provide search results and AI-powered summaries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Translate content using LibreTranslate (free, open-source service)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Save your search history and preferences locally in your browser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Improve our algorithms and user experience</span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">Data Storage & Security</h2>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 mb-6 border border-green-400/30">
                  <h3 className="text-xl font-semibold text-white mb-3">🔒 Your Privacy is Our Priority</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Local Storage:</strong> Search history is stored locally in your browser, not on our
                        servers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>HTTPS Encryption:</strong> All communications are encrypted using industry-standard
                        protocols
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>No Data Sales:</strong> We never sell your personal data to third parties
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Data Control:</strong> You can delete your data at any time
                      </span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
                <p className="text-gray-300 mb-4">
                  We integrate with these services to enhance functionality. Each service has its own privacy policy:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🤖 OpenAI API</h4>
                    <p className="text-gray-300 text-sm">For AI-powered summaries (optional, requires API key)</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🔍 Bing Search API</h4>
                    <p className="text-gray-300 text-sm">For web search results (optional, requires API key)</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🌍 LibreTranslate</h4>
                    <p className="text-gray-300 text-sm">Free, open-source translation service</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🗣️ Google Translate</h4>
                    <p className="text-gray-300 text-sm">Enhanced translation (optional, requires API key)</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <p className="text-gray-300 mb-4">Under data protection laws, you have the following rights:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">📋 Access Rights</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• View your personal data</li>
                        <li>• Export your search history</li>
                        <li>• Request data portability</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">🛠️ Control Rights</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Correct inaccurate information</li>
                        <li>• Delete your account and data</li>
                        <li>• Opt-out of analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">Cookies & Local Storage</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <p className="text-gray-300 mb-4">We use minimal cookies and local storage for:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Essential Functions:</strong> Saving your language preferences and search history
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>User Experience:</strong> Remembering your settings between visits
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>No Tracking:</strong> We don't use tracking cookies or analytics cookies
                      </span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-400/30">
                  <p className="text-gray-300 mb-4">
                    If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">privacy@lumina-ai.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">San Francisco, CA</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>Changes to This Policy:</strong> We may update this Privacy Policy from time to time. We
                    will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last
                    updated" date.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <Link href="/terms">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Terms of Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
