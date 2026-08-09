import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import CTA from "../components/sections/CTA";
import Footer from "../components/sections/Footer";

function Landing() {
  return (
    <div className="tiny-page">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default Landing;