import React from 'react'

const TimeFrameSelector = ({ timeFrame, setTimeFrame, options = ["daily", "weekly", "monthly", "yearly"], color = "teal" }) => {
  const colorClasses = {
    teal: "bg-teal-500 text-white shadow-lg",
    orange: "bg-orange-500 text-white shadow-lg",
    blue: "bg-blue-500 text-white shadow-lg"
  }

  return (
    <div className="flex p-1.5 bg-gray-50 rounded-2xl w-fit border border-gray-100">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setTimeFrame(option)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${
            timeFrame === option 
              ? colorClasses[color] || colorClasses.teal 
              : "text-gray-500 hover:text-gray-900 hover:bg-white/80"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default TimeFrameSelector