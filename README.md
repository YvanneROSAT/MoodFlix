# 🎬 MoodFlix - Recommandations de Films basées sur la Météo

MoodFlix est une application web innovante qui recommande des films personnalisés en fonction des conditions météorologiques de votre ville et de votre humeur actuelle. Utilisant l'intelligence artificielle et des données météorologiques en temps réel, MoodFlix crée une expérience de recommandation unique et contextuelle.

## ✨ Fonctionnalités

- 🌤️ **Recommandations Météo-sensibles** : Films adaptés aux conditions météo actuelles
- 🎭 **Personnalisation par Humeur** : Prise en compte de votre état d'esprit
- 🤖 **IA Avancée** : Utilisation de GPT pour des recommandations pertinentes
- 🎯 **10 Films Ciblés** : Sélection précise de films correspondant à votre contexte
- 🌈 **Interface Netflix-like** : Design moderne et intuitif
- 📱 **Responsive Design** : Parfaitement adapté à tous les appareils

## 🛠️ Technologies Utilisées

### Backend
- Node.js & Express.js
- TypeScript
- OpenAI API (GPT-3.5)
- OpenWeatherMap API
- TMDB (The Movie Database) API

### Frontend
- Vue.js 3
- TailwindCSS
- Vite
- TypeScript

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Clés API requises :
  - OpenAI API
  - OpenWeatherMap API
  - TMDB API

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone url_git
cd moodflix
```

2. **Installation des dépendances**
```bash
# Installation des dépendances du backend
npm install

# Installation des dépendances du frontend
cd frontend
npm install
```

3. **Configuration des variables d'environnement**
```bash
# À la racine du projet
cp .env.example .env
```

Remplissez le fichier `.env` avec vos clés API :
```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=votre_clé_openai
OPENWEATHER_API_KEY=votre_clé_openweather
TMDB_API_KEY=votre_clé_tmdb
FRONTEND_URL=http://localhost:5173
```

4. **Lancer l'application**
```bash
# Dans un premier terminal (backend)
npm run dev

# Dans un second terminal (frontend)
cd frontend
npm run dev
```

L'application sera accessible à : `http://localhost:5173`

## 📁 Structure du Projet

```
moodflix/
├── src/                  # Backend source
│   ├── config/          # Configuration
│   ├── controllers/     # Contrôleurs
│   ├── middleware/      # Middleware
│   ├── routes/         # Routes API
│   ├── services/       # Services
│   └── index.ts        # Point d'entrée
├── frontend/            # Frontend source
│   ├── src/
│   │   ├── components/ # Composants Vue
│   │   ├── styles/     # Styles CSS
│   │   └── App.vue     # Composant racine
│   └── index.html
├── .env.example         # Example de variables d'environnement
└── package.json
```

## 🔄 Workflow de l'Application

1. L'utilisateur entre sa ville et son humeur
2. L'application récupère les données météo actuelles
3. L'IA analyse le contexte (météo + humeur)
4. Génération de 5 recommandations personnalisées
5. Enrichissement avec les détails des films (posters, notes, etc.)
6. Affichage dans une interface style Netflix

## 🎯 Points Forts

- **Personnalisation** : Recommandations uniques basées sur le contexte
- **UX/UI** : Interface intuitive inspirée de Netflix
- **Performance** : Chargement rapide et animations fluides
- **Responsive** : Expérience optimale sur tous les appareils

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- [Yvanne ROSAT](https://github.com/YvanneROSAT/)

## 🙏 Remerciements

- OpenAI pour l'API GPT
- OpenWeatherMap pour les données météo
- TMDB pour la base de données de films
- La communauté open-source 