import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import TopTabs from "@/components/TopTabs";

const stocks = [
  { name: "Apple Inc.", ticker: "AAPL", price: "$228.40", change: "+0.6%", up: true },
  { name: "Microsoft Corp.", ticker: "MSFT", price: "$421.75", change: "+1.1%", up: true },
  { name: "Alphabet Inc.", ticker: "GOOGL", price: "$172.90", change: "-0.3%", up: false },
  { name: "Amazon.com Inc.", ticker: "AMZN", price: "$198.20", change: "+0.9%", up: true },
];

export default function UsStocksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />
      <TopTabs />

      <main className="flex-1 space-y-4 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">US Stocks</h1>
        <p className="text-sm text-muted">Trending on Groww</p>

        <div className="space-y-2.5">
          {stocks.map((stock) => (
            <div key={stock.ticker} className="flex items-center justify-between rounded-2xl border border-border bg-white p-3.5">
              <div>
                <p className="text-sm font-medium text-ink">{stock.name}</p>
                <p className="mt-0.5 text-xs text-muted">{stock.ticker}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{stock.price}</p>
                <p className={`mt-0.5 text-xs font-medium ${stock.up ? "text-primary-dark" : "text-red-500"}`}>
                  {stock.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
