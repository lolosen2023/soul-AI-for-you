import { GoogleGenAI, Type, Chat } from "@google/genai";
import { DailyHoroscopeData, TarotCard, NatalChartParams, NatalChartAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一位名为“星语者”的神秘、富有同情心且极其专业的占星家和塔罗牌大师。
你的语言风格应该是：
1. **神秘而优雅**：使用优美的辞藻，带有星象学的隐喻。
2. **治愈且有力量**：不仅指出问题，更要给予心灵的抚慰。
3. **结构清晰**。
避免生硬的机器语言。
`;

// 1. Daily Horoscope Logic
export const getDailyHoroscope = async (sign: string): Promise<DailyHoroscopeData> => {
  const modelId = "gemini-3-flash-preview";
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "今日整体运势的一段充满画面感的描述（约60字）。" },
      loveScore: { type: Type.INTEGER, description: "爱情运势评分 (0-100)." },
      careerScore: { type: Type.INTEGER, description: "事业运势评分 (0-100)." },
      wealthScore: { type: Type.INTEGER, description: "财运评分 (0-100)." },
      healthScore: { type: Type.INTEGER, description: "健康评分 (0-100)." },
      luckyColor: { type: Type.STRING, description: "今天的幸运色。" },
      luckyNumber: { type: Type.STRING, description: "今天的幸运数字。" },
      luckyItem: { type: Type.STRING, description: "今天的幸运物品。" },
      compatibility: { type: Type.STRING, description: "今日最速配的星座。" },
      advice: { type: Type.STRING, description: "一条如同神谕般的一句话建议。" },
    },
    required: ["summary", "loveScore", "careerScore", "wealthScore", "healthScore", "luckyColor", "luckyNumber", "luckyItem", "compatibility", "advice"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `请为${sign}提供今天的详细运势预测。今天是 ${new Date().toLocaleDateString()}。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyHoroscopeData;
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Horoscope Error:", error);
    return {
      summary: "星象迷雾笼罩，请静心冥想。",
      loveScore: 50,
      careerScore: 50,
      wealthScore: 50,
      healthScore: 50,
      luckyColor: "星空紫",
      luckyNumber: "7",
      luckyItem: "水晶",
      compatibility: "自己",
      advice: "保持内心的平静。",
    };
  }
};

// 2. Tarot Reading Interpretation
export const interpretTarot = async (question: string, cards: TarotCard[]): Promise<string> => {
  const modelId = "gemini-3-flash-preview";
  
  const cardsDescription = cards.map((c, i) => {
    const position = i === 0 ? "过去/根源" : i === 1 ? "现在/现状" : "未来/结果";
    const orientation = c.isReversed ? "逆位" : "正位";
    return `- ${position}: ${c.nameCN} (${c.name}) [${orientation}]`;
  }).join("\n");

  const prompt = `
  求问者的问题是: "${question || "我的近期运势指引"}"
  
  抽出的牌阵如下 (圣三角牌阵):
  ${cardsDescription}
  
  请作为一位资深塔罗师，为求问者进行深度解读。请使用Markdown格式，包含【牌面启示】、【宇宙指引】和【行动建议】三个部分。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.85, 
      },
    });
    return response.text || "星灵暂时沉默了...";
  } catch (error) {
    console.error("Tarot Error:", error);
    return "连接宇宙能量时遇到干扰，请稍后再试。";
  }
};

// 3. Natal Chart Analysis (Structured)
export const analyzeNatalChart = async (params: NatalChartParams): Promise<NatalChartAnalysis | null> => {
  const modelId = "gemini-3-pro-preview"; 
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      sun: {
        type: Type.OBJECT,
        properties: {
          sign: { type: Type.STRING, description: "太阳星座名称" },
          keywords: { type: Type.STRING, description: "3个核心性格关键词，用空格分隔" },
          description: { type: Type.STRING, description: "对核心本我的深度分析（约100字）" }
        }
      },
      moon: {
        type: Type.OBJECT,
        properties: {
          sign: { type: Type.STRING, description: "月亮星座名称" },
          keywords: { type: Type.STRING, description: "3个情感关键词，用空格分隔" },
          description: { type: Type.STRING, description: "对内在情感需求的深度分析（约100字）" }
        }
      },
      rising: {
        type: Type.OBJECT,
        properties: {
          sign: { type: Type.STRING, description: "上升星座名称" },
          keywords: { type: Type.STRING, description: "3个外在表现关键词，用空格分隔" },
          description: { type: Type.STRING, description: "对人格面具的深度分析（约100字）" }
        }
      },
      planetaryPositions: {
        type: Type.ARRAY,
        description: "Calculate approximate absolute zodiac degrees (0-360, where 0 is Aries 0°) for: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, and ASC (Ascendant).",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Planet Name (e.g., 'Sun', 'Moon', 'ASC')" },
            sign: { type: Type.STRING, description: "Zodiac Sign Name" },
            angle: { type: Type.NUMBER, description: "Absolute angle 0-360 degrees" }
          }
        }
      },
      keyHouses: {
        type: Type.ARRAY,
        description: "根据出生信息，选取3个对该用户最重要或最有特点的后天宫位进行解读（如第1、4、7、10宫，或群星聚集的宫位）。",
        items: {
          type: Type.OBJECT,
          properties: {
            house: { type: Type.STRING, description: "宫位名称，例如'第十宫 (官禄宫)'" },
            sign: { type: Type.STRING, description: "宫头落入的星座" },
            keywords: { type: Type.STRING, description: "宫位核心议题关键词，2-3个，空格分隔" },
            description: { type: Type.STRING, description: "针对该宫位的深度个人化解读（约80字）" }
          }
        }
      },
      talents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3个主要天赋" },
      challenges: { type: Type.STRING, description: "今生主要需要克服的课题" },
      soulMessage: { type: Type.STRING, description: "一句富有哲理的灵魂寄语" }
    },
    required: ["sun", "moon", "rising", "planetaryPositions", "keyHouses", "talents", "challenges", "soulMessage"]
  };

  const prompt = `
  请根据以下出生信息生成深度星盘解读：
  姓名: ${params.name}
  出生日期: ${params.birthDate}
  出生时间: ${params.birthTime}
  出生地点: ${params.birthPlace}

  请重点分析：
  1. 太阳、月亮、上升的基本格局。
  2. 估算主要行星（太阳、月亮、水星、金星、火星、木星、土星、天王、海王、冥王）和上升点(ASC)的黄道位置（0-360度）。
  3. 计算或推演最重要的3个宫位，并给出解读。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 4096 }, // Increased budget for calculation
      },
    });
    
    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure keywords are arrays if string is returned (defensive)
      if (data.keyHouses) {
         data.keyHouses = data.keyHouses.map((h: any) => ({
             ...h,
             keywords: Array.isArray(h.keywords) ? h.keywords : h.keywords.split(' ')
         }));
      }
      return data as NatalChartAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Natal Chart Error:", error);
    return null;
  }
};

// 4. Chat Session
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + " 你现在的身份是用户的私人灵性伴侣，对话要像老朋友一样亲切，同时保持神秘感。",
    }
  });
};

// 5. Generate Meditation Mantra
export const generateMantra = async (): Promise<string> => {
  const modelId = "gemini-3-flash-preview";
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "请生成一句简短、治愈、充满宇宙能量的中文冥想真言（Mantra），不要超过20个字。不要解释，直接返回句子。",
      config: {
        temperature: 1.0,
      }
    });
    return response.text?.trim() || "我与宇宙同频，内心宁静如海。";
  } catch (e) {
    return "我与宇宙同频，内心宁静如海。";
  }
}
