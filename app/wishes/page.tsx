"use client";

import { motion } from "framer-motion";

export default function WishesPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-purple-200 to-indigo-200 p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold text-purple-900 mb-8">Birthday Wishes for Angelica 💝</h1>
        <div className="space-y-6">
          {/* Add birthday wishes here */}
          <p className="text-xl text-purple-800">Coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
}
