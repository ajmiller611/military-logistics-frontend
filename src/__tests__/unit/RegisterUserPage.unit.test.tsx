import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterUserPage from '@/app/users/register/page';
import axiosInstance from '@/lib/axiosInstance';
import { UserInput } from '@/schemas/userSchema';

jest.mock('@/lib/axiosInstance', () => ({
  post: jest.fn(),
}));

describe('RegisterUserPage', () => {
  test('renders the RegisterUserForm component', () => {
    render(<RegisterUserPage />);

    expect(
      screen.getByRole('form', { name: 'user registration form' }),
    ).toBeInTheDocument();
  });

  test('handles successful user registration', async () => {
    const mockData: UserInput = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      status: 201,
      data: { message: 'User created successfully!' },
    });

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/user created successfully/i),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles username conflict error', async () => {
    const mockData: UserInput = {
      username: 'existingUser',
      password: 'password',
      email: 'test@example.com',
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 409,
        data: { message: 'Username already taken' },
      },
    });

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes('Username already taken'),
        ),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles invalid input error', async () => {
    const mockData: UserInput = {
      username: 'invalidUsername',
      password: 'password',
      email: 'test@example.com',
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { message: 'Invalid input' },
      },
    });

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Invalid input')),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles unexpected status code response error', async () => {
    const mockData: UserInput = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 999,
        data: { message: 'An error occurred' },
      },
    });

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('An error occurred')),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles axios error type but no response present', async () => {
    const mockData: UserInput = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
    });

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes(
            'An error with the server occurred. Please try again later.',
          ),
        ),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles an unexpected error', async () => {
    const mockData: UserInput = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: false,
    });

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes(
            'An unexpected error occurred. Please try again later.',
          ),
        ),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });
});
