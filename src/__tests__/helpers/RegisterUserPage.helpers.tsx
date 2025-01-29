import { render, screen, fireEvent } from '@testing-library/react';
import RegisterUserPage from '@/app/users/register/page';

type MockData = {
  username: string;
  password: string;
  email: string;
};

export const submitUserForm = (mockData: MockData) => {
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
};
