import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import Checkbox from "./checkbox"
import AsyncStorage from "@react-native-async-storage/async-storage"

const TaskManagerCard = () => {
  const { colors, spacing, borderRadius } = useTheme()
  const [tasks, setTasks] = useState([
    { id: "1", text: "Morning cardio - 30 min", completed: true },
    { id: "2", text: "Upper body workout", completed: false },
    { id: "3", text: "Meal prep for tomorrow", completed: false },
    { id: "4", text: "Evening yoga session", completed: false },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [newTaskText, setNewTaskText] = useState("")
  const [editingTask, setEditingTask] = useState(null)

  // Load tasks from AsyncStorage
  React.useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("workout_tasks")
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks))
        }
      } catch (error) {
        console.error("Error loading tasks:", error)
      }
    }

    loadTasks()
  }, [])

  // Save tasks to AsyncStorage
  React.useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("workout_tasks", JSON.stringify(tasks))
      } catch (error) {
        console.error("Error saving tasks:", error)
      }
    }

    saveTasks()
  }, [tasks])

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const addTask = () => {
    if (newTaskText.trim() === "") return

    if (editingTask) {
      // Update existing task
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, text: newTaskText } : task)))
      setEditingTask(null)
    } else {
      // Add new task
      const newTask = {
        id: Date.now().toString(),
        text: newTaskText,
        completed: false,
      }
      setTasks([...tasks, newTask])
    }

    setNewTaskText("")
    setModalVisible(false)
  }

  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => setTasks(tasks.filter((task) => task.id !== id)),
        style: "destructive",
      },
    ])
  }

  const editTask = (task) => {
    setEditingTask(task)
    setNewTaskText(task.text)
    setModalVisible(true)
  }

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
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    taskText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: spacing.sm,
      flex: 1,
      fontFamily: "Inter-Regular",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: colors.textSecondary,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.md,
    },
    addButtonText: {
      color: colors.primary,
      marginLeft: spacing.xs,
      fontWeight: "500",
      fontFamily: "Inter-Medium",
    },
    taskActions: {
      flexDirection: "row",
    },
    actionButton: {
      padding: 6,
      marginLeft: 4,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "80%",
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Workout Plan</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {tasks.map((task) => (
        <View key={task.id} style={styles.taskItem}>
          <Checkbox checked={task.completed} onToggle={() => toggleTask(task.id)} />
          <Text style={[styles.taskText, task.completed && styles.completedText]}>{task.text}</Text>

          <View style={styles.taskActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => editTask(task)}>
              <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => deleteTask(task.id)}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingTask(null)
          setNewTaskText("")
          setModalVisible(true)
        }}
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.addButtonText}>Add Workout</Text>
      </TouchableOpacity>

      {/* Add/Edit Task Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingTask ? "Edit Workout" : "Add Workout"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Workout description"
              placeholderTextColor={colors.textSecondary}
              value={newTaskText}
              onChangeText={setNewTaskText}
              autoFocus
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false)
                  setEditingTask(null)
                  setNewTaskText("")
                }}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={addTask}>
                <Text style={[styles.buttonText, styles.saveText]}>{editingTask ? "Update" : "Add"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default TaskManagerCard

