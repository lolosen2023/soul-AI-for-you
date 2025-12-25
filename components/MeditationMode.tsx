import React, { useState, useEffect } from 'react';
import { generateMantra } from '../services/geminiService';
import { soundManager } from '../services/soundService';
import { Wind, Play, Pause, RefreshCw } from 'lucide-react';

const MeditationMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [mantra, setMantra] = useState<string>("点击开始，获取今日灵性真言");
  const [loadingMantra, setLoadingMantra] = useState(false);
  const [timer, setTimer] = useState(0);

  // Breathing Cycle Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isActive) {
      // 4-4-4 Breathing box technique simplified for UI
      // Total cycle 12s: 4s Inhale, 4s Hold, 4s Exhale
      
      const cycle = () => {
         setPhase('Inhale');
         setTimeout(() => {
           if(isActive) setPhase('Hold');
         }, 4000);
         setTimeout(() => {
            if(isActive) setPhase('Exhale');
         }, 8000);
      };

      cycle();
      interval = setInterval(cycle, 12000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // General Timer
  useEffect(() => {
      let interval: ReturnType<typeof setInterval> | undefined;
      if (isActive) {
          interval = setInterval(() => setTimer(t => t + 1), 1000);
      }
      return () => clearInterval(interval);
  }, [isActive]);

  const toggleSession = async () => {
    soundManager.play('click');
    if (!isActive) {
      if (mantra.includes("点击开始")) {
          await getNewMantra();
      }
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const getNewMantra = async () => {
    soundManager.play('click');
    setLoadingMantra(true);
    const newMantra = await generateMantra();
    soundManager.play('magic');
    setMantra(newMantra);
    setLoadingMantra(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full p-4 relative overflow-hidden">
      
      {/* Background Ambience Visuals */}
      <div className={`absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 transition-opacity duration-[4000ms] ${phase === 'Inhale' ? 'opacity-80' : 'opacity-40'}`}></div>

      <h2 className="text-3xl font-display text-white mb-8 tracking-widest z-10 opacity-80">
        星空冥想
      </h2>

      {/* Breathing Circle Container */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-12">
        
        {/* Outer Glow Ring */}
        <div 
          className={`absolute rounded-full border border-white/10 transition-all duration-[4000ms] ease-in-out bg-white/5 backdrop-blur-sm
            ${isActive && phase === 'Inhale' ? 'w-80 h-80 opacity-50' : 'w-48 h-48 opacity-20'}
            ${isActive && phase === 'Hold' ? 'scale-105 border-gold-accent/30' : ''}
          `}
        />

        {/* Inner Core Circle */}
        <div 
          className={`relative z-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_50px_rgba(124,58,237,0.5)] flex items-center justify-center transition-all duration-[4000ms] ease-in-out
             ${isActive && phase === 'Inhale' ? 'scale-150 shadow-[0_0_80px_rgba(255,215,0,0.4)]' : 'scale-100'}
             ${isActive && phase === 'Exhale' ? 'scale-75 opacity-80' : 'opacity-100'}
          `}
        >
          <span className="text-white font-serif text-lg tracking-widest">
            {isActive ? (phase === 'Inhale' ? '吸气' : phase === 'Hold' ? '保持' : '呼气') : '准备'}
          </span>
        </div>

        {/* Particles (CSS only simple representation) */}
        {isActive && (
             <div className="absolute inset-0 animate-spin-slow opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>
             </div>
        )}
      </div>

      {/* Mantra Display */}
      <div className="z-10 text-center max-w-md mb-10 h-24 flex items-center justify-center px-4">
         {loadingMantra ? (
             <div className="flex items-center gap-2 text-gray-400">
                 <RefreshCw className="animate-spin" size={16} /> 正在接收宇宙讯息...
             </div>
         ) : (
             <p className={`text-xl md:text-2xl font-serif text-gold-accent leading-relaxed transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-70 blur-[0.5px]'}`}>
                "{mantra}"
             </p>
         )}
      </div>

      {/* Controls */}
      <div className="z-10 flex flex-col items-center gap-4">
         <div className="flex items-center gap-6">
            <button 
                onClick={toggleSession}
                className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white"
            >
                {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            
            <button 
                onClick={getNewMantra}
                className="w-12 h-12 rounded-full bg-transparent border border-white/10 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent/50 transition-all text-gray-400"
                title="更换真言"
            >
                <RefreshCw size={20} />
            </button>
         </div>
         
         {isActive && (
             <div className="text-gray-400 font-mono text-sm mt-2">
                 {formatTime(timer)}
             </div>
         )}
      </div>

    </div>
  );
};

export default MeditationMode;
