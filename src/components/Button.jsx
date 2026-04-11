export default function Button({ children, variant = "primary", size = "md", disabled, onClick, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 cursor-pointer border-none font-[inherit] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants = {
    primary: "text-white hover:-translate-y-0.5 active:scale-95",
    secondary: "hover:-translate-y-0.5 active:scale-95",
    outline: "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 active:scale-95",
    ghost: "bg-transparent text-red-600 hover:bg-red-50 active:scale-95",
    danger: "text-red-700 bg-red-50 hover:bg-red-100 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
    xl: "px-10 py-4 text-lg",
  };

  const primaryStyle = variant === "primary"
    ? { background: "linear-gradient(135deg,#e11d48,#9f1239)", boxShadow: "0 8px 32px rgba(193,21,42,.25)" }
    : variant === "secondary"
    ? { background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.3)", color: "white", backdropFilter: "blur(8px)" }
    : {};

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={primaryStyle}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
