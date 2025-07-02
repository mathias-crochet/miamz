import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, ChefHat, Clock, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const quickActions = [
    {
      id: 1,
      title: t('home.scanFridge'),
      description: t('home.scanFridge.desc'),
      icon: Camera,
      color: '#2a8540',
      onPress: () => router.push('/camera'),
    },
    {
      id: 2,
      title: t('home.quickRecipes'),
      description: t('home.quickRecipes.desc'),
      icon: Clock,
      color: '#4ECDC4',
      onPress: () => router.push('/recipes'),
    },
    {
      id: 3,
      title: t('home.chefsChoice'),
      description: t('home.chefsChoice.desc'),
      icon: ChefHat,
      color: '#45B7D1',
      onPress: () => router.push('/recipes'),
    },
    {
      id: 4,
      title: t('home.trending'),
      description: t('home.trending.desc'),
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
      difficulty: t('recipes.difficulty.easy'),
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Chicken Stir Fry',
      time: '20 min',
      difficulty: t('recipes.difficulty.medium'),
      image: 'https://images.pexels.com/photos/2741452/pexels-photo-2741452.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const handleRecipePress = (recipe: any) => {
    router.push('/recipes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#2a8540', '#1e6b32']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{t('home.greeting')}</Text>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
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
          <Text style={styles.sectionTitle}>{t('home.recentRecipes')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentRecipes.map((recipe) => (
              <TouchableOpacity 
                key={recipe.id} 
                style={styles.recipeCard} 
                activeOpacity={0.8}
                onPress={() => handleRecipePress(recipe)}
              >
                <LinearGradient
                  colors={['#2a8540', '#1e6b32']}
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
          <Text style={styles.sectionTitle}>{t('home.studentTips')}</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>{t('home.proTip')}</Text>
            <Text style={styles.tipText}>
              {t('home.tipText')}
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
    backgroundColor: '#d5f3dc',
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
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
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
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeTime: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  recipeDifficulty: {
    fontSize: 12,
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
    color: '#2C3E50',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
});