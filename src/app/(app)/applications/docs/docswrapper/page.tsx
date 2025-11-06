import { Suspense } from 'react';
import AppDocsPage from '../ApplicationsDocsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppDocsPage />
    </Suspense>
  );
}