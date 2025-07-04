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
3. Activez l'API Vision AI
4. Créez des identifiants (clé API)
5. Copiez la clé API dans votre fichier `.env`

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
  "rawData": { ... }
}
```

### `/recipes` (GET)
Récupère des recettes basées sur les ingrédients fournis.

**Paramètres :**
- `ingredients` : Liste d'ingrédients séparés par des virgules

## Développement

### Scripts Disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build:web` : Build pour le web
- `npm run lint` : Vérification du code

### Ajout de Nouvelles Fonctionnalités

1. **Nouveaux écrans** : Ajoutez des fichiers dans le dossier `app/`
2. **Composants** : Créez des composants réutilisables dans `components/`
3. **API Routes** : Ajoutez des routes API avec le suffixe `+api.ts`

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