/**
 * InventoryTable component
 *
 * Displays a paginated table of inventory items with actions
 * to create, edit, and delete.
 * Integrates with the backend via axiosInstance for CRUD operations.
 *
 * Features:
 * - Fetch inventory items from the API on mount and refresh
 * - Delete items with confirmation prompt
 * - Navigate to create/edit pages
 * - Handles loading and error states
 *
 * Designed for use in the dashboard under /inventory
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import PageContainer from '../PageContainer';
import { Stack, IconButton, Button, Box, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { type Item } from '@/types/Item';
import { fetchItems, deleteItem } from '@/lib/api/inventory';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function InventoryTable() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inventory items from API on mount or when loadItems is called
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Don't render until auth state is known
  if (authLoading) return null;

  const handleCreate = () => {
    router.push('/dashboard/inventory/create');
  };

  const handleEdit = (item: Item) => {
    router.push(`/dashboard/inventory/${item.id}/edit`);
  };

  const handleDelete = async (item: Item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete item "${item.name}"?`,
    );
    if (!confirmed) {
      return;
    }
    try {
      setLoading(true);
      await deleteItem(item.id);
      await loadItems();
      setLoading(false);
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 110 },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions' as const,
      width: 120,
      getActions: ({ row }: { row: Item }) => [
        <GridActionsCellItem
          key="edit-item"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(row)}
        />,
        <GridActionsCellItem
          key="delete-item"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(row)}
        />,
      ],
    },
  ];

  return (
    <PageContainer
      title="Inventory"
      actions={
        <Stack direction="row" spacing={1}>
          <IconButton onClick={loadItems} aria-label="refresh">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Item
          </Button>
        </Stack>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        {error && <Alert severity="error">{error}</Alert>}
        <DataGrid
          rows={items}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </PageContainer>
  );
}
