import { TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import { useEffect } from "react"

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  useEffect(()=>{},[isDark])

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container}>
      <Ionicons name={!isDark ? "sunny-outline" : "moon-outline"} size={24} color={isDark ? "#FFFFFF" : "#000000"} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 16,
  },
})

export default ThemeToggle

