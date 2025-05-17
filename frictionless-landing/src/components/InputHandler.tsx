// File: /components/InputHandler.tsx

import { useState } from "react";

export default function InputHandler({ onValidSubmit }: { onValidSubmit: (chain: string, txHash: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function normalizeInput(raw: string): string {
    const trimmed = raw.trim();
    if (trimmed.includes("etherscan.io/tx/")) {
      return trimmed.split("etherscan.io/tx/")[1];
    }
    if (trimmed.includes("solscan.io/tx/")) {
      return trimmed.split("solscan.io/tx/")[1];
    }
    return trimmed;
  }

  function detectChain(hash: string): string | null {
    if (hash.startsWith("0x") && hash.length === 66) return "ethereum";
    if (!hash.startsWith("0x") && hash.length >= 60) return "solana";
    return null;
  }

  function isValidHash(hash: string, chain: string | null): boolean {
    if (!hash) return false;
    if (chain === "ethereum") return /^0x([A-Fa-f0-9]{64})$/.test(hash);
    if (chain === "solana") return /^[1-9A-HJ-NP-Za-km-z]{85,90}$/.test(hash);
    return false;
    
  }

async function checkTxExists(chain: string, hash: string): Promise<boolean> {
  try {
    if (chain === "ethereum") {
      const response = await fetch(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      return data.result != null;
    }

    if (chain === "solana") {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HELIUS_RPC}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTransaction",
            params: [
  hash,
  {
    encoding: "jsonParsed",
    maxSupportedTransactionVersion: 1
  }
],
          }),
        }
      );

      const data = await response.json();
      console.log("Helius getTransaction response", data);

    // Ensure `result` is present and not null
  return !!data.result && typeof data.result === "object";
}

    return false;
  } catch (err) {
    console.error("Error checking transaction:", err);
    return false;
  }
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const normalized = normalizeInput(input);
    const chain = detectChain(normalized);

  if (!chain || !isValidHash(normalized, chain)) {
  setError("Invalid transaction hash or unsupported format.");
  setLoading(false);
  return;
}

// Check actual existence via Etherscan/Solscan
const exists = await checkTxExists(chain, normalized);
if (!exists) {
  setError("Transaction not found on-chain.");
  setLoading(false);
  return;
}

    setError("");
    onValidSubmit(chain, normalized);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xl">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter URL / Txn Hash i.e. etherscan.io/tx/0x..."
        className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-400"
      />
      <button
  type="submit"
  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
  disabled={!input.trim() || loading}
>
  {loading ? 'Checking...' : 'Generate'}
</button>

{loading && (
  <p className="text-sm text-gray-400 mt-2">Checking transaction onchain...</p>
)}

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </form>
  );
}