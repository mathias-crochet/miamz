import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, RotateCcw, Zap, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import * as FileSystem from 'expo-file-system';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { t } = useLanguage();

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2a8540" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#2a8540" strokeWidth={2} />
          <Text style={styles.permissionTitle}>{t('camera.permission.title')}</Text>
          <Text style={styles.permissionText}>
            {t('camera.permission.text')}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>{t('camera.permission.grant')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const analyzeImageWithVision = async (imageUri: string): Promise<string[]> => {
    try {
      console.log('Début de l\'analyse de l\'image:', imageUri);
      
      // Convertir l'image en base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Image convertie en base64, taille:', base64Image.length);

      // Vérifier que la clé API est disponible
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
      if (!apiKey) {
        throw new Error('Clé API Google Vision non configurée. Vérifiez votre fichier .env');
      }

      console.log('Clé API trouvée, appel direct de Google Vision API...');

      // Appeler directement l'API Google Vision (pas notre API route)
      const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
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
        
        throw new Error(`Erreur API Vision (${response.status}): ${errorMessage}`);
      }

      const visionData = await response.json();
      console.log('Données Vision reçues:', JSON.stringify(visionData, null, 2));
      
      // Vérifier s'il y a des erreurs dans la réponse
      if (visionData.responses?.[0]?.error) {
        const visionError = visionData.responses[0].error;
        console.error('Erreur dans la réponse Vision:', visionError);
        throw new Error(`Erreur Vision API: ${visionError.message}`);
      }
      
      // Extraire les éléments liés à la nourriture
      const foodItems = extractFoodItems(visionData);
      console.log('Aliments détectés:', foodItems);
      
      return foodItems;
    } catch (error) {
      console.error('Erreur lors de l\'analyse Vision:', error);
      throw error;
    }
  };

  const extractFoodItems = (visionData: any): string[] => {
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
    ];
    
    const detectedItems = new Set<string>();
    const confidenceThreshold = 0.3;
    
    console.log('Extraction des aliments depuis:', visionData);
    
    // Traiter les résultats de détection d'étiquettes
    if (visionData.responses?.[0]?.labelAnnotations) {
      console.log('Labels détectés:', visionData.responses[0].labelAnnotations.length);
      
      visionData.responses[0].labelAnnotations.forEach((label: any) => {
        const description = label.description.toLowerCase();
        const score = label.score || 0;
        
        console.log(`Label: "${description}" (score: ${score})`);
        
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
  };

  const translateToFrench = (englishTerm: string): string => {
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
  };

  const takePicture = async () => {
    if (cameraRef.current && !isAnalyzing) {
      setIsAnalyzing(true);
      
      try {
        console.log('Prise de photo...');
        
        // Prendre la photo
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (!photo?.uri) {
          throw new Error('Impossible de capturer l\'image');
        }

        console.log('Photo prise:', photo.uri);

        // Analyser l'image avec Google Vision
        const detectedItems = await analyzeImageWithVision(photo.uri);
        
        if (detectedItems.length === 0) {
          Alert.alert(
            t('camera.noFood.title'),
            t('camera.noFood.message'),
            [
              {
                text: t('common.cancel'),
                style: 'cancel',
              },
              {
                text: t('camera.retake'),
                onPress: () => console.log('Reprendre photo'),
              },
            ]
          );
          return;
        }

        // Afficher les résultats
        Alert.alert(
          t('camera.detected.title'),
          `${t('camera.detected.found')}: ${detectedItems.join(', ')}\n\n${t('camera.detected.question')}`,
          [
            {
              text: t('camera.detected.later'),
              style: 'cancel',
            },
            {
              text: t('camera.detected.showRecipes'),
              onPress: () => {
                // Naviguer vers les recettes avec les ingrédients détectés
                router.push({
                  pathname: '/recipes',
                  params: { detectedIngredients: detectedItems.join(',') }
                });
              },
            },
          ]
        );

        // Nettoyer le fichier temporaire
        await FileSystem.deleteAsync(photo.uri, { idempotent: true });

      } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        
        let errorMessage = t('camera.error');
        if (error instanceof Error) {
          if (error.message.includes('clé API')) {
            errorMessage = 'Clé API Google Vision non configurée. Vérifiez votre configuration.';
          } else if (error.message.includes('HTTP 400')) {
            errorMessage = 'Clé API invalide ou requête malformée.';
          } else if (error.message.includes('HTTP 403')) {
            errorMessage = 'Accès refusé. Vérifiez que l\'API Vision est activée et que votre clé API a les bonnes permissions.';
          } else if (error.message.includes('HTTP 429')) {
            errorMessage = 'Quota d\'API dépassé. Veuillez réessayer plus tard.';
          } else {
            errorMessage = error.message;
          }
        }
        
        Alert.alert(t('common.error'), errorMessage);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('camera.title')}</Text>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
          <RotateCcw size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Overlay with guide */}
          <View style={styles.overlay}>
            <View style={styles.guideFrame} />
            <Text style={styles.guideText}>
              {t('camera.guide')}
            </Text>
          </View>
        </CameraView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        <View style={styles.controlsRow}>
          <View style={styles.controlSpacer} />
          
          <TouchableOpacity
            style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.captureButtonText}>{t('camera.analyzing')}</Text>
              </>
            ) : (
              <>
                <Zap size={24} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.captureButtonText}>{t('camera.scanFood')}</Text>
              </>
            )}
          </TouchableOpacity>
          
          <View style={styles.controlSpacer} />
        </View>

        <Text style={styles.tip}>
          {t('camera.tip')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d5f3dc',
  },
  loadingText: {
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d5f3dc',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#2a8540',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  guideFrame: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderColor: '#2a8540',
    borderRadius: 12,
    backgroundColor: 'rgba(42, 133, 64, 0.1)',
  },
  guideText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  controlSpacer: {
    width: 60,
  },
  captureButton: {
    backgroundColor: '#2a8540',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  captureButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  captureButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tip: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
  },
});