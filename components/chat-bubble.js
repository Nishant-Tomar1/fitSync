import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"

const ChatBubble = ({ message }) => {
  const { colors, spacing, borderRadius } = useTheme()
  const { text, isUser, isError, timestamp } = message

  // Format timestamp
  const formatTime = (isoString) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const styles = StyleSheet.create({
    container: {
      maxWidth: "80%",
      marginVertical: spacing.xs,
      alignSelf: isUser ? "flex-end" : "flex-start",
    },
    bubble: {
      backgroundColor: isUser
        ? colors.primary
        : isError
          ? colors.error + "20" // 20% opacity for error background
          : colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: isUser ? 0 : 1,
      borderColor: isUser ? "transparent" : colors.border,
    },
    text: {
      color: isUser ? "#fff" : isError ? colors.error : colors.text,
      fontSize: 16,
      fontFamily: "Inter-Regular",
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.xs,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    timestamp: {
      fontSize: 12,
      color: isUser ? "rgba(255, 255, 255, 0.7)" : colors.textSecondary,
      marginTop: spacing.xs,
      alignSelf: isUser ? "flex-end" : "flex-start",
      fontFamily: "Inter-Regular",
    },
  })

  return (
    <View style={styles.container}>
      {!isUser && (
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Ionicons name="fitness-outline" size={16} color="#fff" />
          </View>
          <View style={styles.bubble}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      )}

      {isUser && (
        <View style={styles.bubble}>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}

      {timestamp && <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>}
    </View>
  )
}

export default ChatBubble

