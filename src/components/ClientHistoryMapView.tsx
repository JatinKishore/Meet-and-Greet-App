import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  CheckCircle2,
  XCircle,
  Crown,
  Calendar,
  Compass,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { ClientMapStatusFilter, TrackHistoryEntry } from '../types/meet';
import {
  filterClientHistoryByStatus,
  summarizeClientMapStats,
} from '../utils/meetLogic';

export const ClientHistoryMapView: React.FC = () => {
  const {
    user,
    selectedHistoryId,
    setSelectedHistoryId,
    setRoute,
    meets,
    setSelectedMeetId,
  } = useMeet();

  const [statusFilter, setStatusFilter] = useState<ClientMapStatusFilter>('All');

  const history = user.trackRecord.history;
  const stats = useMemo(() => summarizeClientMapStats(history), [history]);
  const filteredHistory = useMemo(
    () => filterClientHistoryByStatus(history, statusFilter),
    [history, statusFilter]
  );

  const selectedEntry: TrackHistoryEntry | undefined = useMemo(() => {
    return (
      filteredHistory.find((item) => item.id === selectedHistoryId) ||
      filteredHistory[0] ||
      history[0]
    );
  }, [filteredHistory, history, selectedHistoryId]);

  const statusTabs: {
    id: ClientMapStatusFilter;
    label: string;
    count: number;
    dotColor: string;
  }[] = [
    { id: 'All', label: 'All', count: stats.total, dotColor: 'bg-zinc-300' },
    { id: 'Joined', label: 'Joined', count: stats.joined, dotColor: 'bg-emerald-400' },
    { id: 'Hosted', label: 'Hosted', count: stats.hosted, dotColor: 'bg-amber-400' },
    { id: 'Missed', label: 'Missed', count: stats.missed, dotColor: 'bg-rose-400' },
  ];

  // Build SVG polyline points connecting client's visited places
  const trajectoryPoints = useMemo(() => {
    return filteredHistory
      .map((item) => `${(item.coordinates.mapX / 100) * 400},${(item.coordinates.mapY / 100) * 320}`)
      .join(' ');
  }, [filteredHistory]);

  const getStatusBadgeStyle = (status: TrackHistoryEntry['status'], isSelected: boolean) => {
    if (isSelected) {
      if (status === 'Joined') return 'bg-emerald-500 text-zinc-950 border-white ring-2 ring-emerald-400/50';
      if (status === 'Hosted') return 'bg-amber-400 text-zinc-950 border-white ring-2 ring-amber-300/50';
      return 'bg-rose-500 text-white border-white ring-2 ring-rose-400/50';
    }
    if (status === 'Joined') {
      return 'bg-[#121215]/95 text-emerald-300 border-emerald-500/50';
    }
    if (status === 'Hosted') {
      return 'bg-[#121215]/95 text-amber-300 border-amber-400/50';
    }
    return 'bg-[#121215]/95 text-rose-300 border-rose-500/50';
  };

  const handleFindAvailableAtVenue = (entry: TrackHistoryEntry) => {
    const matchingMeet = meets.find(
      (m) =>
        m.venueName.toLowerCase().includes(entry.venueName.toLowerCase().split(' ')[0]) ||
        m.area.toLowerCase().includes(entry.area.toLowerCase().split(',')[0])
    );
    if (matchingMeet) {
      setSelectedMeetId(matchingMeet.id);
    }
    setRoute('/home/map');
  };

  return (
    <section
      aria-label="Client Previous Meets Map"
      className="space-y-6"
    >
      {/* Card 1: Map Header, Status Filter Pills & Personal Chennai Map Canvas */}
      <div className="rounded-2xl bg-[#121215]/85 backdrop-blur-md border border-white/10 p-6 space-y-5">
        {/* Header Chunk */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono font-semibold text-emerald-300">
                CLIENT MAP · MY PLACES
              </span>
              <span className="font-mono text-xs text-zinc-400">
                {filteredHistory.length} {filteredHistory.length === 1 ? 'meet' : 'meets'}
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-white mt-1.5">
              {user.name.split(' ')[0]}&apos;s Previous Meets &amp; Status Map
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Showing only the Chennai places you have joined, hosted, or missed — separate from the public available meets map.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRoute('/home/map')}
            className="min-h-[40px] px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-semibold text-zinc-300 inline-flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Available Map
          </button>
        </div>

        {/* Status Filter Pills (All | Joined | Hosted | Missed) */}
        <div
          role="tablist"
          aria-label="Filter previous meets by status"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {statusTabs.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(tab.id)}
                className={`min-h-[42px] px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                  active
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                    : 'bg-zinc-900/80 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${tab.dotColor} shrink-0`} />
                <span>{tab.label}</span>
                <span className="font-mono text-[10px] opacity-80">({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Dedicated Client History Chennai Map Canvas */}
        <div className="relative h-[320px] rounded-2xl bg-[#0A0D12] border border-white/15 overflow-hidden shadow-inner">
          <svg
            viewBox="0 0 400 320"
            className="w-full h-full object-cover select-none"
            aria-label="Client Previous Meets Chennai Map"
          >
            <defs>
              <pattern
                id="clientMapGrid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 28 0 L 0 0 0 28"
                  fill="none"
                  stroke="rgba(255,255,255,0.035)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Urban Grid */}
            <rect width="400" height="320" fill="url(#clientMapGrid)" />

            {/* Bay of Bengal Coastline */}
            <path
              d="M 315 0 Q 305 90 298 165 T 288 320 L 400 320 L 400 0 Z"
              fill="#071921"
              stroke="#0E3A47"
              strokeWidth="1.5"
            />
            <text
              x="332"
              y="155"
              fill="rgba(56, 189, 248, 0.32)"
              fontSize="9"
              fontFamily="JetBrains Mono"
              transform="rotate(84 332 155)"
            >
              BAY OF BENGAL · CHENNAI COAST
            </text>

            {/* Cooum & Adyar Rivers */}
            <path
              d="M 0 115 Q 110 120 195 105 T 302 110"
              fill="none"
              stroke="#0D313D"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 40 235 Q 150 220 220 230 T 293 225"
              fill="none"
              stroke="#0D313D"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Visited Neighborhood Labels */}
            <text x="20" y="75" fill="rgba(255,255,255,0.28)" fontSize="8" fontFamily="JetBrains Mono">
              PADI HUB
            </text>
            <text x="108" y="115" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
              ANNA NAGAR
            </text>
            <text x="205" y="52" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
              NEHRU STADIUM
            </text>
            <text x="218" y="182" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
              MARINA LIGHTHOUSE
            </text>
            <text x="168" y="268" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
              TIDEL PARK · OMR
            </text>

            {/* Client Trajectory Path Connecting Visited Places */}
            {filteredHistory.length > 1 && (
              <polyline
                points={trajectoryPoints}
                fill="none"
                stroke="rgba(16, 185, 129, 0.35)"
                strokeWidth="2"
                strokeDasharray="5 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* Interactive Client Previous Meet Pins with Meet Status */}
          {filteredHistory.map((entry) => {
            const isSelected = selectedEntry?.id === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedHistoryId(entry.id)}
                style={{
                  left: `${entry.coordinates.mapX}%`,
                  top: `${entry.coordinates.mapY}%`,
                }}
                aria-label={`Previous Meet Pin: ${entry.meetTitle} at ${entry.venueName} (${entry.status})`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex flex-col items-center justify-center group focus:outline-none ${
                  isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                } transition-transform`}
              >
                <div
                  className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold flex items-center gap-1 shadow-lg border whitespace-nowrap ${getStatusBadgeStyle(
                    entry.status,
                    isSelected
                  )}`}
                >
                  {entry.status === 'Joined' && (
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                  )}
                  {entry.status === 'Hosted' && (
                    <Crown className="w-3 h-3 shrink-0" />
                  )}
                  {entry.status === 'Missed' && (
                    <XCircle className="w-3 h-3 shrink-0" />
                  )}
                  <span>{entry.status}</span>
                </div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/85 text-[9px] text-zinc-200 font-medium max-w-[105px] truncate border border-white/10">
                  {entry.venueName}
                </span>
              </button>
            );
          })}

          {/* Bottom Map Legend Bar */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Joined ({stats.joined})
              </span>
              <span className="inline-flex items-center gap-1 text-amber-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Hosted ({stats.hosted})
              </span>
              <span className="inline-flex items-center gap-1 text-rose-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Missed ({stats.missed})
              </span>
            </div>

            <div className="pointer-events-auto px-2.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-emerald-400">
              {stats.netEscrowDelta >= 0
                ? `+₹${stats.netEscrowDelta} Net`
                : `-₹${Math.abs(stats.netEscrowDelta)} Net`}
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Selected Previous Meet Status Details Card */}
      {selectedEntry && (
        <motion.div
          key={selectedEntry.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[#121215]/85 backdrop-blur-md border border-white/10 p-6 space-y-5"
        >
          {/* Zone 1: Status Badge & Escrow Outcome */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-1.5 border ${
                  selectedEntry.status === 'Joined'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : selectedEntry.status === 'Hosted'
                    ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                }`}
              >
                {selectedEntry.status === 'Joined' && (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                {selectedEntry.status === 'Hosted' && (
                  <Crown className="w-3.5 h-3.5" />
                )}
                {selectedEntry.status === 'Missed' && (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                Status: {selectedEntry.status}
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-zinc-300">
                {selectedEntry.category}
              </span>
            </div>

            <div className="font-mono text-xs font-bold">
              {selectedEntry.escrowDelta > 0 ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  +₹{selectedEntry.escrowDelta} Credit
                </span>
              ) : selectedEntry.escrowDelta < 0 ? (
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300">
                  -₹{Math.abs(selectedEntry.escrowDelta)} Penalty
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-white/10 text-zinc-400">
                  ₹0 Free Meet
                </span>
              )}
            </div>
          </div>

          {/* Zone 2: Title, Venue & Date Chunk */}
          <div className="space-y-3">
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                {selectedEntry.meetTitle}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedEntry.status === 'Joined'
                  ? 'Verified via rolling 30s TOTP QR scan at the venue.'
                  : selectedEntry.status === 'Hosted'
                  ? 'You hosted this meet and verified attendee check-ins.'
                  : 'Missed check-in window — ₹100 escrow redistributed to punctual attendees.'}
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-zinc-100">
                    {selectedEntry.venueName}
                  </div>
                  <div className="text-zinc-400 text-[11px]">{selectedEntry.area}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono font-semibold text-zinc-100">
                    {selectedEntry.dateLabel}
                  </div>
                  <div className="text-zinc-400 text-[11px] font-mono">
                    {selectedEntry.timeLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zone 3: Action Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleFindAvailableAtVenue(selectedEntry)}
              className="flex-1 min-h-[48px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-transform active:scale-[0.99]"
            >
              <span>Find Available Meets Near {selectedEntry.venueName.split(' ')[0]}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Card 3: Interactive List of All Client Previous Meets on Map */}
      <div className="rounded-2xl bg-[#121215]/85 backdrop-blur-md border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="font-display text-base font-semibold tracking-tight text-white">
            Previous Meets Pin Directory
          </h3>
          <span className="text-xs text-zinc-400">Tap to highlight on map</span>
        </div>

        <div className="space-y-2.5">
          {filteredHistory.map((item) => {
            const isSelected = selectedEntry?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedHistoryId(item.id)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm text-white truncate">
                      {item.meetTitle}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400 shrink-0">
                      {item.dateLabel}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">
                      {item.venueName} · {item.area}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                      item.status === 'Joined'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.status === 'Hosted'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {item.status}
                  </span>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {item.escrowDelta > 0
                      ? `+₹${item.escrowDelta}`
                      : item.escrowDelta < 0
                      ? `-₹${Math.abs(item.escrowDelta)}`
                      : '₹0 Free'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
