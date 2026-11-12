import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Sparkles,
  MapPin,
  Dices,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  PlusCircle,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { ALL_MEET_CATEGORIES, pickRandomMeet } from '../utils/meetLogic';
import { MeetCategory } from '../types/meet';

interface GroundedVenue {
  title: string;
  area: string;
  uri: string;
  snippet: string;
}

export const CreateAndRandomModals: React.FC = () => {
  const {
    meets,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isRandomModalOpen,
    setIsRandomModalOpen,
    createNewMeet,
    initiateJoinMeet,
    setSelectedMeetId,
    setIsMeetSheetOpen,
  } = useMeet();

  // Create Meet Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MeetCategory>('Community');
  const [venueName, setVenueName] = useState('Anna Nagar Tower Park');
  const [area, setArea] = useState('Anna Nagar');
  const [dateTimeLabel, setDateTimeLabel] = useState('6:30pm, 26th Aug');
  const [escrowAmount, setEscrowAmount] = useState<number>(100);
  const [maxSpots, setMaxSpots] = useState<number>(12);
  const [isSafeguardPlus, setIsSafeguardPlus] = useState<boolean>(true);
  const [formError, setFormError] = useState<string>('');

  // Gemini Smart Venue Search State
  const [venueQuery, setVenueQuery] = useState('');
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);
  const [groundedVenues, setGroundedVenues] = useState<GroundedVenue[]>([]);

  // Gemini Flyer Generator State
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGeneratingFlyer, setIsGeneratingFlyer] = useState(false);
  const [generatedFlyerUrl, setGeneratedFlyerUrl] = useState<string | undefined>(undefined);

  // Random Meet Matcher State
  const [isRolling, setIsRolling] = useState(false);
  const [randomMatch, setRandomMatch] = useState(() => meets[0]);

  const handleSearchChennaiVenues = async () => {
    setIsSearchingVenues(true);
    try {
      const res = await fetch('/api/ai/venue-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: venueQuery || `${category} meetup in Chennai`,
        }),
      });
      const data = await res.json();
      setGroundedVenues(data.places || []);
    } catch {
      setGroundedVenues([
        {
          title: 'Anna Nagar Tower Park Amphitheatre',
          area: 'Anna Nagar, Chennai',
          uri: 'https://www.google.com/maps/search/?api=1&query=Anna+Nagar+Tower+Park+Chennai',
          snippet: 'Verified public park with active lighting.',
        },
      ]);
    } finally {
      setIsSearchingVenues(false);
    }
  };

  const handleGenerateFlyer = async () => {
    setIsGeneratingFlyer(true);
    try {
      const res = await fetch('/api/ai/flyer-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || `${category} Meet @ ${venueName}`,
          venue: venueName,
          category,
          aspectRatio,
          imageSize,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedFlyerUrl(data.imageUrl);
      } else {
        // Clean SVG data URI poster fallback
        const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#064E3B"/><stop offset="100%" stop-color="#09090B"/></linearGradient></defs><rect width="600" height="340" fill="url(#g)"/><circle cx="480" cy="80" r="95" fill="#10B981" opacity="0.18"/><text x="36" y="130" fill="#10B981" font-family="sans-serif" font-size="18" font-weight="bold">MEET &amp; GREET CHENNAI</text><text x="36" y="185" fill="#FFFFFF" font-family="sans-serif" font-size="32" font-weight="bold">${(
          title || category + ' Meet'
        ).slice(0, 26)}</text><text x="36" y="230" fill="#A1A1AA" font-family="sans-serif" font-size="20">${venueName.slice(
          0,
          32
        )}</text></svg>`;
        setGeneratedFlyerUrl(
          `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`
        );
      }
    } catch {
      // ignore
    } finally {
      setIsGeneratingFlyer(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a meet title (e.g., Filter Coffee & Code Jam).');
      return;
    }
    if (!venueName.trim()) {
      setFormError('Please enter a Chennai venue name.');
      return;
    }
    setFormError('');

    createNewMeet({
      title: title.trim(),
      subtitle: `${category} Meet · Hosted by Jatin Kishore`,
      category,
      typeLabel: `${category} Meet`,
      venueName: venueName.trim(),
      area: area.trim() || 'Chennai',
      address: `${venueName.trim()}, ${area.trim() || 'Chennai'}`,
      distanceKm: 2.1,
      dateTimeLabel,
      dateISO: '2026-08-26',
      time24: '18:30',
      arriveMinutes: 6,
      transportMode: 'Rapido',
      escrowAmount,
      maxSpots,
      isSafeguardPlus,
      isLateNight: false,
      ageGroup: 'All',
      genderGroup: 'Both',
      geofenceRadiusMeters: 200,
      coordinates: {
        lat: 13.085,
        lng: 80.22,
        mapX: 46,
        mapY: 42,
      },
      customFlyerUrl: generatedFlyerUrl,
      highlights: [
        escrowAmount > 0
          ? `₹${escrowAmount} refundable Escrow Deposit`
          : 'Free community entry',
        'DigiLocker KYC verified host',
      ],
    });
    setTitle('');
    setGeneratedFlyerUrl(undefined);
  };

  const triggerRandomRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const picked = pickRandomMeet(meets, randomMatch?.id);
      if (picked) setRandomMatch(picked);
      setIsRolling(false);
    }, 350);
  };

  return (
    <>
      {/* 1. Create Meet Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-label="Create a New Chennai Meet"
              className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#121215] border border-white/15 max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">
                    + Create Chennai Meet
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Configure ₹ Escrow, Safeguard+ Geofence &amp; AI Venue Search
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  aria-label="Close Create Meet Modal"
                  className="min-h-[40px] min-w-[40px] rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-xs font-semibold text-zinc-200 block mb-1">
                    Meet Title *
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Besant Nagar Board Games & Filter Coffee"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-semibold text-zinc-200 block mb-1">
                      Category
                    </span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MeetCategory)}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white"
                    >
                      {ALL_MEET_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-zinc-200 block mb-1">
                      Date &amp; Time
                    </span>
                    <input
                      type="text"
                      value={dateTimeLabel}
                      onChange={(e) => setDateTimeLabel(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white font-mono"
                    />
                  </label>
                </div>

                {/* Smart Chennai Venue Search (Google Maps Grounding) */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      Smart Chennai Venue Grounding (Google Maps)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={venueQuery}
                      onChange={(e) => setVenueQuery(e.target.value)}
                      placeholder="Ask AI for safe parks/cafes in Anna Nagar, OMR..."
                      className="flex-1 min-h-[40px] px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleSearchChennaiVenues}
                      disabled={isSearchingVenues}
                      className="min-h-[40px] px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300 shrink-0"
                    >
                      {isSearchingVenues ? 'Searching...' : 'Find Spots'}
                    </button>
                  </div>

                  {groundedVenues.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {groundedVenues.map((v, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-between gap-2 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setVenueName(v.title);
                              setArea(v.area);
                            }}
                            className="text-left flex-1 min-w-0"
                          >
                            <div className="font-semibold text-zinc-100 truncate">
                              {v.title}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate">
                              {v.snippet}
                            </div>
                          </button>
                          <a
                            href={v.uri}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${v.title} on Google Maps`}
                            className="p-1.5 rounded-lg bg-zinc-900 text-emerald-400 hover:text-emerald-300 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="Venue Name"
                      className="min-h-[40px] px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Neighborhood (e.g. Anna Nagar)"
                      className="min-h-[40px] px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Escrow & Group Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block mb-1">
                      ₹ Escrow Deposit
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[0, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setEscrowAmount(amt)}
                          className={`min-h-[40px] rounded-xl font-mono text-xs font-bold border ${
                            escrowAmount === amt
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : 'bg-zinc-900 border-white/10 text-zinc-400'
                          }`}
                        >
                          {amt === 0 ? 'Free' : `₹${amt}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold text-zinc-200 block mb-1">
                      Max Spots
                    </span>
                    <input
                      type="number"
                      min={2}
                      max={250}
                      value={maxSpots}
                      onChange={(e) => setMaxSpots(Number(e.target.value) || 10)}
                      className="w-full min-h-[40px] px-3 rounded-xl bg-zinc-900 border border-white/15 font-mono text-xs text-white"
                    />
                  </label>
                </div>

                {/* AI Meet Flyer Generator (with aspect ratio & resolution controls) */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      AI Meet Flyer Generator
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateFlyer}
                      disabled={isGeneratingFlyer}
                      className="min-h-[34px] px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300 inline-flex items-center gap-1"
                    >
                      {isGeneratingFlyer ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Generate Flyer
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <select
                      aria-label="Flyer Aspect Ratio"
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-zinc-200 font-mono"
                    >
                      {['16:9', '4:3', '1:1', '3:4', '9:16'].map((ar) => (
                        <option key={ar} value={ar}>
                          Ratio {ar}
                        </option>
                      ))}
                    </select>

                    <select
                      aria-label="Flyer Image Size"
                      value={imageSize}
                      onChange={(e) =>
                        setImageSize(e.target.value as '1K' | '2K' | '4K')
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-zinc-200 font-mono"
                    >
                      {(['1K', '2K', '4K'] as const).map((sz) => (
                        <option key={sz} value={sz}>
                          Size {sz}
                        </option>
                      ))}
                    </select>
                  </div>

                  {generatedFlyerUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 h-28 bg-zinc-950">
                      <img
                        src={generatedFlyerUrl}
                        alt="Generated Meet Flyer"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {formError && (
                  <p className="text-xs text-rose-400 font-medium">{formError}</p>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-sm flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publish Meet to Chennai Feed
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Random Meet Dice Serendipity Modal (Mapped from Doodle Dice icon) */}
      <AnimatePresence>
        {isRandomModalOpen && randomMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRandomModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-label="Random Chennai Meet Matcher"
              className="relative z-10 w-full max-w-sm rounded-3xl bg-[#121215] border border-white/15 p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dices className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-display font-bold text-base text-white">
                    Random Meet Dice Match
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRandomModalOpen(false)}
                  aria-label="Close Random Meet Modal"
                  className="min-h-[38px] min-w-[38px] rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="text-emerald-400 font-semibold">
                    {randomMatch.typeLabel}
                  </span>
                  <span className="font-mono">{randomMatch.distanceKm} km away</span>
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  {randomMatch.title}
                </h3>
                <p className="text-xs text-zinc-300">
                  {randomMatch.venueName} · {randomMatch.dateTimeLabel}
                </p>
                <div className="pt-1 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">
                    Spots: {randomMatch.occupiedSpots}/{randomMatch.maxSpots}
                  </span>
                  <span className="text-amber-300 font-bold">
                    {randomMatch.escrowAmount === 0
                      ? '₹ Free'
                      : `₹${randomMatch.escrowAmount} Escrow`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerRandomRoll}
                  className="min-h-[44px] px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
                >
                  <Dices className={`w-4 h-4 text-emerald-400 ${isRolling ? 'animate-spin' : ''}`} />
                  Roll Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRandomModalOpen(false);
                    setSelectedMeetId(randomMatch.id);
                    initiateJoinMeet(randomMatch);
                  }}
                  className="flex-1 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-xs"
                >
                  Join Match Now →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
