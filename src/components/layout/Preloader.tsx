"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("mm-detailing-visited");
    if (visited) return;

    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("mm-detailing-visited", "true");
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-primary)] overflow-hidden"
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* MM letters */}
          <div className="flex" aria-hidden="true">
            {["M", "M"].map((letter, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  className="block font-display text-[15vw] font-bold leading-none text-[var(--accent-red)]"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.7,
                    ease: [0.2, 0, 0.2, 1],
                  }}
                >
                  {letter}
                </motion.span>
              </div>
            ))}
          </div>

          {/* DETAILING subtitle */}
          <motion.p
            className="mt-2 font-display text-[2.5vw] tracking-[0.5em] uppercase text-[var(--text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            DETAILING
          </motion.p>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--border)]">
            <motion.div
              className="h-full bg-[var(--accent-red)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
