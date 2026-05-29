<script setup>
import { computed, onMounted, ref } from 'vue'
import { convertCurrency, getCurrencies } from '../services/currencyService'

const amount = ref(100)
const fromCurrency = ref('EUR')
const toCurrency = ref('USD')
const currencies = ref([])
const result = ref(null)
const error = ref('')
const loadingCurrencies = ref(false)
const converting = ref(false)

// la función computed evita habilitar conversiones cuando faltan datos o ya hay una en curso.
const canConvert = computed(() => {
  return amount.value !== '' && fromCurrency.value && toCurrency.value && !converting.value
})

// Al montar el componente cargamos monedas y dejamos una conversion inicial lista.
onMounted(loadCurrencies)

async function loadCurrencies() {
  // Estado de carga separado para desactivar campos mientras se consulta la API.
  loadingCurrencies.value = true
  error.value = ''

  try {
    currencies.value = await getCurrencies()
    await handleConvert()
  } catch (currentError) {
    error.value = getErrorMessage(currentError)
  } finally {
    loadingCurrencies.value = false
  }
}

async function handleConvert() {
  // La misma funcion sirve para el boton y para cambios en monto/selects.
  if (!canConvert.value) return

  converting.value = true
  error.value = ''

  try {
    result.value = await convertCurrency({
      amount: amount.value,
      from: fromCurrency.value,
      to: toCurrency.value
    })
  } catch (currentError) {
    result.value = null
    error.value = getErrorMessage(currentError)
  } finally {
    converting.value = false
  }
}

async function swapCurrencies() {
  // Intercambia solo las monedas; el monto ingresado se mantiene igual.
  const currentFromCurrency = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = currentFromCurrency

  await handleConvert()
}

// Formatea el numero para que el resultado sea legible.
function formatAmount(value, currency) {
  return `${Number(value).toLocaleString('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`
}

// Normaliza errores desconocidos a un mensaje en pantalla.
function getErrorMessage(currentError) {
  return currentError instanceof Error ? currentError.message : 'Ocurrio un error inesperado.'
}
</script>

<template>
  <form class="converter" @submit.prevent="handleConvert">
    <label class="field">
      <span>Monto</span>
      <input
        v-model="amount"
        type="number"
        min="0"
        step="0.01"
        inputmode="decimal"
        :disabled="loadingCurrencies"
        @change="handleConvert"
      />
    </label>

    <div class="currency-grid">
      <label class="field">
        <span>Moneda origen</span>
        <select v-model="fromCurrency" :disabled="loadingCurrencies" @change="handleConvert">
          <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
            {{ currency.code }} - {{ currency.name }}
          </option>
        </select>
      </label>

      <button
        class="swap-button"
        type="button"
        :disabled="loadingCurrencies || converting"
        aria-label="Intercambiar monedas"
        title="Intercambiar monedas"
        @click="swapCurrencies"
      >
        ⇄
      </button>

      <label class="field">
        <span>Moneda destino</span>
        <select v-model="toCurrency" :disabled="loadingCurrencies" @change="handleConvert">
          <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
            {{ currency.code }} - {{ currency.name }}
          </option>
        </select>
      </label>
    </div>

    <button class="primary-button" type="submit" :disabled="!canConvert || loadingCurrencies">
      {{ converting ? 'Convirtiendo...' : 'Convertir' }}
    </button>

    <p v-if="loadingCurrencies" class="status">Cargando monedas disponibles...</p>
    <p v-else-if="error" class="status status-error">{{ error }}</p>

    <section v-if="result" class="result-box" aria-live="polite">
      <span>Resultado</span>
      <strong>{{ formatAmount(result.convertedAmount, result.to) }}</strong>
      <small>
        {{ formatAmount(result.amount, result.from) }} = {{ formatAmount(result.convertedAmount, result.to) }}
      </small>
    </section>
  </form>
</template>
