// Mock gemini service - simulates AI responses without Firebase
import { UserMode } from "@/types";

export const generateChatResponse = async (
  message: string, 
  history: { role: string, text: string }[], 
  mode: UserMode,
  sessionId?: string
): Promise<any> => {
  // Simulate AI response with a delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const responses = [
    "I hear you, and I'm here to listen. Tell me more about what's on your mind. 💭",
    "That's really interesting! I love how you're thinking about this. ✨",
    "I understand. Sometimes it helps to talk through these things. What would make you feel better right now? 🧡",
    "Thank you for sharing that with me. Your feelings are completely valid. 🌈",
    "I'm here for you. Let's work through this together. What's the first small step you could take? 💫",
    "That sounds like it might be challenging. How can I help you feel more at ease? 🧘",
    "You're doing great just by being here and reflecting. What else is on your heart? 💖",
    "I appreciate you opening up. Sometimes just expressing our thoughts helps us see things more clearly. 🌟"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    text: randomResponse,
    suggestedAction: Math.random() > 0.8 ? {
      type: 'PLAY_SOUND',
      data: { category: 'Meditation' }
    } : undefined
  };
};

export const generateChatSummary = async (text: string): Promise<string> => {
  // Generate a simple summary from the first few words
  const words = text.split(' ').slice(0, 5).join(' ');
  return words.length > 20 ? words.substring(0, 20) + '...' : words || 'Conversation';
};

export const analyzeJournalEntry = async (entry: string, mode: UserMode): Promise<{ sentiment: string, advice: string, moodScore: number, deepAnalysis?: string }> => {
  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sentiments = ["Reflective", "Hopeful", "Peaceful", "Thoughtful", "Grateful"];
  const advices = [
    "Writing this down was a great step toward clarity.",
    "Take a moment to appreciate your openness with yourself.",
    "Your reflection shows growth and self-awareness.",
    "Consider what small action might bring you closer to how you want to feel.",
    "Remember, every emotion is temporary and valid."
  ];
  
  const randomIndex = Math.floor(Math.random() * sentiments.length);
  
  return {
    sentiment: sentiments[randomIndex],
    advice: advices[randomIndex],
    moodScore: 5 + Math.floor(Math.random() * 3),
    deepAnalysis: "Processing your emotions helps your brain reorganize and find new perspectives."
  };
};
