import React from 'react'

const home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">Welcome to the ERP Construction</h1>
      <p className="text-lg text-gray-700 mb-8">
        This is your project home page. Use the navigation bar to explore more.
      </p>
      <button className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition">
        Get Started
      </button> 
    </div>
  )
}

export default home
