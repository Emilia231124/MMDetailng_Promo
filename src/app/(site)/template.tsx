"use client";

import { motion } from "framer-motion";

// Этот файл — стандартный способ добавить page transitions в Next.js App Router.
// template.tsx ре-маунтируется при каждой навигации (в отличие от layout.tsx),
// что позволяет AnimatePresence анимировать переходы между страницами.

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
