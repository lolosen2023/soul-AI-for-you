import React, { useState } from 'react';
import { Sun, Moon, Globe, Target, Shield, Zap, Cloud, Hexagon, Star, LayoutGrid, Circle, ArrowLeft } from 'lucide-react';
import { soundManager } from '../services/soundService';

// --- Types & Data ---

type Category = 'planets' | 'signs' | 'houses';

interface LibraryItem {
  id: string;
  name: string;
  symbol: string | React.ReactNode;
  keywords: string[];
  description: string;
  element?: string; // For signs
  ruler?: string;   // For signs
  meaning?: string; // For houses
}

const PLANETS: LibraryItem[] = [
  { id: 'sun', name: '太阳 (Sun)', symbol: <Sun className="text-yellow-500" />, keywords: ['自我', '活力', '目标', '父亲'], description: '太阳代表你的核心本质、自我意识和生命力。它是星盘中的国王，展示了你渴望成为什么样的人，以及你发光发热的领域。' },
  { id: 'moon', name: '月亮 (Moon)', symbol: <Moon className="text-blue-200" />, keywords: ['情绪', '潜意识', '安全感', '母亲'], description: '月亮掌管你的情感需求、直觉和本能反应。它揭示了你私下里最真实的一面，以及你需要什么才能感到安全和被滋养。' },
  { id: 'mercury', name: '水星 (Mercury)', symbol: '☿', keywords: ['沟通', '思维', '逻辑', '学习'], description: '水星是信使之神，掌管我们的思考方式、沟通风格和信息处理能力。它影响着你的语言天赋和商业头脑。' },
  { id: 'venus', name: '金星 (Venus)', symbol: '♀', keywords: ['爱', '美', '金钱', '价值观'], description: '金星代表我们对爱与美的渴望，以及我们的社交方式。它揭示了你在感情中看重什么，以及你如何吸引财富和快乐。' },
  { id: 'mars', name: '火星 (Mars)', symbol: '♂', keywords: ['行动', '欲望', '竞争', '愤怒'], description: '火星是战士，代表我们的行动力、性驱力和生存本能。它展示了你如何追求你想要的东西，以及你如何处理冲突。' },
  { id: 'jupiter', name: '木星 (Jupiter)', symbol: '♃', keywords: ['扩张', '幸运', '哲学', '信仰'], description: '木星是幸运之星，代表成长、扩张和高等智慧。它指引我们在哪里能找到好运，以及我们的人生哲学是什么。' },
  { id: 'saturn', name: '土星 (Saturn)', symbol: '♄', keywords: ['责任', '限制', '结构', '考验'], description: '土星是严师，代表纪律、责任和长期的目标。虽然它带来考验和限制，但也通过磨练赋予我们要构建持久成就所需的能力。' },
  { id: 'uranus', name: '天王星 (Uranus)', symbol: '♅', keywords: ['变革', '自由', '创新', '反叛'], description: '天王星代表突变、觉醒和打破常规。它揭示了你在哪里与众不同，以及你在哪里寻求绝对的自由。' },
  { id: 'neptune', name: '海王星 (Neptune)', symbol: '♆', keywords: ['梦想', '灵感', '幻觉', '慈悲'], description: '海王星掌管潜意识、艺术灵感和灵性。它模糊了现实的界限，带来无条件的爱，但也可能带来迷茫和逃避。' },
  { id: 'pluto', name: '冥王星 (Pluto)', symbol: '♇', keywords: ['转化', '权力', '重生', '危机'], description: '冥王星代表深刻的心理转化、死亡与重生。它挖掘埋藏在深处的秘密，通过摧毁旧有的结构来带来彻底的蜕变。' },
];

const SIGNS: LibraryItem[] = [
  { id: 'aries', name: '白羊座', symbol: '♈', element: '火', ruler: '火星', keywords: ['开创', '冲动', '勇气'], description: '十二星座的开端，象征着新生的力量。白羊座充满了激情和斗志，总是冲在最前面，像孩子一样直率和无畏。' },
  { id: 'taurus', name: '金牛座', symbol: '♉', element: '土', ruler: '金星', keywords: ['稳定', '感官', '固执'], description: '重视物质享受和安全感。金牛座脚踏实地，拥有极强的耐心和审美能力，喜欢按部就班地构建生活。' },
  { id: 'gemini', name: '双子座', symbol: '♊', element: '风', ruler: '水星', keywords: ['多变', '好奇', '沟通'], description: '思维敏捷，充满了好奇心。双子座像风一样自由，喜欢收集信息和交流，适应能力极强，但有时缺乏定性。' },
  { id: 'cancer', name: '巨蟹座', symbol: '♋', element: '水', ruler: '月亮', keywords: ['滋养', '敏感', '家庭'], description: '拥有坚硬的外壳和柔软的内心。巨蟹座极具母性光辉，重视家庭和情感连接，有着超强的记忆力和感受力。' },
  { id: 'leo', name: '狮子座', symbol: '♌', element: '火', ruler: '太阳', keywords: ['表现', '尊严', '创造'], description: '天生的王者，渴望成为舞台的焦点。狮子座慷慨、热情且富有创造力，但也需要他人的掌声和认可。' },
  { id: 'virgo', name: '处女座', symbol: '♍', element: '土', ruler: '水星', keywords: ['完美', '服务', '分析'], description: '追求完美的细节控。处女座拥有清晰的逻辑和分析能力，乐于服务他人，在秩序和条理中寻找安全感。' },
  { id: 'libra', name: '天秤座', symbol: '♎', element: '风', ruler: '金星', keywords: ['平衡', '和谐', '关系'], description: '天生的外交官，追求公平与和谐。天秤座优雅迷人，擅长从多角度看问题，但在做决定时容易犹豫不决。' },
  { id: 'scorpio', name: '天蝎座', symbol: '♏', element: '水', ruler: '冥王星/火星', keywords: ['深刻', '执着', '神秘'], description: '情感强烈而深沉。天蝎座拥有洞察人心的能力，意志力顽强，对待感情爱恨分明，极其重视忠诚。' },
  { id: 'sagittarius', name: '射手座', symbol: '♐', element: '火', ruler: '木星', keywords: ['自由', '探索', '乐观'], description: '追求真理的探险家。射手座向往自由，拥有宏大的视野和乐观的精神，总是看向远方，不愿被束缚。' },
  { id: 'capricorn', name: '摩羯座', symbol: '♑', element: '土', ruler: '土星', keywords: ['野心', '务实', '成就'], description: '攀登高峰的山羊。摩羯座拥有极强的忍耐力和责任感，目标明确，一步一个脚印地构建自己的世俗成就。' },
  { id: 'aquarius', name: '水瓶座', symbol: '♒', element: '风', ruler: '天王星/土星', keywords: ['独特', '人道', '革新'], description: '理性的革新者。水瓶座特立独行，关注群体利益和未来趋势，思维超前，不喜欢随波逐流。' },
  { id: 'pisces', name: '双鱼座', symbol: '♓', element: '水', ruler: '海王星/木星', keywords: ['梦幻', '包容', '牺牲'], description: '链接宇宙的梦想家。双鱼座富有同情心和想象力，界限模糊，容易感知他人的情绪，具有极强的艺术天赋。' },
];

const HOUSES: LibraryItem[] = [
  { id: 'h1', name: '第一宫 (命宫)', symbol: '1', meaning: '自我与面具', keywords: ['外貌', '性格', '开端'], description: '这是你的上升星座所在的位置，代表你给人的第一印象、你的外貌气质以及你在这个世界上的行事风格。' },
  { id: 'h2', name: '第二宫 (财帛宫)', symbol: '2', meaning: '价值与资源', keywords: ['金钱', '资产', '价值观'], description: '掌管你的正财运、你拥有的物质资源以及你如何定义自我价值。它揭示了你的理财观念。' },
  { id: 'h3', name: '第三宫 (兄弟宫)', symbol: '3', meaning: '沟通与思维', keywords: ['学习', '兄弟姐妹', '短途旅行'], description: '涉及基础教育、信息交流、兄弟姐妹关系以及短途的移动。它反映了你的思维模式和沟通方式。' },
  { id: 'h4', name: '第四宫 (田宅宫)', symbol: '4', meaning: '根源与家庭', keywords: ['家庭', '晚年', '内心安全感'], description: '代表你的原生家庭、房地产、父亲（或母亲）以及你内心的安全感来源。这是你的避风港。' },
  { id: 'h5', name: '第五宫 (子女宫)', symbol: '5', meaning: '创造与快乐', keywords: ['恋爱', '游戏', '子女', '赌博'], description: '掌管娱乐、创造力、恋爱关系（非婚姻）以及子女。这是你展现生命力、玩耍和享受生活的地方。' },
  { id: 'h6', name: '第六宫 (奴仆宫)', symbol: '6', meaning: '责任与健康', keywords: ['工作', '健康', '日常事务'], description: '涉及日常生活琐事、工作环境、服务精神以及身体健康状况。它反映了你的工作态度和养生习惯。' },
  { id: 'h7', name: '第七宫 (夫妻宫)', symbol: '7', meaning: '关系与合作', keywords: ['婚姻', '合伙', '公开敌人'], description: '代表一对一的伴侣关系，包括婚姻伴侣和商业合作伙伴。它揭示了你在契约关系中的需求。' },
  { id: 'h8', name: '第八宫 (疾厄宫)', symbol: '8', meaning: '转化与再生', keywords: ['偏财', '性', '死亡', '玄学'], description: '涉及他人的资源（如遗产、投资）、深层的情感纠葛、性以及生死的奥秘。这是危机与转化的领域。' },
  { id: 'h9', name: '第九宫 (迁移宫)', symbol: '9', meaning: '远方与信仰', keywords: ['高等教育', '长途旅行', '哲学'], description: '掌管高等智慧、法律、宗教信仰以及长途旅行。它代表了精神和身体上的远方探索。' },
  { id: 'h10', name: '第十宫 (官禄宫)', symbol: '10', meaning: '事业与名誉', keywords: ['社会地位', '职业', '公众形象'], description: '星盘的最高点，代表你的公众形象、事业成就和社会地位。这是你渴望被世界看到的样子。' },
  { id: 'h11', name: '第十一宫 (福德宫)', symbol: '11', meaning: '群体与愿景', keywords: ['朋友', '社团', '理想'], description: '涉及朋友团体、社会网络、人道主义以及未来的愿景。它反映了你与大众的连接。' },
  { id: 'h12', name: '第十二宫 (玄秘宫)', symbol: '12', meaning: '潜意识与隐退', keywords: ['秘密', '潜意识', '业力'], description: '代表潜意识、梦境、秘密敌人以及隐居。这是业力消解和灵性成长的领域，也是黎明前的黑暗。' },
];

// --- Component ---

interface AstroLibraryProps {
  onBack: () => void;
}

const AstroLibrary: React.FC<AstroLibraryProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<Category>('planets');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const handleTabChange = (tab: Category) => {
    soundManager.play('click');
    setActiveTab(tab);
    setSelectedItem(null);
  };

  const handleItemClick = (item: LibraryItem) => {
    soundManager.play('hover');
    setSelectedItem(item);
  };

  const getData = () => {
    switch(activeTab) {
      case 'planets': return PLANETS;
      case 'signs': return SIGNS;
      case 'houses': return HOUSES;
      default: return PLANETS;
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => { soundManager.play('click'); onBack(); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-accent transition-all text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-2xl font-serif text-gold-accent flex items-center gap-2">
           <LayoutGrid size={24} /> 占星知识百科
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 md:space-x-4 mb-8 bg-black/20 p-2 rounded-xl backdrop-blur-sm border border-white/5 overflow-x-auto scrollbar-hide">
        {[
          { id: 'planets', label: '十大行星', icon: <Globe size={18} /> },
          { id: 'signs', label: '十二星座', icon: <Star size={18} /> },
          { id: 'houses', label: '十二宫位', icon: <Hexagon size={18} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as Category)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-serif transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-gold-accent border border-gold-accent/30 shadow-[0_0_15px_rgba(157,78,221,0.3)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        {getData().map((item) => (
          <div 
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer
              ${selectedItem?.id === item.id 
                ? 'bg-purple-900/40 border-gold-accent shadow-[0_0_20px_rgba(255,215,0,0.2)] scale-[1.02]' 
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
              }
            `}
          >
            <div className="p-6 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-4">
                 <div className="text-4xl text-white group-hover:scale-110 transition-transform duration-300 font-serif">
                   {item.symbol}
                 </div>
                 {item.element && (
                   <span className={`text-xs px-2 py-1 rounded border ${
                     item.element === '火' ? 'border-red-500/50 text-red-300 bg-red-900/20' :
                     item.element === '水' ? 'border-blue-500/50 text-blue-300 bg-blue-900/20' :
                     item.element === '风' ? 'border-green-500/50 text-green-300 bg-green-900/20' :
                     'border-yellow-600/50 text-yellow-600 bg-yellow-900/20'
                   }`}>
                     {item.element}象
                   </span>
                 )}
              </div>
              
              <h4 className={`text-lg font-bold font-serif mb-2 ${selectedItem?.id === item.id ? 'text-gold-accent' : 'text-gray-200'}`}>
                {item.name}
              </h4>

              {/* Collapsed Keywords */}
              <div className="flex flex-wrap gap-2 mt-auto">
                 {item.keywords.slice(0, 3).map((k, i) => (
                   <span key={i} className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                     {k}
                   </span>
                 ))}
              </div>

              {/* Expanded Description (Only if selected) */}
              <div className={`mt-4 pt-4 border-t border-white/10 text-sm text-gray-300 leading-relaxed font-serif transition-all duration-500 overflow-hidden
                 ${selectedItem?.id === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 hidden'}
              `}>
                <p>{item.description}</p>
                {item.ruler && <p className="mt-2 text-xs text-gold-dim">守护星: {item.ruler}</p>}
                {item.meaning && <p className="mt-2 text-xs text-gold-dim">核心意涵: {item.meaning}</p>}
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-2xl group-hover:bg-gold-accent/10 transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AstroLibrary;
