import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "../context/theme-context"
import MainNavigator from "../navigation/main-navigator"

export default function index() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
          <StatusBar style="auto" />
          <MainNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

