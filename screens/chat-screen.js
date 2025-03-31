import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import { generateText } from "../services/ai-service"
import ChatBubble from "../components/chat-bubble"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function ChatScreen() {
  const { colors, spacing, borderRadius } = useTheme()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const flatListRef = useRef(null)

  // Load chat history from AsyncStorage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem("chat_messages")
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages))
        } else {
          // Set initial welcome message if no history exists
          const initialMessage = {
            id: "1",
            text: "Hi there! I'm your FitSync AI assistant. Ask me anything about health, fitness, nutrition, or workout routines!",
            isUser: false,
            timestamp: new Date().toISOString(),
          }
          setMessages([initialMessage])
          await AsyncStorage.setItem("chat_messages", JSON.stringify([initialMessage]))
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }

    loadMessages()
  }, [])

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      if (messages.length > 0) {
        try {
          await AsyncStorage.setItem("chat_messages", JSON.stringify(messages))
        } catch (error) {
          console.error("Error saving messages:", error)
        }
      }
    }

    saveMessages()
  }, [messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    input: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm ,
      marginRight: spacing.sm,
      color: colors.text,
      fontFamily: "Inter-Regular",
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingContainer: {
      padding: spacing.sm,
      alignItems: "flex-start",
    },
    typingIndicator: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      alignSelf: "flex-start",
      marginVertical: spacing.xs,
    },
    typingText: {
      color: colors.textSecondary,
      marginLeft: spacing.xs,
      fontFamily: "Inter-Regular",
    },
    clearButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      marginBottom: spacing.sm,
      alignSelf: "center",
    },
    clearButtonText: {
      color: colors.error,
      fontFamily: "Inter-Medium",
    },
  })

  const handleSend = async () => {
    if (message.trim() === "") return

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toISOString(),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await generateText(message)

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, aiMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        isError: true,
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    try {
      const initialMessage = {
        id: "1",
        text: "Hi there! I'm your FitSync AI assistant. Ask me anything about health, fitness, nutrition, or workout routines!",
        isUser: false,
        timestamp: new Date().toISOString(),
      }

      setMessages([initialMessage])
      await AsyncStorage.setItem("chat_messages", JSON.stringify([initialMessage]))
    } catch (error) {
      console.error("Error clearing chat:", error)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          {messages.length > 1 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
              <Text style={styles.clearButtonText}>Clear Chat</Text>
            </TouchableOpacity>
          )}

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={{ paddingVertical: spacing.md }}
            showsVerticalScrollIndicator={false}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.typingText}>FitSync is typing...</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about fitness, nutrition, etc."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { opacity: message.trim() === "" ? 0.7 : 1 }]}
            onPress={handleSend}
            disabled={message.trim() === ""}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}