"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const generateSparkles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
  }));
};

export function Sparkles() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; size: number; delay: number }>>([]);

  useEffect(() => {
    setSparkles(generateSparkles(15));
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full h-6 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute bottom-0 w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${sparkle.x}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
          animate={{
            y: [-20, -40],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}
