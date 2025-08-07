'use server';

import yahooFinance from 'yahoo-finance2';

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

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const quote = await yahooFinance.quote(symbol);
    
    return {
      symbol: quote.symbol,
      name: quote.longName || quote.shortName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercentage: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
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
    const result = await yahooFinance.historical(symbol, {
      period1: getStartDate(period),
      period2: new Date(),
      interval: '1d',
    });

    return result.map(item => ({
      date: new Date(item.date),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
}

export async function searchStocks(query: string) {
  try {
    const results = await yahooFinance.search(query);
    return results.quotes.filter(quote => 
      quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF'
    );
  } catch (error) {
    console.error(`Error searching stocks with query ${query}:`, error);
    throw error;
  }
}

export async function getTrendingStocks(): Promise<StockQuote[]> {
  // You can customize this list of major stocks
  const trendingSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'];
  
  try {
    const quotes = await Promise.all(
      trendingSymbols.map(symbol => getStockQuote(symbol))
    );
    return quotes;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
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
