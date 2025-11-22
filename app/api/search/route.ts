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
    const searchPrompt = `Search the web for bedbug reports for: "${query}"

Find information from TripAdvisor, Yelp, Google Reviews, Reddit, and bedbug registries.

Provide a response in this EXACT format with these three sections:

SUMMARY: Write 2-3 sentences about what you found overall.

FINDINGS: Write 3-4 sentences covering: specific incidents with dates, how severe they were, and whether this seems ongoing or isolated.

ADVICE: Write 2-3 sentences with practical recommendations for travelers.

CRITICAL: Use ONLY plain text paragraphs separated by blank lines. NO markdown, NO bullets, NO special formatting, NO URLs in the text.`;

    // Call OpenAI with web search enabled
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      messages: [
        {
          role: 'system',
          content: 'You provide plain text summaries. Write in simple paragraphs only. Never use markdown, bullets, bold, or special characters. Just plain sentences.'
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
