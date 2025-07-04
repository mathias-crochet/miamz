export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, apiKey } = body;
    
    console.log('API Vision appelée avec:', {
      hasImage: !!image,
      hasApiKey: !!apiKey,
      imageLength: image?.length || 0
    });
    
    if (!image) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Image manquante dans la requête' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Clé API Google Vision manquante' 
        }),
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

    console.log('Appel à Google Vision API...');

    const response = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Réponse Google Vision:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Google Vision:', errorText);
      
      let errorMessage = 'Erreur inconnue';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `Erreur API Vision (${response.status}): ${errorMessage}`,
          details: errorText
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const visionData = await response.json();
    console.log('Données Vision reçues:', JSON.stringify(visionData, null, 2));
    
    // Vérifier s'il y a des erreurs dans la réponse
    if (visionData.responses?.[0]?.error) {
      const visionError = visionData.responses[0].error;
      console.error('Erreur dans la réponse Vision:', visionError);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `Erreur Vision API: ${visionError.message}`,
          details: visionError
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Extraire les éléments liés à la nourriture
    const foodItems = extractFoodItems(visionData);
    console.log('Aliments détectés:', foodItems);
    
    return new Response(
      JSON.stringify({
        success: true,
        detectedItems: foodItems,
        totalDetections: foodItems.length,
        rawData: visionData, // Pour le débogage
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erreur dans l\'API Vision:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
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
  const confidenceThreshold = 0.3; // Seuil de confiance réduit pour plus de détections
  
  console.log('Extraction des aliments depuis:', visionData);
  
  // Traiter les résultats de détection d'étiquettes
  if (visionData.responses?.[0]?.labelAnnotations) {
    console.log('Labels détectés:', visionData.responses[0].labelAnnotations.length);
    
    visionData.responses[0].labelAnnotations.forEach((label: any) => {
      const description = label.description.toLowerCase();
      const score = label.score || 0;
      
      console.log(`Label: "${description}" (score: ${score})`);
      
      // Vérifier le seuil de confiance et les mots-clés liés à la nourriture
      if (score >= confidenceThreshold) {
        const isFood = foodKeywords.some(keyword => 
          description.includes(keyword) || keyword.includes(description)
        );
        
        if (isFood) {
          const frenchTranslation = translateToFrench(description);
          console.log(`Aliment trouvé: ${description} -> ${frenchTranslation}`);
          detectedItems.add(frenchTranslation);
        }
      }
    });
  }
  
  // Traiter les résultats de localisation d'objets
  if (visionData.responses?.[0]?.localizedObjectAnnotations) {
    console.log('Objets localisés:', visionData.responses[0].localizedObjectAnnotations.length);
    
    visionData.responses[0].localizedObjectAnnotations.forEach((obj: any) => {
      const name = obj.name.toLowerCase();
      const score = obj.score || 0;
      
      console.log(`Objet: "${name}" (score: ${score})`);
      
      if (score >= confidenceThreshold) {
        const isFood = foodKeywords.some(keyword => 
          name.includes(keyword) || keyword.includes(name)
        );
        
        if (isFood) {
          const frenchTranslation = translateToFrench(name);
          console.log(`Objet alimentaire trouvé: ${name} -> ${frenchTranslation}`);
          detectedItems.add(frenchTranslation);
        }
      }
    });
  }
  
  const result = Array.from(detectedItems);
  console.log('Aliments finaux détectés:', result);
  return result;
}

function translateToFrench(englishTerm: string): string {
  const translations: Record<string, string> = {
    'apple': 'pomme',
    'banana': 'banane',
    'orange': 'orange',
    'lemon': 'citron',
    'lime': 'citron vert',
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
    'sweet potato': 'patate douce',
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
    'greens': 'légumes verts',
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
    'protein': 'protéine',
    'milk': 'lait',
    'cheese': 'fromage',
    'yogurt': 'yaourt',
    'butter': 'beurre',
    'cream': 'crème',
    'dairy': 'produit laitier',
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
    'kitchen': 'cuisine',
    'meal': 'repas',
    'dish': 'plat',
    'sauce': 'sauce',
    'oil': 'huile',
    'vinegar': 'vinaigre',
    'spice': 'épice',
    'herb': 'herbe',
    'seasoning': 'assaisonnement',
    'nuts': 'noix',
    'seeds': 'graines',
    'honey': 'miel',
    'sugar': 'sucre',
    'salt': 'sel'
  };
  
  return translations[englishTerm] || englishTerm;
}