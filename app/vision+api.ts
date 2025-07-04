export async function POST(request: Request) {
  try {
    const { image, apiKey } = await request.json();
    
    if (!image || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Image ou clé API manquante' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Point de terminaison de l'API Google Vision
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const requestBody = {
      requests: [
        {
          image: {
            content: image, // image encodée en base64
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 20,
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 20,
            },
          ],
        },
      ],
    };

    const response = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erreur API Vision: ${response.status} - ${errorData.error?.message || 'Erreur inconnue'}`);
    }

    const visionData = await response.json();
    
    // Vérifier s'il y a des erreurs dans la réponse
    if (visionData.responses?.[0]?.error) {
      throw new Error(`Erreur Vision API: ${visionData.responses[0].error.message}`);
    }
    
    // Extraire les éléments liés à la nourriture
    const foodItems = extractFoodItems(visionData);
    
    return new Response(
      JSON.stringify({
        success: true,
        detectedItems: foodItems,
        rawData: visionData, // Pour le débogage
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erreur API Vision:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Échec de l\'analyse de l\'image',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function extractFoodItems(visionData: any): string[] {
  const foodKeywords = [
    // Fruits
    'apple', 'banana', 'orange', 'lemon', 'lime', 'strawberry', 'grape', 'cherry',
    'peach', 'pear', 'plum', 'kiwi', 'mango', 'pineapple', 'watermelon', 'melon',
    'avocado', 'tomato', 'berry', 'fruit',
    
    // Légumes
    'carrot', 'broccoli', 'lettuce', 'spinach', 'cabbage', 'onion', 'garlic',
    'potato', 'sweet potato', 'bell pepper', 'pepper', 'cucumber', 'zucchini',
    'eggplant', 'mushroom', 'corn', 'peas', 'beans', 'celery', 'radish',
    'vegetable', 'salad', 'greens',
    
    // Protéines
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'egg',
    'meat', 'poultry', 'seafood', 'protein',
    
    // Produits laitiers
    'milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy',
    
    // Céréales et féculents
    'bread', 'rice', 'pasta', 'noodles', 'cereal', 'oats', 'quinoa',
    'flour', 'grain', 'wheat',
    
    // Autres aliments
    'food', 'ingredient', 'cooking', 'kitchen', 'meal', 'dish',
    'sauce', 'oil', 'vinegar', 'spice', 'herb', 'seasoning',
    'nuts', 'seeds', 'honey', 'sugar', 'salt',
    
    // Mots français
    'pomme', 'banane', 'orange', 'citron', 'fraise', 'raisin', 'cerise',
    'pêche', 'poire', 'kiwi', 'mangue', 'ananas', 'pastèque', 'melon',
    'avocat', 'tomate', 'fruit', 'légume', 'carotte', 'brocoli',
    'laitue', 'épinard', 'chou', 'oignon', 'ail', 'pomme de terre',
    'poivron', 'concombre', 'courgette', 'aubergine', 'champignon',
    'maïs', 'petits pois', 'haricots', 'céleri', 'radis', 'salade',
    'poulet', 'bœuf', 'porc', 'poisson', 'saumon', 'thon', 'crevette',
    'œuf', 'viande', 'volaille', 'fruits de mer', 'protéine',
    'lait', 'fromage', 'yaourt', 'beurre', 'crème', 'produit laitier',
    'pain', 'riz', 'pâtes', 'nouilles', 'céréales', 'avoine', 'quinoa',
    'farine', 'grain', 'blé', 'nourriture', 'ingrédient', 'cuisine',
    'repas', 'plat', 'sauce', 'huile', 'vinaigre', 'épice', 'herbe',
    'assaisonnement', 'noix', 'graines', 'miel', 'sucre', 'sel'
  ];
  
  const detectedItems = new Set<string>();
  const confidenceThreshold = 0.5; // Seuil de confiance minimum
  
  // Traiter les résultats de détection d'étiquettes
  if (visionData.responses?.[0]?.labelAnnotations) {
    visionData.responses[0].labelAnnotations.forEach((label: any) => {
      const description = label.description.toLowerCase();
      const score = label.score || 0;
      
      // Vérifier le seuil de confiance et les mots-clés liés à la nourriture
      if (score >= confidenceThreshold && 
          foodKeywords.some(keyword => 
            description.includes(keyword) || keyword.includes(description)
          )) {
        // Traduire en français si nécessaire
        const frenchTranslation = translateToFrench(description);
        detectedItems.add(frenchTranslation);
      }
    });
  }
  
  // Traiter les résultats de localisation d'objets
  if (visionData.responses?.[0]?.localizedObjectAnnotations) {
    visionData.responses[0].localizedObjectAnnotations.forEach((obj: any) => {
      const name = obj.name.toLowerCase();
      const score = obj.score || 0;
      
      if (score >= confidenceThreshold &&
          foodKeywords.some(keyword => 
            name.includes(keyword) || keyword.includes(name)
          )) {
        const frenchTranslation = translateToFrench(name);
        detectedItems.add(frenchTranslation);
      }
    });
  }
  
  return Array.from(detectedItems);
}

function translateToFrench(englishTerm: string): string {
  const translations: Record<string, string> = {
    'apple': 'pomme',
    'banana': 'banane',
    'orange': 'orange',
    'lemon': 'citron',
    'strawberry': 'fraise',
    'grape': 'raisin',
    'cherry': 'cerise',
    'peach': 'pêche',
    'pear': 'poire',
    'kiwi': 'kiwi',
    'mango': 'mangue',
    'pineapple': 'ananas',
    'watermelon': 'pastèque',
    'melon': 'melon',
    'avocado': 'avocat',
    'tomato': 'tomate',
    'fruit': 'fruit',
    'carrot': 'carotte',
    'broccoli': 'brocoli',
    'lettuce': 'laitue',
    'spinach': 'épinard',
    'cabbage': 'chou',
    'onion': 'oignon',
    'garlic': 'ail',
    'potato': 'pomme de terre',
    'bell pepper': 'poivron',
    'pepper': 'poivron',
    'cucumber': 'concombre',
    'zucchini': 'courgette',
    'eggplant': 'aubergine',
    'mushroom': 'champignon',
    'corn': 'maïs',
    'peas': 'petits pois',
    'beans': 'haricots',
    'celery': 'céleri',
    'radish': 'radis',
    'vegetable': 'légume',
    'salad': 'salade',
    'chicken': 'poulet',
    'beef': 'bœuf',
    'pork': 'porc',
    'fish': 'poisson',
    'salmon': 'saumon',
    'tuna': 'thon',
    'shrimp': 'crevette',
    'egg': 'œuf',
    'meat': 'viande',
    'poultry': 'volaille',
    'seafood': 'fruits de mer',
    'milk': 'lait',
    'cheese': 'fromage',
    'yogurt': 'yaourt',
    'butter': 'beurre',
    'cream': 'crème',
    'bread': 'pain',
    'rice': 'riz',
    'pasta': 'pâtes',
    'noodles': 'nouilles',
    'cereal': 'céréales',
    'oats': 'avoine',
    'quinoa': 'quinoa',
    'flour': 'farine',
    'grain': 'grain',
    'wheat': 'blé',
    'food': 'nourriture',
    'ingredient': 'ingrédient',
    'cooking': 'cuisine',
    'meal': 'repas',
    'dish': 'plat',
    'sauce': 'sauce',
    'oil': 'huile',
    'vinegar': 'vinaigre',
    'spice': 'épice',
    'herb': 'herbe',
    'nuts': 'noix',
    'seeds': 'graines',
    'honey': 'miel',
    'sugar': 'sucre',
    'salt': 'sel'
  };
  
  return translations[englishTerm] || englishTerm;
}