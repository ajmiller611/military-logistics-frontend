/**
 * InventoryPage
 *
 * Serves as the dashboard page for displaying inventory items.
 * Renders the InventoryTable component which manages
 * the table and API interactions.
 */
import InventoryTable from '@/components/inventory/InventoryTable';

export default function InventoryPage() {
  return <InventoryTable />;
}
