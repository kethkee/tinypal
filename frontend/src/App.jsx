import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import Stats from "./components/sections/Stats";
import HowItWorks from "./components/sections/HowItWorks";
import WhyTinyPal from "./components/sections/WhyTinyPal";

function App() {
  return (
    <div className="bg-[#FFF8F0]">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <WhyTinyPal />
    </div>
  );
}

export default App;