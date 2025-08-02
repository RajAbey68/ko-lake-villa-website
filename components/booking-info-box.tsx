import React from 'react'

interface BookingInfoBoxProps {
  variant?: 'footer' | 'page' | 'pricing'
  className?: string
  showDiscount?: boolean
}

const BookingInfoBox: React.FC<BookingInfoBoxProps> = ({ 
  variant = 'page', 
  className = '',
  showDiscount = true 
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'footer':
        return 'bg-blue-900 border border-blue-700 text-white'
      case 'pricing':
        return 'bg-blue-50 border border-blue-200'
      default:
        return 'bg-blue-50 border border-blue-200'
    }
  }

  const getTitleStyle = () => {
    switch (variant) {
      case 'footer':
        return 'text-blue-100'
      default:
        return 'text-blue-900'
    }
  }

  const getInstructionStyle = () => {
    switch (variant) {
      case 'footer':
        return 'text-blue-200'
      default:
        return 'text-blue-700'
    }
  }

  const getDiscountStyle = () => {
    switch (variant) {
      case 'footer':
        return 'text-green-300'
      default:
        return 'text-green-700'
    }
  }

  return (
    <div className={`${getContainerStyle()} rounded-lg p-6 ${className}`}>
      <h3 className={`text-lg font-bold ${getTitleStyle()} mb-4 text-center flex items-center justify-center`}>
        📋 Airbnb Booking URLs (Copy & Paste)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-gray-900">
          <div className="font-bold text-blue-800 mb-2">Entire Villa:</div>
          <div className="font-mono text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded border select-all mb-2 cursor-pointer hover:bg-blue-100 transition-colors">
            airbnb.co.uk/h/eklv
          </div>
          <div className="text-xs text-blue-700 italic">
            7 air-conditioned ensuite bedrooms, sleeps max 23 on beds
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-gray-900">
          <div className="font-bold text-blue-800 mb-2">Master Family Suite:</div>
          <div className="font-mono text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded border select-all cursor-pointer hover:bg-blue-100 transition-colors">
            airbnb.co.uk/h/klv6
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-gray-900">
          <div className="font-bold text-blue-800 mb-2">Triple/Twin Rooms:</div>
          <div className="font-mono text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded border select-all cursor-pointer hover:bg-blue-100 transition-colors">
            airbnb.co.uk/h/klv2or3
          </div>
        </div>
      </div>
      
      <p className={`text-sm ${getInstructionStyle()} text-center mt-4`}>
        Click on any URL to select all text, then copy and paste into your browser
      </p>
      
      {showDiscount && (
        <div className="text-center mt-3">
          <span className={`${getDiscountStyle()} font-medium`}>
            💡 Save 15% by booking direct for stays within the next 5 days!
          </span>
        </div>
      )}
    </div>
  )
}

export default BookingInfoBox 