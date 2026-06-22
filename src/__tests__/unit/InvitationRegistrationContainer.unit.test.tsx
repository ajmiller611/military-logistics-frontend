import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvitationRegistrationContainer from '@/components/InvitationRegistrationContainer';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';

jest.mock('@/lib/axiosInstance');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;
const mockedUseSearchParams = useSearchParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const pushMock = jest.fn();

describe('InvitationRegistrationContainer', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    mockUseRouter.mockReturnValue({
      push: pushMock,
    });
  });

  const mockValidToken = () => {
    mockedUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('valid-token'),
    });

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: { email: 'test@email.com' },
    });
  };

  const submitForm = async (
    username = 'testuser',
    password = 'password123',
  ) => {
    // Wait for the form to appear
    const usernameInput = await screen.findByLabelText(/username/i);
    await userEvent.type(usernameInput, username);
    await userEvent.type(screen.getByPlaceholderText('password'), password);
    await userEvent.type(
      screen.getByPlaceholderText('confirm password'),
      password,
    );
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  };

  describe('token validation', () => {
    test('renders loading state while validating token', () => {
      mockValidToken();
      mockedAxios.get.mockImplementation(() => new Promise(() => {}));

      render(<InvitationRegistrationContainer />);

      expect(screen.getByText(/validating invitation/i)).toBeInTheDocument();
    });

    test('displays error message for missing token', () => {
      mockedUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(''),
      });

      render(<InvitationRegistrationContainer />);

      expect(screen.getByText(/missing invitation token/i)).toBeInTheDocument();
    });

    test('displays error message for invalid token', async () => {
      mockedUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue('invalid-token'),
      });

      mockedAxios.get.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid token',
          },
        },
      });

      render(<InvitationRegistrationContainer />);

      expect(await screen.findByText(/invalid token/i)).toBeInTheDocument();
    });

    test('navigates to login page when Back to Login button is clicked', async () => {
      mockedUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(''),
      });

      render(<InvitationRegistrationContainer />);

      await userEvent.click(
        screen.getByRole('button', { name: /back to login/i }),
      );

      expect(pushMock).toHaveBeenCalledWith('/login');
    });

    test('renders registration form', async () => {
      mockValidToken();

      render(<InvitationRegistrationContainer />);

      expect(await screen.findByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('confirm password'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument();
    });

    test('displays error message on API failure', async () => {
      mockedAxios.get.mockRejectedValue({
        message: 'Network Error',
      });

      render(<InvitationRegistrationContainer />);

      expect(
        await screen.findByText(
          /an error occurred while validating the token/i,
        ),
      ).toBeInTheDocument();
    });

    test('displays unexpected error message for validating token', async () => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      mockedAxios.get.mockRejectedValue(new Error('Boom'));

      render(<InvitationRegistrationContainer />);

      expect(
        await screen.findByText(/an unexpected error occurred/i),
      ).toBeInTheDocument();
    });

    test('pre-fills email field on valid token', async () => {
      mockValidToken();

      render(<InvitationRegistrationContainer />);

      expect(
        await screen.findByDisplayValue('test@email.com'),
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('readonly');
    });
  });

  describe('registration', () => {
    test('displays success message on successful registration', async () => {
      mockValidToken();
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: {},
      });

      render(<InvitationRegistrationContainer />);

      await submitForm();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/auth/register/invitation',
        {
          username: 'testuser',
          password: 'password123',
          token: 'valid-token',
        },
      );

      expect(
        await screen.findByText(/user created successfully/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/you can now log in with your new account/i),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /go to login/i }),
      ).toBeInTheDocument();
    });

    test('displays error message on user already exists', async () => {
      mockValidToken();
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 409,
          data: {
            message: 'User already exists',
          },
        },
      });

      render(<InvitationRegistrationContainer />);

      await submitForm();

      expect(
        await screen.findByText(/user already exists/i),
      ).toBeInTheDocument();
    });

    test('displays error message on invalid input message from API', async () => {
      mockValidToken();
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 400,
          data: {
            message: 'Invalid input',
          },
        },
      });

      render(<InvitationRegistrationContainer />);

      await submitForm();

      expect(await screen.findByText(/invalid input/i)).toBeInTheDocument();
    });

    test('displays error message on other server-side errors', async () => {
      mockValidToken();
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 500,
          data: {
            message: 'An error occured',
          },
        },
      });

      render(<InvitationRegistrationContainer />);

      await submitForm();

      expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
    });

    test('displays error message on no response from the server', async () => {
      mockValidToken();
      mockedAxios.post.mockRejectedValue({
        message: 'Network Error',
      });

      render(<InvitationRegistrationContainer />);

      await submitForm();

      expect(
        await screen.findByText(/an error with the server occurred/i),
      ).toBeInTheDocument();
    });

    test('displays error message on unexpected error during registration', async () => {
      mockValidToken();
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      mockedAxios.post.mockRejectedValue(new Error('Boom'));

      render(<InvitationRegistrationContainer />);

      await submitForm();

      expect(
        await screen.findByText(/an unexpected error occurred/i),
      ).toBeInTheDocument();
    });

    test('navigates to login page when Go to Login button is clicked', async () => {
      mockValidToken();
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: {},
      });

      render(<InvitationRegistrationContainer />);

      await submitForm();
      await userEvent.click(
        screen.getByRole('button', { name: /go to login/i }),
      );

      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });
});
