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
    │   ├── ConversionHistory.vue
    │   └── FavoritePairs.vue
    ├── services/
    └── stores/

svelte/
└── src/
    ├── components/
    │   ├── CurrencyConverter.svelte
    │   ├── CurrencySelect.svelte
    │   ├── ConversionResult.svelte
    │   ├── ConversionHistory.svelte
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

## Uso de IA en el proyecto

Durante el desarrollo se usó IA como apoyo para investigar APIs de tasas de cambio que no requirieran API key. A partir de esa revisión se eligió Frankfurter API, ya que permite obtener monedas y tasas actuales de forma simple.

También se usó IA para organizar el trabajo en tarjetas pequeñas de Jira, principalmente la estructura base del proyecto, integración de API, conversor principal, intercambio de monedas, favoritos e historial.

En la versión Vue, la IA se usó principalmente como apoyo para revisar, ordenar y corregir código. Luego, tomando esa base, se utilizó para traducir la misma funcionalidad a Svelte, manteniendo una estructura equivalente entre ambos frameworks.

Finalmente, se usó IA para pensar una funcionalidad que permitiera comparar mejor la actualización de variables entre Vue y Svelte. De esa idea surgió el historial de conversiones, donde Vue actualiza un `ref` con `history.value`, mientras que Svelte actualiza la interfaz reasignando directamente `history`.
