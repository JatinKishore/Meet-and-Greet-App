export type MeetCategory =
  | 'Playground'
  | 'Shopping'
  | 'Community'
  | 'Food'
  | 'Contest'
  | 'Tour'
  | 'Couple'
  | 'Study'
  | 'Party'
  | 'Tech';

export type AgeDemographic = 'All' | 'Young' | 'Mid' | 'Senior';
export type GenderDemographic = 'Both' | 'Men Only' | 'Women Only';
export type DistanceOption = 5 | 10 | 20 | 25;
export type FeedViewState = 'populated' | 'loading' | 'empty' | 'error';
export type ActiveRoute =
  | '/home'
  | '/home/map'
  | '/profile'
  | '/onboarding/kyc'
  | '/onboarding/guardian'
  | '/meet/checkout'
  | '/meet/active'
  | '/meet/verify-pose';

export type GeofenceStatus = 'safe' | 'warning' | 'breach';

export interface MeetItem {
  id: string;
  title: string;
  subtitle: string;
  category: MeetCategory;
  typeLabel: string;
  venueName: string;
  area: string;
  address: string;
  distanceKm: number;
  dateTimeLabel: string;
  dateISO: string;
  time24: string;
  arriveMinutes: number;
  transportMode: string;
  escrowAmount: number; // 0 = free, >0 = refundable ₹ deposit
  occupiedSpots: number;
  maxSpots: number;
  hostName: string;
  hostUid: string;
  hostReliability: number;
  hostAvatarSeed: string;
  isSafeguardPlus: boolean;
  isLateNight: boolean;
  isSponsored?: boolean;
  sponsorBrand?: string;
  sponsorOfferTag?: string;
  ageGroup: AgeDemographic;
  genderGroup: GenderDemographic;
  geofenceRadiusMeters: number;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100 percentage on custom Chennai SVG map
    mapY: number; // 0-100 percentage on custom Chennai SVG map
  };
  joinedByUser?: boolean;
  checkedInByUser?: boolean;
  customFlyerUrl?: string;
  highlights: string[];
}

export interface TrackHistoryEntry {
  id: string;
  dateLabel: string;
  timeLabel: string;
  meetTitle: string;
  venueName: string;
  status: 'Joined' | 'Missed' | 'Hosted';
  escrowDelta: number; // +₹35 credit or -₹100 penalty or 0
}

export interface WalletTransaction {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  amount: number;
  type: 'penalty_credit' | 'escrow_lock' | 'escrow_refund' | 'upi_withdrawal';
  status: 'Completed' | 'Locked';
}

export interface ExploredPlace {
  id: string;
  name: string;
  area: string;
  category: MeetCategory;
  visitsCount: number;
  lastVisited: string;
  safetyRating: number;
}

export interface MeetFriend {
  id: string;
  name: string;
  uid: string;
  mutualMeets: number;
  reliabilityScore: number;
  metAtVenue: string;
  verifiedKyc: boolean;
}

export interface UserProfile {
  name: string;
  uid: string;
  rankTitle: string;
  reliabilityScore: number;
  kycVerified: boolean;
  digilockerId: string;
  guardianVerified: boolean;
  guardianPhone: string;
  guardianName: string;
  poseVerifiedTonight: boolean;
  lastPoseName?: string;
  exploredPlacesCount: number;
  foundFriendsCount: number;
  trackRecord: {
    created: number;
    joined: number;
    missed: number;
    history: TrackHistoryEntry[];
  };
  walletBalance: number;
  lockedEscrowBalance: number;
  upiId: string;
  transactions: WalletTransaction[];
  exploredPlaces: ExploredPlace[];
  friends: MeetFriend[];
}

export interface FilterCriteria {
  searchQuery: string;
  dateMode: 'any' | 'after' | 'before';
  dateValue: string;
  timeValue: string;
  distanceKm: DistanceOption;
  categories: MeetCategory[];
  priceMode: 'all' | 'free' | 'paid';
  ageGroup: AgeDemographic;
  genderGroup: GenderDemographic;
  onlySafeguardPlus: boolean;
}
