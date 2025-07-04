import React, { createContext, useContext } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  // Navigation
  'nav.home': 'Accueil',
  'nav.scan': 'Scanner',
  'nav.recipes': 'Recettes',
  'nav.profile': 'Profil',
  
  // Home Screen
  'home.greeting': 'Salut, Étudiant ! 👋',
  'home.subtitle': 'Que cuisines-tu aujourd\'hui ?',
  'home.quickActions': 'Actions Rapides',
  'home.scanFridge': 'Scanner le Frigo',
  'home.scanFridge.desc': 'Détecter les aliments',
  'home.quickRecipes': 'Recettes Rapides',
  'home.quickRecipes.desc': 'Repas de 5 minutes',
  'home.chefsChoice': 'Choix du Chef',
  'home.chefsChoice.desc': 'Recettes populaires',
  'home.trending': 'Tendances',
  'home.trending.desc': 'Ce qui est populaire',
  'home.recentRecipes': 'Recettes Récentes',
  'home.studentTips': 'Conseils Étudiants',
  'home.proTip': '💡 Conseil Pro',
  'home.tipText': 'Prends une photo du contenu de ton frigo pour obtenir des suggestions de recettes personnalisées basées sur ce que tu as !',
  
  // Camera Screen
  'camera.title': 'Scanner Votre Frigo',
  'camera.permission.title': 'Accès Caméra Requis',
  'camera.permission.text': 'MIAMZ a besoin d\'accéder à la caméra pour détecter les aliments dans votre frigo et suggérer des recettes.',
  'camera.permission.grant': 'Autoriser l\'Accès',
  'camera.guide': 'Positionnez le contenu de votre frigo dans le cadre',
  'camera.scanFood': 'Scanner Aliments',
  'camera.analyzing': 'Analyse...',
  'camera.tip': '💡 Conseil : Un bon éclairage aide à mieux détecter les aliments',
  'camera.detected.title': 'Aliments Détectés ! 🍅',
  'camera.detected.found': 'Trouvé',
  'camera.detected.question': 'Voulez-vous voir les suggestions de recettes ?',
  'camera.detected.later': 'Plus tard',
  'camera.detected.showRecipes': 'Voir les Recettes',
  'camera.noFood.title': 'Aucun aliment détecté',
  'camera.noFood.message': 'Nous n\'avons pas pu détecter d\'aliments dans cette image. Assurez-vous que les aliments sont bien visibles et éclairés.',
  'camera.retake': 'Reprendre',
  'camera.error': 'Échec de l\'analyse de l\'image. Veuillez réessayer.',
  
  // Recipes Screen
  'recipes.title': 'Collection de Recettes',
  'recipes.subtitle': 'Des repas délicieux rendus simples',
  'recipes.search': 'Rechercher recettes ou ingrédients...',
  'recipes.categories.all': 'Tout',
  'recipes.categories.quick': 'Rapide',
  'recipes.categories.breakfast': 'Petit-déj',
  'recipes.categories.lunch': 'Déjeuner',
  'recipes.categories.dinner': 'Dîner',
  'recipes.categories.snacks': 'Collations',
  'recipes.categories.vegetarian': 'Végétarien',
  'recipes.noResults': 'Aucune recette trouvée',
  'recipes.noResults.subtitle': 'Essayez d\'ajuster votre recherche ou filtre de catégorie',
  'recipes.servings': 'portions',
  'recipes.nutrition': 'Nutrition (par portion)',
  'recipes.nutrition.calories': 'Calories',
  'recipes.nutrition.protein': 'Protéines',
  'recipes.nutrition.carbs': 'Glucides',
  'recipes.nutrition.fat': 'Lipides',
  'recipes.ingredients': 'Ingrédients',
  'recipes.instructions': 'Instructions',
  'recipes.difficulty.easy': 'Facile',
  'recipes.difficulty.medium': 'Moyen',
  'recipes.difficulty.hard': 'Difficile',
  
  // Profile Screen
  'profile.name': 'Chef Étudiant',
  'profile.email': 'etudiant@universite.fr',
  'profile.stats.tried': 'Recettes Essayées',
  'profile.stats.favorites': 'Favoris',
  'profile.stats.scanned': 'Ingrédients Scannés',
  'profile.settings': 'Paramètres',
  'profile.account': 'Compte',
  'profile.notifications': 'Notifications',
  'profile.notifications.desc': 'Alertes et rappels de recettes',
  'profile.savedRecipes': 'Recettes Sauvées',
  'profile.savedRecipes.desc': '12 recettes sauvées',
  'profile.shoppingList': 'Liste de Courses',
  'profile.shoppingList.desc': 'Gérer vos ingrédients',
  'profile.dietary': 'Préférences Alimentaires',
  'profile.dietary.desc': 'Végétarien, Sans gluten',
  'profile.help': 'Aide & Support',
  'profile.help.desc': 'FAQ, Nous contacter',
  'profile.signOut': 'Se Déconnecter',
  'profile.studentTips': 'Conseils Étudiants',
  'profile.studyTip': '🎓 Cuisine Pause Étude',
  'profile.studyTip.text': 'Prends des pauses cuisine entre tes sessions d\'étude ! C\'est un excellent moyen de se détendre et de nourrir ton corps et ton esprit.',
  'profile.version': 'MIAMZ v1.0.0',
  'profile.language': 'Langue',
  'profile.language.desc': 'Français',
  
  // Common
  'common.loading': 'Chargement...',
  'common.error': 'Erreur',
  'common.close': 'Fermer',
  'common.cancel': 'Annuler',
  'common.save': 'Sauvegarder',
  'common.min': 'min',
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}