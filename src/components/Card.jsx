/**
 * Generic Card component.
 * Accepts `variant` prop: "default" | "elevated" | "flat" | "red"
 */
export default function Card({ children, variant = "default", className = "", onClick, ...props }) {
  const base =
    "bg-white rounded-3xl border transition-all duration-300";

  const variants = {
    default: "border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,.05)]",
    elevated:
      "border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,.1)] hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(0,0,0,.14)] cursor-pointer",
    flat: "border-gray-100",
    red: "border-red-100 bg-gradient-to-br from-red-50 to-white",
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

/** Convenience sub-components */
export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-7 pt-7 pb-4 border-b border-gray-50 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-7 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`px-7 pb-7 pt-4 border-t border-gray-50 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
