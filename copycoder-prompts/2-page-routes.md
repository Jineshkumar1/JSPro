Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /dashboard
- /market
- /portfolio
- /settings
- /logout

Page Implementations:
/dashboard:
Core Purpose: Provide overview of user's financial status and key metrics
Key Components
- Account Balance Summary Card
- Recent Transactions List
- Performance Charts
- Quick Action Buttons
- Notification Center
Layout Structure
- Grid-based layout with 2-3 columns
- Stacked layout on mobile
- Sticky header with key metrics

/market:
Core Purpose: Display market data, trends, and trading opportunities
Key Components
- Market Search/Filter
- Price Charts
- Trading Pairs List
- Market News Feed
- Watchlist
Layout Structure
- Split view with list and detail panels
- Collapsible sidebar for filters
- Full-width charts on mobile

/portfolio:
Core Purpose: Track and manage user investments
Key Components
- Asset Distribution Chart
- Holdings Table
- Performance Metrics
- Transaction History
- Export Functions
Layout Structure
- Main content area with sidebar
- Tabbed interface for different views
- Scrollable tables with fixed headers

/settings:
Core Purpose: Manage user preferences and account settings
Key Components
- Profile Information Form
- Security Settings
- Notification Preferences
- API Key Management
- Theme Selection
Layout Structure
- Vertical navigation menu
- Form-based content areas
- Modal confirmations

/logout:
Core Purpose: Handle user session termination
Key Components
- Confirmation Dialog
- Session Cleanup
- Redirect Handler
Layout Structure
- Modal overlay
- Centered content
- Loading state

Layouts:
MainLayout:
- Applicable routes: dashboard, market, portfolio, settings
- Core components
  - Navigation Sidebar
  - Header with user info
  - Content area
  - Footer
- Responsive behavior
  - Collapsible sidebar on mobile
  - Sticky header
  - Fluid content area

AuthLayout
- Applicable routes: logout
- Core components
  - Logo
  - Content area
  - System messages
- Responsive behavior
  - Centered content
  - Full-screen on mobile
  - Minimal padding on small screens
</page-structure-prompt>