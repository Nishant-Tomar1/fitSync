import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import * as Progress from "react-native-progress"
import AsyncStorage from "@react-native-async-storage/async-storage"

const WaterIntakeTracker = () => {
  const { colors, spacing, borderRadius } = useTheme()
  const [waterIntake, setWaterIntake] = useState(0)
  const [goal, setGoal] = useState(8) // 8 glasses as default goal
  const progress = waterIntake / goal

  // Load water intake data from AsyncStorage
  useEffect(() => {
    const loadWaterIntake = async () => {
      try {
        const savedData = await AsyncStorage.getItem("water_intake")
        if (savedData) {
          const data = JSON.parse(savedData)
          // Check if the data is from today
          const today = new Date().toDateString()
          if (data.date === today) {
            setWaterIntake(data.intake)
          } else {
            // Reset for a new day
            setWaterIntake(0)
            saveWaterIntake(0)
          }
        }
      } catch (error) {
        console.error("Error loading water intake:", error)
      }
    }

    loadWaterIntake()
  }, [])

  // Save water intake to AsyncStorage
  const saveWaterIntake = async (intake) => {
    try {
      const today = new Date().toDateString()
      await AsyncStorage.setItem(
        "water_intake",
        JSON.stringify({
          intake,
          date: today,
        }),
      )
    } catch (error) {
      console.error("Error saving water intake:", error)
    }
  }

  const addWater = (amount) => {
    const newIntake = Math.min(waterIntake + amount, goal * 1.5) // Cap at 150% of goal
    setWaterIntake(newIntake)
    saveWaterIntake(newIntake)
  }

  const removeWater = () => {
    if (waterIntake >= 1) {
      const newIntake = waterIntake - 1
      setWaterIntake(newIntake)
      saveWaterIntake(newIntake)
    }
  }

  const resetWater = () => {
    setWaterIntake(0)
    saveWaterIntake(0)
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-SemiBold",
    },
    progressContainer: {
      alignItems: "center",
      marginBottom: spacing.md,
    },
    waterAmount: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: spacing.xs,
      fontFamily: "Inter-Bold",
    },
    goalText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      fontFamily: "Inter-Regular",
    },
    progressBar: {
      width: "100%",
      height: 12,
      borderRadius: 6,
      marginBottom: spacing.md,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addButton: {
      backgroundColor: colors.primary + "20", // 20% opacity
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      alignItems: "center",
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    addButtonText: {
      color: colors.primary,
      fontWeight: "bold",
      fontFamily: "Inter-SemiBold",
    },
    removeButton: {
      backgroundColor: colors.error + "20", // 20% opacity
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      alignItems: "center",
      width: 44,
    },
    resetButton: {
      backgroundColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      alignItems: "center",
      width: 44,
    },
    waterIcon: {
      position: "absolute",
      right: spacing.md,
      top: spacing.md,
    },
    benefitsContainer: {
      marginTop: spacing.md,
      padding: spacing.sm,
      backgroundColor: colors.primary + "10", // 10% opacity
      borderRadius: borderRadius.md,
    },
    benefitsTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.xs,
      fontFamily: "Inter-SemiBold",
    },
    benefitText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Intake</Text>
        <Ionicons name="water-outline" size={24} color={colors.primary} style={styles.waterIcon} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.waterAmount}>
          {waterIntake} / {goal}
        </Text>
        <Text style={styles.goalText}>glasses of water</Text>

        <Progress.Bar
          progress={progress}
          width={null}
          height={12}
          color={colors.primary}
          unfilledColor={colors.border}
          borderWidth={0}
          borderRadius={6}
          style={styles.progressBar}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.removeButton} onPress={removeWater}>
          <Ionicons name="remove" size={20} color={colors.error} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => addWater(0.5)}>
          <Text style={styles.addButtonText}>+ 1/2 Glass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => addWater(1)}>
          <Text style={styles.addButtonText}>+ 1 Glass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetWater}>
          <Ionicons name="refresh" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Benefits of Staying Hydrated:</Text>
        <Text style={styles.benefitText}>• Improves physical performance</Text>
        <Text style={styles.benefitText}>• Boosts energy levels and brain function</Text>
        <Text style={styles.benefitText}>• Helps prevent and treat headaches</Text>
      </View>
    </View>
  )
}

export default WaterIntakeTracker

