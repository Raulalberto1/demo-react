import {React, act} from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Balance } from '../components/Balance';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(100), // Mocked balance value
  })
);

const user = { id: 1 };

test('renders Balance component and fetches balance', async () => {
  let balance = 0;
  const setBalance = (newBalance) => {
    balance = newBalance;
  };

  render(<Balance user={user} updateBalance={setBalance} />);

  // Check that the balance is rendered with the initial value
  expect(screen.getByText(/Balance:/)).toHaveTextContent('Balance: 0');

  // Wait for the balance to be fetched and updated
  await waitFor(() => expect(screen.getByText(/Balance:/)).toHaveTextContent('Balance: 100'));

  // Ensure the balance was updated
  expect(balance).toBe(100);
});