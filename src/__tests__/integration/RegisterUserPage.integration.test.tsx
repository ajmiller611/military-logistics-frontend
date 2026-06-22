import { render, screen, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import RegisterUserPage from '@/app/dashboard/users/register/page';
import { api } from '@/mocks/api';
import { AuthUser, useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext');
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const adminUser: AuthUser = {
  userId: 1,
  username: 'admin',
  email: 'admin@example.com',
  roles: ['ADMIN'],
};
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
mockedUseAuth.mockReturnValue({
  user: adminUser,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
});

describe('RegisterUserPage Integration Tests', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  const fillAndSubmitForm = async () => {
    await userEvent.type(screen.getByLabelText(/username/i), 'testUser');
    await userEvent.type(screen.getByPlaceholderText('password'), 'Test@1234');
    await userEvent.type(
      screen.getByPlaceholderText('confirm password'),
      'Test@1234',
    );
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  };

  test('successfully registers a user and redirects', async () => {
    render(<RegisterUserPage />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(
        screen.getByText(/User created successfully/i),
      ).toBeInTheDocument();
    });

    expect(pushMock).toHaveBeenCalledWith('/dashboard/users');
  });

  test('shows username conflict error (409)', async () => {
    server.use(
      http.post(api.users(), async () => {
        return HttpResponse.json(
          { message: 'Username already taken' },
          { status: 409 },
        );
      }),
    );

    render(<RegisterUserPage />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/Username already taken/i)).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  test('shows validation error (400)', async () => {
    server.use(
      http.post(api.users(), async () => {
        return HttpResponse.json({ message: 'Invalid input' }, { status: 400 });
      }),
    );

    render(<RegisterUserPage />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  test('shows generic server error for unexpected status', async () => {
    server.use(
      http.post(api.users(), async () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      }),
    );

    render(<RegisterUserPage />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
