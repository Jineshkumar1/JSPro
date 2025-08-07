'use server';

import yahooFinance from 'yahoo-finance2';

// Configure yahoo-finance2
yahooFinance.setGlobalConfig({
  queue: {
    concurrency: 5,
    timeout: 30000,
  },
});

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercentage: number;
  volume: number;
  marketCap: number;
}

export interface HistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange: string;
  typeDisp: string;
  quoteType: string;
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    // Using the quote method with specific fields
    const quote = await yahooFinance.quote(symbol, {
      fields: [
        'symbol',
        'longName',
        'shortName',
        'regularMarketPrice',
        'regularMarketChange',
        'regularMarketChangePercent',
        'regularMarketVolume',
        'marketCap'
      ]
    });

    if (!quote) {
      throw new Error(`No data received for ${symbol}`);
    }
    
    return {
      symbol: quote.symbol || symbol,
      name: quote.longName || quote.shortName || symbol,
      price: Number(quote.regularMarketPrice) || 0,
      change: Number(quote.regularMarketChange) || 0,
      changePercentage: Number(quote.regularMarketChangePercent) || 0,
      volume: Number(quote.regularMarketVolume) || 0,
      marketCap: Number(quote.marketCap) || 0,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
}

export async function getHistoricalData(
  symbol: string,
  period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' = '1mo'
): Promise<HistoricalData[]> {
  try {
    // Using chart instead of historical as recommended
    const result = await yahooFinance.chart(symbol, {
      period1: getStartDate(period),
      period2: new Date(),
      interval: '1d',
      includePrePost: false,
    });

    if (!result.quotes || result.quotes.length === 0) {
      throw new Error(`No historical data received for ${symbol}`);
    }

    return result.quotes.map(quote => ({
      date: quote.date,
      open: Number(quote.open) || 0,
      high: Number(quote.high) || 0,
      low: Number(quote.low) || 0,
      close: Number(quote.close) || 0,
      volume: Number(quote.volume) || 0,
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
  try {
    const results = await yahooFinance.search(query);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return results.quotes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((quote: any) => 
        quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF'
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((quote: any) => ({
        symbol: quote.symbol || '',
        shortname: quote.shortname,
        longname: quote.longname,
        exchange: quote.exchange || '',
        typeDisp: quote.typeDisp || '',
        quoteType: quote.quoteType || '',
      }));
  } catch (error) {
    console.error(`Error searching stocks with query ${query}:`, error);
    throw error;
  }
}

export async function getTrendingStocks(): Promise<StockQuote[]> {
  // FAANG + Popular tech stocks
  const trendingSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX'];
  
  try {
    const quotes = await Promise.all(
      trendingSymbols.map(async symbol => {
        try {
          return await getStockQuote(symbol);
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          // Return a placeholder if individual stock fetch fails
          return {
            symbol,
            name: symbol,
            price: 0,
            change: 0,
            changePercentage: 0,
            volume: 0,
            marketCap: 0
          };
        }
      })
    );
    
    // Filter out any failed fetches that returned placeholder data
    const validQuotes = quotes.filter(quote => quote.price > 0);
    
    if (validQuotes.length === 0) {
      throw new Error('Failed to fetch any valid stock data');
    }
    
    return validQuotes;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    throw error;
  }
}

export async function getDailyGainers(): Promise<StockQuote[]> {
  // Popular stocks that typically have significant daily movements
  const gainerSymbols = ['NVDA', 'AMD', 'TSLA', 'META', 'NFLX', 'CRM', 'ADBE', 'PYPL'];
  
  try {
    const quotes = await Promise.all(
      gainerSymbols.map(async symbol => {
        try {
          return await getStockQuote(symbol);
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return {
            symbol,
            name: symbol,
            price: 0,
            change: 0,
            changePercentage: 0,
            volume: 0,
            marketCap: 0
          };
        }
      })
    );
    
    const validQuotes = quotes.filter(quote => quote.price > 0);
    
    // Sort by percentage gain (highest first)
    return validQuotes
      .filter(quote => quote.changePercentage > 0)
      .sort((a, b) => b.changePercentage - a.changePercentage)
      .slice(0, 6); // Return top 6 gainers
  } catch (error) {
    console.error('Error fetching daily gainers:', error);
    throw error;
  }
}

export async function getDailyLosers(): Promise<StockQuote[]> {
  // Popular stocks that typically have significant daily movements
  const loserSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX'];
  
  try {
    const quotes = await Promise.all(
      loserSymbols.map(async symbol => {
        try {
          return await getStockQuote(symbol);
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return {
            symbol,
            name: symbol,
            price: 0,
            change: 0,
            changePercentage: 0,
            volume: 0,
            marketCap: 0
          };
        }
      })
    );
    
    const validQuotes = quotes.filter(quote => quote.price > 0);
    
    // Sort by percentage loss (lowest first)
    return validQuotes
      .filter(quote => quote.changePercentage < 0)
      .sort((a, b) => a.changePercentage - b.changePercentage)
      .slice(0, 6); // Return top 6 losers
  } catch (error) {
    console.error('Error fetching daily losers:', error);
    throw error;
  }
}

// Helper function to calculate start date based on period
function getStartDate(period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y'): Date {
  const now = new Date();
  switch (period) {
    case '1d':
      return new Date(now.setDate(now.getDate() - 1));
    case '5d':
      return new Date(now.setDate(now.getDate() - 5));
    case '1mo':
      return new Date(now.setMonth(now.getMonth() - 1));
    case '3mo':
      return new Date(now.setMonth(now.getMonth() - 3));
    case '6mo':
      return new Date(now.setMonth(now.getMonth() - 6));
    case '1y':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setMonth(now.getMonth() - 1));
  }
}
