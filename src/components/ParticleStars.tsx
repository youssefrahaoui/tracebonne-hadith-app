import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Star {
  id: number;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number; // size in px
  duration: number; // duration in seconds
  delay: number; // delay in seconds
  minOpacity: number;
  maxOpacity: number;
}

export const ParticleStars: React.FC = () => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.2, // 1.2px - 3.7px
      duration: Math.random() * 3 + 2.5, // 2.5s - 5.5s
      delay: Math.random() * 3,
      minOpacity: Math.random() * 0.15 + 0.1,
      maxOpacity: Math.random() * 0.65 + 0.35,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [star.minOpacity, star.maxOpacity, star.minOpacity],
            y: [0, -10, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
