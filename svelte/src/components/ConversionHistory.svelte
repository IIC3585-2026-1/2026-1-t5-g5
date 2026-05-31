<script>
  // Componente para presentar las ultimas conversiones guardadas.
  export let history = []
  export let onClear = () => {}

  function formatAmount(value, currency) {
    return `${Number(value).toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${currency}`
  }
</script>

<section class="history-panel" aria-label="Historial de conversiones">
  <div class="section-heading">
    <h2>Historial reciente</h2>

    {#if history.length > 0}
      <button class="text-button" type="button" onclick={onClear}>
        Limpiar
      </button>
    {/if}
  </div>

  {#if history.length === 0}
    <p class="status">Sin conversiones recientes.</p>
  {:else}
    <ul class="history-list">
      {#each history as item (item.id)}
        <li class="history-item">
          <span>{formatAmount(item.amount, item.from)} → {formatAmount(item.convertedAmount, item.to)}</span>
          <small>{item.createdAt}</small>
        </li>
      {/each}
    </ul>
  {/if}
</section>
