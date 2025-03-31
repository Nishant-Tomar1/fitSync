import AsyncStorage from "@react-native-async-storage/async-storage"
import {GEMINI_API_KEY} from '@env'
import { GoogleGenAI } from "@google/genai";
// const GEMINI_API_KEY = "AIzaSyDDKB30bTZ_z5G-bfkFbq1_AhTb8heahpE"

const ai = new GoogleGenAI({ apiKey:GEMINI_API_KEY});

const aiGenerateText = async ({ prompt}) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    return response?.candidates[0]?.content?.parts[0]?.text;
  } catch (error) {
    console.error("Error fetching from GEMINI API:", error?.message);
    throw new Error("Failed to generate response from GEMINI");
  }
};


export const generateText = async (prompt) => {
  try {
    const text  = await aiGenerateText({
      prompt: prompt
    });
    
    await logConversation(prompt)
    return text;

  } catch (error) {
    console.error("Error generating text:", error)
    throw new Error("Failed to generate response")
  }
}

// Log conversation to AsyncStorage for history
const logConversation = async (prompt) => {
  try {
    const timestamp = new Date().toISOString()
    const conversation = {
      prompt,
      timestamp,
    }

    const existingLogsJson = await AsyncStorage.getItem("ai_conversation_logs")
    let logs = existingLogsJson ? JSON.parse(existingLogsJson) : []

    logs.push(conversation)
    if (logs.length > 50) {
      logs = logs.slice(logs.length - 50)
    }

    await AsyncStorage.setItem("ai_conversation_logs", JSON.stringify(logs))
  } catch (error) {
    console.error("Error logging conversation:", error)
  }
}

// Get conversation history
export const getConversationLogs = async () => {
  try {
    const logsJson = await AsyncStorage.getItem("ai_conversation_logs")
    return logsJson ? JSON.parse(logsJson) : []
  } catch (error) {
    console.error("Error getting conversation logs:", error)
    return []
  }
}

export const clearConversationLogs = async () => {
  try {
    await AsyncStorage.removeItem("ai_conversation_logs")
    return true
  } catch (error) {
    console.error("Error clearing conversation logs:", error)
    return false
  }
}

