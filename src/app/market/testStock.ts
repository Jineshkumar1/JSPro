'use server';

import { getStockQuote } from "../actions/stockActions";

export async function testStockQuote() {
    try {
        const appleStock = await getStockQuote('AAPL');
        console.log('Apple Stock Data:', JSON.stringify(appleStock, null, 2));
        return appleStock;
    } catch (error) {
        console.error('Error in test:', error);
        throw error;
    }
}
