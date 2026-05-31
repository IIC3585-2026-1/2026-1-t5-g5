<script>
  import { onMount } from 'svelte'
  import ConversionResult from './ConversionResult.svelte'
  import CurrencySelect from './CurrencySelect.svelte'
  import FavoritePairs from './FavoritePairs.svelte'
  import { convertCurrency, getCurrencies } from '../services/currencyService'

  let amount = 100
  let fromCurrency = 'EUR'
  let toCurrency = 'USD'
  let currencies = []
  let result = null
  let error = ''
  let loadingCurrencies = false
  let converting = false
  // Favoritos locales, se pierden al recargar.
  let favorites = []

  // Valor reactivo que evita convertir si faltan datos o ya hay una conversion en curso.
  $: canConvert = amount !== '' && fromCurrency && toCurrency && !converting
  // Detecta si el par visible ya fue guardado como favorito.
  $: isCurrentFavorite = favorites.some((favorite) => {
    return favorite.from === fromCurrency && favorite.to === toCurrency
  })
  // Controla cuándo se puede guardar un favorito nuevo.
  $: canSaveFavorite =
    fromCurrency && toCurrency && fromCurrency !== toCurrency && !isCurrentFavorite && !loadingCurrencies && !converting

  // Al montar el componente se cargan monedas y dejamos una conversion inicial lista.
  onMount(loadCurrencies)

  async function loadCurrencies() {
    // Estado de carga separado para desactivar campos mientras se consulta la API.
    loadingCurrencies = true
    error = ''

    try {
      currencies = await getCurrencies()
      await handleConvert()
    } catch (currentError) {
      error = getErrorMessage(currentError)
    } finally {
      loadingCurrencies = false
    }
  }

  async function handleConvert(event) {
    // Evita que el submit del formulario recargue la pagina.
    event?.preventDefault()

    // La misma funcion sirve para el boton y para cambios en monto/selects.
    if (!canConvert) return

    converting = true
    error = ''

    try {
      result = await convertCurrency({
        amount,
        from: fromCurrency,
        to: toCurrency
      })
    } catch (currentError) {
      result = null
      error = getErrorMessage(currentError)
    } finally {
      converting = false
    }
  }

  async function swapCurrencies() {
    // Intercambia solo las monedas, el monto ingresado se mantiene igual.
    const currentFromCurrency = fromCurrency
    fromCurrency = toCurrency
    toCurrency = currentFromCurrency

    await handleConvert()
  }

  function addFavorite() {
    // Guardamos solo el par de monedas, no el monto.
    if (!canSaveFavorite) return

    favorites = [...favorites, { from: fromCurrency, to: toCurrency }]
  }

  async function selectFavorite(favorite) {
    // Usar un favorito actualiza el conversor principal y conserva el monto actual.
    fromCurrency = favorite.from
    toCurrency = favorite.to

    await handleConvert()
  }

  function removeFavorite(favoriteToRemove) {
    // Se filtra por origen/destino porque cada par favorito es unico.
    favorites = favorites.filter((favorite) => {
      return favorite.from !== favoriteToRemove.from || favorite.to !== favoriteToRemove.to
    })
  }

  // Normaliza errores desconocidos.
  function getErrorMessage(currentError) {
    return currentError instanceof Error ? currentError.message : 'Ocurrio un error inesperado.'
  }
</script>

<form class="converter" onsubmit={handleConvert}>
  <label class="field">
    <span>Monto</span>
    <input
      bind:value={amount}
      type="number"
      min="0"
      step="0.01"
      inputmode="decimal"
      disabled={loadingCurrencies}
      onchange={handleConvert}
    />
  </label>

  <div class="currency-grid">
    <CurrencySelect
      label="Moneda origen"
      value={fromCurrency}
      {currencies}
      disabled={loadingCurrencies}
      onChange={(value) => {
        fromCurrency = value
        handleConvert()
      }}
    />

    <button
      class="swap-button"
      type="button"
      disabled={loadingCurrencies || converting}
      aria-label="Intercambiar monedas"
      title="Intercambiar monedas"
      onclick={swapCurrencies}
    >
      ⇄
    </button>

    <CurrencySelect
      label="Moneda destino"
      value={toCurrency}
      {currencies}
      disabled={loadingCurrencies}
      onChange={(value) => {
        toCurrency = value
        handleConvert()
      }}
    />
  </div>

  <div class="actions-row">
    <button class="primary-button" type="submit" disabled={!canConvert || loadingCurrencies}>
      {converting ? 'Convirtiendo...' : 'Convertir'}
    </button>

    <button class="secondary-button" type="button" disabled={!canSaveFavorite} onclick={addFavorite}>
      {isCurrentFavorite ? 'Favorito guardado' : 'Guardar favorito'}
    </button>
  </div>

  {#if loadingCurrencies}
    <p class="status">Cargando monedas disponibles...</p>
  {:else if error}
    <p class="status status-error">{error}</p>
  {/if}

  {#if result}
    <ConversionResult {result} />
  {/if}

  <FavoritePairs
    {favorites}
    disabled={loadingCurrencies || converting}
    onSelect={selectFavorite}
    onRemove={removeFavorite}
  />
</form>
