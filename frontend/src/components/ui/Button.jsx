function Button({
  children,
  variant = "primary",
  onClick,
}) {

  const base =
    "px-6 py-3 rounded-2xl font-semibold transition-all duration-300";

  const variants = {

    primary:
      "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg",

    secondary:
      "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50",

  };

  return (

    <button
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >

      {children}

    </button>

  );
}

export default Button;
