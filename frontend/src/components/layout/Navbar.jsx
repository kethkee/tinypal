import { Link } from "react-router-dom";
import Button from "../../ui/Button";

function Navbar() {
  return <nav className="border-b border-gray-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link to="/" className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">T</span><span className="text-lg font-semibold text-gray-900">TinyPal</span></Link><div className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex"><a href="#features" className="hover:text-indigo-600">Features</a><a href="#how-it-works" className="hover:text-indigo-600">How it works</a></div><div className="flex gap-2"><Link to="/login"><Button variant="ghost" className="min-h-9 px-3">Log in</Button></Link><Link to="/signup"><Button className="min-h-9 px-3">Get started</Button></Link></div></div></nav>;
}
export default Navbar;
