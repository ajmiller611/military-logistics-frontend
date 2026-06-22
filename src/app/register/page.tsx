import InvitationRegistrationContainer from '@/components/InvitationRegistrationContainer';

/**
 * Server page component for invitation-based user registration.
 * Reads the invitation token from searchParams and passes it
 * to the client-side registration container.
 */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <InvitationRegistrationContainer token={params.token ?? ''} />;
}
