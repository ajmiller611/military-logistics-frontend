import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvitationForm from '@/components/InvitationForm';

describe('InvitationForm Component', () => {
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
  });

  test('renders form fields correctly', () => {
    render(<InvitationForm onSubmit={onSubmit} isLoading={false} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send invitation/i }),
    ).toBeInTheDocument();
  });

  test('shows validation errors', async () => {
    render(<InvitationForm onSubmit={onSubmit} isLoading={false} />);

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
    render(<InvitationForm onSubmit={onSubmit} isLoading={false} />);

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

  test('displays success message', () => {
    render(
      <InvitationForm
        onSubmit={onSubmit}
        isLoading={false}
        apiResponse={{ success: 'Invitation created successfully!' }}
      />,
    );

    expect(
      screen.getByText(/invitation created successfully/i),
    ).toBeInTheDocument();
  });

  test('displays API error messages', () => {
    render(
      <InvitationForm
        onSubmit={onSubmit}
        isLoading={false}
        apiResponse={{ email: 'Email already invited' }}
      />,
    );

    expect(screen.getByText(/email already invited/i)).toBeInTheDocument();
  });

  test('submit button disabled when loading', () => {
    render(<InvitationForm onSubmit={onSubmit} isLoading />);

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
  });
});
