import { NextRequest, NextResponse } from 'next/server';
import finnhub from 'finnhub';

const api_key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'd29vq3pr01qvhsfveaj0d29vq3pr01qvhsfveajg';
const finnhubClient = new finnhub.DefaultApi({ apiKey: api_key });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const symbol = searchParams.get('symbol');
  const query = searchParams.get('query');
  const resolution = searchParams.get('resolution') || 'D';
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  try {
    switch (action) {
      case 'quote':
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }
        const quote = await finnhubClient.quote(symbol);
        
        // Check if quote is valid
        if (!quote || typeof quote !== 'object') {
          return NextResponse.json({ error: 'Invalid quote data' }, { status: 500 });
        }
        
        // Convert to plain object to ensure JSON serialization
        const quoteData = {
          c: quote.c || 0,
          d: quote.d || 0,
          dp: quote.dp || 0,
          h: quote.h || 0,
          l: quote.l || 0,
          o: quote.o || 0,
          pc: quote.pc || 0,
          t: quote.t || 0,
          v: quote.v || 0
        };
        return NextResponse.json(quoteData);

      case 'candles':
        if (!symbol || !from || !to) {
          return NextResponse.json({ error: 'Symbol, from, and to are required' }, { status: 400 });
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const candles = await finnhubClient.stockCandles(symbol, resolution as any, parseInt(from), parseInt(to));
        
        // Check if candles is valid
        if (!candles || typeof candles !== 'object') {
          return NextResponse.json({ error: 'Invalid candles data' }, { status: 500 });
        }
        
        // Convert to plain object
        const candlesData = {
          c: candles.c || [],
          h: candles.h || [],
          l: candles.l || [],
          o: candles.o || [],
          s: candles.s || 'no_data',
          t: candles.t || [],
          v: candles.v || []
        };
        return NextResponse.json(candlesData);

      case 'profile':
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }
        const profile = await finnhubClient.companyProfile2({ symbol });
        
        // Check if profile is valid
        if (!profile || typeof profile !== 'object') {
          return NextResponse.json({ error: 'Invalid profile data' }, { status: 500 });
        }
        
        // Convert to plain object
        const profileData = {
          country: profile.country || '',
          currency: profile.currency || '',
          exchange: profile.exchange || '',
          ipo: profile.ipo || '',
          marketCapitalization: profile.marketCapitalization || 0,
          name: profile.name || '',
          phone: profile.phone || '',
          shareOutstanding: profile.shareOutstanding || 0,
          ticker: profile.ticker || '',
          weburl: profile.weburl || '',
          logo: profile.logo || '',
          finnhubIndustry: profile.finnhubIndustry || ''
        };
        return NextResponse.json(profileData);

      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }
        const searchResults = await finnhubClient.symbolSearch(query);
        
        // Check if searchResults is valid
        if (!searchResults || typeof searchResults !== 'object') {
          return NextResponse.json({ error: 'Invalid search results' }, { status: 500 });
        }
        
        // Convert to plain object
        const searchData = {
          result: (searchResults.result || []).map((item: any) => ({
            symbol: item.symbol || '',
            description: item.description || '',
            primaryExchange: item.primaryExchange || '',
            type: item.type || ''
          }))
        };
        return NextResponse.json(searchData);

      case 'news':
        const news = await finnhubClient.companyNews('', '2024-01-01', '2024-12-31');
        
        // Check if news is valid
        if (!news || !Array.isArray(news)) {
          return NextResponse.json({ error: 'Invalid news data' }, { status: 500 });
        }
        
        // Convert to plain objects
        const newsData = (news || []).slice(0, 10).map((item: any) => ({
          category: item.category || '',
          datetime: item.datetime || 0,
          headline: item.headline || '',
          id: item.id || 0,
          image: item.image || '',
          related: item.related || '',
          source: item.source || '',
          summary: item.summary || '',
          url: item.url || ''
        }));
        return NextResponse.json(newsData);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Finnhub API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 