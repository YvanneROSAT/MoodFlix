<template>
  <div class="min-h-screen bg-[#141414]">
    <!-- Header -->
    <header class="py-3 sm:py-4 px-2 sm:px-4 bg-gradient-to-b from-black/80 to-transparent fixed w-full z-50">
      <div class="container mx-auto px-2 sm:px-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#E50914]">MoodFlix</h1>
          <button 
            v-if="recommendations.length > 0"
            @click="showSearchForm = !showSearchForm" 
            class="text-white bg-[#E50914] px-4 py-2 rounded-md text-sm hover:bg-[#F40612] transition-colors"
          >
            {{ showSearchForm ? 'Masquer la recherche' : 'Nouvelle recherche' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="min-h-screen pt-16">
      <!-- Search Form Section -->
      <div 
        v-show="showSearchForm || recommendations.length === 0"
        class="relative py-8 sm:py-12 bg-gradient-to-b from-black/60 via-black/40 to-[#141414] transition-all duration-300"
        :class="{'min-h-[85vh]': !recommendations.length}"
      >
        <div class="container mx-auto px-2 sm:px-4">
          <div class="max-w-2xl mx-auto">
            <div class="text-center mb-6 sm:mb-8" v-if="!recommendations.length">
              <h2 class="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Trouvez des films adaptés</h2>
              <p class="text-[#E5E5E5] text-base sm:text-lg px-2">Entrez votre ville et votre humeur pour obtenir des recommandations personnalisées</p>
            </div>
            
            <div class="bg-black/80 p-4 sm:p-8 rounded-lg backdrop-blur-sm mx-2 sm:mx-0">
              <form @submit.prevent="getRecommendations" class="space-y-6">
                <div>
                  <label for="city" class="block text-[#E5E5E5] text-sm font-medium mb-2">Ville</label>
                  <Input
                    id="city"
                    v-model="city"
                    placeholder="Fontainebleau"
                    required
                    class="w-full bg-[#333333] text-white border-none h-12 rounded-md px-4 focus:ring-2 focus:ring-[#E50914] transition-all"
                    :class="{ 'ring-2 ring-[#E50914]': error }"
                  />
                </div>
                
                <div>
                  <label for="context" class="block text-[#E5E5E5] text-sm font-medium mb-2">Comment vous sentez-vous ?</label>
                  <textarea
                    id="context"
                    v-model="userContext"
                    class="w-full bg-[#333333] text-white border-none rounded-md p-4 min-h-[120px] focus:ring-2 focus:ring-[#E50914] transition-all"
                    placeholder="Ex: Je suis fatigué(e) et j'ai besoin de rire..."
                  ></textarea>
                </div>
                
                <button
                  @click="showRules"
                  class="ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  📜 Règles
                </button>
                
                <Button
                  type="submit"
                  :loading="loading"
                  class="w-full bg-[#E50914] hover:bg-[#F40612] text-white py-4 text-lg font-medium rounded-md transition-colors"
                >
                  <div v-if="loading" class="flex items-center justify-center">
                    <div class="loading-spinner mr-2 w-5 h-5"></div>
                    <span>Recherche en cours...</span>
                  </div>
                  <span v-else>{{ recommendations.length ? 'Nouvelle recherche' : 'Obtenir des recommandations' }}</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div 
        v-if="recommendations.length > 0" 
        class="container mx-auto px-2 sm:px-4 py-8 sm:py-12 transition-all duration-300"
        :class="{'opacity-50': showSearchForm}"
      >
        <!-- Theme and Mood -->
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ theme }}</h2>
          <p class="text-[#E5E5E5] text-base sm:text-lg">{{ mood }}</p>
        </div>

        <!-- Movies Row -->
        <div class="netflix-row">
          <h3 class="netflix-row-title text-[#E5E5E5] text-xl sm:text-2xl font-medium mb-3 sm:mb-4">Films recommandés pour vous</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            <div
              v-for="movie in recommendations"
              :key="movie.details?.id"
              class="netflix-card w-full"
            >
              <div class="relative aspect-[2/3] rounded-md overflow-hidden">
                <img
                  :src="movie.details?.posterUrl"
                  :alt="movie.title"
                  class="w-full h-full object-cover"
                />
                <div class="card-content absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h4 class="font-bold text-white text-lg">{{ movie.title }}</h4>
                  <p class="text-[#E5E5E5] text-sm">{{ movie.year }}</p>
                  <div class="mt-2">
                    <p class="text-[#E5E5E5] text-sm">{{ movie.reason }}</p>
                    <div class="mt-2 flex items-center">
                      <span class="text-[#46D369] text-sm font-medium">Note: {{ movie.details?.rating }}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message Modal - Déplacé en dehors des sections principales -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div v-if="error" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
        <div class="mx-4 bg-black/90 border-l-4 border-[#E50914] p-4 rounded-md shadow-lg backdrop-blur-sm">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-[#E5E5E5] text-sm font-medium">{{ error }}</p>
              <p v-if="theme" class="mt-1 text-sm text-[#E5E5E5]/80">{{ theme }}</p>
              <p v-if="mood" class="text-sm text-[#E5E5E5]/60">{{ mood }}</p>
            </div>
            <button @click="error = ''" class="ml-4 text-[#E5E5E5]/60 hover:text-[#E5E5E5]">
              <span class="sr-only">Fermer</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <RulesModal ref="rulesModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from './config/axios'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card.vue'
import Input from './components/ui/input.vue'
import Button from './components/ui/button.vue'
import RulesModal from './components/RulesModal.vue'
import './styles/global.css'

interface MovieRecommendation {
  title: string
  year: string
  reason: string
  details?: {
    id: number
    title: string
    overview: string
    posterUrl: string
    releaseYear: string
    rating: number
  }
}

const city = ref('')
const userContext = ref('')
const loading = ref(false)
const error = ref('')
const recommendations = ref<MovieRecommendation[]>([])
const theme = ref('')
const mood = ref('')
const showSearchForm = ref(true)
const rulesModal = ref()

async function getRecommendations() {
  if (!city.value.trim()) {
    error.value = 'Veuillez entrer une ville'
    return
  }

  error.value = ''
  loading.value = true
  
  try {
    console.log('Envoi de la requête...')
    const response = await axios.post('/api/movies/recommendations', {
      city: city.value.trim(),
      userContext: userContext.value.trim() || undefined
    })
    console.log('Réponse reçue:', response.data)

    // Détection d'une réponse de sécurité (recommendations vide avec theme et mood spécifiques)
    if (response.data.recommendations?.length === 0 && 
        response.data.theme === 'Sécurité avant tout' && 
        response.data.mood === 'Taquin mais ferme') {
      console.log('Message de sécurité détecté')
      error.value = "Hop hop hop ! On ne regarde pas sous le capot ! 🚗 Mais j'apprécie ta curiosité ! 😉"
      theme.value = response.data.theme
      mood.value = response.data.mood
      recommendations.value = []
      showSearchForm.value = true
      return
    }

    // Si la réponse contient des recommandations valides
    if (Array.isArray(response.data.recommendations)) {
      console.log('Recommandations reçues')
      if (response.data.recommendations.length > 0) {
        error.value = ''
        recommendations.value = response.data.recommendations
        theme.value = response.data.theme
        mood.value = response.data.mood
        showSearchForm.value = false
      } else {
        error.value = "Désolé, nous n'avons pas trouvé de recommandations pour le moment."
        recommendations.value = []
      }
    } else {
      console.log('Format de réponse invalide')
      throw new Error('Format de réponse invalide')
    }
  } catch (err: any) {
    console.error('Erreur:', err)
    error.value = err.response?.data?.message || err.message || 'Une erreur est survenue'
    recommendations.value = []
    theme.value = ''
    mood.value = ''
  } finally {
    loading.value = false
  }
}

// Ajout d'un watcher pour déboguer l'état de error
watch(error, (newValue) => {
  console.log('Valeur de error changée:', newValue)
})

const showRules = () => {
  rulesModal.value?.openModal()
}
</script>

<style>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Ajout d'animations Netflix */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.netflix-card {
  animation: fadeIn 0.5s ease-in-out;
}

.netflix-card:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease-in-out;
}

.card-content {
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.netflix-card:hover .card-content {
  opacity: 1;
  visibility: visible;
}

/* Transition pour le formulaire et les résultats */
.fade-height-enter-active,
.fade-height-leave-active {
  transition: all 0.3s ease-out;
}

.fade-height-enter-from,
.fade-height-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Styles spécifiques pour mobile */
@media (max-width: 768px) {
  .netflix-row .grid {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .netflix-card {
    flex: 0 0 140px;
  }
}

/* Ajustements pour desktop */
@media (min-width: 769px) {
  .netflix-card:hover {
    transform: scale(1.05);
    z-index: 10;
  }

  .card-content {
    opacity: 0;
    visibility: hidden;
  }

  .netflix-card:hover .card-content {
    opacity: 1;
    visibility: visible;
  }
}

/* Animation pour le message d'erreur */
.fixed {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style> 