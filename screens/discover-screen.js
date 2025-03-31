"use client"

import { useCallback, useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import { useTheme } from "../context/theme-context"
import { useData } from "../context/data-context"
import FitnessTrackerCard from "../components/fitness-tracker-card"
import CalorieCalculator from "../components/calorie-calculator"
import BlogCard from "../components/blog-card"
import TaskManagerCard from "../components/task-manager-card"
import FeaturedWorkout from "../components/featured-workout"
import ProgressChart from "../components/progress-chart"
import YogaSessionCard from "../components/yoga-session-card"
import WaterIntakeTracker from "../components/water-intake-tracker"
import GymEquipmentGuide from "../components/gym-equipment-guide"
import NutritionTipsCard from "../components/nutrition-tips-card"
import MeditationCard from "../components/meditation-card"
import { useFocusEffect } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function DiscoverScreen() {
  const { colors, spacing, borderRadius } = useTheme()
  const { refreshData, isRefreshing, fitnessStats, updateFitnessStats } = useData()

  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredContent, setFilteredContent] = useState({
    showFeaturedWorkout: true,
    showFitnessTrackers: true,
    showWaterIntake: true,
    showProgress: true,
    showCalories: true,
    showYoga: true,
    showGymEquipment: true,
    showWorkoutPlan: true,
    showMeditation: true,
    showNutrition: true,
    showBlogs: true,
  })

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshData()
    }, [refreshData]),
  )

  useEffect(() => {
    let newFilteredContent = {
      showFeaturedWorkout: true,
      showFitnessTrackers: true,
      showWaterIntake: true,
      showProgress: true,
      showCalories: true,
      showYoga: true,
      showGymEquipment: true,
      showWorkoutPlan: true,
      showMeditation: true,
      showNutrition: true,
      showBlogs: true,
    }

    if (activeCategory === "All") {
      // Show everything
    } else if (activeCategory === "Gym") {
      newFilteredContent = {
        ...newFilteredContent,
        showFeaturedWorkout: true,
        showFitnessTrackers: true,
        showWaterIntake: false,
        showProgress: true,
        showCalories: true,
        showYoga: false,
        showGymEquipment: true,
        showWorkoutPlan: true,
        showMeditation: false,
        showNutrition: true,
        showBlogs: true,
      }
    } else if (activeCategory === "Yoga") {
      newFilteredContent = {
        ...newFilteredContent,
        showFeaturedWorkout: false,
        showFitnessTrackers: false,
        showWaterIntake: true,
        showProgress: false,
        showCalories: false,
        showYoga: true,
        showGymEquipment: false,
        showWorkoutPlan: false,
        showMeditation: true,
        showNutrition: false,
        showBlogs: true,
      }
    } else if (activeCategory === "Nutrition") {
      newFilteredContent = {
        ...newFilteredContent,
        showFeaturedWorkout: false,
        showFitnessTrackers: false,
        showWaterIntake: true,
        showProgress: false,
        showCalories: true,
        showYoga: false,
        showGymEquipment: false,
        showWorkoutPlan: false,
        showMeditation: false,
        showNutrition: true,
        showBlogs: true,
      }
    }

    setFilteredContent(newFilteredContent)
  }, [activeCategory])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    greeting: {
      fontSize: 24,
      fontFamily: "Inter-Bold",
      color: colors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter-SemiBold",
      color: colors.text,
    },
    seeAll: {
      fontSize: 14,
      fontFamily: "Inter-Medium",
      color: colors.primary,
    },
    horizontalList: {
      paddingLeft: spacing.md,
    },
    categoriesContainer: {
      flexDirection: "row",
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    categoryButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      backgroundColor: colors.card,
      borderRadius: borderRadius.full,
      marginRight: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
    },
    categoryText: {
      color: colors.textSecondary,
      marginLeft: spacing.xs,
      fontFamily: "Inter-Medium",
      fontSize: 14,
    },
    categoryTextActive: {
      color: "#fff",
    },
  })

  return (
    <View style={styles.container}>
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Fitness Enthusiast!</Text>
        <Text style={styles.subtitle}>Discover your fitness journey today</Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {["All", "Gym", "Yoga", "Nutrition"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, activeCategory === category && styles.categoryButtonActive]}
            onPress={() => setActiveCategory(category)}
          >
            <Ionicons
              name={
                category === "All"
                  ? "fitness-outline"
                  : category === "Gym"
                    ? "barbell-outline"
                    : category === "Yoga"
                      ? "leaf-outline"
                      : "nutrition-outline"
              }
              size={16}
              color={activeCategory === category ? "#fff" : colors.textSecondary}
            />
            <Text style={[styles.categoryText, activeCategory === category && styles.categoryTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Workout */}
      {filteredContent.showFeaturedWorkout && <FeaturedWorkout />}

      {/* Fitness Trackers */}
      {filteredContent.showFitnessTrackers && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fitness Trackers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            <FitnessTrackerCard
              title="Daily Steps"
              value={fitnessStats.steps.toString()}
              target="10,000"
              icon="footsteps-outline"
              progress={fitnessStats.steps / 10000}
              onUpdate={(newValue) => updateFitnessStats("steps", Number.parseInt(newValue))}
            />
            <FitnessTrackerCard
              title="Heart Rate"
              value={fitnessStats.heartRate.toString()}
              unit="bpm"
              icon="heart-outline"
              progress={fitnessStats.heartRate / 100}
              onUpdate={(newValue) => updateFitnessStats("heartRate", Number.parseInt(newValue))}
            />
            <FitnessTrackerCard
              title="Sleep"
              value={fitnessStats.sleep.toString()}
              unit="hrs"
              icon="moon-outline"
              progress={fitnessStats.sleep / 8}
              onUpdate={(newValue) => updateFitnessStats("sleep", Number.parseFloat(newValue))}
            />
          </ScrollView>
        </>
      )}

      {/* Water Intake Tracker */}
      {filteredContent.showWaterIntake && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Water Intake</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>History</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: spacing.md }}>
            <WaterIntakeTracker />
          </View>
        </>
      )}

      {/* Progress Chart */}
      {filteredContent.showProgress && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Progress</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Details</Text>
            </TouchableOpacity>
          </View>
          <ProgressChart />
        </>
      )}

      {/* Calorie Calculator */}
      {filteredContent.showCalories && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Calories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Adjust</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: spacing.md }}>
            <CalorieCalculator />
          </View>
        </>
      )}

        {/* Yoga Sessions */}
       {filteredContent.showYoga && (
        <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yoga Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          <YogaSessionCard
            title="Morning Flow"
            duration="20 min"
            level="Beginner"
            image="https://bod-blog-assets.prod.cd.beachbodyondemand.com/bod-blog/wp-content/uploads/2023/11/02095537/morning-yoga-600-vinyasa.jpg"
          />
          <YogaSessionCard
            title="Power Yoga"
            duration="30 min"
            level="Intermediate"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWHzfXGMI78bAJVxxrZkzcFmRLB6GCJjdOzw&s"
          />
          <YogaSessionCard
            title="Relaxation"
            duration="15 min"
            level="All Levels"
            image="https://media.post.rvohealth.io/wp-content/uploads/sites/4/2022/05/man-sitting-meditating-mindfulness-eyes-closed-1296x728-header-1024x575.jpg"
          />
        </ScrollView>
        </>
        )}

        {/* Gym Equipment Guide */}
        {filteredContent.showGymEquipment && (
          <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gym Equipment Guide</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          <GymEquipmentGuide
            title="Dumbbells"
            description="Perfect for strength training"
            image="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT1V_O4fJzphvHBGsEiPfrUWqkgouFno-QM9S2cweXLibTKoC0kXY679PQyk2mGaWT1YlrBufbDp1UJPBhZwMV9EgiJphpAabjz2qk6bMCUGBKFx3oNUW2aBw"
          />
          <GymEquipmentGuide
            title="Treadmill"
            description="Cardio essential"
            image="https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQsIGT6azSqVwSqHfv_gHRVW3zEuRUS4qpNW5kXZRu0KaRtgipqOEc1vQ5LfVpnWyakyQNKG57UOo2vFe3BpPsfITtahkxVdpHSlCGq1OQnOGSe3EeCnRCm"
          />
          <GymEquipmentGuide
            title="Kettlebells"
            description="Full body workout"
            image="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSnD5Az-yYQnEGyPe0-_iDEZPXBEuAheYkubj9RWTK0Cq26e483W9zu2LrJg2qcfmRcmkgGDfa_yuEtWoqA6sr8hWuBnhyoyn4S3GjNYo9oIV2hy7BJJ5GC"
          />
          <GymEquipmentGuide
            title="Resistance Bands"
            description="Versatile training"
            image="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSW8n0Qz73PrOc_cbCnJHe3Sol-vDEJ5gCD3_KZxYNdKxh00l1ISejzq0LshSDpN17KfrYIcKUaZcMKcDcEk0H7grbcUKNGIFlGaFHau3K8KFiAFBzRNmZn"
          />
        </ScrollView>
        </>)}

       {/* Task Manager */}
       {filteredContent.showWorkoutPlan && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Workout Plan</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: spacing.md }}>
              <TaskManagerCard />
            </View>
          </>
        )}

        {/* Meditation */}
        {filteredContent.showMeditation && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mindfulness & Meditation</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Explore</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: spacing.md }}>
              <MeditationCard />
            </View>
          </>
        )}

        {/* Nutrition Tips */}
        {filteredContent.showNutrition && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nutrition Tips</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>More</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: spacing.md }}>
              <NutritionTipsCard />
            </View>
          </>
        )}


        {/* Fitness Blogs */}
        {filteredContent.showBlogs && (
          <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fitness Blogs</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          <BlogCard
            id="1"
            title="How to Build Muscle Fast"
            author="Alex Fitness"
            time="5 min read"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeacC0nDUKsrB1qZkqMY8_LdviGJOA9Fl9OA&s"
            category="Strength"
          />
          <BlogCard
            id="2"
            title="Nutrition Tips for Beginners"
            author="Nutrition Expert"
            time="3 min read"
            image="https://dev-cms.who.int/images/default-source/wpro/health-topic/health-diet/summary-nutrition-tips-01-2.jpg?sfvrsn=f2831c75_2"
            category="Nutrition"
          />
          <BlogCard
            id="3"
            title="Cardio vs Weight Training"
            author="Fitness Pro"
            time="7 min read"
            image="https://personaltrainingmalta.com/wp-content/uploads/2024/03/3rd-Blog-FEATURE-IMAGE-1024x683.jpg"
            category="Cardio"
          />
        </ScrollView>
        </>)}

        {/* Spacer at bottom */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  )
}

