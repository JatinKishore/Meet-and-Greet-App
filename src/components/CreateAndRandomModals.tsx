import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Sparkles,
  MapPin,
  Dices,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Plus,
  PlusCircle,
  Trash2,
  SlidersHorizontal,
  Calendar,
  Clock,
  Check,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import {
  ALL_MEET_CATEGORIES,
  formatHostDateTimeLabel,
  formatPresetLabel,
  pickRandomMeetByPreset,
} from '../utils/meetLogic';
import { CATEGORY_TYPOGRAPHY_MAP } from '../utils/typographyStyles';
import {
  MeetCategory,
  RandomMeetPreset,
  TypographyStyleVariant,
} from '../types/meet';

interface GroundedVenue {
  title: string;
  area: string;
  uri: string;
  snippet: string;
}

const PRESET_CATEGORIES: Array<{ value: MeetCategory | 'All'; label: string }> = [
  { value: 'Playground', label: 'Sports Meet' },
  { value: 'Food', label: 'Food Meet' },
  { value: 'Shopping', label: 'Shopping Meet' },
  { value: 'Community', label: 'Community Meet' },
  { value: 'Tech', label: 'Tech & Code Meet' },
  { value: 'Contest', label: 'Contest Meet' },
  { value: 'Tour', label: 'Tour Meet' },
  { value: 'Couple', label: 'Couple Meet' },
  { value: 'Study', label: 'Study Meet' },
  { value: 'Party', label: 'Party Meet' },
  { value: 'All', label: 'Any Meet' },
];

export const RandomEdgeBubble: React.FC = () => {
  const {
    randomPresets,
    activeRandomPreset,
    triggerRandomMeetWithPreset,
    setIsRandomPresetsModalOpen,
  } = useMeet();
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);

  return (
    <div className="fixed lg:absolute right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
      <AnimatePresence>
        {isBubbleOpen && (
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Random Meet Presets Bubble Menu"
            className="mr-2 w-72 sm:w-80 rounded-3xl vibe-card border shadow-2xl p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Dices className="w-4 h-4 vibe-text-accent" />
                <span className="font-display font-extrabold text-xs text-white">
                  Random Meet Presets
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBubbleOpen(false)}
                aria-label="Close Random Presets Bubble"
                className="w-6 h-6 rounded-full vibe-card-subtle border flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
              {randomPresets.map((preset, index) => {
                const label = formatPresetLabel(preset);
                const isSelected = activeRandomPreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setIsBubbleOpen(false);
                      triggerRandomMeetWithPreset(preset);
                    }}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                      isSelected
                        ? 'vibe-cta-primary border-transparent font-extrabold'
                        : 'vibe-card-subtle text-zinc-200 hover:opacity-95 font-semibold'
                    }`}
                  >
                    <span className="text-[11px] leading-snug">
                      <span className="font-mono opacity-75 mr-1">
                        #{index + 1}
                      </span>
                      {label}
                    </span>
                    <Dices className="w-3.5 h-3.5 shrink-0 opacity-85" />
                  </button>
                );
              })}
            </div>

            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsBubbleOpen(false);
                  setIsRandomPresetsModalOpen(true);
                }}
                className="w-full min-h-[36px] px-3 rounded-xl vibe-card-subtle border text-[11px] font-bold vibe-text-accent flex items-center justify-center gap-1.5 hover:opacity-90"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>+ Add / Edit Presets ({randomPresets.length})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mid-Right Edge Bubble Trigger Button */}
      <button
        type="button"
        onClick={() => setIsBubbleOpen((prev) => !prev)}
        aria-expanded={isBubbleOpen}
        aria-label="Random Meet Bubble Presets"
        title="Random Meet Presets"
        className="min-h-[54px] pl-3.5 pr-2.5 py-2.5 rounded-l-full vibe-cta-primary border-y border-l border-white/25 shadow-2xl flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
      >
        <Dices className="w-5 h-5" />
        <span className="text-[9px] font-display font-black uppercase tracking-tighter leading-none">
          Random
        </span>
      </button>
    </div>
  );
};

export const CreateAndRandomModals: React.FC = () => {
  const {
    meets,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isRandomModalOpen,
    setIsRandomModalOpen,
    randomPresets,
    activeRandomPreset,
    setActiveRandomPreset,
    isRandomPresetsModalOpen,
    setIsRandomPresetsModalOpen,
    addRandomPreset,
    updateRandomPreset,
    deleteRandomPreset,
    createNewMeet,
    initiateJoinMeet,
    setSelectedMeetId,
  } = useMeet();

  // Create Meet Form State (with native Date and Time input boxes)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MeetCategory>('Community');
  const [typographyVariant, setTypographyVariant] =
    useState<TypographyStyleVariant>('A');
  const [venueName, setVenueName] = useState('Anna Nagar Tower Park');
  const [area, setArea] = useState('Anna Nagar');
  const [hostDateISO, setHostDateISO] = useState('2026-08-26');
  const [hostTime24, setHostTime24] = useState('18:30');
  const [escrowAmount, setEscrowAmount] = useState<number>(100);
  const [maxSpots, setMaxSpots] = useState<number>(12);
  const [isSafeguardPlus] = useState<boolean>(true);
  const [formError, setFormError] = useState<string>('');

  // Auto-computed human-readable label from native date & time inputs
  const computedDateTimeLabel = formatHostDateTimeLabel(hostDateISO, hostTime24);

  // Gemini Smart Venue Search State
  const [venueQuery, setVenueQuery] = useState('');
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);
  const [groundedVenues, setGroundedVenues] = useState<GroundedVenue[]>([]);

  // Gemini Flyer Generator State
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGeneratingFlyer, setIsGeneratingFlyer] = useState(false);
  const [generatedFlyerUrl, setGeneratedFlyerUrl] = useState<string | undefined>(
    undefined
  );

  // Random Meet Matcher State
  const [isRolling, setIsRolling] = useState(false);
  const [randomMatch, setRandomMatch] = useState(() => meets[0]);

  // New Preset Form State inside Random Meet Presets Manager Modal
  const [newDistanceKm, setNewDistanceKm] = useState<number>(5);
  const [newPriceMode, setNewPriceMode] = useState<'free' | 'paid' | 'all'>('free');
  const [newCategory, setNewCategory] = useState<MeetCategory | 'All'>('Playground');

  useEffect(() => {
    if (isRandomModalOpen) {
      const picked = pickRandomMeetByPreset(
        meets,
        activeRandomPreset,
        undefined
      );
      if (picked) setRandomMatch(picked);
    }
  }, [isRandomModalOpen, activeRandomPreset, meets]);

  const currentCategoryTypo =
    CATEGORY_TYPOGRAPHY_MAP[category] || CATEGORY_TYPOGRAPHY_MAP.Community;
  const activeTypoSpec = currentCategoryTypo.variants[typographyVariant];

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
        const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><rect width="600" height="340" fill="#0F172A"/><circle cx="480" cy="80" r="95" fill="#0284C7" opacity="0.22"/><text x="36" y="130" fill="#38BDF8" font-family="sans-serif" font-size="18" font-weight="bold">MEET &amp; GREET CHENNAI</text><text x="36" y="185" fill="#FFFFFF" font-family="sans-serif" font-size="32" font-weight="bold">${(
          title || category + ' Meet'
        ).slice(0, 26)}</text><text x="36" y="230" fill="#94A3B8" font-family="sans-serif" font-size="20">${venueName.slice(
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
    if (!hostDateISO || !hostTime24) {
      setFormError('Please select both a valid Date and Time.');
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
      dateTimeLabel: computedDateTimeLabel,
      dateISO: hostDateISO,
      time24: hostTime24,
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
      typographyVariant,
      highlights: [
        escrowAmount > 0
          ? `₹${escrowAmount} Refundable Pass (100% Back at Venue)`
          : 'Free community entry',
        `Curated Bulletin Typography: ${activeTypoSpec.styleName}`,
      ],
    });
    setTitle('');
    setGeneratedFlyerUrl(undefined);
  };

  const triggerRandomRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const picked = pickRandomMeetByPreset(
        meets,
        activeRandomPreset,
        randomMatch?.id
      );
      if (picked) setRandomMatch(picked);
      setIsRolling(false);
    }, 300);
  };

  const handleAddNewPreset = (e: React.FormEvent) => {
    e.preventDefault();
    addRandomPreset({
      distanceKm: newDistanceKm,
      priceMode: newPriceMode,
      category: newCategory,
    });
  };

  return (
    <>
      {/* 1. Create / H+st Meet Modal */}
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
              aria-label="Host a New Chennai Meet"
              className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl vibe-card border max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="font-display font-bold text-lg text-white flex items-center gap-1">
                    <span>H</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full vibe-cta-primary text-xs font-black">
                      +
                    </span>
                    <span>st a Chennai Hangout</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Date &amp; Time Picker Boxes, Category Typography &amp; Venue Search
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  aria-label="Close Create Meet Modal"
                  className="min-h-[40px] min-w-[40px] rounded-xl vibe-card-subtle border flex items-center justify-center text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-semibold text-zinc-200 block mb-1">
                      Hangout Title *
                    </span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Besant Nagar Board Games & Filter Coffee"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-zinc-200 block mb-1">
                      Category (Bulletin Vibe)
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
                </div>

                {/* Dedicated Native Date & Time Input Boxes (No manual typing format errors) */}
                <div className="p-3.5 rounded-2xl vibe-card-subtle border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 vibe-text-accent" />
                      Meet Date &amp; Time
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full vibe-cta-primary text-[10px] font-mono font-bold">
                      {computedDateTimeLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 vibe-text-accent" />
                        Date Box
                      </span>
                      <input
                        type="date"
                        aria-label="Meet Date"
                        value={hostDateISO}
                        onChange={(e) => setHostDateISO(e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white font-mono focus:outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 vibe-text-accent" />
                        Time Box
                      </span>
                      <input
                        type="time"
                        aria-label="Meet Time"
                        value={hostTime24}
                        onChange={(e) => setHostTime24(e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white font-mono focus:outline-none"
                      />
                    </label>
                  </div>
                </div>

                {/* Curated Category Typography Variant Picker (Style A / Style B / Style C) */}
                <div className="p-3.5 rounded-2xl vibe-card-subtle border space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      Category Typography ({category} Meet)
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {currentCategoryTypo.vibeDescription}
                    </span>
                  </div>

                  {/* Live Bulletin Board Title Preview */}
                  <div className="p-3 rounded-xl bg-zinc-950 text-white border border-white/15">
                    <div className="text-[10px] font-mono text-amber-300 mb-1">
                      LIVE BULLETIN PREVIEW · {activeTypoSpec.styleName}
                    </div>
                    <div
                      style={{ fontFamily: activeTypoSpec.fontFamily }}
                      className={`hero-photo-text text-white ${activeTypoSpec.titleClassName}`}
                    >
                      {title.trim() || `${category} Hangout @ ${venueName}`}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(['A', 'B', 'C'] as const).map((v) => {
                      const spec = currentCategoryTypo.variants[v];
                      const isSel = typographyVariant === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setTypographyVariant(v)}
                          className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-left transition-all ${
                            isSel
                              ? 'vibe-cta-primary border-transparent font-bold'
                              : 'vibe-card text-zinc-300 font-medium'
                          }`}
                        >
                          <div className="text-[10px] font-mono font-bold">
                            Style {v}
                          </div>
                          <div className="text-[10px] truncate opacity-90">
                            {spec.vibeNote}
                          </div>
                        </button>
                      );
                    })}
                  </div>
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
                      ₹ Refundable Pass
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

                {/* AI Meet Flyer Generator */}
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
                  className="w-full min-h-[48px] rounded-xl vibe-cta-primary font-display font-bold text-sm flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publish Meet to Chennai Feed
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Random Meet Preset Match Modal */}
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
              className="relative z-10 w-full max-w-sm rounded-3xl vibe-card border p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dices className="w-5 h-5 vibe-text-accent" />
                  <div>
                    <h2 className="font-display font-bold text-base text-white">
                      Random Meet Match
                    </h2>
                    {activeRandomPreset && (
                      <p className="text-[11px] vibe-text-accent font-semibold">
                        {formatPresetLabel(activeRandomPreset)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRandomModalOpen(false)}
                  aria-label="Close Random Meet Modal"
                  className="min-h-[38px] min-w-[38px] rounded-xl vibe-card-subtle border flex items-center justify-center text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Switcher Strip inside Modal */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {randomPresets.map((preset) => {
                  const isCurrent = activeRandomPreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setActiveRandomPreset(preset)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all ${
                        isCurrent
                          ? 'vibe-cta-primary border-transparent'
                          : 'vibe-card-subtle text-zinc-300'
                      }`}
                    >
                      {formatPresetLabel(preset)}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl vibe-card-subtle border space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="vibe-text-accent font-semibold">
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
                  <span className="vibe-text-accent font-bold">
                    {randomMatch.escrowAmount === 0
                      ? 'Free Meet'
                      : `₹${randomMatch.escrowAmount} Refundable`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerRandomRoll}
                  className="min-h-[44px] px-3.5 rounded-xl vibe-card-subtle border text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
                >
                  <Dices
                    className={`w-4 h-4 vibe-text-accent ${
                      isRolling ? 'animate-spin' : ''
                    }`}
                  />
                  Roll Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRandomModalOpen(false);
                    setSelectedMeetId(randomMatch.id);
                    initiateJoinMeet(randomMatch);
                  }}
                  className="flex-1 min-h-[44px] rounded-xl vibe-cta-primary font-display font-bold text-xs"
                >
                  Join Match Now →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Editable Random Meet Presets Manager Modal (Reachable from Menu Bar & Bubble) */}
      <AnimatePresence>
        {isRandomPresetsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRandomPresetsModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-label="Random Meet Presets Manager"
              className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl vibe-card border max-h-[88vh] overflow-y-auto p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Dices className="w-5 h-5 vibe-text-accent" />
                  <div>
                    <h2 className="font-display font-extrabold text-base text-white">
                      Random Meet Presets
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Edit your mid-right bubble presets or add endless custom presets
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRandomPresetsModalOpen(false)}
                  aria-label="Close Random Meet Presets Modal"
                  className="min-h-[38px] min-w-[38px] rounded-xl vibe-card-subtle border flex items-center justify-center text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Existing Editable Presets List */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-zinc-300">
                  Saved Bubble Presets ({randomPresets.length})
                </div>

                {randomPresets.map((preset, idx) => (
                  <div
                    key={preset.id}
                    className="p-3 rounded-2xl vibe-card-subtle border space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-white">
                        #{idx + 1} · {formatPresetLabel(preset)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRandomPresetsModalOpen(false);
                            setActiveRandomPreset(preset);
                            setIsRandomModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-full vibe-cta-primary text-[10px] font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Roll
                        </button>
                        {randomPresets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteRandomPreset(preset.id)}
                            aria-label={`Delete preset ${idx + 1}`}
                            className="p-1.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Quick Editors for Distance, Free/Paid, Category */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <select
                        aria-label={`Preset ${idx + 1} Distance`}
                        value={preset.distanceKm}
                        onChange={(e) =>
                          updateRandomPreset({
                            ...preset,
                            distanceKm: Number(e.target.value),
                            customLabel: undefined,
                          })
                        }
                        className="min-h-[36px] px-2 rounded-xl bg-zinc-900 border border-white/15 text-[11px] text-white"
                      >
                        {[3, 5, 10, 15, 20, 25].map((km) => (
                          <option key={km} value={km}>
                            Within {km}km
                          </option>
                        ))}
                      </select>

                      <select
                        aria-label={`Preset ${idx + 1} Price Mode`}
                        value={preset.priceMode}
                        onChange={(e) =>
                          updateRandomPreset({
                            ...preset,
                            priceMode: e.target.value as RandomMeetPreset['priceMode'],
                            customLabel: undefined,
                          })
                        }
                        className="min-h-[36px] px-2 rounded-xl bg-zinc-900 border border-white/15 text-[11px] text-white"
                      >
                        <option value="free">Free Meet</option>
                        <option value="paid">Paid Meet</option>
                        <option value="all">Any Price</option>
                      </select>

                      <select
                        aria-label={`Preset ${idx + 1} Category`}
                        value={preset.category}
                        onChange={(e) =>
                          updateRandomPreset({
                            ...preset,
                            category: e.target.value as MeetCategory | 'All',
                            customLabel: undefined,
                          })
                        }
                        className="min-h-[36px] px-2 rounded-xl bg-zinc-900 border border-white/15 text-[11px] text-white"
                      >
                        {PRESET_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Endless New Preset Form */}
              <form
                onSubmit={handleAddNewPreset}
                className="p-4 rounded-2xl vibe-card-subtle border space-y-3"
              >
                <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 vibe-text-accent" />
                  <span>Add New Random Meet Preset</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <label className="block">
                    <span className="text-[10px] font-semibold text-zinc-400 block mb-1">
                      Distance
                    </span>
                    <select
                      value={newDistanceKm}
                      onChange={(e) => setNewDistanceKm(Number(e.target.value))}
                      className="w-full min-h-[38px] px-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white"
                    >
                      {[3, 5, 10, 15, 20, 25].map((km) => (
                        <option key={km} value={km}>
                          Within {km}km
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-semibold text-zinc-400 block mb-1">
                      Entry Type
                    </span>
                    <select
                      value={newPriceMode}
                      onChange={(e) =>
                        setNewPriceMode(e.target.value as 'free' | 'paid' | 'all')
                      }
                      className="w-full min-h-[38px] px-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white"
                    >
                      <option value="free">Free Meet</option>
                      <option value="paid">Paid Meet</option>
                      <option value="all">Any Price</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-semibold text-zinc-400 block mb-1">
                      Meet Type
                    </span>
                    <select
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value as MeetCategory | 'All')
                      }
                      className="w-full min-h-[38px] px-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white"
                    >
                      {PRESET_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[42px] rounded-xl vibe-cta-primary font-display font-extrabold text-xs flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Preset to Bubble</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
