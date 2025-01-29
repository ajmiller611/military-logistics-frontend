import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterUserPage from '@/app/users/register/page';
import axiosInstance from '@/lib/axiosInstance';
import { UserInput } from '@/schemas/userSchema';

jest.mock('@/lib/axiosInstance', () => ({
  post: jest.fn(),
}));

describe('RegisterUserPage', () => {
  let mockData: UserInput;

  beforeEach(() => {
    mockData = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };
  });

  const mockApiCall = (statusCode: number, response: unknown) => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      status: statusCode,
      data: response,
    });
  };

  const mockApiCallError = (error: unknown) => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(error);
  };

  const submitUserForm = () => {
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
  };

  test('renders the RegisterUserForm component', () => {
    render(<RegisterUserPage />);

    expect(
      screen.getByRole('form', { name: 'user registration form' }),
    ).toBeInTheDocument();
  });

  test('handles successful user registration', async () => {
    mockApiCall(201, { message: 'User created successfully!' });
    submitUserForm();

    await waitFor(() => {
      expect(
        screen.getByText(/user created successfully/i),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles username conflict error', async () => {
    mockData.username = 'existingUser';
    mockApiCallError({
      isAxiosError: true,
      response: { status: 409, data: { message: 'Username already taken' } },
    });
    submitUserForm();

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
    mockData.username = 'invalidUsername';
    mockApiCallError({
      isAxiosError: true,
      response: { status: 400, data: { message: 'Invalid input' } },
    });
    submitUserForm();

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Invalid input')),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles unexpected status code response error', async () => {
    mockApiCallError({
      isAxiosError: true,
      response: { status: 999, data: { message: 'An error occurred' } },
    });
    submitUserForm();

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('An error occurred')),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles axios error type but no response present', async () => {
    mockApiCallError({ isAxiosError: true });
    submitUserForm();

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
    mockApiCallError({ isAxiosError: false });
    submitUserForm();

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
