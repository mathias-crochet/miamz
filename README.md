# MIAMZ – Version Mockup (sans IA)

Bienvenue sur la version mockup de **MIAMZ**, une application mobile destinée à proposer des recettes de cuisine à partir des aliments présents dans le réfrigérateur.  
Cette version est **fonctionnelle et testable**, sans nécessiter de services externes payants.

---

## 🎯 Objectif

Proposer une démonstration réaliste de l’application sans avoir recours à une intelligence artificielle. Les aliments détectés sont simulés, tout comme les recettes générées.

---

## 📱 Fonctionnalités

- Interface mobile responsive (Expo / React Native)
- Simulation du scan de produits alimentaires via l'appareil photo
- Utilisation de **données mockup** (ingrédients et recettes)
- Génération simulée de recettes
- Affichage des détails d’une recette (nom, image, ingrédients, étapes, calories)
- Notation des recettes (note sur 5)
- Ajout / suppression de recettes favorites
- Liste de courses générée à partir des recettes
- Système d’inscription, connexion et gestion de compte
- Préférences alimentaires et filtres
- Statistiques d’usage (aliments scannés, recettes vues, etc.)

---

## ⚙️ Technologies

- React Native (via Expo)
- TypeScript
- Tailwind CSS (via NativeWind)
- Mock JSON pour les aliments et recettes

---

## 🛠 Lancer le projet

```bash
git clone https://github.com/mathias-crochet/MIAMZ.git
cd MIAMZ
npm install
npm run dev
