<script setup>
// Componente solo de apartado visual, recibe un resultado ya calculado y solo lo muestra.
defineProps({
  result: {
    type: Object,
    required: true
  }
})

// Formatea el numero para que el resultado sea legible.
function formatAmount(value, currency) {
  return `${Number(value).toLocaleString('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`
}
</script>

<template>
  <section class="result-box" aria-live="polite">
    <span>Resultado</span>
    <strong>{{ formatAmount(result.convertedAmount, result.to) }}</strong>
    <small>
      {{ formatAmount(result.amount, result.from) }} = {{ formatAmount(result.convertedAmount, result.to) }}
    </small>
  </section>
</template>
