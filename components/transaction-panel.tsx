"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBanking } from "./banking-provider"
import { PlusCircle, MinusCircle, ArrowRightLeft, CheckCircle } from "lucide-react"

interface TransactionPanelProps {
  username: string
}

export function TransactionPanel({ username }: TransactionPanelProps) {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [transferData, setTransferData] = useState({
    recipient: "",
    amount: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const { getUserByUsername, updateUserBalance, addTransaction, transferMoney } = useBanking()
  const user = getUserByUsername(username)

  if (!user) return null

  const clearMessages = () => {
    setSuccess("")
    setError("")
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    const amount = Number.parseFloat(depositAmount)
    if (amount <= 0) {
      setError("Please enter a valid amount")
      setLoading(false)
      return
    }

    try {
      await updateUserBalance(username, user.balance + amount)
      await addTransaction({
        type: "deposit",
        amount,
        description: `Deposit to account ${user.accountNumber}`,
        toAccount: user.accountNumber,
        userId: username,
      })

      setSuccess(`Successfully deposited $${amount.toFixed(2)}`)
      setDepositAmount("")
    } catch (error: any) {
      setError(error.message || "Failed to process deposit. Please try again.")
    }

    setLoading(false)
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    const amount = Number.parseFloat(withdrawAmount)
    if (amount <= 0) {
      setError("Please enter a valid amount")
      setLoading(false)
      return
    }

    if (amount > user.balance) {
      setError("Insufficient funds")
      setLoading(false)
      return
    }

    try {
      await updateUserBalance(username, user.balance - amount)
      await addTransaction({
        type: "withdraw",
        amount,
        description: `Withdrawal from account ${user.accountNumber}`,
        fromAccount: user.accountNumber,
        userId: username,
      })

      setSuccess(`Successfully withdrew $${amount.toFixed(2)}`)
      setWithdrawAmount("")
    } catch (error: any) {
      setError(error.message || "Failed to process withdrawal. Please try again.")
    }

    setLoading(false)
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    const amount = Number.parseFloat(transferData.amount)
    if (amount <= 0) {
      setError("Please enter a valid amount")
      setLoading(false)
      return
    }

    if (amount > user.balance) {
      setError("Insufficient funds")
      setLoading(false)
      return
    }

    if (!transferData.recipient) {
      setError("Please enter recipient username")
      setLoading(false)
      return
    }

    try {
      const success = await transferMoney(
        username,
        transferData.recipient,
        amount,
        transferData.description || `Transfer from ${username}`,
      )

      if (success) {
        setSuccess(`Successfully transferred $${amount.toFixed(2)} to ${transferData.recipient}`)
        setTransferData({ recipient: "", amount: "", description: "" })
      } else {
        setError("Transfer failed. Please check recipient username and try again.")
      }
    } catch (error: any) {
      setError(error.message || "Failed to process transfer. Please try again.")
    }

    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Balance Display */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Available Balance</CardTitle>
          <CardDescription className="text-purple-100 text-sm sm:text-base">Current account balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{formatCurrency(user.balance)}</div>
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {success && (
        <Card className="bg-green-500/20 border-green-500/50">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <p className="text-sm sm:text-base">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-red-500/20 border-red-500/50">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Transaction Tabs */}
      <Tabs defaultValue="deposit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-lg h-10 sm:h-12">
          <TabsTrigger value="deposit" className="data-[state=active]:bg-white/20 text-xs sm:text-sm">
            <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Deposit</span>
            <span className="sm:hidden">Add</span>
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="data-[state=active]:bg-white/20 text-xs sm:text-sm">
            <MinusCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Withdraw</span>
            <span className="sm:hidden">Take</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="data-[state=active]:bg-white/20 text-xs sm:text-sm">
            <ArrowRightLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Transfer</span>
            <span className="sm:hidden">Send</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg sm:text-xl">Deposit Money</CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                Add money to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="depositAmount" className="text-white text-sm sm:text-base">
                    Amount
                  </Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 h-10 sm:h-11 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Deposit Money"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg sm:text-xl">Withdraw Money</CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                Withdraw money from your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount" className="text-white text-sm sm:text-base">
                    Amount
                  </Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={user.balance}
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-400">Available balance: {formatCurrency(user.balance)}</p>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 h-10 sm:h-11 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Withdraw Money"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg sm:text-xl">Transfer Money</CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                Send money to another account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-white text-sm sm:text-base">
                    Recipient Username
                  </Label>
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="Enter recipient username"
                    value={transferData.recipient}
                    onChange={(e) => setTransferData((prev) => ({ ...prev, recipient: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferAmount" className="text-white text-sm sm:text-base">
                    Amount
                  </Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={user.balance}
                    placeholder="0.00"
                    value={transferData.amount}
                    onChange={(e) => setTransferData((prev) => ({ ...prev, amount: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white text-sm sm:text-base">
                    Description (Optional)
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="What's this transfer for?"
                    value={transferData.description}
                    onChange={(e) => setTransferData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>

                <p className="text-xs sm:text-sm text-gray-400">Available balance: {formatCurrency(user.balance)}</p>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Transfer Money"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
