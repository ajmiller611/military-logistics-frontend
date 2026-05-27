'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import { usePathname, useRouter } from 'next/navigation';

/** Width of the sidebar drawer */
const DRAWER_WIDTH = 280;

/** Items displayed in the sidebar navigation */
const sidebarItems = [
  {
    label: 'Dashboard',
    icon: <BarChartIcon />,
    href: '/dashboard',
  },
  {
    label: 'Users',
    icon: <PersonIcon />,
    href: '/dashboard/users',
  },
  {
    label: 'Inventory',
    icon: <InventoryIcon />,
    href: '/dashboard/inventory',
  }
];

export interface DashboardSidebarProps {
  /** Whether the mobile drawer is open */
  open: boolean;
  /** Callback to close the mobile drawer */
  onClose: () => void;
}

/**
 * DashboardSidebar
 *
 * Renders the left-hand navigation drawer for the dashboard layout.
 * - Supports responsive behavior:
 *   - Permanent drawer on desktop
 *   - Temporary drawer with overlay on mobile
 * - Highlights the active route based on the current pathname.
 * - Automatically closes the drawer on mobile after a navigation click.
 */
export default function DashboardSidebar({
  open,
  onClose,
}: Readonly<DashboardSidebarProps>) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  /** The actual content of the drawer, shared by mobile and desktop variants */
  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <ListItemButton
                key={item.href}
                selected={isActive}
                onClick={() => {
                  router.push(item.href);
                  if (!isDesktop) {
                    onClose();
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
            },
          }}
          data-testid="dashboard-sidebar"
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
          data-testid="dashboard-sidebar"
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}
