import { FilterCriteria, MeetCategory, MeetItem } from '../types/meet';

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
