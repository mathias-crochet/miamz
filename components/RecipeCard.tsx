import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Users, Star, Bookmark } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Recipe {
  id: number;
  title: string;
  description: string;
  time: string;
  servings: number;
  rating: number;
  difficulty: string;
  image: string;
  isBookmarked?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onBookmark: () => void;
}

export default function RecipeCard({ recipe, onPress, onBookmark }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.imageContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.bookmarkButton} onPress={onBookmark}>
          <Bookmark
            size={20}
            color={recipe.isBookmarked ? '#FF6B35' : '#FFFFFF'}
            fill={recipe.isBookmarked ? '#FF6B35' : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#F39C12" fill="#F39C12" strokeWidth={1} />
            <Text style={styles.rating}>{recipe.rating}</Text>
          </View>
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Clock size={14} color="#7F8C8D" strokeWidth={2} />
              <Text style={styles.statText}>{recipe.time}</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={14} color="#7F8C8D" strokeWidth={2} />
              <Text style={styles.statText}>{recipe.servings}</Text>
            </View>
          </View>
          <View style={[styles.difficultyBadge, getDifficultyStyle(recipe.difficulty)]}>
            <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getDifficultyStyle(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return styles.difficultyEasy;
    case 'medium':
      return styles.difficultyMedium;
    case 'hard':
      return styles.difficultyHard;
    default:
      return styles.difficultyEasy;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F39C12',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    marginLeft: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyEasy: {
    backgroundColor: '#D5F5E3',
  },
  difficultyMedium: {
    backgroundColor: '#FCF3CF',
  },
  difficultyHard: {
    backgroundColor: '#FADBD8',
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
  },
});