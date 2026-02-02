import React from "react";

function LandingNavbar() {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">VIHDATACARE</div>
        <div className="space-x-6">
          <a href="/login" className="text-gray-700 hover:text-blue-600 transition">Login</a>
          <a href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Sign Up</a>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
