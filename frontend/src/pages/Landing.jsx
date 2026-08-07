import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Stats from "../components/sections/Stats";
import HowItWorks from "../components/sections/HowItWorks";
import WhyTinyPal from "../components/sections/WhyTinyPal";
import CTA from "../components/sections/CTA";
import Footer from "../components/sections/Footer";

function Landing() {
  return (
    <div className="bg-[#FAFAFC] text-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <WhyTinyPal />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;
