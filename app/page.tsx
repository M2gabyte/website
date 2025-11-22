'use client';

import { useState } from 'react';

interface SearchResult {
  summary: string;
  sources: string[];
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🐛 BedBug Finder
          </h1>
          <p className="text-xl text-gray-600">
            Search for bedbug reports across the web
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Enter a hotel name, address, or location to find bedbug mentions
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError(null); // Clear error when typing
              }}
              placeholder="e.g., Hilton New York Times Square"
              className="flex-1 px-6 py-4 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all bg-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-xl hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching the web for bedbug reports...</p>
            <p className="text-sm text-gray-500 mt-2">This may take 10-15 seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <p className="text-red-800 font-semibold">❌ {error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
              🔍 Search Results
            </h2>

            <div className="mb-8">
              <div className="text-gray-900 leading-relaxed space-y-4">
                {result.summary.split(/\*\*\d+\.\s+/).filter(Boolean).map((section, idx) => {
                  // Extract section title and content
                  const titleMatch = section.match(/^([^:]+):\*\*/);
                  const title = titleMatch ? titleMatch[1].trim() : null;
                  const content = title
                    ? section.replace(/^([^:]+):\*\*/, '').trim()
                    : section.trim();

                  return (
                    <div key={idx} className="space-y-2">
                      {title && (
                        <h3 className="font-bold text-lg text-gray-900">
                          {idx + 1}. {title}
                        </h3>
                      )}
                      <p className="text-base text-gray-700 leading-relaxed pl-6">
                        {content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {result.sources && result.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📚 Sources ({result.sources.length})
                </h3>
                <div className="grid gap-3">
                  {result.sources.map((source, index) => (
                    <a
                      key={index}
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 hover:border-orange-300 transition-all group"
                    >
                      <span className="text-orange-600 font-semibold text-sm mt-0.5">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-700 group-hover:text-orange-700 break-all flex-1">
                        {source}
                      </span>
                      <span className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        {!result && !loading && !error && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How it works:
            </h3>
            <ul className="text-blue-800 space-y-2">
              <li>✓ Searches TripAdvisor, Yelp, Google Reviews, and more</li>
              <li>✓ Aggregates bedbug mentions from multiple sources</li>
              <li>✓ Provides AI-powered summary of findings</li>
              <li>✓ Shows source links for verification</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
