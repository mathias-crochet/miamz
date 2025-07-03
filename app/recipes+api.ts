import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [diet, setDiet] = useState<string | null>(null);
  const [exclude, setExclude] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false); // <-- Ajouté

  // Gets the recipes matching the input term
  const getRecipes = async () => {
    try {
      const dietParam = diet === 'none' ? '' : diet;
      setLoading(true);
      const res = await axios.get('/api/search', {
        params: { keyword, diet: dietParam, exclude }
      });
      const { data } = res;
      if (typeof data === 'object' && data !== null && 'results' in data) {
        setResponse((data as { results: any }).results);
      } else {
        setResponse(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // <-- Ajouté pour arrêter le loading
    }
  };

function generateMockRecipes(ingredients: string[]): any[] {
  const recipeDatabase = [
    {
      id: 1,
      title: 'Quick Tomato Pasta',
      description: 'Simple pasta with fresh tomatoes and herbs',
      time: '15 min',
      servings: 2,
      difficulty: 'Easy',
      rating: 4.5,
      ingredients: ['tomato', 'pasta', 'garlic', 'oil'],
      instructions: [
        'Boil pasta according to package directions',
        'Heat oil in a pan and sauté garlic',
        'Add diced tomatoes and cook until soft',
        'Toss with cooked pasta and serve'
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
      title: 'Fresh Garden Salad',
      description: 'Crisp vegetables with a light dressing',
      time: '10 min',
      servings: 1,
      difficulty: 'Easy',
      rating: 4.3,
      ingredients: ['lettuce', 'tomato', 'cucumber', 'carrot'],
      instructions: [
        'Wash and chop all vegetables',
        'Mix in a large bowl',
        'Add your favorite dressing',
        'Serve immediately'
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
      title: 'Cheesy Vegetable Omelet',
      description: 'Fluffy eggs with cheese and vegetables',
      time: '12 min',
      servings: 1,
      difficulty: 'Medium',
      rating: 4.7,
      ingredients: ['egg', 'cheese', 'vegetables', 'butter'],
      instructions: [
        'Beat eggs in a bowl',
        'Heat butter in a non-stick pan',
        'Pour eggs and let them set slightly',
        'Add cheese and vegetables, fold omelet'
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
      title: 'Chicken Stir Fry',
      description: 'Protein-packed meal with colorful vegetables',
      time: '20 min',
      servings: 2,
      difficulty: 'Medium',
      rating: 4.6,
      ingredients: ['chicken', 'vegetables', 'soy sauce', 'rice'],
      instructions: [
        'Cut chicken into small pieces',
        'Heat oil in a wok or large pan',
        'Cook chicken until golden',
        'Add vegetables and stir fry',
        'Season with soy sauce and serve over rice'
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
  
  // Filter recipes based on available ingredients
  const availableIngredients = ingredients.map(ing => ing.trim().toLowerCase());
  
  const matchingRecipes = recipeDatabase.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    
    // Check if at least 50% of recipe ingredients are available
    const matchCount = recipeIngredients.filter(ing => 
      availableIngredients.some(available => 
        available.includes(ing) || ing.includes(available)
      )
    ).length;
    
    return matchCount >= Math.ceil(recipeIngredients.length * 0.5);
  });
  
  // Sort by number of matching ingredients (descending)
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

/* Removed duplicate setLoading function, as setLoading is already defined by useState */
}
