import { render, screen, within } from '@testing-library/react';
import Home from '@/app/page';

// Test suite for Home page components
// These tests ensure that all major sections and content of the homepage render correctly.
describe('Home Page', () => {
  test('renders project title and description', () => {
    render(<Home />);
    expect(
      screen.getByText(/Welcome to Military Logistics Management System/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This portfolio project is to demonstrate my ability to create a professional full-stack application with integrated AI-tools/i,
      ),
    ).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<Home />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(8);
    expect(links[0]).toHaveTextContent('About');
    expect(links[1]).toHaveTextContent('Project Goals');
    expect(links[2]).toHaveTextContent('Technical Highlights');
    expect(links[3]).toHaveTextContent('Frontend Tech Stack');
    expect(links[4]).toHaveTextContent('Backend Tech Stack');
    expect(links[5]).toHaveTextContent('Other Tech Stack');
    expect(links[6]).toHaveTextContent('Documentation and Resources');
    expect(links[7]).toHaveTextContent('Contact Me');
  });

  test('renders about section', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /about the project/i }));
  });

  test('renders the goals section', () => {
    render(<Home />);

    const goalsHeading = screen.getByRole('heading', {
      name: /project goals/i,
    });
    expect(goalsHeading).toBeInTheDocument();

    // To check for what elements are in the section, find the closest section to the heading.
    const goalsSection = goalsHeading.closest('section');
    expect(goalsSection).toBeInTheDocument();

    if (goalsSection) {
      const goalsList = within(goalsSection).getByRole('list');
      expect(goalsList).toBeInTheDocument();
    }
  });

  test('renders the technical highlights section', () => {
    render(<Home />);

    const highlightsHeading = screen.getByRole('heading', {
      name: /technical highlights/i,
    });
    expect(highlightsHeading).toBeInTheDocument();

    const highlightsSection = highlightsHeading.closest('section');
    expect(highlightsSection).toBeInTheDocument();

    if (highlightsSection) {
      const highlightsList = within(highlightsSection).getByRole('list');
      expect(highlightsList).toBeInTheDocument();
    }
  });

  test('renders the frontend tech stack section', () => {
    render(<Home />);

    const frontendHeading = screen.getByRole('heading', {
      name: /frontend tech stack/i,
    });
    expect(frontendHeading).toBeInTheDocument();

    const frontendSection = frontendHeading.closest('section');
    expect(frontendSection).toBeInTheDocument();

    if (frontendSection) {
      const outerGrid = frontendSection.querySelector('.MuiGrid2-root');
      expect(outerGrid).toBeInTheDocument();
    }
  });

  test('renders the backend tech stack section', () => {
    render(<Home />);

    const backendHeading = screen.getByRole('heading', {
      name: /backend tech stack/i,
    });
    expect(backendHeading).toBeInTheDocument();

    const backendSection = backendHeading.closest('section');
    expect(backendSection).toBeInTheDocument();

    if (backendSection) {
      const outerGrid = backendSection.querySelector('.MuiGrid2-root');
      expect(outerGrid).toBeInTheDocument();
    }
  });

  test('renders the other tech stack section', () => {
    render(<Home />);

    const otherHeading = screen.getByRole('heading', {
      name: /other tech stack/i,
    });
    expect(otherHeading).toBeInTheDocument();

    const otherSection = otherHeading.closest('section');
    expect(otherSection).toBeInTheDocument();

    if (otherSection) {
      const otherList = within(otherSection).getByRole('list');
      expect(otherList).toBeInTheDocument();
    }
  });

  test('renders the documentation section', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /documentation and resources/i }),
    );
  });

  test('renders the contact section', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /contact me/i }));
  });
});
