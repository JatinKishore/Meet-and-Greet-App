import {
  ClientMapStatusFilter,
  DistanceOption,
  FilterCriteria,
  MeetCategory,
  MeetItem,
  RandomMeetPreset,
  TrackHistoryEntry,
} from '../types/meet';

export function filterMeets(meets: MeetItem[], filters: FilterCriteria): MeetItem[] {
  return meets.filter((meet) => {
    // Search query
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesText =
        meet.title.toLowerCase().includes(q) ||
        meet.venueName.toLowerCase().includes(q) ||
        meet.area.toLowerCase().includes(q) ||
        meet.category.toLowerCase().includes(q) ||
        meet.hostName.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    // Distance filter (25 means 25km+ i.e. all distances up to 50km)
    if (filters.distanceKm < 25 && meet.distanceKm > filters.distanceKm) {
      return false;
    }

    // Category multi-select
    if (filters.categories.length > 0 && !filters.categories.includes(meet.category)) {
      return false;
    }

    // Price toggle
    if (filters.priceMode === 'free' && meet.escrowAmount > 0) {
      return false;
    }
    if (filters.priceMode === 'paid' && meet.escrowAmount === 0) {
      return false;
    }

    // Age group
    if (
      filters.ageGroup !== 'All' &&
      meet.ageGroup !== 'All' &&
      meet.ageGroup !== filters.ageGroup
    ) {
      return false;
    }

    // Gender group
    if (
      filters.genderGroup !== 'Both' &&
      meet.genderGroup !== 'Both' &&
      meet.genderGroup !== filters.genderGroup
    ) {
      return false;
    }

    // Date filter (after / before)
    if (filters.dateMode !== 'any' && filters.dateValue) {
      if (filters.dateMode === 'after' && meet.dateISO < filters.dateValue) {
        return false;
      }
      if (filters.dateMode === 'before' && meet.dateISO > filters.dateValue) {
        return false;
      }
    }

    // Time filter
    if (filters.timeValue && filters.dateMode !== 'any') {
      if (filters.dateMode === 'after' && meet.time24 < filters.timeValue) {
        return false;
      }
      if (filters.dateMode === 'before' && meet.time24 > filters.timeValue) {
        return false;
      }
    }

    // Safeguard+ filter
    if (filters.onlySafeguardPlus && !meet.isSafeguardPlus) {
      return false;
    }

    return true;
  });
}

export function calculateOccupancyPercent(occupied: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((occupied / max) * 100)));
}

export function calculateReliabilityScore(created: number, joined: number, missed: number): number {
  const totalCommitments = created + joined + missed;
  if (totalCommitments <= 0) return 100;
  const fulfilled = created + joined;
  const baseRatio = fulfilled / totalCommitments;
  // Weight missed flaking slightly heavier for realistic escrow trust scoring
  const score = Math.round(baseRatio * 100 - missed * 0.25);
  return Math.max(0, Math.min(100, score));
}

export function generateRollingTotpCode(meetId: string, epochWindow: number): string {
  // Deterministic 6-digit TOTP code derived from meetId and 30-second epoch window
  let hash = epochWindow * 2654435761;
  for (let i = 0; i < meetId.length; i++) {
    hash = (hash ^ meetId.charCodeAt(i)) * 16777619;
  }
  const positive = Math.abs(hash) % 900000;
  return String(100000 + positive);
}

export function calculateFlakeRedistribution(
  escrowAmount: number,
  flakedCount: number,
  punctualAttendeesCount: number
): { totalPool: number; platformFee: number; perAttendeeCredit: number } {
  if (escrowAmount <= 0 || flakedCount <= 0 || punctualAttendeesCount <= 0) {
    return { totalPool: 0, platformFee: 0, perAttendeeCredit: 0 };
  }
  const totalPool = escrowAmount * flakedCount;
  const platformFee = Math.round(totalPool * 0.1); // 10% safety pool fee
  const distributable = totalPool - platformFee;
  const perAttendeeCredit = Math.floor(distributable / punctualAttendeesCount);
  return { totalPool, platformFee, perAttendeeCredit };
}

export function countActiveFilters(filters: FilterCriteria): number {
  let count = 0;
  if (filters.distanceKm !== 25) count++;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.priceMode !== 'all') count++;
  if (filters.ageGroup !== 'All') count++;
  if (filters.genderGroup !== 'Both') count++;
  if (filters.dateMode !== 'any') count++;
  if (filters.onlySafeguardPlus) count++;
  return count;
}

export function pickRandomMeet(meets: MeetItem[], currentId?: string): MeetItem | null {
  const available = meets.filter((m) => m.occupiedSpots < m.maxSpots && m.id !== currentId);
  if (available.length === 0) return meets[0] ?? null;
  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

export function filterClientHistoryByStatus(
  history: TrackHistoryEntry[],
  statusFilter: ClientMapStatusFilter
): TrackHistoryEntry[] {
  if (statusFilter === 'All') return history;
  return history.filter((entry) => entry.status === statusFilter);
}

export function summarizeClientMapStats(history: TrackHistoryEntry[]): {
  total: number;
  joined: number;
  hosted: number;
  missed: number;
  netEscrowDelta: number;
} {
  let joined = 0;
  let hosted = 0;
  let missed = 0;
  let netEscrowDelta = 0;

  for (const item of history) {
    if (item.status === 'Joined') joined++;
    else if (item.status === 'Hosted') hosted++;
    else if (item.status === 'Missed') missed++;
    netEscrowDelta += item.escrowDelta;
  }

  return {
    total: history.length,
    joined,
    hosted,
    missed,
    netEscrowDelta,
  };
}

export function getRemainingTimeUrgency(minutesRemaining: number): {
  level: 'green' | 'yellow' | 'red';
  statusLabel: string;
  textColorClass: string;
  badgeClass: string;
  dotClass: string;
} {
  if (minutesRemaining > 20) {
    return {
      level: 'green',
      statusLabel: 'On Time',
      textColorClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      dotClass: 'bg-emerald-400',
    };
  }
  if (minutesRemaining >= 10) {
    return {
      level: 'yellow',
      statusLabel: 'Leave Soon',
      textColorClass: 'text-amber-300',
      badgeClass: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
      dotClass: 'bg-amber-400',
    };
  }
  return {
    level: 'red',
    statusLabel: 'Closing Soon',
    textColorClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
    dotClass: 'bg-rose-500',
  };
}

export function isMeetHostedByUser(meet: MeetItem, userUid: string): boolean {
  return meet.hostUid === userUid;
}

export function getMeetCheckInMode(
  meet: MeetItem,
  userUid: string
): 'host-qr' | 'attendee-scanner' {
  return isMeetHostedByUser(meet, userUid) ? 'host-qr' : 'attendee-scanner';
}

export function getNextBookedMeet(
  meets: MeetItem[],
  selectedMeetId?: string,
  userUid: string = '0001'
): MeetItem {
  // Prioritize booked attendee meets that haven't been checked into yet
  const bookedAttendeeUnchecked = meets.find(
    (m) => m.joinedByUser && !m.checkedInByUser && m.hostUid !== userUid
  );
  if (bookedAttendeeUnchecked) return bookedAttendeeUnchecked;

  const bookedUnchecked = meets.find((m) => m.joinedByUser && !m.checkedInByUser);
  if (bookedUnchecked) return bookedUnchecked;

  const anyBooked = meets.find((m) => m.joinedByUser);
  if (anyBooked) return anyBooked;

  const selected = meets.find((m) => m.id === selectedMeetId);
  return selected || meets[0];
}

export const ALL_MEET_CATEGORIES: { id: MeetCategory; label: string; doodleName: string }[] = [
  { id: 'Playground', label: 'Playground Meet', doodleName: 'Playground Meet' },
  { id: 'Shopping', label: 'Shopping Meet', doodleName: 'Shopping Meet' },
  { id: 'Community', label: 'Community Meet', doodleName: 'Community Meet' },
  { id: 'Food', label: 'Food Meet', doodleName: 'Food Meet' },
  { id: 'Contest', label: 'Contest Meet', doodleName: 'Contest Meet' },
  { id: 'Tour', label: 'Tour Meet', doodleName: 'Tour Meet' },
  { id: 'Couple', label: 'Couple Meet', doodleName: 'Couple Meet' },
  { id: 'Study', label: 'Study Meet', doodleName: 'Study Meet' },
  { id: 'Party', label: 'Party Meet', doodleName: 'Party Meet' },
  { id: 'Tech', label: 'Tech & Code', doodleName: 'Open Meet' },
];

export function getEventCtaCopy(meet: MeetItem): {
  primaryCta: string;
  checkoutCta: string;
  badgeLabel: string;
} {
  const amt = meet.escrowAmount;
  const titleLower = meet.title.toLowerCase();

  if (amt > 0) {
    switch (meet.category) {
      case 'Playground':
        return {
          primaryCta: `Book Turf Spot · ₹${amt}`,
          checkoutCta: `Confirm Turf Spot · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Turf Pass`,
        };
      case 'Contest':
        return {
          primaryCta: `Enter the Arena · ₹${amt}`,
          checkoutCta: `Confirm Arena Seat · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Entry Pass`,
        };
      case 'Tour':
        return {
          primaryCta: titleLower.includes('night')
            ? `Join the Night Walk · ₹${amt}`
            : `Join the Trail · ₹${amt}`,
          checkoutCta: `Confirm Walk Spot · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Walk Pass`,
        };
      case 'Study':
        return {
          primaryCta: titleLower.includes('coffee')
            ? `Pull Up a Chair · ₹${amt}`
            : `Save Study Seat · ₹${amt}`,
          checkoutCta: `Reserve Table Seat · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Table Pass`,
        };
      case 'Party':
        return {
          primaryCta: titleLower.includes('run')
            ? `Join the Run Crew · ₹${amt}`
            : `Get on the Guestlist · ₹${amt}`,
          checkoutCta: `Confirm Crew Pass · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Crew Pass`,
        };
      case 'Food':
        return {
          primaryCta: `Grab a Seat at the Table · ₹${amt}`,
          checkoutCta: `Confirm Table Seat · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Table Pass`,
        };
      case 'Shopping':
        return {
          primaryCta: `Claim Bundle Spot · ₹${amt}`,
          checkoutCta: `Confirm Bundle Slot · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Deal Pass`,
        };
      case 'Couple':
        return {
          primaryCta: `Reserve Mixer Pass · ₹${amt}`,
          checkoutCta: `Confirm Mixer Pass · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Mixer Pass`,
        };
      case 'Tech':
        return {
          primaryCta: `Save Builder Seat · ₹${amt}`,
          checkoutCta: `Confirm Builder Seat · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Builder Pass`,
        };
      default:
        return {
          primaryCta: `Reserve Your Spot · ₹${amt}`,
          checkoutCta: `Confirm Your Spot · ₹${amt} (100% Back)`,
          badgeLabel: `₹${amt} Refundable Pass`,
        };
    }
  }

  // Free Hangouts (amt === 0)
  switch (meet.category) {
    case 'Food':
      return {
        primaryCta: 'Grab a Seat at the Table · Free',
        checkoutCta: 'Confirm Table Seat · Free',
        badgeLabel: 'Free Table · Zero Cover',
      };
    case 'Shopping':
      return {
        primaryCta: 'Claim Bundle Deal · Free',
        checkoutCta: 'Confirm Bundle Slot · Free',
        badgeLabel: 'Free Group Deal · Zero Cover',
      };
    case 'Playground':
      return {
        primaryCta: 'Join the Match · Free',
        checkoutCta: 'Confirm Match Spot · Free',
        badgeLabel: 'Free Match · Open Turf',
      };
    case 'Contest':
      return {
        primaryCta: 'Enter the Arena · Free',
        checkoutCta: 'Confirm Contest Entry · Free',
        badgeLabel: 'Free Entry · Open Contest',
      };
    default:
      return {
        primaryCta: 'Count Me In · Free',
        checkoutCta: 'Confirm Your Spot · Free',
        badgeLabel: 'Free Hangout · Open Entry',
      };
  }
}

export const DEFAULT_RANDOM_PRESETS: RandomMeetPreset[] = [
  {
    id: 'preset-sports-5km-free',
    distanceKm: 5,
    priceMode: 'free',
    category: 'Playground',
  },
  {
    id: 'preset-food-10km-free',
    distanceKm: 10,
    priceMode: 'free',
    category: 'Food',
  },
  {
    id: 'preset-shopping-10km-paid',
    distanceKm: 10,
    priceMode: 'paid',
    category: 'Shopping',
  },
];

const CATEGORY_PRESET_NAME_MAP: Record<MeetCategory, string> = {
  Playground: 'Sports Meet',
  Food: 'Food Meet',
  Shopping: 'Shopping Meet',
  Community: 'Community Meet',
  Contest: 'Contest Meet',
  Tour: 'Tour Meet',
  Couple: 'Couple Meet',
  Study: 'Study Meet',
  Party: 'Party Meet',
  Tech: 'Tech Meet',
};

export function formatPresetLabel(preset: RandomMeetPreset): string {
  if (preset.customLabel && preset.customLabel.trim()) {
    return preset.customLabel.trim();
  }
  const distText =
    preset.distanceKm >= 25 ? 'Within 25km+' : `Within ${preset.distanceKm}km`;
  const priceText =
    preset.priceMode === 'free'
      ? 'Free Meet'
      : preset.priceMode === 'paid'
      ? 'Paid Meet'
      : 'Any Price';
  const catText =
    preset.category === 'All'
      ? 'Any Meet'
      : CATEGORY_PRESET_NAME_MAP[preset.category] || `${preset.category} Meet`;
  return `${distText} - ${priceText} - ${catText}`;
}

export function pickRandomMeetByPreset(
  meets: MeetItem[],
  preset?: RandomMeetPreset | null,
  currentId?: string
): MeetItem | null {
  if (!preset) {
    return pickRandomMeet(meets, currentId);
  }
  const openMeets = meets.filter((m) => m.occupiedSpots < m.maxSpots);
  const matchesDistance = (m: MeetItem) =>
    preset.distanceKm >= 25 || m.distanceKm <= preset.distanceKm;
  const matchesPrice = (m: MeetItem) =>
    preset.priceMode === 'all' ||
    (preset.priceMode === 'free' && m.escrowAmount === 0) ||
    (preset.priceMode === 'paid' && m.escrowAmount > 0);
  const matchesCategory = (m: MeetItem) =>
    preset.category === 'All' || m.category === preset.category;

  // 1. Strict match: distance + price + category
  const strictPool = openMeets.filter(
    (m) => matchesDistance(m) && matchesPrice(m) && matchesCategory(m)
  );
  if (strictPool.length > 0) {
    const nonCurrent = strictPool.filter((m) => m.id !== currentId);
    const pool = nonCurrent.length > 0 ? nonCurrent : strictPool;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 2. Category + distance or Category match
  const categoryPool = openMeets.filter((m) => matchesCategory(m));
  if (categoryPool.length > 0) {
    const nonCurrent = categoryPool.filter((m) => m.id !== currentId);
    const pool = nonCurrent.length > 0 ? nonCurrent : categoryPool;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 3. Distance + price match
  const distPricePool = openMeets.filter(
    (m) => matchesDistance(m) && matchesPrice(m)
  );
  if (distPricePool.length > 0) {
    return distPricePool[Math.floor(Math.random() * distPricePool.length)];
  }

  return pickRandomMeet(meets, currentId);
}

export function formatHostDateTimeLabel(dateISO: string, time24: string): string {
  // Converts "2026-08-26" and "18:30" -> "6:30pm, 26th Aug"
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  let timePart = '6:30pm';
  if (time24 && time24.includes(':')) {
    const [hStr, mStr] = time24.split(':');
    const h = parseInt(hStr, 10);
    const m = mStr || '00';
    if (!isNaN(h)) {
      const suffix = h >= 12 ? 'pm' : 'am';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      timePart = `${h12}:${m}${suffix}`;
    }
  }

  let datePart = '26th Aug';
  if (dateISO && /^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    const [, mStr, dStr] = dateISO.split('-');
    const monthIndex = parseInt(mStr, 10) - 1;
    const day = parseInt(dStr, 10);
    if (!isNaN(day) && monthIndex >= 0 && monthIndex < 12) {
      const ordinal =
        day % 10 === 1 && day !== 11
          ? 'st'
          : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
      datePart = `${day}${ordinal} ${months[monthIndex]}`;
    }
  }

  return `${timePart}, ${datePart}`;
}


