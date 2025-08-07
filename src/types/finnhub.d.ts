declare module 'finnhub' {
  export interface QuoteResponse {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
  }

  export interface CandleResponse {
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    s: string;
    t: number[];
    v: number[];
  }

  export interface CompanyProfileResponse {
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

  export interface SearchResponse {
    result: Array<{
      symbol: string;
      description: string;
      primaryExchange: string;
      type: string;
    }>;
  }

  export interface NewsResponse {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
  }

  export class DefaultApi {
    constructor(config: { apiKey: string });
    
    quote(symbol: string): Promise<QuoteResponse>;
    stockCandles(symbol: string, resolution: string, from: number, to: number): Promise<CandleResponse>;
    companyProfile2(params: { symbol: string }): Promise<CompanyProfileResponse>;
    symbolSearch(query: string): Promise<SearchResponse>;
    companyNews(symbol: string, from: string, to: string): Promise<NewsResponse[]>;
  }

  const finnhub: {
    DefaultApi: typeof DefaultApi;
  };

  export default finnhub;
} 