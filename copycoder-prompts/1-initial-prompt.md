Initialize Next.js in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@latest . -y --typescript --tailwind --eslint --app --use-npm --src-dir --import-alias "@/*" -no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

<summary_title>
Investment Portfolio Dashboard with Dark Theme UI
</summary_title>

<image_analysis>

1. Navigation Elements:
- Left sidebar with: Dashboard, Market, Portfolio, Settings, Logout
- Secondary navigation via "View all" links in section headers
- User profile and notifications in top right


2. Layout Components:
- Main container: 1200px max-width
- Left sidebar: 240px fixed width
- Content area: 3-column grid layout
- Card components: ~360px width, variable height
- Padding: 24px between sections, 16px internal


3. Content Sections:
- Trending stocks cards
- Latest transactions list
- Most profitable stocks grid
- Recent activities timeline
- My portfolio summary
- Premium upgrade card


4. Interactive Controls:
- Search bar in header
- Stock cards with interactive charts
- View all buttons for expandable sections
- Buy/Sell transaction indicators
- Premium upgrade CTA button


5. Colors:
- Background: #1E1E1E
- Cards: #2A2A2A
- Accent: #FF4B6E (logo/primary)
- Green: #00C853 (positive values)
- Red: #FF3D00 (negative values)
- Text: #FFFFFF, #8F8F8F (secondary)


6. Grid/Layout Structure:
- 12-column grid system
- Card grid: 3 columns on desktop
- Responsive breakpoints at 1200px, 992px, 768px
- Flexible card sizing with min-width constraints
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar
│   │   ├── Header
│   │   └── Dashboard
│   ├── features/
│   │   ├── StockCard
│   │   ├── TransactionList
│   │   └── PortfolioSummary
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```


2. Key Features:
- Real-time stock price updates
- Interactive stock charts
- Transaction history tracking
- Portfolio performance metrics
- Premium subscription management


3. State Management:
```typescript
interface AppState {
├── stocks: {
│   ├── trending: Stock[]
│   ├── profitable: Stock[]
│   └── watchlist: Stock[]
├── portfolio: {
│   ├── holdings: Holding[]
│   ├── performance: Metrics
│   └── transactions: Transaction[]
├── user: {
│   ├── profile: UserProfile
│   ├── preferences: Settings
│   └── subscription: SubscriptionStatus
└── }
}
```


4. Routes:
```typescript
const routes = [
├── '/dashboard',
├── '/market/*',
├── '/portfolio/*',
├── '/settings/*',
└── '/premium'
]
```


5. Component Architecture:
- DashboardLayout (container)
- StockCard (reusable)
- TransactionList (feature)
- PortfolioMetrics (feature)
- ChartComponent (shared)


6. Responsive Breakpoints:
```scss
$breakpoints: (
├── 'desktop': 1200px,
├── 'tablet': 992px,
├── 'mobile': 768px,
└── 'small': 576px
);
```
</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.