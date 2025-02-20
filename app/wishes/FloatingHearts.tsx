import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            y: "100vh",
            x: Math.random() * window.innerWidth,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: "-100vh",
            transition: {
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
            }
          }}
        >
          <Heart className="text-pink-500/20" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}
