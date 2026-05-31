<script>
  // Lista presentacional de favoritos. El estado real vive en CurrencyConverter.
  export let favorites = []
  export let disabled = false
  export let onSelect = () => {}
  export let onRemove = () => {}
</script>

<section class="favorites-panel" aria-label="Pares favoritos">
  <h2>Pares favoritos</h2>

  {#if favorites.length === 0}
    <p class="status">Sin favoritos guardados.</p>
  {:else}
    <div class="favorite-list">
      {#each favorites as favorite (`${favorite.from}-${favorite.to}`)}
        <div class="favorite-item">
          <button
            class="favorite-pair"
            type="button"
            {disabled}
            onclick={() => onSelect(favorite)}
          >
            {favorite.from} → {favorite.to}
          </button>

          <button
            class="remove-favorite"
            type="button"
            aria-label={`Eliminar favorito ${favorite.from} a ${favorite.to}`}
            onclick={() => onRemove(favorite)}
          >
            ×
          </button>
        </div>
      {/each}
    </div>
  {/if}
</section>
