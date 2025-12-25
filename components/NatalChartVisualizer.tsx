import React, { useState } from 'react';
import { PlanetaryPosition } from '../types';
import { X } from 'lucide-react';

interface NatalChartVisualizerProps {
  positions: PlanetaryPosition[];
}

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', color: '#ff4d4d' },
  { name: 'Taurus', symbol: '♉', color: '#4da6ff' },
  { name: 'Gemini', symbol: '♊', color: '#ffd11a' },
  { name: 'Cancer', symbol: '♋', color: '#ff99cc' },
  { name: 'Leo', symbol: '♌', color: '#ffaa00' },
  { name: 'Virgo', symbol: '♍', color: '#99cc00' },
  { name: 'Libra', symbol: '♎', color: '#ffb3e6' },
  { name: 'Scorpio', symbol: '♏', color: '#cc0000' },
  { name: 'Sagittarius', symbol: '♐', color: '#9933ff' },
  { name: 'Capricorn', symbol: '♑', color: '#808080' },
  { name: 'Aquarius', symbol: '♒', color: '#33ccff' },
  { name: 'Pisces', symbol: '♓', color: '#00cc99' },
];

const PLANET_SYMBOLS: Record<string, string> = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 
  'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 
  'Neptune': '♆', 'Pluto': '♇', 'ASC': 'Asc', 'Ascendant': 'Asc',
  '太阳': '☉', '月亮': '☽', '水星': '☿', '金星': '♀', 
  '火星': '♂', '木星': '♃', '土星': '♄', '天王星': '♅', 
  '海王星': '♆', '冥王星': '♇', '上升': 'Asc'
};

const PLANET_COLORS: Record<string, string> = {
    'Sun': '#ffd700', 'Moon': '#e0e0e0', 'Mars': '#ff4d4d', 
    'Venus': '#ffb3e6', 'Jupiter': '#b366ff', 'Saturn': '#d9d9d9',
    'ASC': '#ffffff', 'Ascendant': '#ffffff'
};

const NatalChartVisualizer: React.FC<NatalChartVisualizerProps> = ({ positions }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetaryPosition | null>(null);
  
  const size = 320;
  const center = size / 2;
  const radius = (size / 2) - 10;
  const innerRadius = radius - 40;
  const planetRadius = innerRadius - 30;

  // Normalize angles. SVG Y is down, so standard Math (CCW) needs conversion.
  // 0 deg = Aries (3 o'clock). 
  // We want Aries to be at 3 o'clock, moving CCW.
  // SVG coordinates: x = cx + r * cos(angle), y = cy + r * sin(angle).
  // In SVG, positive angle is CW. 
  // So to go CCW: x = cx + r * cos(-angle).
  const getCoordinates = (angleDeg: number, r: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    // -angleRad because SVG y-axis is inverted (down), so positive angle goes CW visually. 
    // We want standard CCW zodiac.
    return {
      x: center + r * Math.cos(-angleRad),
      y: center + r * Math.sin(-angleRad),
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 relative group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gold-accent/5 blur-3xl rounded-full scale-75 animate-pulse-slow"></div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Zodiac Ring Background */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
        <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
        <circle cx={center} cy={center} r={planetRadius} fill="none" stroke="#ffd700" strokeOpacity="0.1" strokeWidth="1" />

        {/* 2. Zodiac Segments */}
        {ZODIAC_SIGNS.map((sign, index) => {
          const startAngle = index * 30;
          const endAngle = (index + 1) * 30;
          
          // Draw Lines
          const startCoords = getCoordinates(startAngle, radius);
          const innerStartCoords = getCoordinates(startAngle, innerRadius);
          
          // Draw Sign Symbol in middle of segment
          const midAngle = startAngle + 15;
          const symbolCoords = getCoordinates(midAngle, (radius + innerRadius) / 2);

          return (
            <g key={sign.name}>
              {/* Divider Line */}
              <line 
                x1={startCoords.x} y1={startCoords.y} 
                x2={innerStartCoords.x} y2={innerStartCoords.y} 
                stroke="#ffffff" strokeOpacity="0.2" 
              />
              {/* Sign Symbol */}
              <text 
                x={symbolCoords.x} y={symbolCoords.y} 
                textAnchor="middle" dominantBaseline="middle" 
                fill={sign.color} 
                fontSize="14" 
                fontWeight="bold"
                className="font-serif select-none"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* 3. Center Lines (Aspects - Decorative for now) */}
        {positions.map((p1, i) => (
            positions.map((p2, j) => {
                if (i >= j) return null;
                // Connect planets to create a web effect
                const p1Coords = getCoordinates(p1.angle, planetRadius);
                const p2Coords = getCoordinates(p2.angle, planetRadius);
                return (
                    <line 
                        key={`${i}-${j}`}
                        x1={p1Coords.x} y1={p1Coords.y}
                        x2={p2Coords.x} y2={p2Coords.y}
                        stroke="#ffd700" strokeOpacity="0.05"
                    />
                )
            })
        ))}

        {/* 4. Planets */}
        {positions.map((planet, index) => {
          // Add slight jitter if angles are very close to avoid complete overlap
          const jitter = (index % 3) * 3; 
          const pos = getCoordinates(planet.angle + jitter, planetRadius);
          
          const symbol = PLANET_SYMBOLS[planet.name] || PLANET_SYMBOLS[planet.name.replace(/.*\(|\).*/g, '')] || planet.name.substring(0,2);
          const color = PLANET_COLORS[planet.name] || PLANET_COLORS[planet.name.replace(/.*\(|\).*/g, '')] || '#ffffff';
          const isSelected = selectedPlanet?.name === planet.name;

          return (
            <g 
                key={index} 
                className={`transition-all duration-500 hover:scale-125 origin-center cursor-pointer ${isSelected ? 'scale-125' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelectedPlanet(planet); }}
            >
               {/* Tick */}
               <line 
                 x1={center} y1={center} 
                 x2={pos.x} y2={pos.y} 
                 stroke={color} strokeOpacity={isSelected ? 0.8 : 0.2} strokeDasharray="2 4"
               />
               
               {/* Planet Circle Background */}
               <circle 
                 cx={pos.x} cy={pos.y} 
                 r={isSelected ? "10" : "8"} 
                 fill="#050314" 
                 stroke={color} 
                 strokeWidth={isSelected ? 2 : 1} 
               />
               
               {/* Planet Symbol */}
               <text 
                 x={pos.x} y={pos.y} 
                 dy="1"
                 textAnchor="middle" dominantBaseline="middle" 
                 fill={color} 
                 fontSize={isSelected ? "12" : "10"}
                 fontWeight="bold"
                 filter="url(#glow)"
               >
                 {symbol}
               </text>
            </g>
          );
        })}

        {/* Center Sun/Cosmic decoration */}
        <circle cx={center} cy={center} r="4" fill="#ffd700" opacity="0.5" />
      </svg>
      
      {/* Detail Overlay */}
      {selectedPlanet && (
         <div className="absolute inset-0 z-20 flex items-center justify-center animate-fade-in" onClick={(e) => e.stopPropagation()}>
             <div className="bg-cosmic-dark/95 border border-gold-accent backdrop-blur-md p-5 rounded-2xl text-center shadow-[0_0_30px_rgba(255,215,0,0.2)] min-w-[180px] transform scale-100 transition-all">
                <h4 className="text-gold-accent font-serif font-bold text-xl mb-2 flex items-center justify-center gap-2">
                   {PLANET_SYMBOLS[selectedPlanet.name] || '★'} {selectedPlanet.name}
                </h4>
                <div className="w-12 h-[1px] bg-white/10 mx-auto mb-3"></div>
                <p className="text-white text-base mb-1">
                   落入 <span className="text-purple-300 font-bold">{selectedPlanet.sign}</span>
                </p>
                <p className="text-gray-400 text-xs font-mono mb-4">
                   位置: {Math.floor(selectedPlanet.angle % 30)}° {Math.floor((selectedPlanet.angle % 1) * 60)}'
                </p>
                <button 
                  onClick={() => setSelectedPlanet(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center mx-auto text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
             </div>
         </div>
      )}

      <div className="mt-4 text-xs text-gray-500 font-serif">
         {selectedPlanet ? '点击 X 关闭详情' : '点击行星符号查看详情'}
      </div>
    </div>
  );
};

export default NatalChartVisualizer;
