import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Users,
  Wallet,
  ArrowUpRight,
  Compass,
  Activity,
  LogOut,
  Plus,
  AlertCircle,
  Sparkles,
  Flame,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { ClientHistoryMapView } from './ClientHistoryMapView';
import { VIBE_PALETTES } from '../data/vibePalettes';

export const ProfileView: React.FC = () => {
  const {
    user,
    setRoute,
    profileSubTab,
    setProfileSubTab,
    setSelectedHistoryId,
    withdrawWalletToUpi,
    simulateFlakeCredit,
    showToast,
    vibePaletteId,
    setVibePaletteId,
    activeVibePalette,
    setIsVibeModalOpen,
  } = useMeet();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('250');
  const [upiInput, setUpiInput] = useState<string>(user.upiId);
  const [withdrawError, setWithdrawError] = useState<string>('');

  const lightThemes = VIBE_PALETTES.filter((p) => p.isLightMode);
  const darkThemes = VIBE_PALETTES.filter((p) => !p.isLightMode);

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(withdrawAmount);
    if (!upiInput.trim() || !upiInput.includes('@')) {
      setWithdrawError('Please enter a valid UPI ID (e.g., jatinkishore@okaxis)');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setWithdrawError('Enter a valid withdrawal amount in ₹.');
      return;
    }
    if (numericAmount > user.walletBalance) {
      setWithdrawError(`Amount exceeds your available balance of ₹${user.walletBalance}.`);
      return;
    }

    const ok = withdrawWalletToUpi(numericAmount, upiInput.trim());
    if (ok) {
      setWithdrawError('');
      setIsWithdrawModalOpen(false);
    }
  };

  return (
    <div className="px-5 pb-12 space-y-6">
      {/* Top Bar */}
      <div className="pt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setRoute('/home')}
          className="min-h-[44px] px-4 rounded-full vibe-card backdrop-blur-xl border text-xs font-bold text-zinc-200 inline-flex items-center gap-2 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 vibe-text-accent" />
          Back to Feed
        </button>

        <button
          type="button"
          onClick={() => setRoute('/onboarding/kyc')}
          className="min-h-[44px] px-4 rounded-full vibe-cta-primary text-xs font-extrabold inline-flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          Verified Identity
        </button>
      </div>

      {/* Consumer Profile Hero Card */}
      <section className="rounded-3xl vibe-card backdrop-blur-xl border p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-full vibe-cta-primary flex items-center justify-center font-display font-extrabold text-xl shadow-lg shrink-0">
              JK
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center ring-2 ring-white">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </div>

            <div>
              <h1 className="font-display font-extrabold text-lg tracking-tight text-white">
                {user.name}
              </h1>
              <p className="font-mono text-xs text-zinc-400 mt-0.5">
                Member #{user.uid} · Verified Profile
              </p>
              <p className="text-xs vibe-text-accent font-bold mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {user.rankTitle}
              </p>
            </div>
          </div>

          {/* Vibe Score Pill */}
          <div className="text-right vibe-card-subtle border rounded-3xl px-4 py-2.5 shrink-0">
            <div className="font-mono font-extrabold text-xl vibe-text-accent tabular-nums">
              {user.reliabilityScore}%
            </div>
            <div className="text-[10px] font-semibold text-zinc-400">Vibe Score</div>
          </div>
        </div>

        {/* Consumer Stats Pills: Explored 19 Places | 29 Squad Friends */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setProfileSubTab('map')}
            className={`p-4 rounded-3xl border text-left transition-all ${
              profileSubTab === 'map' || profileSubTab === 'places'
                ? 'vibe-cta-primary border-transparent'
                : 'vibe-card-subtle hover:opacity-90'
            }`}
          >
            <div className="text-xs opacity-80">Spots Explored</div>
            <div className="font-display font-extrabold text-base mt-0.5 flex items-center justify-between">
              <span>
                <span className="font-mono tabular-nums">
                  {user.exploredPlacesCount}
                </span>{' '}
                hangouts
              </span>
              <MapPin className="w-4 h-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setProfileSubTab('friends')}
            className={`p-4 rounded-3xl border text-left transition-all ${
              profileSubTab === 'friends'
                ? 'vibe-cta-primary border-transparent'
                : 'vibe-card-subtle hover:opacity-90'
            }`}
          >
            <div className="text-xs opacity-80">Squad Connections</div>
            <div className="font-display font-extrabold text-base mt-0.5 flex items-center justify-between">
              <span>
                <span className="font-mono tabular-nums">
                  {user.foundFriendsCount}
                </span>{' '}
                friends
              </span>
              <Users className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>

      {/* Theme & Appearance Settings Card (Solid Light & Dark Themes) */}
      <section className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold vibe-text-accent flex items-center gap-1.5">
              <Palette className="w-4 h-4" />
              App Theme &amp; Appearance (Solid Colors)
            </span>
            <h2 className="font-display font-extrabold text-base text-white mt-0.5">
              {activeVibePalette.emoji} {activeVibePalette.name} ·{' '}
              <span className="text-xs font-semibold text-zinc-400">
                {activeVibePalette.pairLabel}
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsVibeModalOpen(true)}
            className="min-h-[40px] px-4 rounded-full vibe-cta-primary text-xs font-extrabold shrink-0"
          >
            Browse All
          </button>
        </div>

        {/* Light Theme Options */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
            <Sun className="w-3.5 h-3.5 vibe-text-accent" />
            <span>Light Theme (Light Blue, White, Golden Yellow, Dark Pink, Purple)</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {lightThemes.map((t) => {
              const active = t.id === vibePaletteId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setVibePaletteId(t.id);
                    showToast(
                      `${t.emoji} ${t.name} Theme Activated`,
                      t.pairLabel,
                      'emerald'
                    );
                  }}
                  className={`min-h-[42px] px-2 py-1.5 rounded-2xl border text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                    active ? 'ring-2 ring-offset-1 scale-[1.03]' : 'opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: t.cssVars['--vibe-accent'],
                    color: t.cssVars['--vibe-accent-fg'],
                    borderColor: t.cssVars['--vibe-border'],
                  }}
                >
                  <span>{t.emoji}</span>
                  <span className="truncate max-w-full text-[10px]">
                    {t.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dark Theme Options */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
            <Moon className="w-3.5 h-3.5 vibe-text-accent" />
            <span>Dark Theme (Dark Negative + Clean Light Shades)</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {darkThemes.map((t) => {
              const active = t.id === vibePaletteId;
              const shortLabel = t.name.replace('Dark Negative · ', '');
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setVibePaletteId(t.id);
                    showToast(
                      `${t.emoji} ${t.name} Theme Activated`,
                      t.pairLabel,
                      'emerald'
                    );
                  }}
                  className={`min-h-[42px] px-2 py-1.5 rounded-2xl border text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                    active ? 'ring-2 ring-offset-1 scale-[1.03]' : 'opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: t.cssVars['--vibe-bg'],
                    color: t.cssVars['--vibe-accent'],
                    borderColor: t.cssVars['--vibe-accent'],
                  }}
                >
                  <span>{t.emoji}</span>
                  <span className="truncate max-w-full text-[10px]">
                    {shortLabel.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* No-Flake Cashback & Refundable Pass Wallet Card */}
      <section className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-bold vibe-text-accent flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              No-Flake Cashback Wallet
            </span>
            <div className="font-mono font-extrabold text-3xl text-white mt-1 tabular-nums">
              ₹{user.walletBalance}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
              Ready to cash out · +₹{user.lockedEscrowBalance} active event pass
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWithdrawError('');
              setIsWithdrawModalOpen(true);
            }}
            className="min-h-[46px] px-5 rounded-full vibe-cta-primary font-display font-extrabold text-xs inline-flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
          >
            Cash Out to UPI
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Whenever someone flakes on a hangout you show up to on time, their pass pot is split straight into your wallet!
        </p>

        <div className="flex items-center gap-2.5 pt-2 border-t border-white/10 flex-wrap">
          <button
            type="button"
            onClick={simulateFlakeCredit}
            className="min-h-[42px] px-4 rounded-full vibe-card-subtle border text-xs font-bold vibe-text-accent inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Claim +₹45 No-Show Bonus
          </button>
          <button
            type="button"
            onClick={() => setProfileSubTab('wallet')}
            className="min-h-[42px] px-4 rounded-full vibe-card-subtle border text-xs font-semibold text-zinc-300"
          >
            Cashback History ({user.transactions.length})
          </button>
        </div>
      </section>

      {/* Consumer Pill Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Profile navigation tabs"
        className="grid grid-cols-5 gap-1.5 vibe-card backdrop-blur-xl p-1.5 rounded-full border"
      >
        <button
          type="button"
          role="tab"
          aria-selected={profileSubTab === 'track'}
          onClick={() => setProfileSubTab('track')}
          className={`min-h-[42px] rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'track'
              ? 'vibe-cta-primary'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Vibes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={profileSubTab === 'places'}
          onClick={() => setProfileSubTab('places')}
          className={`min-h-[42px] rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'places'
              ? 'vibe-cta-primary'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Spots
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={profileSubTab === 'friends'}
          onClick={() => setProfileSubTab('friends')}
          className={`min-h-[42px] rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'friends'
              ? 'vibe-cta-primary'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Squad
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={profileSubTab === 'map'}
          onClick={() => setProfileSubTab('map')}
          className={`min-h-[42px] rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'map'
              ? 'vibe-cta-primary'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Map
        </button>
        <button
          type="button"
          onClick={() => {
            showToast(
              'Catch You Soon!',
              'Signed out of Jatin Kishore. Returning to the feed.',
              'amber'
            );
            setRoute('/home');
          }}
          className="min-h-[42px] rounded-full text-xs font-bold text-rose-500 hover:bg-rose-500/10 flex items-center justify-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit
        </button>
      </div>

      {/* Sub-View: Client's Previous Meets & Status Map */}
      {profileSubTab === 'map' && <ClientHistoryMapView />}

      {/* Sub-View 1: Consumer Activity Cards */}
      {profileSubTab === 'track' && (
        <section className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-5">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h2 className="font-display font-extrabold text-lg tracking-tight text-white">
                Your Hangout Streak
              </h2>
              <p className="text-xs text-zinc-400">
                95.6% On-Time Streak · Tap any hangout to pin it on your Map
              </p>
            </div>
            <button
              type="button"
              onClick={() => setProfileSubTab('map')}
              className="min-h-[38px] px-3.5 rounded-full vibe-cta-primary text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
            >
              <Compass className="w-3.5 h-3.5" />
              My Map
            </button>
          </div>

          {/* 3 Consumer Stat Pills: Hosted 25 | Joined 105 | Flaked 6 */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-3xl vibe-card-subtle border">
              <div className="text-xs text-zinc-400">Hosted</div>
              <div className="font-mono font-extrabold text-xl text-amber-500 mt-0.5 tabular-nums">
                {user.trackRecord.created}
              </div>
            </div>
            <div className="p-4 rounded-3xl vibe-card-subtle border">
              <div className="text-xs text-zinc-400">Showed Up</div>
              <div className="font-mono font-extrabold text-xl text-emerald-500 mt-0.5 tabular-nums">
                {user.trackRecord.joined}
              </div>
            </div>
            <div className="p-4 rounded-3xl vibe-card-subtle border">
              <div className="text-xs text-zinc-400">Missed</div>
              <div className="font-mono font-extrabold text-xl text-rose-500 mt-0.5 tabular-nums">
                {user.trackRecord.missed}
              </div>
            </div>
          </div>

          {/* Smooth Vibe Curve */}
          <div className="p-4 rounded-3xl vibe-card-subtle border">
            <svg viewBox="0 0 320 75" className="w-full h-16">
              <path
                d="M 25 55 Q 95 18 160 40 T 295 22"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="25" cy="55" r="5" fill="#F59E0B" />
              <circle cx="115" cy="30" r="5" fill="#10B981" />
              <circle cx="205" cy="44" r="5" fill="#EF4444" />
              <circle cx="295" cy="22" r="6" fill="#10B981" />
              <text x="15" y="70" fill="#A1A1AA" fontSize="9" fontFamily="JetBrains Mono">
                Aug 01
              </text>
              <text x="100" y="15" fill="#10B981" fontSize="9" fontFamily="JetBrains Mono">
                105 Vibes
              </text>
              <text x="190" y="65" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono">
                6 Missed
              </text>
              <text x="260" y="12" fill="#10B981" fontSize="9" fontFamily="JetBrains Mono">
                94% Score
              </text>
            </svg>
          </div>

          {/* Warm Consumer Timeline Cards */}
          <div className="space-y-3">
            {user.trackRecord.history.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => {
                  setSelectedHistoryId(row.id);
                  setProfileSubTab('map');
                }}
                className="w-full p-4 rounded-3xl vibe-card-subtle hover:scale-[1.01] border flex items-center justify-between gap-3 text-left transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                      row.status === 'Missed'
                        ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                        : row.status === 'Hosted'
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    }`}
                  >
                    <span>{row.dateLabel.slice(0, 5)}</span>
                    <span className="text-[9px] opacity-80">{row.timeLabel}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm text-white truncate">
                      {row.meetTitle}
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-1 truncate mt-0.5">
                      <MapPin className="w-3 h-3 vibe-text-accent shrink-0" />
                      <span>{row.venueName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-display font-bold ${
                      row.status === 'Missed'
                        ? 'bg-rose-500/15 text-rose-500'
                        : row.status === 'Hosted'
                        ? 'bg-amber-500/15 text-amber-500'
                        : 'bg-emerald-500/15 text-emerald-500'
                    }`}
                  >
                    {row.status === 'Hosted'
                      ? '★ You Hosted'
                      : row.status === 'Joined'
                      ? '✓ Checked In'
                      : '✕ Missed'}
                  </span>
                  {row.escrowDelta !== 0 && (
                    <div className="font-mono text-[11px] font-bold text-zinc-400 mt-1">
                      {row.escrowDelta > 0
                        ? `+₹${row.escrowDelta} Bonus`
                        : `-₹${Math.abs(row.escrowDelta)} No-Show`}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Sub-View 2: Explored Places */}
      {profileSubTab === 'places' && (
        <section className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
            <h2 className="font-display font-extrabold text-lg tracking-tight text-white">
              Favorite Chennai Hangouts ({user.exploredPlacesCount})
            </h2>
            <button
              type="button"
              onClick={() => setProfileSubTab('map')}
              className="min-h-[38px] px-3.5 rounded-full vibe-cta-primary text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              View on Map
            </button>
          </div>
          <div className="space-y-3">
            {user.exploredPlaces.map((pl) => (
              <div
                key={pl.id}
                className="p-4 rounded-3xl vibe-card-subtle border flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-white">{pl.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {pl.area} · {pl.category} · Last hangout: {pl.lastVisited}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold vibe-text-accent">
                    {pl.visitsCount}x visited
                  </div>
                  <div className="text-[10px] text-amber-500 mt-0.5">
                    ★ {pl.safetyRating} Safe Vibe
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sub-View 3: Found Friends */}
      {profileSubTab === 'friends' && (
        <section className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4">
          <h2 className="font-display font-extrabold text-lg tracking-tight text-white pb-3 border-b border-white/10">
            Your Chennai Squad ({user.foundFriendsCount})
          </h2>
          <div className="space-y-3">
            {user.friends.map((fr) => (
              <div
                key={fr.id}
                className="p-4 rounded-3xl vibe-card-subtle border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full vibe-cta-primary flex items-center justify-center font-extrabold text-xs">
                    {fr.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      {fr.name}
                      {fr.verifiedKyc && (
                        <ShieldCheck className="w-3.5 h-3.5 vibe-text-accent" />
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Met at {fr.metAtVenue} · {fr.mutualMeets} hangouts together
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs font-extrabold vibe-text-accent">
                  {fr.reliabilityScore}% Vibe
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sub-View 4: Cashback & Pass Ledger */}
      {profileSubTab === 'wallet' && (
        <section className="rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4">
          <h2 className="font-display font-extrabold text-lg tracking-tight text-white pb-3 border-b border-white/10">
            Event Pass &amp; Cashback Activity
          </h2>
          <div className="space-y-3">
            {user.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-3xl vibe-card-subtle border flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-white">{tx.title}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{tx.subtitle}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {tx.timestamp}
                  </div>
                </div>
                <div
                  className={`font-mono text-sm font-extrabold shrink-0 ${
                    tx.amount >= 0 ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {tx.amount >= 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cash Out to UPI Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <form
            onSubmit={handleUpiSubmit}
            className="w-full max-w-sm rounded-3xl vibe-card backdrop-blur-xl border p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-white">
                Cash Out Rewards to UPI
              </h3>
              <span className="font-mono text-xs font-bold vibe-text-accent">
                Avail: ₹{user.walletBalance}
              </span>
            </div>

            <label className="block">
              <span className="text-xs text-zinc-400 block mb-1">
                Your UPI ID (GPay / PhonePe / Paytm)
              </span>
              <input
                type="text"
                value={upiInput}
                onChange={(e) => setUpiInput(e.target.value)}
                placeholder="jatinkishore@okaxis"
                className="w-full min-h-[44px] px-4 rounded-2xl bg-zinc-900 border border-white/15 text-xs text-white font-mono focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs text-zinc-400 block mb-1">
                Cash Out Amount (₹)
              </span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={1}
                max={user.walletBalance}
                className="w-full min-h-[44px] px-4 rounded-2xl bg-zinc-900 border border-white/15 text-sm text-white font-mono font-bold focus:outline-none"
              />
            </label>

            {withdrawError && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 min-h-[46px] rounded-full vibe-cta-primary font-display font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <Flame className="w-4 h-4" />
                Send Instant Cashback
              </button>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="min-h-[46px] px-4 rounded-full vibe-card-subtle border text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
