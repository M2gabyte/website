import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create a search prompt for OpenAI
    const searchPrompt = `Search the web for bedbug reports, complaints, or mentions related to: "${query}"

Search across TripAdvisor, Yelp, Google Reviews, Reddit, bedbug registries, news articles, and hotel review sites.

Provide a clear, easy-to-read summary with these sections (use ## for headings):

## Summary
Brief 2-3 sentence overview of what you found.

## Key Findings
Write short paragraphs covering:
- What reports or mentions were found (with specific dates)
- How severe the incidents were
- Whether this appears to be an ongoing issue or isolated incident

## Recommendation
One paragraph with practical advice for travelers.

FORMATTING RULES:
- Use ## for section headings only
- Write in clear paragraphs (no bullet points)
- Do NOT include URLs in the text
- Keep it concise and readable`;

    // Call OpenAI with web search enabled
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a bedbug report search assistant. Write clear summaries using ONLY ## headings and regular paragraphs. Do not use bullet points, numbered lists, or bold text within paragraphs. Keep it simple and readable.'
        },
        {
          role: 'user',
          content: searchPrompt
        }
      ],
      web_search_options: {},
    } as any);

    const rawSummary = completion.choices[0]?.message?.content || 'No results found';

    // Extract URLs from the response
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const sources = rawSummary.match(urlRegex) || [];

    // Clean up the summary by removing URLs and parenthetical source citations
    let cleanSummary = rawSummary;

    // Remove parenthetical citations like ([source.com](url))
    cleanSummary = cleanSummary.replace(/\(\[?[^\]]*\]?\([^)]+\)\)/g, '');

    // Remove inline URLs
    cleanSummary = cleanSummary.replace(/https?:\/\/[^\s\)]+/g, '');

    // Clean up extra parentheses
    cleanSummary = cleanSummary.replace(/\(\s*\)/g, '');

    // Clean up multiple spaces on the same line (but preserve newlines for markdown)
    cleanSummary = cleanSummary.replace(/ +/g, ' ');
    cleanSummary = cleanSummary.trim();

    return NextResponse.json({
      summary: cleanSummary,
      sources: [...new Set(sources)], // Remove duplicates
    });

  } catch (error: any) {
    console.error('Search error:', error);
    const errorMessage = error?.message || error?.error?.message || 'Failed to perform search';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
