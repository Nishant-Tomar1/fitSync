"use client"

import { createContext, useContext, useState } from "react"
import { useColorScheme } from "react-native"

// Define theme colors
const lightTheme = {
  primary: "#4CAF50",
  secondary: "#03A9F4",
  accent: "#FF5722",
  background: "#F9F9F9",
  card: "#FFFFFF",
  text: "#212121",
  textSecondary: "#757575",
  border: "#E0E0E0",
  shadow: "#000000",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
}

const darkTheme = {
  primary: "#81C784",
  secondary: "#4FC3F7",
  accent: "#FF8A65",
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  border: "#333333",
  shadow: "#000000",
  success: "#66BB6A",
  error: "#E57373",
  warning: "#FFD54F",
}

// Create context
const ThemeContext = createContext()

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme()
  const [isDark,setIsDark] = useState(colorScheme === "dark")

  const toggleTheme = ()=>{
    setIsDark(prev=>!prev);
  }

  const theme = {
    isDark: isDark,
    colors: isDark ? darkTheme : lightTheme,
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
      full: 9999,
    },
    toggleTheme
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

