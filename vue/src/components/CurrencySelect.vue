<script setup>
// Selector para elegir moneda origen o destino.
defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  currencies: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleChange(event) {
  emit('update:modelValue', event.target.value)
  
  // change avisa al padre que debe recalcular la conversion.
  emit('change')
}
</script>

<template>
  <label class="field">
    <span>{{ label }}</span>
    <select :value="modelValue" :disabled="disabled" @change="handleChange">
      <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
        {{ currency.code }} - {{ currency.name }}
      </option>
    </select>
  </label>
</template>
