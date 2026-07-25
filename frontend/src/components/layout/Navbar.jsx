import Button from "../ui/Button";

function Navbar() {
  return (
    <nav className="bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-2 cursor-pointer">

          <span className="text-3xl">🌸</span>

          <div>

            <h1 className="text-2xl font-black text-gray-900">
              TinyPal
            </h1>

            <p className="text-xs text-gray-500 -mt-1">
              Your Tiny Study Companion
            </p>

          </div>

        </div>

        {/* Navigation */}

        <ul className="hidden md:flex gap-10 font-medium text-gray-700">

          <li className="cursor-pointer hover:text-[#FF5A5F] transition">
            Home
          </li>

          <li className="cursor-pointer hover:text-[#FF5A5F] transition">
            Features
          </li>

          <li className="cursor-pointer hover:text-[#FF5A5F] transition">
            About
          </li>

        </ul>

        {/* Buttons */}

        <div className="flex gap-4">

          <Button variant="secondary">
            Login
          </Button>

          <Button>
            Sign Up
          </Button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;