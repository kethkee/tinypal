function Button({
  children,
  variant = "primary",
  onClick,
}) {

  const base =
    "px-6 py-3 rounded-2xl font-semibold transition-all duration-300";

  const variants = {

    primary:
      "bg-[#FF5A5F] text-white hover:bg-[#E94A50] shadow-lg",

    secondary:
      "border-2 border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FFF1F2]",

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