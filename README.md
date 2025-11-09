# 🐛 BedBug Finder

A modern web app that searches for bedbug reports across the internet using AI-powered web search.

## Features

- 🔍 **Comprehensive Search**: Searches TripAdvisor, Yelp, Google Reviews, Reddit, bedbug registries, and more
- 🤖 **AI-Powered**: Uses OpenAI to aggregate and summarize bedbug mentions
- 📱 **Mobile-First**: Beautiful, responsive design that works great on phones
- 🔗 **Source Citations**: All results include source links for verification
- ⚡ **Fast & Modern**: Built with Next.js and React for a smooth experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI API with web search
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## How It Works

1. User enters a hotel name, address, or location
2. App sends query to OpenAI API with search enabled
3. OpenAI searches the web across multiple sources
4. Results are summarized and displayed with source citations
5. Users can click through to verify sources

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Connect to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy!

## Converting to iOS App

This app is built with React and designed to be easily converted to a native iOS app:

1. **Use React Native**: ~70% of the code can be reused
2. **Component Structure**: Already organized for mobile conversion
3. **API Integration**: Backend logic stays the same
4. **UI Patterns**: Mobile-first design translates directly

## Cost Estimates

- Each search costs approximately $0.01-0.10 depending on query complexity
- Consider implementing caching for frequently searched locations
- Monitor usage via OpenAI dashboard

## Future Enhancements

- [ ] Map view of bedbug reports in an area
- [ ] Save favorite locations
- [ ] Email alerts for new reports
- [ ] User-submitted reports
- [ ] Historical trend analysis
- [ ] Cache popular searches to reduce API costs

## License

MIT
