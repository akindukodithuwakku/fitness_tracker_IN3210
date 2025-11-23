import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { exerciseApi } from '@/services/api';
import { Exercise } from '@/types';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addFavourite, removeFavourite } from '@/store/slices/favouritesSlice';
import { Filter } from 'react-native-feather';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.items);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');

  const muscleGroups = [
    { label: 'All', value: 'all' },
    { label: 'Abs', value: 'abdominals' },
    { label: 'Biceps', value: 'biceps' },
    { label: 'Chest', value: 'chest' },
    { label: 'Legs', value: 'quadriceps' },
    { label: 'Triceps', value: 'triceps' },
  ];

  const fetchExercises = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setIsLoading(true);
      }
      setError(null);

      let data: Exercise[];
      if (selectedMuscle === 'all') {
        data = await exerciseApi.getMixedExercises();
      } else {
        data = await exerciseApi.getExercises(selectedMuscle);
      }
      
      setExercises(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load exercises';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedMuscle]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchExercises(true);
  }, [fetchExercises]);

  const handleExercisePress = useCallback(
    (exercise: Exercise) => {
      router.push(`/exercise/${exercise.id}`);
    },
    [router]
  );

  const handleFavouritePress = useCallback(
    (exercise: Exercise) => {
      const isFavourite = favourites.some((fav) => fav.id === exercise.id);
      
      if (isFavourite) {
        dispatch(removeFavourite(exercise.id));
      } else {
        dispatch(addFavourite(exercise));
      }
    },
    [favourites, dispatch]
  );

  const isFavourite = useCallback(
    (exerciseId: string) => {
      return favourites.some((fav) => fav.id === exerciseId);
    },
    [favourites]
  );

  const renderExercise = useCallback(
    ({ item }: { item: Exercise }) => (
      <ExerciseCard
        exercise={item}
        onPress={() => handleExercisePress(item)}
        onFavouritePress={() => handleFavouritePress(item)}
        isFavourite={isFavourite(item.id)}
      />
    ),
    [handleExercisePress, handleFavouritePress, isFavourite]
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={isDark ? '#4fc3f7' : '#0a7ea4'} />
          <ThemedText style={styles.emptyText}>Loading exercises...</ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchExercises()}>
            <Text style={styles.retryButtonText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>No exercises found</ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchExercises()}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <View style={styles.filterHeader}>
        <Filter width={20} height={20} color={isDark ? '#999' : '#666'} />
        <ThemedText style={styles.filterTitle}>Filter by Muscle Group</ThemedText>
      </View>
      <FlatList
        horizontal
        data={muscleGroups}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              isDark && styles.filterButtonDark,
              selectedMuscle === item.value && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedMuscle(item.value)}>
            <Text
              style={[
                styles.filterButtonText,
                isDark && styles.filterButtonTextDark,
                selectedMuscle === item.value && styles.filterButtonTextActive,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={
          exercises.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#4fc3f7' : '#0a7ea4'}
            colors={[isDark ? '#4fc3f7' : '#0a7ea4']}
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerDark: {
    backgroundColor: '#1c1c1e',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonDark: {
    backgroundColor: '#2c2c2e',
  },
  filterButtonActive: {
    backgroundColor: '#0a7ea4',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextDark: {
    color: '#999',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
