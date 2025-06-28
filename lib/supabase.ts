import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  name: string
  avatar_url?: string
  search_history: string[]
  saved_searches: string[]
  preferences: {
    language: string
    theme: string
    resultsPerPage: number
  }
  subscription: "free" | "pro" | "premium"
  created_at: string
  updated_at: string
}

// Helper functions
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", userId).select().single()

  if (error) throw error
  return data
}

export const addToSearchHistory = async (userId: string, query: string) => {
  const profile = await getUserProfile(userId)
  const updatedHistory = [query, ...profile.search_history.filter((q) => q !== query)].slice(0, 50)

  return updateUserProfile(userId, { search_history: updatedHistory })
}

export const addToSavedSearches = async (userId: string, query: string) => {
  const profile = await getUserProfile(userId)
  if (!profile.saved_searches.includes(query)) {
    const updatedSaved = [query, ...profile.saved_searches].slice(0, 20)
    return updateUserProfile(userId, { saved_searches: updatedSaved })
  }
  return profile
}
