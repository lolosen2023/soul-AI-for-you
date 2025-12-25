export enum ZodiacSign {
  Aries = "白羊座",
  Taurus = "金牛座",
  Gemini = "双子座",
  Cancer = "巨蟹座",
  Leo = "狮子座",
  Virgo = "处女座",
  Libra = "天秤座",
  Scorpio = "天蝎座",
  Sagittarius = "射手座",
  Capricorn = "摩羯座",
  Aquarius = "水瓶座",
  Pisces = "双鱼座",
}

export enum AppMode {
  Home = "home",
  Daily = "daily",
  Tarot = "tarot",
  Natal = "natal",
  Chat = "chat",
  Meditation = "meditation",
}

export interface DailyHoroscopeData {
  summary: string;
  loveScore: number;
  careerScore: number;
  wealthScore: number;
  healthScore: number;
  luckyColor: string;
  luckyNumber: string;
  luckyItem: string; 
  compatibility: string; 
  advice: string;
}

export interface TarotCard {
  id: number;
  name: string;
  nameCN: string;
  image: string; 
  isReversed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface NatalChartParams {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface PlanetaryPosition {
  name: string; // e.g., "Sun", "Moon"
  sign: string; // e.g., "Aries"
  angle: number; // 0-360 absolute degree (0 = 0° Aries)
}

// New Structured Data for Natal Chart
export interface NatalChartAnalysis {
  sun: { sign: string; keywords: string; description: string };
  moon: { sign: string; keywords: string; description: string };
  rising: { sign: string; keywords: string; description: string };
  // Visual positions
  planetaryPositions: PlanetaryPosition[];
  // Key Houses Interpretation
  keyHouses: {
    house: string;      // e.g. "第十宫 (官禄宫)"
    sign: string;       // e.g. "摩羯座"
    keywords: string[]; // e.g. ["事业", "名望"]
    description: string;
  }[];
  talents: string[];
  challenges: string;
  soulMessage: string;
}
