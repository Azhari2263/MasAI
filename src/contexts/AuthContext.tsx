'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

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
    isInitialized: boolean
    getRedirectPath: () => string
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
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const router = useRouter()

    // Fungsi untuk menyimpan cookie
    const setCookie = (name: string, value: string, days: number = 7) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString()
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
    }

    // Fungsi untuk menghapus cookie
    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }

    // Check for existing session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('masai_user')
        let parsedUser: User | null = null

        if (savedUser) {
            try {
                parsedUser = JSON.parse(savedUser)
                setUser(parsedUser)
                
                // Sync ke cookie jika ada di localStorage tapi tidak di cookie
                const cookies = document.cookie.split(';')
                const hasCookie = cookies.some(cookie => 
                    cookie.trim().startsWith('masai_user=')
                )
                
                if (!hasCookie && parsedUser) {
                    setCookie('masai_user', savedUser)
                }
            } catch (error) {
                console.error('Error parsing saved user:', error)
                localStorage.removeItem('masai_user')
                deleteCookie('masai_user')
            }
        }
        setIsInitialized(true)
    }, [])

    // Fungsi untuk mendapatkan redirect path berdasarkan role
    const getRedirectPath = (): string => {
        if (!user) return '/'
        
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            return '/admin'
        }
        
        return '/dashboard'
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            // Mock authentication - check against seeded users
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
                
                // Simpan ke localStorage
                localStorage.setItem('masai_user', JSON.stringify(userData))
                
                // Simpan ke cookie untuk middleware
                setCookie('masai_user', JSON.stringify(userData))
                
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            // Mock registration
            const newUser: User = {
                id: Date.now().toString(),
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                role: 'USER'
            }

            setUser(newUser)
            
            // Simpan ke localStorage
            localStorage.setItem('masai_user', JSON.stringify(newUser))
            
            // Simpan ke cookie untuk middleware
            setCookie('masai_user', JSON.stringify(newUser))
            
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
        
        // Hapus dari localStorage
        localStorage.removeItem("masai_user")
        
        // Hapus cookie
        deleteCookie('masai_user')
        
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isLoading,
            isInitialized,
            getRedirectPath
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