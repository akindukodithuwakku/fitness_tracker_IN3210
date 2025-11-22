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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Activity width={28} height={28} color="#0a7ea4" />
        </View>
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={onFavouritePress}
          activeOpacity={0.7}
        >
          <Heart
            width={24}
            height={24}
            color={isFavourite ? "#f44336" : "#999"}
            fill={isFavourite ? "#f44336" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.exerciseName} numberOfLines={2}>
          {exercise.name}
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {exercise.type || "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Muscle</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {exercise.muscle || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Equipment</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {exercise.equipment || "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Difficulty</Text>
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
  detailValue: {
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
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
