import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterUserPage from '@/app/users/register/page';
import axiosInstance from '@/lib/axiosInstance';
import { UserInput } from '@/schemas/userSchema';

jest.mock('@/lib/axiosInstance', () => ({
  post: jest.fn(),
}));

let mockData: UserInput;

describe('RegisterUserPage', () => {
  beforeEach(() => {
    mockData = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };
  });

  test('renders the RegisterUserForm component', () => {
    render(<RegisterUserPage />);

    expect(
      screen.getByRole('form', { name: 'user registration form' }),
    ).toBeInTheDocument();
  });

  test('handles successful user registration', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      status: 201,
      data: { message: 'User created successfully!' },
    });

    render(<RegisterUserPage />);

    mockUserInputEvents(mockData);

    await waitFor(() => {
      expect(
        screen.getByText(/user created successfully/i),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles username conflict error', async () => {
    mockData = {
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

    mockUserInputEvents(mockData);

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
    mockData = {
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

    mockUserInputEvents(mockData);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Invalid input')),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles unexpected status code response error', async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 999,
        data: { message: 'An error occurred' },
      },
    });

    render(<RegisterUserPage />);

    mockUserInputEvents(mockData);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('An error occurred')),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles axios error type but no response present', async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
    });

    render(<RegisterUserPage />);

    mockUserInputEvents(mockData);

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
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: false,
    });

    render(<RegisterUserPage />);

    mockUserInputEvents(mockData);

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

type MockData = {
  username: string;
  password: string;
  email: string;
};

function mockUserInputEvents(mockData: MockData) {
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
}
