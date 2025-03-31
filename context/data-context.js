"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Create context
const DataContext = createContext()

// Initial data
const initialFitnessStats = {
  steps: 8432,
  heartRate: 72,
  sleep: 7.5,
  caloriesConsumed: 1450,
  caloriesBurned: 320,
  dailyGoal: 2000,
}

const initialTasks = [
  { id: "1", text: "Morning cardio - 30 min", completed: true },
  { id: "2", text: "Upper body workout", completed: false },
  { id: "3", text: "Meal prep for tomorrow", completed: false },
  { id: "4", text: "Evening yoga session", completed: false },
]

const initialBlogs = [
  {
    id: "1",
    title: "How to Build Muscle Fast",
    author: "Alex Fitness",
    time: "5 min read",
    image: "/placeholder.svg?height=120&width=200",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    liked: false,
  },
  {
    id: "2",
    title: "Nutrition Tips for Beginners",
    author: "Nutrition Expert",
    time: "3 min read",
    image: "/placeholder.svg?height=120&width=200",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    liked: false,
  },
  {
    id: "3",
    title: "Cardio vs Weight Training",
    author: "Fitness Pro",
    time: "7 min read",
    image: "/placeholder.svg?height=120&width=200",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    liked: false,
  },
]

// Data provider component
export const DataProvider = ({ children }) => {
  const [fitnessStats, setFitnessStats] = useState(initialFitnessStats)
  const [tasks, setTasks] = useState(initialTasks)
  const [blogs, setBlogs] = useState(initialBlogs)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFitnessStats = await AsyncStorage.getItem("fitness_stats")
        const savedTasks = await AsyncStorage.getItem("workout_tasks")
        const savedBlogs = await AsyncStorage.getItem("fitness_blogs")

        if (savedFitnessStats) setFitnessStats(JSON.parse(savedFitnessStats))
        if (savedTasks) setTasks(JSON.parse(savedTasks))
        if (savedBlogs) setBlogs(JSON.parse(savedBlogs))
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [])

  // Save fitness stats to AsyncStorage
  useEffect(() => {
    const saveFitnessStats = async () => {
      try {
        await AsyncStorage.setItem("fitness_stats", JSON.stringify(fitnessStats))
      } catch (error) {
        console.error("Error saving fitness stats:", error)
      }
    }

    saveFitnessStats()
  }, [fitnessStats])

  // Save tasks to AsyncStorage
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("workout_tasks", JSON.stringify(tasks))
      } catch (error) {
        console.error("Error saving tasks:", error)
      }
    }

    saveTasks()
  }, [tasks])

  // Save blogs to AsyncStorage
  useEffect(() => {
    const saveBlogs = async () => {
      try {
        await AsyncStorage.setItem("fitness_blogs", JSON.stringify(blogs))
      } catch (error) {
        console.error("Error saving blogs:", error)
      }
    }

    saveBlogs()
  }, [blogs])

  // Update fitness stats
  const updateFitnessStats = (key, value) => {
    setFitnessStats((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Add new task
  const addTask = (text) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
    }
    setTasks([...tasks, newTask])
  }

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle blog like
  const toggleBlogLike = (id) => {
    setBlogs(blogs.map((blog) => (blog.id === id ? { ...blog, liked: !blog.liked } : blog)))
  }

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true)

    // Simulate data fetching with random updates
    setTimeout(() => {
      setFitnessStats((prev) => ({
        ...prev,
        steps: Math.floor(Math.random() * 2000) + 7000,
        heartRate: Math.floor(Math.random() * 20) + 60,
        sleep: (Math.random() * 2 + 6).toFixed(1),
        caloriesBurned: Math.floor(Math.random() * 100) + 250,
      }))

      setIsRefreshing(false)
    }, 1500)
  }, [])

  // Reset all data
  const resetData = async () => {
    try {
      setFitnessStats(initialFitnessStats)
      setTasks(initialTasks)
      setBlogs(initialBlogs)

      await AsyncStorage.setItem("fitness_stats", JSON.stringify(initialFitnessStats))
      await AsyncStorage.setItem("workout_tasks", JSON.stringify(initialTasks))
      await AsyncStorage.setItem("fitness_blogs", JSON.stringify(initialBlogs))
    } catch (error) {
      console.error("Error resetting data:", error)
    }
  }

  return (
    <DataContext.Provider
      value={{
        fitnessStats,
        tasks,
        blogs,
        isRefreshing,
        updateFitnessStats,
        toggleTask,
        addTask,
        deleteTask,
        toggleBlogLike,
        refreshData,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

// Custom hook to use the data
export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

