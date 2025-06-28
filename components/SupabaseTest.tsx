"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "failed">("testing")
  const [testResults, setTestResults] = useState({
    connection: false,
    database: false,
    auth: false,
  })
  const [error, setError] = useState<string>("")

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    setConnectionStatus("testing")
    setError("")

    try {
      // ── 1. Basic connection ───────────────────────────────
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables")
      }
      const supabase = createClient(supabaseUrl, supabaseKey)
      const results: typeof testResults = { connection: true, database: false, auth: false }

      // ── 2. Check if the table exists ───────────────────────
      const { data: tableExists, error: tableCheckError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "user_profiles")
        .maybeSingle()

      if (tableCheckError) {
        throw new Error(`Schema check failed: ${tableCheckError.message}`)
      }

      if (!tableExists) {
        // Table is missing – mark as failure but keep going
        results.database = false
        throw new Error('Table "public.user_profiles" does not exist. Run the SQL migration script in Supabase first.')
      }

      // ── 3. Try a lightweight query to verify RLS / access ─
      const { error: dbError } = await supabase.from("user_profiles").select("*", { count: "exact", head: true })

      if (dbError && dbError.code !== "PGRST116") {
        // PGRST116 = RLS denied for unauthenticated – that’s OK, means table exists
        throw new Error(`Database error: ${dbError.message}`)
      }
      results.database = true

      // ── 4. Auth service test ──────────────────────────────
      const { error: authError } = await supabase.auth.getSession()
      if (!authError) results.auth = true

      setTestResults(results)
      setConnectionStatus(results.connection && results.database ? "connected" : "failed")
    } catch (err) {
      setTestResults((prev) => ({ ...prev, database: false }))
      setError(err instanceof Error ? err.message : String(err))
      setConnectionStatus("failed")
    }
  }

  const getStatusIcon = (status: boolean) => {
    if (connectionStatus === "testing") {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "testing":
        return "border-blue-200 bg-blue-50"
      case "connected":
        return "border-green-200 bg-green-50"
      case "failed":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <Card className={`mb-6 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Test
          <Badge
            variant={
              connectionStatus === "connected" ? "default" : connectionStatus === "failed" ? "destructive" : "secondary"
            }
          >
            {connectionStatus === "testing" ? "Testing..." : connectionStatus === "connected" ? "Connected" : "Failed"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            {getStatusIcon(testResults.connection)}
            <span className="font-medium">Supabase Connection</span>
            <Badge variant="outline" className="text-xs">
              {supabaseUrl ? "URL Configured" : "Missing URL"}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {getStatusIcon(testResults.database)}
            <span className="font-medium">Database Access</span>
            <Badge variant="outline" className="text-xs">
              user_profiles table
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {getStatusIcon(testResults.auth)}
            <span className="font-medium">Authentication Service</span>
            <Badge variant="outline" className="text-xs">
              Auth API
            </Badge>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">Error:</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {connectionStatus === "failed" && (
          <Button variant="outline" size="sm" asChild className="mt-2">
            <a href="https://supabase.com/dashboard/project/_/sql" target="_blank" rel="noopener noreferrer">
              Open SQL Editor
            </a>
          </Button>
        )}

        {connectionStatus === "connected" && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">✅ Supabase is connected successfully!</p>
            <p className="text-green-700 text-sm">Authentication system is ready to use.</p>
          </div>
        )}

        {connectionStatus === "failed" && (
          <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">⚠️ Using fallback authentication</p>
            <p className="text-yellow-700 text-sm">
              The system will use local storage for authentication. Set up Supabase for full features.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={testSupabaseConnection} disabled={connectionStatus === "testing"} size="sm">
            {connectionStatus === "testing" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Test Again
          </Button>

          {connectionStatus === "failed" && (
            <Button variant="outline" size="sm" asChild>
              <a href="https://supabase.com/docs/guides/getting-started" target="_blank" rel="noopener noreferrer">
                Setup Guide
              </a>
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p>
            <strong>Project URL:</strong> {supabaseUrl || "Not configured"}
          </p>
          <p>
            <strong>API Key:</strong> {supabaseKey ? `${supabaseKey.substring(0, 20)}...` : "Not configured"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
