import type { Metadata } from 'next';
import WalkInHome from '@/components/walkin-home';

export const metadata: Metadata = {
  title: 'WalkIn — Skip the wait',
  description: 'Find trusted local services around Cape Coast and UCC, and reserve a time before you arrive.',
};

export default function HomePage() {
  return <WalkInHome />;
}
