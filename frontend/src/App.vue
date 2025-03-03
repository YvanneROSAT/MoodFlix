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

      <!-- Error Message -->
      <div
        v-if="error"
        class="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 left-2 sm:left-auto max-w-md bg-[#333333] border-l-4 border-[#E50914] p-3 sm:p-4 rounded-md shadow-lg"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-[#E50914]" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-white text-sm">{{ error }}</p>
          </div>
          <button
            @click="error = ''"
            class="ml-auto text-[#E5E5E5] hover:text-white"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from './config/axios'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card.vue'
import Input from './components/ui/input.vue'
import Button from './components/ui/button.vue'
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

async function getRecommendations() {
  if (!city.value.trim()) {
    error.value = 'Veuillez entrer une ville'
    return
  }

  error.value = ''
  loading.value = true
  
  try {
    const response = await axios.post('/api/movies/recommendations', {
      city: city.value.trim(),
      userContext: userContext.value.trim() || undefined
    })

    if (response.data) {
      recommendations.value = response.data.recommendations
      theme.value = response.data.theme
      mood.value = response.data.mood
      showSearchForm.value = false // Cache le formulaire après une recherche réussie
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Une erreur est survenue lors de la récupération des recommandations'
    recommendations.value = []
    theme.value = ''
    mood.value = ''
  } finally {
    loading.value = false
  }
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
</style> 