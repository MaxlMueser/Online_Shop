// Vite Konfiguration für React-Projekt mit Vitest
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Importiere die Konfiguration von Vitest
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'], // Optional
    setupFiles: './src/setupTests.ts' // gleich erstellen
  }
})
