import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  Navigation,
  Sparkles,
  CheckCircle2,
  QrCode,
  Loader2,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { calculateOccupancyPercent, calculateFlakeRedistribution } from '../utils/meetLogic';

export const BottomSheetMeetDetails: React.FC = () => {
  const {
    selectedMeet,
    isMeetSheetOpen,
    setIsMeetSheetOpen,
    initiateJoinMeet,
    setRoute,
  } = useMeet();

  const [isJoining, setIsJoining] = useState(false);

  if (!selectedMeet) return null;

  const occupancyPct = calculateOccupancyPercent(
    selectedMeet.occupiedSpots,
    selectedMeet.maxSpots
  );
  const flakeMath = calculateFlakeRedistribution(
    selectedMeet.escrowAmount || 100,
    2,
    Math.max(2, selectedMeet.occupiedSpots)
  );

  const handleJoinClick = () => {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      initiateJoinMeet(selectedMeet);
    }, 280);
  };

  return (
    <AnimatePresence>
      {isMeetSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMeetSheetOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${selectedMeet.title}`}
            className="relative z-10 w-full max-w-lg rounded-t-3xl bg-[#121215] border-t border-white/15 p-5 max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {/* Drag Handle */}
            <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4" />

            {/* Top Row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <span className="font-semibold text-emerald-400">
                    {selectedMeet.typeLabel}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{selectedMeet.distanceKm} km away</span>
                  <span>·</span>
                  <span>Arrive in {selectedMeet.arriveMinutes}m ({selectedMeet.transportMode})</span>
                </div>
                <h2 className="font-display font-bold text-xl text-white">
                  {selectedMeet.title}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">{selectedMeet.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMeetSheetOpen(false)}
                aria-label="Close Meet Details"
                className="min-h-[44px] min-w-[44px] rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Host & Reliability Strip */}
            <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-display font-bold text-sm text-emerald-300">
                  {selectedMeet.hostAvatarSeed}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-zinc-100">
                      {selectedMeet.hostName}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    Host UID: {selectedMeet.hostUid} · DigiLocker KYC Verified
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-base text-emerald-400">
                  {selectedMeet.hostReliability}/100
                </div>
                <div className="text-[10px] text-zinc-400">Reliability</div>
              </div>
            </div>

            {/* Venue, Time & Occupancy Details */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Schedule
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  {selectedMeet.dateTimeLabel}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Age: {selectedMeet.ageGroup} · {selectedMeet.genderGroup}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Chennai Venue
                </div>
                <div className="text-sm font-semibold text-zinc-100 truncate">
                  {selectedMeet.venueName}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {selectedMeet.address}
                </div>
              </div>
            </div>

            {/* Live Occupancy Bar */}
            <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900/60 border border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="inline-flex items-center gap-1.5 text-zinc-200 font-medium">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Group Occupancy
                </span>
                <span className="font-mono font-bold text-zinc-100">
                  {selectedMeet.occupiedSpots} / {selectedMeet.maxSpots} spots ({occupancyPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${occupancyPct}%` }}
                />
              </div>
            </div>

            {/* Escrow & Safeguard+ Policy Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedMeet.escrowAmount > 0
                    ? `₹${selectedMeet.escrowAmount} Refundable Commitment Escrow`
                    : 'Zero-Cost Community Meet · QR Check-In Active'}
                </span>
                <span className="font-mono text-xs text-emerald-400">
                  {selectedMeet.geofenceRadiusMeters}m Geofence
                </span>
              </div>

              <ul className="space-y-1 text-xs text-zinc-300">
                {selectedMeet.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{h}</span>
                  </li>
                ))}
                {selectedMeet.escrowAmount > 0 && (
                  <li className="flex items-start gap-2 text-amber-300/90">
                    <span className="mt-0.5">•</span>
                    <span>
                      Flake Protection: If 2 attendees no-show, punctual members automatically earn{' '}
                      <strong className="font-mono">+₹{flakeMath.perAttendeeCredit}</strong> each in their wallet.
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleJoinClick}
                disabled={isJoining}
                className="flex-1 min-h-[48px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-[0.98]"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : selectedMeet.checkedInByUser ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Attendance Verified · View Active Meet
                  </>
                ) : selectedMeet.joinedByUser ? (
                  <>
                    <QrCode className="w-4 h-4" />
                    Open Rolling TOTP QR Check-In
                  </>
                ) : selectedMeet.escrowAmount > 0 ? (
                  <>
                    Join &amp; Lock ₹{selectedMeet.escrowAmount} Escrow
                  </>
                ) : (
                  <>
                    Join Free Meet &amp; Get Check-In QR
                  </>
                )}
              </button>

              {selectedMeet.isLateNight && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMeetSheetOpen(false);
                    setRoute('/meet/verify-pose');
                  }}
                  className="min-h-[48px] px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-amber-300 flex items-center gap-1.5 shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Pose Check
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
