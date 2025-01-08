import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '@/components/Navigation';

describe('Navigation', () => {
  it('navigates to the About page', async () => {
    render(<Navigation />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    userEvent.click(aboutLink);
    expect(await screen.findByText(/about us/i)).toBeInTheDocument();
  });
});
