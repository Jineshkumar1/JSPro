import { testStockQuote } from "../testStock";

export default async function TestPage() {
    const stockData = await testStockQuote();
    
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Stock Test Page</h1>
            <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(stockData, null, 2)}
            </pre>
        </div>
    );
}
