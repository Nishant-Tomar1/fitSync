import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"

const GymEquipmentGuide = ({ title, description, image }) => {
  const { colors, spacing, borderRadius } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)

  const styles = StyleSheet.create({
    card: {
      width: 120,
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      marginRight: spacing.md,
      marginBottom: spacing.sm,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: "100%",
      height: 120,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
    },
    content: {
      padding: spacing.sm,
    },
    title: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 2,
      fontFamily: "Inter-SemiBold",
    },
    description: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    infoButton: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "85%",
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      overflow: "hidden",
      maxHeight: "80%",
    },
    modalImage: {
      width: "100%",
      height: 200,
    },
    modalBody: {
      padding: spacing.md,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.sm,
      fontFamily: "Inter-Bold",
    },
    modalDescription: {
      fontSize: 14,
      color: colors.text,
      marginBottom: spacing.md,
      lineHeight: 20,
      fontFamily: "Inter-Regular",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.xs,
      marginTop: spacing.sm,
      fontFamily: "Inter-SemiBold",
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: spacing.xs,
    },
    bullet: {
      color: colors.primary,
      marginRight: spacing.xs,
      fontWeight: "bold",
    },
    bulletText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
      fontFamily: "Inter-Regular",
    },
    closeButton: {
      position: "absolute",
      top: spacing.sm,
      right: spacing.sm,
      zIndex: 10,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
    },
  })

  // Mock data for the modal
  const getEquipmentDetails = () => {
    switch (title) {
      case "Dumbbells":
        return {
          description:
            "Dumbbells are free weights that are used for exercises that involve one or both arms. They come in various weights and are perfect for strength training.",
          benefits: [
            "Versatile for many exercises",
            "Great for unilateral training",
            "Helps correct muscle imbalances",
            "Improves stabilizer muscles",
          ],
          exercises: ["Bicep curls", "Shoulder press", "Chest press", "Lunges with weights"],
        }
      case "Treadmill":
        return {
          description:
            "A treadmill is a device for walking, running or climbing while staying in the same place. Treadmills are used for exercise and cardio training.",
          benefits: [
            "Convenient indoor cardio",
            "Adjustable speed and incline",
            "Lower impact than road running",
            "Tracks distance, calories, and heart rate",
          ],
          exercises: ["Walking", "Running", "Interval training", "Incline walking"],
        }
      case "Kettlebells":
        return {
          description:
            "Kettlebells are cast iron or cast steel weights used for ballistic exercises that combine cardiovascular, strength and flexibility training.",
          benefits: [
            "Full body workout",
            "Improves core strength",
            "Enhances cardiovascular fitness",
            "Increases power and endurance",
          ],
          exercises: ["Kettlebell swings", "Turkish get-ups", "Goblet squats", "Clean and press"],
        }
      case "Resistance Bands":
        return {
          description:
            "Resistance bands are elastic bands used for strength training. They provide resistance when stretched and come in various resistance levels.",
          benefits: [
            "Portable and lightweight",
            "Versatile for many exercises",
            "Low impact on joints",
            "Suitable for all fitness levels",
          ],
          exercises: ["Band pull-aparts", "Lateral band walks", "Banded push-ups", "Resistance band rows"],
        }
      default:
        return {
          description: "A versatile piece of gym equipment for various exercises.",
          benefits: [
            "Improves strength",
            "Enhances fitness",
            "Targets specific muscle groups",
            "Suitable for various fitness levels",
          ],
          exercises: ["Basic exercise 1", "Basic exercise 2", "Basic exercise 3", "Basic exercise 4"],
        }
    }
  }

  const details = getEquipmentDetails()

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Image source={{ uri: image }} style={styles.image} />
        <TouchableOpacity style={styles.infoButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="information" size={14} color="#fff" />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>

            <Image source={{ uri: image }} style={styles.modalImage} resizeMode="cover" />

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalDescription}>{details.description}</Text>

              <Text style={styles.sectionTitle}>Benefits</Text>
              {details.benefits.map((benefit, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{benefit}</Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Common Exercises</Text>
              {details.exercises.map((exercise, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{exercise}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default GymEquipmentGuide

