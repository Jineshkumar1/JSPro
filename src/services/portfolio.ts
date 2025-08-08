import { supabase } from '@/lib/supabase'

export interface HoldingInput {
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice?: number
}

export interface PortfolioSnapshot {
  portfolioId: string
  cashBalance: number
  holdings: Array<{
    id: string
    symbol: string
    name: string
    shares: number
    avgPrice: number
    currentPrice: number
  }>
}

export async function getOrCreatePrimaryPortfolio(userId: string): Promise<string> {
  try {
    const { data: existing, error: selectError } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .maybeSingle()

    if (!selectError && existing?.id) return existing.id

    const { data, error } = await supabase
      .from('portfolios')
      .insert({ user_id: userId, name: 'My Portfolio', is_primary: true })
      .select('id')
      .single()

    if (error || !data?.id) throw error ?? new Error('Failed creating portfolio')
    return data.id
  } catch (err) {
    console.error('getOrCreatePrimaryPortfolio error:', err)
    throw err
  }
}

export async function fetchPortfolioSnapshot(userId: string): Promise<PortfolioSnapshot> {
  try {
    const portfolioId = await getOrCreatePrimaryPortfolio(userId)

    const [{ data: cashRow, error: cashError }, { data: holdingRows, error: holdingError }] = await Promise.all([
      supabase.from('cash_balances').select('id, balance').eq('portfolio_id', portfolioId).maybeSingle(),
      supabase.from('holdings').select('id, symbol, name, shares, avg_price, current_price').eq('portfolio_id', portfolioId),
    ])

    if (cashError) console.error('fetchPortfolioSnapshot cash error:', cashError)
    if (holdingError) console.error('fetchPortfolioSnapshot holding error:', holdingError)

    let cashBalance = cashRow?.balance ?? 0
    if (cashRow == null) {
      // ensure a default cash row exists
      const { error } = await supabase
        .from('cash_balances')
        .upsert({ portfolio_id: portfolioId, balance: 0, currency: 'USD' }, { onConflict: 'portfolio_id,currency' })
      if (error) console.error('creating default cash row failed:', error)
      cashBalance = 0
    }

    const holdings = (holdingRows ?? []).map(h => ({
      id: h.id,
      symbol: h.symbol,
      name: h.name,
      shares: Number(h.shares),
      avgPrice: Number(h.avg_price),
      currentPrice: Number(h.current_price ?? 0),
    }))

    return { portfolioId, cashBalance, holdings }
  } catch (err) {
    console.error('fetchPortfolioSnapshot error:', err)
    throw err
  }
}

export async function upsertHolding(portfolioId: string, input: HoldingInput): Promise<void> {
  const { error } = await supabase
    .from('holdings')
    .upsert(
      {
        portfolio_id: portfolioId,
        symbol: input.symbol,
        name: input.name,
        shares: input.shares,
        avg_price: input.avgPrice,
        current_price: input.currentPrice ?? 0,
      },
      { onConflict: 'portfolio_id,symbol' }
    )
  if (error) {
    console.error('upsertHolding error:', error)
    throw error
  }
}

export async function updateHoldingShares(portfolioId: string, symbol: string, shares: number): Promise<void> {
  const { error } = await supabase
    .from('holdings')
    .update({ shares })
    .eq('portfolio_id', portfolioId)
    .eq('symbol', symbol)
  if (error) {
    console.error('updateHoldingShares error:', error)
    throw error
  }
}

export async function deleteHolding(portfolioId: string, symbol: string): Promise<void> {
  const { error } = await supabase
    .from('holdings')
    .delete()
    .eq('portfolio_id', portfolioId)
    .eq('symbol', symbol)
  if (error) {
    console.error('deleteHolding error:', error)
    throw error
  }
}

export async function setCashBalance(portfolioId: string, balance: number): Promise<void> {
  const { error } = await supabase
    .from('cash_balances')
    .upsert(
      { portfolio_id: portfolioId, balance, currency: 'USD' },
      { onConflict: 'portfolio_id,currency' }
    )
  if (error) {
    console.error('setCashBalance error:', error)
    throw error
  }
}

export async function addTransaction(
  portfolioId: string,
  input: {
    type: 'buy' | 'sell' | 'deposit' | 'withdraw'
    symbol?: string | null
    name?: string | null
    shares?: number | null
    price?: number | null
    amount: number
    description?: string | null
  }
): Promise<void> {
  const { error } = await supabase.from('transactions').insert({
    portfolio_id: portfolioId,
    type: input.type,
    symbol: input.symbol ?? null,
    name: input.name ?? null,
    shares: input.shares ?? null,
    price: input.price ?? null,
    amount: input.amount,
    description: input.description ?? null,
  })
  if (error) {
    console.error('addTransaction error:', error)
    throw error
  }
}

