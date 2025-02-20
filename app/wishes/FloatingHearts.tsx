"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        delay: Math.random() * 10,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ 
            opacity: 0,
            y: "100vh",
            x: heart.x,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: "-100vh",
            transition: {
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: heart.delay,
            }
          }}
        >
          <Heart className="text-pink-500/20" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}
