import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InventoryTable from '@/components/inventory/InventoryTable';
import { fetchItems } from '@/lib/api/inventory';
import { useAuth } from '@/context/AuthContext';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: pushMock,
  }),
}));

jest.mock('@/lib/api/inventory', () => ({
  fetchItems: jest.fn(),
}));

const mockAuth = { user: { roles: ['USER'] }, loading: false };

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
const mockedUseAuth = useAuth as jest.Mock;

const mockedFetchItems = fetchItems as jest.MockedFunction<typeof fetchItems>;

const mockItems = [
  {
    id: 1,
    name: 'Item 1',
    quantity: 10,
    description: 'Description for Item 1',
  },
];

describe('InventoryTable Unit Tests', () => {
  beforeEach(() => {
    pushMock.mockClear();
    mockedUseAuth.mockReturnValue(mockAuth);
    mockedFetchItems.mockResolvedValue(mockItems);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('unauthenticated users are redirected to /login', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });

    render(<InventoryTable />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  test('renders title, create button, and refresh button', async () => {
    render(<InventoryTable />);

    expect(await screen.findByText('Inventory')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /refresh/i }),
    ).toBeInTheDocument();
  });

  test('create button navigates to /dashboard/inventory/create', async () => {
    render(<InventoryTable />);

    const createButton = await screen.findByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/dashboard/inventory/create');
    });
  });
});
