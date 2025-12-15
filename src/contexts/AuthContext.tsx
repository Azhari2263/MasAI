'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
    id: string
    email: string
    name: string
    phone?: string
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    register: (userData: RegisterData) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

interface RegisterData {
    name: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true) // Start with true
    const [mounted, setMounted] = useState(false)

    // Check for existing session ONLY ONCE on mount
    useEffect(() => {
        setMounted(true)
        
        if (typeof window !== 'undefined') {
            try {
                const savedUser = localStorage.getItem('masai_user')
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser)
                    setUser(parsedUser)
                }
            } catch (error) {
                console.error('Failed to load user:', error)
                localStorage.removeItem('masai_user')
            } finally {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
        }
    }, []) // Empty dependency array - run ONCE only

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            if ((email === 'admin@masai.id' && password === 'admin123') ||
                (email === 'user@masai.id' && password === 'user123')) {

                const userData: User = {
                    id: email === 'admin@masai.id' ? '1' : '2',
                    email,
                    name: email === 'admin@masai.id' ? 'Admin MasAI' : 'Ahmad Wijaya',
                    phone: email === 'admin@masai.id' ? '+6281234567890' : '+6289876543210',
                    role: email === 'admin@masai.id' ? 'ADMIN' : 'USER'
                }

                setUser(userData)
                localStorage.setItem('masai_user', JSON.stringify(userData))
                return true
            }

            return false
        } catch (error) {
            console.error('Login error:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData: RegisterData): Promise<boolean> => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newUser: User = {
                id: Date.now().toString(),
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                role: 'USER'
            }

            setUser(newUser)
            localStorage.setItem('masai_user', JSON.stringify(newUser))
            return true
        } catch (error) {
            console.error('Registration error:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('masai_user')
        // Don't use window.location.href - use router instead
        if (typeof window !== 'undefined') {
            window.location.href = '/'
        }
    }

    // Don't render children until mounted
    if (!mounted) {
        return null
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}