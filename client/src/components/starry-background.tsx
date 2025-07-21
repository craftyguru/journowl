import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  flickerSpeed: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}

export const StarryBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Generate initial stars
  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 200; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          brightness: Math.random() * 0.8 + 0.2,
          flickerSpeed: Math.random() * 3 + 1,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  // Generate shooting stars periodically
  useEffect(() => {
    const generateShootingStar = () => {
      const newShootingStar: ShootingStar = {
        id: Date.now(),
        startX: Math.random() * 100,
        startY: Math.random() * 30, // Start from upper portion
        endX: Math.random() * 100,
        endY: Math.random() * 70 + 30, // End in lower portion
        duration: Math.random() * 2 + 1,
      };

      setShootingStars(prev => [...prev, newShootingStar]);

      // Remove shooting star after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== newShootingStar.id));
      }, newShootingStar.duration * 1000);
    };

    const interval = setInterval(generateShootingStar, Math.random() * 5000 + 3000); // Every 3-8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden pointer-events-none">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-gray-900/40" />
      
      {/* Regular stars with flickering animation */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: `rgba(255, 255, 255, ${star.brightness})`,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
          }}
          animate={{
            opacity: [star.brightness * 0.4, star.brightness, star.brightness * 0.4],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: star.flickerSpeed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((shootingStar) => (
        <motion.div
          key={shootingStar.id}
          className="absolute"
          style={{
            left: `${shootingStar.startX}%`,
            top: `${shootingStar.startY}%`,
          }}
          animate={{
            x: `${(shootingStar.endX - shootingStar.startX) * window.innerWidth / 100}px`,
            y: `${(shootingStar.endY - shootingStar.startY) * window.innerHeight / 100}px`,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: shootingStar.duration,
            ease: "easeOut",
          }}
        >
          {/* Shooting star trail */}
          <div className="relative">
            <div 
              className="absolute bg-gradient-to-r from-transparent via-white to-transparent h-0.5 w-16 blur-sm"
              style={{
                transform: `rotate(${Math.atan2(
                  shootingStar.endY - shootingStar.startY,
                  shootingStar.endX - shootingStar.startX
                ) * 180 / Math.PI}deg)`,
                transformOrigin: 'left center',
              }}
            />
            {/* Shooting star head */}
            <div 
              className="absolute w-1 h-1 bg-white rounded-full blur-none"
              style={{
                boxShadow: '0 0 6px #ffffff, 0 0 12px #ffffff, 0 0 18px #ffffff',
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Constellation lines (subtle) */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="constellation" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path
              d="M10,10 L50,30 L90,20 L70,60 L30,70 Z"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#constellation)" />
      </svg>

      {/* Twinkling effect overlay */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`twinkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};