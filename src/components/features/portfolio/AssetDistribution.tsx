"use client";

interface Asset {
  symbol: string;
  value: number;
  color: string;
}

interface AssetDistributionProps {
  assets: Asset[];
  totalValue: number;
}

export function AssetDistribution({ assets, totalValue }: AssetDistributionProps) {
  const sortedAssets = [...assets].sort((a, b) => b.value - a.value);
  const total = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="rounded-lg bg-card p-internal">
      <h2 className="text-lg font-semibold">Asset Distribution</h2>

      <div className="mt-6 flex gap-6">
        <div className="relative h-[200px] w-[200px]">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#2A2A2A"
              strokeWidth="20"
            />
            {sortedAssets.map((asset, index) => {
              const percentage = (asset.value / total) * 100;
              const previousPercentages = sortedAssets
                .slice(0, index)
                .reduce((sum, a) => sum + (a.value / total) * 100, 0);
              const strokeDasharray = `${percentage * 5.024} ${100 * 5.024}`;
              const strokeDashoffset = -previousPercentages * 5.024;

              return (
                <circle
                  key={asset.symbol}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={asset.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">Total Value</div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center space-y-3">
          {sortedAssets.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="font-medium">{asset.symbol}</span>
              </div>
              <div className="text-right">
                <div>${asset.value.toLocaleString()}</div>
                <div className="text-sm text-text-secondary">
                  {((asset.value / total) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 