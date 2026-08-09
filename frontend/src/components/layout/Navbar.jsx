import { Link } from "react-router-dom";
import Button from "../../ui/Button";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
            T
          </span>

          <span className="text-lg font-semibold tracking-tight text-gray-900">
            TinyPal
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-indigo-600"
          >
            Features
          </a>

          <a
            href="#cta"
            className="transition-colors hover:text-indigo-600"
          >
            Get started
          </a>
        </div>

        <div className="flex gap-2">
          <Link to="/login">
            <Button
              variant="ghost"
              className="min-h-9 px-3"
            >
              Log in
            </Button>
          </Link>

          <Link to="/signup">
            <Button className="min-h-9 px-4">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;