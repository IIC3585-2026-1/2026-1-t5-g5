<script setup>
import { computed, onMounted, ref } from 'vue'
import ConversionHistory from './ConversionHistory.vue'
import ConversionResult from './ConversionResult.vue'
import CurrencySelect from './CurrencySelect.vue'
import FavoritePairs from './FavoritePairs.vue'
import { convertCurrency, getCurrencies } from '../services/currencyService'

const amount = ref(100)
const fromCurrency = ref('EUR')
const toCurrency = ref('USD')
const currencies = ref([])
const result = ref(null)
const error = ref('')
const loadingCurrencies = ref(false)
const converting = ref(false)
// Favoritos locales: se pierden al recargar, suficiente para esta feature simple.
const favorites = ref([])
// Historial local de conversiones recientes, pensado para comparar reactividad Vue/Svelte.
const history = ref([])

// Evita habilitar conversiones cuando faltan datos o ya hay una en curso.
const canConvert = computed(() => {
  return amount.value !== '' && fromCurrency.value && toCurrency.value && !converting.value
})

// Detecta si el par visible ya fue guardado como favorito.
const isCurrentFavorite = computed(() => {
  return favorites.value.some((favorite) => {
    return favorite.from === fromCurrency.value && favorite.to === toCurrency.value
  })
})

// Controla cuándo se puede guardar un favorito nuevo.
const canSaveFavorite = computed(() => {
  return (
    fromCurrency.value &&
    toCurrency.value &&
    fromCurrency.value !== toCurrency.value &&
    !isCurrentFavorite.value &&
    !loadingCurrencies.value &&
    !converting.value
  )
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

async function handleConvert(options = {}) {
  // La misma funcion sirve para el boton y para cambios en monto/selects.
  if (!canConvert.value) return

  converting.value = true
  error.value = ''

  try {
    const conversion = await convertCurrency({
      amount: amount.value,
      from: fromCurrency.value,
      to: toCurrency.value
    })

    result.value = conversion

    if (options.saveHistory) {
      addHistoryEntry(conversion)
    }
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

function addFavorite() {
  // Guardamos solo el par de monedas, no el monto.
  if (!canSaveFavorite.value) return

  favorites.value.push({
    from: fromCurrency.value,
    to: toCurrency.value
  })
}

async function selectFavorite(favorite) {
  // Usar un favorito actualiza el conversor principal y conserva el monto actual.
  fromCurrency.value = favorite.from
  toCurrency.value = favorite.to

  await handleConvert()
}

function removeFavorite(favoriteToRemove) {
  // Se filtra por origen/destino porque cada par favorito es unico.
  favorites.value = favorites.value.filter((favorite) => {
    return favorite.from !== favoriteToRemove.from || favorite.to !== favoriteToRemove.to
  })
}

function addHistoryEntry(conversion) {
  const entry = {
    id: `${Date.now()}-${conversion.from}-${conversion.to}`,
    amount: conversion.amount,
    from: conversion.from,
    to: conversion.to,
    convertedAmount: conversion.convertedAmount,
    createdAt: new Date().toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  history.value.unshift(entry)
  history.value.splice(5)
}

function clearHistory() {
  history.value = []
}

// Normaliza errores desconocidos.
function getErrorMessage(currentError) {
  return currentError instanceof Error ? currentError.message : 'Ocurrio un error inesperado.'
}
</script>

<template>
  <form class="converter" @submit.prevent="handleConvert({ saveHistory: true })">
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
      <CurrencySelect
        v-model="fromCurrency"
        label="Moneda origen"
        :currencies="currencies"
        :disabled="loadingCurrencies"
        @change="handleConvert"
      />

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

      <CurrencySelect
        v-model="toCurrency"
        label="Moneda destino"
        :currencies="currencies"
        :disabled="loadingCurrencies"
        @change="handleConvert"
      />
    </div>

    <div class="actions-row">
      <button class="primary-button" type="submit" :disabled="!canConvert || loadingCurrencies">
        {{ converting ? 'Convirtiendo...' : 'Convertir' }}
      </button>

      <button class="secondary-button" type="button" :disabled="!canSaveFavorite" @click="addFavorite">
        {{ isCurrentFavorite ? 'Favorito guardado' : 'Guardar favorito' }}
      </button>
    </div>

    <p v-if="loadingCurrencies" class="status">Cargando monedas disponibles...</p>
    <p v-else-if="error" class="status status-error">{{ error }}</p>

    <ConversionResult v-if="result" :result="result" />

    <ConversionHistory :history="history" @clear="clearHistory" />

    <FavoritePairs
      :favorites="favorites"
      :disabled="loadingCurrencies || converting"
      @select="selectFavorite"
      @remove="removeFavorite"
    />
  </form>
</template>
