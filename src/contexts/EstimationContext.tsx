'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react' // Tambahkan useEffect di sini

interface Estimation {
    id: string
    estimation_id: string
    object_type: string
    estimated_weight: number
    karat: number
    condition: string
    confidence_scores: {
        object_detection: number
        weight_estimation: number
        karat_analysis: number
        condition_analysis: number
    }
    gold_price_per_gram: number
    estimated_gold_value: number
    max_loan_amount: number
    net_loan_amount: number
    status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED'
    created_at: string
    expires_at: string
    image_url?: string
}

interface Application {
    id: string
    estimation_id: string
    application_number: string
    status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED'
    current_step: string
    progress_percentage: number
    created_at: string
    full_name?: string
    email?: string
    phone?: string
}

interface EstimationContextType {
    estimations: Estimation[]
    applications: Application[]
    addEstimation: (estimation: Estimation) => void
    addApplication: (application: Application) => void
    getEstimationById: (id: string) => Estimation | undefined
    getApplicationByEstimationId: (estimationId: string) => Application | undefined
    getUserEstimations: () => Estimation[]
    getUserApplications: () => Application[]
}

const EstimationContext = createContext<EstimationContextType | undefined>(undefined)

export function EstimationProvider({ children }: { children: ReactNode }) {
    const [estimations, setEstimations] = useState<Estimation[]>([])
    const [applications, setApplications] = useState<Application[]>([])

    const addEstimation = (estimation: Estimation) => {
        setEstimations(prev => {
            // Remove duplicates
            const filtered = prev.filter(e => e.estimation_id !== estimation.estimation_id)
            // Add new estimation
            const updated = [...filtered, estimation]
            // Save to localStorage
            localStorage.setItem('user_estimations', JSON.stringify(updated))
            return updated
        })
    }

    const addApplication = (application: Application) => {
        setApplications(prev => {
            // Remove duplicates
            const filtered = prev.filter(a => a.application_number !== application.application_number)
            // Add new application
            const updated = [...filtered, application]
            // Save to localStorage
            localStorage.setItem('user_applications', JSON.stringify(updated))
            return updated
        })
    }

    const getEstimationById = (id: string) => {
        return estimations.find(e => e.estimation_id === id)
    }

    const getApplicationByEstimationId = (estimationId: string) => {
        return applications.find(a => a.estimation_id === estimationId)
    }

    const getUserEstimations = () => {
        return estimations.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }

    const getUserApplications = () => {
        return applications.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }

    // Load from localStorage on mount
    useEffect(() => { // Ganti React.useEffect menjadi useEffect
        const savedEstimations = localStorage.getItem('user_estimations')
        const savedApplications = localStorage.getItem('user_applications')

        if (savedEstimations) {
            try {
                setEstimations(JSON.parse(savedEstimations))
            } catch (error) {
                console.error('Failed to parse saved estimations:', error)
            }
        }

        if (savedApplications) {
            try {
                setApplications(JSON.parse(savedApplications))
            } catch (error) {
                console.error('Failed to parse saved applications:', error)
            }
        }
    }, [])

    return (
        <EstimationContext.Provider
            value={{
                estimations,
                applications,
                addEstimation,
                addApplication,
                getEstimationById,
                getApplicationByEstimationId,
                getUserEstimations,
                getUserApplications,
            }}
        >
            {children}
        </EstimationContext.Provider>
    )
}

export function useEstimation() {
    const context = useContext(EstimationContext)
    if (context === undefined) {
        throw new Error('useEstimation must be used within an EstimationProvider')
    }
    return context
}