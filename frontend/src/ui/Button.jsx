import { motion } from "framer-motion";

const variants = {
  primary: "bg-indigo-500 text-white shadow-sm hover:bg-indigo-600",
  secondary: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "text-red-600 hover:bg-red-50",
};
function Button({ children, onClick, variant = "primary", type = "button", className = "", disabled = false }) {
  return <motion.button whileHover={disabled ? {} : { y: -1 }} whileTap={disabled ? {} : { scale: 0.98 }} type={type} onClick={onClick} disabled={disabled} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>{children}</motion.button>;
}
export default Button;
