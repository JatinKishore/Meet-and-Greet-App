import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Shield,
  Users,
  Clock,
  LocateFixed,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { DistanceOption, MeetItem } from '../types/meet';

export const ChennaiMapView: React.FC = () => {
  const {
    filteredMeets,
    selectedMeet,
    setSelectedMeetId,
    setIsMeetSheetOpen,
    filters,
    setFilters,
    initiateJoinMeet,
    feedViewState,
  } = useMeet();

  const [locationGranted, setLocationGranted] = useState<boolean>(true);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);

  const handlePinClick = (meet: MeetItem) => {
    setSelectedMeetId(meet.id);
    setIsMeetSheetOpen(true);
  };

  const radiusOptions: DistanceOption[] = [5, 10, 20, 25];

  if (feedViewState === 'loading') {
    return (
      <div className="p-4 space-y-4" aria-label="Loading Map View">
        <div className="h-[340px] rounded-3xl bg-zinc-900 animate-pulse border border-white/10 flex items-center justify-center">
          <span className="text-xs font-mono text-zinc-500">
            Loading Chennai Vector Map Tiles...
          </span>
        </div>
        <div className="h-44 rounded-2xl bg-zinc-900 animate-pulse border border-white/10" />
      </div>
    );
  }

  return (
    <div className="px-3.5 pb-6 space-y-3.5">
      {/* Top Map Radius Control Strip (matches doodle "Map: 10km *") */}
      <div className="flex items-center justify-between gap-2 bg-[#121215] border border-white/10 rounded-2xl p-2.5">
        <div className="flex items-center gap-2">
          <LocateFixed className="w-4 h-4 text-emerald-400" />
          <span className="font-display font-bold text-xs text-white">
            Map: {filters.distanceKm === 25 ? '25km+' : `${filters.distanceKm}km`}
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            ({filteredMeets.length} pins)
          </span>
        </div>

        <div className="flex items-center gap-1">
          {radiusOptions.map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, distanceKm: km }))}
              className={`min-h-[32px] px-2.5 rounded-lg font-mono text-[11px] font-semibold transition-colors ${
                filters.distanceKm === km
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {km === 25 ? '25km+' : `${km}km`}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Dark-Mode Map of Chennai */}
      <div className="relative h-[320px] rounded-3xl bg-[#0C0F14] border border-white/15 overflow-hidden shadow-inner">
        {/* Stylized Chennai Coastline, Cooum/Adyar Rivers, Anna Nagar, Central & OMR Grid SVG */}
        <svg
          viewBox="0 0 400 320"
          className="w-full h-full object-cover select-none"
          aria-label="Interactive Chennai Meetup Map"
        >
          <defs>
            <radialGradient id="safeZoneGlow" cx="50%" cy="45%" r="45%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
            <pattern id="chennaiGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* Urban Grid */}
          <rect width="400" height="320" fill="url(#chennaiGrid)" />

          {/* Bay of Bengal East Coastline */}
          <path
            d="M 315 0 Q 305 90 298 165 T 288 320 L 400 320 L 400 0 Z"
            fill="#081C24"
            stroke="#0E3A47"
            strokeWidth="1.5"
          />
          <text
            x="332"
            y="155"
            fill="rgba(56, 189, 248, 0.35)"
            fontSize="9"
            fontFamily="JetBrains Mono"
            transform="rotate(84 332 155)"
          >
            BAY OF BENGAL · MARINA COAST
          </text>

          {/* Cooum & Adyar River Waterways */}
          <path
            d="M 0 115 Q 110 120 195 105 T 302 110"
            fill="none"
            stroke="#0E3A47"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 40 235 Q 150 220 220 230 T 293 225"
            fill="none"
            stroke="#0E3A47"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Major Chennai Arterials (Poonamallee High Rd, Inner Ring Rd, OMR, ECR) */}
          <path
            d="M 15 95 L 295 102 M 145 0 L 165 320 M 240 110 L 248 320"
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Neighborhood Labels */}
          <text x="65" y="75" fill="rgba(255,255,255,0.28)" fontSize="8" fontFamily="JetBrains Mono">
            PADI / AMBATTUR
          </text>
          <text x="115" y="118" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
            ANNA NAGAR
          </text>
          <text x="215" y="88" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
            NEHRU STADIUM
          </text>
          <text x="225" y="172" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
            MARINA BEACH
          </text>
          <text x="180" y="255" fill="rgba(255,255,255,0.32)" fontSize="8.5" fontFamily="JetBrains Mono">
            TIDEL PARK · OMR
          </text>

          {/* Active Radius Circle around Jatin's Live Location */}
          <circle
            cx="185"
            cy="140"
            r={
              filters.distanceKm === 5
                ? 55
                : filters.distanceKm === 10
                ? 92
                : filters.distanceKm === 20
                ? 125
                : 150
            }
            fill="url(#safeZoneGlow)"
            stroke="rgba(16, 185, 129, 0.45)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />

          {/* User Live GPS Center Dot */}
          <circle cx="185" cy="140" r="6" fill="#10B981" />
          <circle
            cx="185"
            cy="140"
            r="13"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>

        {/* Interactive Clustered MeetMarker Pins */}
        {filteredMeets.map((meet) => {
          const isSelected = selectedMeet?.id === meet.id;
          return (
            <button
              key={meet.id}
              type="button"
              onClick={() => handlePinClick(meet)}
              style={{
                left: `${meet.coordinates.mapX}%`,
                top: `${meet.coordinates.mapY}%`,
              }}
              aria-label={`Map Pin: ${meet.title} at ${meet.venueName}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex flex-col items-center justify-center group focus:outline-none z-10 ${
                isSelected ? 'z-20 scale-110' : 'hover:scale-105'
              } transition-transform`}
            >
              <div
                className={`px-2 py-1 rounded-xl font-mono text-[10px] font-bold flex items-center gap-1 shadow-lg border whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-500 text-zinc-950 border-white'
                    : meet.escrowAmount > 0
                    ? 'bg-[#121215]/95 text-amber-300 border-amber-400/50'
                    : 'bg-[#121215]/95 text-emerald-300 border-emerald-500/40'
                }`}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{meet.escrowAmount > 0 ? `₹${meet.escrowAmount}` : 'Free'}</span>
              </div>
              <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-zinc-200 font-medium max-w-[96px] truncate border border-white/10">
                {meet.title}
              </span>
            </button>
          );
        })}

        {/* Floating Map Legend & GPS Permission Toggle */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto px-2.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
              <Navigation className="w-3 h-3" />
              {locationGranted ? 'GPS Live: Egmore/Anna Nagar' : 'GPS Paused'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowPermissionPrompt(true)}
            className="pointer-events-auto min-h-[34px] px-2.5 py-1 rounded-xl bg-black/80 hover:bg-zinc-900 backdrop-blur-md border border-white/15 text-[10px] text-zinc-200 flex items-center gap-1"
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            GPS Settings
          </button>
        </div>
      </div>

      {/* Doodle Map Bottom Preview Card (Directly mapped from left-most sketch card in App Design.pdf) */}
      {selectedMeet && (
        <motion.div
          key={selectedMeet.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[#121215] border border-white/15 p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-emerald-400 font-semibold">
                  {selectedMeet.typeLabel}
                </span>
                <span>·</span>
                <span className="font-mono">{selectedMeet.distanceKm} km away</span>
                {selectedMeet.isSafeguardPlus && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <Shield className="w-3 h-3" /> Safeguard+
                    </span>
                  </>
                )}
              </div>
              <h3 className="font-display font-bold text-base text-white mt-0.5">
                {selectedMeet.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsMeetSheetOpen(true)}
              className="text-xs text-emerald-400 hover:underline font-medium shrink-0"
            >
              Full Sheet →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{selectedMeet.dateTimeLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">{selectedMeet.venueName}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                {selectedMeet.occupiedSpots}/{selectedMeet.maxSpots} spots
              </span>
            </div>
            <div className="font-mono font-semibold">
              {selectedMeet.escrowAmount === 0 ? (
                <span className="text-emerald-400">₹ free</span>
              ) : (
                <span className="text-amber-300">
                  ₹{selectedMeet.escrowAmount} Escrow Deposit
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => initiateJoinMeet(selectedMeet)}
            className="w-full min-h-[46px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-xs tracking-wide flex flex-col items-center justify-center transition-transform active:scale-[0.98]"
          >
            <span>
              {selectedMeet.checkedInByUser
                ? 'CHECKED IN · VIEW ACTIVE MEET'
                : selectedMeet.joinedByUser
                ? 'OPEN ROLLING TOTP QR CHECK-IN'
                : selectedMeet.escrowAmount > 0
                ? `JOIN & LOCK ₹${selectedMeet.escrowAmount} ESCROW`
                : 'JOIN (FREE COMMUNITY MEET)'}
            </span>
            <span className="text-[10px] font-sans font-normal text-zinc-900">
              (tap pin or button for full escrow &amp; host reliability details)
            </span>
          </button>
        </motion.div>
      )}

      {/* Location Permission Modal (Required by PRD for Map View) */}
      {showPermissionPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[#121215] border border-white/15 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <LocateFixed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Safeguard+ Live GPS &amp; Geofencing
                </h3>
                <p className="text-xs text-zinc-400">
                  Chennai Hyper-Local Radius Calibration
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Meet &amp; Greet uses high-accuracy GPS only during active meets to verify
              venue check-ins and monitor your safe-zone boundary.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLocationGranted(true);
                  setShowPermissionPrompt(false);
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-emerald-500 text-zinc-950 font-display font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Allow Precise GPS
              </button>
              <button
                type="button"
                onClick={() => setShowPermissionPrompt(false)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
