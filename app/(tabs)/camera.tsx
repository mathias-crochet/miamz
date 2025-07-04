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
      // Convertir l'image en base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Appeler notre API route pour l'analyse Vision
      const response = await fetch('/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'analyse');
      }

      return result.detectedItems || [];
    } catch (error) {
      console.error('Erreur lors de l\'analyse Vision:', error);
      throw error;
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isAnalyzing) {
      setIsAnalyzing(true);
      
      try {
        // Prendre la photo
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (!photo?.uri) {
          throw new Error('Impossible de capturer l\'image');
        }

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
        Alert.alert(
          t('common.error'), 
          error instanceof Error ? error.message : t('camera.error')
        );
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