"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBanking } from "./banking-provider"
import { Wallet, TrendingUp, Clock, CreditCard } from "lucide-react"

interface User {
  username: string
  password: string
  fullName: string
  email: string
  balance: number
  accountNumber: string
  createdAt: string
}

interface AccountOverviewProps {
  user: User
}

export function AccountOverview({ user }: AccountOverviewProps) {
  const { getUserTransactions } = useBanking()
  const transactions = getUserTransactions(user.username)
  const recentTransactions = transactions.slice(0, 3)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white col-span-1 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatCurrency(user.balance)}</div>
            <p className="text-xs sm:text-sm text-purple-100 truncate">Account: {user.accountNumber}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs sm:text-sm text-gray-300">All time activity</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Member Since</CardTitle>
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{formatDate(user.createdAt)}</div>
            <p className="text-xs sm:text-sm text-gray-300">Account created</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg sm:text-xl">Account Information</CardTitle>
          <CardDescription className="text-gray-300 text-sm sm:text-base">
            Your personal banking details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300">Full Name</label>
              <p className="text-white text-sm sm:text-base">{user.fullName}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300">Email Address</label>
              <p className="text-white text-sm sm:text-base break-all">{user.email}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300">Username</label>
              <p className="text-white text-sm sm:text-base">{user.username}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300">Account Number</label>
              <p className="text-white font-mono text-sm sm:text-base">{user.accountNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg sm:text-xl">Recent Activity</CardTitle>
          <CardDescription className="text-gray-300 text-sm sm:text-base">Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium capitalize text-sm sm:text-base">{transaction.type}</p>
                      <p className="text-gray-400 text-xs sm:text-sm truncate">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p
                      className={`font-medium text-sm sm:text-base ${
                        transaction.type === "deposit" ||
                        (transaction.type === "transfer" && transaction.toAccount === user.accountNumber)
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "deposit" ||
                      (transaction.type === "transfer" && transaction.toAccount === user.accountNumber)
                        ? "+"
                        : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-gray-400 text-xs">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
