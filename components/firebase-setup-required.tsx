"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, AlertTriangle, Database, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useBanking } from "./banking-provider"

export function FirebaseSetupRequired() {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionResult, setConnectionResult] = useState<"success" | "failed" | null>(null)
  const { testFirebaseConnection } = useBanking()

  const securityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to all documents
    // WARNING: This is for development only!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionResult(null)

    try {
      const isConnected = await testFirebaseConnection()
      setConnectionResult(isConnected ? "success" : "failed")

      if (isConnected) {
        // Refresh the page after successful connection
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      setConnectionResult("failed")
    }

    setIsTestingConnection(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-white flex items-center justify-center space-x-2 text-xl sm:text-2xl">
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <span>Firebase Setup Required</span>
            </CardTitle>
            <CardDescription className="text-gray-300 text-base sm:text-lg">
              Your banking app needs Firebase to store data securely in the cloud
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            <Alert className="bg-red-500/20 border-red-500/50">
              <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <AlertDescription className="text-red-200 text-sm sm:text-base">
                <strong>Firebase Configuration Missing:</strong> The app cannot connect to your Firebase database.
                Please follow the setup steps below to enable cloud storage.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Open Firebase Console</h3>
                  <p className="text-gray-300 mb-3 text-sm sm:text-base">
                    Navigate to your Firebase project console to configure Firestore database
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm sm:text-base h-9 sm:h-10"
                    onClick={() =>
                      window.open("https://console.firebase.google.com/project/bank-970bc/firestore", "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Console
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Create Firestore Database</h3>
                  <p className="text-gray-300 mb-3 text-sm sm:text-base">
                    If you haven't already, create a Firestore database in your Firebase project
                  </p>
                  <ul className="text-gray-400 text-xs sm:text-sm space-y-1">
                    <li>• Go to Firestore Database in the left sidebar</li>
                    <li>• Click "Create database"</li>
                    <li>• Choose "Start in test mode" for now</li>
                    <li>• Select your preferred location</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Update Security Rules</h3>
                  <p className="text-gray-300 mb-3 text-sm sm:text-base">
                    Go to the "Rules" tab in Firestore and replace the existing rules with:
                  </p>
                  <div className="relative">
                    <pre className="bg-black/50 p-3 sm:p-4 rounded-lg text-green-400 text-xs sm:text-sm overflow-x-auto max-h-48 sm:max-h-64">
                      <code>{securityRules}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(securityRules)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-yellow-400 text-xs sm:text-sm mt-2">
                    ⚠️ These rules allow unrestricted access and are for development only
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Publish Rules & Test</h3>
                  <p className="text-gray-300 mb-3 text-sm sm:text-base">
                    Click "Publish" to save your rules, then test the connection
                  </p>
                  <Button
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="bg-green-600 hover:bg-green-700 text-sm sm:text-base h-9 sm:h-10"
                  >
                    {isTestingConnection ? "Testing..." : "Test Connection"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Connection Test Results */}
            {connectionResult === "success" && (
              <Alert className="bg-green-500/20 border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200 text-sm sm:text-base">
                  <strong>Success!</strong> Firebase is connected and working. The app will reload automatically...
                </AlertDescription>
              </Alert>
            )}

            {connectionResult === "failed" && (
              <Alert className="bg-red-500/20 border-red-500/50">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200 text-sm sm:text-base">
                  <strong>Connection Failed:</strong> Please check that you've completed all steps above and published
                  your Firestore rules.
                </AlertDescription>
              </Alert>
            )}

            <Alert className="bg-blue-500/20 border-blue-500/50">
              <Database className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200 text-sm sm:text-base">
                <strong>Why Firebase?</strong> Firebase provides secure, scalable cloud storage for your banking data
                with real-time synchronization across all your devices.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
