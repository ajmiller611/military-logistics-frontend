'use client';
import { Box } from '@mui/material';
import { useState } from 'react';
import RegisterUserForm from '@/components/RegisterUserForm';
import { UserInput } from '@/schemas/userSchema';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';

const apiEndpoint = '/users/';

export default function RegisterUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<Record<string, string>>({});
  const handleUserSubmit = async (data: UserInput) => {
    console.log('User data submitted: ', data);
    setIsLoading(true);
    setApiResponse({}); // Clear previous errors
    try {
      const response = await axiosInstance.post(apiEndpoint, data);
      console.log('Response:', response);
      if (response.status === 201) {
        console.log('User created successfully: ', response.data);
        setApiResponse({ success: 'User created successfully!' });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 409: // Conflict
              console.error('User already exists: ', error.response.data);
              setApiResponse({ username: error.response.data.message });
              break;
            case 400: // Bad Request
              console.error('Invalid input: ', error.response.data);
              setApiResponse({
                error: 'Invalid input. Please check your data and try again.',
              });
              break;
            default:
              console.error('An error occurred: ', error.response.data);
              setApiResponse({
                error: 'An error occurred. Please try again later. ',
              });
              break;
          }
        } else {
          console.error('No response received: ', error.message);
          setApiResponse({
            error: 'An error with the server occurred. Please try again later.',
          });
        }
      } else {
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
    <Box>
      <RegisterUserForm
        onSubmit={handleUserSubmit}
        isLoading={isLoading}
        apiResponse={apiResponse}
      />
    </Box>
  );
}
