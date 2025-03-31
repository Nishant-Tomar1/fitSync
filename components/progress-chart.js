import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { useTheme } from "../context/theme-context"
import { LineChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"

const ProgressChart = () => {
  const { colors, spacing, borderRadius } = useTheme()
  const screenWidth = Dimensions.get("window").width - spacing.md * 2
  const [activeDataset, setActiveDataset] = useState("both")
  const [chartData, setChartData] = useState({
    workouts: [30, 45, 28, 80, 99, 43, 50],
    calories: [20, 30, 40, 35, 45, 30, 40],
  })

  // Load chart data from AsyncStorage
  useEffect(() => {
    const loadChartData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("progress_chart_data")
        if (savedData) {
          setChartData(JSON.parse(savedData))
        }
      } catch (error) {
        console.error("Error loading chart data:", error)
      }
    }

    loadChartData()
  }, [])

  // Generate random data for demo purposes
  const generateRandomData = () => {
    const newWorkouts = Array(7)
      .fill(0)
      .map(() => Math.floor(Math.random() * 100) + 10)
    const newCalories = Array(7)
      .fill(0)
      .map(() => Math.floor(Math.random() * 50) + 10)

    const newData = {
      workouts: newWorkouts,
      calories: newCalories,
    }

    setChartData(newData)

    // Save to AsyncStorage
    try {
      AsyncStorage.setItem("progress_chart_data", JSON.stringify(newData))
    } catch (error) {
      console.error("Error saving chart data:", error)
    }
  }

  const getChartConfig = () => {
    const datasets = []

    if (activeDataset === "workouts" || activeDataset === "both") {
      datasets.push({
        data: chartData.workouts,
        color: () => colors.primary,
        strokeWidth: 2,
      })
    }

    if (activeDataset === "calories" || activeDataset === "both") {
      datasets.push({
        data: chartData.calories,
        color: () => colors.secondary,
        strokeWidth: 2,
      })
    }

    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets,
      legend:
        activeDataset === "both"
          ? ["Workouts", "Calories Burned"]
          : activeDataset === "workouts"
            ? ["Workouts"]
            : ["Calories Burned"],
    }
  }

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: borderRadius.lg,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
    },
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginHorizontal: spacing.md,
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
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-SemiBold",
    },
    refreshButton: {
      padding: 4,
    },
    legendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: spacing.sm,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: spacing.sm,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: spacing.xs,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: spacing.sm,
    },
    filterButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      marginHorizontal: spacing.xs,
    },
    activeFilter: {
      backgroundColor: colors.primary + "20", // 20% opacity
    },
    filterText: {
      fontSize: 12,
      fontFamily: "Inter-Medium",
      color : colors.textSecondary
    },
    activeFilterText: {
      color: colors.primary,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Progress</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={generateRandomData}>
          <Ionicons name="refresh" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeDataset === "both" && styles.activeFilter]}
          onPress={() => setActiveDataset("both")}
        >
          <Text style={[styles.filterText, activeDataset === "both" && styles.activeFilterText]}>Both</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeDataset === "workouts" && styles.activeFilter]}
          onPress={() => setActiveDataset("workouts")}
        >
          <Text style={[styles.filterText, activeDataset === "workouts" && styles.activeFilterText]}>Workouts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeDataset === "calories" && styles.activeFilter]}
          onPress={() => setActiveDataset("calories")}
        >
          <Text style={[styles.filterText, activeDataset === "calories" && styles.activeFilterText]}>Calories</Text>
        </TouchableOpacity>
      </View>

      <LineChart
        data={getChartConfig()}
        width={screenWidth - spacing.md * 2}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: borderRadius.lg,
        }}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={false}
      />

      <View style={styles.legendContainer}>
        {(activeDataset === "workouts" || activeDataset === "both") && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Workouts</Text>
          </View>
        )}

        {(activeDataset === "calories" || activeDataset === "both") && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
            <Text style={styles.legendText}>Calories Burned</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default ProgressChart

