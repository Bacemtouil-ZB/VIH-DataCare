import React from "react";
import LandingNavbar from "./components/Navbar/LandingNavbar.jsx";
import Hero from "./components/sections/Hero/Hero.jsx";
import AboutSection from "./components/sections/About/AboutSection.jsx";
import FeaturesSection from "./components/sections/Features/FeaturesSection.jsx";
import TrustSection from "./components/sections/Trust/TrustSection.jsx";
import LandingFooter from "./components/Footer/LandingFooter.jsx";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 [&_a]:!no-underline">
      <LandingNavbar />
      <div className="pt-20">
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
