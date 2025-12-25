import React from 'react';
import { AppMode } from '../types';
import { Sparkles, Moon, Sun, MessageCircle, HeartHandshake, Wind } from 'lucide-react';
import { soundManager } from '../services/soundService';

interface NavbarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.Home, label: '星域', icon: <Sparkles size={20} /> },
    { mode: AppMode.Daily, label: '运势', icon: <Sun size={20} /> },
    { mode: AppMode.Tarot, label: '塔罗', icon: <Moon size={20} /> },
    { mode: AppMode.Natal, label: '星盘', icon: <HeartHandshake size={20} /> }, 
    { mode: AppMode.Meditation, label: '冥想', icon: <Wind size={20} /> },
    { mode: AppMode.Chat, label: '神谕', icon: <MessageCircle size={20} /> },
  ];

  const handleNavClick = (mode: AppMode) => {
    soundManager.play('click');
    setMode(mode);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-50 glass-panel md:border-b border-t md:border-t-0 border-white/10 h-16 md:h-20">
      <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-8">
        <div className="hidden md:flex items-center space-x-2 text-2xl font-serif text-white tracking-widest cursor-pointer group" onClick={() => handleNavClick(AppMode.Home)}>
            <Sparkles className="text-gold-accent group-hover:rotate-12 transition-transform duration-500" />
            <span className="group-hover:text-gold-accent transition-colors">星穹神谕</span>
        </div>
        
        <div className="flex w-full md:w-auto justify-around md:justify-end md:space-x-4 lg:space-x-8">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => handleNavClick(item.mode)}
              className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-2 md:px-3 py-2 rounded-lg transition-all duration-300
                ${currentMode === item.mode 
                  ? 'text-gold-accent bg-white/10 scale-105 shadow-[0_0_15px_rgba(255,215,0,0.2)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {item.icon}
              <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
