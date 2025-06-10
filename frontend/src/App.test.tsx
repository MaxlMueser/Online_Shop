import { render, screen } from '@testing-library/react';
import App from './App';

describe('App-Komponente', () => {
  it('zeigt den Text "Login"', () => {
    render(<App />);
    expect(screen.getByText(Benutzername).toBeInTheDocument();
  });
});
