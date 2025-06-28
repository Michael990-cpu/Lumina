import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
            <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FileText className="h-8 w-8" />
                </div>
                Terms of Service
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Please read these terms carefully before using Lumina AI Search Engine.
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
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <p className="text-gray-300 mb-4">
                    By accessing and using Lumina AI Search Engine ("the Service"), you accept and agree to be bound by
                    the terms and provisions of this agreement.
                  </p>
                  <div className="flex items-start gap-2 text-green-300">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>
                      By using our service, you confirm that you are at least 13 years old and have the legal capacity
                      to enter into this agreement.
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <p className="text-gray-300 mb-4">Lumina AI Search Engine provides:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">🔍 Core Features</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• AI-powered web search</li>
                        <li>• Intelligent content summaries</li>
                        <li>• Multi-language translation</li>
                        <li>• Voice search capabilities</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">📊 Additional Tools</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Image analysis and search</li>
                        <li>• ELI5 explanations</li>
                        <li>• Export functionality</li>
                        <li>• Search history management</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">3. Use License</h2>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 mb-6 border border-green-400/30">
                  <h3 className="text-xl font-semibold text-white mb-3">✅ Permitted Uses</h3>
                  <p className="text-gray-300 mb-4">
                    Permission is granted to use Lumina AI Search Engine for personal, educational, and commercial
                    purposes, including:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                      <span>Search for information using our AI-powered platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                      <span>Use translation and summarization features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                      <span>Export search results for personal or business use</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                      <span>Create an account to save preferences and search history</span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Uses</h2>
                <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg p-6 mb-6 border border-red-400/30">
                  <h3 className="text-xl font-semibold text-white mb-3">❌ You May Not</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 mt-1 text-red-400 flex-shrink-0" />
                      <span>Use the service for any unlawful purpose or illegal activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 mt-1 text-red-400 flex-shrink-0" />
                      <span>Attempt to gain unauthorized access to our systems or user accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 mt-1 text-red-400 flex-shrink-0" />
                      <span>Interfere with or disrupt the service or servers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 mt-1 text-red-400 flex-shrink-0" />
                      <span>Use automated tools to scrape or harvest data excessively</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 mt-1 text-red-400 flex-shrink-0" />
                      <span>Violate any applicable laws, regulations, or third-party rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 mt-1 text-red-400 flex-shrink-0" />
                      <span>Transmit malware, viruses, or any malicious code</span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">5. User Accounts</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">👤 Account Responsibilities</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Provide accurate registration information</li>
                        <li>• Maintain the security of your password</li>
                        <li>• Notify us of unauthorized account use</li>
                        <li>• Accept responsibility for all account activity</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">🔒 Account Security</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Use strong, unique passwords</li>
                        <li>• Enable two-factor authentication when available</li>
                        <li>• Log out from shared devices</li>
                        <li>• Report security issues immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">6. Service Availability</h2>
                <div className="bg-yellow-500/20 rounded-lg p-6 mb-6 border border-yellow-400/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Service Limitations</h3>
                      <p className="text-gray-300 mb-4">
                        While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. The service may be
                        temporarily unavailable due to:
                      </p>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Scheduled maintenance and updates</li>
                        <li>• Technical difficulties or server issues</li>
                        <li>• Third-party service dependencies (OpenAI, Bing, etc.)</li>
                        <li>• Force majeure events beyond our control</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">🏢 Our Rights</h4>
                      <p className="text-gray-300 text-sm">
                        The Lumina AI Search Engine platform, including its design, functionality, and original content,
                        is owned by us and protected by intellectual property laws.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">👥 Your Rights</h4>
                      <p className="text-gray-300 text-sm">
                        You retain ownership of any content you input into our service. Search results and summaries
                        generated by our AI are provided for your use under this license.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">🔗 Third-Party Content</h4>
                      <p className="text-gray-300 text-sm">
                        Search results may include content from third-party sources. We do not claim ownership of this
                        content and respect the intellectual property rights of others.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer</h2>
                <div className="bg-gray-500/20 rounded-lg p-6 mb-6 border border-gray-400/30">
                  <p className="text-gray-300 mb-4">
                    <strong>IMPORTANT:</strong> The information provided by Lumina AI Search Engine is for general
                    informational purposes only.
                  </p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>
                      • We strive for accuracy but cannot guarantee the completeness or reliability of all information
                    </li>
                    <li>• AI-generated summaries may contain errors or biases</li>
                    <li>• Always verify important information from authoritative sources</li>
                    <li>• We are not responsible for decisions made based on our search results</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <p className="text-gray-300 mb-4">
                    In no event shall Lumina AI Search Engine or its suppliers be liable for any damages arising out of
                    the use or inability to use the service, including but not limited to:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Direct or indirect damages</li>
                      <li>• Loss of profits or data</li>
                      <li>• Business interruption</li>
                    </ul>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Personal injury or property damage</li>
                      <li>• Third-party claims</li>
                      <li>• Any other losses</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">🚪 Your Rights</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Stop using the service at any time</li>
                        <li>• Delete your account and data</li>
                        <li>• Export your search history</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">⚖️ Our Rights</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Suspend accounts for terms violations</li>
                        <li>• Terminate service with notice</li>
                        <li>• Modify or discontinue features</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
                <div className="bg-blue-500/20 rounded-lg p-6 mb-6 border border-blue-400/30">
                  <p className="text-gray-300 mb-4">
                    We reserve the right to revise these terms at any time. When we make changes:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                      <span>We will update the "Last updated" date at the top of this page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                      <span>Significant changes will be communicated via email or service notification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                      <span>Continued use of the service constitutes acceptance of revised terms</span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
                  <p className="text-gray-300 mb-4">
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">legal@lumina-ai.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">support@lumina-ai.com</span>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <p>
                        <strong>Business Hours:</strong>
                      </p>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                      <p>Response time: Within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <p className="text-green-800 text-sm">
                    <strong>Thank you for using Lumina AI Search Engine!</strong> By using our service, you help us
                    build a better, more intelligent search experience for everyone.
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
          <Link href="/privacy">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Privacy Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
