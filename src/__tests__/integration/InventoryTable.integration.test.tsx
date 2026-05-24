import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import InventoryTable from '@/components/inventory/InventoryTable';
import { type Item } from '@/types/Item';
import { api } from '@/mocks/api';
import { useAuth } from '@/context/AuthContext';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockAuth = { user: { roles: ['USER'] }, loading: false };

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockItems: Item[] = [
  {
    id: 1,
    name: 'Item 1',
    quantity: 10,
    description: 'Description for Item 1',
  },
  {
    id: 2,
    name: 'Item 2',
    quantity: 5,
    description: 'Description for Item 2',
  },
];

describe('InventoryTable Integration Tests', () => {
  beforeEach(() => {
    pushMock.mockClear();
    mockedUseAuth.mockReturnValue(mockAuth);

    server.use(
      http.get(api.inventory(), async () => {
        return HttpResponse.json({
          status: 'success',
          message: 'Items fetched successfully',
          data: {
            currentPage: 1,
            totalPages: 1,
            totalItems: mockItems.length,
            data: mockItems,
          },
        });
      }),
    );
  });

  test('fetches and displays inventory items in the table', async () => {
    render(<InventoryTable />);

    for (const item of mockItems) {
      await waitFor(() => {
        const row = screen.getByRole('row', {
          name: new RegExp(item.name, 'i'),
        });
        expect(within(row).getByText(item.name)).toBeInTheDocument();
        expect(within(row).getByText(item.quantity)).toBeInTheDocument();
        expect(within(row).getByText(item.description)).toBeInTheDocument();
      });
    }
  });

  test('shows error message when fetching items fails', async () => {
    server.use(
      http.get(api.inventory(), async () => {
        return HttpResponse.json({ message: 'server error' }, { status: 500 });
      }),
    );

    render(<InventoryTable />);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  test('refresh button reloads the inventory items', async () => {
    render(<InventoryTable />);

    const refreshButton = screen.getByRole('button', { name: /refresh/i });

    await userEvent.click(refreshButton);

    for (const item of mockItems) {
      await waitFor(() => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    }
  });
});
