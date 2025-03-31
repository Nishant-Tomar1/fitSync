import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"

const NutritionTipsCard = () => {
  const { colors, spacing, borderRadius } = useTheme()
  const [currentTip, setCurrentTip] = useState(0)

  const nutritionTips = [
    {
      title: "Protein Intake",
      content:
        "Aim for 0.8-1g of protein per pound of body weight for muscle growth. Good sources include lean meats, eggs, dairy, legumes, and plant-based options like tofu.",
      icon: "nutrition-outline",
    },
    {
      title: "Hydration",
      content:
        "Drink at least 8 glasses of water daily. Proper hydration improves performance, aids recovery, and helps maintain overall health.",
      icon: "water-outline",
    },
    {
      title: "Pre-Workout Nutrition",
      content:
        "Consume carbs and protein 1-2 hours before workout. Try a banana with peanut butter or Greek yogurt with berries.",
      icon: "time-outline",
    },
    {
      title: "Post-Workout Recovery",
      content: "Consume protein and carbs within 30-60 minutes after exercise to optimize recovery and muscle growth.",
      icon: "fitness-outline",
    },
    {
      title: "Balanced Meals",
      content:
        "Include protein, complex carbs, healthy fats, and vegetables in each meal for optimal nutrition and sustained energy.",
      icon: "restaurant-outline",
    },
  ]

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % nutritionTips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + nutritionTips.length) % nutritionTips.length)
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
    tipContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + "20", // 20% opacity
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    contentContainer: {
      flex: 1,
    },
    tipTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.xs,
      fontFamily: "Inter-SemiBold",
    },
    tipContent: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      fontFamily: "Inter-Regular",
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.md,
    },
    navButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + "10", // 10% opacity
      justifyContent: "center",
      alignItems: "center",
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: spacing.sm,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary,
      width: 16,
    },
    macroContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.md,
      padding: spacing.sm,
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
    },
    macroItem: {
      alignItems: "center",
      flex: 1,
    },
    macroValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-Bold",
    },
    macroLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition Tips</Text>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tipContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={nutritionTips[currentTip].icon} size={28} color={colors.primary} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.tipTitle}>{nutritionTips[currentTip].title}</Text>
          <Text style={styles.tipContent}>{nutritionTips[currentTip].content}</Text>
        </View>
      </View>

      <View style={styles.macroContainer}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>20-35%</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>45-65%</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>20-35%</Text>
          <Text style={styles.macroLabel}>Fats</Text>
        </View>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={prevTip}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.paginationContainer}>
          {nutritionTips.map((_, index) => (
            <View key={index} style={[styles.paginationDot, currentTip === index && styles.activeDot]} />
          ))}
        </View>

        <TouchableOpacity style={styles.navButton} onPress={nextTip}>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NutritionTipsCard

