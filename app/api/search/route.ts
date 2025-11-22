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

Please search across multiple sources including TripAdvisor, Yelp, Google Reviews, Reddit, bedbug registries, news articles, and hotel review sites.

IMPORTANT: Format your response using clean, simple markdown:
- Use ## for main section headings (like "## Bedbug Reports Found" or "## No Reports Found")
- Use regular paragraphs for explanations
- Use bullet points (-) for lists
- Keep formatting simple and readable

Structure your response with these sections:
## Summary
A brief overview of what you found (2-3 sentences)

## Details
- Specific reports or mentions found
- Dates of reports
- Severity of incidents
- Patterns or trends

## Recommendation
What travelers should know

Do NOT include URLs in the main text - they will be extracted separately.`;

    // Call OpenAI with web search enabled
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-search-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a bedbug report search assistant. Provide clear, well-formatted markdown summaries. Use ## for headings, regular paragraphs, and bullet points. Keep formatting clean and simple.'
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

    // Clean up extra parentheses and whitespace
    cleanSummary = cleanSummary.replace(/\(\s*\)/g, '');
    cleanSummary = cleanSummary.replace(/\s+/g, ' ');
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
