/**
 * UsersTable
 *
 * Displays a paginated table of users with actions to create, edit, and delete.
 * Integrates with the backend via axiosInstance for CRUD operations.
 *
 * Features:
 * - Fetch users from the API on mount and refresh
 * - Delete users with confirmation prompt
 * - Navigate to create/edit pages
 * - Handles loading and error states
 *
 * Designed for use in the dashboard under /users
 */
'use client';
import * as React from 'react';
import { Box, Button, IconButton, Stack, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageContainer from './PageContainer';
import { type User } from '@/types/User';
import { fetchUsers, deleteUser } from '@/lib/api/users';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UsersTable() {
  const { user: authUser, loading: authLoading } = useAuth();
  const isAdmin = authUser?.roles.includes('ADMIN');
  const router = useRouter();

  // Component state
  const [users, setUsers] = React.useState<User[]>([]); // List of users displayed
  const [loading, setLoading] = React.useState<boolean>(true); // Loading indicator
  const [error, setError] = React.useState<string | null>(null); // Error message from API

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users from API on mount or when loadUsers is called
  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Don't render until auth state is known
  if (authLoading) return null;

  const handleRefresh = () => loadUsers();

  // Navigate to the user registration page
  const handleCreate = () => {
    router.push('/dashboard/users/register');
  };

  // Navigate to the create invitation page
  const handleCreateInvitation = () => {
    router.push('/dashboard/invitations');
  };

  // Navigate to the edit page for a given user
  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/${user.userId}/edit`);
  };

  // Delete a user with a confirmation prompt
  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${user.username}"?`,
    );

    if (!confirmed) {
      return;
    }
    try {
      setLoading(true);
      await deleteUser(user.userId);
      await loadUsers();
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Define columns for the DataGrid
  // 'actions' column uses GridActionsCellItem for edit/delete buttons
  const columns: GridColDef[] = [
    { field: 'userId', headerName: 'ID', width: 80 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    ...(isAdmin
      ? [
          {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions' as const,
            width: 120,
            getActions: ({ row }: { row: User }) => [
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
        ]
      : []),
  ];

  // PageContainer wraps table with title and action buttons
  // DataGrid displays users with pagination, loading, and error states
  return (
    <PageContainer
      title="Users"
      actions={
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleRefresh} aria-label="refresh">
            <RefreshIcon />
          </IconButton>
          {isAdmin && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Create
              </Button>

              <Button variant="outlined" onClick={handleCreateInvitation}>
                Create Invitation
              </Button>
            </>
          )}
        </Stack>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        {error && <Alert severity="error">{error}</Alert>}
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId}
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
