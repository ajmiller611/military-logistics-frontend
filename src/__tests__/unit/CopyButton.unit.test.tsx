import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyButton from '@/components/CopyButton';

describe('CopyButton', () => {
  const textToCopy = 'Sample text';

  beforeEach(() => {
    // Mock the clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  test('renders the copy button and copies text to clipboard', async () => {
    const textToCopy = 'Sample text to copy';
    render(<CopyButton textToCopy={textToCopy} />);

    const copyButton = screen.getByRole('button', {
      name: /copy to clipboard/i,
    });

    await userEvent.click(copyButton);
    expect(copyButton).toBeInTheDocument();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(textToCopy);

    expect(await screen.findByText(/copied!/i)).toBeInTheDocument();
  });

  test('handles clipboard API failure', async () => {
    const textToCopy = 'Sample text to copy';
    render(<CopyButton textToCopy={textToCopy} />);

    const copyButton = screen.getByRole('button', {
      name: /copy to clipboard/i,
    });
    expect(copyButton).toBeInTheDocument();

    const writeTextMock = jest
      .fn()
      .mockRejectedValue(new Error('Clipboard error'));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    await userEvent.click(copyButton);
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(textToCopy);
    });

    expect(screen.queryByText(/copied!/i)).not.toBeInTheDocument();
  });

  test('resets copied state after timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(<CopyButton textToCopy={textToCopy} />);

    const button = screen.getByRole('button', {
      name: /copy to clipboard/i,
    });

    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /copied/i }),
      ).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(
      screen.getByRole('button', { name: /copy to clipboard/i }),
    ).toBeInTheDocument();

    jest.useRealTimers();
  });
});
