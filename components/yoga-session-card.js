"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal, ScrollView, Image } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const YogaSessionCard = ({ title, duration, level, image }) => {
  const { colors, spacing, borderRadius } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)
  const [activeSession, setActiveSession] = useState(false)
  const [currentPose, setCurrentPose] = useState(0)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)

  // Load completed sessions from AsyncStorage
  React.useEffect(() => {
    const loadCompletedSessions = async () => {
      try {
        const savedData = await AsyncStorage.getItem("yoga_completed_sessions")
        if (savedData) {
          setCompletedSessions(Number.parseInt(savedData) || 0)
        }
      } catch (error) {
        console.error("Error loading yoga sessions data:", error)
      }
    }

    loadCompletedSessions()
  }, [])

  // Save completed sessions to AsyncStorage
  const saveCompletedSessions = async (count) => {
    try {
      await AsyncStorage.setItem("yoga_completed_sessions", count.toString())
    } catch (error) {
      console.error("Error saving yoga sessions data:", error)
    }
  }

  // Mock yoga poses for the session
  const yogaPoses = [
    {
      name: "Mountain Pose",
      duration: "30 seconds",
      description:
        "Stand tall with feet together, shoulders relaxed, weight evenly distributed through your feet, arms at sides.",
      image: "https://cdn.yogajournal.com/wp-content/uploads/2021/10/YJ_Mountain-Pose_Andrew-Clark_2400x1350.png",
    },
    {
      name: "Downward-Facing Dog",
      duration: "45 seconds",
      description:
        "Form an inverted V shape with your body. Hands shoulder-width apart, feet hip-width apart, pressing heels toward floor.",
      image: "https://cdn.yogajournal.com/wp-content/uploads/2021/11/Downward-Facing-Dog-Pose_Andrew-Clark_2400x1350.jpeg",
    },
    {
      name: "Warrior I",
      duration: "30 seconds each side",
      description:
        "Lunge with one leg forward, knee bent, other leg straight behind. Arms extended overhead, palms facing each other.",
      image: "https://cdn.yogajournal.com/wp-content/uploads/2021/10/Warrior-1-Pose_Andrew-Clark_2400x1350.jpeg",
    },
    {
      name: "Tree Pose",
      duration: "30 seconds each side",
      description:
        "Stand on one leg, other foot on inner thigh, knee out. Hands in prayer position or extended overhead.",
      image: "https://cdn.yogajournal.com/wp-content/uploads/2022/01/Tree-Pose_Alt-1_2400x1350_Andrew-Clark.jpeg",
    },
    {
      name: "Child's Pose",
      duration: "1 minute",
      description:
        "Kneel on the floor, touch big toes, sit on heels, then bend forward laying torso between thighs. Arms long, palms down.",
      image: "https://www.theyogacollective.com/wp-content/uploads/2019/10/4143473057707883372_IMG_8546-2-1200x800.jpg",
    },
  ]

  const startSession = () => {
    setActiveSession(true)
    setCurrentPose(0)
    setSessionCompleted(false)
  }

  const nextPose = () => {
    if (currentPose < yogaPoses.length - 1) {
      setCurrentPose(currentPose + 1)
    } else {
      completeSession()
    }
  }

  const prevPose = () => {
    if (currentPose > 0) {
      setCurrentPose(currentPose - 1)
    }
  }

  const completeSession = () => {
    setSessionCompleted(true)
    setActiveSession(false)
    const newCount = completedSessions + 1
    setCompletedSessions(newCount)
    saveCompletedSessions(newCount)
  }

  const closeModal = () => {
    setModalVisible(false)
    setActiveSession(false)
    setSessionCompleted(false)
  }

  const styles = StyleSheet.create({
    card: {
      width: 280,
      height: 150,
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      marginRight: spacing.md,
      marginBottom: spacing.sm,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "flex-end",
      padding: spacing.md,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: spacing.xs,
      fontFamily: "Inter-Bold",
    },
    detailsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: spacing.md,
    },
    detailText: {
      color: "#fff",
      marginLeft: spacing.xs,
      fontSize: 12,
      fontFamily: "Inter-Regular",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      alignSelf: "flex-start",
    },
    buttonText: {
      color: "#fff",
      marginLeft: spacing.xs,
      fontSize: 12,
      fontFamily: "Inter-Medium",
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
    sessionImage: {
      width: "100%",
      height: 200,
    },
    sessionContent: {
      padding: spacing.md,
    },
    sessionDescription: {
      fontSize: 16,
      color: colors.text,
      marginBottom: spacing.md,
      lineHeight: 24,
      fontFamily: "Inter-Regular",
    },
    sessionInfoContainer: {
      flexDirection: "row",
      marginBottom: spacing.md,
    },
    sessionInfoItem: {
      flex: 1,
      alignItems: "center",
      padding: spacing.sm,
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.xs,
    },
    sessionInfoValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: spacing.xs,
      fontFamily: "Inter-Bold",
    },
    sessionInfoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    startButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      alignItems: "center",
      marginTop: spacing.md,
    },
    startButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      fontFamily: "Inter-Bold",
    },
    poseContainer: {
      flex: 1,
      padding: spacing.md,
    },
    poseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    poseName: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Inter-Bold",
    },
    poseDuration: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: "Inter-SemiBold",
    },
    poseImage: {
      width: "100%",
      height: 250,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
    },
    poseDescription: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: spacing.xl,
      fontFamily: "Inter-Regular",
    },
    poseNavigation: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "auto",
    },
    poseNavButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      minWidth: 100,
      alignItems: "center",
    },
    poseNavButtonDisabled: {
      backgroundColor: colors.border,
    },
    poseNavButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontFamily: "Inter-Bold",
    },
    poseProgress: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    poseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
      marginHorizontal: 4,
    },
    poseActiveDot: {
      backgroundColor: colors.primary,
      width: 16,
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
    doneButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minWidth: 150,
      alignItems: "center",
    },
  })

  return (
    <>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
        <ImageBackground source={{ uri: image }} style={styles.card} imageStyle={{ borderRadius: borderRadius.lg }}>
          <View style={styles.overlay}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color="#fff" />
                <Text style={styles.detailText}>{duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="fitness-outline" size={14} color="#fff" />
                <Text style={styles.detailText}>{level}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Ionicons name="play" size={14} color="#fff" />
              <Text style={styles.buttonText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <Modal animationType="slide" visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          {!activeSession && !sessionCompleted && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <Image source={{ uri: image }} style={styles.sessionImage} resizeMode="cover" />

                <View style={styles.sessionContent}>
                  <Text style={styles.sessionDescription}>
                    This {title.toLowerCase()} yoga session is designed to{" "}
                    {title === "Morning Flow"
                      ? "energize your body and prepare you for the day ahead"
                      : title === "Power Yoga"
                        ? "build strength and increase your heart rate"
                        : "help you relax and release tension"}
                    . Follow along with each pose and focus on your breathing.
                  </Text>

                  <View style={styles.sessionInfoContainer}>
                    <View style={styles.sessionInfoItem}>
                      <Text style={styles.sessionInfoValue}>{duration}</Text>
                      <Text style={styles.sessionInfoLabel}>Duration</Text>
                    </View>

                    <View style={styles.sessionInfoItem}>
                      <Text style={styles.sessionInfoValue}>{level}</Text>
                      <Text style={styles.sessionInfoLabel}>Level</Text>
                    </View>

                    <View style={styles.sessionInfoItem}>
                      <Text style={styles.sessionInfoValue}>{yogaPoses.length}</Text>
                      <Text style={styles.sessionInfoLabel}>Poses</Text>
                    </View>
                  </View>

                  <Text style={[styles.sessionDescription, { fontFamily: "Inter-SemiBold" }]}>
                    This session includes {yogaPoses.length} poses, starting with {yogaPoses[0].name} and ending with{" "}
                    {yogaPoses[yogaPoses.length - 1].name}.
                  </Text>

                  <TouchableOpacity style={styles.startButton} onPress={startSession}>
                    <Text style={styles.startButtonText}>Start Session</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          )}

          {activeSession && !sessionCompleted && (
            <View style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {title} - Pose {currentPose + 1}/{yogaPoses.length}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.poseProgress}>
                {yogaPoses.map((_, index) => (
                  <View key={index} style={[styles.poseDot, currentPose === index && styles.poseActiveDot]} />
                ))}
              </View>

              <View style={styles.poseContainer}>
                <View style={styles.poseHeader}>
                  <Text style={styles.poseName}>{yogaPoses[currentPose].name}</Text>
                  <Text style={styles.poseDuration}>{yogaPoses[currentPose].duration}</Text>
                </View>

                <Image source={{ uri: yogaPoses[currentPose].image }} style={styles.poseImage} resizeMode="cover" />

                <Text style={styles.poseDescription}>{yogaPoses[currentPose].description}</Text>

                <View style={styles.poseNavigation}>
                  <TouchableOpacity
                    style={[styles.poseNavButton, currentPose === 0 && styles.poseNavButtonDisabled]}
                    onPress={prevPose}
                    disabled={currentPose === 0}
                  >
                    <Text style={styles.poseNavButtonText}>Previous</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.poseNavButton} onPress={nextPose}>
                    <Text style={styles.poseNavButtonText}>
                      {currentPose === yogaPoses.length - 1 ? "Complete" : "Next"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {sessionCompleted && (
            <View style={styles.completedContainer}>
              <Ionicons name="checkmark-circle" size={80} color={colors.success} style={styles.completedIcon} />

              <Text style={styles.completedTitle}>Session Completed!</Text>

              <Text style={styles.completedText}>
                Congratulations on completing your {title.toLowerCase()} yoga session! You've completed{" "}
                {completedSessions} yoga {completedSessions === 1 ? "session" : "sessions"} so far. Keep up the great
                work for your mind and body.
              </Text>

              <TouchableOpacity style={styles.doneButton} onPress={closeModal}>
                <Text style={styles.poseNavButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  )
}

export default YogaSessionCard

