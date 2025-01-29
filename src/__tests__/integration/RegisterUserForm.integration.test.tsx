import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterUserForm from '@/components/RegisterUserForm';

describe('RegisterUserForm', () => {
  test('calls onSubmit with correct data when form is submitted', async () => {
    const mockOnSubmit = jest.fn();
    render(<RegisterUserForm onSubmit={mockOnSubmit} isLoading={false} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testUser' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // waitFor used to handle any asynchronous behavior
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testUser',
        password: 'password',
        email: 'test@example.com',
      });
    });
  });

  test('displays API response messages (error or success)', async () => {
    const apiResponse = {
      success: 'User created successfully',
      username: 'Username already taken',
    };
    const mockOnSubmit = jest.fn(() => {
      Promise.resolve(apiResponse);
    });

    render(
      <RegisterUserForm
        onSubmit={mockOnSubmit}
        apiResponse={apiResponse}
        isLoading={false}
      />,
    );

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testUser' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/user created successfully/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/username already taken/i)).toBeInTheDocument();
    });
  });
});
