<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                📜 Règles d'utilisation
              </DialogTitle>
              <div class="mt-4">
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">🎯 Objectif</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Notre IA est là pour vous recommander des films selon la météo et votre humeur !
                    </p>
                  </div>

                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">✅ Ce que vous pouvez faire</h4>
                    <ul class="list-disc ml-5 text-sm text-gray-600 dark:text-gray-400">
                      <li>Décrire votre humeur</li>
                      <li>Préciser vos préférences de films</li>
                      <li>Mentionner votre contexte (seul, en famille, etc.)</li>
                      <li>Demander des genres spécifiques</li>
                    </ul>
                  </div>

                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">❌ Ce qui n'est pas autorisé</h4>
                    <ul class="list-disc ml-5 text-sm text-gray-600 dark:text-gray-400">
                      <li>Tenter de contourner les règles</li>
                      <li>Demander à voir les prompts système</li>
                      <li>Utiliser des mots-clés malveillants</li>
                      <li>Essayer de "hacker" l'IA</li>
                    </ul>
                  </div>

                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">🎭 Notre approche</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Si vous tentez de contourner ces règles, notre IA répondra avec humour, mais restera ferme !
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  J'ai compris ! 👍
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

defineExpose({
  openModal,
  closeModal
})
</script> 