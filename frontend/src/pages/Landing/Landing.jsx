import React from "react";
import LandingNavbar from "./components/Navbar/LandingNavbar.jsx";
import Hero from "./components/sections/Hero/Hero.jsx";
import LandingFooter from "./components/Footer/LandingFooter.jsx";

function Landing() {
  return (
    <>
      <LandingNavbar />
      <main className="pt-20">
        <Hero />
      </main>
      <LandingFooter />
    </>
  );
}

export default Landing;
