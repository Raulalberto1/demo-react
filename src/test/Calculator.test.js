import {React, act} from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Calculator } from '../components/Calculator';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

const user = { id: 1, username: 'user1' };
const updateBalance = jest.fn();

beforeEach(() => {
  fetch.resetMocks();
});

const setupMocks = () => {
  fetch.mockImplementation((url) => {
    if (url.includes('/api/record')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ content: [], totalPages: 1 }),
      });
    }
    if (url.includes('/api/record/balance')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(100), // Mocked balance value
      });
    }
    if (url.includes('/api/operation')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          result: 42, // Mocked operation result
          balance: 90, // Mocked new balance
        }),
      });
    }
    if (url.includes('/api/operation') && url.includes('random')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(42),
      });
    }
    if (url.includes('random.org')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(123456), // Mocked random value
      });
    }
    if (url.includes('/api/operation')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ type: 'addition', cost: 10 }]),
      });
    }
  });
};

beforeEach(() => {
  setupMocks();
});

afterEach(() => {
  fetch.mockClear();
  updateBalance.mockClear();
});

test('renders Calculator component and fetches initial data', async () => {
  render(<Calculator user={user} balance={100} updateBalance={updateBalance} />);

  // Check that the Calculator header is rendered
  expect(screen.getByText(/Calculator/)).toBeInTheDocument();

  // Wait for records to be fetched
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_OPERATIONS_URL}/api/record?userId=1&page=0&size=10`);
  });

  // Wait for the balance to be fetched
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_OPERATIONS_URL}/api/record/balance?userId=1`);
  });

  // Check that the balance was updated
  await waitFor(() => {
    expect(updateBalance).toHaveBeenCalledWith(100);
  });
});

test('performs an addition operation', async () => {
  render(<Calculator user={user} balance={100} updateBalance={updateBalance} />);

  fireEvent.change(screen.getByPlaceholderText('Number 1'), { target: { value: '10' } });
  fireEvent.change(screen.getByPlaceholderText('Number 2'), { target: { value: '20' } });

  fireEvent.click(screen.getByText('Add'));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_OPERATIONS_URL}/api/operation`, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationType: 'addition', n1: '10', n2: '20', userId: 1 }),
    }));
  });

  // Check that the result is displayed
  await waitFor(() => {
    expect(screen.getByText(/Result: 42/)).toBeInTheDocument();
  });

  // Check that the balance was updated
  await waitFor(() => {
    expect(updateBalance).toHaveBeenCalledWith(90);
  });
});

test('handles division by zero error', async () => {
  render(<Calculator user={user} balance={100} updateBalance={updateBalance} />);

  fireEvent.change(screen.getByPlaceholderText('Number 1'), { target: { value: '10' } });
  fireEvent.change(screen.getByPlaceholderText('Number 2'), { target: { value: '0' } });

  fireEvent.click(screen.getByText('Divide'));

  await waitFor(() => {
    expect(screen.getByText(/Division by zero is not allowed/)).toBeInTheDocument();
  });
});

test('handles square root of negative number error', async () => {
  render(<Calculator user={user} balance={100} updateBalance={updateBalance} />);

  fireEvent.change(screen.getByPlaceholderText('Number 1'), { target: { value: '-10' } });

  fireEvent.click(screen.getByText('Square Root'));

  await waitFor(() => {
    expect(screen.getByText(/Square root of a negative number is not allowed/)).toBeInTheDocument();
  });
});