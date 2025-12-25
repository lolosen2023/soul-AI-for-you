import React from 'react';
import { AppMode } from '../types';

interface StarryBackgroundProps {
  mode: AppMode;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ mode }) => {
  // Determine gradient based on mode
  let bgGradient = "from-cosmic-dark via-cosmic-mid to-cosmic-dark"; // Default
  let orbColor1 = "bg-mystic-purple";
  let orbColor2 = "bg-blue-900";

  switch (mode) {
    case AppMode.Daily:
      bgGradient = "from-[#1a0b00] via-[#4a2c0f] to-[#1a0b00]"; // Warm Gold/Brown
      orbColor1 = "bg-orange-600";
      orbColor2 = "bg-yellow-700";
      break;
    case AppMode.Tarot:
      bgGradient = "from-[#0f0518] via-[#2d1b4e] to-[#0f0518]"; // Deep Purple
      orbColor1 = "bg-purple-600";
      orbColor2 = "bg-indigo-900";
      break;
    case AppMode.Natal:
      bgGradient = "from-[#00101a] via-[#0f2e40] to-[#00101a]"; // Deep Cyan/Blue
      orbColor1 = "bg-cyan-700";
      orbColor2 = "bg-teal-900";
      break;
    case AppMode.Meditation:
      bgGradient = "from-[#021a1a] via-[#0f3d3d] to-[#021a1a]"; // Deep Teal/Green
      orbColor1 = "bg-teal-600";
      orbColor2 = "bg-emerald-800";
      break;
    case AppMode.Chat:
      bgGradient = "from-[#1a0510] via-[#401a2b] to-[#1a0510]"; // Deep Pink/Red
      orbColor1 = "bg-pink-700";
      orbColor2 = "bg-rose-900";
      break;
    default:
      break;
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-1000 ease-in-out bg-cosmic-dark">
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} opacity-80 transition-colors duration-1000`} />
      
      {/* CSS Stars */}
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-70 animate-pulse-slow"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2.5 + 1}px`,
            height: `${Math.random() * 2.5 + 1}px`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255,255,255,0.8)`
          }}
        />
      ))}
      
      {/* Nebula Cloud Effect - Dynamic Colors */}
      <div className={`absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 animate-float transition-colors duration-1000 ${orbColor1}`} />
      <div className={`absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[150px] opacity-20 animate-float transition-colors duration-1000 ${orbColor2}`} style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default StarryBackground;
