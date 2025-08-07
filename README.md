# J Stock PortfolioPro - Modern Stock Portfolio Web Application

A comprehensive stock portfolio management application built with Next.js, TypeScript, and Tailwind CSS. Track your investments, analyze market trends, and manage your portfolio with real-time data from Yahoo Finance.

## 🚀 Features

### 📊 **Dashboard**
- **Trending Stocks**: Real-time display of FAANG and popular tech stocks
- **Most Up/Down**: Daily gainers and losers with live price updates
- **Portfolio Summary**: Quick overview of your investment performance
- **Recent Activities**: Transaction history and portfolio updates
- **Interactive Stock Cards**: Click to view detailed stock information

### 🔍 **Search Functionality**
- **Predictive Search**: Search stocks by name or ticker symbol
- **Real-time Results**: Live search across NYSE and NASDAQ
- **Popular Stocks**: Quick access to trending stocks
- **Stock Details**: View comprehensive stock information

### 💼 **Portfolio Management**

#### **Asset Distribution Chart**
- **Dynamic Donut Chart**: Visual representation of portfolio allocation
- **Color-coded Segments**: Each stock has a unique color identifier
- **Percentage Display**: Exact percentage allocation for each holding
- **Total Value**: Real-time total portfolio value in chart center
- **Empty State**: Helpful guidance when portfolio is empty

#### **Quick Action Buttons**
- **Deposit Funds**: Add funds to your account (placeholder functionality)
- **Buy Stocks**: Open stock purchase modal with search functionality
- **Sell Stocks**: Sell existing holdings (placeholder functionality)
- **Withdraw Funds**: Withdraw funds from account (placeholder functionality)

#### **Add Stock Modal**
- **Searchable Stock Selection**: Search any stock on NYSE and NASDAQ
- **Real-time Search**: Uses Yahoo Finance API for live results
- **Stock Details**: Displays symbol, name, exchange, and type
- **Number of Shares**: Input field for quantity with decimal support
- **Average Price**: Input field for purchase price per share
- **Total Investment Preview**: Real-time calculation of total investment
- **Validation**: Ensures all fields are filled with valid numbers
- **Duplicate Prevention**: Prevents adding stocks already in portfolio

#### **Portfolio Holdings Table**
- **Real-time Data**: Current prices fetched from Yahoo Finance
- **Total Value Calculation**: Automatically calculated for each holding
- **Return Calculation**: Shows profit/loss in dollars and percentage
- **Visual Indicators**: Green arrows for gains, red arrows for losses
- **Remove Functionality**: Trash icon to remove stocks from portfolio
- **Empty State**: Helpful message when portfolio is empty

#### **Portfolio Summary Cards**
- **Total Value**: Sum of all holdings with real-time updates
- **Total Return**: Overall profit/loss with percentage
- **Number of Holdings**: Count of different stocks in portfolio

#### **Data Persistence**
- **Local Storage**: Portfolio data automatically saved locally
- **Auto-refresh**: Current prices update automatically
- **Real-time Calculations**: All metrics update with price changes

### 📈 **Market Analysis**
- **Stock Charts**: Interactive price charts for individual stocks
- **Market Trends**: Real-time market data and analysis
- **Stock Details**: Comprehensive stock information and metrics

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Source**: Yahoo Finance API (yahoo-finance2)
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Data Persistence**: Local Storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd jsprolocal
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 How to Use

### **Dashboard Navigation**
1. Navigate to the Dashboard to see trending stocks and market overview
2. Use the search bar to find specific stocks
3. Click on stock cards to view detailed information

### **Portfolio Management**
1. **Navigate to Portfolio**: Click "Portfolio" in the sidebar
2. **Add Stocks**: Click "Add Stock" or "Buy Stocks" button
3. **Search Stocks**: Type any stock symbol (AAPL, MSFT, TSLA, etc.)
4. **Enter Details**: Fill in number of shares and average price
5. **View Results**: See your portfolio with real-time data and charts

### **Adding Stocks to Portfolio**
1. Click "Add Stock" button
2. Search for desired stock by symbol or name
3. Select the stock from search results
4. Enter number of shares and average purchase price
5. Click "Add to Portfolio"
6. View updated portfolio with real-time calculations

### **Managing Portfolio**
- **View Holdings**: See all stocks in your portfolio with current values
- **Remove Stocks**: Click the trash icon to remove stocks
- **Track Performance**: Monitor gains/losses with visual indicators
- **Asset Distribution**: View portfolio allocation in donut chart

## 🔧 API Integration

### **Yahoo Finance API**
- **Real-time Quotes**: Live stock prices and market data
- **Historical Data**: Price history for charts and analysis
- **Stock Search**: Comprehensive search across exchanges
- **Market Data**: Trending stocks, gainers, and losers

### **Data Sources**
- **NYSE**: New York Stock Exchange stocks
- **NASDAQ**: NASDAQ Stock Market stocks
- **Real-time Updates**: Live price feeds and market data

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all charts and tables
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with simplified navigation

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark interface for better readability
- **Smooth Animations**: Fluid transitions and hover effects
- **Loading States**: Clear feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Data Security

- **Local Storage**: All portfolio data stored locally in browser
- **No External Storage**: No sensitive data sent to external servers
- **Privacy Focused**: Your portfolio data stays on your device

## 🚀 Future Enhancements

- **User Authentication**: Secure login and account management
- **Cloud Storage**: Sync portfolio across devices
- **Advanced Charts**: Technical analysis and indicators
- **Portfolio Alerts**: Price alerts and notifications
- **Transaction History**: Detailed buy/sell transaction tracking
- **Performance Analytics**: Advanced portfolio performance metrics

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
