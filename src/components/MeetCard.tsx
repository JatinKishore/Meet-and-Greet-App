import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  MapPin,
  Shield,
  Users,
  Sparkles,
  CheckCircle2,
  QrCode,
  ScanLine,
  Crown,
  Info,
  Flame,
  Zap,
  Type,
} from 'lucide-react';
import { MeetItem } from '../types/meet';
import {
  calculateOccupancyPercent,
  getEventCtaCopy,
  isMeetHostedByUser,
} from '../utils/meetLogic';
import { resolveMeetTypography } from '../utils/typographyStyles';
import { useMeet } from '../context/MeetContext';

interface MeetCardProps {
  meet: MeetItem;
  onSelectDetails: (meet: MeetItem) => void;
  onJoinAction: (meet: MeetItem) => void;
}

const FALLBACK_CATEGORY_PHOTOS: Record<string, string> = {
  Playground:
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80',
  Food:
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  Shopping:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
  Contest:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
  Tour:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  Couple:
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
  Study:
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
  Party:
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
  Tech:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
  Community:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
};

export const MeetCard: React.FC<MeetCardProps> = ({
  meet,
  onSelectDetails,
  onJoinAction,
}) => {
  const { user, cycleMeetTypographyVariant } = useMeet();
  const isHost = isMeetHostedByUser(meet, user.uid);
  const occupancyPct = calculateOccupancyPercent(meet.occupiedSpots, meet.maxSpots);
  const spotsLeft = Math.max(0, meet.maxSpots - meet.occupiedSpots);
  const ctaCopy = getEventCtaCopy(meet);

  // Curated Category Typography Variant (Style A, B, or C)
  const typoSpec = resolveMeetTypography(
    meet.category,
    meet.id,
    meet.typographyVariant
  );

  const heroImage =
    meet.customFlyerUrl ||
    meet.coverPhotoUrl ||
    FALLBACK_CATEGORY_PHOTOS[meet.category] ||
    FALLBACK_CATEGORY_PHOTOS.Community;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      onClick={() => onSelectDetails(meet)}
      className="group relative rounded-3xl overflow-hidden vibe-card border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
    >
      {/* IMMERSIVE PHOTOGRAPHY HERO HEADER */}
      <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
        <img
          src={heroImage}
          alt={meet.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark Scrim for Text Legibility */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Top Floating Pills Row */}
        <div className="absolute top-3.5 inset-x-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="hero-photo-text px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-display font-bold text-white">
              {meet.typeLabel}
            </span>
            <span className="hero-photo-text px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 font-mono text-[11px] font-semibold text-amber-300">
              {meet.distanceKm} km · ~{meet.arriveMinutes}m
            </span>
            {/* Interactive Category Typography Style Cycle Pill */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cycleMeetTypographyVariant(meet.id);
              }}
              title="Tap to cycle Category Typography (Style A / B / C)"
              className="hero-photo-text px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/25 text-[10px] font-mono font-bold text-white inline-flex items-center gap-1 transition-transform active:scale-95"
            >
              <Type className="w-3 h-3 text-amber-300" />
              <span>{typoSpec.badgeLabel}</span>
            </button>
          </div>

          {/* Right Status / Safety Floating Pill */}
          <div className="shrink-0">
            {isHost ? (
              <span className="hero-photo-text inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-[11px] font-display font-extrabold shadow-sm">
                <Crown className="w-3 h-3 stroke-[2.5]" />
                Your Hangout
              </span>
            ) : meet.isSponsored ? (
              <span className="hero-photo-text inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-[11px] font-display font-extrabold shadow-sm">
                <Sparkles className="w-3 h-3" />
                Brand Drop
              </span>
            ) : meet.isSafeguardPlus ? (
              <span
                title="Safeguard+ Night Shield & Live Geofence"
                className="hero-photo-text inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 text-[11px] font-display font-extrabold shadow-sm"
              >
                <Shield className="w-3 h-3 stroke-[2.5]" />
                Safeguard+
              </span>
            ) : null}
          </div>
        </div>

        {/* Bottom Hero Overlay: Category-Curated Bulletin Typography Title + Host Pill */}
        <div className="absolute bottom-3.5 inset-x-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3
              style={{ fontFamily: typoSpec.fontFamily }}
              className={`hero-photo-text text-white drop-shadow-sm ${typoSpec.titleClassName}`}
            >
              {meet.title}
            </h3>
            <p className="hero-photo-text text-xs text-zinc-200 mt-0.5 truncate">
              {meet.subtitle}
            </p>
          </div>

          {/* Host Avatar Pill */}
          <div className="hero-photo-text shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20">
            <div className="w-6 h-6 rounded-full vibe-cta-primary flex items-center justify-center font-display font-extrabold text-[10px]">
              {meet.hostAvatarSeed}
            </div>
            <div className="text-left pr-1">
              <div className="hero-photo-text text-[10px] font-bold text-white leading-none">
                {isHost ? 'You Host' : meet.hostName.split(' ')[0]}
              </div>
              <div className="hero-photo-text text-[9px] font-mono text-emerald-300 leading-none mt-0.5">
                {meet.hostReliability}% Vibe
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WARM CONSUMER BODY & LIVE UTILITY CHUNKS */}
      <div className="p-5 space-y-4">
        {/* Schedule & Venue Strip */}
        <div className="rounded-2xl vibe-card-subtle border p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 font-semibold text-white">
              <Clock className="w-4 h-4 vibe-text-accent shrink-0" />
              <span>{meet.dateTimeLabel}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full vibe-card border font-mono text-[11px] text-zinc-300">
              Hop via {meet.transportMode}
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 vibe-text-accent shrink-0" />
              <span className="font-semibold text-white truncate">
                {meet.venueName}
              </span>
              <span className="text-zinc-400 truncate">· {meet.area}</span>
            </div>
          </div>
        </div>

        {/* Squad Spots & Refundable Pass Info */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-200">
              <Users className="w-3.5 h-3.5 vibe-text-accent" />
              <span>
                {meet.occupiedSpots}/{meet.maxSpots} in the squad
              </span>
            </span>
            <span className="font-display font-bold text-xs vibe-text-accent">
              {spotsLeft === 0
                ? 'Squad Full!'
                : spotsLeft <= 3
                ? `🔥 Only ${spotsLeft} spots left!`
                : `${spotsLeft} spots open`}
            </span>
          </div>

          {/* Clean Solid Progress Bar (No Gradient) */}
          <div className="w-full h-2.5 rounded-full bg-black/15 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-300 vibe-cta-primary"
              style={{ width: `${occupancyPct}%` }}
            />
          </div>

          {/* Event Pass Info Row */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div>
              {meet.escrowAmount === 0 ? (
                <span className="inline-flex items-center gap-1 font-display font-bold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  {ctaCopy.badgeLabel}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-display font-bold text-white">
                  <Flame className="w-3.5 h-3.5 vibe-text-accent shrink-0" />
                  <span>{ctaCopy.badgeLabel}</span>
                  <span className="text-[11px] font-normal text-zinc-400">
                    (100% Back at Venue)
                  </span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {meet.category} · {typoSpec.vibeNote}
            </span>
          </div>
        </div>

        {/* CLEAN SOLID PILL CTA FOOTER */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onJoinAction(meet);
            }}
            className="flex-1 min-h-[50px] px-5 py-3 rounded-full vibe-cta-primary font-display text-xs font-extrabold tracking-wide transition-all active:scale-[0.97] hover:opacity-95 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isHost ? (
              <>
                <QrCode className="w-4 h-4 stroke-[2.5]" />
                Show My Host Pass
              </>
            ) : meet.checkedInByUser ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                You’re In! · Cashback Claimed
              </>
            ) : meet.joinedByUser ? (
              <>
                <ScanLine className="w-4 h-4 stroke-[2.5]" />
                Show Pass to Host
              </>
            ) : meet.escrowAmount > 0 ? (
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

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectDetails(meet);
            }}
            aria-label={`More details for ${meet.title}`}
            className="min-h-[50px] min-w-[50px] rounded-full vibe-card-subtle hover:opacity-90 border flex items-center justify-center text-zinc-200 transition-transform active:scale-95"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
