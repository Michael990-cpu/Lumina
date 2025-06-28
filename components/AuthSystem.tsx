"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, History, Bookmark, Settings, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  name: string
  searchHistory: string[]
  savedSearches: string[]
  preferences: {
    language: string
    theme: string
    resultsPerPage: number
  }
  createdAt: string
}

interface AuthSystemProps {
  onLogin: (user: UserProfile) => void
  onLogout: () => void
  currentUser: UserProfile | null
}

export function AuthSystem({ onLogin, onLogout, currentUser }: AuthSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  // Simple local storage based auth (replace with real auth service)
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists in localStorage
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
        }

        localStorage.setItem("lumina_current_user", JSON.stringify(userProfile))
        onLogin(userProfile)
        setIsOpen(false)
        toast({
          title: "Welcome back! 👋",
          description: `Logged in as ${userProfile.name}`,
        })
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const existingUsers = JSON.parse(localStorage.getItem("lumina_users") || "[]")

      if (existingUsers.find((u: any) => u.email === email)) {
        throw new Error("User already exists")
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In real app, this would be hashed
        name,
        searchHistory: [],
        savedSearches: [],
        preferences: {
          language: "en",
          theme: "dark",
          resultsPerPage: 10,
        },
        createdAt: new Date().toISOString(),
      }

      existingUsers.push(newUser)
      localStorage.setItem("lumina_users", JSON.stringify(existingUsers))

      const userProfile: UserProfile = { ...newUser }
      delete (userProfile as any).password

      localStorage.setItem("lumina_current_user", JSON.stringify(userProfile))
      onLogin(userProfile)
      setIsOpen(false)

      toast({
        title: "Account Created! 🎉",
        description: `Welcome to Lumina, ${name}!`,
      })
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

  const handleLogout = () => {
    localStorage.removeItem("lumina_current_user")
    onLogout()
    toast({
      title: "Logged Out",
      description: "See you next time!",
    })
  }

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("lumina_current_user")
    if (savedUser && !currentUser) {
      try {
        const user = JSON.parse(savedUser)
        onLogin(user)
      } catch (error) {
        localStorage.removeItem("lumina_current_user")
      }
    }
  }, [])

  if (currentUser) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <User className="h-4 w-4 mr-2" />
          {currentUser.name}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                  <Badge variant="outline" className="mt-2">
                    Member since {new Date(currentUser.createdAt).toLocaleDateString()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <History className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="font-semibold">{currentUser.searchHistory.length}</div>
                    <div className="text-sm text-gray-600">Searches</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Bookmark className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="font-semibold">{currentUser.savedSearches.length}</div>
                    <div className="text-sm text-gray-600">Saved</div>
                  </div>
                </div>

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
        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
      >
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle>Welcome to Lumina</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10"
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
                  </div>

                  <Button
                    onClick={() => handleLogin(formData.email, formData.password)}
                    disabled={isLoading || !formData.email || !formData.password}
                    className="w-full"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10"
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
                  </div>

                  <Button
                    onClick={() => handleSignup(formData.email, formData.password, formData.name)}
                    disabled={isLoading || !formData.email || !formData.password || !formData.name}
                    className="w-full"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </TabsContent>
              </Tabs>

              <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full mt-4">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
