"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Animated,
  Vibration,
  Alert,
} from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const FeaturedWorkout = () => {
  const { colors, spacing, borderRadius } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)
  const [workoutActive, setWorkoutActive] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(45)
  const [restTime, setRestTime] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds] = useState(4)
  const [workoutCompleted, setWorkoutCompleted] = useState(false)
  const [workoutStats, setWorkoutStats] = useState({
    completed: 0,
    calories: 0,
    totalTime: 0,
  })

  const timerRef = useRef(null)
  const progressAnim = useRef(new Animated.Value(0)).current

  // Load workout stats from AsyncStorage
  useEffect(() => {
    const loadWorkoutStats = async () => {
      try {
        const stats = await AsyncStorage.getItem("workout_stats")
        if (stats) {
          setWorkoutStats(JSON.parse(stats))
        }
      } catch (error) {
        console.error("Error loading workout stats:", error)
      }
    }

    loadWorkoutStats()
  }, [])

  // Save workout stats to AsyncStorage
  const saveWorkoutStats = async (stats) => {
    try {
      await AsyncStorage.setItem("workout_stats", JSON.stringify(stats))
    } catch (error) {
      console.error("Error saving workout stats:", error)
    }
  }

  // Exercise data
  const exercises = [
    {
      name: "High Knees",
      description: "Run in place, bringing knees up to waist level. Keep your core engaged and maintain a quick pace.",
      duration: 45,
      image: "https://liftmanual.com/wp-content/uploads/2023/04/high-knee-run.jpg",
    },
    {
      name: "Jumping Jacks",
      description:
        "Jump while spreading legs and arms out to sides, then return to standing position with arms at sides.",
      duration: 45,
      image: "https://liftmanual.com/wp-content/uploads/2023/04/jumping-jack.jpg",
    },
    {
      name: "Mountain Climbers",
      description:
        "Start in plank position. Alternate bringing knees to chest in a running motion while maintaining plank form.",
      duration: 45,
      image: "https://training.fit/wp-content/uploads/2020/03/bergsteiger-fitnessband.png",
    },
    {
      name: "Burpees",
      description:
        "Begin standing, drop to squat, kick feet back to plank, perform push-up, return to squat, then jump up with arms overhead.",
      duration: 45,
      image: "https://cdn.shopify.com/s/files/1/0252/3155/6686/files/What_Muscles_do_Burpees_Work.jpg?v=1714495190",
    },
  ]

  // Timer functionality
  useEffect(() => {
    if (workoutActive) {
      if (restTime > 0) {
        // Rest timer
        timerRef.current = setTimeout(() => {
          setRestTime((prev) => prev - 1)

          // Update progress animation
          Animated.timing(progressAnim, {
            toValue: 1 - (restTime - 1) / 15,
            duration: 1000,
            useNativeDriver: false,
          }).start()
        }, 1000)
      } else if (timeRemaining > 0) {
        // Exercise timer
        timerRef.current = setTimeout(() => {
          setTimeRemaining((prev) => prev - 1)

          // Update progress animation
          Animated.timing(progressAnim, {
            toValue: 1 - (timeRemaining - 1) / exercises[currentExercise].duration,
            duration: 1000,
            useNativeDriver: false,
          }).start()
        }, 1000)
      } else {
        // Exercise completed
        if (currentExercise < exercises.length - 1) {
          // Move to next exercise
          setCurrentExercise((prev) => prev + 1)
          setTimeRemaining(exercises[currentExercise + 1].duration)
          setRestTime(15) // 15 seconds rest between exercises
          progressAnim.setValue(0)
          Vibration.vibrate(500)
        } else if (currentRound < totalRounds) {
          // Start next round
          setCurrentRound((prev) => prev + 1)
          setCurrentExercise(0)
          setTimeRemaining(exercises[0].duration)
          setRestTime(15)
          progressAnim.setValue(0)
          Vibration.vibrate([500, 500, 500])

          Alert.alert("Round Completed", `Round ${currentRound} completed! Get ready for round ${currentRound + 1}.`, [
            { text: "OK" },
          ])
        } else {
          // Workout completed
          completeWorkout()
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [workoutActive, timeRemaining, restTime, currentExercise, currentRound])

  const startWorkout = () => {
    setWorkoutActive(true)
    setCurrentExercise(0)
    setCurrentRound(1)
    setTimeRemaining(exercises[0].duration)
    setRestTime(0)
    setWorkoutCompleted(false)
    progressAnim.setValue(0)
  }

  const pauseWorkout = () => {
    setWorkoutActive(false)
  }

  const resumeWorkout = () => {
    setWorkoutActive(true)
  }

  const resetWorkout = () => {
    setWorkoutActive(false)
    setCurrentExercise(0)
    setCurrentRound(1)
    setTimeRemaining(exercises[0].duration)
    setRestTime(0)
    progressAnim.setValue(0)
  }

  const completeWorkout = () => {
    setWorkoutActive(false)
    setWorkoutCompleted(true)

    // Calculate workout stats
    const workoutDuration = 30 // 30 minutes
    const caloriesBurned = Math.floor(Math.random() * 100) + 300 // Random between 300-400

    const newStats = {
      completed: workoutStats.completed + 1,
      calories: workoutStats.calories + caloriesBurned,
      totalTime: workoutStats.totalTime + workoutDuration,
    }

    setWorkoutStats(newStats)
    saveWorkoutStats(newStats)

    Vibration.vibrate([500, 500, 500, 500, 500])
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    card: {
      height: 180,
      borderRadius: borderRadius.lg,
      overflow: "hidden",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "flex-end",
      padding: spacing.md,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: spacing.xs,
      fontFamily: "Inter-Bold",
    },
    details: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    detailText: {
      color: "#fff",
      marginLeft: spacing.xs,
      marginRight: spacing.md,
      fontSize: 14,
      fontFamily: "Inter-Regular",
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      marginLeft: spacing.xs,
      fontFamily: "Inter-Bold",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-Bold",
    },
    closeButton: {
      padding: spacing.xs,
    },
    exerciseItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
      width: "100%",
    },
    exerciseNumber: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    exerciseNumberText: {
      color: "#fff",
      fontWeight: "bold",
      fontFamily: "Inter-Bold",
    },
    exerciseDetails: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-SemiBold",
    },
    exerciseDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    startWorkoutButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.full,
      marginTop: spacing.lg,
      alignSelf: "center",
    },
    startWorkoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: "Inter-Bold",
    },
    workoutContainer: {
      flex: 1,
      padding: spacing.md,
    },
    workoutHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    workoutTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-Bold",
    },
    roundText: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: "Inter-SemiBold",
    },
    exerciseImage: {
      width: "100%",
      height: 200,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
    },
    timerContainer: {
      alignItems: "center",
      marginBottom: spacing.md,
    },
    timerText: {
      fontSize: 48,
      fontWeight: "bold",
      color: restTime > 0 ? colors.secondary : colors.text,
      fontFamily: "Inter-Bold",
    },
    timerLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    progressBarContainer: {
      height: 10,
      backgroundColor: colors.border,
      borderRadius: 5,
      marginVertical: spacing.md,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: restTime > 0 ? colors.secondary : colors.primary,
    },
    controlsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: spacing.xl,
    },
    controlButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: spacing.md,
    },
    resetButton: {
      backgroundColor: colors.border,
    },
    nextExerciseContainer: {
      marginTop: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
    },
    nextExerciseTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.xs,
      fontFamily: "Inter-SemiBold",
    },
    nextExerciseName: {
      fontSize: 16,
      color: colors.text,
      fontFamily: "Inter-Medium",
    },
    completedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
    },
    completedIcon: {
      marginBottom: spacing.lg,
    },
    completedTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.success,
      marginBottom: spacing.md,
      textAlign: "center",
      fontFamily: "Inter-Bold",
    },
    completedText: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.xl,
      lineHeight: 24,
      fontFamily: "Inter-Regular",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: spacing.xl,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
      fontFamily: "Inter-Bold",
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    doneButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minWidth: 150,
      alignItems: "center",
    },
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
        <ImageBackground source={{ uri: "https://www.puregym.com/media/3f1pvvjw/the-best-gym-cardio-workouts_blogheader-notitle.jpg?quality=80" }} style={styles.card}>
          <View style={styles.overlay}>
            <Text style={styles.title}>HIIT Cardio Challenge</Text>
            <View style={styles.details}>
              <Ionicons name="time-outline" size={16} color="#fff" />
              <Text style={styles.detailText}>30 min</Text>
              <Ionicons name="flame-outline" size={16} color="#fff" />
              <Text style={styles.detailText}>350 cal</Text>
              <Ionicons name="barbell-outline" size={16} color="#fff" />
              <Text style={styles.detailText}>Intermediate</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Ionicons name="play" size={16} color="#fff" />
              <Text style={styles.buttonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Workout Details Modal */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          if (workoutActive) {
            Alert.alert("Quit Workout?", "Are you sure you want to quit your current workout?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Quit",
                onPress: () => {
                  setWorkoutActive(false)
                  setModalVisible(false)
                },
                style: "destructive",
              },
            ])
          } else {
            setModalVisible(false)
          }
        }}
      >
        <View style={styles.modalContainer}>
          {!workoutActive && !workoutCompleted && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>HIIT Cardio Challenge</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ padding: spacing.md }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.text,
                    marginBottom: spacing.md,
                    lineHeight: 24,
                    fontFamily: "Inter-Regular",
                  }}
                >
                  This high-intensity interval training workout will boost your cardio fitness and burn calories.
                  Complete 4 rounds of the following exercises with minimal rest between exercises.
                </Text>

                {exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <View style={styles.exerciseNumber}>
                      <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.exerciseItem}>
                  <View style={[styles.exerciseNumber, { backgroundColor: colors.secondary }]}>
                    <Text style={styles.exerciseNumberText}>5</Text>
                  </View>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseName}>Rest</Text>
                    <Text style={styles.exerciseDescription}>15 seconds</Text>
                  </View>
                </View>

                <View style={styles.exerciseItem}>
                  <View style={[styles.exerciseNumber, { backgroundColor: colors.warning }]}>
                    <Text style={styles.exerciseNumberText}>6</Text>
                  </View>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseName}>Repeat Circuit</Text>
                    <Text style={styles.exerciseDescription}>3 more times</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.startWorkoutButton} onPress={startWorkout}>
                  <Text style={styles.startWorkoutText}>Start Workout</Text>
                </TouchableOpacity>

                <View style={{ height: spacing.xl * 2 }} />
              </ScrollView>
            </>
          )}

          {workoutActive && (
            <View style={styles.workoutContainer}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutTitle}>{restTime > 0 ? "Rest" : exercises[currentExercise].name}</Text>
                <Text style={styles.roundText}>
                  Round {currentRound}/{totalRounds}
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>

              {restTime > 0 ? (
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>{restTime}</Text>
                  <Text style={styles.timerLabel}>Rest Time</Text>

                  <View style={styles.nextExerciseContainer}>
                    <Text style={styles.nextExerciseTitle}>Up Next:</Text>
                    <Text style={styles.nextExerciseName}>{exercises[currentExercise].name}</Text>
                  </View>
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: exercises[currentExercise].image }}
                    style={styles.exerciseImage}
                    resizeMode="cover"
                  />

                  <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{timeRemaining}</Text>
                    <Text style={styles.timerLabel}>{exercises[currentExercise].name}</Text>
                  </View>
                </>
              )}

              <View style={styles.controlsContainer}>
                <TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={resetWorkout}>
                  <Ionicons name="refresh" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={workoutActive ? pauseWorkout : resumeWorkout}>
                  <Ionicons name={workoutActive ? "pause" : "play"} size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {workoutCompleted && (
            <View style={styles.completedContainer}>
              <Ionicons name="trophy" size={80} color={colors.warning} style={styles.completedIcon} />

              <Text style={styles.completedTitle}>Workout Completed!</Text>

              <Text style={styles.completedText}>
                Congratulations on completing the HIIT Cardio Challenge! You've burned calories and improved your
                cardiovascular fitness.
              </Text>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>30</Text>
                  <Text style={styles.statLabel}>Minutes</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>350</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{workoutStats.completed}</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                  setModalVisible(false)
                  setWorkoutCompleted(false)
                }}
              >
                <Text style={styles.startWorkoutText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}

export default FeaturedWorkout

