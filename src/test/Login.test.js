import {React, act} from 'react';
import { render, fireEvent, screen, waitFor  } from '@testing-library/react';
import { Login } from '../components/Login';

beforeEach(() => {
  fetch.resetMocks();
});

const setupMocks = (response, responseData) => {
  fetch.mockResponseOnce(JSON.stringify(responseData), { status: response });
};

test('renders Login component and performs a successful login', async () => {
  const setUser = jest.fn();
  setupMocks(200, { user: { id: 1, username: 'user1' } });

  render(<Login setUser={setUser} />);

  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password1' } });
  fireEvent.click(screen.getByText('Login'));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_OPERATIONS_URL}/api/user/login`, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user1', password: 'password1' }),
    }));
  });

  await waitFor(() => {
    expect(setUser).toHaveBeenCalledWith({ id: 1, username: 'user1' });
  });
});

test('renders Login component and handles login failure', async () => {
  const setUser = jest.fn();
  setupMocks(401, { message: 'Invalid password' });

  render(<Login setUser={setUser} />);

  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
  fireEvent.click(screen.getByText('Login'));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_OPERATIONS_URL}/api/user/login`, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'wrongpassword' }),
    }));
  });

  await waitFor(() => {
    expect(screen.getByText('Invalid password')).toBeInTheDocument();
  });
});