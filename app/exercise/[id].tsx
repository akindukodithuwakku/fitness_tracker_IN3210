import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, Heart } from 'react-native-feather';
import { exerciseApi } from '@/services/api';
import { Exercise } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addFavourite, removeFavourite } from '@/store/slices/favouritesSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExerciseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.items);
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFavourite = favourites.some((fav) => fav.id === id);

  useEffect(() => {
    const loadExercise = async () => {
      if (!id) {
        setError('Exercise ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await exerciseApi.getExerciseById(id);
        if (data) {
          setExercise(data);
        } else {
          setError('Exercise not found');
          Alert.alert('Error', 'Exercise not found', [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load exercise';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercise();
  }, [id, router]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return '#4caf50';
      case 'intermediate':
        return '#ff9800';
      case 'expert':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const handleToggleFavourite = () => {
    if (!exercise) return;

    if (isFavourite) {
      dispatch(removeFavourite(exercise.id));
      Alert.alert('Removed', `${exercise.name} removed from favourites`);
    } else {
      dispatch(addFavourite(exercise));
      Alert.alert('Added', `${exercise.name} added to favourites`);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>Loading exercise details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !exercise) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {error || 'Exercise not found'}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Activity width={48} height={48} color="#0a7ea4" />
          </View>
          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={handleToggleFavourite}
            activeOpacity={0.7}>
            <Heart
              width={28} height={28}
              color={isFavourite ? '#f44336' : '#999'}
              fill={isFavourite ? '#f44336' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>{exercise.name}</Text>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{exercise.type || 'N/A'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Muscle</Text>
            <Text style={styles.infoValue}>{exercise.muscle || 'N/A'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Equipment</Text>
            <Text style={styles.infoValue}>{exercise.equipment || 'N/A'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Difficulty</Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(exercise.difficulty) },
              ]}>
              <Text style={styles.difficultyText}>
                {exercise.difficulty || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        {exercise.instructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructions}>{exercise.instructions}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favouriteButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    lineHeight: 36,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});
