import { Suspense } from 'react';
import PermitReviewPage from '../PermitReviewPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PermitReviewPage />
    </Suspense>
  );
}
