"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBanking } from "./banking-provider"
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Calendar } from "lucide-react"

interface TransactionHistoryProps {
  username: string
}

export function TransactionHistory({ username }: TransactionHistoryProps) {
  const { getUserTransactions, getUserByUsername } = useBanking()
  const transactions = getUserTransactions(username)
  const user = getUserByUsername(username)

  if (!user) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />
      case "withdraw":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />
      case "transfer":
        return <ArrowRightLeft className="w-4 h-4 text-blue-400" />
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />
    }
  }

  const getTransactionColor = (transaction: any) => {
    if (transaction.type === "deposit") return "text-green-400"
    if (transaction.type === "withdraw") return "text-red-400"
    if (transaction.type === "transfer") {
      return transaction.toAccount === user.accountNumber ? "text-green-400" : "text-red-400"
    }
    return "text-gray-400"
  }

  const getTransactionAmount = (transaction: any) => {
    if (transaction.type === "deposit") return `+${formatCurrency(transaction.amount)}`
    if (transaction.type === "withdraw") return `-${formatCurrency(transaction.amount)}`
    if (transaction.type === "transfer") {
      return transaction.toAccount === user.accountNumber
        ? `+${formatCurrency(transaction.amount)}`
        : `-${formatCurrency(transaction.amount)}`
    }
    return formatCurrency(transaction.amount)
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "deposit":
        return "default"
      case "withdraw":
        return "destructive"
      case "transfer":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription className="text-gray-300">Complete record of all your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No transactions yet</p>
              <p className="text-sm text-gray-500">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium capitalize">{transaction.type}</p>
                        <Badge variant={getBadgeVariant(transaction.type)} className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>

                      <p className="text-gray-400 text-sm">{transaction.description}</p>

                      {transaction.type === "transfer" && (
                        <p className="text-xs text-gray-500">
                          {transaction.toAccount === user.accountNumber
                            ? `From: ${transaction.fromAccount}`
                            : `To: ${transaction.toAccount}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className={`font-semibold ${getTransactionColor(transaction)}`}>
                      {getTransactionAmount(transaction)}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-500/20 border-green-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-400">
                    {
                      transactions.filter(
                        (t) => t.type === "deposit" || (t.type === "transfer" && t.toAccount === user.accountNumber),
                      ).length
                    }
                  </p>
                </div>
                <ArrowDownLeft className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/20 border-red-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-300">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-red-400">
                    {
                      transactions.filter(
                        (t) => t.type === "withdraw" || (t.type === "transfer" && t.fromAccount === user.accountNumber),
                      ).length
                    }
                  </p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/20 border-blue-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Total Transfers</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {transactions.filter((t) => t.type === "transfer").length}
                  </p>
                </div>
                <ArrowRightLeft className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
