import React from 'react';
import { render, screen, within } from '@testing-library/react';
import DashboardWrapper from '@/components/DashboardWrapper';

describe('DashboardWrapper', () => {
  test('render the default layout with AppBar and Drawer', () => {
    render(
      <DashboardWrapper>
        <div>Test Content</div>
      </DashboardWrapper>,
    );

    // Check if AppBar is rendered
    const appBar = screen.getByRole('banner');
    expect(within(appBar).getByText(/dashboard/i)).toBeInTheDocument();

    // Check if the Drawer contains specific navigation links
    const drawer = screen.getByRole('navigation');
    expect(within(drawer).getByText(/dashboard/i)).toBeInTheDocument();
    expect(within(drawer).getByText(/users/i)).toBeInTheDocument();
    expect(within(drawer).getByText(/settings/i)).toBeInTheDocument();

    // Check if child content is rendered
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });
});
