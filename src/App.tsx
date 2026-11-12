/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MapPin,
  List,
  Plus,
  Dices,
  Search,
  WifiOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Wallet,
  QrCode,
  User,
  Home,
} from 'lucide-react';
import { MeetProvider, useMeet } from './context/MeetContext';
import { TopAppHeader } from './components/TopAppHeader';
import { MeetCard } from './components/MeetCard';
import { SidebarDrawer } from './components/SidebarDrawer';
import { FilterBottomSheet } from './components/FilterBottomSheet';
import { BottomSheetMeetDetails } from './components/BottomSheetMeetDetails';
import { ChennaiMapView } from './components/ChennaiMapView';
import { ProfileView } from './components/ProfileView';
import {
  KycAndGuardianFlow,
  EscrowCheckoutFlow,
  ActiveMeetQrFlow,
  LateNightPoseFlow,
} from './components/SafetyAndOnboardingFlows';
import { CreateAndRandomModals } from './components/CreateAndRandomModals';
import {
  GeofenceSosOverlay,
  MvpDemoControlsPill,
} from './components/GeofenceAndDemoControls';

const MainFeedScreen: React.FC = () => {
  const {
    route,
    setRoute,
    filteredMeets,
    setSelectedMeetId,
    setIsMeetSheetOpen,
    initiateJoinMeet,
    setIsCreateModalOpen,
    setIsRandomModalOpen,
    feedTab,
    setFeedTab,
    filters,
    setFilters,
    resetFilters,
    feedViewState,
    setFeedViewState,
  } = useMeet();

  const isMapView = route === '/home/map';

  const handleOpenMeetDetails = (meet: (typeof filteredMeets)[0]) => {
    setSelectedMeetId(meet.id);
    setIsMeetSheetOpen(true);
  };

  return (
    <div className="pb-24">
      {/* View Toggle Row + Search + Random Dice (Mapped directly from App Design.pdf doodle) */}
      <div className="px-3.5 pt-3 pb-2.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Animated Segmented Pill Toggle: List View vs Map View */}
          <div
            role="tablist"
            aria-label="Switch between List View and Map View"
            className="inline-flex items-center p-1 rounded-xl bg-[#121215] border border-white/10"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isMapView}
              onClick={() => setRoute('/home')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                !isMapView
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List View
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={isMapView}
              onClick={() => setRoute('/home/map')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isMapView
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Map View
            </button>
          </div>

          {/* Feed Category Tabs + Doodle 3D Dice Random Meet Trigger */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setFeedTab(feedTab === 'sponsored' ? 'available' : 'sponsored')
              }
              className={`min-h-[38px] px-2.5 rounded-xl text-[11px] font-semibold border transition-colors whitespace-nowrap ${
                feedTab === 'sponsored'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#121215] border-white/10 text-zinc-300 hover:border-white/25'
              }`}
            >
              Sponsor Offers
            </button>

            <button
              type="button"
              onClick={() => setIsRandomModalOpen(true)}
              title="Random Meet Dice Matcher (from Doodle)"
              aria-label="Roll Random Meet Dice"
              className="min-h-[38px] min-w-[38px] rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center text-emerald-300 transition-transform active:scale-95"
            >
              <Dices className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Search Anna Nagar, Nehru Stadium, Cricket, Code, Coffee..."
            aria-label="Search Chennai meets"
            className="w-full min-h-[40px] pl-9 pr-3.5 rounded-xl bg-[#121215] border border-white/10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Conditional Map View vs List View */}
      {isMapView ? (
        <ChennaiMapView />
      ) : (
        <div className="px-3.5">
          {/* 1. LOADING (SHIMMER) STATE */}
          {feedViewState === 'loading' && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              aria-label="Loading Chennai Meets Shimmer"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#121215] border border-white/10 p-4 space-y-3 animate-pulse"
                >
                  <div className="h-3 w-24 bg-zinc-800 rounded" />
                  <div className="h-5 w-3/4 bg-zinc-800 rounded" />
                  <div className="h-3 w-1/2 bg-zinc-800 rounded" />
                  <div className="h-2 w-full bg-zinc-800 rounded" />
                  <div className="h-9 w-full bg-zinc-800 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* 2. OFFLINE ERROR STATE */}
          {feedViewState === 'error' && (
            <div className="rounded-3xl bg-[#121215] border border-rose-500/40 p-6 text-center space-y-3 my-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <WifiOff className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-base text-white">
                Network Disconnected
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Unable to sync live Chennai escrow pools and geofence telemetry. Your active QR check-in tokens remain cached offline.
              </p>
              <button
                type="button"
                onClick={() => setFeedViewState('populated')}
                className="min-h-[44px] px-4 rounded-xl bg-emerald-500 text-zinc-950 font-display font-bold text-xs inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reconnect to Chennai Node
              </button>
            </div>
          )}

          {/* 3. EMPTY STATE */}
          {(feedViewState === 'empty' ||
            (feedViewState === 'populated' && filteredMeets.length === 0)) && (
            <div className="rounded-3xl bg-[#121215] border border-white/10 p-6 text-center space-y-3 my-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-base text-white">
                No meets nearby. Be the first to host!
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                No active Chennai meets matched your current radius or category filter. Reset filters or start your own meet!
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setFeedViewState('populated');
                  }}
                  className="min-h-[42px] px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-xs font-semibold text-zinc-200"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="min-h-[42px] px-3.5 rounded-xl bg-emerald-500 text-zinc-950 font-display font-bold text-xs"
                >
                  + Host a Meet
                </button>
              </div>
            </div>
          )}

          {/* 4. POPULATED 2-COLUMN DOODLE GRID */}
          {feedViewState === 'populated' && filteredMeets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredMeets.map((meet) => (
                <MeetCard
                  key={meet.id}
                  meet={meet}
                  onSelectDetails={handleOpenMeetDetails}
                  onJoinAction={initiateJoinMeet}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Doodle Bottom Create + Meet Semi-Circular Dock & Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 lg:static lg:mt-6 z-30 pointer-events-none flex justify-center">
        <div className="pointer-events-auto w-full max-w-[460px] bg-[#09090B]/95 backdrop-blur-xl border-t border-white/15 px-4 py-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRoute('/home')}
            className={`min-h-[44px] px-2.5 rounded-xl flex flex-col items-center justify-center text-[10px] font-medium ${
              route === '/home' ? 'text-emerald-400' : 'text-zinc-400'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            Feed
          </button>

          <button
            type="button"
            onClick={() => setRoute('/home/map')}
            className={`min-h-[44px] px-2.5 rounded-xl flex flex-col items-center justify-center text-[10px] font-medium ${
              route === '/home/map' ? 'text-emerald-400' : 'text-zinc-400'
            }`}
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            Map
          </button>

          {/* Center Doodle "Create + Meet" Arc Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="Create Meet"
            className="min-h-[46px] px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-display font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
          >
            <span className="w-5 h-5 rounded-full bg-zinc-950 text-emerald-400 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span>Create Meet</span>
          </button>

          <button
            type="button"
            onClick={() => setRoute('/meet/active')}
            className={`min-h-[44px] px-2.5 rounded-xl flex flex-col items-center justify-center text-[10px] font-medium ${
              route === '/meet/active' ? 'text-emerald-400' : 'text-zinc-400'
            }`}
          >
            <QrCode className="w-4 h-4 mb-0.5" />
            Active QR
          </button>

          <button
            type="button"
            onClick={() => setRoute('/profile')}
            className={`min-h-[44px] px-2.5 rounded-xl flex flex-col items-center justify-center text-[10px] font-medium ${
              route === '/profile' ? 'text-emerald-400' : 'text-zinc-400'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const PrototypeWorkspace: React.FC = () => {
  const {
    route,
    setRoute,
    user,
    meets,
    selectedMeet,
    toast,
    setIsFilterOpen,
    setIsCreateModalOpen,
    setIsRandomModalOpen,
  } = useMeet();

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          role="status"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-2xl bg-[#121215]/95 backdrop-blur-xl border border-emerald-500/50 p-3.5 shadow-2xl flex items-start gap-3"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-display font-bold text-white">{toast.title}</div>
            {toast.description && (
              <div className="text-zinc-300 mt-0.5">{toast.description}</div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Desktop Multi-Column Container + Native Mobile Frame */}
      <div className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:py-6 lg:px-6 items-start">
        {/* Left Companion Column (Visible on 1440px Desktop so mobile frame isn't stranded on a desert island) */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-4 sticky top-6">
          <div className="rounded-3xl bg-[#121215] border border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Meet &amp; Greet
              </span>
              <span className="font-mono text-xs text-emerald-400">
                Chennai MVP
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hyper-local group discovery across Chennai with refundable{' '}
              <strong className="text-zinc-200">₹ Escrow deposits</strong>,{' '}
              <strong className="text-zinc-200">DigiLocker KYC</strong>, rolling{' '}
              <strong className="text-zinc-200">30s TOTP QR</strong> check-ins, and{' '}
              <strong className="text-zinc-200">Safeguard+ Geofencing</strong>.
            </p>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10">
                <div className="text-zinc-400">Active Persona</div>
                <div className="font-display font-bold text-sm text-white mt-0.5">
                  {user.name}
                </div>
                <div className="font-mono text-[11px] text-emerald-400">
                  UID: {user.uid} · {user.reliabilityScore}/100
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10">
                <div className="text-zinc-400">Penalty Wallet</div>
                <div className="font-mono font-bold text-base text-amber-300 mt-0.5">
                  ₹{user.walletBalance}
                </div>
                <div className="text-[11px] text-zinc-400">
                  +{user.exploredPlacesCount} Chennai spots
                </div>
              </div>
            </div>
          </div>

          {/* Quick Screen Jump Matrix for Evaluator */}
          <div className="rounded-3xl bg-[#121215] border border-white/10 p-5 space-y-2.5">
            <h2 className="font-display font-bold text-sm text-white">
              Doodle &amp; PRD Screen Navigator
            </h2>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                { routeId: '/home', label: '1. Main Feed (/home · 2-Col Doodle Grid)' },
                { routeId: '/home/map', label: '2. Interactive Chennai Map (/home/map)' },
                { routeId: '/profile', label: '3. Profile & Track Record (/profile)' },
                { routeId: '/onboarding/kyc', label: '4. DigiLocker KYC & 3s Liveness (/onboarding/kyc)' },
                { routeId: '/meet/checkout', label: '5. Razorpay ₹100 Escrow Lock (/meet/checkout)' },
                { routeId: '/meet/active', label: '6. Rolling 30s TOTP QR & Scanner (/meet/active)' },
                { routeId: '/meet/verify-pose', label: '7. Late-Night Fun Pose Check (/meet/verify-pose)' },
              ].map((item) => (
                <button
                  key={item.routeId}
                  type="button"
                  onClick={() => setRoute(item.routeId as typeof route)}
                  className={`min-h-[40px] px-3 rounded-xl text-left font-medium border transition-colors flex items-center justify-between ${
                    route === item.routeId
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-zinc-900/70 border-white/10 text-zinc-300 hover:border-white/25'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="font-mono text-[10px] opacity-75">→</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="min-h-[38px] rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] font-semibold text-zinc-200"
              >
                Filter Sheet
              </button>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="min-h-[38px] rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] font-semibold text-emerald-300"
              >
                + Create Meet
              </button>
              <button
                type="button"
                onClick={() => setIsRandomModalOpen(true)}
                className="min-h-[38px] rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] font-semibold text-amber-300"
              >
                Random Dice
              </button>
            </div>
          </div>
        </aside>

        {/* Center Interactive Mobile Device Frame (Full-bleed on Mobile, iOS/Android Frame on Desktop) */}
        <main className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-[460px] min-h-screen lg:min-h-[820px] bg-[#09090B] lg:rounded-[38px] lg:border-[3px] lg:border-white/15 lg:shadow-2xl overflow-hidden flex flex-col relative">
            {/* Persistent Top App Header */}
            <TopAppHeader />

            {/* Persistent Geofence Safe-Zone Monitor Banner */}
            <GeofenceSosOverlay />

            {/* Active Route Body */}
            <div className="flex-1 overflow-y-auto">
              {(route === '/home' || route === '/home/map') && <MainFeedScreen />}
              {route === '/profile' && <ProfileView />}
              {(route === '/onboarding/kyc' || route === '/onboarding/guardian') && (
                <KycAndGuardianFlow />
              )}
              {route === '/meet/checkout' && <EscrowCheckoutFlow />}
              {route === '/meet/active' && <ActiveMeetQrFlow />}
              {route === '/meet/verify-pose' && <LateNightPoseFlow />}
            </div>
          </div>
        </main>

        {/* Right Live Escrow & Safety Telemetry Inspector (Visible on Desktop) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-6">
          <div className="rounded-3xl bg-[#121215] border border-white/10 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Wallet className="w-4 h-4" />
              Active Meet Escrow Spotlight
            </div>
            <h3 className="font-display font-bold text-base text-white">
              {selectedMeet.title}
            </h3>
            <p className="text-xs text-zinc-400">
              {selectedMeet.venueName} · {selectedMeet.dateTimeLabel}
            </p>
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Deposit Required:</span>
                <span className="font-mono font-bold text-amber-300">
                  {selectedMeet.escrowAmount === 0
                    ? '₹ Free'
                    : `₹${selectedMeet.escrowAmount}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Occupancy:</span>
                <span className="font-mono text-zinc-200">
                  {selectedMeet.occupiedSpots}/{selectedMeet.maxSpots} spots
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Host Reliability:</span>
                <span className="font-mono text-emerald-400">
                  {selectedMeet.hostReliability}/100
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-400">
              Total Chennai Meets Live: <strong className="text-white font-mono">{meets.length}</strong>
            </div>
          </div>
        </aside>
      </div>

      {/* Global Slide-Over Drawers & Bottom Sheet Modals */}
      <SidebarDrawer />
      <FilterBottomSheet />
      <BottomSheetMeetDetails />
      <CreateAndRandomModals />
      <MvpDemoControlsPill />
    </div>
  );
};

export default function App() {
  return (
    <MeetProvider>
      <PrototypeWorkspace />
    </MeetProvider>
  );
}
