import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ActiveRoute,
  FeedViewState,
  FilterCriteria,
  GeofenceStatus,
  MeetCategory,
  MeetItem,
  UserProfile,
} from '../types/meet';
import { INITIAL_CHENNAI_MEETS, INITIAL_USER_PROFILE } from '../data/chennaiMeets';
import { calculateReliabilityScore, filterMeets } from '../utils/meetLogic';

interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  tone: 'emerald' | 'amber' | 'rose';
}

interface MeetContextValue {
  route: ActiveRoute;
  setRoute: (route: ActiveRoute) => void;
  meets: MeetItem[];
  filteredMeets: MeetItem[];
  selectedMeet: MeetItem;
  setSelectedMeetId: (id: string) => void;
  isMeetSheetOpen: boolean;
  setIsMeetSheetOpen: (open: boolean) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isRandomModalOpen: boolean;
  setIsRandomModalOpen: (open: boolean) => void;
  feedTab: 'available' | 'upcoming' | 'sponsored';
  setFeedTab: (tab: 'available' | 'upcoming' | 'sponsored') => void;
  filters: FilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  resetFilters: () => void;
  user: UserProfile;
  feedViewState: FeedViewState;
  setFeedViewState: (state: FeedViewState) => void;
  geofenceStatus: GeofenceStatus;
  setGeofenceStatus: (status: GeofenceStatus) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  initiateJoinMeet: (meet: MeetItem) => void;
  completeEscrowCheckout: (meetId: string, paymentMethod: string) => void;
  completeQrCheckIn: (meetId: string) => void;
  createNewMeet: (newMeet: Omit<MeetItem, 'id' | 'occupiedSpots' | 'hostName' | 'hostUid' | 'hostReliability' | 'hostAvatarSeed' | 'joinedByUser'>) => void;
  withdrawWalletToUpi: (amount: number, upiId: string) => boolean;
  markKycVerified: (digilockerId: string) => void;
  markGuardianVerified: (guardianName: string, guardianPhone: string) => void;
  markPoseVerified: (poseName: string) => void;
  simulateFlakeCredit: () => void;
  toast: ToastNotification | null;
  showToast: (title: string, description?: string, tone?: 'emerald' | 'amber' | 'rose') => void;
}

const DEFAULT_FILTERS: FilterCriteria = {
  searchQuery: '',
  dateMode: 'any',
  dateValue: '',
  timeValue: '',
  distanceKm: 25,
  categories: [],
  priceMode: 'all',
  ageGroup: 'All',
  genderGroup: 'Both',
  onlySafeguardPlus: false,
};

const MeetContext = createContext<MeetContextValue | null>(null);

export const MeetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<ActiveRoute>('/home');
  const [meets, setMeets] = useState<MeetItem[]>(INITIAL_CHENNAI_MEETS);
  const [selectedMeetId, setSelectedMeetId] = useState<string>(
    INITIAL_CHENNAI_MEETS[4].id // Sunday Morning Cricket @ Nehru Stadium
  );
  const [isMeetSheetOpen, setIsMeetSheetOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);
  const [feedTab, setFeedTab] = useState<'available' | 'upcoming' | 'sponsored'>('available');
  const [filters, setFilters] = useState<FilterCriteria>(DEFAULT_FILTERS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [feedViewState, setFeedViewState] = useState<FeedViewState>('populated');
  const [geofenceStatus, setGeofenceStatus] = useState<GeofenceStatus>('safe');
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (
    title: string,
    description?: string,
    tone: 'emerald' | 'amber' | 'rose' = 'emerald'
  ) => {
    const id = String(Date.now());
    setToast({ id, title, description, tone });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4200);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setFeedTab('available');
  };

  const filteredMeets = useMemo(() => {
    const baseFiltered = filterMeets(meets, filters);
    if (feedTab === 'upcoming') {
      const joined = baseFiltered.filter((m) => m.joinedByUser);
      return joined.length > 0 ? joined : baseFiltered.slice(0, 3);
    }
    if (feedTab === 'sponsored') {
      return baseFiltered.filter((m) => m.isSponsored);
    }
    return baseFiltered;
  }, [meets, filters, feedTab]);

  const selectedMeet = useMemo(() => {
    return meets.find((m) => m.id === selectedMeetId) || meets[0];
  }, [meets, selectedMeetId]);

  const initiateJoinMeet = (meet: MeetItem) => {
    setSelectedMeetId(meet.id);
    setIsMeetSheetOpen(false);
    if (meet.joinedByUser) {
      setRoute('/meet/active');
      return;
    }
    if (meet.escrowAmount > 0) {
      setRoute('/meet/checkout');
    } else {
      // Free meet joins immediately
      setMeets((prev) =>
        prev.map((m) =>
          m.id === meet.id
            ? {
                ...m,
                joinedByUser: true,
                occupiedSpots: Math.min(m.maxSpots, m.occupiedSpots + 1),
              }
            : m
        )
      );
      showToast(
        `Joined ${meet.title}!`,
        'Spot confirmed. Check in with the Host Rolling QR at the venue.',
        'emerald'
      );
      setRoute('/meet/active');
    }
  };

  const completeEscrowCheckout = (meetId: string, paymentMethod: string) => {
    const target = meets.find((m) => m.id === meetId);
    if (!target) return;

    setMeets((prev) =>
      prev.map((m) =>
        m.id === meetId
          ? {
              ...m,
              joinedByUser: true,
              occupiedSpots: Math.min(m.maxSpots, m.occupiedSpots + 1),
            }
          : m
      )
    );

    setUser((prev) => ({
      ...prev,
      lockedEscrowBalance: prev.lockedEscrowBalance + target.escrowAmount,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          title: `Escrow Locked: ${target.title}`,
          subtitle: `Via ${paymentMethod} · Refunded on venue QR scan`,
          timestamp: 'Just now',
          amount: target.escrowAmount,
          type: 'escrow_lock',
          status: 'Locked',
        },
        ...prev.transactions,
      ],
    }));

    showToast(
      `₹${target.escrowAmount} Escrow Locked`,
      `Seat reserved for ${target.title}. Scan the rolling QR at ${target.venueName} to unlock refund.`,
      'emerald'
    );
    setRoute('/meet/active');
  };

  const completeQrCheckIn = (meetId: string) => {
    const target = meets.find((m) => m.id === meetId);
    if (!target) return;

    if (target.checkedInByUser) {
      showToast('Already Checked In', 'Your escrow refund has already been processed.', 'amber');
      return;
    }

    setMeets((prev) =>
      prev.map((m) =>
        m.id === meetId ? { ...m, joinedByUser: true, checkedInByUser: true } : m
      )
    );

    const newJoinedCount = user.trackRecord.joined + 1;
    const newReliability = calculateReliabilityScore(
      user.trackRecord.created,
      newJoinedCount,
      user.trackRecord.missed
    );

    setUser((prev) => ({
      ...prev,
      reliabilityScore: newReliability,
      lockedEscrowBalance: Math.max(0, prev.lockedEscrowBalance - target.escrowAmount),
      walletBalance: prev.walletBalance + target.escrowAmount,
      trackRecord: {
        ...prev.trackRecord,
        joined: newJoinedCount,
        history: [
          {
            id: `tr-${Date.now()}`,
            dateLabel: '25-08-26',
            timeLabel: target.dateTimeLabel.split(',')[0] || '6:00pm',
            meetTitle: target.title,
            venueName: target.venueName,
            status: 'Joined',
            escrowDelta: target.escrowAmount,
          },
          ...prev.trackRecord.history,
        ],
      },
      transactions: [
        {
          id: `tx-${Date.now()}`,
          title: `Escrow Refunded: ${target.title}`,
          subtitle: `Verified TOTP QR Check-In @ ${target.venueName}`,
          timestamp: 'Just now',
          amount: target.escrowAmount,
          type: 'escrow_refund',
          status: 'Completed',
        },
        ...prev.transactions,
      ],
    }));

    showToast(
      target.escrowAmount > 0
        ? `Check-In Verified! ₹${target.escrowAmount} Refunded`
        : 'Attendance Verified via Rolling QR!',
      `Reliability score is now ${newReliability}/100.`,
      'emerald'
    );
  };

  const createNewMeet = (
    newMeetData: Omit<
      MeetItem,
      | 'id'
      | 'occupiedSpots'
      | 'hostName'
      | 'hostUid'
      | 'hostReliability'
      | 'hostAvatarSeed'
      | 'joinedByUser'
    >
  ) => {
    const newId = `meet-custom-${Date.now()}`;
    const createdMeet: MeetItem = {
      ...newMeetData,
      id: newId,
      occupiedSpots: 1,
      hostName: user.name,
      hostUid: user.uid,
      hostReliability: user.reliabilityScore,
      hostAvatarSeed: 'JK',
      joinedByUser: true,
    };

    setMeets((prev) => [createdMeet, ...prev]);
    setSelectedMeetId(newId);
    setUser((prev) => ({
      ...prev,
      trackRecord: {
        ...prev.trackRecord,
        created: prev.trackRecord.created + 1,
        history: [
          {
            id: `tr-host-${Date.now()}`,
            dateLabel: '25-08-26',
            timeLabel: createdMeet.dateTimeLabel.split(',')[0] || '7:00pm',
            meetTitle: createdMeet.title,
            venueName: createdMeet.venueName,
            status: 'Hosted',
            escrowDelta: 0,
          },
          ...prev.trackRecord.history,
        ],
      },
    }));

    setIsCreateModalOpen(false);
    showToast(
      'Meet Published to Chennai Feed!',
      `${createdMeet.title} at ${createdMeet.venueName} is now live.`,
      'emerald'
    );
  };

  const withdrawWalletToUpi = (amount: number, upiId: string): boolean => {
    if (amount <= 0 || amount > user.walletBalance || !upiId.includes('@')) {
      return false;
    }
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      upiId,
      transactions: [
        {
          id: `tx-upi-${Date.now()}`,
          title: `UPI Withdrawal to ${upiId}`,
          subtitle: 'Instant IMPS Settlement · Ref #UTR992841',
          timestamp: 'Just now',
          amount: -amount,
          type: 'upi_withdrawal',
          status: 'Completed',
        },
        ...prev.transactions,
      ],
    }));
    showToast(
      `₹${amount} Sent to ${upiId}`,
      'Accrued flake penalty credits settled via UPI.',
      'emerald'
    );
    return true;
  };

  const markKycVerified = (digilockerId: string) => {
    setUser((prev) => ({
      ...prev,
      kycVerified: true,
      digilockerId: digilockerId || prev.digilockerId,
    }));
    showToast(
      'DigiLocker KYC & 3D Liveness Verified',
      'Your verified badge is active on all Chennai meets.',
      'emerald'
    );
  };

  const markGuardianVerified = (guardianName: string, guardianPhone: string) => {
    setUser((prev) => ({
      ...prev,
      guardianVerified: true,
      guardianName,
      guardianPhone,
    }));
    showToast(
      'Parental / Guardian Handshake Linked',
      `Live Safeguard+ SOS telemetry linked to ${guardianName}.`,
      'emerald'
    );
  };

  const markPoseVerified = (poseName: string) => {
    setUser((prev) => ({
      ...prev,
      poseVerifiedTonight: true,
      lastPoseName: poseName,
    }));
    showToast(
      'Late-Night Pose Match Confirmed!',
      `Verified "${poseName}". Safeguard+ night timer extended by 60 mins.`,
      'emerald'
    );
  };

  const simulateFlakeCredit = () => {
    const bonus = 45;
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + bonus,
      transactions: [
        {
          id: `tx-flake-${Date.now()}`,
          title: 'Flaked Attendee Escrow Credit',
          subtitle: '1 no-show penalty redistributed from Nehru Stadium Meet',
          timestamp: 'Just now',
          amount: bonus,
          type: 'penalty_credit',
          status: 'Completed',
        },
        ...prev.transactions,
      ],
    }));
    showToast(
      '+₹45 Flake Penalty Credited!',
      'A no-show attendee forfeited their ₹100 deposit; your share is in your wallet.',
      'amber'
    );
  };

  return (
    <MeetContext.Provider
      value={{
        route,
        setRoute,
        meets,
        filteredMeets,
        selectedMeet,
        setSelectedMeetId,
        isMeetSheetOpen,
        setIsMeetSheetOpen,
        isFilterOpen,
        setIsFilterOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isRandomModalOpen,
        setIsRandomModalOpen,
        feedTab,
        setFeedTab,
        filters,
        setFilters,
        resetFilters,
        user,
        feedViewState,
        setFeedViewState,
        geofenceStatus,
        setGeofenceStatus,
        isSosModalOpen,
        setIsSosModalOpen,
        initiateJoinMeet,
        completeEscrowCheckout,
        completeQrCheckIn,
        createNewMeet,
        withdrawWalletToUpi,
        markKycVerified,
        markGuardianVerified,
        markPoseVerified,
        simulateFlakeCredit,
        toast,
        showToast,
      }}
    >
      {children}
    </MeetContext.Provider>
  );
};

export function useMeet() {
  const ctx = useContext(MeetContext);
  if (!ctx) throw new Error('useMeet must be used within MeetProvider');
  return ctx;
}
