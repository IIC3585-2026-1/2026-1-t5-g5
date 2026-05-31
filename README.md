# MoneyExchange

Proyecto de conversion de monedas usando dos frameworks Vue y Svelte.

## Estructura inicial

```text
.
├── shared/
│   └── services/
│       └── currencyService.js
├── vue/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── stores/
│   └── package.json
└── svelte/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── stores/
    └── package.json
```

## Objetivo

Se permite ingresar un monto, seleccionar una moneda de origen, seleccionar una moneda de destino y mostrar la conversión usando tasas reales.

## Ejecución local

Instalar dependencias:

```bash
npm install
```

Version Vue:

```bash
npm run dev:vue
```

Abre `http://localhost:5173`.

Version Svelte:

```bash
npm run dev:svelte
```

Abre `http://localhost:5174`.

## Componentes principales

```text
vue/
└── src/
    ├── components/
    │   ├── CurrencyConverter.vue
    │   ├── CurrencySelect.vue
    │   ├── ConversionResult.vue
    │   └── FavoritePairs.vue
    ├── services/
    └── stores/

svelte/
└── src/
    ├── components/
    │   ├── CurrencyConverter.svelte
    │   ├── CurrencySelect.svelte
    │   ├── ConversionResult.svelte
    │   └── FavoritePairs.svelte
    ├── services/
    └── stores/
```

## API de tasas de cambio

Se usa Frankfurter API v2 porque es una API abierta que no requiere API Key.

- Listado de monedas: `GET https://api.frankfurter.dev/v2/currencies`
- Tasa entre dos monedas: `GET https://api.frankfurter.dev/v2/rate/EUR/USD`
- Conversion: se obtiene la tasa y se calcula el monto convertido en la aplicacion.

La logica reutilizable vive en `shared/services/currencyService.js` y se re-exporta desde:

- `vue/src/services/currencyService.js`
- `svelte/src/services/currencyService.js`

## Testing del servicio

```bash
npm run test:api
```
