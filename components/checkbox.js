import { TouchableOpacity, View, StyleSheet } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"

const Checkbox = ({ checked, onToggle }) => {
  const { colors, borderRadius } = useTheme()

  const styles = StyleSheet.create({
    container: {
      width: 24,
      height: 24,
      borderRadius: borderRadius.sm,
      borderWidth: 2,
      borderColor: checked ? colors.primary : colors.border,
      backgroundColor: checked ? colors.primary : "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
  })

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.container}>{checked && <Ionicons name="checkmark" size={16} color="#fff" />}</View>
    </TouchableOpacity>
  )
}

export default Checkbox

