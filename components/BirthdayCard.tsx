"use client";

import { motion } from "framer-motion";

export default function BirthdayCard() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
    >
      <h1 className="text-4xl font-bold text-purple-900 mb-4">Happy Birthday Angelica! 🎂</h1>
      <p className="text-lg text-purple-800">
        Wishing you a day filled with joy and wonderful moments!
      </p>
    </motion.div>
  );
}
