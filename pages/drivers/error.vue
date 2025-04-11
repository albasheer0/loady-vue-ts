<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
      <p class="text-xl text-gray-600 mb-6">Something went wrong while loading drivers</p>
      <button 
        @click="handleError"
        class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const handleError = () => {
  clearError({ redirect: '/drivers' })
}
</script> 