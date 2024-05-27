import React from 'react';
import { render, screen } from '@testing-library/react';
import { Auth } from './Auth';

test('renders learn react link', () => {
  render(<Auth />);
  const linkElement = screen.getByText(/Войти/i);
  expect(linkElement).toBeInTheDocument();
});
