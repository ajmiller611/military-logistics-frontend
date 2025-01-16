import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  test('scrolls to section when an anchor link is clicked', () => {
    render(<Home />);
    const aboutLink = screen.getByRole('link', { name: 'About' });
    const goalsLink = screen.getByRole('link', { name: 'Contact Me' });

    const aboutTarget = document.createElement('div');
    aboutTarget.id = 'about';
    document.body.appendChild(aboutTarget);

    const targetElement = document.createElement('div');
    targetElement.id = 'contact';
    document.body.appendChild(targetElement);

    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;

    fireEvent.click(aboutLink);
    expect(scrollToMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: -64,
    });

    scrollToMock.mockClear();

    fireEvent.click(goalsLink);
    expect(scrollToMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: -64,
    });
  });
});
