import assert from 'node:assert/strict'
import { convertCurrency, getCurrencies } from './currencyService.js'

const jsonResponse = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body
})

const currencies = await getCurrencies({
  fetcher: async () =>
    jsonResponse([
      { iso_code: 'EUR', name: 'Euro', symbol: 'EUR' },
      { iso_code: 'USD', name: 'US Dollar', symbol: '$' }
    ])
})

assert.deepEqual(currencies, [
  { code: 'EUR', name: 'Euro', symbol: 'EUR' },
  { code: 'USD', name: 'US Dollar', symbol: '$' }
])

const conversion = await convertCurrency(
  { amount: 10, from: 'eur', to: 'usd' },
  {
    fetcher: async () =>
      jsonResponse({
        date: '2026-05-27',
        base: 'EUR',
        quote: 'USD',
        rate: 1.1645
      })
  }
)

assert.deepEqual(conversion, {
  amount: 10,
  from: 'EUR',
  to: 'USD',
  rate: 1.1645,
  convertedAmount: 11.65,
  date: '2026-05-27'
})

await assert.rejects(
  () =>
    getCurrencies({
      fetcher: async () => jsonResponse({ message: 'Could not find currency ABC' }, false, 404)
    }),
  /Could not find currency ABC/
)
