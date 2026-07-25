import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import Stats from "./components/sections/Stats";

function App() {
  return (
    <div className="bg-[#FFF8F0]">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
    </div>
  );
}

export default App;