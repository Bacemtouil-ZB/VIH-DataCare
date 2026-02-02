import React from "react";

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to MyApp</h1>
      <p className="text-lg max-w-xl mb-6">
        Simplify patient management with a modern, easy-to-use system for healthcare professionals.
      </p>
      <a
        href="/signup"
        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Get Started
      </a>
    </section>
  );
}

export default Hero;
