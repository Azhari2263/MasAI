'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEstimation } from '@/contexts/EstimationContext'
import { Search, Info, FileText, Eye } from 'lucide-react'

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'APPROVED': return 'bg-green-100 text-green-800'
        case 'PROCESSING': return 'bg-blue-100 text-blue-800'
        case 'PENDING': return 'bg-yellow-100 text-yellow-800'
        case 'REJECTED': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// ========== TRACKING COMPONENT ==========
export function UserTrackingSection() {
    const { getUserEstimations, getUserApplications } = useEstimation()
    const [selectedEstimation, setSelectedEstimation] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const estimations = getUserEstimations()
    const applications = getUserApplications()

    const handleSearch = () => {
        const found = estimations.find(e =>
            e.estimation_id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (found) {
            setSelectedEstimation(found.estimation_id)
        } else {
            alert('Estimasi tidak ditemukan')
        }
    }

    return (
        <Card className="border-amber-200">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl text-amber-800">Tracking Pengajuan Gadai</CardTitle>
                <CardDescription>
                    Monitor status pengajuan gadai emas Anda secara real-time
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Search Form */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Masukkan nomor estimasi..."
                            className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        onClick={handleSearch}
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Cari
                    </Button>
                </div>

                {/* User Estimations List */}
                {estimations.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-amber-800">Estimasi Anda</h3>
                        <div className="grid gap-3">
                            {estimations.slice(0, 5).map((estimation) => {
                                const application = applications.find(a => a.estimation_id === estimation.estimation_id)
                                const isSelected = selectedEstimation === estimation.estimation_id

                                return (
                                    <Card
                                        key={estimation.id}
                                        className={`border-amber-200 cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-amber-500' : ''
                                            }`}
                                        onClick={() => setSelectedEstimation(estimation.estimation_id)}
                                    >
                                        <CardContent className="pt-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={getStatusColor(estimation.status)}>
                                                            {estimation.status}
                                                        </Badge>
                                                        {application && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {application.current_step}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{estimation.object_type} - {estimation.karat}K</p>
                                                        <p className="text-sm text-gray-500">ID: {estimation.estimation_id}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Berat:</span>
                                                            <span className="ml-1 font-medium">{estimation.estimated_weight}g</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Nilai:</span>
                                                            <span className="ml-1 font-medium text-green-600">
                                                                {formatCurrency(estimation.estimated_gold_value)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Dibuat: {new Date(estimation.created_at).toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                                {estimation.image_url && (
                                                    <img
                                                        src={estimation.image_url}
                                                        alt={estimation.object_type}
                                                        className="w-20 h-20 object-cover rounded-lg ml-4"
                                                    />
                                                )}
                                            </div>
                                            {application && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="flex-1">
                                                            <Progress value={application.progress_percentage} className="h-2" />
                                                        </div>
                                                        <span className="text-gray-600">{application.progress_percentage}%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <Alert className="border-amber-200 bg-amber-50">
                        <Info className="w-4 h-4 text-amber-600" />
                        <AlertDescription className="text-sm text-amber-800">
                            Belum ada estimasi. Silakan lakukan estimasi emas terlebih dahulu.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Selected Estimation Details */}
                {selectedEstimation && (() => {
                    const estimation = estimations.find(e => e.estimation_id === selectedEstimation)
                    const application = applications.find(a => a.estimation_id === selectedEstimation)

                    if (!estimation) return null

                    return (
                        <Card className="border-amber-200 bg-amber-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-amber-800">Detail Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600">Nomor Estimasi</span>
                                        <p className="font-medium text-xs">{estimation.estimation_id}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Status</span>
                                        <Badge className={getStatusColor(estimation.status)}>
                                            {estimation.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Jenis Emas</span>
                                        <p className="font-medium">{estimation.object_type} {estimation.karat}K</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Estimasi Berat</span>
                                        <p className="font-medium">{estimation.estimated_weight} gram</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Estimasi Nilai</span>
                                        <p className="font-medium text-green-600">
                                            {formatCurrency(estimation.estimated_gold_value)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Plafon Pinjaman</span>
                                        <p className="font-medium text-blue-600">
                                            {formatCurrency(estimation.max_loan_amount)}
                                        </p>
                                    </div>
                                </div>

                                {application && (
                                    <div className="pt-4 border-t border-amber-200">
                                        <h4 className="font-semibold text-amber-800 mb-3">Timeline Pengajuan</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-sm">{application.current_step}</span>
                                                <Badge variant="outline" className="ml-auto text-xs">
                                                    {application.progress_percentage}%
                                                </Badge>
                                            </div>
                                            <Progress value={application.progress_percentage} className="h-2" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })()}
            </CardContent>
        </Card>
    )
}

// ========== HISTORY COMPONENT ==========
export function UserHistorySection() {
    const { getUserEstimations } = useEstimation()
    const estimations = getUserEstimations()
    const [filter, setFilter] = useState<'all' | 'DRAFT' | 'PROCESSING' | 'APPROVED' | 'REJECTED'>('all')

    const filteredEstimations = filter === 'all'
        ? estimations
        : estimations.filter(e => e.status === filter)

    return (
        <Card className="border-amber-200">
            <CardHeader>
                <CardTitle className="text-amber-800">Riwayat Estimasi</CardTitle>
                <CardDescription>
                    Lihat semua estimasi yang telah Anda buat
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'DRAFT', 'PROCESSING', 'APPROVED', 'REJECTED'].map((status) => (
                        <Button
                            key={status}
                            variant={filter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(status as any)}
                            className={filter === status ? 'bg-amber-500 hover:bg-amber-600' : ''}
                        >
                            {status === 'all' ? 'Semua' : status}
                        </Button>
                    ))}
                </div>

                {/* Estimations List */}
                {filteredEstimations.length > 0 ? (
                    <div className="space-y-3">
                        {filteredEstimations.map((estimation) => (
                            <Card key={estimation.id} className="border-amber-200 hover:shadow-md transition-shadow">
                                <CardContent className="pt-4">
                                    <div className="flex items-start gap-4">
                                        {estimation.image_url && (
                                            <img
                                                src={estimation.image_url}
                                                alt={estimation.object_type}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {estimation.object_type} - {estimation.karat}K
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        ID: {estimation.estimation_id}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusColor(estimation.status)}>
                                                    {estimation.status}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Berat</span>
                                                    <span className="font-medium">{estimation.estimated_weight}g</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Kondisi</span>
                                                    <span className="font-medium">{estimation.condition}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Nilai Emas</span>
                                                    <span className="font-medium text-green-600">
                                                        {formatCurrency(estimation.estimated_gold_value)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Plafon</span>
                                                    <span className="font-medium text-blue-600">
                                                        {formatCurrency(estimation.max_loan_amount)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <span className="text-xs text-gray-400">
                                                    {new Date(estimation.created_at).toLocaleString('id-ID')}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                                                >
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Detail
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p>Belum ada riwayat estimasi</p>
                        {filter !== 'all' && (
                            <p className="text-sm mt-2">Tidak ada estimasi dengan status {filter}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}