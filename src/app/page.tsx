import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import TopTabs from "@/components/TopTabs";
import SIPCard from "@/components/SIPCard";
import SIPAssistEntryCard from "@/components/SIPAssistEntryCard";
import { getAllSips } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function MutualFundsPage() {
  const allSips = getAllSips();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />
      <TopTabs />

      <main className="flex-1 space-y-6 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">Mutual Funds</h1>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-ink">My SIPs</h2>
          {allSips.map((sip) => (
            <div key={sip.id} className="space-y-3">
              <SIPCard sip={sip} />
              <SIPAssistEntryCard sip={sip} />
            </div>
          ))}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
