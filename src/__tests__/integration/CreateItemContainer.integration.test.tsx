import { render, screen, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import CreateInventoryItemContainer from '@/components/inventory/CreateItemContainer';
import { api } from '@/mocks/api';
import { AuthUser, useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext');
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const regularUser: AuthUser = {
  userId: 2,
  username: 'user',
  email: 'user@email.com',
  roles: ['USER'],
};
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
mockedUseAuth.mockReturnValue({
  user: regularUser,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
});

describe('CreateItemContainer Integration Tests', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  const fillAndSubmitForm = async () => {
    await userEvent.type(screen.getByLabelText(/item name/i), 'Test Item');
    await userEvent.type(screen.getByLabelText(/quantity/i), '10');
    await userEvent.type(screen.getByLabelText(/description/i), 'A test item');
    await userEvent.click(screen.getByRole('button', { name: /create item/i }));
  };

  test('successfully creates an item and redirects', async () => {
    render(<CreateInventoryItemContainer />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(
        screen.getByText(/Item created successfully/i),
      ).toBeInTheDocument();
    });

    expect(pushMock).toHaveBeenCalledWith('/dashboard/inventory');
  });

  test('shows validation error (400) when input is invalid', async () => {
    server.use(
      http.post(api.inventory(), async () => {
        return HttpResponse.json({ message: 'Invalid input' }, { status: 400 });
      }),
    );

    render(<CreateInventoryItemContainer />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(
        screen.getByText(
          /Invalid input. Please check your data and try again/i,
        ),
      ).toBeInTheDocument();
    });
  });

  test('shows item name conflict error (409)', async () => {
    server.use(
      http.post(api.inventory(), async () => {
        return HttpResponse.json(
          { message: 'Item already exists' },
          { status: 409 },
        );
      }),
    );

    render(<CreateInventoryItemContainer />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/Item already exists/i)).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  test('shows generic server error for other server errors', async () => {
    server.use(
      http.post(api.inventory(), async () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      }),
    );

    render(<CreateInventoryItemContainer />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred. Please try again later/i),
      ).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  test('shows server error for no response or network issues', async () => {
    server.use(
      http.post(api.inventory(), async () => {
        return HttpResponse.error();
      }),
    );

    render(<CreateInventoryItemContainer />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(
        screen.getByText(
          /An error with the server occurred. Please try again later/i,
        ),
      ).toBeInTheDocument();
    });
  });
});
