export async function POST(request: Request) {
  try {
    const { image, apiKey } = await request.json();
    
    if (!image || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing image or API key' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Google Vision API endpoint
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const requestBody = {
      requests: [
        {
          image: {
            content: image, // base64 encoded image
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
      throw new Error(`Vision API error: ${response.status}`);
    }

    const visionData = await response.json();
    
    // Extract food-related items
    const foodItems = extractFoodItems(visionData);
    
    return new Response(
      JSON.stringify({
        success: true,
        detectedItems: foodItems,
        rawData: visionData, // For debugging
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Vision API error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error',
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
    'food', 'vegetable', 'fruit', 'meat', 'dairy', 'bread', 'cheese',
    'tomato', 'lettuce', 'carrot', 'onion', 'potato', 'apple', 'banana',
    'chicken', 'beef', 'fish', 'milk', 'egg', 'rice', 'pasta', 'broccoli',
    'pepper', 'cucumber', 'spinach', 'mushroom', 'garlic', 'lemon', 'orange',
    'strawberry', 'avocado', 'beans', 'corn', 'peas', 'nuts', 'yogurt',
    'butter', 'oil', 'herbs', 'spices', 'sauce', 'condiment'
  ];
  
  const detectedItems = new Set<string>();
  
  // Process label detection results
  if (visionData.responses?.[0]?.labelAnnotations) {
    visionData.responses[0].labelAnnotations.forEach((label: any) => {
      const description = label.description.toLowerCase();
      
      // Check if the label contains food-related keywords
      if (foodKeywords.some(keyword => description.includes(keyword))) {
        detectedItems.add(description);
      }
    });
  }
  
  // Process object localization results
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