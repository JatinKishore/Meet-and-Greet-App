import React from 'react';
import { SlidersHorizontal, Menu, ShieldCheck, Navigation, MapPin } from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { countActiveFilters } from '../utils/meetLogic';

export const TopAppHeader: React.FC = () => {
  const {
    user,
    meets,
    setRoute,
    setIsFilterOpen,
    setIsSidebarOpen,
    setSelectedMeetId,
    setIsMeetSheetOpen,
    filters,
  } = useMeet();

  const activeFilterCount = countActiveFilters(filters);

  const handleTickerClick = (meetId: string) => {
    setSelectedMeetId(meetId);
    setIsMeetSheetOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/10 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2.5">
        {/* Left: Profile Avatar button (Links to /profile as drawn in doodle) */}
        <button
          type="button"
          onClick={() => setRoute('/profile')}
          aria-label={`Open profile for ${user.name}`}
          className="group relative flex items-center gap-2 min-h-[44px] min-w-[44px] pr-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-transform active:scale-95 shrink-0"
        >
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 via-emerald-900/50 to-zinc-900 border border-emerald-400/50 flex items-center justify-center text-sm font-bold text-emerald-200 shadow-inner">
            JK
            {user.kycVerified && (
              <span
                title="DigiLocker KYC Verified"
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center ring-2 ring-[#09090B]"
              >
                <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            )}
          </div>
        </button>

        {/* Center: Live Scrolling TickerTapeCarousel mapped directly from doodle */}
        <div
          className="flex-1 min-w-0 overflow-hidden rounded-xl bg-[#121215] border border-white/10 py-1.5 px-2.5"
          aria-label="Live Upcoming Chennai Meets Ticker"
        >
          <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-0.5">
            <span className="font-medium text-amber-400 truncate">
              upcoming... Arrive in 5min - Rapido
            </span>
            <span className="font-mono text-[10px] text-emerald-400 shrink-0 ml-1">
              30min · Live
            </span>
          </div>

          <div className="overflow-hidden relative">
            <div className="animate-ticker flex items-center gap-6 text-xs text-zinc-200">
              {[...meets, ...meets].map((m, idx) => {
                const spotsLeft = Math.max(0, m.maxSpots - m.occupiedSpots);
                return (
                  <button
                    key={`${m.id}-${idx}`}
                    type="button"
                    onClick={() => handleTickerClick(m.id)}
                    className="inline-flex items-center gap-1.5 hover:text-emerald-300 transition-colors whitespace-nowrap text-left"
                  >
                    <Navigation className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-zinc-100">{m.title}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="inline-flex items-center gap-0.5 text-zinc-300">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      {m.venueName}
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span className="font-mono text-amber-300">
                      {spotsLeft} spots left
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Filter Trigger + Sidebar Drawer Trigger */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            aria-label="Open Meet Filters"
            className="relative min-h-[44px] min-w-[44px] rounded-xl bg-[#121215] hover:bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-200 transition-colors active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-zinc-950 font-mono text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Navigation Drawer"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#121215] hover:bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-200 transition-colors active:scale-95"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
