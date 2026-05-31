<script setup>
// Lista visual de favoritos. El estado real vive en CurrencyConverter.
defineProps({
  favorites: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'remove'])
</script>

<template>
  <section class="favorites-panel" aria-label="Pares favoritos">
    <h2>Pares favoritos</h2>

    <p v-if="favorites.length === 0" class="status">Sin favoritos guardados.</p>

    <div v-else class="favorite-list">
      <div
        v-for="favorite in favorites"
        :key="`${favorite.from}-${favorite.to}`"
        class="favorite-item"
      >
        <button
          class="favorite-pair"
          type="button"
          :disabled="disabled"
          @click="$emit('select', favorite)"
        >
          {{ favorite.from }} → {{ favorite.to }}
        </button>

        <button
          class="remove-favorite"
          type="button"
          :aria-label="`Eliminar favorito ${favorite.from} a ${favorite.to}`"
          @click="$emit('remove', favorite)"
        >
          ×
        </button>
      </div>
    </div>
  </section>
</template>
