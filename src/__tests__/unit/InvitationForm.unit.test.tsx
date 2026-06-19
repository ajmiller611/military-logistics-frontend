import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvitationForm from '@/components/InvitationForm';

describe('InvitationForm Component', () => {
  const onSubmit = jest.fn();
  const onBackToUsers = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when no invitation link is provided', () => {
    test('renders form fields correctly', () => {
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading={false}
          onBackToUsers={onBackToUsers}
        />,
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /send invitation/i }),
      ).toBeInTheDocument();
    });

    test('shows validation errors', async () => {
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading={false}
          onBackToUsers={onBackToUsers}
        />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /send invitation/i,
      });

      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.click(submitButton);

      expect(
        await screen.findByText(/invalid email address/i),
      ).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test('calls onSubmit with valid data', async () => {
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading={false}
          onBackToUsers={onBackToUsers}
        />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /send invitation/i,
      });

      await userEvent.type(emailInput, 'user@test.com');
      await userEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@test.com',
        role: 'USER',
      });
    });

    test('displays API error messages', () => {
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading={false}
          apiResponse={{ email: 'Email already invited' }}
          onBackToUsers={onBackToUsers}
        />,
      );

      expect(screen.getByText(/email already invited/i)).toBeInTheDocument();
    });

    test('submit button disabled when loading', () => {
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading
          onBackToUsers={onBackToUsers}
        />,
      );

      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    });
  });

  describe('when an invitation link is provided', () => {
    test('hides form fields when invitation link is present', () => {
      const invitationLink = 'http://example.com/register?token=abc123';
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading={false}
          invitationLink={invitationLink}
          onBackToUsers={onBackToUsers}
        />,
      );

      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/role/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /send invitation/i }),
      ).not.toBeInTheDocument();
    });

    test('renders invitation link with copy and back buttons', () => {
      const invitationLink = 'http://example.com/register?token=abc123';
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading={false}
          invitationLink={invitationLink}
          onBackToUsers={onBackToUsers}
        />,
      );

      expect(screen.getByDisplayValue(invitationLink)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /copy to clipboard/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /back to users/i }),
      ).toBeInTheDocument();
    });

    test('calls onBackToUsers when back button is clicked', async () => {
      render(
        <InvitationForm
          onSubmit={onSubmit}
          isLoading={false}
          invitationLink="http://example.com/register?token=abc123"
          onBackToUsers={onBackToUsers}
        />,
      );

      const backButton = screen.getByRole('button', {
        name: /back to users/i,
      });
      await userEvent.click(backButton);

      expect(onBackToUsers).toHaveBeenCalled();
    });
  });
});
