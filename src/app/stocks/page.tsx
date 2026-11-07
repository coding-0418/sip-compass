import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import TopTabs from "@/components/TopTabs";

const stocks = [
  { name: "Tata Consultancy Services", ticker: "TCS", price: "₹4,112.30", change: "+1.2%", up: true },
  { name: "Reliance Industries", ticker: "RELIANCE", price: "₹2,845.60", change: "-0.4%", up: false },
  { name: "HDFC Bank", ticker: "HDFCBANK", price: "₹1,678.90", change: "+0.8%", up: true },
  { name: "Infosys", ticker: "INFY", price: "₹1,842.15", change: "+2.1%", up: true },
];

export default function StocksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />
      <TopTabs />

      <main className="flex-1 space-y-4 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">Stocks</h1>
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
