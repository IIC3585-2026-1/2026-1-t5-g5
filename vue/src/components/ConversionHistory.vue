<script setup>
// Componente visual que muestra las ultimas conversiones guardadas.
defineProps({
  history: {
    type: Array,
    required: true
  }
})

defineEmits(['clear'])

function formatAmount(value, currency) {
  return `${Number(value).toLocaleString('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`
}
</script>

<template>
  <section class="history-panel" aria-label="Historial de conversiones">
    <div class="section-heading">
      <h2>Historial reciente</h2>

      <button
        v-if="history.length > 0"
        class="text-button"
        type="button"
        @click="$emit('clear')"
      >
        Limpiar
      </button>
    </div>

    <p v-if="history.length === 0" class="status">Sin conversiones recientes.</p>

    <ul v-else class="history-list">
      <li v-for="item in history" :key="item.id" class="history-item">
        <span>{{ formatAmount(item.amount, item.from) }} → {{ formatAmount(item.convertedAmount, item.to) }}</span>
        <small>{{ item.createdAt }}</small>
      </li>
    </ul>
  </section>
</template>
