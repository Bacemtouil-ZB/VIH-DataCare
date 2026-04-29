import React from "react";
import LandingNavbar from "./components/Navbar/LandingNavbar.jsx";
import Hero from "./components/sections/Hero/Hero.jsx";
import AboutSection from "./components/sections/About/AboutSection.jsx";
import FeaturesSection from "./components/sections/Features/FeaturesSection.jsx";
import TrustSection from "./components/sections/Trust/TrustSection.jsx";
import LandingFooter from "./components/Footer/LandingFooter.jsx";

function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(200,230,201,0.35),_transparent_28%),linear-gradient(to_bottom,_#f8fafc,_#ffffff_22%,_#f8fafc)] text-slate-900 [&_a]:!no-underline">
      <LandingNavbar />
      <div className="pt-24 md:pt-28">
        <Hero />
        <AboutSection />
        <FeaturesSection />
        <TrustSection />
      </div>
      <LandingFooter />
    </div>
  );
}

export default Landing;
