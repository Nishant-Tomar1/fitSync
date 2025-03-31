import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Vibration, Animated, Easing } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const MeditationCard = () => {
  const { colors, spacing, borderRadius } = useTheme()
  const [selectedDuration, setSelectedDuration] = useState(5)
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(selectedDuration * 60)
  const [meditationModalVisible, setMeditationModalVisible] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const breatheAnim = useRef(new Animated.Value(0)).current
  const timerRef = useRef(null)

  // Load meditation stats from AsyncStorage
  useEffect(() => {
    const loadMeditationStats = async () => {
      try {
        const stats = await AsyncStorage.getItem("meditation_stats")
        if (stats) {
          const { completed, minutes } = JSON.parse(stats)
          setCompletedSessions(completed || 0)
          setTotalMinutes(minutes || 0)
        }
      } catch (error) {
        console.error("Error loading meditation stats:", error)
      }
    }

    loadMeditationStats()
  }, [])

  // Save meditation stats to AsyncStorage
  const saveMeditationStats = async () => {
    try {
      await AsyncStorage.setItem(
        "meditation_stats",
        JSON.stringify({
          completed: completedSessions,
          minutes: totalMinutes,
        }),
      )
    } catch (error) {
      console.error("Error saving meditation stats:", error)
    }
  }

  // Update timer when duration changes
  useEffect(() => {
    setTimeRemaining(selectedDuration * 60)
  }, [selectedDuration])

  // Timer functionality
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timerActive && timeRemaining === 0) {
      setTimerActive(false)
      setIsCompleted(true)
      Vibration.vibrate([500, 500, 500])

      // Update stats
      const newCompletedSessions = completedSessions + 1
      const newTotalMinutes = totalMinutes + selectedDuration
      setCompletedSessions(newCompletedSessions)
      setTotalMinutes(newTotalMinutes)
      saveMeditationStats()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timerActive, timeRemaining])

  // Breathing animation
  useEffect(() => {
    if (timerActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      breatheAnim.setValue(0)
    }

    return () => {
      breatheAnim.stopAnimation()
    }
  }, [timerActive, breatheAnim])

  const toggleTimer = () => {
    if (isCompleted) {
      // Reset timer if completed
      setTimeRemaining(selectedDuration * 60)
      setIsCompleted(false)
    }
    setTimerActive(!timerActive)
  }

  const resetTimer = () => {
    setTimerActive(false)
    setTimeRemaining(selectedDuration * 60)
    setIsCompleted(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      marginBottom: spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      padding: spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-SemiBold",
    },
    imageContainer: {
      height: 150,
      width: "100%",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: spacing.md,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 20,
      fontFamily: "Inter-Regular",
    },
    durationTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.sm,
      fontFamily: "Inter-SemiBold",
    },
    durationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    durationButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background,
      minWidth: 60,
      alignItems: "center",
    },
    durationButtonActive: {
      backgroundColor: colors.primary,
    },
    durationText: {
      color: colors.textSecondary,
      fontFamily: "Inter-Medium",
    },
    durationTextActive: {
      color: "#fff",
    },
    startButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    startButtonText: {
      color: "#fff",
      fontWeight: "bold",
      marginLeft: spacing.xs,
      fontFamily: "Inter-Bold",
    },
    benefitsContainer: {
      marginTop: spacing.md,
      padding: spacing.sm,
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
    },
    benefitsTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.xs,
      fontFamily: "Inter-SemiBold",
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    benefitText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: spacing.xs,
      fontFamily: "Inter-Regular",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
      fontFamily: "Inter-Bold",
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    timerContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.xl,
    },
    timerText: {
      fontSize: 48,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-Bold",
      marginBottom: spacing.lg,
    },
    breatheCircle: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.primary + "40",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    breatheText: {
      fontSize: 18,
      color: colors.primary,
      fontFamily: "Inter-SemiBold",
      marginBottom: spacing.md,
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
    closeButton: {
      position: "absolute",
      top: 40,
      right: 20,
      padding: spacing.sm,
    },
    completedContainer: {
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    completedText: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.success,
      fontFamily: "Inter-Bold",
      marginBottom: spacing.sm,
    },
    completedSubtext: {
      fontSize: 16,
      color: colors.text,
      fontFamily: "Inter-Regular",
      textAlign: "center",
      marginBottom: spacing.lg,
    },
  })

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Meditation</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: "https://leblissspa.in/images/blog/how-does-daily-meditation-improve-our-health.jpg" }} style={styles.image} resizeMode="cover" />
        <View style={styles.overlay}>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Take a moment to relax, focus on your breathing, and clear your mind. Regular meditation can reduce stress,
          improve focus, and enhance overall well-being.
        </Text>

        <Text style={styles.durationTitle}>Select Duration</Text>
        <View style={styles.durationContainer}>
          {[5, 10, 15, 20].map((duration) => (
            <TouchableOpacity
              key={duration}
              style={[styles.durationButton, selectedDuration === duration && styles.durationButtonActive]}
              onPress={() => {
                setSelectedDuration(duration)
                setTimeRemaining(duration * 60)
              }}
            >
              <Text style={[styles.durationText, selectedDuration === duration && styles.durationTextActive]}>
                {duration} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={() => setMeditationModalVisible(true)}>
          <Ionicons name="play-circle-outline" size={20} color="#fff" />
          <Text style={styles.startButtonText}>Start Meditation</Text>
        </TouchableOpacity>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Benefits of Meditation</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.benefitText}>Reduces stress and anxiety</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.benefitText}>Improves focus and concentration</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.benefitText}>Enhances recovery and sleep quality</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>
      </View>

      {/* Meditation Timer Modal */}
      <Modal
        animationType="fade"
        visible={meditationModalVisible}
        onRequestClose={() => {
          if (timerActive) {
            toggleTimer()
          }
          setMeditationModalVisible(false)
        }}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              if (timerActive) {
                toggleTimer()
              }
              setMeditationModalVisible(false)
            }}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          {isCompleted ? (
            <View style={styles.completedContainer}>
              <Ionicons name="checkmark-circle" size={80} color={colors.success} />
              <Text style={styles.completedText}>Meditation Complete!</Text>
              <Text style={styles.completedSubtext}>
                You've completed a {selectedDuration} minute meditation session. Great job taking time for your mental
                wellbeing!
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  resetTimer()
                  setMeditationModalVisible(false)
                }}
              >
                <Text style={styles.startButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.breatheText}>{timerActive ? "Breathe in... Breathe out..." : "Ready to begin"}</Text>

              <Animated.View style={[styles.breatheCircle, { transform: [{ scale }] }]}>
                <Text style={{ color: colors.primary, fontFamily: "Inter-Bold" }}>
                  {timerActive ? "Breathe" : "Start"}
                </Text>
              </Animated.View>

              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              </View>

              <View style={styles.controlsContainer}>
                <TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={resetTimer}>
                  <Ionicons name="refresh" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={toggleTimer}>
                  <Ionicons name={timerActive ? "pause" : "play"} size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  )
}

export default MeditationCard

