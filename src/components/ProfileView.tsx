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
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';

export const ProfileView: React.FC = () => {
  const {
    user,
    setRoute,
    withdrawWalletToUpi,
    simulateFlakeCredit,
    showToast,
  } = useMeet();

  const [activeSubTab, setActiveSubTab] = useState<'track' | 'places' | 'friends' | 'wallet'>('track');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('250');
  const [upiInput, setUpiInput] = useState<string>(user.upiId);
  const [withdrawError, setWithdrawError] = useState<string>('');

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
    <div className="px-3.5 pb-10 space-y-4">
      {/* Top Bar */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRoute('/home')}
          className="min-h-[44px] px-3 rounded-xl bg-[#121215] border border-white/10 text-xs font-medium text-zinc-200 inline-flex items-center gap-2 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          Back to Feed
        </button>

        <button
          type="button"
          onClick={() => setRoute('/onboarding/kyc')}
          className="min-h-[44px] px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 inline-flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          DigiLocker KYC
        </button>
      </div>

      {/* Profile Header Card mapped directly from Jatin Kishore UID: 0001 doodle */}
      <section className="rounded-3xl bg-[#121215] border border-white/10 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-emerald-900/40 to-zinc-900 border border-emerald-400/50 flex items-center justify-center font-display font-extrabold text-xl text-emerald-200">
              JK
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center ring-2 ring-[#121215]">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-white">
                  {user.name}
                </h1>
              </div>
              <p className="font-mono text-xs text-zinc-400">
                UID : {user.uid} · {user.digilockerId}
              </p>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                {user.rankTitle}
              </p>
            </div>
          </div>

          {/* Reliability Score Gauge */}
          <div className="text-right bg-zinc-900/90 border border-white/10 rounded-2xl px-3 py-2 shrink-0">
            <div className="font-mono font-bold text-xl text-emerald-400">
              {user.reliabilityScore}
              <span className="text-xs text-zinc-500">/100</span>
            </div>
            <div className="text-[10px] text-zinc-400">Reliability</div>
          </div>
        </div>

        {/* Doodle Stats Row: Explored: 19 places | Found: 29 friends */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('places')}
            className={`p-3 rounded-2xl border text-left transition-colors ${
              activeSubTab === 'places'
                ? 'bg-emerald-500/15 border-emerald-500/50'
                : 'bg-zinc-900/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-xs text-zinc-400">Explored</div>
            <div className="font-display font-bold text-base text-white mt-0.5 flex items-center justify-between">
              <span>
                <span className="font-mono text-emerald-400">
                  {user.exploredPlacesCount}
                </span>{' '}
                places
              </span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('friends')}
            className={`p-3 rounded-2xl border text-left transition-colors ${
              activeSubTab === 'friends'
                ? 'bg-emerald-500/15 border-emerald-500/50'
                : 'bg-zinc-900/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-xs text-zinc-400">Found</div>
            <div className="font-display font-bold text-base text-white mt-0.5 flex items-center justify-between">
              <span>
                <span className="font-mono text-emerald-400">
                  {user.foundFriendsCount}
                </span>{' '}
                friends
              </span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
          </button>
        </div>
      </section>

      {/* Escrow & Penalty Credits Wallet Widget */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-950/50 via-[#121215] to-[#121215] border border-emerald-500/30 p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              Escrow &amp; No-Show Penalty Wallet
            </span>
            <div className="font-mono font-extrabold text-2xl text-white mt-1">
              ₹{user.walletBalance}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
              Available · +₹{user.lockedEscrowBalance} locked in active escrow
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWithdrawError('');
              setIsWithdrawModalOpen(true);
            }}
            className="min-h-[42px] px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-xs inline-flex items-center gap-1 shadow-md shadow-emerald-500/20 shrink-0"
          >
            Withdraw to UPI
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Earned automatically when flaky attendees miss a meet you attended on time.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={simulateFlakeCredit}
            className="min-h-[38px] px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-amber-300 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Simulate +₹45 Flake Credit
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('wallet')}
            className="min-h-[38px] px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-300"
          >
            View Ledger ({user.transactions.length})
          </button>
        </div>
      </section>

      {/* Doodle Navigation Checklist Tabs: Track | Places | Friends | Map | Logout */}
      <div className="grid grid-cols-5 gap-1.5 bg-[#121215] p-1.5 rounded-2xl border border-white/10">
        <button
          type="button"
          onClick={() => setActiveSubTab('track')}
          className={`min-h-[40px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
            activeSubTab === 'track'
              ? 'bg-emerald-500 text-zinc-950'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Track
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('places')}
          className={`min-h-[40px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
            activeSubTab === 'places'
              ? 'bg-emerald-500 text-zinc-950'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Places
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('friends')}
          className={`min-h-[40px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
            activeSubTab === 'friends'
              ? 'bg-emerald-500 text-zinc-950'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Friends
        </button>
        <button
          type="button"
          onClick={() => setRoute('/home/map')}
          className="min-h-[40px] rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1"
        >
          <Compass className="w-3.5 h-3.5" />
          Map
        </button>
        <button
          type="button"
          onClick={() => {
            showToast('Session Locked Safely', 'Signed out of Jatin Kishore (UID: 0001). Returning to Home.', 'amber');
            setRoute('/home');
          }}
          className="min-h-[40px] rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

      {/* Sub-View 1: Track Record Widget (Directly mapped from doodle: Created 25, Joined 105, Missed 6 + Graph + Date/Meet/Status Table) */}
      {activeSubTab === 'track' && (
        <section className="rounded-3xl bg-[#121215] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-white">
              Track Record
            </h2>
            <span className="font-mono text-xs text-emerald-400">
              95.6% Punctuality
            </span>
          </div>

          {/* 3 Metric Columns: Created 25 | Joined 105 | Missed 6 */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/10">
              <div className="text-xs text-zinc-400">Created</div>
              <div className="font-mono font-bold text-xl text-amber-300 mt-0.5">
                {user.trackRecord.created}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-emerald-500/30">
              <div className="text-xs text-zinc-400">Joined</div>
              <div className="font-mono font-bold text-xl text-emerald-400 mt-0.5">
                {user.trackRecord.joined}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-rose-500/30">
              <div className="text-xs text-zinc-400">Missed</div>
              <div className="font-mono font-bold text-xl text-rose-400 mt-0.5">
                {user.trackRecord.missed}
              </div>
            </div>
          </div>

          {/* Doodle Node-Path Trajectory Curve SVG */}
          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/10">
            <svg viewBox="0 0 320 75" className="w-full h-16">
              <path
                d="M 25 55 Q 95 18 160 40 T 295 22"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
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
                105 Joined
              </text>
              <text x="190" y="65" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono">
                6 Missed
              </text>
              <text x="265" y="12" fill="#10B981" fontSize="9" fontFamily="JetBrains Mono">
                94/100
              </text>
            </svg>
          </div>

          {/* Doodle Table: Date | Meet | Status */}
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-12 bg-zinc-900 px-3.5 py-2 text-[11px] font-semibold text-zinc-400 border-b border-white/10">
              <div className="col-span-3">Date</div>
              <div className="col-span-6">Meet</div>
              <div className="col-span-3 text-right">Status</div>
            </div>
            <div className="divide-y divide-white/10">
              {user.trackRecord.history.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-12 items-center px-3.5 py-2.5 text-xs bg-[#121215]"
                >
                  <div className="col-span-3 font-mono text-[11px] text-zinc-400">
                    <div>{row.timeLabel}</div>
                    <div>{row.dateLabel}</div>
                  </div>
                  <div className="col-span-6 pr-2">
                    <div className="font-semibold text-zinc-100 truncate">
                      {row.meetTitle}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      {row.venueName}
                    </div>
                  </div>
                  <div className="col-span-3 text-right font-mono">
                    <span
                      className={`font-semibold ${
                        row.status === 'Missed'
                          ? 'text-rose-400'
                          : row.status === 'Hosted'
                          ? 'text-amber-300'
                          : 'text-emerald-400'
                      }`}
                    >
                      {row.status}
                    </span>
                    {row.escrowDelta !== 0 && (
                      <div className="text-[10px] text-zinc-400">
                        {row.escrowDelta > 0
                          ? `+₹${row.escrowDelta}`
                          : `-₹${Math.abs(row.escrowDelta)}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sub-View 2: Explored Places */}
      {activeSubTab === 'places' && (
        <section className="rounded-3xl bg-[#121215] border border-white/10 p-5 space-y-3">
          <h2 className="font-display font-bold text-base text-white">
            Explored Chennai Venues ({user.exploredPlacesCount})
          </h2>
          <div className="space-y-2.5">
            {user.exploredPlaces.map((pl) => (
              <div
                key={pl.id}
                className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-100">{pl.name}</div>
                  <div className="text-xs text-zinc-400">
                    {pl.area} · {pl.category} · Last: {pl.lastVisited}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-emerald-400">
                    {pl.visitsCount} visits
                  </div>
                  <div className="text-[10px] text-amber-300">★ {pl.safetyRating} Safe</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sub-View 3: Found Friends */}
      {activeSubTab === 'friends' && (
        <section className="rounded-3xl bg-[#121215] border border-white/10 p-5 space-y-3">
          <h2 className="font-display font-bold text-base text-white">
            Verified Meet Friends ({user.foundFriendsCount})
          </h2>
          <div className="space-y-2.5">
            {user.friends.map((fr) => (
              <div
                key={fr.id}
                className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-300">
                    {fr.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1">
                      {fr.name}
                      {fr.verifiedKyc && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div className="text-xs text-zinc-400">
                      Met at {fr.metAtVenue} · {fr.mutualMeets} mutual meets
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-emerald-400">
                  {fr.reliabilityScore}%
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sub-View 4: Escrow & UPI Wallet Ledger */}
      {activeSubTab === 'wallet' && (
        <section className="rounded-3xl bg-[#121215] border border-white/10 p-5 space-y-3">
          <h2 className="font-display font-bold text-base text-white">
            Escrow &amp; Penalty Credit Ledger
          </h2>
          <div className="space-y-2.5">
            {user.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/10 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-100">{tx.title}</div>
                  <div className="text-[11px] text-zinc-400">{tx.subtitle}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {tx.timestamp}
                  </div>
                </div>
                <div
                  className={`font-mono text-sm font-bold shrink-0 ${
                    tx.amount >= 0 ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {tx.amount >= 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Withdraw to UPI Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleUpiSubmit}
            className="w-full max-w-sm rounded-3xl bg-[#121215] border border-white/15 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">
                Withdraw Penalty Credits to UPI
              </h3>
              <span className="font-mono text-xs text-emerald-400">
                Avail: ₹{user.walletBalance}
              </span>
            </div>

            <label className="block">
              <span className="text-xs text-zinc-400 block mb-1">
                Recipient UPI ID (GPay / PhonePe / Paytm)
              </span>
              <input
                type="text"
                value={upiInput}
                onChange={(e) => setUpiInput(e.target.value)}
                placeholder="jatinkishore@okaxis"
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-xs text-zinc-400 block mb-1">
                Amount to Withdraw (₹)
              </span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={1}
                max={user.walletBalance}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </label>

            {withdrawError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Instant UPI Transfer
              </button>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300"
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
