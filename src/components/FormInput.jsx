export function FormInput({ label, required, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white outline-none transition-all duration-200 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(225,29,72,.08)] placeholder:text-gray-300 font-[inherit]"
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}

export function FormSelect({ label, required, error, children, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white outline-none transition-all duration-200 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(225,29,72,.08)] font-[inherit] cursor-pointer"
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}

export function FormTextarea({ label, required, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white outline-none transition-all duration-200 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(225,29,72,.08)] resize-y min-h-[90px] font-[inherit] placeholder:text-gray-300"
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}
