function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5",
    secondary:
      "border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;