import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import * as Progress from "react-native-progress"

const FitnessTrackerCard = ({ title, value, target, unit, icon, progress, onUpdate }) => {
  const { colors, spacing, borderRadius } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editValue)
    }
    setIsEditing(false)
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginRight: spacing.md,
      marginBottom: spacing.sm,
      width: 150,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "20", // 20% opacity
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontFamily: "Inter-Medium",
    },
    valueContainer: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: spacing.sm,
    },
    value: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-Bold",
    },
    unit: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 4,
      fontFamily: "Inter-Regular",
    },
    target: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontFamily: "Inter-Regular",
    },
    progressContainer: {
      marginTop: spacing.xs,
    },
    editContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    editInput: {
      flex: 1,
      fontSize: 20,
      color: colors.text,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      paddingVertical: 2,
      fontFamily: "Inter-Medium",
    },
    editButton: {
      padding: 4,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            keyboardType="numeric"
            autoFocus
          />
          <TouchableOpacity style={styles.editButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={20} color={colors.success} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.valueContainer} onPress={() => setIsEditing(true)} activeOpacity={0.7}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
          <Ionicons name="create-outline" size={14} color={colors.textSecondary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      )}

      {target && <Text style={styles.target}>Target: {target}</Text>}
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={4}
          color={colors.primary}
          unfilledColor={colors.border}
          borderWidth={0}
        />
      </View>
    </View>
  )
}

export default FitnessTrackerCard

