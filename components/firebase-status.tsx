"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Database, AlertTriangle, CheckCircle, ExternalLink, HardDrive } from "lucide-react"
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function FirebaseStatus() {
  const [firebaseStatus, setFirebaseStatus] = useState<"checking" | "connected" | "disconnected">("disconnected")
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const checkFirebaseConnection = async () => {
    setIsChecking(true)
    setFirebaseStatus("checking")

    try {
      // Try to write a test document
      const testDoc = await addDoc(collection(db, "test"), {
        timestamp: new Date().toISOString(),
        test: true,
      })

      // If successful, delete the test document
      await deleteDoc(doc(db, "test", testDoc.id))

      setFirebaseStatus("connected")
    } catch (error: any) {
      console.log("Firebase connection test failed:", error.message)
      setFirebaseStatus("disconnected")
    }

    setIsChecking(false)
  }

  if (firebaseStatus === "checking") {
    return (
      <Alert className="bg-blue-500/20 border-blue-500/50 mb-4">
        <Database className="h-4 w-4 text-blue-400 animate-pulse" />
        <AlertDescription className="text-blue-200">Testing Firebase connection...</AlertDescription>
      </Alert>
    )
  }

  if (firebaseStatus === "connected") {
    return (
      <Alert className="bg-green-500/20 border-green-500/50 mb-4">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-200">
          <div className="flex items-center justify-between">
            <span>✅ Firebase connected! Cloud sync is available.</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-green-200 hover:text-green-100"
              onClick={() => setFirebaseStatus("disconnected")}
            >
              Disconnect
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mb-4 space-y-4">
      <Alert className="bg-blue-500/20 border-blue-500/50">
        <HardDrive className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <div className="flex items-center justify-between">
            <span>💾 Running in offline mode with local storage</span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-200 hover:text-blue-100"
                onClick={checkFirebaseConnection}
                disabled={isChecking}
              >
                {isChecking ? "Testing..." : "Test Firebase"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-200 hover:text-blue-100"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
              >
                {showSetupGuide ? "Hide" : "Setup"} Guide
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {showSetupGuide && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Firebase Setup Guide</h3>
            <p className="text-gray-300 text-sm">
              Your banking app works perfectly with local storage. Firebase setup is optional for cloud sync.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Open Firebase Console</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() =>
                      window.open("https://console.firebase.google.com/project/bank-970bc/firestore", "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Console
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Create Firestore Database</p>
                  <p className="text-gray-300 text-sm">If not already created, set up Firestore in test mode</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Update Firestore Rules</p>
                  <p className="text-gray-300 text-sm mb-2">Go to Rules tab and paste this code:</p>
                  <div className="relative">
                    <pre className="bg-black/50 p-3 rounded text-green-400 text-xs overflow-x-auto">
                      {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1 text-gray-400 hover:text-white"
                      onClick={() => {
                        const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`
                        navigator.clipboard.writeText(rules)
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Publish Rules & Test</p>
                  <Button
                    size="sm"
                    variant="default"
                    className="mt-2 bg-green-600 hover:bg-green-700"
                    onClick={checkFirebaseConnection}
                    disabled={isChecking}
                  >
                    {isChecking ? "Testing..." : "Test Connection"}
                  </Button>
                </div>
              </div>
            </div>

            <Alert className="bg-yellow-500/20 border-yellow-500/50">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200 text-sm">
                <strong>Note:</strong> Your app works perfectly without Firebase. This setup is only needed for cloud
                sync across devices.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
