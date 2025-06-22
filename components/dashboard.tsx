"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBanking } from "./banking-provider"
import { AccountOverview } from "./account-overview"
import { TransactionPanel } from "./transaction-panel"
import { TransactionHistory } from "./transaction-history"
import { AccountSettings } from "./account-settings"
import { LogOut, User, CreditCard, History, Settings, Building2, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardProps {
  username: string
  onLogout: () => void
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getUserByUsername } = useBanking()

  const user = getUserByUsername(username)

  if (!user) {
    return <div>User not found</div>
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const TabButton = ({ tab, isMobile = false }: { tab: any; isMobile?: boolean }) => (
    <TabsTrigger
      value={tab.id}
      className={`data-[state=active]:bg-white/20 ${isMobile ? "w-full justify-start" : ""}`}
      onClick={() => isMobile && setMobileMenuOpen(false)}
    >
      <tab.icon className="w-4 h-4 mr-2" />
      {tab.label}
    </TabsTrigger>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white">SecureBank</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs sm:text-sm text-gray-300">Welcome back,</p>
                <p className="text-sm sm:text-base text-white font-semibold truncate max-w-32 sm:max-w-none">
                  {user.fullName}
                </p>
              </div>

              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900/95 backdrop-blur-lg border-white/20 w-64">
                  <div className="space-y-4 mt-6">
                    <div className="text-center pb-4 border-b border-white/20">
                      <p className="text-sm text-gray-300">Welcome back,</p>
                      <p className="text-white font-semibold">{user.fullName}</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                      <TabsList className="grid w-full grid-cols-1 bg-white/10 backdrop-blur-lg h-auto p-1 space-y-1">
                        {tabs.map((tab) => (
                          <TabButton key={tab.id} tab={tab} isMobile />
                        ))}
                      </TabsList>
                    </Tabs>

                    <Button
                      variant="ghost"
                      onClick={onLogout}
                      className="w-full text-white hover:bg-white/10 justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop logout button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hidden sm:flex text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Desktop Navigation */}
          <TabsList className="hidden sm:grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg h-12">
            {tabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} />
            ))}
          </TabsList>

          {/* Mobile user info */}
          <div className="sm:hidden bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300">Welcome back,</p>
            <p className="text-white font-semibold text-lg">{user.fullName}</p>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <AccountOverview user={user} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 sm:space-y-6">
            <TransactionPanel username={username} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <TransactionHistory username={username} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <AccountSettings username={username} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
