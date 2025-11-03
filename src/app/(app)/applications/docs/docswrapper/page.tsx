import { Suspense } from 'react';
import ApplicationsDocsPage from '../ApplicationsDocsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationsDocsPage />
    </Suspense>
  );
}