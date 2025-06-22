"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { Dashboard } from "@/components/dashboard"
import { BankingProvider, useBanking } from "@/components/banking-provider"
import { FirebaseSetupRequired } from "@/components/firebase-setup-required"
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"

function BankingAppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const { loading, firebaseConnected } = useBanking()

  useEffect(() => {
    // Only check session if Firebase is connected
    if (firebaseConnected) {
      const session = localStorage.getItem("banking_session")
      if (session) {
        const sessionData = JSON.parse(session)
        if (sessionData.expires > Date.now()) {
          setIsLoggedIn(true)
          setCurrentUser(sessionData.username)
        } else {
          localStorage.removeItem("banking_session")
        }
      }
    }
  }, [firebaseConnected])

  const handleLogin = (username: string) => {
    setIsLoggedIn(true)
    setCurrentUser(username)
    // Create session
    const session = {
      username,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }
    localStorage.setItem("banking_session", JSON.stringify(session))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem("banking_session")
  }

  // Show loading screen while checking Firebase connection
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-white text-lg font-semibold">Connecting to Firebase...</div>
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show Firebase setup screen if not connected
  if (!firebaseConnected) {
    return <FirebaseSetupRequired />
  }

  // Show main app if Firebase is connected
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard username={currentUser!} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default function BankingApp() {
  return (
    <BankingProvider>
      <BankingAppContent />
    </BankingProvider>
  )
}
