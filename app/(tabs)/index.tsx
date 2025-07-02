import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, ChefHat, Clock, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const quickActions = [
    {
      id: 1,
      title: 'Scan Fridge',
      description: 'Detect food items',
      icon: Camera,
      color: '#FF6B35',
      onPress: () => router.push('/camera'),
    },
    {
      id: 2,
      title: 'Quick Recipes',
      description: '5-minute meals',
      icon: Clock,
      color: '#4ECDC4',
      onPress: () => router.push('/recipes'),
    },
    {
      id: 3,
      title: 'Chef\'s Choice',
      description: 'Popular recipes',
      icon: ChefHat,
      color: '#45B7D1',
      onPress: () => router.push('/recipes'),
    },
    {
      id: 4,
      title: 'Trending',
      description: 'What\'s popular',
      icon: TrendingUp,
      color: '#96CEB4',
      onPress: () => router.push('/recipes'),
    },
  ];

  const recentRecipes = [
    {
      id: 1,
      title: 'Pasta Carbonara',
      time: '15 min',
      difficulty: 'Easy',
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Chicken Stir Fry',
      time: '20 min',
      difficulty: 'Medium',
      image: 'https://images.pexels.com/photos/2741452/pexels-photo-2741452.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const handleRecipePress = (recipe: any) => {
    // Navigate to recipes page with the specific recipe
    router.push('/recipes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Hello, Student! 👋</Text>
            <Text style={styles.subtitle}>What's cooking today?</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Recipes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Recipes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentRecipes.map((recipe) => (
              <TouchableOpacity 
                key={recipe.id} 
                style={styles.recipeCard} 
                activeOpacity={0.8}
                onPress={() => handleRecipePress(recipe)}
              >
                <LinearGradient
                  colors={['#4ECDC4', '#44A08D']}
                  style={styles.recipeImage}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.recipeOverlay}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeTime}>{recipe.time}</Text>
                      <Text style={styles.recipeDifficulty}>{recipe.difficulty}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Pro Tip</Text>
            <Text style={styles.tipText}>
              Take a photo of your fridge contents to get personalized recipe suggestions based on what you have!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  recipeCard: {
    width: 200,
    height: 120,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recipeImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  recipeOverlay: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  recipeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  recipeDifficulty: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    lineHeight: 20,
  },
});