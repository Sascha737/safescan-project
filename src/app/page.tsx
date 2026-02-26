'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Main scan page
export default function Home() {
  const { data: session } = useSession(); // used for header and student features
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  type SummaryItem = { icon: string; text: string; level: 'pass' | 'warning' | 'issue' };
  const [summary, setSummary] = useState<SummaryItem[]>([]);
    type ExplanationMap = { [key: string]: string };
    const explanations: ExplanationMap = {
      'Uses HTTPS': 'HTTPS encrypts data between your browser and the website, protecting your information from attackers.',
      'Missing HTTPS (use https://)': 'This site does not use HTTPS. Information you send or receive could be intercepted by others.',
      'CSP header present': 'Content Security Policy (CSP) helps prevent malicious scripts from running on the site.',
      'CSP header missing': 'No Content Security Policy (CSP) header found. This makes it easier for attackers to inject malicious scripts.',
      'HSTS header present': 'HTTP Strict Transport Security (HSTS) forces browsers to use secure connections only.',
      'HSTS header missing': 'No HSTS header found. Browsers may connect over insecure HTTP, which is less safe.',
      'X-Frame-Options header present': 'X-Frame-Options protects your site from clickjacking attacks by preventing it from being embedded in other sites.',
      'X-Frame-Options header missing': 'No X-Frame-Options header found. The site could be embedded elsewhere, making clickjacking attacks possible.',
    };
  const [showDetails, setShowDetails] = useState(false);

  // Handle scan form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Scan failed');
      } else {
        setResult(data);
        // Build summary for UI
        const s: SummaryItem[] = [];
        if (data.https) {
          s.push({ icon: '✅', text: 'Uses HTTPS', level: 'pass' });
        } else {
          s.push({ icon: '❌', text: 'Missing HTTPS (use https://)', level: 'issue' });
        }
        const headers = data.headers || {};
        const headerChecks: Array<[string, string, string]> = [
          ['content-security-policy', 'CSP', '🛡'],
          ['strict-transport-security', 'HSTS', '🔒'],
          ['x-frame-options', 'X-Frame-Options', '🖼️'],
        ];
        headerChecks.forEach(([key, name, icon]) => {
          if (headers[key]) {
            s.push({ icon, text: `${name} header present`, level: 'pass' });
          } else {
            s.push({ icon, text: `${name} header missing`, level: 'warning' });
          }
        });
        setSummary(s);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
    setLoading(false);
  };

  // Scanning is open to everyone; optionally encourage login for extra features

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Enter a website URL to scan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Scan
        </button>
      </form>

      {/* high-level result indicators */}
      {summary.length > 0 && (
        <div className="mt-4 flex space-x-4 text-sm bg-gray-100 p-2 rounded">
          <span className="flex items-center text-green-800">
            🟢 {summary.filter((s) => s.level === 'pass').length} pass
          </span>
          <span className="flex items-center text-yellow-800">
            🟡 {summary.filter((s) => s.level === 'warning').length} warning
          </span>
          <span className="flex items-center text-red-800">
            🔴 {summary.filter((s) => s.level === 'issue').length} issue
          </span>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center space-x-2 text-blue-600">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Scanning…</span>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-white border rounded">
          <strong className="text-black text-xl font-bold">Scan Result</strong>
          {summary.length > 0 && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
              <h3 className="text-lg font-semibold mb-2 text-black">Quick Summary</h3>
              <ul className="space-y-1">
                {summary.map((item, idx) => {
                  const colorClass =
                    item.level === 'pass'
                      ? 'text-green-800'
                      : item.level === 'warning'
                      ? 'text-yellow-800'
                      : 'text-red-800';
                  return (
                    <li key={idx} className={`flex flex-col text-sm ${colorClass}`}>
                      <div className="flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                      {explanations[item.text] && (
                        <div className="ml-6 text-xs text-gray-700 italic">{explanations[item.text]}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="mt-4 text-sm">
            <button
              onClick={() => setShowDetails((d) => !d)}
              className="mb-2 text-blue-600 underline"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>

            {showDetails && (
              <div className="space-y-2 text-black">
                <p>
                  <strong>HTTPS:</strong>{' '}
                  {result.https ? (
                    <span className="text-green-800">✅ using HTTPS</span>
                  ) : (
                    <span className="text-red-800">⚠️ not HTTPS</span>
                  )}
                </p>
                <p className="mt-2 font-semibold">Headers:</p>
                <div className="mt-1 space-y-1">
                  {Object.entries(result.headers || {}).map(([k, v]) => (
                    <div key={k} className="flex flex-wrap items-start">
                      <code className="font-mono text-xs bg-gray-100 px-1 rounded mr-2">
                        {k}
                      </code>
                      <span className="text-xs break-words">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
