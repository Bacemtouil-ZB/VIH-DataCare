import React from "react";

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-white text-[#1B5E20] px-6 text-center"
>
      {/* Titre */}
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        Bienvenue sur VIHDATACARE
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl max-w-2xl mb-6">
        Simplifiez la gestion des patients grâce à un système moderne et facile à utiliser pour les professionnels de santé.
      </p>

      {/* Bouton CTA */}
      <a
        href="/signup"
        className="px-8 py-3 bg-white text-[#1B5E20] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
      >
        Commencer
      </a>
    </section>
  );
}

export default Hero;
