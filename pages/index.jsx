import dynamic from 'next/dynamic';
import React from 'react';

// dynamic import do Builder, SSR desabilitado
const Builder = dynamic(() => import('../components/Builder'), { ssr: false });

export default function HomePage() {
  return <Builder />;
}
