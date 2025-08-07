export interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
  v: number; // Volume
}

export interface FinnhubCandle {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string; // Status
  t: number[]; // Timestamps
  v: number[]; // Volume
}

export interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface FinnhubSearchResult {
  symbol: string;
  description: string;
  primaryExchange: string;
  type: string;
}

export async function getStockQuote(symbol: string): Promise<FinnhubQuote | null> {
  try {
    const response = await fetch(`/api/finnhub?action=quote&symbol=${symbol}`);
    if (!response.ok) throw new Error('Failed to fetch quote');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Finnhub quote for ${symbol}:`, error);
    return null;
  }
}

export async function getStockCandles(
  symbol: string,
  resolution: '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M' = 'D',
  from: number,
  to: number
): Promise<FinnhubCandle | null> {
  try {
    const response = await fetch(`/api/finnhub?action=candles&symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`);
    if (!response.ok) throw new Error('Failed to fetch candles');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Finnhub candles for ${symbol}:`, error);
    return null;
  }
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  try {
    const response = await fetch(`/api/finnhub?action=profile&symbol=${symbol}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching company profile for ${symbol}:`, error);
    return null;
  }
}

export async function searchStocks(query: string): Promise<FinnhubSearchResult[]> {
  try {
    const response = await fetch(`/api/finnhub?action=search&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search stocks');
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error(`Error searching stocks with Finnhub:`, error);
    return [];
  }
}

export async function getMarketNews(): Promise<unknown[]> {
  try {
    const response = await fetch(`/api/finnhub?action=news`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching market news:`, error);
    return [];
  }
}

// Helper function to convert timestamp to date
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

// Helper function to get date range for charts
export function getDateRange(days: number): { from: number; to: number } {
  const to = Math.floor(Date.now() / 1000);
  const from = to - (days * 24 * 60 * 60);
  return { from, to };
} 