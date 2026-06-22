import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import UsersTable from '@/components/UsersTable';
import { type User } from '@/types/User';
import { api } from '@/mocks/api';
import { useAuth } from '@/context/AuthContext';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockAdminAuth = { user: { roles: ['ADMIN'] }, loading: false };

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUsers: User[] = [
  { userId: 1, username: 'user1', email: 'user1@example.com' },
  { userId: 2, username: 'user2', email: 'user2@example.com' },
];

describe('UsersTable Integration Tests', () => {
  beforeEach(() => {
    pushMock.mockClear();
    mockedUseAuth.mockReturnValue(mockAdminAuth);

    server.use(
      http.get(api.users(), async () => {
        return HttpResponse.json({
          status: 'success',
          message: 'Users fetched successfully',
          data: {
            currentPage: 1,
            totalPages: 1,
            totalItems: mockUsers.length,
            data: mockUsers,
          },
        });
      }),
    );
  });

  test('fetches and displays users in the table', async () => {
    render(<UsersTable />);

    for (const user of mockUsers) {
      await waitFor(() => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
      });
    }
  });

  test('shows error message when fetching users fails', async () => {
    server.use(
      http.get(api.users(), async () => {
        return HttpResponse.json({ message: 'server error' }, { status: 500 });
      }),
    );

    render(<UsersTable />);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  test('refresh button reloads the users', async () => {
    render(<UsersTable />);

    const refreshButton = screen.getByRole('button', { name: /refresh/i });

    await userEvent.click(refreshButton);

    for (const user of mockUsers) {
      await waitFor(() => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
      });
    }
  });
});
