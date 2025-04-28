"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedContainer({ children, keyProp }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
