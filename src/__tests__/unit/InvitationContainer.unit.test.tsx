import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvitationContainer from '@/components/InvitationContainer';
import { AuthUser, useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';

jest.mock('@/lib/axiosInstance');

const mockedUseAuth = useAuth as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;
const pushMock = jest.fn();
const replaceMock = jest.fn();

const adminUser: AuthUser = {
  userId: 1,
  username: 'admin',
  email: 'admin@test.com',
  roles: ['ADMIN'],
};

const regularUser: AuthUser = {
  userId: 2,
  username: 'user',
  email: 'user@test.com',
  roles: ['USER'],
};

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('InvitationContainer Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    mockedUseAuth.mockReturnValue({
      user: adminUser,
      loading: false,
    });

    mockUseRouter.mockReturnValue({
      push: pushMock,
      replace: replaceMock,
    });
  });

  test('renders form for ADMIN users', async () => {
    render(<InvitationContainer />);

    expect(replaceMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();

    expect(
      screen.getByRole('form', { name: /user invitation form/i }),
    ).toBeInTheDocument();

    expect(await screen.findByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send invitation/i }),
    ).toBeInTheDocument();
  });

  test('redirects unauthenticated users to login', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<InvitationContainer />);

    expect(replaceMock).toHaveBeenCalledWith('/login');
  });

  test('redirects non-admin users to user dashboard', () => {
    mockedUseAuth.mockReturnValue({
      user: regularUser,
      loading: false,
    });

    render(<InvitationContainer />);

    expect(replaceMock).toHaveBeenCalledWith('/dashboard/users');
  });

  test('successfully submits form and displays invitation link', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: { token: 'sample-invitation-token' },
    });
    render(<InvitationContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send invitation/i,
    });

    await userEvent.type(emailInput, 'email@test.com');
    await userEvent.click(submitButton);

    expect(mockedAxios.post).toHaveBeenCalledWith('/invitations', {
      email: 'email@test.com',
      role: 'USER',
    });

    expect(
      screen.getByDisplayValue(
        `${window.location.origin}/register?token=sample-invitation-token`,
      ),
    ).toBeInTheDocument();
  });

  test('shows validation errors from the API', async () => {
    mockedAxios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          errors: {
            email: 'Email already exists',
          },
        },
      },
    });

    render(<InvitationContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send invitation/i,
    });

    await userEvent.type(emailInput, 'email@test.com');
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/email already exists/i),
    ).toBeInTheDocument();
  });

  test('shows generic error for server failures', async () => {
    mockedAxios.post.mockRejectedValue({
      response: {
        status: 500,
      },
    });

    render(<InvitationContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send invitation/i,
    });

    await userEvent.type(emailInput, 'email@test.com');
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/an unexpected error occurred/i),
    ).toBeInTheDocument();
  });

  test('shows no response error', async () => {
    mockedAxios.post.mockRejectedValue({
      request: {},
    });

    render(<InvitationContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send invitation/i,
    });

    await userEvent.type(emailInput, 'email@test.com');
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/no response from server/i),
    ).toBeInTheDocument();
  });

  test('shows unknown error', async () => {
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);
    mockedAxios.post.mockRejectedValue(new Error('Unknown error'));

    render(<InvitationContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send invitation/i,
    });

    await userEvent.type(emailInput, 'email@test.com');
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/an unknown error occurred/i),
    ).toBeInTheDocument();
  });

  test('navigates back to users dashboard when back button is clicked', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: { token: 'sample-invitation-token' },
    });

    render(<InvitationContainer />);

    await userEvent.type(screen.getByLabelText(/email/i), 'email@test.com');

    await userEvent.click(
      screen.getByRole('button', { name: /send invitation/i }),
    );

    const backButton = screen.getByRole('button', {
      name: /back to users/i,
    });

    await userEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/dashboard/users');
  });
});
