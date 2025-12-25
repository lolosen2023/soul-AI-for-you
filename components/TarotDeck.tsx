import React, { useState } from 'react';
import { TarotCard } from '../types';
import { interpretTarot } from '../services/geminiService';
import { soundManager } from '../services/soundService';
import { Loader2, RotateCcw, Sparkles, MoveRight } from 'lucide-react';

// Simplified Major Arcana names
const MAJOR_ARCANA = [
  { nameCN: "愚者", name: "The Fool", id: 0 },
  { nameCN: "魔术师", name: "The Magician", id: 1 },
  { nameCN: "女祭司", name: "The High Priestess", id: 2 },
  { nameCN: "皇后", name: "The Empress", id: 3 },
  { nameCN: "皇帝", name: "The Emperor", id: 4 },
  { nameCN: "教皇", name: "The Hierophant", id: 5 },
  { nameCN: "恋人", name: "The Lovers", id: 6 },
  { nameCN: "战车", name: "The Chariot", id: 7 },
  { nameCN: "力量", name: "Strength", id: 8 },
  { nameCN: "隐士", name: "The Hermit", id: 9 },
  { nameCN: "命运之轮", name: "Wheel of Fortune", id: 10 },
  { nameCN: "正义", name: "Justice", id: 11 },
  { nameCN: "倒吊人", name: "The Hanged Man", id: 12 },
  { nameCN: "死神", name: "Death", id: 13 },
  { nameCN: "节制", name: "Temperance", id: 14 },
  { nameCN: "恶魔", name: "The Devil", id: 15 },
  { nameCN: "高塔", name: "The Tower", id: 16 },
  { nameCN: "星星", name: "The Star", id: 17 },
  { nameCN: "月亮", name: "The Moon", id: 18 },
  { nameCN: "太阳", name: "The Sun", id: 19 },
  { nameCN: "审判", name: "Judgement", id: 20 },
  { nameCN: "世界", name: "The World", id: 21 },
];

const TarotDeck: React.FC = () => {
  const [step, setStep] = useState<'question' | 'shuffle' | 'spread' | 'reveal'>('question');
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [reading, setReading] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  const startReading = () => {
    if (!question.trim()) return;
    soundManager.play('click');
    setStep('shuffle');
    soundManager.play('shuffle');
    setTimeout(() => setStep('spread'), 2500); // Wait for shuffle animation
  };

  const selectCard = (index: number) => {
    if (selectedCards.length >= 3) return;

    soundManager.play('draw');

    // Logic to ensure unique cards
    let randomCardIndex;
    let cardExists;
    do {
      randomCardIndex = Math.floor(Math.random() * MAJOR_ARCANA.length);
      // eslint-disable-next-line no-loop-func
      cardExists = selectedCards.find(c => c.id === MAJOR_ARCANA[randomCardIndex].id);
    } while (cardExists);

    const baseCard = MAJOR_ARCANA[randomCardIndex];
    const isReversed = Math.random() > 0.3; // 30% chance of reversal

    const newCard: TarotCard = {
      ...baseCard,
      image: `https://picsum.photos/seed/${baseCard.id + 100}/300/500`, 
      isReversed
    };

    const newSelection = [...selectedCards, newCard];
    setSelectedCards(newSelection);

    if (newSelection.length === 3) {
      setTimeout(() => generateReading(newSelection), 800);
    }
  };

  const generateReading = async (cards: TarotCard[]) => {
    setStep('reveal');
    setLoading(true);
    // Reveal cards one by one
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 600));
        soundManager.play('flip');
        setRevealedIndices(prev => [...prev, i]);
    }
    
    const result = await interpretTarot(question, cards);
    soundManager.play('magic');
    setReading(result);
    setLoading(false);
  };

  const reset = () => {
    soundManager.play('click');
    setStep('question');
    setQuestion('');
    setSelectedCards([]);
    setReading('');
    setRevealedIndices([]);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 min-h-[85vh]">
      <h2 className="text-4xl font-display text-gold-accent mb-8 drop-shadow-glow tracking-widest uppercase">
        <span className="text-2xl align-middle mr-4 opacity-50">✦</span>
        塔罗神谕
        <span className="text-2xl align-middle ml-4 opacity-50">✦</span>
      </h2>

      {/* STEP 1: Question Input */}
      {step === 'question' && (
        <div className="glass-panel p-10 rounded-2xl w-full max-w-xl text-center animate-fade-in relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-accent to-transparent opacity-50" />
          
          <Sparkles className="mx-auto text-gold-accent mb-6 w-12 h-12 animate-pulse-slow" />
          <p className="text-purple-200 mb-8 text-lg font-serif italic">
            "向宇宙敞开心扉，在心中默念你的疑惑..."
          </p>
          
          <div className="relative mb-8">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：我最近的事业发展如何？"
              className="w-full bg-cosmic-dark/60 border border-white/20 rounded-xl p-5 text-white placeholder-gray-500 focus:border-gold-accent focus:ring-1 focus:ring-gold-accent outline-none text-center text-lg transition-all"
            />
          </div>
          
          <button 
            onClick={startReading}
            disabled={!question.trim()}
            className="group/btn relative px-8 py-4 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center justify-center gap-2 font-serif text-gold-accent font-bold tracking-widest">
              开启仪式 <MoveRight size={18} />
            </span>
          </button>
        </div>
      )}

      {/* STEP 2: Shuffle Animation */}
      {step === 'shuffle' && (
        <div className="flex flex-col items-center justify-center h-80 relative">
           {/* Stack of cards animating */}
           <div className="relative w-40 h-64">
             {[...Array(5)].map((_, i) => (
               <div 
                  key={i}
                  className="absolute inset-0 rounded-xl border-2 border-gold-dim bg-cosmic-mid shadow-2xl"
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, #302b63 0%, #0f0c29 100%)',
                    zIndex: i,
                    animation: `spin-slow 2s infinite ease-in-out alternate`,
                    animationDelay: `${i * 0.1}s`,
                    transform: `translate(${i * 2}px, ${i * -2}px) rotate(${i * 5}deg)`
                  }}
               >
                 <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border border-gold-accent/30 rounded-full flex items-center justify-center rotate-45">
                        <div className="w-12 h-12 border border-gold-accent/30 rounded-full" />
                    </div>
                 </div>
               </div>
             ))}
           </div>
           <p className="mt-12 text-gold-accent font-serif tracking-[0.2em] text-lg animate-pulse">命运洗牌中...</p>
        </div>
      )}

      {/* STEP 3: Spread & Select */}
      {step === 'spread' && (
        <div className="w-full flex flex-col items-center animate-fade-in">
           <p className="text-center text-gray-300 mb-8 font-serif text-lg">
             请凭直觉感应，抽取 <span className="text-gold-accent text-2xl font-bold mx-2">{3 - selectedCards.length}</span> 张牌
           </p>
           
           {/* Fan Spread Container */}
           <div className="relative w-full h-64 md:h-80 flex justify-center items-center perspective-1000 overflow-x-hidden">
             <div className="flex items-center justify-center -space-x-12 md:-space-x-8">
             {[...Array(22)].map((_, i) => {
                // Calculate curve
                const offset = i - 11;
                const rotate = offset * 2; 
                const translateY = Math.abs(offset) * 2;
                
                return (
                  <div 
                    key={i}
                    onClick={() => selectCard(i)}
                    className="relative w-20 h-36 md:w-32 md:h-52 rounded-lg border border-gold-dim/50 bg-gradient-to-br from-cosmic-mid to-cosmic-dark shadow-xl cursor-pointer hover:-translate-y-10 hover:scale-110 hover:z-50 hover:border-gold-accent transition-all duration-300 group origin-bottom transform-style-3d"
                    style={{
                      transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                      zIndex: 30 - Math.abs(offset)
                    }}
                  >
                    {/* Card Back Design */}
                    <div className="absolute inset-1 border border-white/10 rounded flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-80">
                      <span className="text-gold-accent/40 text-xl font-serif">✦</span>
                    </div>
                  </div>
                )
             })}
             </div>
           </div>
        </div>
      )}

      {/* STEP 4: Reveal & Reading */}
      {step === 'reveal' && (
        <div className="w-full animate-fade-in pb-20">
          {/* 3 Card Spread Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {selectedCards.map((card, index) => {
              const isRevealed = revealedIndices.includes(index);
              
              return (
                <div key={index} className="flex flex-col items-center group perspective-1000 h-[400px]">
                  <p className="text-gold-dim mb-4 uppercase text-sm tracking-widest font-serif flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gold-dim/50 inline-block"></span>
                    {index === 0 ? "过去的根源" : index === 1 ? "现在的状态" : "未来的指引"}
                    <span className="w-8 h-[1px] bg-gold-dim/50 inline-block"></span>
                  </p>
                  
                  <div className={`relative w-56 h-80 transition-all duration-1000 transform-style-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
                    {/* Front (Back of card visually) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl border-2 border-gold-dim/50 bg-cosmic-mid shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] rounded-xl"></div>
                        <div className="absolute text-gold-accent text-4xl">✦</div>
                    </div>

                    {/* Back (Face of card visually) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden border-2 border-gold-accent bg-black shadow-[0_0_40px_rgba(255,215,0,0.2)]">
                       {/* Image Area */}
                       <div className="h-3/5 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${card.image})` }}>
                          <div className={`absolute inset-0 bg-black/20 ${card.isReversed ? 'rotate-180' : ''}`}></div>
                       </div>
                       {/* Text Area */}
                       <div className="h-2/5 w-full bg-gradient-to-b from-cosmic-mid to-black p-4 flex flex-col items-center justify-center text-center relative">
                          <h4 className="text-gold-accent font-display text-xl font-bold">{card.nameCN}</h4>
                          <p className="text-gray-400 text-xs font-serif italic mt-1">{card.name}</p>
                          {card.isReversed && (
                            <span className="absolute top-2 right-2 text-red-400 text-[10px] border border-red-400 px-1 rounded">逆位</span>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Interpretation Panel */}
          <div className="glass-panel p-8 md:p-12 rounded-2xl max-w-4xl mx-auto min-h-[300px] relative overflow-hidden transition-all duration-500">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-gold-accent animate-spin" />
                <p className="text-purple-200 font-serif animate-pulse text-lg">正在连接阿卡西记录，解读命运...</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                   <Sparkles className="text-gold-accent" size={24} />
                   <h3 className="text-2xl font-serif text-white">大师神谕</h3>
                </div>
                
                <div className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed font-serif">
                   {/* We assume the API returns Markdown */}
                   <div dangerouslySetInnerHTML={{ 
                     __html: reading
                      .replace(/\*\*(.*?)\*\*/g, '<span class="text-gold-accent font-bold">$1</span>') // Simple formatting highlight
                      .replace(/\n/g, '<br/>') 
                   }} />
                </div>
                
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={reset} 
                    className="flex items-center gap-2 px-8 py-3 rounded-full border border-gold-accent/30 text-gold-accent hover:bg-gold-accent hover:text-cosmic-dark transition-all duration-300 shadow-lg hover:shadow-gold-accent/20"
                  >
                    <RotateCcw size={18} />
                    <span>再次占卜</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotDeck;
