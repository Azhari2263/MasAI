'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MasAI from './ChatWidget'

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg z-50 transition-transform hover:scale-110"
          size="icon"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header - direvisi untuk menghilangkan duplikasi */}
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base">MasAI Assistant</h3>
                <p className="text-xs text-white/80">Online • Siap membantu</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chatbot Component - tanpa wrapper tambahan */}
          <div className="w-[400px] h-[460px] bg-transparent flex flex-col">
            <MasAI />
          </div>
        </div>
      )}
    </>
  )
}