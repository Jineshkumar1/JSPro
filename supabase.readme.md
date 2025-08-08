# JTradePro Supabase Setup Guide

## Overview
This guide provides step-by-step instructions for setting up Supabase as the backend for JTradePro, including authentication, database schema, and real-time features.

## 1. Supabase Project Setup

### Create New Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: jtradepro
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### Get Project Credentials
1. Go to Settings → API
2. Copy the following:
   - Project URL
   - Anon public key
   - Service role key (keep secret)

## 2. Environment Variables

Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Database Schema

### Users Table (Auto-created by Supabase Auth)
```sql
-- This table is automatically created by Supabase Auth
-- No manual creation needed
```

### Portfolios Table
```sql
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Portfolio',
  description TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own portfolios" ON portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios" ON portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" ON portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" ON portfolios
  FOR DELETE USING (auth.uid() = user_id);
```

### Holdings Table
```sql
CREATE TABLE holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares DECIMAL(15,4) NOT NULL,
  avg_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(portfolio_id, symbol)
);

-- Enable RLS
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own holdings" ON holdings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own holdings" ON holdings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own holdings" ON holdings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own holdings" ON holdings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );
```

### Cash Balances Table
```sql
CREATE TABLE cash_balances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(portfolio_id, currency)
);

-- Enable RLS
ALTER TABLE cash_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own cash balances" ON cash_balances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = cash_balances.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own cash balances" ON cash_balances
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = cash_balances.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own cash balances" ON cash_balances
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = cash_balances.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'deposit', 'withdraw')),
  symbol TEXT,
  name TEXT,
  shares DECIMAL(15,4),
  price DECIMAL(10,2),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = transactions.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = transactions.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );
```

### Watchlists Table
```sql
CREATE TABLE watchlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own watchlists" ON watchlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlists" ON watchlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlists" ON watchlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlists" ON watchlists
  FOR DELETE USING (auth.uid() = user_id);
```

### Watchlist Items Table
```sql
CREATE TABLE watchlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(watchlist_id, symbol)
);

-- Enable RLS
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own watchlist items" ON watchlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM watchlists 
      WHERE watchlists.id = watchlist_items.watchlist_id 
      AND watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own watchlist items" ON watchlist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM watchlists 
      WHERE watchlists.id = watchlist_items.watchlist_id 
      AND watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own watchlist items" ON watchlist_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM watchlists 
      WHERE watchlists.id = watchlist_items.watchlist_id 
      AND watchlists.user_id = auth.uid()
    )
  );
```

## 4. Functions and Triggers

### Update Portfolio Updated At
```sql
CREATE OR REPLACE FUNCTION update_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_updated_at();
```

### Update Holdings Updated At
```sql
CREATE OR REPLACE FUNCTION update_holdings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_holdings_updated_at
  BEFORE UPDATE ON holdings
  FOR EACH ROW
  EXECUTE FUNCTION update_holdings_updated_at();
```

### Update Cash Balance Updated At
```sql
CREATE OR REPLACE FUNCTION update_cash_balance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cash_balance_updated_at
  BEFORE UPDATE ON cash_balances
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_balance_updated_at();
```

## 5. Authentication Setup

### Enable Email Auth
1. Go to Authentication → Settings
2. Enable "Enable email confirmations"
3. Configure email templates if needed

### Enable Google OAuth
1. Go to Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### Enable GitHub OAuth (Optional)
1. Go to Authentication → Providers
2. Enable GitHub provider
3. Add your GitHub OAuth credentials

## 6. Storage Setup (for user avatars)

### Create Storage Bucket
```sql
-- This will be done through the Supabase dashboard
-- Go to Storage → Create new bucket
-- Name: avatars
-- Public bucket: true
-- File size limit: 5MB
-- Allowed MIME types: image/*
```

### Storage Policies
```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view all avatars
CREATE POLICY "Users can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 7. Real-time Setup

### Enable Real-time for Tables
```sql
-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE portfolios;
ALTER PUBLICATION supabase_realtime ADD TABLE holdings;
ALTER PUBLICATION supabase_realtime ADD TABLE cash_balances;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE watchlists;
ALTER PUBLICATION supabase_realtime ADD TABLE watchlist_items;
```

## 8. Database Indexes

### Performance Indexes
```sql
-- Holdings indexes
CREATE INDEX idx_holdings_portfolio_symbol ON holdings(portfolio_id, symbol);
CREATE INDEX idx_holdings_symbol ON holdings(symbol);

-- Transactions indexes
CREATE INDEX idx_transactions_portfolio_created ON transactions(portfolio_id, created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);

-- Cash balances index
CREATE INDEX idx_cash_balances_portfolio ON cash_balances(portfolio_id);

-- Watchlist indexes
CREATE INDEX idx_watchlist_items_watchlist_symbol ON watchlist_items(watchlist_id, symbol);
CREATE INDEX idx_watchlists_user ON watchlists(user_id);
```

## 9. Testing the Setup

### Test Queries
```sql
-- Test portfolio creation (run after user signs up)
INSERT INTO portfolios (user_id, name, is_primary)
VALUES (auth.uid(), 'My Portfolio', true);

-- Test holding insertion
INSERT INTO holdings (portfolio_id, symbol, name, shares, avg_price)
SELECT 
  p.id,
  'AAPL',
  'Apple Inc.',
  10,
  150.00
FROM portfolios p
WHERE p.user_id = auth.uid() AND p.is_primary = true;

-- Test cash balance
INSERT INTO cash_balances (portfolio_id, balance)
SELECT 
  p.id,
  10000.00
FROM portfolios p
WHERE p.user_id = auth.uid() AND p.is_primary = true;
```

## 10. Security Best Practices

### Additional Security Measures
1. **Enable SSL**: Ensure all connections use SSL
2. **Rate Limiting**: Configure rate limiting for API endpoints
3. **Audit Logging**: Enable audit logs for sensitive operations
4. **Backup Strategy**: Set up automated backups
5. **Monitoring**: Set up alerts for unusual activity

### Environment Variables Security
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly
- Use environment-specific configurations

## 11. Deployment Considerations

### Production Checklist
- [ ] Set up custom domain
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables
- [ ] Test all authentication flows
- [ ] Verify RLS policies
- [ ] Test real-time subscriptions
- [ ] Performance testing

## 12. Troubleshooting

### Common Issues
1. **RLS Policy Errors**: Ensure all tables have proper RLS policies
2. **Authentication Issues**: Check OAuth provider configurations
3. **Real-time Not Working**: Verify real-time is enabled for tables
4. **Performance Issues**: Check database indexes and query optimization

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Supabase Discord](https://discord.supabase.com)
