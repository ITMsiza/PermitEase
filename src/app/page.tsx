
/*import { redirect } from 'next/navigation';
import React from 'react'; // Required for React.use

interface HomePageProps {
  params?: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function HomePage({ params, searchParams }: HomePageProps) {
  // "Acknowledge" params and searchParams by attempting to "use" them via a resolved promise.
  // This is to avoid the "params are being enumerated" error that can occur if Next.js
  // internals or dev tools try to inspect these objects before they are "used".
  // We avoid direct enumeration like Object.keys() before this step.
  if (params) {
    React.use(Promise.resolve(params));
  }
  if (searchParams) {
    React.use(Promise.resolve(searchParams));
  }

  redirect('/auth');
  // The redirect function throws an error that Next.js handles to perform the redirection.
  // Therefore, no explicit return statement (like `return null;`) is necessary after calling redirect().
}*/
//import PermitsPageUI from '@/components/componentTesting';

import SignIn from '@/components/auth/SignIn';
export default function HomePage() {
  return (
    <div>
      <SignIn />
    </div>
  );
}

/*import SettingsPage from '@/components/Settings';
export default function Home() {
  return (
    <div>
      <SettingsPage />
    </div>
  );
}*/
