import { useColorScheme } from "@/hooks/use-color-scheme";
import { Exercise } from "@/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Activity, Heart } from "react-native-feather";

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  onFavouritePress: () => void;
  isFavourite: boolean;
}

export function ExerciseCard({
  exercise,
  onPress,
  onFavouritePress,
  isFavourite,
}: ExerciseCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "#4caf50";
      case "intermediate":
        return "#ff9800";
      case "expert":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View
          style={[styles.iconContainer, isDark && styles.iconContainerDark]}
        >
          <Activity
            width={28}
            height={28}
            color={isDark ? "#4fc3f7" : "#0a7ea4"}
          />
        </View>
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={onFavouritePress}
          activeOpacity={0.7}
        >
          <Heart
            width={24}
            height={24}
            color={isFavourite ? "#f44336" : isDark ? "#777" : "#999"}
            fill={isFavourite ? "#f44336" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <Text
          style={[styles.exerciseName, isDark && styles.exerciseNameDark]}
          numberOfLines={2}
        >
          {exercise.name}
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text
              style={[styles.detailLabel, isDark && styles.detailLabelDark]}
            >
              Type
            </Text>
            <Text
              style={[styles.detailValue, isDark && styles.detailValueDark]}
              numberOfLines={1}
            >
              {exercise.type || "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text
              style={[styles.detailLabel, isDark && styles.detailLabelDark]}
            >
              Muscle
            </Text>
            <Text
              style={[styles.detailValue, isDark && styles.detailValueDark]}
              numberOfLines={1}
            >
              {exercise.muscle || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text
              style={[styles.detailLabel, isDark && styles.detailLabelDark]}
            >
              Equipment
            </Text>
            <Text
              style={[styles.detailValue, isDark && styles.detailValueDark]}
              numberOfLines={1}
            >
              {exercise.equipment || "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text
              style={[styles.detailLabel, isDark && styles.detailLabelDark]}
            >
              Difficulty
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(exercise.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>
                {exercise.difficulty || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#1c1c1e",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6F4FE",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerDark: {
    backgroundColor: "#1e3a4a",
  },
  favouriteButton: {
    padding: 8,
  },
  cardContent: {
    padding: 16,
    paddingTop: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    lineHeight: 24,
  },
  exerciseNameDark: {
    color: "#fff",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  detailLabelDark: {
    color: "#999",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
  },
  detailValueDark: {
    color: "#ccc",
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  difficultyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
