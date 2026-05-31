<script>
  // Selector para elegir moneda origen o destino.
  export let label
  export let value
  export let currencies = []
  export let disabled = false
  export let onChange = () => {}

  function handleChange(event) {
    // El padre recibe el nuevo código y decide si recalcula.
    onChange(event.target.value)
  }
</script>

<label class="field">
  <span>{label}</span>
  <select {value} {disabled} onchange={handleChange}>
    {#each currencies as currency}
      <option value={currency.code}>{currency.code} - {currency.name}</option>
    {/each}
  </select>
</label>
