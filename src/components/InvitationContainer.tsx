'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import InvitationForm from '@/components/InvitationForm';
import { InvitationFormData } from '@/schemas/invitationSchema';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const apiEndpoint = '/invitations';

/**
 * Container component for managing user invitations.
 *
 * Renders the InvitationForm, handles submission to the backend API,
 * and manages success or error messages returned from the server.
 * Redirects to the users dashboard on successful invitation creation.
 * Access is restricted to administrators.
 */
export default function InvitationContainer() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }

    if (!loading && user && !user.roles.includes('ADMIN')) {
      router.replace('/dashboard/users');
    }
  }, [user, loading, router]);

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<Record<string, string>>({});
  const [invitationLink, setInvitationLink] = useState<string | null>(null);

  if (loading || !user?.roles.includes('ADMIN')) {
    return null;
  }

  const handleInvitationSubmit = async (data: InvitationFormData) => {
    console.log('Invitation data submitted: ', data);
    setIsLoading(true);
    setApiResponse({});
    try {
      const response = await axiosInstance.post(apiEndpoint, data);
      console.log('Response:', response);

      if (response.status === 201) {
        console.log('Invitation created successfully: ', response.data);
        setApiResponse({ success: 'Invitation created successfully!' });
        setInvitationLink(
          `${window.location.origin}/register?token=${response.data.token}`,
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              setApiResponse(
                error.response.data.errors || { error: 'Invalid input' },
              );
              break;
            default:
              setApiResponse({ error: 'An unexpected error occurred' });
          }
        } else {
          setApiResponse({ error: 'No response from server' });
        }
      } else {
        setApiResponse({ error: 'An unknown error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUsers = () => {
    router.push('/dashboard/users');
  };

  return (
    <Box>
      <InvitationForm
        onSubmit={handleInvitationSubmit}
        apiResponse={apiResponse}
        isLoading={isLoading}
        invitationLink={invitationLink}
        onBackToUsers={handleBackToUsers}
      />
    </Box>
  );
}
