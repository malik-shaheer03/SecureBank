"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, AlertTriangle } from "lucide-react"

export function FirebaseSetupGuide() {
  const securityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to all documents for now (development only)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span>Firebase Setup Required</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            To fix the permissions error, you need to configure Firebase Firestore security rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-yellow-500/20 border-yellow-500/50">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              The app is currently using localStorage as a fallback when Firebase fails. Follow these steps to enable
              Firebase.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 1: Go to Firebase Console</h3>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => window.open("https://console.firebase.google.com/project/bank-970bc/firestore", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Firebase Console
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 2: Update Firestore Security Rules</h3>
            <p className="text-gray-300">Navigate to Firestore Database → Rules and replace the existing rules with:</p>
            <div className="relative">
              <pre className="bg-black/50 p-4 rounded-lg text-green-400 text-sm overflow-x-auto">
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
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 3: Publish the Rules</h3>
            <p className="text-gray-300">Click "Publish" to apply the new security rules.</p>
          </div>

          <Alert className="bg-red-500/20 border-red-500/50">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>Important:</strong> These rules allow unrestricted access and are only for development. For
              production, implement proper authentication and user-specific rules.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Alternative: Test Mode</h3>
            <p className="text-gray-300">
              You can also start Firestore in "Test Mode" which automatically applies permissive rules for 30 days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
