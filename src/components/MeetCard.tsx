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
  Info,
} from 'lucide-react';
import { MeetItem } from '../types/meet';
import { calculateOccupancyPercent } from '../utils/meetLogic';

interface MeetCardProps {
  meet: MeetItem;
  onSelectDetails: (meet: MeetItem) => void;
  onJoinAction: (meet: MeetItem) => void;
  compact?: boolean;
}

export const MeetCard: React.FC<MeetCardProps> = ({
  meet,
  onSelectDetails,
  onJoinAction,
  compact = false,
}) => {
  const occupancyPct = calculateOccupancyPercent(meet.occupiedSpots, meet.maxSpots);
  const spotsLeft = Math.max(0, meet.maxSpots - meet.occupiedSpots);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelectDetails(meet)}
      className={`group relative rounded-2xl bg-[#121215] border transition-all cursor-pointer flex flex-col justify-between ${
        meet.isSponsored
          ? 'border-amber-500/35 hover:border-amber-400/60'
          : meet.joinedByUser
          ? 'border-emerald-500/40 hover:border-emerald-400/70'
          : 'border-white/10 hover:border-white/25'
      } ${compact ? 'p-3' : 'p-3.5'}`}
    >
      <div>
        {/* Top Metadata Line (Zero-pill discipline: clean unboxed text with separators) */}
        <div className="flex items-center justify-between gap-1.5 text-[11px] text-zinc-400 mb-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-medium text-emerald-400 truncate">
              {meet.typeLabel.replace(' Meet', '')}
            </span>
            <span aria-hidden="true" className="shrink-0">·</span>
            <span className="font-mono text-zinc-300 shrink-0">{meet.distanceKm}km</span>
          </div>

          {meet.isSponsored ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold text-amber-300 shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              Ad
            </span>
          ) : meet.isSafeguardPlus ? (
            <span
              title="Safeguard+ Late-Night & Geofence Protected"
              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-300 shrink-0"
            >
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              Safe+
            </span>
          ) : null}
        </div>

        {/* Meet Title (mapped from doodle: codeClubs Meet, Tidel Lunch Meet, etc.) */}
        <h3 className="font-display font-bold text-sm sm:text-[15px] text-zinc-50 leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
          {meet.title}
        </h3>

        {/* Custom AI Flyer Thumbnail if generated */}
        {meet.customFlyerUrl && (
          <div className="mt-2 rounded-xl overflow-hidden border border-white/10 h-24 bg-zinc-900">
            <img
              src={meet.customFlyerUrl}
              alt={`${meet.title} flyer`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Doodle rows: Time, Venue, Occupancy, Price/Escrow */}
        <div className="mt-2.5 space-y-1.5 text-xs text-zinc-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{meet.dateTimeLabel}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-medium text-zinc-200">{meet.venueName}</span>
          </div>

          {/* Occupancy Row & Progress Bar */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="inline-flex items-center gap-1 text-zinc-300 font-mono">
                <Users className="w-3 h-3 text-zinc-400" />
                {meet.occupiedSpots}/{meet.maxSpots}
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                {spotsLeft === 0 ? 'Full' : `${spotsLeft} left`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  occupancyPct > 85 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>

          {/* ₹ Price / Escrow Deposit Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="font-mono text-xs">
              {meet.escrowAmount === 0 ? (
                <span className="text-emerald-400 font-semibold">₹ free</span>
              ) : (
                <span className="text-amber-300 font-semibold">
                  ₹{meet.escrowAmount}{' '}
                  <span className="text-[10px] font-sans font-normal text-zinc-400">
                    Escrow
                  </span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Host {meet.hostReliability}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom JOIN CTA (with doodle note: "long press for more detail") */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onJoinAction(meet);
            }}
            className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl font-display text-xs font-bold tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap ${
              meet.checkedInByUser
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : meet.joinedByUser
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20'
            }`}
          >
            {meet.checkedInByUser ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                CHECKED IN
              </>
            ) : meet.joinedByUser ? (
              <>
                <QrCode className="w-3.5 h-3.5" />
                OPEN QR
              </>
            ) : (
              <>
                JOIN {meet.escrowAmount > 0 ? `· ₹${meet.escrowAmount}` : ''}
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
            className="min-h-[40px] min-w-[40px] rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-[10px] text-center text-zinc-500 italic">
          (tap card for more detail)
        </span>
      </div>
    </motion.article>
  );
};
