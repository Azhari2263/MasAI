"use client"

import { AuthProvider } from "@/contexts/AuthContext"
import { EstimationProvider } from "@/contexts/EstimationContext"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <EstimationProvider>
                {children}
            </EstimationProvider>
        </AuthProvider>
    )
}