/**
 * Container component for creating a new inventory item
 *
 * Renders the CreateItemForm and handles submission to the backend API.
 * Displays success or error messages returned from the server and
 * redirects to the inventory dashboard on successful creation.
 * Handles authentication state to ensure only logged-in users can access the form.
 */
'use client';
import { useState, useEffect } from 'react';
import CreateItemForm from '@/components/inventory/CreateItemForm';
import { ItemFormData } from '@/schemas/itemSchema';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const apiEndpoint = '/inventory';

export default function CreateInventoryItemContainer() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<Record<string, string>>({});

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Don't render form until auth state is known
  if (loading || !user) {
    return null;
  }

  const handleItemSubmit = async (data: ItemFormData) => {
    console.log('Item data submitted: ', data);
    setIsLoading(true);
    setApiResponse({}); // Clear previous API messages
    try {
      const response = await axiosInstance.post(apiEndpoint, data);
      console.log('Response:', response);
      if (response.status === 201) {
        console.log('Item created successfully: ', response.data);
        setApiResponse({ success: 'Item created successfully!' });
        router.push('/dashboard/inventory'); // Redirect to inventory list
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 400: // Bad Request: validation error
              console.error('Invalid input: ', error.response.data);
              setApiResponse({
                error: 'Invalid input. Please check your data and try again.',
              });
              break;
            case 409: // Conflict: item already exists
              console.error('Item already exists: ', error.response.data);
              setApiResponse({ itemName: error.response.data.message });
              break;
            default: // Other server-side errors
              console.error('An error occurred: ', error.response.data);
              setApiResponse({
                error: 'An error occurred. Please try again later. ',
              });
              break;
          }
        } else {
          // Network or no response
          console.error('No response received: ', error.message);
          setApiResponse({
            error: 'An error with the server occurred. Please try again later.',
          });
        }
      } else {
        // Unexpected errors
        console.error('An unexpected error occurred: ', error);
        setApiResponse({
          error: 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateItemForm
      onSubmit={handleItemSubmit}
      isLoading={isLoading}
      apiResponse={apiResponse}
    />
  );
}
