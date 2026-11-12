import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Sliders,
  ChevronUp,
  ChevronDown,
  PhoneCall,
  Car,
  Camera,
  QrCode,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { FeedViewState } from '../types/meet';

/* -------------------------------------------------------------------------- */
/* 1. Persistent Geofence Safe-Zone Banner & Breach SOS Modal                 */
/* -------------------------------------------------------------------------- */
export const GeofenceSosOverlay: React.FC = () => {
  const {
    selectedMeet,
    geofenceStatus,
    setGeofenceStatus,
    isSosModalOpen,
    setIsSosModalOpen,
    user,
    showToast,
  } = useMeet();

  const [cabDispatched, setCabDispatched] = useState(false);

  return (
    <>
      {/* Compact Geofence Status Strip inside mobile shell */}
      <div
        className={`px-4 py-2 border-b text-xs backdrop-blur-md flex items-center justify-between transition-colors ${
          geofenceStatus === 'breach'
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
            : 'vibe-card-subtle text-zinc-200'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {geofenceStatus === 'breach' ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          )}
          <span className="truncate font-medium">
            {geofenceStatus === 'breach'
              ? `ALERT: Left ${selectedMeet.geofenceRadiusMeters}m Safe Zone @ ${selectedMeet.venueName}`
              : `Safeguard+ Active: ${selectedMeet.geofenceRadiusMeters}m Geofence (${selectedMeet.venueName})`}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (geofenceStatus === 'breach') {
              setIsSosModalOpen(true);
            } else {
              setGeofenceStatus('breach');
              setIsSosModalOpen(true);
            }
          }}
          className={`ml-2 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold shrink-0 ${
            geofenceStatus === 'breach'
              ? 'bg-rose-500 text-white'
              : 'vibe-cta-primary'
          }`}
        >
          {geofenceStatus === 'breach' ? 'OPEN SOS' : 'SOS Monitor'}
        </button>
      </div>

      {/* Geofence Boundary Breach SOS Modal */}
      <AnimatePresence>
        {isSosModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSosModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-label="Geofence Boundary Breach SOS Alert"
              className="relative z-10 w-full max-w-sm rounded-3xl vibe-card border-2 border-rose-500/60 p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-500">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-white">
                      Geofence Boundary Breach SOS
                    </h2>
                    <p className="text-xs text-rose-500 font-mono font-semibold">
                      245m outside {selectedMeet.venueName} safe radius
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSosModalOpen(false)}
                  aria-label="Close SOS Modal"
                  className="min-h-[36px] min-w-[36px] rounded-xl vibe-card-subtle border flex items-center justify-center text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl vibe-card-subtle border space-y-2 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Guardian Telemetry:</span>
                  <span className="font-mono text-emerald-500 font-bold">
                    {user.guardianName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Live GPS Coordinates:</span>
                  <span className="font-mono text-zinc-200">
                    {selectedMeet.coordinates.lat.toFixed(4)}° N,{' '}
                    {selectedMeet.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>

              {cabDispatched && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-500 font-medium flex items-center gap-2">
                  <Car className="w-4 h-4 shrink-0" />
                  <span>
                    Safe-Return Cab Dispatched (TN-01-AB-4921 · Arriving in 3 mins). Live route shared with {user.guardianPhone}.
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setCabDispatched(true);
                    showToast(
                      'Emergency Safe-Cab Dispatched & Guardian Alerted',
                      `Live GPS link SMS sent to ${user.guardianPhone}.`,
                      'rose'
                    );
                  }}
                  className="w-full min-h-[46px] rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Alert Guardian ({user.guardianPhone}) &amp; Dispatch Safe Cab
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGeofenceStatus('safe');
                    setCabDispatched(false);
                    setIsSosModalOpen(false);
                    showToast(
                      'Marked Safe Inside Geofence',
                      'Boundary monitor reset to Safe status.',
                      'emerald'
                    );
                  }}
                  className="w-full min-h-[44px] rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-600 font-display font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I Am Safe (Return to {selectedMeet.geofenceRadiusMeters}m Zone)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Collapsible Floating "MVP Demo Controls" Pill                           */
/* -------------------------------------------------------------------------- */
export const MvpDemoControlsPill: React.FC = () => {
  const {
    feedViewState,
    setFeedViewState,
    setRoute,
    setGeofenceStatus,
    setIsSosModalOpen,
  } = useMeet();

  const [expanded, setExpanded] = useState(false);

  const viewStates: { id: FeedViewState; label: string }[] = [
    { id: 'populated', label: 'Populated' },
    { id: 'loading', label: 'Loading (Shimmer)' },
    { id: 'empty', label: 'Empty State' },
    { id: 'error', label: 'Offline Error' },
  ];

  return (
    <div className="fixed bottom-20 right-3 lg:bottom-5 lg:right-5 z-40">
      <div className="rounded-2xl vibe-card backdrop-blur-xl border shadow-2xl overflow-hidden max-w-xs">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full min-h-[42px] px-3.5 py-2 flex items-center justify-between gap-2.5 text-xs font-display font-bold text-white"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 vibe-text-accent" />
            MVP Demo Controls
          </span>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {expanded && (
          <div className="p-3.5 pt-2 border-t border-white/10 space-y-3 text-xs">
            {/* View State Switcher */}
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block mb-1.5">
                FEED VIEW STATE
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {viewStates.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setFeedViewState(st.id);
                      setRoute('/home');
                    }}
                    className={`min-h-[34px] px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                      feedViewState === st.id
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold'
                        : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-white/25'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Safety & Edge-Case Flow Triggers */}
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block mb-1.5">
                TRIGGER LIVE SAFETY &amp; ESCROW FLOWS
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setRoute('/meet/verify-pose')}
                  className="w-full min-h-[36px] px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 text-left flex items-center gap-2 text-[11px] font-medium"
                >
                  <Camera className="w-3.5 h-3.5 shrink-0" />
                  Simulate Late-Night Pose Check
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGeofenceStatus('breach');
                    setIsSosModalOpen(true);
                  }}
                  className="w-full min-h-[36px] px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 text-rose-300 text-left flex items-center gap-2 text-[11px] font-medium"
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  Simulate Geofence Boundary Breach SOS
                </button>

                <button
                  type="button"
                  onClick={() => setRoute('/onboarding/kyc')}
                  className="w-full min-h-[36px] px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-300 text-left flex items-center gap-2 text-[11px] font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  DigiLocker KYC &amp; Parental Gate
                </button>

                <button
                  type="button"
                  onClick={() => setRoute('/meet/active')}
                  className="w-full min-h-[36px] px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 text-left flex items-center gap-2 text-[11px] font-medium"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Rolling 30s TOTP QR &amp; Scanner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
