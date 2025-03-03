<template>
  <button
    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    :class="[
      loading ? 'opacity-70 cursor-wait' : '',
      className
    ]"
    :disabled="loading || disabled"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  disabled?: boolean
  className?: string
}>()
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Button',
  inheritAttrs: false
})
</script> 