"use client";

interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  return: number;
  returnPercentage: number;
}

interface AssetDistributionProps {
  holdings: PortfolioHolding[];
  totalValue: number;
  cashBalance: number;
}

const colors = [
  "#F7931A", // Orange
  "#627EEA", // Blue
  "#00FFA3", // Green
  "#26A17B", // Teal
  "#FF6B6B", // Red
  "#4ECDC4", // Cyan
  "#45B7D1", // Light Blue
  "#96CEB4", // Mint
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
];

const cashColor = "#10B981"; // Emerald green for cash

export function AssetDistribution({ holdings, totalValue, cashBalance }: AssetDistributionProps) {
  if (holdings.length === 0 && cashBalance === 0) {
    return (
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
        <div className="flex items-center justify-center h-64 text-text-secondary">
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div>No assets in portfolio yet</div>
            <div className="text-sm mt-1">Add some stocks or deposit cash to see your distribution</div>
          </div>
        </div>
      </div>
    );
  }

  // Create assets array including cash
  const assets = [];
  
  // Add stocks first
  holdings.forEach((holding, index) => {
    if (holding.value > 0) { // Only add stocks with positive value
      assets.push({
        symbol: holding.symbol,
        name: holding.name,
        value: holding.value,
        color: colors[index % colors.length],
        percentage: totalValue > 0 ? (holding.value / totalValue) * 100 : 0,
      });
    }
  });

  // Add cash if it exists and total value is positive
  if (cashBalance > 0 && totalValue > 0) {
    assets.push({
      symbol: "CASH",
      name: "Cash",
      value: cashBalance,
      color: cashColor,
      percentage: (cashBalance / totalValue) * 100,
    });
  }

  // Ensure percentages don't exceed 100%
  const totalPercentage = assets.reduce((sum, asset) => sum + asset.percentage, 0);
  if (totalPercentage > 100) {
    // Normalize percentages to fit within 100%
    assets.forEach(asset => {
      asset.percentage = (asset.percentage / totalPercentage) * 100;
    });
  }

  // Calculate SVG path for donut chart
  const radius = 80;
  const strokeWidth = 20;
  const centerX = 100;
  const centerY = 100;
  let currentAngle = -90; // Start from top

  const createDonutPath = () => {
    const paths = assets.map((asset, index) => {
      const percentage = Math.min(asset.percentage, 100); // Ensure percentage doesn't exceed 100%
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      ].join(" ");

      currentAngle += angle;
      return (
        <path
          key={`chart-${asset.symbol}-${index}`}
          d={path}
          fill="none"
          stroke={asset.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      );
    });

    return paths;
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
      <div className="flex items-center gap-8">
        {/* Donut Chart */}
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {createDonutPath()}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-text-secondary">Total Value</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1">
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div key={`legend-${asset.symbol}-${index}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <div>
                    <div className="font-medium">{asset.symbol}</div>
                    <div className="text-sm text-text-secondary">{asset.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${asset.value.toLocaleString()}</div>
                  <div className="text-sm text-text-secondary">
                    {asset.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 