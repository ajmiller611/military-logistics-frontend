import { render, screen } from '@testing-library/react';
import RegisterUserForm from '@/components/RegisterUserForm';

describe('RegisterUserForm', () => {
  test('renders form with username, password, and email inputs', () => {
    render(<RegisterUserForm onSubmit={() => {}} isLoading={false} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('displays validation errors', () => {
    const apiResponse = {
      username: 'Username already taken',
      password: 'Password is too weak',
      email: 'Email already exists',
    };

    render(
      <RegisterUserForm
        onSubmit={() => {}}
        apiResponse={apiResponse}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/username already taken/i)).toBeInTheDocument();
    expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
  });

  test('disables submit buttons and shows loading text when isLoading is true', () => {
    render(<RegisterUserForm onSubmit={() => {}} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);
  });

  test('displays success message when apiResponse.success is provided', () => {
    const apiResponse = {
      success: 'User created successfully',
    };

    render(
      <RegisterUserForm
        onSubmit={() => {}}
        apiResponse={apiResponse}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/user created successfully/i)).toBeInTheDocument();
  });
});
