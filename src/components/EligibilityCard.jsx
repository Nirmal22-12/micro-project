/**
 * EligibilityCard
 * values[key] = null  → unanswered (required — highlighted if showErrors)
 * values[key] = false → No  (safe, green)
 * values[key] = true  → Yes (disqualifying, red/amber)
 */
export function EligibilityCard({ title, subtitle, items, type, values, onChange, showErrors }) {
  const isPerm = type === "permanent";

  return (
    <div
      className="rounded-[18px] p-6 border-2"
      style={
        isPerm
          ? { background: "linear-gradient(135deg,#fff5f5,#ffe4e6)", borderColor: "#fecdd3" }
          : { background: "linear-gradient(135deg,#fffbeb,#fef3c7)", borderColor: "#fde68a" }
      }
    >
      <h3 className={`text-base font-bold mb-1 flex items-center gap-2 ${isPerm ? "text-red-900" : "text-amber-900"}`}>
        {isPerm ? "🚫" : "⏳"} {title}
      </h3>
      <p className="text-xs text-gray-500 mb-5">{subtitle}</p>

      <div className="flex flex-col gap-3">
        {items.map(({ key, label }) => {
          const val = values[key];
          const unanswered = val === null || val === undefined;
          const isYes = val === true;
          const isNo  = val === false;
          const needsAnswer = showErrors && unanswered;

          return (
            <div
              key={key}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border: `2px solid ${
                  needsAnswer ? "#fca5a5" :
                  isYes ? (isPerm ? "#fca5a5" : "#fcd34d") :
                  isNo  ? "#86efac" :
                  "#f3f4f6"
                }`,
              }}
            >
              {/* Label row */}
              <div className="px-4 py-3 flex items-start gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 transition-colors duration-300"
                  style={{
                    background: needsAnswer ? "#ef4444" :
                      unanswered ? "#d1d5db" :
                      isYes ? (isPerm ? "#e11d48" : "#f59e0b") :
                      "#22c55e"
                  }}
                />
                <span className="text-sm font-medium text-gray-800 flex-1 leading-5">{label}</span>
                {!unanswered && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: isNo ? "#dcfce7" : isPerm ? "#fee2e2" : "#fef3c7",
                      color:      isNo ? "#166534" : isPerm ? "#991b1b" : "#92400e",
                    }}
                  >
                    {isNo ? "✓ No" : "✓ Yes"}
                  </span>
                )}
                {needsAnswer && (
                  <span className="text-[10px] font-bold text-red-500 flex-shrink-0">Required</span>
                )}
              </div>

              {/* Yes / No buttons */}
              <div className="grid grid-cols-2" style={{ borderTop: "1px solid #f3f4f6" }}>
                {/* NO */}
                <button
                  type="button"
                  onClick={() => onChange(key, false)}
                  className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold border-none cursor-pointer font-[inherit] transition-all duration-200"
                  style={{
                    background: isNo ? "#dcfce7" : "transparent",
                    color:      isNo ? "#166534" : "#9ca3af",
                    borderRight: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      border: `2px solid ${isNo ? "#22c55e" : "#d1d5db"}`,
                      background: isNo ? "#22c55e" : "transparent",
                    }}
                  >
                    {isNo && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  No
                </button>

                {/* YES */}
                <button
                  type="button"
                  onClick={() => onChange(key, true)}
                  className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold border-none cursor-pointer font-[inherit] transition-all duration-200"
                  style={{
                    background: isYes ? (isPerm ? "#fee2e2" : "#fef3c7") : "transparent",
                    color:      isYes ? (isPerm ? "#991b1b" : "#92400e") : "#9ca3af",
                  }}
                >
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      border: `2px solid ${isYes ? (isPerm ? "#e11d48" : "#f59e0b") : "#d1d5db"}`,
                      background: isYes ? (isPerm ? "#e11d48" : "#f59e0b") : "transparent",
                    }}
                  >
                    {isYes && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  Yes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section-level warning */}
      {showErrors && items.some(({ key }) => values[key] === null || values[key] === undefined) && (
        <p className="mt-4 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2">
          ⚠ Please answer all questions in this section to continue.
        </p>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const configs = {
    eligible: {
      wrapper: "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300",
      icon: "bg-green-100", emoji: "✅",
      titleClass: "text-green-800", title: "Eligible to Donate",
      msgClass: "text-green-700",
      msg: "You have answered all eligibility questions and meet all requirements. You may proceed with registration.",
    },
    temporary: {
      wrapper: "bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300",
      icon: "bg-amber-100", emoji: "⚠️",
      titleClass: "text-amber-900", title: "Temporarily Ineligible",
      msgClass: "text-amber-700",
      msg: "You can donate after full recovery or the required waiting period. Please check back when you feel better.",
    },
    permanent: {
      wrapper: "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300",
      icon: "bg-red-100", emoji: "⛔",
      titleClass: "text-red-900", title: "Not Eligible — Permanent Disqualification",
      msgClass: "text-red-700",
      msg: "One or more conditions permanently disqualify you from donating blood. Please consult a healthcare professional.",
    },
    unanswered: {
      wrapper: "bg-gray-50 border-2 border-gray-200",
      icon: "bg-gray-100", emoji: "📋",
      titleClass: "text-gray-700", title: "Eligibility Check Incomplete",
      msgClass: "text-gray-500",
      msg: "Please answer all Yes / No questions above to see your eligibility status and enable the submit button.",
    },
  };

  const c = configs[status] ?? configs.unanswered;

  return (
    <div className={`rounded-[18px] p-6 flex items-center gap-5 transition-all duration-300 ${c.wrapper}`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${c.icon}`}>
        {c.emoji}
      </div>
      <div>
        <p className={`text-base font-bold mb-1 ${c.titleClass}`}>{c.title}</p>
        <p className={`text-sm ${c.msgClass}`}>{c.msg}</p>
      </div>
    </div>
  );
}
