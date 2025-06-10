import { render, screen } from '@testing-library/react';
import App from './App';

it('zeigt den Login-Button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
