import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native"
import { useTheme } from "../context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/data-context"

const BlogCard = ({ id, title, author, time, image }) => {
  const { colors, spacing, borderRadius } = useTheme()
  const { blogs, toggleBlogLike } = useData()

  // Find the blog in the context to get its liked status
  const blog = blogs.find((blog) => blog.id === id)
  const isLiked = blog ? blog.liked : false

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      width: 250,
      marginRight: spacing.md,
      marginBottom: spacing.sm,
      overflow: "hidden",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: "100%",
      height: 120,
    },
    content: {
      padding: spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: spacing.xs,
      fontFamily: "Inter-SemiBold",
    },
    metaContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    author: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter-Regular",
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    time: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 4,
      fontFamily: "Inter-Regular",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: spacing.sm,
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    likeButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    likeText: {
      fontSize: 12,
      marginLeft: 4,
      color: isLiked ? colors.primary : colors.textSecondary,
      fontFamily: "Inter-Medium",
    },
    readButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    readText: {
      fontSize: 12,
      color: colors.primary,
      marginRight: 4,
      fontFamily: "Inter-Medium",
    },
  })

  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.author}>{author}</Text>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.likeButton} onPress={() => toggleBlogLike(id)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={16}
              color={isLiked ? colors.primary : colors.textSecondary}
            />
            <Text style={styles.likeText}>{isLiked ? "Liked" : "Like"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.readButton}>
            <Text style={styles.readText}>Read</Text>
            <Ionicons name="arrow-forward" size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default BlogCard

