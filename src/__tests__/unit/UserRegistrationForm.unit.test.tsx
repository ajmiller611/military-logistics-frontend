import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserRegistrationForm from '@/components/UserRegistrationForm';

describe('UserRegistrationForm', () => {
  test('renders form with username, password, confirm password, and email inputs', () => {
    render(<UserRegistrationForm onSubmit={() => {}} isLoading={false} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('displays API error messages when apiResponse contains errors', () => {
    const apiResponse = {
      username: 'Username already taken',
      password: 'Password is too weak',
      email: 'Email already exists',
      error: 'Form submission failed',
    };

    render(
      <UserRegistrationForm
        onSubmit={() => {}}
        apiResponse={apiResponse}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/username already taken/i)).toBeInTheDocument();
    expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    expect(screen.getByText(/form submission failed/i)).toBeInTheDocument();
  });

  test('displays success message when apiResponse.success is provided', () => {
    const apiResponse = {
      success: 'User created successfully',
    };

    render(
      <UserRegistrationForm
        onSubmit={() => {}}
        apiResponse={apiResponse}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/user created successfully/i)).toBeInTheDocument();
  });

  test('disables submit buttons and shows loading text when isLoading is true', () => {
    render(<UserRegistrationForm onSubmit={() => {}} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);
  });

  test('calls onSubmit when form is submitted with valid data', async () => {
    const handleSubmit = jest.fn();

    render(<UserRegistrationForm onSubmit={handleSubmit} isLoading={false} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByPlaceholderText('password'), 'Test@1234');
    await userEvent.type(
      screen.getByPlaceholderText('confirm password'),
      'Test@1234',
    );
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'testuser@example.com',
    );
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'Test@1234',
      email: 'testuser@example.com',
    });
  });

  test('shows validation error when passwords do not match', async () => {
    render(<UserRegistrationForm onSubmit={() => {}} isLoading={false} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByPlaceholderText('password'), 'Test@1234');
    await userEvent.type(
      screen.getByPlaceholderText('confirm password'),
      'Mismatch@123',
    );
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'testuser@example.com',
    );
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('displays default email when provided', () => {
    render(
      <UserRegistrationForm
        onSubmit={() => {}}
        isLoading={false}
        defaultEmail="testuser@example.com"
      />,
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue('testuser@example.com');
  });

  test('email field is read only when defaultEmail is provided', () => {
    render(
      <UserRegistrationForm
        onSubmit={() => {}}
        isLoading={false}
        defaultEmail="invited@test.com"
      />,
    );

    const emailInput = screen.getByLabelText(/email/i);

    expect(emailInput).toHaveAttribute('readonly');
  });

  test('email field is editable when defaultEmail is not provided', () => {
    render(<UserRegistrationForm onSubmit={() => {}} isLoading={false} />);

    const emailInput = screen.getByLabelText(/email/i);

    expect(emailInput).not.toHaveAttribute('readonly');
  });
});
