<script>
  import { onMount } from 'svelte'
  import { convertCurrency, getCurrencies } from '../services/currencyService'

  let amount = 100
  let fromCurrency = 'EUR'
  let toCurrency = 'USD'
  let currencies = []
  let result = null
  let error = ''
  let loadingCurrencies = false
  let converting = false

  // Este es un valor reactivo, ya que se recalcula cuando cambia el monto, las monedas o el estado de carga.
  $: canConvert = amount !== '' && fromCurrency && toCurrency && !converting

  // Al montar el componente cargamos monedas y dejamos una conversion inicial lista.
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
    // Intercambia solo las monedas; el monto ingresado se mantiene igual.
    const currentFromCurrency = fromCurrency
    fromCurrency = toCurrency
    toCurrency = currentFromCurrency

    await handleConvert()
  }

  // Formatea el numero para que el resultado sea legible para el usuario.
  function formatAmount(value, currency) {
    return `${Number(value).toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${currency}`
  }

  // Normaliza errores desconocidos a un mensaje mostrable en pantalla.
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
    <label class="field">
      <span>Moneda origen</span>
      <select bind:value={fromCurrency} disabled={loadingCurrencies} onchange={handleConvert}>
        {#each currencies as currency}
          <option value={currency.code}>{currency.code} - {currency.name}</option>
        {/each}
      </select>
    </label>

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

    <label class="field">
      <span>Moneda destino</span>
      <select bind:value={toCurrency} disabled={loadingCurrencies} onchange={handleConvert}>
        {#each currencies as currency}
          <option value={currency.code}>{currency.code} - {currency.name}</option>
        {/each}
      </select>
    </label>
  </div>

  <button class="primary-button" type="submit" disabled={!canConvert || loadingCurrencies}>
    {converting ? 'Convirtiendo...' : 'Convertir'}
  </button>

  {#if loadingCurrencies}
    <p class="status">Cargando monedas disponibles...</p>
  {:else if error}
    <p class="status status-error">{error}</p>
  {/if}

  {#if result}
    <section class="result-box" aria-live="polite">
      <span>Resultado</span>
      <strong>{formatAmount(result.convertedAmount, result.to)}</strong>
      <small>
        {formatAmount(result.amount, result.from)} = {formatAmount(result.convertedAmount, result.to)}
      </small>
    </section>
  {/if}
</form>
