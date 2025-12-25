import React, { useState } from 'react';
import { analyzeNatalChart } from '../services/geminiService';
import { soundManager } from '../services/soundService';
import { NatalChartParams, NatalChartAnalysis } from '../types';
import { Loader2, User, Sun, Moon, ArrowUpCircle, Sparkles, BookOpen, GraduationCap, Hexagon } from 'lucide-react';
import AstroLibrary from './AstroLibrary';
import NatalChartVisualizer from './NatalChartVisualizer';

const NatalChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calculator' | 'library'>('calculator');
  const [params, setParams] = useState<NatalChartParams>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  const [result, setResult] = useState<NatalChartAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.play('click');
    setLoading(true);
    setError('');
    const analysis = await analyzeNatalChart(params);
    if (analysis) {
      soundManager.play('magic');
      setResult(analysis);
    } else {
      setError("星盘解析失败，请检查网络或重试。");
    }
    setLoading(false);
  };

  const toggleLibrary = () => {
    soundManager.play('click');
    setViewMode(viewMode === 'calculator' ? 'library' : 'calculator');
  };

  if (viewMode === 'library') {
    return <AstroLibrary onBack={() => setViewMode('calculator')} />;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 min-h-[85vh]">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-lg md:max-w-6xl mb-8">
         <h2 className="text-4xl font-display text-gold-accent drop-shadow-glow">灵魂星图</h2>
         <button 
           onClick={toggleLibrary}
           className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-sm text-purple-200 hover:text-gold-accent transition-all"
         >
           <GraduationCap size={16} />
           <span>占星百科</span>
         </button>
      </div>

      {!result && !loading && (
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl w-full max-w-lg space-y-6 animate-fade-in relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
           
           <div className="text-center mb-6">
             <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                <User className="text-white w-8 h-8" />
             </div>
             <p className="text-gray-300 text-sm font-serif">输入出生信息，解锁你的灵魂蓝图。</p>
           </div>
           
           <div>
             <label className="block text-purple-200 text-xs font-bold mb-2 uppercase tracking-wider">姓名 / 昵称</label>
             <input 
               required
               type="text" 
               className="w-full bg-cosmic-dark/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent outline-none transition-all"
               value={params.name}
               onChange={e => setParams({...params, name: e.target.value})}
             />
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-purple-200 text-xs font-bold mb-2 uppercase tracking-wider">出生日期</label>
               <input 
                 required
                 type="date" 
                 className="w-full bg-cosmic-dark/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent outline-none transition-all"
                 value={params.birthDate}
                 onChange={e => setParams({...params, birthDate: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-purple-200 text-xs font-bold mb-2 uppercase tracking-wider">出生时间</label>
               <input 
                 required
                 type="time" 
                 className="w-full bg-cosmic-dark/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent outline-none transition-all"
                 value={params.birthTime}
                 onChange={e => setParams({...params, birthTime: e.target.value})}
               />
             </div>
           </div>

           <div>
             <label className="block text-purple-200 text-xs font-bold mb-2 uppercase tracking-wider">出生地点 (城市)</label>
             <input 
               required
               type="text" 
               placeholder="例如：上海"
               className="w-full bg-cosmic-dark/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent outline-none transition-all"
               value={params.birthPlace}
               onChange={e => setParams({...params, birthPlace: e.target.value})}
             />
           </div>

           <button 
             type="submit"
             className="w-full bg-gradient-to-r from-gold-accent to-yellow-600 text-black font-bold py-4 px-4 rounded-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all transform hover:-translate-y-1 mt-4"
           >
             绘制星盘
           </button>
           
           {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        </form>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-500/30 border-t-gold-accent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl animate-pulse">✨</span>
            </div>
          </div>
          <p className="mt-8 text-xl text-purple-200 font-serif animate-pulse">正在绘制天体运行轨迹...</p>
          <p className="text-sm text-gray-500 mt-2">星灵正在深度解析相位连接</p>
        </div>
      )}

      {result && !loading && (
        <div className="w-full animate-fade-in space-y-8 pb-20">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-3xl font-serif text-white">{params.name} 的灵魂蓝图</h3>
            <p className="text-gray-400 mt-2">出生于 {params.birthPlace}, {params.birthDate} {params.birthTime}</p>
          </div>

          {/* Visualizer Chart - Centered */}
          <div className="flex justify-center mb-8">
             <div className="glass-panel p-6 rounded-full shadow-[0_0_50px_rgba(157,78,221,0.2)]">
                <NatalChartVisualizer positions={result.planetaryPositions} />
             </div>
          </div>

          {/* Trinity Cards: Sun, Moon, Rising */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sun Card */}
            <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-yellow-500 hover:-translate-y-2 transition-transform duration-300">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-500"><Sun size={24} /></div>
                 <div>
                   <h4 className="text-sm text-gray-400 uppercase tracking-widest">核心本我</h4>
                   <p className="text-xl font-bold text-white">太阳 {result.sun.sign}</p>
                 </div>
               </div>
               <div className="flex flex-wrap gap-2 mb-4">
                 {result.sun.keywords.split(' ').map((k, i) => (
                   <span key={i} className="text-xs bg-yellow-500/10 text-yellow-200 px-2 py-1 rounded border border-yellow-500/20">{k}</span>
                 ))}
               </div>
               <p className="text-gray-300 text-sm leading-relaxed text-justify">{result.sun.description}</p>
            </div>

            {/* Moon Card */}
            <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-blue-400 hover:-translate-y-2 transition-transform duration-300">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-blue-400/20 rounded-full text-blue-400"><Moon size={24} /></div>
                 <div>
                   <h4 className="text-sm text-gray-400 uppercase tracking-widest">内在灵魂</h4>
                   <p className="text-xl font-bold text-white">月亮 {result.moon.sign}</p>
                 </div>
               </div>
               <div className="flex flex-wrap gap-2 mb-4">
                 {result.moon.keywords.split(' ').map((k, i) => (
                   <span key={i} className="text-xs bg-blue-400/10 text-blue-200 px-2 py-1 rounded border border-blue-400/20">{k}</span>
                 ))}
               </div>
               <p className="text-gray-300 text-sm leading-relaxed text-justify">{result.moon.description}</p>
            </div>

            {/* Rising Card */}
            <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-purple-400 hover:-translate-y-2 transition-transform duration-300">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-purple-400/20 rounded-full text-purple-400"><ArrowUpCircle size={24} /></div>
                 <div>
                   <h4 className="text-sm text-gray-400 uppercase tracking-widest">人格面具</h4>
                   <p className="text-xl font-bold text-white">上升 {result.rising.sign}</p>
                 </div>
               </div>
               <div className="flex flex-wrap gap-2 mb-4">
                 {result.rising.keywords.split(' ').map((k, i) => (
                   <span key={i} className="text-xs bg-purple-400/10 text-purple-200 px-2 py-1 rounded border border-purple-400/20">{k}</span>
                 ))}
               </div>
               <p className="text-gray-300 text-sm leading-relaxed text-justify">{result.rising.description}</p>
            </div>
          </div>

          {/* Key Houses Section */}
          <div className="glass-panel p-8 rounded-2xl border-t border-t-gold-accent/30 relative">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gold-accent/10 rounded-lg text-gold-accent"><Hexagon size={24} /></div>
                <h3 className="text-2xl font-serif text-white">重点宫位揭秘</h3>
             </div>
             <p className="text-sm text-gray-400 mb-6 italic">根据你的出生时间推演，以下生活领域是你今生的重点舞台...</p>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.keyHouses.map((house, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group">
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="text-gold-accent font-bold font-serif">{house.house}</h4>
                        <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded-full border border-purple-500/20">{house.sign}</span>
                     </div>
                     <div className="flex flex-wrap gap-2 mb-3">
                       {house.keywords.map((k, i) => (
                         <span key={i} className="text-[10px] text-gray-300 bg-black/30 px-2 py-0.5 rounded">{k}</span>
                       ))}
                     </div>
                     <p className="text-gray-300 text-sm leading-relaxed text-justify">{house.description}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Talents & Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-2xl">
              <h4 className="text-gold-accent font-serif text-lg mb-4 flex items-center gap-2">
                <Sparkles size={18} /> 天赋恩赐
              </h4>
              <ul className="space-y-3">
                {result.talents.map((talent, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gold-accent mt-1">✦</span>
                    <span className="text-gray-200">{talent}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl">
               <h4 className="text-red-300 font-serif text-lg mb-4 flex items-center gap-2">
                <BookOpen size={18} /> 灵魂课题
              </h4>
              <p className="text-gray-200 leading-relaxed italic border-l-2 border-red-300/50 pl-4">
                "{result.challenges}"
              </p>
            </div>
          </div>

          {/* Soul Message */}
          <div className="relative p-1 rounded-2xl bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent">
             <div className="bg-cosmic-dark p-8 rounded-xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <h4 className="text-gray-400 uppercase tracking-widest text-xs mb-4">来自高维的指引</h4>
                <p className="text-2xl md:text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-accent to-white animate-shimmer bg-[length:200%_100%] leading-relaxed">
                  “{result.soulMessage}”
                </p>
             </div>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={() => setResult(null)}
              className="text-gray-400 hover:text-white underline underline-offset-4 text-sm transition-colors"
            >
              分析另一个星盘
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatalChart;
