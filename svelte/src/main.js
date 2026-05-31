import { mount } from 'svelte'
import App from './App.svelte'
import './styles.css'

// Punto de entrada de Svelte, monta el componente App dentro del div #app de index.html.
mount(App, {
  target: document.getElementById('app')
})
