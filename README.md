# MIAMZ - Application de Détection d'Aliments

Une application mobile développée avec Expo et React Native qui utilise l'intelligence artificielle pour détecter les aliments dans votre frigo et suggérer des recettes personnalisées.

## Fonctionnalités

- 📸 **Détection d'aliments par IA** : Utilisez votre caméra pour scanner le contenu de votre frigo
- 🍳 **Suggestions de recettes** : Obtenez des recettes basées sur les ingrédients détectés
- 📱 **Interface intuitive** : Design moderne et convivial optimisé pour les étudiants
- 🌍 **Multilingue** : Support du français avec possibilité d'extension

## Technologies Utilisées

- **Expo SDK 53** - Framework de développement mobile
- **React Native** - Interface utilisateur native
- **Expo Router** - Navigation basée sur les fichiers
- **Google Vision API** - Détection et reconnaissance d'images
- **TypeScript** - Typage statique pour une meilleure robustesse

## Configuration

### Prérequis

1. Node.js (version 18 ou supérieure)
2. Expo CLI : `npm install -g @expo/cli`
3. Clé API Google Vision

### Installation

1. Clonez le repository :
```bash
git clone [url-du-repo]
cd miamz-food-detection-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

4. Ajoutez votre clé API Google Vision dans le fichier `.env` :
```
EXPO_PUBLIC_GOOGLE_VISION_API_KEY=votre_cle_api_google_vision
```

### Configuration de l'API Google Vision

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Vision AI :
   - Dans le menu de navigation, allez à "APIs & Services" > "Library"
   - Recherchez "Vision AI" et cliquez sur "Cloud Vision API"
   - Cliquez sur "Enable"
4. Créez des identifiants (clé API) :
   - Allez à "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "API Key"
   - Copiez la clé API générée
5. (Optionnel) Restreignez la clé API :
   - Cliquez sur la clé API créée
   - Sous "API restrictions", sélectionnez "Restrict key"
   - Choisissez "Cloud Vision API"
6. Copiez la clé API dans votre fichier `.env`

### Démarrage

```bash
npm run dev
```

## Structure du Projet

```
app/
├── (tabs)/                 # Navigation par onglets
│   ├── index.tsx          # Écran d'accueil
│   ├── camera.tsx         # Écran de capture photo
│   ├── recipes.tsx        # Écran des recettes
│   └── profile.tsx        # Écran de profil
├── vision+api.ts          # API route pour Google Vision
├── recipes+api.ts         # API route pour les recettes
└── _layout.tsx            # Layout racine

components/                 # Composants réutilisables
contexts/                  # Contextes React (langue, etc.)
hooks/                     # Hooks personnalisés
types/                     # Définitions TypeScript
```

## Fonctionnement de la Détection

1. **Capture d'image** : L'utilisateur prend une photo avec la caméra
2. **Traitement** : L'image est convertie en base64 et envoyée à l'API Google Vision
3. **Analyse** : Google Vision détecte et identifie les objets/aliments dans l'image
4. **Filtrage** : Les résultats sont filtrés pour ne garder que les aliments
5. **Traduction** : Les termes anglais sont traduits en français
6. **Suggestions** : Des recettes sont proposées basées sur les ingrédients détectés

## API Routes

### `/vision` (POST)
Analyse une image avec Google Vision API pour détecter les aliments.

**Paramètres :**
- `image` : Image encodée en base64
- `apiKey` : Clé API Google Vision

**Réponse :**
```json
{
  "success": true,
  "detectedItems": ["tomate", "laitue", "fromage"],
  "totalDetections": 3,
  "rawData": { ... }
}
```

### `/recipes` (GET)
Récupère des recettes basées sur les ingrédients fournis.

**Paramètres :**
- `ingredients` : Liste d'ingrédients séparés par des virgules

## Résolution des Problèmes

### Erreur 500 lors de l'analyse d'image

1. **Vérifiez votre clé API** :
   - Assurez-vous que la clé API est correctement configurée dans `.env`
   - Vérifiez que l'API Vision AI est activée dans Google Cloud Console

2. **Vérifiez les permissions** :
   - La clé API doit avoir accès à l'API Vision AI
   - Vérifiez les restrictions de la clé API

3. **Vérifiez les quotas** :
   - Consultez la console Google Cloud pour voir si vous avez atteint les limites de quota

4. **Logs de débogage** :
   - Ouvrez la console du navigateur pour voir les logs détaillés
   - Les erreurs spécifiques sont affichées dans la console

### Erreur "Aucun aliment détecté"

1. **Qualité de l'image** :
   - Assurez-vous que l'éclairage est suffisant
   - Les aliments doivent être clairement visibles
   - Évitez les images floues

2. **Seuil de confiance** :
   - Le seuil est fixé à 0.3 (30% de confiance)
   - Vous pouvez l'ajuster dans `vision+api.ts`

## Développement

### Scripts Disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build:web` : Build pour le web
- `npm run lint` : Vérification du code

### Ajout de Nouvelles Fonctionnalités

1. **Nouveaux écrans** : Ajoutez des fichiers dans le dossier `app/`
2. **Composants** : Créez des composants réutilisables dans `components/`
3. **API Routes** : Ajoutez des routes API avec le suffixe `+api.ts`

### Débogage

Pour activer les logs détaillés, ouvrez la console du navigateur. L'application affiche :
- Les étapes de traitement de l'image
- Les réponses de l'API Google Vision
- Les aliments détectés et leur score de confiance
- Les erreurs détaillées

## Déploiement

### Web
```bash
npm run build:web
```

### Mobile
Utilisez Expo Application Services (EAS) pour le déploiement mobile :
```bash
eas build --platform all
```

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

### Problèmes Courants

- **Erreur 403** : Vérifiez que l'API Vision AI est activée et que votre clé API a les bonnes permissions
- **Erreur 429** : Quota d'API dépassé, attendez ou augmentez votre quota
- **Erreur 400** : Clé API invalide ou requête malformée
- **Pas de détection** : Améliorez l'éclairage et la qualité de l'image