/**
 * Page component for registering a new user.
 *
 * Renders the CreateUserForm and handles submission to the backend API.
 * Displays success or error messages returned from the server and
 * redirects to the users dashboard on successful creation.
 */
'use client';
import { useEffect, useState } from 'react';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CreateUserRequest } from '@/types/UserRequest';

const apiEndpoint = '/users';

export default function RegisterUserPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && !user.roles.includes('ADMIN')) {
      router.replace('/dashboard/users');
    }
  }, [user, loading, router]);

  // Local state
  const [isLoading, setIsLoading] = useState(false); // Tracks form submission state
  const [apiResponse, setApiResponse] = useState<Record<string, string>>({}); // Holds field-specific or general API errors

  // Don't render form until auth state is known
  if (loading || !user?.roles.includes('ADMIN')) {
    return null;
  }

  /**
   * Handles submission from the UserRegistrationForm.
   * Sends user data to backend, handles success and errors.
   */
  const handleUserSubmit = async (data: CreateUserRequest) => {
    console.log('User data submitted: ', data);
    setIsLoading(true);
    setApiResponse({}); // Clear previous API messages
    try {
      const response = await axiosInstance.post(apiEndpoint, data);
      console.log('Response:', response);

      if (response.status === 201) {
        // User created successfully
        console.log('User created successfully: ', response.data);
        setApiResponse({ success: 'User created successfully!' });
        router.push('/dashboard/users'); // Redirect to users list
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Backend responded with an error
        if (error.response) {
          switch (error.response.status) {
            case 409: // Conflict: username/email already exists
              console.error('User already exists: ', error.response.data);
              setApiResponse({ username: error.response.data.message });
              break;
            case 400: // Bad Request: validation error
              console.error('Invalid input: ', error.response.data);
              setApiResponse({
                error: 'Invalid input. Please check your data and try again.',
              });
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

  // Render form with submission handler, loading state, and API messages
  return (
    <UserRegistrationForm
      onSubmit={handleUserSubmit}
      isLoading={isLoading}
      apiResponse={apiResponse}
    />
  );
}
