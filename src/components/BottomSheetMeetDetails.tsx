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
  ScanLine,
  Crown,
  Loader2,
  Flame,
  Zap,
  Type,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import {
  calculateOccupancyPercent,
  calculateFlakeRedistribution,
  getEventCtaCopy,
  isMeetHostedByUser,
} from '../utils/meetLogic';
import { resolveMeetTypography } from '../utils/typographyStyles';

export const BottomSheetMeetDetails: React.FC = () => {
  const {
    user,
    selectedMeet,
    isMeetSheetOpen,
    setIsMeetSheetOpen,
    initiateJoinMeet,
    setRoute,
  } = useMeet();

  const [isJoining, setIsJoining] = useState(false);

  if (!selectedMeet) return null;

  const isHost = isMeetHostedByUser(selectedMeet, user.uid);
  const ctaCopy = getEventCtaCopy(selectedMeet);
  const occupancyPct = calculateOccupancyPercent(
    selectedMeet.occupiedSpots,
    selectedMeet.maxSpots
  );
  const flakeMath = calculateFlakeRedistribution(
    selectedMeet.escrowAmount || 100,
    2,
    Math.max(2, selectedMeet.occupiedSpots)
  );
  const typo = resolveMeetTypography(
    selectedMeet.category,
    selectedMeet.id,
    selectedMeet.typographyVariant
  );

  const heroImage =
    selectedMeet.customFlyerUrl ||
    selectedMeet.coverPhotoUrl ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80';

  const handleJoinClick = () => {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      initiateJoinMeet(selectedMeet);
    }, 260);
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${selectedMeet.title}`}
            className="relative z-10 w-full max-w-lg rounded-t-3xl vibe-card backdrop-blur-xl border-t overflow-hidden max-h-[88vh] overflow-y-auto shadow-2xl"
          >
            {/* Hero Photography Banner with Floating Close Button */}
            <div className="relative h-52 w-full bg-zinc-900">
              <img
                src={heroImage}
                alt={selectedMeet.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Flat dark scrim (no gradients) */}
              <div className="absolute inset-0 bg-black/55" />

              {/* Drag Handle */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/50 rounded-full" />

              <button
                type="button"
                onClick={() => setIsMeetSheetOpen(false)}
                aria-label="Close Meet Details"
                className="hero-photo-text absolute top-4 right-4 min-h-[40px] min-w-[40px] rounded-full bg-black/65 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:scale-105 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 inset-x-5">
                <div className="flex items-center gap-2 text-xs mb-1.5 flex-wrap">
                  <span className="hero-photo-text px-3 py-0.5 rounded-full vibe-cta-primary font-display font-bold text-[11px]">
                    {selectedMeet.typeLabel}
                  </span>
                  <span className="hero-photo-text px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 font-mono text-[11px]">
                    {selectedMeet.distanceKm} km · ~{selectedMeet.arriveMinutes}m ({selectedMeet.transportMode})
                  </span>
                  <span className="hero-photo-text px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white/90 text-[10px] font-mono inline-flex items-center gap-1">
                    <Type className="w-3 h-3" />
                    {typo.badgeLabel}
                  </span>
                </div>
                <h2
                  className={`hero-photo-text text-xl text-white leading-snug ${typo.titleClassName}`}
                  style={{ fontFamily: typo.fontFamily }}
                >
                  {selectedMeet.title}
                </h2>
                <p className="hero-photo-text text-xs text-zinc-200 mt-0.5">
                  {selectedMeet.subtitle}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Host & Vibe Score Strip */}
              <div className="p-4 rounded-3xl vibe-card-subtle border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full vibe-cta-primary flex items-center justify-center font-display font-extrabold text-sm shadow-md">
                    {selectedMeet.hostAvatarSeed}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-white">
                        {selectedMeet.hostName}
                      </span>
                      <ShieldCheck className="w-4 h-4 vibe-text-accent" />
                      {isHost && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full vibe-cta-primary text-[10px] font-bold">
                          <Crown className="w-3 h-3" />
                          You Host
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400">
                      {isHost
                        ? 'Your Host Pass is live for squad check-ins'
                        : 'Verified Host · Tap your Pass at venue'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-base vibe-text-accent">
                    {selectedMeet.hostReliability}%
                  </div>
                  <div className="text-[10px] text-zinc-400">Vibe Score</div>
                </div>
              </div>

              {/* Venue & Schedule Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-3xl vibe-card-subtle border">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <Clock className="w-3.5 h-3.5 vibe-text-accent" />
                    When
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedMeet.dateTimeLabel}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Crowd: {selectedMeet.ageGroup} · {selectedMeet.genderGroup}
                  </div>
                </div>

                <div className="p-3.5 rounded-3xl vibe-card-subtle border">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 vibe-text-accent" />
                    Hotspot
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {selectedMeet.venueName}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {selectedMeet.address}
                  </div>
                </div>
              </div>

              {/* Squad Energy Bar */}
              <div className="p-4 rounded-3xl vibe-card-subtle border">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="inline-flex items-center gap-1.5 text-white font-semibold">
                    <Users className="w-4 h-4 vibe-text-accent" />
                    Squad Lineup
                  </span>
                  <span className="font-mono font-bold text-white">
                    {selectedMeet.occupiedSpots} / {selectedMeet.maxSpots} joined ({occupancyPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-300 vibe-cta-primary"
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>

              {/* Event Pass & No-Flake Perks Box */}
              <div className="p-4 rounded-3xl vibe-card-subtle border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold vibe-text-accent flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    {selectedMeet.escrowAmount > 0
                      ? `${ctaCopy.badgeLabel} (100% Back at Venue)`
                      : ctaCopy.badgeLabel}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    {selectedMeet.geofenceRadiusMeters}m Safe-Zone
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {selectedMeet.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="vibe-text-accent mt-0.5">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                  {selectedMeet.escrowAmount > 0 && (
                    <li className="flex items-start gap-2 text-amber-400 font-medium">
                      <span className="mt-0.5">★</span>
                      <span>
                        No-Flake Bonus: If 2 people flake, everyone who shows up gets{' '}
                        <strong className="font-mono">+₹{flakeMath.perAttendeeCredit}</strong> bonus cashback!
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* High-Energy Pill CTA Footer */}
              <div className="pt-1 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleJoinClick}
                  disabled={isJoining}
                  className="flex-1 min-h-[52px] px-5 rounded-full vibe-cta-primary font-display font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reserving your spot...
                    </>
                  ) : isHost ? (
                    <>
                      <QrCode className="w-4 h-4 stroke-[2.5]" />
                      Show My Host Pass
                    </>
                  ) : selectedMeet.checkedInByUser ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      You’re In! · View Check-In Pass
                    </>
                  ) : selectedMeet.joinedByUser ? (
                    <>
                      <ScanLine className="w-4 h-4 stroke-[2.5]" />
                      Show Pass to Host
                    </>
                  ) : selectedMeet.escrowAmount > 0 ? (
                    <>
                      <Zap className="w-4 h-4 stroke-[2.5]" />
                      {ctaCopy.primaryCta}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      {ctaCopy.primaryCta}
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
                    className="min-h-[52px] px-4 rounded-full vibe-card-subtle border text-xs font-bold text-amber-400 flex items-center gap-1.5 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Pose Check
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
