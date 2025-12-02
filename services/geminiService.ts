import { GoogleGenAI, Modality, Type } from "@google/genai";

// Ensure API KEY is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getCuratorResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const model = ai.models.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: "You are 'Alistair', a knowledgeable, sophisticated, and warm antiquarian book curator for 'Ink & Quill'. You specialize in rare manuscripts, first editions, and literary history. Your tone is academic yet accessible, slightly old-world but helpful. You help users find books, understand literary contexts, and appreciate the physical beauty of old texts. Keep responses concise (under 150 words) unless asked for depth."
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  } catch (error) {
    console.error("Curator Error:", error);
    throw error;
  }
};

export const appraiseBookImage = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: "Analyze this image of a book. Act as an expert appraiser. Identify the likely Title, Author, and estimate the Era/Publication Year based on visual cues (binding style, typography, wear). Assess the visible condition (e.g., foxing, spine damage, mint). Provide a short paragraph on its potential Historical Significance. Note: Do not give a specific monetary value, but comment on desirability."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            estimatedEra: { type: Type.STRING },
            conditionAssessment: { type: Type.STRING },
            historicalSignificance: { type: Type.STRING },
            rawAnalysis: { type: Type.STRING, description: "A cohesive paragraph summarizing the appraisal." }
          },
          required: ["rawAnalysis"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Appraisal Error:", error);
    throw error;
  }
};

export const generateBookNarration = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Fenrir has a deeper, more narrative tone usually
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};
