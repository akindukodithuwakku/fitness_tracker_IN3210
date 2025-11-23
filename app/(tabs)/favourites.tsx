import { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'react-native-feather';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFavourite, setFavourites } from '@/store/slices/favouritesSlice';
import { storage } from '@/utils/storage';
import { Exercise } from '@/types';
import { ExerciseCard } from '@/components/ExerciseCard';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FavouritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.items);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Load favourites from storage on mount
  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const storedFavourites = await storage.getFavourites<Exercise>();
        if (storedFavourites.length > 0) {
          dispatch(setFavourites(storedFavourites));
        }
      } catch (error) {
        console.error('Error loading favourites:', error);
      }
    };

    loadFavourites();
  }, [dispatch]);

  // Save favourites to storage whenever they change
  useEffect(() => {
    const saveFavourites = async () => {
      try {
        await storage.saveFavourites(favourites);
      } catch (error) {
        console.error('Error saving favourites:', error);
      }
    };

    saveFavourites();
  }, [favourites]);

  const handleExercisePress = useCallback(
    (exercise: Exercise) => {
      router.push(`/exercise/${exercise.id}`);
    },
    [router]
  );

  const handleFavouritePress = useCallback(
    (exercise: Exercise) => {
      dispatch(removeFavourite(exercise.id));
    },
    [dispatch]
  );

  const renderExercise = useCallback(
    ({ item }: { item: Exercise }) => (
      <ExerciseCard
        exercise={item}
        onPress={() => handleExercisePress(item)}
        onFavouritePress={() => handleFavouritePress(item)}
        isFavourite={true}
      />
    ),
    [handleExercisePress, handleFavouritePress]
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Heart width={64} height={64} color={isDark ? '#444' : '#ddd'} />
      </View>
      <ThemedText style={styles.emptyTitle}>No Favourites Yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Start adding exercises to your favourites by tapping the heart icon on
        any exercise card.
      </ThemedText>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)')}>
        <Text style={styles.exploreButtonText}>Explore Exercises</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <FlatList
          data={favourites}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            favourites.length === 0 ? styles.emptyListContainer : styles.listContainer
          }
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            favourites.length > 0 ? (
              <View style={[styles.header, isDark && styles.headerDark]}>
                <ThemedText style={styles.headerText}>
                  {favourites.length} {favourites.length === 1 ? 'favourite' : 'favourites'}
                </ThemedText>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerDark: {
    backgroundColor: '#1c1c1e',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

