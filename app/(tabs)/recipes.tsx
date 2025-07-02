import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Clock, Users, Star, Bookmark, Filter, X, ChefHat } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Recipe {
  id: number;
  title: string;
  description: string;
  time: string;
  servings: number;
  difficulty: string;
  rating: number;
  category: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  image: string;
  isBookmarked: boolean;
}

export default function RecipesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = ['All', 'Quick', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Vegetarian'];

  const recipes: Recipe[] = [
    {
      id: 1,
      title: 'Quick Pasta Carbonara',
      description: 'Creamy pasta with eggs, cheese, and bacon',
      time: '15 min',
      servings: 2,
      difficulty: 'Easy',
      rating: 4.8,
      category: 'Quick',
      ingredients: ['200g pasta', '2 eggs', '100g parmesan cheese', '100g bacon', 'black pepper', 'salt'],
      instructions: [
        'Boil pasta according to package directions',
        'Cook bacon until crispy, reserve fat',
        'Beat eggs with cheese and pepper',
        'Drain pasta, mix with bacon fat',
        'Add egg mixture off heat, toss quickly',
        'Serve immediately with extra cheese'
      ],
      nutrition: {
        calories: 520,
        protein: 28,
        carbs: 45,
        fat: 24
      },
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
      isBookmarked: true,
    },
    {
      id: 2,
      title: 'Veggie Stir Fry',
      description: 'Colorful vegetables with soy sauce',
      time: '12 min',
      servings: 3,
      difficulty: 'Easy',
      rating: 4.6,
      category: 'Vegetarian',
      ingredients: ['200g broccoli', '1 carrot', '1 bell pepper', '2 tbsp soy sauce', '1 tbsp oil', 'garlic'],
      instructions: [
        'Heat oil in a large pan or wok',
        'Add garlic and cook for 30 seconds',
        'Add harder vegetables first (carrots)',
        'Add softer vegetables (broccoli, peppers)',
        'Stir fry for 5-7 minutes until tender-crisp',
        'Add soy sauce and toss to coat'
      ],
      nutrition: {
        calories: 180,
        protein: 8,
        carbs: 25,
        fat: 6
      },
      image: 'https://images.pexels.com/photos/2741452/pexels-photo-2741452.jpeg?auto=compress&cs=tinysrgb&w=400',
      isBookmarked: false,
    },
    {
      id: 3,
      title: 'Avocado Toast',
      description: 'Simple and nutritious breakfast',
      time: '5 min',
      servings: 1,
      difficulty: 'Easy',
      rating: 4.5,
      category: 'Breakfast',
      ingredients: ['2 slices bread', '1 ripe avocado', '1 tomato', 'lemon juice', 'salt', 'pepper'],
      instructions: [
        'Toast bread until golden brown',
        'Mash avocado with lemon juice',
        'Season with salt and pepper',
        'Spread avocado on toast',
        'Top with sliced tomato',
        'Add final seasoning to taste'
      ],
      nutrition: {
        calories: 320,
        protein: 8,
        carbs: 35,
        fat: 18
      },
      image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
      isBookmarked: false,
    },
    {
      id: 4,
      title: 'Chicken Rice Bowl',
      description: 'Protein-packed meal with vegetables',
      time: '25 min',
      servings: 2,
      difficulty: 'Medium',
      rating: 4.7,
      category: 'Lunch',
      ingredients: ['300g chicken breast', '1 cup rice', '100g broccoli', '1 carrot', 'teriyaki sauce', 'sesame seeds'],
      instructions: [
        'Cook rice according to package directions',
        'Season and cook chicken until golden',
        'Steam vegetables until tender',
        'Slice chicken into strips',
        'Assemble bowls with rice, chicken, vegetables',
        'Drizzle with teriyaki sauce and sprinkle sesame seeds'
      ],
      nutrition: {
        calories: 450,
        protein: 35,
        carbs: 48,
        fat: 12
      },
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      isBookmarked: true,
    },
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (recipeId: number) => {
    // In a real app, this would update the backend
    console.log('Toggle bookmark for recipe:', recipeId);
  };

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const closeRecipeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipe Collection</Text>
        <Text style={styles.headerSubtitle}>Delicious meals made simple</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#7F8C8D" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#BDC3C7"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FF6B35" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipes List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.recipesContainer}>
        {filteredRecipes.map((recipe) => (
          <TouchableOpacity 
            key={recipe.id} 
            style={styles.recipeCard} 
            activeOpacity={0.8}
            onPress={() => openRecipeModal(recipe)}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.recipeImageContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() => toggleBookmark(recipe.id)}
              >
                <Bookmark
                  size={20}
                  color={recipe.isBookmarked ? '#FF6B35' : '#FFFFFF'}
                  fill={recipe.isBookmarked ? '#FF6B35' : 'transparent'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.recipeContent}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#F39C12" fill="#F39C12" strokeWidth={1} />
                  <Text style={styles.rating}>{recipe.rating}</Text>
                </View>
              </View>

              <Text style={styles.recipeDescription}>{recipe.description}</Text>

              <View style={styles.recipeFooter}>
                <View style={styles.recipeStats}>
                  <View style={styles.statItem}>
                    <Clock size={14} color="#7F8C8D" strokeWidth={2} />
                    <Text style={styles.statText}>{recipe.time}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users size={14} color="#7F8C8D" strokeWidth={2} />
                    <Text style={styles.statText}>{recipe.servings}</Text>
                  </View>
                </View>
                <View style={[styles.difficultyBadge, 
                  recipe.difficulty === 'Easy' && styles.difficultyEasy,
                  recipe.difficulty === 'Medium' && styles.difficultyMedium,
                  recipe.difficulty === 'Hard' && styles.difficultyHard
                ]}>
                  <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                </View>
              </View>

              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsLabel}>Ingredients:</Text>
                <Text style={styles.ingredientsList}>
                  {recipe.ingredients.slice(0, 3).join(', ')}
                  {recipe.ingredients.length > 3 && '...'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recipes found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Recipe Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeRecipeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRecipe && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeRecipeModal} style={styles.closeButton}>
                    <X size={24} color="#2C3E50" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                {/* Recipe Image */}
                <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />

                {/* Recipe Info */}
                <View style={styles.modalBody}>
                  <View style={styles.modalTitleRow}>
                    <Text style={styles.modalTitle}>{selectedRecipe.title}</Text>
                    <View style={styles.modalRating}>
                      <Star size={16} color="#F39C12" fill="#F39C12" strokeWidth={1} />
                      <Text style={styles.modalRatingText}>{selectedRecipe.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.modalDescription}>{selectedRecipe.description}</Text>

                  {/* Recipe Stats */}
                  <View style={styles.modalStats}>
                    <View style={styles.modalStatItem}>
                      <Clock size={16} color="#FF6B35" strokeWidth={2} />
                      <Text style={styles.modalStatText}>{selectedRecipe.time}</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Users size={16} color="#FF6B35" strokeWidth={2} />
                      <Text style={styles.modalStatText}>{selectedRecipe.servings} servings</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <ChefHat size={16} color="#FF6B35" strokeWidth={2} />
                      <Text style={styles.modalStatText}>{selectedRecipe.difficulty}</Text>
                    </View>
                  </View>

                  {/* Nutrition Info */}
                  <View style={styles.nutritionSection}>
                    <Text style={styles.sectionTitle}>Nutrition (per serving)</Text>
                    <View style={styles.nutritionGrid}>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.calories}</Text>
                        <Text style={styles.nutritionLabel}>Calories</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.protein}g</Text>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.carbs}g</Text>
                        <Text style={styles.nutritionLabel}>Carbs</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.fat}g</Text>
                        <Text style={styles.nutritionLabel}>Fat</Text>
                      </View>
                    </View>
                  </View>

                  {/* Ingredients */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientItem}>
                        <Text style={styles.ingredientBullet}>•</Text>
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Instructions */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <View key={index} style={styles.instructionItem}>
                        <View style={styles.instructionNumber}>
                          <Text style={styles.instructionNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.instructionText}>{instruction}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C3E50',
    marginLeft: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
    maxHeight: 50,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 36,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#7F8C8D',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  recipesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  recipeCard: {
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
  recipeImageContainer: {
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
  recipeContent: {
    padding: 20,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeTitle: {
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
  recipeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 16,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeStats: {
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
  ingredientsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  ingredientsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  ingredientsList: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },
  modalBody: {
    padding: 24,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 16,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F39C12',
    marginLeft: 4,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginTop: 4,
  },
  nutritionSection: {
    marginBottom: 24,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientBullet: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    marginRight: 12,
    marginTop: 2,
  },
  ingredientText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C3E50',
    flex: 1,
    lineHeight: 22,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C3E50',
    flex: 1,
    lineHeight: 22,
  },
});