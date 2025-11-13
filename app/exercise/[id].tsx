import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ExerciseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise Details</Text>
      <Text style={styles.subtitle}>Feature 4 - Coming Soon</Text>
      <Text style={styles.description}>
        Exercise ID: {id}
      </Text>
      <Text style={styles.description}>
        This screen will display detailed information about the selected exercise.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
    marginBottom: 10,
  },
});

