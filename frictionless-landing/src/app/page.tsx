export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f9f9f9] text-gray-900 p-6">
      <div className="max-w-xl text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-white shadow flex items-center justify-center">
            <span className="text-2xl">🧾</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Crypto receipts made simple.</h1>
          <p className="text-lg text-gray-600">From hash to human in seconds.</p>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Coming soon — follow <a href="https://x.com/UseFrictionless" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@UseFrictionless</a>
        </p>
      </div>
    </main>
  );
}