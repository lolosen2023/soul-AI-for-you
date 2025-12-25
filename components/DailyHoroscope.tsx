import React, { useState, useEffect, useRef } from 'react';
import { DailyHoroscopeData, ZodiacSign } from '../types';
import { getDailyHoroscope } from '../services/geminiService';
import { soundManager } from '../services/soundService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Loader2, Sparkles, Heart, Briefcase, DollarSign, Activity, ChevronRight, ChevronLeft } from 'lucide-react';

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  [ZodiacSign.Aries]: "♈",
  [ZodiacSign.Taurus]: "♉",
  [ZodiacSign.Gemini]: "♊",
  [ZodiacSign.Cancer]: "♋",
  [ZodiacSign.Leo]: "♌",
  [ZodiacSign.Virgo]: "♍",
  [ZodiacSign.Libra]: "♎",
  [ZodiacSign.Scorpio]: "♏",
  [ZodiacSign.Sagittarius]: "♐",
  [ZodiacSign.Capricorn]: "♑",
  [ZodiacSign.Aquarius]: "♒",
  [ZodiacSign.Pisces]: "♓",
};

const DailyHoroscope: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(ZodiacSign.Aries);
  const [data, setData] = useState<DailyHoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHoroscope();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSign]);

  const fetchHoroscope = async () => {
    setLoading(true);
    // Add artificial delay for animation smoothness
    await new Promise(r => setTimeout(r, 500));
    try {
      const result = await getDailyHoroscope(selectedSign);
      setData(result);
      if(result) soundManager.play('success');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    soundManager.play('click');
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSignSelect = (sign: ZodiacSign) => {
    soundManager.play('click');
    setSelectedSign(sign);
  };

  const chartData = data ? [
    { subject: '爱情', A: data.loveScore, fullMark: 100 },
    { subject: '事业', A: data.careerScore, fullMark: 100 },
    { subject: '财富', A: data.wealthScore, fullMark: 100 },
    { subject: '健康', A: data.healthScore, fullMark: 100 },
  ] : [];

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] w-full p-4 space-y-8 animate-fade-in pb-24">
      <div className="text-center space-y-2 mt-4">
         <h2 className="text-4xl font-display text-white tracking-widest drop-shadow-glow">
            <span className="text-gold-accent">✦</span> 星象指引 <span className="text-gold-accent">✦</span>
         </h2>
         <p className="text-purple-200 font-serif opacity-80">连接宇宙能量，解读今日运程</p>
      </div>

      {/* Animated Zodiac Selector */}
      <div className="relative w-full max-w-4xl px-8">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-gold-accent hover:bg-gold-accent hover:text-black transition-colors backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide py-6 px-4 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Object.values(ZodiacSign).map((sign) => {
            const isSelected = selectedSign === sign;
            return (
              <button
                key={sign}
                onClick={() => handleSignSelect(sign as ZodiacSign)}
                className={`flex-shrink-0 snap-center flex flex-col items-center justify-center w-24 h-32 rounded-2xl transition-all duration-500 relative group
                  ${isSelected 
                    ? 'bg-gradient-to-b from-purple-900 to-indigo-900 border-2 border-gold-accent shadow-[0_0_30px_rgba(255,215,0,0.3)] scale-110 -translate-y-2' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-accent/50 scale-100'
                  }`}
              >
                <div className={`text-5xl mb-2 transition-transform duration-500 ${isSelected ? 'scale-110 text-gold-accent drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-gray-400 group-hover:text-purple-200'}`}>
                  {ZODIAC_SYMBOLS[sign as ZodiacSign]}
                </div>
                <span className={`text-sm font-serif ${isSelected ? 'text-white font-bold' : 'text-gray-500'}`}>{sign}</span>
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-gold-accent ring-opacity-50 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-gold-accent hover:bg-gold-accent hover:text-black transition-colors backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-3xl flex flex-col items-center space-y-6 animate-pulse">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-gold-accent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
          </div>
          <p className="text-purple-300 font-serif text-lg">正在观测天体运行...</p>
        </div>
      ) : data ? (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          
          {/* 1. Radar Chart Card */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center min-h-[350px] lg:col-span-1 border-t-4 border-t-purple-500 hover:shadow-[0_0_30px_rgba(157,78,221,0.2)] transition-shadow duration-500">
            <h3 className="text-xl font-serif text-purple-200 mb-2 flex items-center gap-2">
              <Activity size={18} /> 能量分布
            </h3>
            <div className="w-full h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 12, fontFamily: 'Noto Serif SC' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={selectedSign}
                  dataKey="A"
                  stroke="#ffd700"
                  strokeWidth={2}
                  fill="#9d4edd"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
            </div>
            {/* Quick Scores */}
            <div className="grid grid-cols-4 gap-2 w-full mt-4">
                <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                    <Heart size={16} className="text-pink-400 mb-1" />
                    <span className="text-sm font-bold">{data.loveScore}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                    <Briefcase size={16} className="text-blue-400 mb-1" />
                    <span className="text-sm font-bold">{data.careerScore}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                    <DollarSign size={16} className="text-yellow-400 mb-1" />
                    <span className="text-sm font-bold">{data.wealthScore}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                    <Activity size={16} className="text-green-400 mb-1" />
                    <span className="text-sm font-bold">{data.healthScore}</span>
                </div>
            </div>
          </div>

          {/* 2. Main Summary Card */}
          <div className="glass-panel rounded-3xl p-8 lg:col-span-2 flex flex-col justify-between border-t-4 border-t-gold-accent relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-shadow duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 rotate-12">
                <Sparkles size={150} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-gold-accent/20 flex items-center justify-center">
                    <Sparkles className="text-gold-accent" size={20} />
                 </div>
                 <h3 className="text-2xl font-serif text-white">今日神谕</h3>
              </div>
              <p className="text-gray-100 leading-loose text-lg font-serif italic opacity-90 indent-8 relative">
                <span className="text-4xl text-gold-accent absolute -top-4 -left-4 opacity-50">“</span>
                {data.summary}
                <span className="text-4xl text-gold-accent absolute -bottom-8 opacity-50">”</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10">
               {[
                 { label: "幸运色", val: data.luckyColor, color: "text-purple-300" },
                 { label: "幸运数", val: data.luckyNumber, color: "text-gold-accent" },
                 { label: "幸运物", val: data.luckyItem || "水晶", color: "text-pink-300" },
                 { label: "速配", val: data.compatibility || "双子座", color: "text-blue-300" },
               ].map((item, idx) => (
                 <div key={idx} className="bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">{item.label}</span>
                    <span className={`text-lg font-bold ${item.color}`}>{item.val}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* 3. Actionable Advice (Full Width) */}
          <div className="lg:col-span-3">
             <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-8 rounded-3xl border border-white/10 shadow-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-accent via-purple-500 to-gold-accent opacity-50"></div>
                
                <div className="bg-black/30 p-4 rounded-full shrink-0 border border-gold-accent/30 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                    <Sparkles className="text-gold-accent animate-pulse" size={32} />
                </div>
                <div className="text-center md:text-left">
                    <h4 className="text-gold-accent font-bold uppercase tracking-[0.2em] text-sm mb-2">星灵建议</h4>
                    <p className="text-white text-xl font-medium font-serif">{data.advice}</p>
                </div>
             </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};

export default DailyHoroscope;
