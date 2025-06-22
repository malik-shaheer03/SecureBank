"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useBanking } from "./banking-provider"
import { Eye, EyeOff, Building2, Shield, Zap, Cloud } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginScreenProps {
  onLogin: (username: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { authenticateUser, createUser } = useBanking()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const isAuthenticated = await authenticateUser(loginData.username, loginData.password)
      if (isAuthenticated) {
        onLogin(loginData.username)
      } else {
        setError("Invalid username or password")
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.")
    }

    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const success = await createUser({
        username: registerData.username,
        password: registerData.password,
        fullName: registerData.fullName,
        email: registerData.email,
      })

      if (success) {
        onLogin(registerData.username)
      } else {
        setError("Username already exists")
      }
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-6 xl:space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white">SecureBank</h1>
            </div>
            <p className="text-lg lg:text-xl text-gray-300">Modern banking with cloud-powered security</p>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-semibold text-white">Bank-Grade Security</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Your data is protected with Firebase's enterprise-level security
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-semibold text-white">Real-time Sync</h3>
                <p className="text-sm lg:text-base text-gray-400">Instant updates across all your devices</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cloud className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-semibold text-white">Cloud Storage</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Your data is safely stored in Google's secure cloud
                </p>
              </div>
            </div>
          </div>

          <Alert className="bg-green-500/20 border-green-500/50">
            <Cloud className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200 text-sm lg:text-base">
              ☁️ Connected to Firebase - Your data is secure and synchronized!
            </AlertDescription>
          </Alert>
        </div>

        {/* Mobile header - only visible on small screens */}
        <div className="lg:hidden text-center space-y-4 mb-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">SecureBank</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-300">Modern banking with cloud-powered security</p>
        </div>

        {/* Right side - Login/Register Form */}
        <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl text-white">Welcome to SecureBank</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-300">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 h-10 sm:h-11">
                <TabsTrigger value="login" className="data-[state=active]:bg-white/20 text-sm sm:text-base">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white/20 text-sm sm:text-base">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white text-sm sm:text-base">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white text-sm sm:text-base">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-10 sm:h-11 text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white text-sm sm:text-base">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, fullName: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-sm sm:text-base">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regUsername" className="text-white text-sm sm:text-base">
                      Username
                    </Label>
                    <Input
                      id="regUsername"
                      type="text"
                      placeholder="Choose a username"
                      value={registerData.username}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, username: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regPassword" className="text-white text-sm sm:text-base">
                      Password
                    </Label>
                    <Input
                      id="regPassword"
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white text-sm sm:text-base">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-10 sm:h-11 text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Mobile features - only visible on small screens */}
        <div className="lg:hidden mt-8 space-y-4">
          <Alert className="bg-green-500/20 border-green-500/50">
            <Cloud className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200 text-sm">
              ☁️ Connected to Firebase - Your data is secure and synchronized!
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
