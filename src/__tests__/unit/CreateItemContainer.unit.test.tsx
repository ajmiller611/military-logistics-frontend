import { render, screen } from '@testing-library/react';
import CreateItemContainer from '@/components/inventory/CreateItemContainer';
import { useAuth, AuthUser } from '@/context/AuthContext';

jest.mock('@/context/AuthContext');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const regularUser: AuthUser = {
  userId: 2,
  username: 'user',
  email: 'user@example.com',
  roles: ['USER'],
};

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: replaceMock,
  }),
}));

describe('CreateItemContainer Unit Tests', () => {
  test('renders form for authenticated users', () => {
    mockedUseAuth.mockReturnValue({
      user: regularUser,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<CreateItemContainer />);

    expect(
      screen.getByRole('form', { name: 'item creation form' }),
    ).toBeInTheDocument();
  });

  test('does not render form for unauthenticated users and redirects', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { container } = render(<CreateItemContainer />);
    expect(container).toBeEmptyDOMElement();
    expect(replaceMock).toHaveBeenCalledWith('/login');
  });
});
