import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateItemForm from '@/components/inventory/CreateItemForm';

describe('CreateItemForm', () => {
  test('renders form with item name, quantity, and description inputs', () => {
    render(<CreateItemForm onSubmit={() => {}} isLoading={false} />);

    expect(screen.getByLabelText(/item name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test('displays API error messages when apiResponse contains errors', () => {
    const apiResponse = {
      itemName: 'Item name already exists',
      quantity: 'Quantity must be a non-negative number',
      description: 'Description is too long',
      error: 'Form submission failed',
    };

    render(
      <CreateItemForm
        onSubmit={() => {}}
        apiResponse={apiResponse}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/item name already exists/i)).toBeInTheDocument();
    expect(
      screen.getByText(/quantity must be a non-negative number/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/description is too long/i)).toBeInTheDocument();
    expect(screen.getByText(/form submission failed/i)).toBeInTheDocument();
  });

  test('displays success message when apiResponse.success is provided', () => {
    const apiResponse = {
      success: 'Item created successfully',
    };

    render(
      <CreateItemForm
        onSubmit={() => {}}
        apiResponse={apiResponse}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/item created successfully/i)).toBeInTheDocument();
  });

  test('disables submit button and shows loading text when isLoading is true', () => {
    render(<CreateItemForm onSubmit={() => {}} isLoading={true} />);

    const form = screen.getByRole('form');
    const submitButton = within(form).getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);
  });

  test('calls onSubmit when form is submitted with valid data', async () => {
    const handleSubmit = jest.fn();

    render(<CreateItemForm onSubmit={handleSubmit} isLoading={false} />);

    await userEvent.type(screen.getByLabelText(/item name/i), 'Test Item');
    await userEvent.type(screen.getByLabelText(/quantity/i), '10');
    await userEvent.type(
      screen.getByLabelText(/description/i),
      'This is a test item.',
    );
    await userEvent.click(screen.getByRole('button', { name: /create item/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      itemName: 'Test Item',
      quantity: 10,
      description: 'This is a test item.',
    });
  });
});
