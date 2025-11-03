import { Suspense } from 'react';
import ApplicationsDocsPage from '../page';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationsDocsPage />
    </Suspense>
  );
}
 