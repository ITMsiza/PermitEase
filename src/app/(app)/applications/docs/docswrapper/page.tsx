import { Suspense } from 'react';
import AppDocsPage from '../page';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppDocsPage />
    </Suspense>
  );
}