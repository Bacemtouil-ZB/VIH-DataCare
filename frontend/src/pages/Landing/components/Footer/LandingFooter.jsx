import React from "react";

function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-blue-300 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-500 transition">Privacy</a>
          <a href="#" className="hover:text-blue-500 transition">Terms</a>
          <a href="#" className="hover:text-blue-500 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
