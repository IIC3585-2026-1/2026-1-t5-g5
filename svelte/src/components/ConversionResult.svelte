<script>
  // Componente solo de presentación, recibe un resultado ya calculado y solo lo muestra.
  export let result

  // Formatea el numero para que el resultado sea legible para el usuario.
  function formatAmount(value, currency) {
    return `${Number(value).toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${currency}`
  }
</script>

<section class="result-box" aria-live="polite">
  <span>Resultado</span>
  <strong>{formatAmount(result.convertedAmount, result.to)}</strong>
  <small>
    {formatAmount(result.amount, result.from)} = {formatAmount(result.convertedAmount, result.to)}
  </small>
</section>
