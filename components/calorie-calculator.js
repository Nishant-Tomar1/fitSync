import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import * as Progress from "react-native-progress"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CalorieCalculator = () => {
  const { colors, spacing, borderRadius } = useTheme()
  const [calorieData, setCalorieData] = useState({
    consumed: 1450,
    burned: 320,
    dailyGoal: 2000,
    meals: [],
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [historyModalVisible, setHistoryModalVisible] = useState(false)
  const [nutritionModalVisible, setNutritionModalVisible] = useState(false)
  const [mealName, setMealName] = useState("")
  const [mealCalories, setMealCalories] = useState("")
  const [mealCategory, setMealCategory] = useState("Other")
  const [mealProtein, setMealProtein] = useState("")
  const [mealCarbs, setMealCarbs] = useState("")
  const [mealFat, setMealFat] = useState("")

  const { consumed, burned, dailyGoal, meals } = calorieData
  const remaining = dailyGoal - consumed + burned
  const progress = consumed / dailyGoal

  // Nutrition totals
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0)
  const totalFat = meals.reduce((sum, meal) => sum + (meal.fat || 0), 0)

  // Load calorie data from AsyncStorage
  useEffect(() => {
    const loadCalorieData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("calorie_data")
        if (savedData) {
          const parsedData = JSON.parse(savedData)

          // Check if data is  {

          // Check if data is from today
          const today = new Date().toDateString()
          if (parsedData.date === today) {
            setCalorieData(parsedData)
          } else {
            // Reset meals for a new day but keep the goal
            const newData = {
              consumed: 0,
              burned: 0,
              dailyGoal: parsedData.dailyGoal || 2000,
              meals: [],
              date: today,
            }
            setCalorieData(newData)
            saveCalorieData(newData)
          }
        }
      } catch (error) {
        console.error("Error loading calorie data:", error)
      }
    }

    loadCalorieData()
  }, [])

  // Save calorie data to AsyncStorage
  const saveCalorieData = async (data) => {
    try {
      const dataToSave = {
        ...data,
        date: data.date || new Date().toDateString(),
      }
      await AsyncStorage.setItem("calorie_data", JSON.stringify(dataToSave))
    } catch (error) {
      console.error("Error saving calorie data:", error)
    }
  }

  const addMeal = () => {
    if (mealName.trim() === "" || mealCalories.trim() === "") return

    const calories = Number.parseInt(mealCalories)
    if (isNaN(calories)) return

    const protein = mealProtein ? Number.parseInt(mealProtein) : 0
    const carbs = mealCarbs ? Number.parseInt(mealCarbs) : 0
    const fat = mealFat ? Number.parseInt(mealFat) : 0

    const newMeal = {
      id: Date.now().toString(),
      name: mealName,
      calories,
      category: mealCategory,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      protein,
      carbs,
      fat,
    }

    const newData = {
      ...calorieData,
      consumed: calorieData.consumed + calories,
      meals: [...calorieData.meals, newMeal],
    }

    setCalorieData(newData)
    saveCalorieData(newData)

    setModalVisible(false)
    resetMealForm()
  }

  const resetMealForm = () => {
    setMealName("")
    setMealCalories("")
    setMealCategory("Other")
    setMealProtein("")
    setMealCarbs("")
    setMealFat("")
  }

  const deleteMeal = (id) => {
    const mealToDelete = calorieData.meals.find((meal) => meal.id === id)
    if (!mealToDelete) return

    const newData = {
      ...calorieData,
      consumed: calorieData.consumed - mealToDelete.calories,
      meals: calorieData.meals.filter((meal) => meal.id !== id),
    }

    setCalorieData(newData)
    saveCalorieData(newData)
  }

  const mealCategories = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"]

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
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
      marginBottom: spacing.md,
    },
    progressText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontFamily: "Inter-Regular",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.md,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-Bold",
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
      fontFamily: "Inter-Regular",
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    addButtonText: {
      color: "#fff",
      marginLeft: 4,
      fontWeight: "500",
      fontFamily: "Inter-Medium",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "90%",
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: spacing.md,
      color: colors.text,
      fontFamily: "Inter-SemiBold",
    },
    input: {
      width: "100%",
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      marginBottom: spacing.md,
      color: colors.text,
      fontFamily: "Inter-Regular",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    modalButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      minWidth: 100,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontWeight: "500",
      fontFamily: "Inter-Medium",
    },
    cancelText: {
      color: colors.text,
    },
    saveText: {
      color: "#fff",
    },
    categoryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: spacing.md,
    },
    categoryButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Medium",
    },
    categoryTextActive: {
      color: "#fff",
    },
    nutritionContainer: {
      marginBottom: spacing.md,
    },
    nutritionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.xs,
      fontFamily: "Inter-SemiBold",
    },
    nutritionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.xs,
    },
    nutritionLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    nutritionValue: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "bold",
      fontFamily: "Inter-SemiBold",
    },
    mealsList: {
      marginTop: spacing.md,
    },
    mealItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    mealInfo: {
      flex: 1,
    },
    mealName: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-SemiBold",
    },
    mealDetails: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    mealCalories: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.primary,
      marginRight: spacing.sm,
      fontFamily: "Inter-Bold",
    },
    deleteButton: {
      padding: 4,
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.md,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.xs,
    },
    historyButton: {
      backgroundColor: colors.secondary + "20", // 20% opacity
    },
    nutritionButton: {
      backgroundColor: colors.primary + "20", // 20% opacity
    },
    actionButtonText: {
      marginLeft: spacing.xs,
      fontFamily: "Inter-Medium",
      fontSize: 12,
    },
    historyButtonText: {
      color: colors.secondary,
    },
    nutritionButtonText: {
      color: colors.primary,
    },
    emptyMealsText: {
      textAlign: "center",
      color: colors.textSecondary,
      marginTop: spacing.md,
      fontFamily: "Inter-Regular",
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Calorie Tracker</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Meal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {consumed} / {dailyGoal} calories consumed
        </Text>
        <Progress.Bar
          progress={progress}
          width={null}
          height={8}
          color={colors.primary}
          unfilledColor={colors.border}
          borderWidth={0}
          borderRadius={4}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dailyGoal}</Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{consumed}</Text>
          <Text style={styles.statLabel}>Consumed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{burned}</Text>
          <Text style={styles.statLabel}>Burned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{remaining}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>

      {/* Today's Meals List */}
      <View style={styles.mealsList}>
        {meals.length > 0 ? (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDetails}>
                  {meal.category} • {meal.time}
                  {meal.protein ? ` • P: ${meal.protein}g` : ""}
                  {meal.carbs ? ` • C: ${meal.carbs}g` : ""}
                  {meal.fat ? ` • F: ${meal.fat}g` : ""}
                </Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} cal</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMeal(meal.id)}>
                <Ionicons name="close-circle" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMealsText}>No meals added today</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.historyButton]}
          onPress={() => setHistoryModalVisible(true)}
        >
          <Ionicons name="time-outline" size={16} color={colors.secondary} />
          <Text style={[styles.actionButtonText, styles.historyButtonText]}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.nutritionButton]}
          onPress={() => setNutritionModalVisible(true)}
        >
          <Ionicons name="pie-chart-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, styles.nutritionButtonText]}>Nutrition</Text>
        </TouchableOpacity>
      </View>

      {/* Add Meal Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Meal</Text>

            <TextInput
              style={styles.input}
              placeholder="Meal name"
              placeholderTextColor={colors.textSecondary}
              value={mealName}
              onChangeText={setMealName}
            />

            <Text style={styles.nutritionTitle}>Category</Text>
            <View style={styles.categoryContainer}>
              {mealCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, mealCategory === category && styles.categoryButtonActive]}
                  onPress={() => setMealCategory(category)}
                >
                  <Text style={[styles.categoryText, mealCategory === category && styles.categoryTextActive]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Calories"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={mealCalories}
              onChangeText={setMealCalories}
            />

            <Text style={styles.nutritionTitle}>Nutrition (optional)</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: spacing.xs }]}
                placeholder="Protein (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={mealProtein}
                onChangeText={setMealProtein}
              />

              <TextInput
                style={[styles.input, { flex: 1, marginHorizontal: spacing.xs }]}
                placeholder="Carbs (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={mealCarbs}
                onChangeText={setMealCarbs}
              />

              <TextInput
                style={[styles.input, { flex: 1, marginLeft: spacing.xs }]}
                placeholder="Fat (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={mealFat}
                onChangeText={setMealFat}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false)
                  resetMealForm()
                }}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={addMeal}>
                <Text style={[styles.buttonText, styles.saveText]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nutrition Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={nutritionModalVisible}
        onRequestClose={() => setNutritionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nutrition Breakdown</Text>

            <View style={styles.nutritionContainer}>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Total Calories</Text>
                <Text style={styles.nutritionValue}>{consumed} cal</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Total Protein</Text>
                <Text style={styles.nutritionValue}>{totalProtein} g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Total Carbohydrates</Text>
                <Text style={styles.nutritionValue}>{totalCarbs} g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Total Fat</Text>
                <Text style={styles.nutritionValue}>{totalFat} g</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { width: "100%" }]}
              onPress={() => setNutritionModalVisible(false)}
            >
              <Text style={[styles.buttonText, styles.saveText]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CalorieCalculator

