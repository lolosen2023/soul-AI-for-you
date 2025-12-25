import React, { useState } from 'react';
import { AppMode } from './types';
import StarryBackground from './components/StarryBackground';
import BackgroundMusic from './components/BackgroundMusic';
import Navbar from './components/Navbar';
import DailyHoroscope from './components/DailyHoroscope';
import TarotDeck from './components/TarotDeck';
import NatalChart from './components/NatalChart';
import AstroChat from './components/AstroChat';
import MeditationMode from './components/MeditationMode';
import { soundManager } from './services/soundService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Home);

  const handleModeSelect = (newMode: AppMode) => {
    soundManager.play('click');
    setMode(newMode);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.Daily:
        return <DailyHoroscope />;
      case AppMode.Tarot:
        return <TarotDeck />;
      case AppMode.Natal:
        return <NatalChart />;
      case AppMode.Chat:
        return <AstroChat />;
      case AppMode.Meditation:
        return <MeditationMode />;
      case AppMode.Home:
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in relative z-10 pb-24">
            {/* Hero Section */}
            <div className="mb-12 mt-10">
              <h1 className="text-6xl md:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-white to-gold-accent mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] animate-shimmer bg-[length:200%_100%]">
                星穹神谕
              </h1>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mb-6"></div>
              <p className="text-xl md:text-2xl font-serif text-purple-100 max-w-2xl mx-auto leading-relaxed opacity-90">
                探索宇宙的奥秘，解读命运的轨迹。<br/>
                <span className="text-sm md:text-base text-gray-400 mt-2 block">古老占星智慧与人工智能的共鸣</span>
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
               
               {/* Daily Horoscope */}
               <button 
                onClick={() => handleModeSelect(AppMode.Daily)}
                className="group relative overflow-hidden glass-panel p-8 rounded-2xl hover:border-gold-accent/50 transition-all duration-500 text-left hover:-translate-y-1"
               >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-bold font-display text-white mb-2 group-hover:text-gold-accent transition-colors">✦ 今日运势</h3>
                   <p className="text-gray-400 font-serif text-sm">解析每日星象能量，获取爱情、事业与财富的专属指引。</p>
                 </div>
               </button>

               {/* Tarot */}
               <button 
                onClick={() => handleModeSelect(AppMode.Tarot)}
                className="group relative overflow-hidden glass-panel p-8 rounded-2xl hover:border-purple-400/50 transition-all duration-500 text-left hover:-translate-y-1"
               >
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-display text-white mb-2 group-hover:text-purple-300 transition-colors">☾ 塔罗占卜</h3>
                    <p className="text-gray-400 font-serif text-sm">沉浸式 3D 抽牌体验，解答心中疑惑，洞悉过去与未来。</p>
                 </div>
               </button>
               
               {/* Natal Chart */}
               <button 
                onClick={() => handleModeSelect(AppMode.Natal)}
                className="group relative overflow-hidden glass-panel p-8 rounded-2xl hover:border-blue-400/50 transition-all duration-500 text-left hover:-translate-y-1"
               >
                 <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-display text-white mb-2 group-hover:text-cyan-300 transition-colors">◈ 深度星盘</h3>
                    <p className="text-gray-400 font-serif text-sm">输入出生信息，生成深度灵魂蓝图，发现真实的自我。</p>
                 </div>
               </button>

               {/* Meditation (New) */}
               <button 
                onClick={() => handleModeSelect(AppMode.Meditation)}
                className="group relative overflow-hidden glass-panel p-8 rounded-2xl hover:border-teal-400/50 transition-all duration-500 text-left hover:-translate-y-1 lg:col-span-2"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold font-display text-white mb-2 group-hover:text-teal-300 transition-colors">◎ 星空冥想</h3>
                        <p className="text-gray-400 font-serif text-sm">跟随宇宙呼吸法，获取 AI 生成的每日灵性真言，疗愈身心。</p>
                    </div>
                 </div>
               </button>

               {/* Chat */}
               <button 
                onClick={() => handleModeSelect(AppMode.Chat)}
                className="group relative overflow-hidden glass-panel p-8 rounded-2xl hover:border-pink-400/50 transition-all duration-500 text-left hover:-translate-y-1"
               >
                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500 to-rose-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-display text-white mb-2 group-hover:text-pink-300 transition-colors">∞ 星灵对话</h3>
                    <p className="text-gray-400 font-serif text-sm">与 AI 占星师进行一对一的灵性对话，即时解答。</p>
                 </div>
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-gold-accent selection:text-black pb-20 md:pb-0 overflow-x-hidden">
      <StarryBackground mode={mode} />
      <BackgroundMusic />
      <Navbar currentMode={mode} setMode={handleModeSelect} />
      
      <main className="container mx-auto px-4 py-8 md:py-12 md:pt-24 transition-all duration-500 ease-in-out">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
