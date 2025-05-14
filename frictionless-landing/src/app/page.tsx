// /src/app/page.tsx

'use client';
import Head from 'next/head';
import InputHandler from '../components/InputHandler';
import { useState } from 'react';

export default function Page() {
  const [submittedHash, setSubmittedHash] = useState<string | null>(null);
  const [submittedChain, setSubmittedChain] = useState<string | null>(null);

  function handleValidSubmit(chain: string, hash: string) {
    console.log('Chain:', chain);
    console.log('Hash:', hash);
    setSubmittedHash(hash);
    setSubmittedChain(chain);
  }

  return (
    <>
      <Head>
        <title>Frictionless | Crypto Receipts Made Simple</title>
        <meta
          name="description"
          content="From hash to human in seconds. Generate trustable crypto receipts."
        />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
  <InputHandler onValidSubmit={handleValidSubmit} />

  {submittedHash && submittedChain && (
    <div className="text-sm text-gray-400">
      ✅ Submitted {submittedChain} hash: <br />
      <code className="break-all">{submittedHash}</code>
    </div>
  )}
</main>
    </>
  );
}