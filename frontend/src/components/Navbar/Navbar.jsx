import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FFF8F0]/90 backdrop-blur-md border-b border-red-100">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-3xl font-black text-red-500"
        >
          🌸 TinyPal
        </Link>

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="hover:text-red-500 transition"
          >
            Home
          </Link>

          <a
            href="#features"
            className="hover:text-red-500 transition"
          >
            Features
          </a>

          <Link
            to="/login"
            className="hover:text-red-500 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-xl"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;