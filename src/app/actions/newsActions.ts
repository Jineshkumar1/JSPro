"use server";

import { JSDOM } from 'jsdom';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
  category: string;
}

export async function getYahooFinanceNews(category: string = 'general', limit: number = 20): Promise<NewsArticle[]> {
  try {
    // Yahoo Finance news URLs for different categories
    const newsUrls = {
      general: 'https://finance.yahoo.com/news/',
      technology: 'https://finance.yahoo.com/news/technology/',
      markets: 'https://finance.yahoo.com/news/markets/',
      economy: 'https://finance.yahoo.com/news/economy/',
      crypto: 'https://finance.yahoo.com/news/crypto/',
      earnings: 'https://finance.yahoo.com/news/earnings/'
    };

    const url = newsUrls[category as keyof typeof newsUrls] || newsUrls.general;
    
    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const articles: NewsArticle[] = [];

    // Extract news articles from the page
    const articleElements = document.querySelectorAll('h3, h4, .js-content-viewer, .Ov(h)');
    
    articleElements.forEach((element, index) => {
      if (index >= limit) return;

      const titleElement = element.querySelector('a') || element;
      const title = titleElement?.textContent?.trim();
      const url = titleElement?.getAttribute('href');
      
      if (title && url && title.length > 10) {
        const fullUrl = url.startsWith('http') ? url : `https://finance.yahoo.com${url}`;
        
        articles.push({
          id: `news-${index}`,
          title,
          summary: title, // For now, using title as summary
          url: fullUrl,
          publishedAt: new Date().toISOString(), // Yahoo doesn't always show exact time
          source: 'Yahoo Finance',
          category
        });
      }
    });

    return articles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching Yahoo Finance news:', error);
    
    // Return fallback news data
    return getFallbackNews(category, limit);
  }
}

function getFallbackNews(category: string, limit: number): NewsArticle[] {
  const fallbackNews = {
    general: [
      {
        id: 'fallback-1',
        title: 'Market Rally Continues as Tech Stocks Lead Gains',
        summary: 'Major indices hit new highs as technology companies report strong earnings.',
        url: '#',
        publishedAt: new Date().toISOString(),
        source: 'JTradePro News',
        category: 'general'
      },
      {
        id: 'fallback-2',
        title: 'Federal Reserve Signals Potential Rate Changes',
        summary: 'Central bank officials hint at possible adjustments to monetary policy.',
        url: '#',
        publishedAt: new Date().toISOString(),
        source: 'JTradePro News',
        category: 'general'
      }
    ],
    technology: [
      {
        id: 'tech-1',
        title: 'AI Companies See Record Investment Inflows',
        summary: 'Artificial intelligence startups attract unprecedented funding rounds.',
        url: '#',
        publishedAt: new Date().toISOString(),
        source: 'JTradePro News',
        category: 'technology'
      }
    ],
    markets: [
      {
        id: 'market-1',
        title: 'Global Markets React to Economic Data',
        summary: 'International markets show mixed reactions to latest economic indicators.',
        url: '#',
        publishedAt: new Date().toISOString(),
        source: 'JTradePro News',
        category: 'markets'
      }
    ]
  };

  return (fallbackNews[category as keyof typeof fallbackNews] || fallbackNews.general).slice(0, limit);
}

export async function getMarketNews(): Promise<NewsArticle[]> {
  return getYahooFinanceNews('markets', 10);
}

export async function getTechnologyNews(): Promise<NewsArticle[]> {
  return getYahooFinanceNews('technology', 10);
}

export async function getCryptoNews(): Promise<NewsArticle[]> {
  return getYahooFinanceNews('crypto', 10);
}

export async function getEarningsNews(): Promise<NewsArticle[]> {
  return getYahooFinanceNews('earnings', 10);
}
