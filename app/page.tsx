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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-lg mb-6">
            <span className="text-5xl">🐛</span>
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-4">
            BedBug Finder
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            Know before you go
          </p>
          <p className="text-base text-gray-500 mt-3 max-w-2xl mx-auto">
            Search hotels and accommodations for bedbug reports from TripAdvisor, Yelp, Reddit, and more
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="bg-white rounded-2xl shadow-2xl p-3 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError(null);
                }}
                placeholder="Enter hotel name or address..."
                className="flex-1 px-6 py-5 text-lg text-gray-900 placeholder:text-gray-400 rounded-xl focus:outline-none bg-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg font-bold rounded-xl hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Searching
                  </span>
                ) : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="relative inline-flex mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Searching the web...</h3>
            <p className="text-gray-600 text-lg">Checking TripAdvisor, Yelp, Reddit, and more</p>
            <p className="text-sm text-gray-500 mt-3">This may take 10-15 seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <span className="text-5xl">❌</span>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Search Failed</h3>
                <p className="text-red-50 text-lg">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Status Alert */}
            {(() => {
              const hasBedbugs = result.summary.toLowerCase().includes('bedbug report') ||
                                 result.summary.toLowerCase().includes('bedbug') ||
                                 result.summary.match(/documented.*bedbug/i);
              const isClean = result.summary.toLowerCase().includes('no bedbug') ||
                             result.summary.toLowerCase().includes('no reports') ||
                             result.summary.toLowerCase().includes('no subsequent reports');

              if (hasBedbugs) {
                return (
                  <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black opacity-5"></div>
                    <div className="relative flex items-center gap-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex-shrink-0">
                        <span className="text-6xl drop-shadow-lg">⚠️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-black text-white mb-2 drop-shadow-md">
                          Bedbug Reports Found
                        </h3>
                        <p className="text-xl text-red-50 font-medium">
                          This location has documented bedbug mentions. Review the details carefully below.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              } else if (isClean) {
                return (
                  <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black opacity-5"></div>
                    <div className="relative flex items-center gap-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex-shrink-0">
                        <span className="text-6xl drop-shadow-lg">✅</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-black text-white mb-2 drop-shadow-md">
                          All Clear!
                        </h3>
                        <p className="text-xl text-green-50 font-medium">
                          No recent bedbug reports found for this location.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Detailed Results */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </span>
                Detailed Summary
              </h2>

              <div className="space-y-6">
                {(() => {
                  // Parse sections from the response
                  const sections = {
                    summary: '',
                    findings: '',
                    advice: ''
                  };

                  const summaryMatch = result.summary.match(/SUMMARY:(.+?)(?=FINDINGS:|$)/s);
                  const findingsMatch = result.summary.match(/FINDINGS:(.+?)(?=ADVICE:|$)/s);
                  const adviceMatch = result.summary.match(/ADVICE:(.+?)$/s);

                  if (summaryMatch) sections.summary = summaryMatch[1].trim();
                  if (findingsMatch) sections.findings = findingsMatch[1].trim();
                  if (adviceMatch) sections.advice = adviceMatch[1].trim();

                  return (
                    <>
                      {sections.summary && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500">
                          <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <span>📝</span> Summary
                          </h3>
                          <p className="text-base text-gray-800 leading-relaxed">{sections.summary}</p>
                        </div>
                      )}

                      {sections.findings && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-500">
                          <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                            <span>🔍</span> Key Findings
                          </h3>
                          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{sections.findings}</p>
                        </div>
                      )}

                      {sections.advice && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500">
                          <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                            <span>💡</span> Recommendation
                          </h3>
                          <p className="text-base text-gray-800 leading-relaxed">{sections.advice}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="mt-10 pt-8 border-t-2 border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-xl">📚</span>
                    </span>
                    Sources <span className="text-lg font-normal text-gray-500">({result.sources.length})</span>
                  </h3>
                  <div className="grid gap-4">
                    {result.sources.map((source, index) => {
                      // Extract domain for better display
                      const domain = source.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)?.[1] || source;

                      return (
                        <a
                          key={index}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-4 p-5 bg-gradient-to-br from-white to-gray-50 hover:from-orange-50 hover:to-red-50 rounded-2xl border-2 border-gray-200 hover:border-orange-400 transition-all shadow-sm hover:shadow-lg"
                        >
                          <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors mb-1">
                              {domain}
                            </div>
                            <div className="text-xs text-gray-500 break-all font-mono">
                              {source}
                            </div>
                          </div>
                          <svg className="flex-shrink-0 w-5 h-5 text-orange-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        {!result && !loading && !error && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Comprehensive Search
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Searches across TripAdvisor, Yelp, Google Reviews, Reddit, and bedbug registries
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI-Powered
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI analyzes and summarizes findings from multiple sources in seconds
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Source Verified
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All results include clickable source links for you to verify and read more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
