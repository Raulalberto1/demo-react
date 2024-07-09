import {React, act} from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from '../src/App';

import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetch.resetMocks();
});

const setupMocks = (response, responseData) => {
  fetch.mockResponseOnce(JSON.stringify(responseData), { status: response });
};

test('renders Login component initially', () => {
  render(<App />);
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('allows user to login and display user info', async () => {
  setupMocks(200, { user: { id: 1, username: 'user1' } });
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password1' } });
  fireEvent.click(screen.getByText('Login'));

  await waitFor(() => {
    expect(screen.getByText('User: testuser')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});

test('allows user to logout and return to login screen', async () => {
  setupMocks(200, { user: { id: 1, username: 'testuser' } });
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password1' } });
  fireEvent.click(screen.getByText('Login'));

  await waitFor(() => {
    expect(screen.getByText('User: testuser')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Logout'));

  await waitFor(() => {
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});