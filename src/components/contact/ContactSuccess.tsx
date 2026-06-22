"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ContactSuccessProps {
  /** Localized confirmation message (from next-intl). */
  message: string;
}

/*
 * Back face of the contact card, shown ONLY after a genuine webhook send.
 *  - An envelope-as-rocket (on-brand purple) flies upward and fades.
 *  - A green validation checkmark draws itself in and stays.
 *  - The localized message fades in below.
 * Under prefers-reduced-motion: the rocket is skipped and the check + message
 * render statically (the parent simply cross-fades to this face).
 *
 * Timeline note: when shown via the flip, a small base delay (B) holds the
 * sequence back ~0.35s so it begins just as the back face rotates into view.
 */
export const ContactSuccess = ({ message }: ContactSuccessProps) => {
  const reduce = useReducedMotion();
  const B = 0.35; // base delay so motion starts as the flip reveals this face

  return (
    <div className="flex flex-col items-center text-center">
      {/* Illustration stage — fixed box so the layout stays stable as the
          rocket flies out of it; overflow is allowed to bleed upward. */}
      <div className="relative mx-auto h-24 w-24">
        {/* Envelope-as-rocket — purely decorative, transient. */}
        {!reduce && (
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 48 60"
            className="absolute inset-x-0 top-2 mx-auto h-16 w-16"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0, 1, 1, 0], y: -48 }}
            transition={{ delay: B, duration: 1.2, ease: "easeIn", times: [0, 0.12, 0.55, 1] }}
          >
            <defs>
              <linearGradient id="contactRocketBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#b366ff" />
                <stop offset="1" stopColor="#941efe" />
              </linearGradient>
            </defs>
            {/* Exhaust flame */}
            <path d="M19 34 Q24 50 29 34 Z" fill="#f59e0b" />
            <path d="M21.5 34 Q24 43 26.5 34 Z" fill="#fcd34d" />
            {/* Envelope body */}
            <rect x="10" y="12" width="28" height="22" rx="4" fill="url(#contactRocketBody)" />
            {/* Envelope flap fold */}
            <path
              d="M11 15 L24 24 L37 15"
              fill="none"
              stroke="#0a0a0f"
              strokeOpacity="0.55"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}

        {/* Validation checkmark — persistent. */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 52 52"
          className="absolute inset-0 m-auto h-16 w-16"
          style={{ filter: "drop-shadow(0 0 10px rgba(34,197,94,0.35))" }}
        >
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { delay: B + 0.5, duration: 0.45, ease: "easeOut" }}
          />
          <motion.path
            d="M16 27 L23 34 L37 19"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { delay: B + 0.85, duration: 0.35, ease: "easeOut" }}
          />
        </motion.svg>
      </div>

      <motion.p
        role="status"
        aria-live="polite"
        className="text-text mx-auto mt-5 max-w-sm text-base leading-relaxed font-medium text-balance"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { delay: B + 1, duration: 0.4 }}
      >
        {message}
      </motion.p>
    </div>
  );
};
