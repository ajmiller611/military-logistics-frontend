import { render, screen, waitFor } from '@testing-library/react';
import RegisterUserPage from '@/app/users/register/page';
import axiosInstance from '@/lib/axiosInstance';
import { UserInput } from '@/schemas/userSchema';
import { submitUserForm } from '../helpers/RegisterUserPage.helpers';

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

  test('renders the RegisterUserForm component', () => {
    render(<RegisterUserPage />);

    expect(
      screen.getByRole('form', { name: 'user registration form' }),
    ).toBeInTheDocument();
  });

  test('handles successful user registration', async () => {
    mockApiCall(201, { message: 'User created successfully!' });
    submitUserForm(mockData);

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
    submitUserForm(mockData);

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
    submitUserForm(mockData);

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
    submitUserForm(mockData);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('An error occurred')),
      ).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/users/', mockData);
  });

  test('handles axios error type but no response present', async () => {
    mockApiCallError({ isAxiosError: true });
    submitUserForm(mockData);

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
    submitUserForm(mockData);

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
