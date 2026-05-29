<script>
  // App solo arma la pantalla principal e inserta el conversor.
  import CurrencyConverter from './components/CurrencyConverter.svelte'
</script>

<main class="app-shell">
  <section class="app-header">
    <p class="eyebrow">Version Svelte</p>
    <h1>MoneyExchange</h1>
    <p>Convierte montos entre monedas usando tasas actuales de Frankfurter API.</p>
  </section>

  <CurrencyConverter />
</main>
