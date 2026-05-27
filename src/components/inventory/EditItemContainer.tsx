'use client';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import EditItemForm from '@/components/inventory/EditItemForm';
import { ItemFormData } from '@/schemas/itemSchema';
import { useAuth } from '@/context/AuthContext';

// Shape of item data returned by the backend for edit operations
interface ItemResponse {
  id: number;
  name: string;
  quantity: number;
  description?: string;
}

/**
 * Edit Item page
 * - Fetches item details by ID
 * - Pre-populates edit form
 * - Submits updates to backend
 */
export default function EditItemContainer() {
  const { itemId } = useParams<{ itemId: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState<Record<string, string>>({});

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  // Load item data when page is accessed or itemId changes
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(`/inventory/${itemId}`);
        console.log(response);
        setItem(response.data.data);
      } catch (error) {
        console.error('Error fetching item data:', error);
        setApiResponse({
          error: 'Failed to load item data.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  // Don't render form until auth state is known
  if (authLoading || !user) {
    return null;
  }

  const handleUpdateItem = async (data: ItemFormData) => {
    setIsLoading(true);
    setApiResponse({});
    try {
      await axiosInstance.put(`/inventory/${itemId}`, data);
      router.push('/dashboard/inventory');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error updating item:', error.response.data);
          setApiResponse({ error: 'Failed to update item.' });
        } else {
          console.error('No response received:', error.message);
          setApiResponse({ error: 'Server error. Please try again later.' });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while fetching item data
  if (isLoading && !item) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Box>
        <Typography color="error">Item not found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <EditItemForm
        defaultValues={{
          name: item?.name || '',
          quantity: item?.quantity || 0,
          description: item?.description || '',
        }}
        onSubmit={handleUpdateItem}
        isLoading={isLoading}
        apiResponse={apiResponse}
      />
    </Box>
  );
}
