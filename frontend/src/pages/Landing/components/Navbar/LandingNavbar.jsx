import React from "react";

function LandingNavbar() {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#1B5E20]">
          VIHDATACARE
        </div>

        {/* Links */}
        <div className="space-x-6">
          <a
            href="/login"
            className="text-gray-700 hover:text-[#1B5E20] transition"
          >
            Login
          </a>

          <a
            href="/signup"
            className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#145A32] transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
