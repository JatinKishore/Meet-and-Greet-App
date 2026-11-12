/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MapPin,
  List,
  Plus,
  Search,
  WifiOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Wallet,
  User,
  Home,
  Palette,
} from 'lucide-react';
import { MeetProvider, useMeet } from './context/MeetContext';
import { VIBE_PALETTES } from './data/vibePalettes';
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
import {
  CreateAndRandomModals,
  RandomEdgeBubble,
} from './components/CreateAndRandomModals';
import {
  GeofenceSosOverlay,
  MvpDemoControlsPill,
} from './components/GeofenceAndDemoControls';
import { VibePaletteModal } from './components/VibePaletteModal';

const MainFeedScreen: React.FC = () => {
  const {
    route,
    setRoute,
    filteredMeets,
    setSelectedMeetId,
    setIsMeetSheetOpen,
    initiateJoinMeet,
    setIsCreateModalOpen,
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
    <div className="pb-28">
      {/* View Toggle Row + Search with generous outer margins */}
      <div className="px-5 pt-4 pb-4 space-y-3.5 border-b border-white/[0.08]">
        <div className="flex items-center justify-between gap-2">
          {/* Animated Segmented Pill Toggle: List View vs Map View */}
          <div
            role="tablist"
            aria-label="Switch between List View and Map View"
            className="inline-flex items-center p-1 rounded-full vibe-card backdrop-blur-xl border shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isMapView}
              onClick={() => setRoute('/home')}
              className={`min-h-[38px] px-3.5 rounded-full text-xs font-display font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                !isMapView
                  ? 'vibe-cta-primary shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5 shrink-0" />
              Feed
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={isMapView}
              onClick={() => setRoute('/home/map')}
              className={`min-h-[38px] px-3.5 rounded-full text-xs font-display font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isMapView
                  ? 'vibe-cta-primary shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Radar Map
            </button>
          </div>

          {/* Feed Category Tab (Random Meet moved to Mid-Right Edge Bubble) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() =>
                setFeedTab(feedTab === 'sponsored' ? 'available' : 'sponsored')
              }
              className={`min-h-[40px] px-3.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all whitespace-nowrap ${
                feedTab === 'sponsored'
                  ? 'vibe-cta-primary border-transparent'
                  : 'vibe-card text-zinc-300'
              }`}
            >
              Brand Drops
            </button>
          </div>
        </div>

        {/* Consumer Pill Search Input */}
        <div className="flex items-center gap-3 min-h-[46px] px-4 rounded-full vibe-card backdrop-blur-xl border transition-colors">
          <Search className="w-4 h-4 vibe-text-accent shrink-0" />
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Find cricket, filter coffee, coding jams, beach walks..."
            aria-label="Search Chennai hangouts"
            className="w-full bg-transparent text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Conditional Map View vs List View */}
      {isMapView ? (
        <div className="pt-4">
          <ChennaiMapView />
        </div>
      ) : (
        <div className="px-5 pt-6">
          {/* 1. LOADING (SHIMMER) STATE */}
          {feedViewState === 'loading' && (
            <div
              className="grid grid-cols-1 gap-6"
              aria-label="Loading Chennai Meets Shimmer"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4 animate-pulse"
                >
                  <div className="h-44 w-full bg-zinc-500/20 rounded-2xl" />
                  <div className="h-5 w-3/4 bg-zinc-500/20 rounded-full" />
                  <div className="h-14 w-full bg-zinc-500/15 rounded-2xl" />
                  <div className="h-12 w-full bg-zinc-500/20 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* 2. OFFLINE ERROR STATE */}
          {feedViewState === 'error' && (
            <div className="rounded-3xl vibe-card backdrop-blur-xl border border-rose-500/40 p-6 text-center space-y-3.5 my-2">
              <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto">
                <WifiOff className="w-6 h-6" />
              </div>
              <h2 className="font-display font-extrabold text-lg tracking-tight text-white">
                You’re Offline Right Now
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Can’t refresh live Chennai hangouts at the moment, but your active Check-In Pass is saved and ready to flash at the venue.
              </p>
              <button
                type="button"
                onClick={() => setFeedViewState('populated')}
                className="min-h-[48px] px-6 rounded-full vibe-cta-primary font-display font-extrabold text-xs inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh Feed
              </button>
            </div>
          )}

          {/* 3. EMPTY STATE */}
          {(feedViewState === 'empty' ||
            (feedViewState === 'populated' && filteredMeets.length === 0)) && (
            <div className="rounded-3xl vibe-card backdrop-blur-xl border p-6 text-center space-y-3.5 my-2">
              <div className="w-12 h-12 rounded-full vibe-cta-primary flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-display font-extrabold text-lg tracking-tight text-white">
                No hangouts match that filter yet!
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Widen your distance radar or start your own hangout in 30 seconds.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setFeedViewState('populated');
                  }}
                  className="min-h-[46px] px-5 rounded-full vibe-card-subtle border text-xs font-bold text-zinc-200"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="min-h-[46px] px-6 rounded-full vibe-cta-primary font-display font-extrabold text-xs"
                >
                  + Start a Hangout
                </button>
              </div>
            </div>
          )}

          {/* 4. POPULATED FEED GRID WITH GAP-6 VERTICAL SPACING */}
          {feedViewState === 'populated' && filteredMeets.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
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

      {/* Consumer Floating Bottom Pill Dock (Feed · H+st · Profile) */}
      <div className="fixed bottom-0 left-0 right-0 lg:static lg:mt-8 z-30 pointer-events-none flex justify-center">
        <div className="pointer-events-auto w-full max-w-[480px] bg-[#09090B]/90 backdrop-blur-xl border-t border-white/15 px-8 py-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRoute('/home')}
            className={`min-h-[46px] px-4 rounded-full flex flex-col items-center justify-center text-[11px] font-bold transition-colors ${
              route === '/home' ? 'vibe-text-accent' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            Feed
          </button>

          {/* Center High-Energy "H+st" Button (+ circle acts as the 'o' in Host) */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="H+st Meet"
            className="min-h-[48px] px-7 rounded-full vibe-cta-primary font-display font-black text-base tracking-tight flex items-center justify-center gap-0.5 active:scale-95 transition-transform shadow-lg"
          >
            <span>H</span>
            <span
              aria-hidden="true"
              className="w-5 h-5 mx-0.5 rounded-full bg-black/25 border border-current flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3.2]" />
            </span>
            <span>st</span>
          </button>

          <button
            type="button"
            onClick={() => setRoute('/profile')}
            className={`min-h-[46px] px-4 rounded-full flex flex-col items-center justify-center text-[11px] font-bold transition-colors ${
              route === '/profile' ? 'vibe-text-accent' : 'text-zinc-400 hover:text-zinc-200'
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
    profileSubTab,
    setProfileSubTab,
    user,
    meets,
    selectedMeet,
    toast,
    vibePaletteId,
    setVibePaletteId,
    activeVibePalette,
    setIsVibeModalOpen,
    setIsFilterOpen,
    setIsCreateModalOpen,
    setIsRandomModalOpen,
  } = useMeet();

  return (
    <div className="min-h-screen vibe-canvas flex flex-col transition-colors duration-300">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          role="status"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-3xl vibe-card backdrop-blur-xl border p-4 shadow-2xl flex items-start gap-3"
        >
          <ShieldCheck className="w-5 h-5 vibe-text-accent shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-display font-extrabold text-white">{toast.title}</div>
            {toast.description && (
              <div className="text-zinc-300 mt-0.5 leading-relaxed">{toast.description}</div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Desktop Multi-Column Container + Native Mobile Frame */}
      <div className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:py-8 lg:px-8 items-start">
        {/* Left Companion Column (Visible on 1440px Desktop) */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-8">
          <div className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                Meet &amp; Greet
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold vibe-cta-primary">
                {activeVibePalette.emoji} {activeVibePalette.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Spontaneous Chennai hangouts blending the swipe-worthy social energy of{' '}
              <strong className="text-white">Tinder/Bumble</strong> with the live local utility of{' '}
              <strong className="text-white">Swiggy &amp; Rapido</strong>.
            </p>

            <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl vibe-card-subtle border">
                <div className="text-zinc-400">Logged In</div>
                <div className="font-display font-bold text-sm text-white mt-0.5">
                  {user.name}
                </div>
                <div className="font-mono text-[11px] vibe-text-accent font-bold mt-0.5">
                  {user.reliabilityScore}% Vibe Score
                </div>
              </div>

              <div className="p-3.5 rounded-2xl vibe-card-subtle border">
                <div className="text-zinc-400">Cashback Pot</div>
                <div className="font-mono font-extrabold text-base vibe-text-accent mt-0.5">
                  ₹{user.walletBalance}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  +{user.exploredPlacesCount} Chennai spots
                </div>
              </div>
            </div>
          </div>

          {/* 9 Vibe-Filled Consumer Palettes Quick Switcher Card */}
          <div className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h2 className="font-display font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 vibe-text-accent" />
                9 Vibe-Filled Consumer Palettes
              </h2>
              <button
                type="button"
                onClick={() => setIsVibeModalOpen(true)}
                className="text-[11px] font-bold vibe-text-accent hover:underline"
              >
                Full Guide →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1">
              {VIBE_PALETTES.map((p) => {
                const isSelected = p.id === vibePaletteId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setVibePaletteId(p.id)}
                    className={`min-h-[40px] px-3 py-2 rounded-2xl border text-left flex items-center justify-between gap-2 text-xs transition-all ${
                      isSelected
                        ? 'vibe-cta-primary border-transparent font-extrabold'
                        : 'vibe-card-subtle text-zinc-300 hover:opacity-90 font-medium'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <span>{p.emoji}</span>
                      <span>{p.name}</span>
                      <span className="text-[10px] opacity-75">({p.pairLabel})</span>
                    </span>
                    <span className="flex items-center -space-x-1 shrink-0">
                      {p.swatches.map((hex, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Screen Jump Matrix for Evaluator */}
          <div className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-3.5">
            <h2 className="font-display font-extrabold text-sm tracking-tight text-white pb-2 border-b border-white/[0.08]">
              Interactive Screen Navigator
            </h2>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                {
                  id: 'nav-home',
                  label: '1. Consumer Feed (/home)',
                  isActive: route === '/home',
                  onSelect: () => setRoute('/home'),
                },
                {
                  id: 'nav-available-map',
                  label: '2. Map 1: Available Hangouts (/home/map)',
                  isActive: route === '/home/map',
                  onSelect: () => setRoute('/home/map'),
                },
                {
                  id: 'nav-client-map',
                  label: '3. Map 2: Your Past Hangouts (/profile)',
                  isActive: route === '/profile' && profileSubTab === 'map',
                  onSelect: () => {
                    setProfileSubTab('map');
                    setRoute('/profile');
                  },
                },
                {
                  id: 'nav-profile',
                  label: '4. Profile & Cashback Wallet (/profile)',
                  isActive: route === '/profile' && profileSubTab !== 'map',
                  onSelect: () => {
                    setProfileSubTab('track');
                    setRoute('/profile');
                  },
                },
                {
                  id: 'nav-kyc',
                  label: '5. Verified Identity & 3s Liveness (/onboarding/kyc)',
                  isActive: route === '/onboarding/kyc' || route === '/onboarding/guardian',
                  onSelect: () => setRoute('/onboarding/kyc'),
                },
                {
                  id: 'nav-checkout',
                  label: '6. Reserve Refundable Pass (/meet/checkout)',
                  isActive: route === '/meet/checkout',
                  onSelect: () => setRoute('/meet/checkout'),
                },
                {
                  id: 'nav-active',
                  label: '7. Show Host Pass / Scan Pass (/meet/active)',
                  isActive: route === '/meet/active',
                  onSelect: () => setRoute('/meet/active'),
                },
                {
                  id: 'nav-pose',
                  label: '8. Late-Night Fun Pose Check (/meet/verify-pose)',
                  isActive: route === '/meet/verify-pose',
                  onSelect: () => setRoute('/meet/verify-pose'),
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onSelect}
                  className={`min-h-[40px] px-3.5 rounded-2xl text-left font-medium border transition-all flex items-center justify-between ${
                    item.isActive
                      ? 'vibe-cta-primary border-transparent font-bold'
                      : 'vibe-card-subtle text-zinc-300 hover:opacity-90'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="font-mono text-[10px] opacity-75">→</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="min-h-[40px] rounded-full vibe-card-subtle border text-xs font-bold text-zinc-200"
              >
                Filters
              </button>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="min-h-[40px] rounded-full vibe-cta-primary text-xs font-extrabold flex items-center justify-center gap-0.5"
              >
                <span>H</span>
                <span className="w-3.5 h-3.5 rounded-full bg-black/25 flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>st</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRandomModalOpen(true)}
                className="min-h-[40px] rounded-full vibe-card-subtle border text-xs font-bold vibe-text-accent"
              >
                Random
              </button>
            </div>
          </div>
        </aside>

        {/* Center Interactive Mobile Device Frame (Full-bleed on Mobile, iOS/Android Frame on Desktop) */}
        <main className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-[480px] min-h-screen lg:min-h-[840px] bg-[#09090B] lg:rounded-[42px] lg:border-[3px] lg:border-white/15 lg:shadow-2xl overflow-hidden flex flex-col relative transition-colors duration-300">
            {/* Persistent Top App Header */}
            <TopAppHeader />

            {/* Persistent Geofence Safe-Zone Monitor Banner */}
            <GeofenceSosOverlay />

            {/* Mid-Right Edge Random Meet Bubble Button & Presets Popover */}
            <RandomEdgeBubble />

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

        {/* Right Live Hangout & Vibe Mode Inspector (Visible on Desktop) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-8">
          <div className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold vibe-text-accent pb-3 border-b border-white/[0.08]">
              <Wallet className="w-4 h-4" />
              Selected Hangout Spotlight
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg tracking-tight text-white leading-snug">
                {selectedMeet.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {selectedMeet.venueName} · {selectedMeet.dateTimeLabel}
              </p>
            </div>
            <div className="p-4 rounded-2xl vibe-card-subtle border space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Event Pass:</span>
                <span className="font-mono font-extrabold vibe-text-accent">
                  {selectedMeet.escrowAmount === 0
                    ? 'Free Entry'
                    : `₹${selectedMeet.escrowAmount} Refundable`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Squad Size:</span>
                <span className="font-mono font-bold text-zinc-200">
                  {selectedMeet.occupiedSpots}/{selectedMeet.maxSpots} in
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Host Vibe Score:</span>
                <span className="font-mono font-bold text-emerald-500">
                  {selectedMeet.hostReliability}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl vibe-card-subtle border space-y-1.5 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>{activeVibePalette.emoji}</span>
                <span>{activeVibePalette.name}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {activeVibePalette.vibeDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.08] text-xs text-zinc-400 flex items-center justify-between">
              <span>Live Chennai Hangouts</span>
              <strong className="text-white font-mono">{meets.length}</strong>
            </div>
          </div>
        </aside>
      </div>

      {/* Global Slide-Over Drawers & Bottom Sheet Modals */}
      <SidebarDrawer />
      <FilterBottomSheet />
      <BottomSheetMeetDetails />
      <CreateAndRandomModals />
      <VibePaletteModal />
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
