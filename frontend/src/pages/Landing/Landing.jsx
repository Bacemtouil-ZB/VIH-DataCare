import React from "react";
import LandingNavbar from "./components/Navbar/LandingNavbar.jsx";
import Hero from "./components/sections/Hero/Hero.jsx";
import AboutSection from "./components/sections/About/AboutSection.jsx";
import FeaturesSection from "./components/sections/Features/FeaturesSection.jsx";
import TrustSection from "./components/sections/Trust/TrustSection.jsx";
import LandingFooter from "./components/Footer/LandingFooter.jsx";

function Landing() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(200,230,201,0.35),_transparent_28%),linear-gradient(to_bottom,_#f8fafc,_#ffffff_22%,_#f8fafc)] text-slate-900 [&_a]:!no-underline">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#E8F5E9]/70 blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 bottom-32 h-80 w-80 rounded-full bg-[#C8E6C9]/50 blur-[110px]" />

      <LandingNavbar />
      <div className="relative z-8 pt-20 md:pt-15">
        <Hero />
        <div className="mx-auto h-px w-[min(72rem,92%)] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <AboutSection />
        <div className="mx-auto h-px w-[min(72rem,92%)] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <FeaturesSection />
        <div className="mx-auto h-px w-[min(72rem,92%)] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <TrustSection />
      </div>
      <LandingFooter />
    </div>
  );
}

export default Landing;
