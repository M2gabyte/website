'use client';

import { useState, useRef, useEffect } from 'react';

interface Incident {
  date: string;
  source: string;
  snippet: string;
  timestamp?: number;
}

interface SearchResult {
  summary: string;
  sources: string[];
  incidents?: Incident[];
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden" style={{ fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif" }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-3 mb-3">
            <svg className="w-8 h-8 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            <h1 className="text-3xl font-bold text-slate-800 animate-slideDown">
              BedBug Finder
            </h1>
          </div>
          <p className="text-lg text-slate-600 font-medium animate-slideDown" style={{ animationDelay: '0.1s' }}>
            Know before you go
          </p>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl mx-auto animate-slideDown" style={{ animationDelay: '0.2s' }}>
            Search hotels and accommodations for bedbug reports from TripAdvisor, Yelp, Reddit, and more
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12 animate-slideUp">
          <div className="bg-white rounded-full shadow-xl p-2 border border-slate-200 transition-all duration-300 hover:shadow-2xl max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter hotel name or address..."
                  className="flex-1 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-8 py-4 bg-slate-800 text-white text-base font-semibold rounded-full hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-slate-200">
            <div className="relative inline-flex mb-5">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-slate-200 border-t-slate-800"></div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Searching the web...</h3>
            <p className="text-sm text-slate-600">Checking TripAdvisor, Yelp, Reddit, and more</p>
            <p className="text-xs text-slate-500 mt-2">This may take 10-15 seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white border-2 border-red-200 bg-red-50 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-base font-semibold text-red-900 mb-1">Search Failed</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div ref={resultsRef} className="space-y-6 animate-fadeInUp">
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
                  <div className="bg-white border-2 border-red-200 bg-red-50 rounded-lg p-6 shadow-sm animate-slideDown">
                    <div className="flex items-start gap-4">
                      <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-900 mb-1">
                          Bedbug Reports Found
                        </h3>
                        <p className="text-sm text-red-800">
                          This location has documented bedbug mentions. Review the details carefully below.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              } else if (isClean) {
                return (
                  <div className="bg-white border-2 border-green-200 bg-green-50 rounded-lg p-6 shadow-sm animate-slideDown">
                    <div className="flex items-start gap-4">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900 mb-1">
                          All Clear!
                        </h3>
                        <p className="text-sm text-green-800">
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
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Detailed Summary
              </h2>

              {/* Forensic Timeline */}
              {result.incidents && result.incidents.length > 0 && (
                <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">Forensic Timeline</h3>

                  <div className="relative pt-8 pb-4">
                    {/* Timeline container */}
                    <div className="relative">
                      {/* Base timeline line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 -translate-y-1/2"></div>

                      {/* Year markers */}
                      <div className="relative flex justify-between mb-12">
                        {(() => {
                          const currentYear = new Date().getFullYear();
                          const years = Array.from({ length: 7 }, (_, i) => currentYear - 6 + i);

                          return years.map((year, index) => (
                            <div key={year} className="flex flex-col items-center" style={{ width: `${100 / 7}%` }}>
                              <div className="w-2 h-2 bg-slate-400 rounded-full mb-2"></div>
                              <span className="text-xs text-slate-500 font-medium">{year}</span>
                            </div>
                          ));
                        })()}
                      </div>

                      {/* Incidents plotted on timeline */}
                      <div className="absolute top-0 left-0 right-0" style={{ height: '48px' }}>
                        {(() => {
                          const currentYear = new Date().getFullYear();
                          const startDate = new Date(currentYear - 6, 0, 1).getTime();
                          const endDate = new Date(currentYear, 11, 31).getTime();
                          const totalDuration = endDate - startDate;

                          // Group incidents by month to detect clusters
                          const incidentsByMonth = new Map<string, Incident[]>();
                          result.incidents.forEach(incident => {
                            if (incident.timestamp) {
                              const date = new Date(incident.timestamp);
                              const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
                              if (!incidentsByMonth.has(monthKey)) {
                                incidentsByMonth.set(monthKey, []);
                              }
                              incidentsByMonth.get(monthKey)!.push(incident);
                            }
                          });

                          // Render clusters and individual incidents
                          const renderedMonths = new Set<string>();

                          return result.incidents.map((incident, index) => {
                            if (!incident.timestamp) return null;

                            const date = new Date(incident.timestamp);
                            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

                            // Skip if we already rendered this month's cluster
                            if (renderedMonths.has(monthKey)) return null;
                            renderedMonths.add(monthKey);

                            const incidentsInMonth = incidentsByMonth.get(monthKey) || [];
                            const isCluster = incidentsInMonth.length > 1;

                            // Calculate position (0-100%)
                            const position = ((incident.timestamp - startDate) / totalDuration) * 100;

                            return (
                              <div
                                key={`${monthKey}-${index}`}
                                className="absolute group"
                                style={{ left: `${Math.max(2, Math.min(98, position))}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                              >
                                {/* Incident marker */}
                                {isCluster ? (
                                  <div className="relative">
                                    <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs flex items-center justify-center rounded-full font-bold">
                                      {incidentsInMonth.length}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-md"></div>
                                )}

                                {/* Tooltip on hover */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                  <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl whitespace-nowrap max-w-xs" style={{ minWidth: '250px' }}>
                                    {isCluster ? (
                                      <div className="space-y-2">
                                        <div className="font-bold text-red-300 border-b border-slate-700 pb-1 mb-2">
                                          {incidentsInMonth.length} reports in {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                        {incidentsInMonth.map((inc, i) => (
                                          <div key={i} className="border-l-2 border-red-400 pl-2">
                                            <div className="font-semibold">{inc.date}</div>
                                            <div className="text-slate-400 text-xs">{inc.source}</div>
                                            <div className="text-slate-300 mt-1 whitespace-normal">{inc.snippet}</div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="font-semibold">{incident.date}</div>
                                        <div className="text-slate-400 text-xs mb-1">{incident.source}</div>
                                        <div className="text-slate-300 whitespace-normal">{incident.snippet}</div>
                                      </div>
                                    )}
                                    {/* Tooltip arrow */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-16 pt-4 border-t border-slate-200 flex items-center justify-center gap-6 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Single Report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2+</div>
                        <span>Outbreak (Multiple Reports)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-slate-300"></div>
                        <span>No Data</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all duration-300 hover:shadow-md animate-fadeIn">
                          <h3 className="text-base font-semibold text-slate-900 mb-2">
                            Summary
                          </h3>
                          <p className="text-sm text-slate-700 leading-relaxed">{sections.summary}</p>
                        </div>
                      )}

                      {sections.findings && (
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all duration-300 hover:shadow-md animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                          <h3 className="text-base font-semibold text-slate-900 mb-2">
                            Key Findings
                          </h3>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{sections.findings}</p>
                        </div>
                      )}

                      {sections.advice && (
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all duration-300 hover:shadow-md animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                          <h3 className="text-base font-semibold text-slate-900 mb-2">
                            Recommendation
                          </h3>
                          <p className="text-sm text-slate-700 leading-relaxed">{sections.advice}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Sources <span className="text-sm font-normal text-slate-500">({result.sources.length})</span>
                  </h3>
                  <div className="grid gap-4">
                    {result.sources.map((source, index) => {
                      // Extract domain for better display
                      const domain = source.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)?.[1] || source;

                      // Get favicon
                      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

                      return (
                        <a
                          key={index}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 p-4 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 animate-fadeIn"
                          style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                            <img
                              src={faviconUrl}
                              alt=""
                              className="w-4 h-4"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<span class="text-xs text-slate-600">${index + 1}</span>`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 mb-0.5">
                              {domain}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {source}
                            </div>
                          </div>
                          <svg className="flex-shrink-0 w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all duration-200 animate-fadeIn">
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Comprehensive Search
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Searches across TripAdvisor, Yelp, Google Reviews, Reddit, and bedbug registries
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                AI-Powered
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Advanced AI analyzes and summarizes findings from multiple sources in seconds
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Source Verified
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All results include clickable source links for you to verify and read more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
