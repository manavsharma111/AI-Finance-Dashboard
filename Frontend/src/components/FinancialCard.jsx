// import React from 'react'

const FinancialCard = ({ 
    icon,
    label,
    value,
    additionalContent,
    borderColor = "",
}) => (
    <div className={`bg-white rounded-xl p-5 lg:p-2 shadow-sm border hover:shadow-md border-gray-200 ${borderColor}`}>
        <div className='text-sm font-medium to-gray-600 flex items-center gap-2' > 
            {icon}
            {label}
        </div>
        <p className='text-2xl font-bold to-gray-700 mt-1' >
            {value}
        </p>
        {additionalContent}
    </div>
)

export default FinancialCard