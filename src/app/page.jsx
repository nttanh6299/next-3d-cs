'use client';

import { useLayoutEffect } from 'react';
import { Inspect } from '@/modules/Inspect';
import { usePaintStore } from '@/store/paintStore';
import { useSearchParams } from 'next/navigation';

function App() {
  const searchParams = useSearchParams();
  const { getCategories, getPaint } = usePaintStore();

  useLayoutEffect(() => {
    getCategories();
  }, []);

  useLayoutEffect(() => {
    const uuid = searchParams.get('paint');
    if (uuid) {
      getPaint(uuid);
    }
  }, []);

  return (
    <main className="flex-1 flex flex-col">
      <Inspect />
    </main>
  );
}

export default App;
