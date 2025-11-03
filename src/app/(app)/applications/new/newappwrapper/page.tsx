import { Suspense } from 'react';
import NewPermitPage from '../NewPermitPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPermitPage />
    </Suspense>
  );
}
