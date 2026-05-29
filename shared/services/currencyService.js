const API_BASE_URL = 'https://api.frankfurter.dev/v2'

// Obtiene el listado de monedas disponibles desde Frankfurter.
export async function getCurrencies(options = {}) {
  const currencies = await requestJson('/currencies', options)

  // La API devuelve nombres de campos propios; aqui los normalizamos para la UI.
  return currencies.map((currency) => ({
    code: currency.iso_code,
    name: currency.name,
    symbol: currency.symbol || ''
  }))
}

// Convierte un monto entre dos monedas usando la tasa actual de Frankfurter.
export async function convertCurrency({ amount, from, to }, options = {}) {
  // Primero validamos y normalizamos los datos recibidos desde la interfaz.
  const numericAmount = parseAmount(amount)
  const base = normalizeCurrencyCode(from)
  const quote = normalizeCurrencyCode(to)

  // Si ambas monedas son iguales, no hace falta consultar la API.
  if (base === quote) {
    return {
      amount: numericAmount,
      from: base,
      to: quote,
      rate: 1,
      convertedAmount: numericAmount,
      date: null
    }
  }

  // Frankfurter entrega la tasa; el monto convertido se calcula en nuestra app.
  const data = await requestJson(`/rate/${base}/${quote}`, options)
  const rate = Number(data.rate)

  if (!Number.isFinite(rate)) {
    throw new Error('La API no entrego una tasa de cambio valida.')
  }

  return {
    amount: numericAmount,
    from: base,
    to: quote,
    rate,
    convertedAmount: roundMoney(numericAmount * rate),
    date: data.date
  }
}

// Centraliza las llamadas HTTP para no repetir fetch, lectura JSON y manejo de errores.
async function requestJson(path, options = {}) {
  // En tests se puede inyectar un fetch falso; en la app real se usa el fetch del navegador.
  const fetcher = options.fetcher || globalThis.fetch

  if (typeof fetcher !== 'function') {
    throw new Error('Fetch no esta disponible para consultar Frankfurter API.')
  }

  let response

  try {
    response = await fetcher(`${API_BASE_URL}${path}`)
  } catch {
    throw new Error('No se pudo conectar con Frankfurter API.')
  }

  const data = await readResponseBody(response)

  if (!response.ok) {
    throw new Error(data?.message || `Frankfurter API respondio con estado ${response.status}.`)
  }

  return data
}

// Intenta leer el cuerpo JSON incluso cuando la respuesta HTTP viene con error.
async function readResponseBody(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

// Valida que el monto sea numerico y no negativo antes de consultar la API.
function parseAmount(amount) {
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw new Error('El monto debe ser un numero mayor o igual a cero.')
  }

  return numericAmount
}

// Limpia el codigo de moneda para aceptar entradas como "usd" o " usd ".
function normalizeCurrencyCode(code) {
  const normalizedCode = String(code || '').trim().toUpperCase()

  if (normalizedCode.length !== 3) {
    throw new Error('El codigo de moneda debe tener 3 caracteres.')
  }

  return normalizedCode
}

// Redondea el resultado final a 2 decimales para mostrar valores monetarios simples.
function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
