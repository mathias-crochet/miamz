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
      throw new Error(`Erreur API Vision: ${response.status}`);
    }

    const visionData = await response.json();
    
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
    'nourriture', 'légume', 'fruit', 'viande', 'produit laitier', 'pain', 'fromage',
    'tomate', 'laitue', 'carotte', 'oignon', 'pomme de terre', 'pomme', 'banane',
    'poulet', 'bœuf', 'poisson', 'lait', 'œuf', 'riz', 'pâtes', 'brocoli',
    'poivron', 'concombre', 'épinard', 'champignon', 'ail', 'citron', 'orange',
    'fraise', 'avocat', 'haricots', 'maïs', 'petits pois', 'noix', 'yaourt',
    'beurre', 'huile', 'herbes', 'épices', 'sauce', 'condiment'
  ];
  
  const detectedItems = new Set<string>();
  
  // Traiter les résultats de détection d'étiquettes
  if (visionData.responses?.[0]?.labelAnnotations) {
    visionData.responses[0].labelAnnotations.forEach((label: any) => {
      const description = label.description.toLowerCase();
      
      // Vérifier si l'étiquette contient des mots-clés liés à la nourriture
      if (foodKeywords.some(keyword => description.includes(keyword))) {
        detectedItems.add(description);
      }
    });
  }
  
  // Traiter les résultats de localisation d'objets
  if (visionData.responses?.[0]?.localizedObjectAnnotations) {
    visionData.responses[0].localizedObjectAnnotations.forEach((obj: any) => {
      const name = obj.name.toLowerCase();
      
      if (foodKeywords.some(keyword => name.includes(keyword))) {
        detectedItems.add(name);
      }
    });
  }
  
  return Array.from(detectedItems);
}