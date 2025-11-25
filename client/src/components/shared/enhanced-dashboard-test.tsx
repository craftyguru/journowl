import React from "react";

// Simple test component to isolate the white screen issue
export default function EnhancedDashboardTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard Test</h1>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Modular Dashboard Loading Test
          </h2>
          <p className="text-gray-600">
            If you can see this, the basic React rendering is working.
            The issue is likely in one of the modular components.
          </p>
        </div>
      </div>
    </div>
  );
}