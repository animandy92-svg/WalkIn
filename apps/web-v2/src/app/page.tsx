import type { Metadata } from 'next';
import BookLocalHome from '@/components/booklocal-home';

export const metadata: Metadata = {
  title: 'BookLocal — Skip the wait',
  description: 'Find trusted local services around Cape Coast and UCC, and reserve a time before you arrive.',
};

export default function HomePage() {
  return <BookLocalHome />;
}
