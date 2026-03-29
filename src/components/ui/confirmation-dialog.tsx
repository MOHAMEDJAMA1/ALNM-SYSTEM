'use client'

import { X, AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-100',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
  }

  const iconStyles = {
    danger: 'text-red-600 bg-red-50',
    warning: 'text-amber-500 bg-amber-50',
    primary: 'text-blue-600 bg-blue-50'
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconStyles[variant]}`}>
              <AlertTriangle size={24} />
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <h3 className="text-[18px] font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-[14px] text-gray-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[14px] font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors order-2 sm:order-1"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-4 py-2.5 text-[14px] font-bold rounded-xl shadow-lg transition-all active:scale-95 order-1 sm:order-2 ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
