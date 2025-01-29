import { screen, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { submitUserForm } from '../helpers/RegisterUserPage.helpers';

const userRegistrationEndpoint = 'http://localhost:8080/users/';

type MockData = {
  username: string;
  password: string;
  email: string;
};

describe('RegisterUserPage Integration Tests', () => {
  let mockData: MockData;

  beforeEach(() => {
    mockData = {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    };
  });

  test('handles user registration success', async () => {
    submitUserForm(mockData);

    await waitFor(() => {
      expect(
        screen.getByText(/User created successfully/i),
      ).toBeInTheDocument();
    });
  });

  test('handles username conflict error', async () => {
    mockData.username = 'existingUser';
    submitUserForm(mockData);

    await waitFor(() => {
      expect(screen.getByText(/Username already taken/i)).toBeInTheDocument();
    });
  });

  test('handles invalid input error', async () => {
    mockData.username = 'invalidUsername';
    submitUserForm(mockData);

    await waitFor(() => {
      expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
    });
  });

  test('handles unexpected status code error', async () => {
    server.use(
      http.post(userRegistrationEndpoint, async () => {
        return HttpResponse.json(
          { message: 'An error occurred' },
          { status: 999 },
        );
      }),
    );

    submitUserForm(mockData);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('An error occurred')),
      ).toBeInTheDocument();
    });
  });
});
