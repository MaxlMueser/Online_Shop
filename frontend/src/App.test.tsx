import { render, screen } from '@testing-library/react'
import App from './App'

describe('App-Komponente', () => {
  it('zeigt den Text "Vite + React"', () => {
    render(<App />)
    expect(screen.getByText(/vite \+ react/i)).toBeInTheDocument()
  })
})