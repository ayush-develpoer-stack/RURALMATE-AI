import { FiShoppingBag } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import CatalogView from '@/components/catalog/CatalogView';

export default function CatalogPage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 6 · Product & Catalog"
        icon={<FiShoppingBag />}
        title="Turn a product into a market-ready listing"
        subtitle="Generate a name, description, tags and suggested pricing — then see where potential buyers may exist."
      />
      <CatalogView />
    </div>
  );
}
