import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Clock, Users, Star, Bookmark, ListFilter as Filter, X, ChefHat, Plus } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalSearchParams } from 'expo-router';
import { recipeDatabase, findRecipesByIngredients, getRecipesByCategory, searchRecipes, Recipe } from '@/data/recipes';

const { width } = Dimensions.get('window');

export default function RecipesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>(recipeDatabase);
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);
  const { t } = useLanguage();
  const params = useLocalSearchParams();

  // Gérer les ingrédients détectés depuis la caméra
  useEffect(() => {
    if (params.detectedIngredients) {
      const ingredients = (params.detectedIngredients as string).split(',');
      const matchingRecipes = findRecipesByIngredients(ingredients);
      setRecipes(matchingRecipes);
      setSearchQuery(`Recettes avec: ${ingredients.join(', ')}`);
    }
  }, [params.detectedIngredients]);

  const categories = [
    { key: 'All', label: t('recipes.categories.all') },
    { key: 'Quick', label: t('recipes.categories.quick') },
    { key: 'Breakfast', label: t('recipes.categories.breakfast') },
    { key: 'Lunch', label: t('recipes.categories.lunch') },
    { key: 'Dinner', label: t('recipes.categories.dinner') },
    { key: 'Snacks', label: t('recipes.categories.snacks') },
    { key: 'Vegetarian', label: t('recipes.categories.vegetarian') },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setRecipes(getRecipesByCategory(selectedCategory));
    } else {
      const searchResults = searchRecipes(query);
      setRecipes(searchResults);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (searchQuery.trim() === '') {
      setRecipes(getRecipesByCategory(category));
    }
  };

  const toggleBookmark = (recipeId: number) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isBookmarked: !recipe.isBookmarked }
          : recipe
      )
    );
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>{t('recipes.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('recipes.subtitle')}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddRecipeForm(true)}
          >
            <Plus size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#7F8C8D" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('recipes.search')}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#BDC3C7"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#2a8540" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              selectedCategory === category.key && styles.categoryButtonActive
            ]}
            onPress={() => handleCategoryChange(category.key)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.key && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipe Count */}
      <View style={styles.recipeCount}>
        <Text style={styles.recipeCountText}>
          {recipes.length} {recipes.length === 1 ? 'recette trouvée' : 'recettes trouvées'}
        </Text>
      </View>

      {/* Recipes List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.recipesContainer}>
        {recipes.map((recipe) => (
          <TouchableOpacity 
            key={recipe.id} 
            style={styles.recipeCard} 
            activeOpacity={0.8}
            onPress={() => openRecipeModal(recipe)}
          >
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => toggleBookmark(recipe.id)}
            >
              <Bookmark
                size={20}
                color={recipe.isBookmarked ? '#2a8540' : '#FFFFFF'}
                fill={recipe.isBookmarked ? '#2a8540' : 'transparent'}
                strokeWidth={2}
              />
            </TouchableOpacity>

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
                  recipe.difficulty === 'Facile' && styles.difficultyEasy,
                  recipe.difficulty === 'Moyen' && styles.difficultyMedium,
                  recipe.difficulty === 'Difficile' && styles.difficultyHard
                ]}>
                  <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                </View>
              </View>

              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsLabel}>{t('recipes.ingredients')}:</Text>
                <Text style={styles.ingredientsList}>
                  {recipe.ingredients.slice(0, 3).join(', ')}
                  {recipe.ingredients.length > 3 && '...'}
                </Text>
              </View>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {recipe.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {recipes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('recipes.noResults')}</Text>
            <Text style={styles.emptyStateSubtext}>
              {t('recipes.noResults.subtitle')}
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
                      <Clock size={16} color="#2a8540" strokeWidth={2} />
                      <Text style={styles.modalStatText}>{selectedRecipe.time}</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Users size={16} color="#2a8540" strokeWidth={2} />
                      <Text style={styles.modalStatText}>{selectedRecipe.servings} {t('recipes.servings')}</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <ChefHat size={16} color="#2a8540" strokeWidth={2} />
                      <Text style={styles.modalStatText}>{selectedRecipe.difficulty}</Text>
                    </View>
                  </View>

                  {/* Cuisine & Tags */}
                  <View style={styles.cuisineSection}>
                    <Text style={styles.cuisineLabel}>Cuisine: <Text style={styles.cuisineText}>{selectedRecipe.cuisine}</Text></Text>
                    <View style={styles.modalTagsContainer}>
                      {selectedRecipe.tags.map((tag, index) => (
                        <View key={index} style={styles.modalTag}>
                          <Text style={styles.modalTagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Nutrition Info */}
                  <View style={styles.nutritionSection}>
                    <Text style={styles.sectionTitle}>{t('recipes.nutrition')}</Text>
                    <View style={styles.nutritionGrid}>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.calories}</Text>
                        <Text style={styles.nutritionLabel}>{t('recipes.nutrition.calories')}</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.protein}g</Text>
                        <Text style={styles.nutritionLabel}>{t('recipes.nutrition.protein')}</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.carbs}g</Text>
                        <Text style={styles.nutritionLabel}>{t('recipes.nutrition.carbs')}</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{selectedRecipe.nutrition.fat}g</Text>
                        <Text style={styles.nutritionLabel}>{t('recipes.nutrition.fat')}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Ingredients */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('recipes.ingredients')}</Text>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientItem}>
                        <Text style={styles.ingredientBullet}>•</Text>
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Instructions */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('recipes.instructions')}</Text>
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
    backgroundColor: '#d5f3dc',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2a8540',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    marginBottom: 16,
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
    backgroundColor: '#2a8540',
    borderColor: '#2a8540',
  },
  categoryText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  recipeCount: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  recipeCountText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic',
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
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    color: '#F39C12',
    marginLeft: 4,
  },
  recipeDescription: {
    fontSize: 14,
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
    color: '#2C3E50',
  },
  ingredientsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 12,
  },
  ingredientsLabel: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 4,
  },
  ingredientsList: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6C757D',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
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
    color: '#F39C12',
    marginLeft: 4,
  },
  modalDescription: {
    fontSize: 16,
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
    color: '#2C3E50',
    marginTop: 4,
  },
  cuisineSection: {
    marginBottom: 24,
  },
  cuisineLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  cuisineText: {
    color: '#2a8540',
    fontWeight: 'bold',
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalTag: {
    backgroundColor: '#d5f3dc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  modalTagText: {
    fontSize: 12,
    color: '#2a8540',
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
    backgroundColor: '#d5f3dc',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  nutritionValue: {
    fontSize: 18,
    color: '#2a8540',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
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
    color: '#2a8540',
    marginRight: 12,
    marginTop: 2,
  },
  ingredientText: {
    fontSize: 16,
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
    backgroundColor: '#2a8540',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
    lineHeight: 22,
  },
});