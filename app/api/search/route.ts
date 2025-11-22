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

Please search across multiple sources including:
- TripAdvisor reviews
- Yelp reviews
- Google reviews
- Reddit discussions
- Bedbug registry websites
- News articles
- Hotel review sites

Provide a comprehensive summary that includes:
1. Whether there are any bedbug reports or mentions
2. How recent the reports are
3. Severity and frequency of reports
4. Any patterns or trends
5. Overall assessment

Format the response clearly and cite your sources.`;

    // Call OpenAI with web search enabled
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that searches the web for bedbug reports and provides accurate, well-sourced summaries. Always cite your sources with URLs.'
        },
        {
          role: 'user',
          content: searchPrompt
        }
      ],
      web_search_options: {},
    } as any);

    const summary = completion.choices[0]?.message?.content || 'No results found';

    // Extract URLs from the response (basic extraction)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const sources = summary.match(urlRegex) || [];

    return NextResponse.json({
      summary,
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
