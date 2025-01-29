import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterUserPage from '@/app/users/register/page';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

const userRegistrationEndpoint = 'http://localhost:8080/users/';

describe('RegisterUserPage Integration Tests', () => {
  test('handles user registration success', async () => {
    const mockData = {
      username: 'newUser',
      password: 'password',
      email: 'newuser@example.com',
    };

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/User created successfully/i),
      ).toBeInTheDocument();
    });
  });

  test('handles username conflict error', async () => {
    const mockData = {
      username: 'existingUser',
      password: 'password',
      email: 'test@example.com',
    };

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Username already taken/i)).toBeInTheDocument();
    });
  });

  test('handles invalid input error', async () => {
    const mockData = {
      username: 'invalidUsername',
      password: 'password',
      email: 'test@example.com',
    };

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
    });
  });

  test('handles unexpected status code error', async () => {
    const mockData = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };

    server.use(
      http.post(userRegistrationEndpoint, async () => {
        return HttpResponse.json(
          { message: 'An error occurred' },
          { status: 999 },
        );
      }),
    );

    render(<RegisterUserPage />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: mockData.username },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: mockData.password },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: mockData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('An error occurred')),
      ).toBeInTheDocument();
    });
  });
});
