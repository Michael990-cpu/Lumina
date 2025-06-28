"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  User,
  LogOut,
  History,
  Bookmark,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
  Sparkles,
  Shield,
  Zap,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Crown,
  Gift,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  searchHistory: string[]
  savedSearches: string[]
  preferences: {
    language: string
    theme: string
    resultsPerPage: number
  }
  createdAt: string
  subscription?: "free" | "pro" | "premium"
}

interface EnhancedAuthSystemProps {
  onLogin: (user: UserProfile) => void
  onLogout: () => void
  currentUser: UserProfile | null
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export function EnhancedAuthSystem({ onLogin, onLogout, currentUser }: EnhancedAuthSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Password strength calculation
  useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      if (/[^A-Za-z0-9]/.test(password)) strength += 25
      return strength
    }
    setPasswordStrength(calculateStrength(formData.password))
  }, [formData.password])

  // Form validation
  const validateForm = (isSignup = false) => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (isSignup && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (isSignup) {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Supabase authentication
  const handleSupabaseLogin = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase not configured")
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError
    }

    const userProfile: UserProfile = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || data.user.user_metadata?.name || "User",
      avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url,
      searchHistory: profile?.search_history || [],
      savedSearches: profile?.saved_searches || [],
      preferences: profile?.preferences || {
        language: "en",
        theme: "dark",
        resultsPerPage: 10,
      },
      createdAt: profile?.created_at || data.user.created_at,
      subscription: profile?.subscription || "free",
    }

    return userProfile
  }

  // --- Supabase e-mail/password sign-up -------------------------------
  const handleSupabaseSignup = async (email: string, password: string, name: string) => {
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error

    // ------------------------------------------------------------------
    // If email confirmation is required, data.session === null here.
    // We create the profile only when we actually have a session so that
    // auth.uid() passes the RLS policy on user_profiles.
    // ------------------------------------------------------------------
    if (data.session) {
      const { error: profileError } = await supabase.from("user_profiles").insert([
        {
          id: data.user.id,
          name,
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
        // Log but don’t block the signup – the row can be created later.
        console.error("Profile creation error:", profileError)
      }
    }

    // Return a minimal profile; the full row will be available after first login
    return {
      id: data.user.id,
      email: data.user.email!,
      name,
      searchHistory: [],
      savedSearches: [],
      preferences: {
        language: "en",
        theme: "dark",
        resultsPerPage: 10,
      },
      createdAt: data.user.created_at,
      subscription: "free",
    } as UserProfile
  }

  // OAuth login
  const handleOAuthLogin = async (provider: "github" | "google") => {
    if (!supabase) {
      toast({
        title: "Authentication Unavailable",
        description: "Supabase not configured. Using local authentication.",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast({
        title: "OAuth Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Fallback to local storage authentication
  const handleLocalLogin = async (email: string, password: string) => {
    const existingUsers = JSON.parse(localStorage.getItem("lumina_users") || "[]")
    const user = existingUsers.find((u: any) => u.email === email && u.password === password)

    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        name: user.name,
        searchHistory: user.searchHistory || [],
        savedSearches: user.savedSearches || [],
        preferences: user.preferences || {
          language: "en",
          theme: "dark",
          resultsPerPage: 10,
        },
        createdAt: user.createdAt,
        subscription: user.subscription || "free",
      }
      return userProfile
    }
    throw new Error("Invalid credentials")
  }

  const handleLocalSignup = async (email: string, password: string, name: string) => {
    const existingUsers = JSON.parse(localStorage.getItem("lumina_users") || "[]")

    if (existingUsers.find((u: any) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      searchHistory: [],
      savedSearches: [],
      preferences: {
        language: "en",
        theme: "dark",
        resultsPerPage: 10,
      },
      createdAt: new Date().toISOString(),
      subscription: "free",
    }

    existingUsers.push(newUser)
    localStorage.setItem("lumina_users", JSON.stringify(existingUsers))

    const userProfile: UserProfile = { ...newUser }
    delete (userProfile as any).password
    return userProfile
  }

  const handleLogin = async (email: string, password: string) => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      let userProfile: UserProfile

      if (supabase) {
        userProfile = await handleSupabaseLogin(email, password)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        userProfile = await handleLocalLogin(email, password)
      }

      localStorage.setItem("lumina_current_user", JSON.stringify(userProfile))
      onLogin(userProfile)
      setIsOpen(false)

      toast({
        title: "Welcome back! 👋",
        description: `Logged in as ${userProfile.name}`,
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    if (!validateForm(true)) return

    setIsLoading(true)
    try {
      let userProfile: UserProfile

      if (supabase) {
        userProfile = await handleSupabaseSignup(email, password, name)
        toast({
          title: "Check your email! 📧",
          description: "We sent you a confirmation link to complete your registration.",
        })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        userProfile = await handleLocalSignup(email, password, name)
        localStorage.setItem("lumina_current_user", JSON.stringify(userProfile))
        onLogin(userProfile)
        setIsOpen(false)

        toast({
          title: "Account Created! 🎉",
          description: `Welcome to Lumina, ${name}!`,
        })
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem("lumina_current_user")
    onLogout()
    toast({
      title: "Logged Out",
      description: "See you next time!",
    })
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session && !currentUser) {
          try {
            const userProfile = await handleSupabaseLogin(session.user.email!, "")
            onLogin(userProfile)
          } catch (error) {
            console.error("Session restore error:", error)
          }
        }
      } else {
        const savedUser = localStorage.getItem("lumina_current_user")
        if (savedUser && !currentUser) {
          try {
            const user = JSON.parse(savedUser)
            onLogin(user)
          } catch (error) {
            localStorage.removeItem("lumina_current_user")
          }
        }
      }
    }

    checkSession()
  }, [])

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  if (currentUser) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url || "/placeholder.svg"}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            )}
            <span className="hidden sm:inline">{currentUser.name}</span>
            {currentUser.subscription === "pro" && <Crown className="h-3 w-3 text-yellow-400" />}
            {currentUser.subscription === "premium" && <Star className="h-3 w-3 text-purple-400" />}
          </div>
        </Button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-5 w-5" />
                  </div>
                  Profile Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    {currentUser.avatar_url ? (
                      <img
                        src={currentUser.avatar_url || "/placeholder.svg"}
                        alt={currentUser.name}
                        className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-cyan-400 to-purple-400"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1">
                      {currentUser.subscription === "free" && (
                        <Badge className="bg-gray-500 text-white text-xs px-2 py-1">Free</Badge>
                      )}
                      {currentUser.subscription === "pro" && (
                        <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">
                          <Crown className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                      {currentUser.subscription === "premium" && (
                        <Badge className="bg-purple-500 text-white text-xs px-2 py-1">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">{currentUser.name}</h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                  <Badge variant="outline" className="mt-2">
                    Member since {new Date(currentUser.createdAt).toLocaleDateString()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <History className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-bold text-lg text-blue-900">{currentUser.searchHistory.length}</div>
                    <div className="text-sm text-blue-700">Searches</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <Bookmark className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="font-bold text-lg text-purple-900">{currentUser.savedSearches.length}</div>
                    <div className="text-sm text-purple-700">Saved</div>
                  </div>
                </div>

                {currentUser.subscription === "free" && (
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-900">Upgrade to Pro</span>
                    </div>
                    <p className="text-sm text-orange-700 mb-3">
                      Get unlimited searches, priority support, and advanced features!
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" onClick={handleLogout} className="flex-1">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>

                <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full">
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
      >
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl">Welcome to Lumina</div>
                  <div className="text-sm opacity-90">AI-Powered Knowledge Discovery</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        {errors.password && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleLogin(formData.email, formData.password)}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>

                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{getPasswordStrengthText()}</span>
                          </div>
                        </div>
                      )}

                      {errors.password && (
                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        />
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {errors.confirmPassword && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSignup(formData.email, formData.password, formData.name)}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* OAuth Buttons */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg border border-cyan-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-purple-600" />
                  What you get with Lumina:
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    AI-powered search & summaries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Free multilingual translation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Voice search & image analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Export results as PDF/Markdown
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-500">
                  Cancel
                </Button>
                {!supabase && (
                  <Badge variant="outline" className="text-xs">
                    Local Storage Mode
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
