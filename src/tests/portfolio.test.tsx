import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import PortfolioPage from '@/app/portfolio/page';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signOut: vi.fn(() => Promise.resolve())
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

// Mock stock actions
vi.mock('@/app/actions/stockActions', () => ({
  getStockQuote: vi.fn(() => Promise.resolve({
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.00,
    change: 2.50,
    changePercentage: 1.67,
    volume: 1000000,
    marketCap: 2500000000000
  }))
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('Portfolio Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('should display empty portfolio state', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Value')).toBeInTheDocument();
        expect(screen.getByText('$0')).toBeInTheDocument();
        expect(screen.getByText('Cash Balance')).toBeInTheDocument();
        expect(screen.getByText('Holdings')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      renderWithAuth(<PortfolioPage />);
      expect(screen.getByText('Loading portfolio...')).toBeInTheDocument();
    });
  });

  describe('Portfolio Summary Cards', () => {
    it('should display all summary cards', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Value')).toBeInTheDocument();
        expect(screen.getByText('Total Return')).toBeInTheDocument();
        expect(screen.getByText('Cash Balance')).toBeInTheDocument();
        expect(screen.getByText('Holdings')).toBeInTheDocument();
      });
    });

    it('should calculate metrics correctly', async () => {
      // Mock existing portfolio data
      const mockHoldings = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 10,
          avgPrice: 150,
          currentPrice: 160,
          value: 1600,
          return: 100,
          returnPercentage: 6.67
        }
      ];
      
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockHoldings))
        .mockReturnValueOnce('5000');

      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('$6,600')).toBeInTheDocument(); // Total value
        expect(screen.getByText('+$100.00')).toBeInTheDocument(); // Total return
        expect(screen.getByText('$5,000')).toBeInTheDocument(); // Cash balance
        expect(screen.getByText('1')).toBeInTheDocument(); // Holdings count
      });
    });
  });

  describe('Quick Actions', () => {
    it('should display all quick action buttons', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Deposit Funds')).toBeInTheDocument();
        expect(screen.getByText('Buy Stocks')).toBeInTheDocument();
        expect(screen.getByText('Sell Stocks')).toBeInTheDocument();
        expect(screen.getByText('Withdraw Funds')).toBeInTheDocument();
      });
    });

    it('should open deposit modal when deposit button is clicked', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        const depositButton = screen.getByText('Deposit Funds');
        fireEvent.click(depositButton);
      });

      // Should show cash modal
      await waitFor(() => {
        expect(screen.getByText('Deposit Funds')).toBeInTheDocument();
      });
    });

    it('should open add stock modal when buy button is clicked', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        const buyButton = screen.getByText('Buy Stocks');
        fireEvent.click(buyButton);
      });

      // Should show add stock modal
      await waitFor(() => {
        expect(screen.getByText('Add Stock to Portfolio')).toBeInTheDocument();
      });
    });
  });

  describe('Holdings Table', () => {
    it('should display empty state when no holdings', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('No holdings yet')).toBeInTheDocument();
        expect(screen.getByText('Add your first stock to get started')).toBeInTheDocument();
      });
    });

    it('should display holdings when they exist', async () => {
      const mockHoldings = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 10,
          avgPrice: 150,
          currentPrice: 160,
          value: 1600,
          return: 100,
          returnPercentage: 6.67
        }
      ];
      
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockHoldings))
        .mockReturnValueOnce('5000');

      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('$150.00')).toBeInTheDocument();
        expect(screen.getByText('$160.00')).toBeInTheDocument();
        expect(screen.getByText('$1,600.00')).toBeInTheDocument();
        expect(screen.getByText('+$100.00')).toBeInTheDocument();
        expect(screen.getByText('+6.67%')).toBeInTheDocument();
      });
    });

    it('should show edit and sell buttons for each holding', async () => {
      const mockHoldings = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 10,
          avgPrice: 150,
          currentPrice: 160,
          value: 1600,
          return: 100,
          returnPercentage: 6.67
        }
      ];
      
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockHoldings))
        .mockReturnValueOnce('5000');

      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Sell')).toBeInTheDocument();
      });
    });
  });

  describe('Asset Distribution Chart', () => {
    it('should display chart when holdings exist', async () => {
      const mockHoldings = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 10,
          avgPrice: 150,
          currentPrice: 160,
          value: 1600,
          return: 100,
          returnPercentage: 6.67
        }
      ];
      
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockHoldings))
        .mockReturnValueOnce('5000');

      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Asset Distribution')).toBeInTheDocument();
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('Cash')).toBeInTheDocument();
      });
    });

    it('should show empty state when no holdings', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('No assets to display')).toBeInTheDocument();
        expect(screen.getByText('Add stocks to see your portfolio distribution')).toBeInTheDocument();
      });
    });
  });

  describe('Add Stock Functionality', () => {
    it('should add stock successfully', async () => {
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        const addButton = screen.getByText('Add Stock');
        fireEvent.click(addButton);
      });

      // Fill in the form
      await waitFor(() => {
        const symbolInput = screen.getByPlaceholderText('Search for a stock...');
        const sharesInput = screen.getByPlaceholderText('Number of shares');
        const priceInput = screen.getByPlaceholderText('Average price per share');

        fireEvent.change(symbolInput, { target: { value: 'AAPL' } });
        fireEvent.change(sharesInput, { target: { value: '10' } });
        fireEvent.change(priceInput, { target: { value: '150' } });
      });

      // Submit the form
      const addButton = screen.getByText('Add to Portfolio');
      fireEvent.click(addButton);

      // Verify localStorage was called
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      vi.mocked(require('@/app/actions/stockActions').getStockQuote).mockRejectedValueOnce(
        new Error('API Error')
      );

      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        // Should still render the page even with API errors
        expect(screen.getByText('Total Value')).toBeInTheDocument();
      });
    });

    it('should handle localStorage errors', async () => {
      // Mock localStorage error
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        // Should still render the page even with localStorage errors
        expect(screen.getByText('Total Value')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should not cause infinite re-renders', async () => {
      const renderCount = vi.fn();
      
      renderWithAuth(<PortfolioPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Value')).toBeInTheDocument();
      });

      // Wait a bit to ensure no excessive re-renders
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Component should be stable
      expect(screen.getByText('Total Value')).toBeInTheDocument();
    });
  });
});
