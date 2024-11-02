import { Inspect } from '@/modules/Inspect';
import { Suspense } from 'react';

function App() {
  return (
    <main className="flex-1 flex flex-col">
      <Suspense>
        <Inspect />
      </Suspense>
    </main>
  );
}

export default App;
