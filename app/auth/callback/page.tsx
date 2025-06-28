"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/?error=auth_failed")
          return
        }

        if (data.session) {
          // Create or update user profile
          const user = data.session.user
          const { error: profileError } = await supabase.from("user_profiles").upsert([
            {
              id: user.id,
              name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
              avatar_url: user.user_metadata?.avatar_url,
              search_history: [],
              saved_searches: [],
              preferences: {
                language: "en",
                theme: "dark",
                resultsPerPage: 10,
              },
              subscription: "free",
            },
          ])

          if (profileError) {
            console.error("Profile creation error:", profileError)
          }

          router.push("/?auth=success")
        } else {
          router.push("/?error=no_session")
        }
      } catch (error) {
        console.error("Callback handling error:", error)
        router.push("/?error=callback_failed")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
            <h2 className="text-xl font-semibold text-white">Completing Sign In...</h2>
            <p className="text-gray-300">Please wait while we set up your account.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
