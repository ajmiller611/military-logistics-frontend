'use client';
import { useEffect, useState } from 'react';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CreateUserRequest } from '@/types/UserRequest';
import { Box, Button, Typography } from '@mui/material';

const apiEndpoint = '/auth/register/invitation';

interface InvitationRegistrationContainerProps {
  token: string;
}

/**
 * Container component for invitation-based account registration.
 *
 * Handles invitation token validation, account creation requests,
 * and management of loading, success, and error states. Delegates
 * form rendering and client-side validation to UserRegistrationForm.
 */
export default function InvitationRegistrationContainer({
  token,
}: InvitationRegistrationContainerProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [apiResponse, setApiResponse] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) {
      setApiResponse({ error: 'Missing invitation token.' });
      setIsValidatingToken(false);
      return;
    }

    const validateToken = async () => {
      setApiResponse({}); // Clear previous API messages
      try {
        const response = await axiosInstance.get(
          `/invitations/validate?token=${token}`,
        );

        console.log('Token is valid: ', response.data);
        setEmail(response.data.email); // Store email for pre-filling form
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Token validation failed: ', error.response.data);
            setApiResponse({
              error: error.response.data.message || 'Invalid or expired token.',
            });
          } else {
            console.error(
              'No response received during token validation: ',
              error.message,
            );
            setApiResponse({
              error:
                'An error occurred while validating the token. Please try again later.',
            });
          }
        } else {
          console.error(
            'An unexpected error occurred during token validation: ',
            error,
          );
          setApiResponse({
            error: 'An unexpected error occurred. Please try again later.',
          });
        }
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  /**
   * Handles submission from the UserRegistrationForm.
   * Sends user data to backend, handles success and errors.
   */
  const handleUserSubmit = async (data: CreateUserRequest) => {
    console.log('User data submitted: ', data);
    setIsSubmitting(true);
    setApiResponse({}); // Clear previous API messages
    const requestData = {
      username: data.username,
      password: data.password,
      token, // Include token in the request
    };
    try {
      const response = await axiosInstance.post(apiEndpoint, requestData);
      console.log('User created successfully: ', response.data);
      setIsSuccessful(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 409: // Conflict: username already exists
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
      setIsSubmitting(false);
    }
  };

  if (isValidatingToken) {
    return <Typography align="center">Validating invitation...</Typography>;
  }

  if (isSuccessful) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Typography color="success.main" variant="h6" align="center">
          User created successfully!
        </Typography>

        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          You can now log in with your new account.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  if (!email) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Typography color="error.main" variant="h6" align="center">
          {apiResponse.error}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/login')}
          sx={{ mt: 2 }}
        >
          Back to Login
        </Button>
      </Box>
    );
  }

  return (
    <UserRegistrationForm
      onSubmit={handleUserSubmit}
      isLoading={isSubmitting}
      apiResponse={apiResponse}
      defaultEmail={email}
    />
  );
}
