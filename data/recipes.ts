export interface Recipe {
  id: number;
  title: string;
  description: string;
  time: string;
  servings: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
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
  tags: string[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  cuisine: string;
  dietaryRestrictions: string[];
}

export const recipeDatabase: Recipe[] = [
  // Recettes existantes
  {
    id: 1,
    title: 'Pâtes Carbonara Rapides',
    description: 'Pâtes crémeuses aux œufs, fromage et lardons',
    time: '15 min',
    prepTime: '5 min',
    cookTime: '10 min',
    totalTime: '15 min',
    servings: 2,
    difficulty: 'Facile',
    rating: 4.8,
    category: 'Quick',
    cuisine: 'Italienne',
    dietaryRestrictions: [],
    tags: ['rapide', 'pâtes', 'crémeux', 'italien'],
    ingredients: ['200g de pâtes', '2 œufs', '100g de parmesan', '100g de lardons', 'poivre noir', 'sel'],
    instructions: [
      'Faire bouillir les pâtes selon les instructions',
      'Cuire les lardons jusqu\'à ce qu\'ils soient croustillants',
      'Battre les œufs avec le fromage et le poivre',
      'Égoutter les pâtes, mélanger avec la graisse des lardons',
      'Ajouter le mélange d\'œufs hors du feu, mélanger rapidement',
      'Servir immédiatement avec du fromage supplémentaire'
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

  // Nouvelles recettes - Petit-déjeuner
  {
    id: 5,
    title: 'Pancakes Moelleux',
    description: 'Pancakes américains parfaits pour le petit-déjeuner',
    time: '20 min',
    prepTime: '10 min',
    cookTime: '10 min',
    totalTime: '20 min',
    servings: 4,
    difficulty: 'Facile',
    rating: 4.6,
    category: 'Breakfast',
    cuisine: 'Américaine',
    dietaryRestrictions: ['végétarien'],
    tags: ['petit-déjeuner', 'sucré', 'moelleux', 'américain'],
    ingredients: [
      '200g de farine',
      '2 œufs',
      '300ml de lait',
      '2 c. à soupe de sucre',
      '1 c. à café de levure',
      '1 pincée de sel',
      'beurre pour la cuisson'
    ],
    instructions: [
      'Mélanger la farine, le sucre, la levure et le sel',
      'Battre les œufs avec le lait',
      'Incorporer le mélange liquide aux ingrédients secs',
      'Laisser reposer 5 minutes',
      'Cuire dans une poêle beurrée, 2-3 min par côté',
      'Servir chaud avec du sirop d\'érable'
    ],
    nutrition: {
      calories: 280,
      protein: 12,
      carbs: 45,
      fat: 8
    },
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  },

  {
    id: 6,
    title: 'Smoothie Bowl Énergisant',
    description: 'Bowl de smoothie aux fruits et granola',
    time: '10 min',
    prepTime: '10 min',
    cookTime: '0 min',
    totalTime: '10 min',
    servings: 1,
    difficulty: 'Facile',
    rating: 4.4,
    category: 'Breakfast',
    cuisine: 'Healthy',
    dietaryRestrictions: ['végétarien', 'sans gluten'],
    tags: ['healthy', 'fruits', 'énergisant', 'coloré'],
    ingredients: [
      '1 banane congelée',
      '100g de fruits rouges',
      '100ml de lait d\'amande',
      '1 c. à soupe de miel',
      'granola',
      'noix de coco râpée',
      'graines de chia'
    ],
    instructions: [
      'Mixer la banane, les fruits rouges et le lait d\'amande',
      'Ajouter le miel et mixer jusqu\'à obtenir une consistance épaisse',
      'Verser dans un bol',
      'Garnir avec le granola, la noix de coco et les graines de chia',
      'Servir immédiatement'
    ],
    nutrition: {
      calories: 320,
      protein: 8,
      carbs: 58,
      fat: 12
    },
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  },

  // Nouvelles recettes - Déjeuner
  {
    id: 7,
    title: 'Salade César Maison',
    description: 'Salade César classique avec croûtons et parmesan',
    time: '15 min',
    prepTime: '15 min',
    cookTime: '0 min',
    totalTime: '15 min',
    servings: 2,
    difficulty: 'Facile',
    rating: 4.5,
    category: 'Lunch',
    cuisine: 'Américaine',
    dietaryRestrictions: ['végétarien'],
    tags: ['salade', 'frais', 'classique', 'léger'],
    ingredients: [
      '1 laitue romaine',
      '50g de parmesan',
      '2 tranches de pain',
      '2 c. à soupe d\'huile d\'olive',
      '1 c. à soupe de jus de citron',
      '1 c. à café de moutarde',
      '1 gousse d\'ail',
      'sel et poivre'
    ],
    instructions: [
      'Couper le pain en cubes et les faire griller avec un peu d\'huile',
      'Laver et couper la laitue',
      'Préparer la vinaigrette avec l\'huile, le citron, la moutarde et l\'ail',
      'Mélanger la salade avec la vinaigrette',
      'Ajouter les croûtons et le parmesan râpé',
      'Servir immédiatement'
    ],
    nutrition: {
      calories: 250,
      protein: 12,
      carbs: 18,
      fat: 16
    },
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  },

  {
    id: 8,
    title: 'Wrap au Poulet Grillé',
    description: 'Wrap healthy au poulet et légumes croquants',
    time: '25 min',
    prepTime: '10 min',
    cookTime: '15 min',
    totalTime: '25 min',
    servings: 2,
    difficulty: 'Moyen',
    rating: 4.7,
    category: 'Lunch',
    cuisine: 'Fusion',
    dietaryRestrictions: [],
    tags: ['wrap', 'poulet', 'healthy', 'portable'],
    ingredients: [
      '2 tortillas',
      '300g de blanc de poulet',
      '1 avocat',
      '1 tomate',
      '100g de laitue',
      '50g de fromage râpé',
      '2 c. à soupe de sauce yaourt',
      'épices (paprika, cumin)',
      'huile d\'olive'
    ],
    instructions: [
      'Assaisonner et griller le poulet avec les épices',
      'Laisser refroidir et couper en lamelles',
      'Préparer les légumes : couper l\'avocat et la tomate',
      'Réchauffer légèrement les tortillas',
      'Étaler la sauce yaourt sur les tortillas',
      'Garnir avec le poulet, les légumes et le fromage',
      'Rouler fermement et couper en deux'
    ],
    nutrition: {
      calories: 420,
      protein: 32,
      carbs: 35,
      fat: 18
    },
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  },

  // Nouvelles recettes - Dîner
  {
    id: 9,
    title: 'Saumon Grillé aux Légumes',
    description: 'Saumon grillé avec légumes de saison rôtis',
    time: '30 min',
    prepTime: '10 min',
    cookTime: '20 min',
    totalTime: '30 min',
    servings: 2,
    difficulty: 'Moyen',
    rating: 4.8,
    category: 'Dinner',
    cuisine: 'Méditerranéenne',
    dietaryRestrictions: ['sans gluten'],
    tags: ['poisson', 'healthy', 'protéines', 'légumes'],
    ingredients: [
      '2 filets de saumon',
      '1 courgette',
      '1 poivron rouge',
      '200g de brocolis',
      '2 c. à soupe d\'huile d\'olive',
      '1 citron',
      'herbes de Provence',
      'sel et poivre'
    ],
    instructions: [
      'Préchauffer le four à 200°C',
      'Couper les légumes en morceaux',
      'Mélanger les légumes avec l\'huile et les herbes',
      'Enfourner les légumes 15 minutes',
      'Assaisonner le saumon et le griller 6-8 minutes',
      'Servir avec un quartier de citron'
    ],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 15,
      fat: 22
    },
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  },

  {
    id: 10,
    title: 'Curry de Lentilles',
    description: 'Curry végétarien aux lentilles et lait de coco',
    time: '35 min',
    prepTime: '10 min',
    cookTime: '25 min',
    totalTime: '35 min',
    servings: 4,
    difficulty: 'Moyen',
    rating: 4.6,
    category: 'Dinner',
    cuisine: 'Indienne',
    dietaryRestrictions: ['végétarien', 'vegan', 'sans gluten'],
    tags: ['curry', 'lentilles', 'épicé', 'réconfortant'],
    ingredients: [
      '200g de lentilles corail',
      '400ml de lait de coco',
      '1 oignon',
      '2 gousses d\'ail',
      '1 morceau de gingembre',
      '1 c. à soupe de curry',
      '1 c. à café de curcuma',
      '400g de tomates concassées',
      'coriandre fraîche'
    ],
    instructions: [
      'Faire revenir l\'oignon, l\'ail et le gingembre',
      'Ajouter les épices et cuire 1 minute',
      'Ajouter les lentilles et les tomates',
      'Verser le lait de coco et laisser mijoter 20 minutes',
      'Assaisonner et garnir de coriandre',
      'Servir avec du riz basmati'
    ],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 45,
      fat: 8
    },
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  },

  // Nouvelles recettes - Collations
  {
    id: 11,
    title: 'Energy Balls Coco-Dattes',
    description: 'Boules d\'énergie naturelles aux dattes et noix de coco',
    time: '15 min',
    prepTime: '15 min',
    cookTime: '0 min',
    totalTime: '15 min',
    servings: 12,
    difficulty: 'Facile',
    rating: 4.5,
    category: 'Snacks',
    cuisine: 'Healthy',
    dietaryRestrictions: ['végétarien', 'vegan', 'sans gluten'],
    tags: ['energy', 'healthy', 'sucré', 'portable'],
    ingredients: [
      '200g de dattes dénoyautées',
      '100g d\'amandes',
      '50g de noix de coco râpée',
      '1 c. à soupe de graines de chia',
      '1 c. à café d\'extrait de vanille',
      'noix de coco pour l\'enrobage'
    ],
    instructions: [
      'Mixer les dattes jusqu\'à obtenir une pâte',
      'Ajouter les amandes et mixer grossièrement',
      'Incorporer la noix de coco, les graines de chia et la vanille',
      'Former des boules avec les mains',
      'Rouler dans la noix de coco',
      'Réfrigérer 30 minutes avant de servir'
    ],
    nutrition: {
      calories: 95,
      protein: 3,
      carbs: 12,
      fat: 5
    },
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  },

  {
    id: 12,
    title: 'Houmous Maison',
    description: 'Houmous crémeux aux pois chiches et tahini',
    time: '10 min',
    prepTime: '10 min',
    cookTime: '0 min',
    totalTime: '10 min',
    servings: 6,
    difficulty: 'Facile',
    rating: 4.4,
    category: 'Snacks',
    cuisine: 'Méditerranéenne',
    dietaryRestrictions: ['végétarien', 'vegan', 'sans gluten'],
    tags: ['houmous', 'healthy', 'protéines', 'apéritif'],
    ingredients: [
      '400g de pois chiches cuits',
      '2 c. à soupe de tahini',
      '2 gousses d\'ail',
      '3 c. à soupe de jus de citron',
      '3 c. à soupe d\'huile d\'olive',
      '1 c. à café de cumin',
      'sel et poivre',
      'paprika pour la garniture'
    ],
    instructions: [
      'Égoutter et rincer les pois chiches',
      'Mixer tous les ingrédients ensemble',
      'Ajouter un peu d\'eau si nécessaire pour la consistance',
      'Goûter et ajuster l\'assaisonnement',
      'Servir dans un bol avec un filet d\'huile d\'olive',
      'Saupoudrer de paprika et servir avec des légumes'
    ],
    nutrition: {
      calories: 140,
      protein: 6,
      carbs: 15,
      fat: 8
    },
    image: 'https://images.pexels.com/photos/6107787/pexels-photo-6107787.jpeg?auto=compress&cs=tinysrgb&w=400',
    isBookmarked: false,
  }
];

// Fonction pour rechercher des recettes par ingrédients
export function findRecipesByIngredients(ingredients: string[]): Recipe[] {
  const availableIngredients = ingredients.map(ing => ing.trim().toLowerCase());
  
  const matchingRecipes = recipeDatabase.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    
    // Vérifier si au moins 40% des ingrédients de la recette sont disponibles
    const matchCount = recipeIngredients.filter(ing => 
      availableIngredients.some(available => 
        available.includes(ing) || ing.includes(available) ||
        // Correspondances spécifiques
        (ing.includes('tomate') && available.includes('tomate')) ||
        (ing.includes('laitue') && available.includes('laitue')) ||
        (ing.includes('fromage') && available.includes('fromage')) ||
        (ing.includes('œuf') && available.includes('œuf')) ||
        (ing.includes('poulet') && available.includes('poulet'))
      )
    ).length;
    
    return matchCount >= Math.ceil(recipeIngredients.length * 0.4);
  });
  
  // Trier par nombre d'ingrédients correspondants (décroissant)
  return matchingRecipes.sort((a, b) => {
    const aMatches = a.ingredients.filter(ing => 
      availableIngredients.some(available => 
        available.includes(ing.toLowerCase()) || ing.toLowerCase().includes(available)
      )
    ).length;
    
    const bMatches = b.ingredients.filter(ing => 
      availableIngredients.some(available => 
        available.includes(ing.toLowerCase()) || ing.toLowerCase().includes(available)
      )
    ).length;
    
    return bMatches - aMatches;
  });
}

// Fonction pour obtenir des recettes par catégorie
export function getRecipesByCategory(category: string): Recipe[] {
  if (category === 'All') {
    return recipeDatabase;
  }
  return recipeDatabase.filter(recipe => recipe.category === category);
}

// Fonction pour rechercher des recettes par texte
export function searchRecipes(query: string): Recipe[] {
  const searchTerm = query.toLowerCase();
  
  return recipeDatabase.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm) ||
    recipe.description.toLowerCase().includes(searchTerm) ||
    recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm)
    ) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    recipe.cuisine.toLowerCase().includes(searchTerm)
  );
}