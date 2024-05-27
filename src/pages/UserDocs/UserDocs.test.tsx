import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserDocs } from './UserDocs';

test('renders learn react link', () => {
  render(<UserDocs />);
  const linkElement = screen.getByText(/user/i);
  expect(linkElement).toBeInTheDocument();
});
