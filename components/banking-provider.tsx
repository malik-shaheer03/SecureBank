"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

interface User {
  id?: string
  username: string
  password: string
  fullName: string
  email: string
  balance: number
  accountNumber: string
  createdAt: string
}

interface Transaction {
  id?: string
  type: "deposit" | "withdraw" | "transfer"
  amount: number
  description: string
  timestamp: string
  fromAccount?: string
  toAccount?: string
  userId: string
}

interface BankingContextType {
  users: User[]
  transactions: Transaction[]
  loading: boolean
  firebaseConnected: boolean
  createUser: (userData: Omit<User, "balance" | "accountNumber" | "createdAt" | "id">) => Promise<boolean>
  authenticateUser: (username: string, password: string) => Promise<boolean>
  getUserByUsername: (username: string) => User | undefined
  updateUserBalance: (username: string, newBalance: number) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => Promise<void>
  getUserTransactions: (username: string) => Transaction[]
  transferMoney: (fromUser: string, toUser: string, amount: number, description: string) => Promise<boolean>
  updateUserInfo: (username: string, updates: Partial<User>) => Promise<void>
  testFirebaseConnection: () => Promise<boolean>
}

const BankingContext = createContext<BankingContextType | undefined>(undefined)

export function BankingProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [firebaseConnected, setFirebaseConnected] = useState(false)

  // Test Firebase connection
  const testFirebaseConnection = async (): Promise<boolean> => {
    try {
      // Try to read from users collection
      await getDocs(collection(db, "users"))
      setFirebaseConnected(true)
      return true
    } catch (error: any) {
      console.error("Firebase connection failed:", error.message)
      setFirebaseConnected(false)
      return false
    }
  }

  // Load data from Firebase
  useEffect(() => {
    let usersUnsubscribe: (() => void) | undefined
    let transactionsUnsubscribe: (() => void) | undefined

    const initializeFirebase = async () => {
      setLoading(true)

      // Test Firebase connection first
      const isConnected = await testFirebaseConnection()

      if (!isConnected) {
        setLoading(false)
        return
      }

      try {
        // Set up real-time listeners for users
        usersUnsubscribe = onSnapshot(
          collection(db, "users"),
          (snapshot) => {
            const usersData: User[] = []
            snapshot.forEach((doc) => {
              usersData.push({ id: doc.id, ...doc.data() } as User)
            })
            setUsers(usersData)
            setLoading(false)
          },
          (error) => {
            console.error("Error listening to users:", error)
            setFirebaseConnected(false)
            setLoading(false)
          },
        )

        // Set up real-time listeners for transactions
        transactionsUnsubscribe = onSnapshot(
          query(collection(db, "transactions"), orderBy("timestamp", "desc")),
          (snapshot) => {
            const transactionsData: Transaction[] = []
            snapshot.forEach((doc) => {
              transactionsData.push({ id: doc.id, ...doc.data() } as Transaction)
            })
            setTransactions(transactionsData)
          },
          (error) => {
            console.error("Error listening to transactions:", error)
            setFirebaseConnected(false)
          },
        )
      } catch (error) {
        console.error("Error setting up Firebase listeners:", error)
        setFirebaseConnected(false)
        setLoading(false)
      }
    }

    initializeFirebase()

    return () => {
      if (usersUnsubscribe) usersUnsubscribe()
      if (transactionsUnsubscribe) transactionsUnsubscribe()
    }
  }, [])

  const generateAccountNumber = () => {
    return Math.random().toString().substr(2, 10)
  }

  const createUser = async (userData: Omit<User, "balance" | "accountNumber" | "createdAt" | "id">) => {
    if (!firebaseConnected) {
      throw new Error("Firebase not connected. Please check your configuration.")
    }

    try {
      // Check if username already exists
      const usersQuery = query(collection(db, "users"), where("username", "==", userData.username))
      const querySnapshot = await getDocs(usersQuery)

      if (!querySnapshot.empty) {
        return false
      }

      const newUser: Omit<User, "id"> = {
        ...userData,
        balance: 0,
        accountNumber: generateAccountNumber(),
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, "users"), newUser)
      return true
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  const authenticateUser = async (username: string, password: string) => {
    if (!firebaseConnected) {
      throw new Error("Firebase not connected. Please check your configuration.")
    }

    try {
      const usersQuery = query(
        collection(db, "users"),
        where("username", "==", username),
        where("password", "==", password),
      )
      const querySnapshot = await getDocs(usersQuery)
      return !querySnapshot.empty
    } catch (error) {
      console.error("Error authenticating user:", error)
      throw error
    }
  }

  const getUserByUsername = (username: string) => {
    return users.find((user) => user.username === username)
  }

  const updateUserBalance = async (username: string, newBalance: number) => {
    if (!firebaseConnected) {
      throw new Error("Firebase not connected. Please check your configuration.")
    }

    try {
      const user = getUserByUsername(username)
      if (user && user.id) {
        await updateDoc(doc(db, "users", user.id), {
          balance: newBalance,
        })
      }
    } catch (error) {
      console.error("Error updating user balance:", error)
      throw error
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, "id" | "timestamp">) => {
    if (!firebaseConnected) {
      throw new Error("Firebase not connected. Please check your configuration.")
    }

    try {
      const newTransaction = {
        ...transaction,
        timestamp: new Date().toISOString(),
      }
      await addDoc(collection(db, "transactions"), newTransaction)
    } catch (error) {
      console.error("Error adding transaction:", error)
      throw error
    }
  }

  const getUserTransactions = (username: string) => {
    const user = getUserByUsername(username)
    if (!user) return []

    return transactions.filter(
      (t) => t.fromAccount === user.accountNumber || t.toAccount === user.accountNumber || t.userId === username,
    )
  }

  const transferMoney = async (fromUser: string, toUser: string, amount: number, description: string) => {
    if (!firebaseConnected) {
      throw new Error("Firebase not connected. Please check your configuration.")
    }

    try {
      const sender = getUserByUsername(fromUser)
      const receiver = getUserByUsername(toUser)

      if (!sender || !receiver || sender.balance < amount) {
        return false
      }

      // Use batch write for atomic transaction
      const batch = writeBatch(db)

      // Update sender balance
      if (sender.id) {
        batch.update(doc(db, "users", sender.id), {
          balance: sender.balance - amount,
        })
      }

      // Update receiver balance
      if (receiver.id) {
        batch.update(doc(db, "users", receiver.id), {
          balance: receiver.balance + amount,
        })
      }

      // Add transaction record
      const transactionRef = doc(collection(db, "transactions"))
      batch.set(transactionRef, {
        type: "transfer",
        amount,
        description,
        fromAccount: sender.accountNumber,
        toAccount: receiver.accountNumber,
        userId: fromUser,
        timestamp: new Date().toISOString(),
      })

      await batch.commit()
      return true
    } catch (error) {
      console.error("Error transferring money:", error)
      throw error
    }
  }

  const updateUserInfo = async (username: string, updates: Partial<User>) => {
    if (!firebaseConnected) {
      throw new Error("Firebase not connected. Please check your configuration.")
    }

    try {
      const user = getUserByUsername(username)
      if (user && user.id) {
        await updateDoc(doc(db, "users", user.id), updates)
      }
    } catch (error) {
      console.error("Error updating user info:", error)
      throw error
    }
  }

  return (
    <BankingContext.Provider
      value={{
        users,
        transactions,
        loading,
        firebaseConnected,
        createUser,
        authenticateUser,
        getUserByUsername,
        updateUserBalance,
        addTransaction,
        getUserTransactions,
        transferMoney,
        updateUserInfo,
        testFirebaseConnection,
      }}
    >
      {children}
    </BankingContext.Provider>
  )
}

export function useBanking() {
  const context = useContext(BankingContext)
  if (context === undefined) {
    throw new Error("useBanking must be used within a BankingProvider")
  }
  return context
}
