export async function GET(request: Request) {
  const url = new URL(request.url);
  const ingredients = url.searchParams.get('ingredients');
  
  if (!ingredients) {
    return new Response(
      JSON.stringify({ error: 'Aucun ingrédient fourni' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Dans une vraie application, vous intégreriez avec une API de recettes comme Spoonacular
  // Pour l'instant, nous retournons des données fictives basées sur les ingrédients détectés
  const mockRecipes = generateMockRecipes(ingredients.split(','));
  
  return new Response(
    JSON.stringify({
      success: true,
      recipes: mockRecipes,
      totalResults: mockRecipes.length,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

function generateMockRecipes(ingredients: string[]): any[] {
  const recipeDatabase = [
    {
      id: 1,
      title: 'Pâtes aux Tomates Rapides',
      description: 'Pâtes simples aux tomates fraîches et herbes',
      time: '15 min',
      servings: 2,
      difficulty: 'Facile',
      rating: 4.5,
      ingredients: ['tomate', 'pâtes', 'ail', 'huile'],
      instructions: [
        'Faire bouillir les pâtes selon les instructions',
        'Chauffer l\'huile et faire revenir l\'ail',
        'Ajouter les tomates coupées et cuire jusqu\'à ce qu\'elles soient tendres',
        'Mélanger avec les pâtes cuites et servir'
      ],
      nutrition: {
        calories: 320,
        protein: 12,
        carbs: 58,
        fat: 6
      },
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Salade de Jardin Fraîche',
      description: 'Légumes croquants avec une vinaigrette légère',
      time: '10 min',
      servings: 1,
      difficulty: 'Facile',
      rating: 4.3,
      ingredients: ['laitue', 'tomate', 'concombre', 'carotte'],
      instructions: [
        'Laver et couper tous les légumes',
        'Mélanger dans un grand bol',
        'Ajouter votre vinaigrette préférée',
        'Servir immédiatement'
      ],
      nutrition: {
        calories: 120,
        protein: 3,
        carbs: 15,
        fat: 2
      },
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      title: 'Omelette aux Légumes et Fromage',
      description: 'Œufs moelleux avec fromage et légumes',
      time: '12 min',
      servings: 1,
      difficulty: 'Moyen',
      rating: 4.7,
      ingredients: ['œuf', 'fromage', 'légumes', 'beurre'],
      instructions: [
        'Battre les œufs dans un bol',
        'Chauffer le beurre dans une poêle antiadhésive',
        'Verser les œufs et laisser prendre légèrement',
        'Ajouter fromage et légumes, plier l\'omelette'
      ],
      nutrition: {
        calories: 280,
        protein: 20,
        carbs: 8,
        fat: 18
      },
      image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      title: 'Sauté de Poulet aux Légumes',
      description: 'Repas riche en protéines avec légumes colorés',
      time: '20 min',
      servings: 2,
      difficulty: 'Moyen',
      rating: 4.6,
      ingredients: ['poulet', 'légumes', 'sauce soja', 'riz'],
      instructions: [
        'Couper le poulet en petits morceaux',
        'Chauffer l\'huile dans un wok ou une grande poêle',
        'Cuire le poulet jusqu\'à ce qu\'il soit doré',
        'Ajouter les légumes et faire sauter',
        'Assaisonner avec la sauce soja et servir sur du riz'
      ],
      nutrition: {
        calories: 420,
        protein: 35,
        carbs: 45,
        fat: 12
      },
      image: 'https://images.pexels.com/photos/2741452/pexels-photo-2741452.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];
  
  // Filtrer les recettes basées sur les ingrédients disponibles
  const availableIngredients = ingredients.map(ing => ing.trim().toLowerCase());
  
  const matchingRecipes = recipeDatabase.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    
    // Vérifier si au moins 50% des ingrédients de la recette sont disponibles
    const matchCount = recipeIngredients.filter(ing => 
      availableIngredients.some(available => 
        available.includes(ing) || ing.includes(available)
      )
    ).length;
    
    return matchCount >= Math.ceil(recipeIngredients.length * 0.5);
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