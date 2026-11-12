import React, { useState, useEffect, useMemo } from 'react';
import {
  SlidersHorizontal,
  Menu,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import {
  countActiveFilters,
  getNextBookedMeet,
  getRemainingTimeUrgency,
} from '../utils/meetLogic';

export const TopAppHeader: React.FC = () => {
  const {
    user,
    meets,
    selectedMeet,
    setRoute,
    setIsFilterOpen,
    setIsSidebarOpen,
    setSelectedMeetId,
    filters,
    showToast,
  } = useMeet();

  const activeFilterCount = countActiveFilters(filters);

  // Next meet the user has booked
  const liveBookedMeet = useMemo(
    () => getNextBookedMeet(meets, selectedMeet?.id),
    [meets, selectedMeet?.id]
  );

  // Remaining time state (in seconds) with presets for Green (28m), Yellow (14m), Red (5m)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(14 * 60 + 25);
  const [rapidoBookedForId, setRapidoBookedForId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 14 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutesLeft = Math.ceil(secondsRemaining / 60);
  const displayMins = Math.floor(secondsRemaining / 60);
  const displaySecs = String(secondsRemaining % 60).padStart(2, '0');
  const urgency = getRemainingTimeUrgency(minutesLeft);

  const cycleTimerUrgency = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (urgency.level === 'green') {
      setSecondsRemaining(14 * 60 + 30); // Yellow (14m 30s)
    } else if (urgency.level === 'yellow') {
      setSecondsRemaining(5 * 60 + 15); // Red (5m 15s)
    } else {
      setSecondsRemaining(28 * 60 + 45); // Green (28m 45s)
    }
  };

  const handleBookRapido = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRapidoBookedForId(liveBookedMeet.id);
    const estFare = Math.max(29, Math.round(liveBookedMeet.distanceKm * 14));
    showToast(
      `Rapido Captain on the way to ${liveBookedMeet.venueName}!`,
      `Captain Rajesh (TN-01-BW-4829) arriving in 2 mins · ${liveBookedMeet.distanceKm} km · Est. ₹${estFare}`,
      'amber'
    );
  };

  const handleOpenLiveMeet = () => {
    setSelectedMeetId(liveBookedMeet.id);
    setRoute('/meet/active');
  };

  const isRapidoBooked = rapidoBookedForId === liveBookedMeet.id;

  return (
    <header className="sticky top-0 z-30 bg-[#09090B]/95 backdrop-blur-xl border-b border-white/10 px-3.5 py-2.5">
      {/* Single Row Layout: [Profile Avatar]  <-- [LIVE MEET Stable Block] -->  [Filter & Menu] */}
      <div className="flex items-center justify-between gap-2">
        {/* LEFT: Profile Avatar Button */}
        <button
          type="button"
          onClick={() => setRoute('/profile')}
          aria-label={`Open profile for ${user.name}`}
          className="group relative flex flex-col items-center justify-center rounded-2xl p-1 transition-transform active:scale-95 shrink-0"
        >
          <div className="relative w-11 h-11 rounded-full vibe-cta-primary flex items-center justify-center text-sm font-extrabold shadow-sm">
            JK
            {user.kycVerified && (
              <span
                title="Verified Identity"
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center ring-2 ring-white"
              >
                <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold text-zinc-400 mt-0.5 leading-none">
            Profile
          </span>
        </button>

        {/* CENTER (Between Profile and Menu): Stable LIVE MEET Block with all 4 items */}
        <div
          role="region"
          aria-label="LIVE MEET Next Booked Meet Status"
          onClick={handleOpenLiveMeet}
          className="flex-1 min-w-0 rounded-2xl vibe-card border px-2.5 py-2 cursor-pointer transition-colors flex items-center justify-between gap-2"
        >
          <div className="min-w-0 flex-1 space-y-0.5">
            {/* Row 1: LIVE MEET Tag + Meet Name */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md vibe-cta-primary font-mono text-[9px] font-extrabold tracking-wider uppercase shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
                LIVE MEET
              </span>
              <span className="font-display font-extrabold text-xs text-white truncate">
                {liveBookedMeet.title}
              </span>
            </div>

            {/* Row 2: Time + Color-Coded Remaining Timer (Green / Yellow / Red) */}
            <div className="text-[11px] text-zinc-300 flex items-center flex-wrap gap-x-1 gap-y-0.5 leading-tight">
              <Clock className="w-3 h-3 vibe-text-accent shrink-0" />
              <span className="text-zinc-400">Time:</span>
              <span className="font-mono font-semibold text-white">
                {liveBookedMeet.dateTimeLabel.split(',')[0]}
              </span>
              <button
                type="button"
                onClick={cycleTimerUrgency}
                title="Tap to preview Green (>20m), Yellow (10-20m), and Red (<10m) timer colors"
                className={`px-1.5 py-0.2 rounded border font-mono text-[10px] font-bold inline-flex items-center gap-1 ${urgency.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${urgency.dotClass} shrink-0`} />
                <span>{displayMins}m {displaySecs}s left</span>
              </button>
            </div>

            {/* Row 3: Location + Distance Away */}
            <div className="text-[11px] text-zinc-300 flex items-center gap-1 truncate leading-tight">
              <MapPin className="w-3 h-3 vibe-text-accent shrink-0" />
              <span className="text-zinc-400 shrink-0">Loc:</span>
              <span className="font-semibold text-white truncate">
                {liveBookedMeet.venueName}
              </span>
              <span className="font-mono font-bold vibe-text-accent shrink-0">
                ({liveBookedMeet.distanceKm} km)
              </span>
            </div>
          </div>

          {/* 4. 1-Click Rapido Logo Button */}
          <button
            type="button"
            onClick={handleBookRapido}
            aria-label={`Book Rapido to ${liveBookedMeet.venueName} in one click`}
            className={`shrink-0 min-h-[44px] px-2.5 py-1.5 rounded-xl border font-display transition-transform active:scale-95 flex flex-col items-center justify-center gap-0.5 shadow-sm ${
              isRapidoBooked
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                : 'bg-[#FACC15] hover:bg-[#EAB308] text-zinc-950 border-amber-400'
            }`}
          >
            {isRapidoBooked ? (
              <>
                <div className="flex items-center gap-0.5 font-extrabold text-[10px] tracking-tight text-zinc-950">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                  <span>Booked</span>
                </div>
                <span className="font-mono text-[8px] font-bold text-zinc-900">
                  ETA 2m
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-zinc-950 text-[#FACC15] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-2.5 h-2.5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M5 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm14 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM15.5 5H12v2h2.6l1.8 4H11l-1.6-3H6v2h2.2l1.8 3.4L8.2 16H10l1.6-2h5.9l1.5 2h1.8l-3.2-7.5L15.5 5z" />
                    </svg>
                  </span>
                  <span className="font-extrabold text-[10px] tracking-tight text-zinc-950">
                    rapido
                  </span>
                </div>
                <span className="font-mono text-[8px] font-bold text-zinc-900 whitespace-nowrap">
                  ~{liveBookedMeet.arriveMinutes}m ride
                </span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT: Filter & Menu Drawer Triggers */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            aria-label="Open Meet Filters"
            className="relative min-h-[42px] min-w-[40px] rounded-2xl vibe-card border flex items-center justify-center text-zinc-200 transition-transform active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 vibe-text-accent" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full vibe-cta-primary font-mono text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Navigation Drawer"
            className="min-h-[42px] min-w-[40px] rounded-2xl vibe-card border flex items-center justify-center text-zinc-200 transition-transform active:scale-95"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
