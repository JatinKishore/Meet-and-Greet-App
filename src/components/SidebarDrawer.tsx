import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  User,
  SlidersHorizontal,
  CalendarCheck,
  CalendarClock,
  PlusCircle,
  Dices,
  Megaphone,
  ShieldCheck,
  Camera,
  QrCode,
  ChevronRight,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { VIBE_PALETTES } from '../data/vibePalettes';

export const SidebarDrawer: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    user,
    setRoute,
    setIsFilterOpen,
    setFeedTab,
    setIsCreateModalOpen,
    setIsRandomPresetsModalOpen,
    randomPresets,
    vibePaletteId,
    setVibePaletteId,
    activeVibePalette,
    setIsVibeModalOpen,
    showToast,
  } = useMeet();

  const lightThemes = VIBE_PALETTES.filter((p) => p.isLightMode);
  const darkThemes = VIBE_PALETTES.filter((p) => !p.isLightMode);

  const drawerItems = [
    {
      id: 'profile',
      label: 'Profile & Settings',
      subtitle: `${user.name} · UID: ${user.uid}`,
      icon: User,
      onClick: () => {
        setIsSidebarOpen(false);
        setRoute('/profile');
      },
    },
    {
      id: 'filter',
      label: 'Filter',
      subtitle: 'Distance, Date/Time, Type & Price',
      icon: SlidersHorizontal,
      onClick: () => {
        setIsSidebarOpen(false);
        setIsFilterOpen(true);
      },
    },
    {
      id: 'available',
      label: 'Available Meets',
      subtitle: 'All live hyper-local Chennai meets',
      icon: CalendarCheck,
      onClick: () => {
        setFeedTab('available');
        setRoute('/home');
        setIsSidebarOpen(false);
      },
    },
    {
      id: 'upcoming',
      label: 'Upcoming Meets',
      subtitle: 'Your booked & active event passes',
      icon: CalendarClock,
      onClick: () => {
        setFeedTab('upcoming');
        setRoute('/home');
        setIsSidebarOpen(false);
      },
    },
    {
      id: 'create',
      label: 'Create Meet (H+st)',
      subtitle: 'Host a meet + Date/Time & Typography',
      icon: PlusCircle,
      onClick: () => {
        setIsSidebarOpen(false);
        setIsCreateModalOpen(true);
      },
    },
    {
      id: 'random-presets',
      label: 'Random Meet Presets',
      subtitle: `${randomPresets.length} active presets · Add endless presets`,
      icon: Dices,
      onClick: () => {
        setIsSidebarOpen(false);
        setIsRandomPresetsModalOpen(true);
      },
    },
    {
      id: 'sponsors',
      label: 'Sponsor Ads',
      subtitle: 'Group bundle offers (Peter England, Padi)',
      icon: Megaphone,
      onClick: () => {
        setFeedTab('sponsored');
        setRoute('/home');
        setIsSidebarOpen(false);
      },
    },
  ];

  const safetyFlows = [
    {
      id: 'kyc',
      label: 'DigiLocker KYC & Parental Gate',
      icon: ShieldCheck,
      onClick: () => {
        setIsSidebarOpen(false);
        setRoute('/onboarding/kyc');
      },
    },
    {
      id: 'active-qr',
      label: 'Active Meet & Rolling TOTP Pass',
      icon: QrCode,
      onClick: () => {
        setIsSidebarOpen(false);
        setRoute('/meet/active');
      },
    },
    {
      id: 'pose',
      label: 'Late-Night Fun Pose Check',
      icon: Camera,
      onClick: () => {
        setIsSidebarOpen(false);
        setRoute('/meet/verify-pose');
      },
    },
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            aria-label="Meet & Greet Sidebar Menu"
            className="relative z-10 w-full max-w-xs vibe-card border-l h-full flex flex-col justify-between overflow-y-auto p-5 shadow-2xl"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="font-display font-bold text-base text-white">
                    Meet &amp; Greet
                  </span>
                  <p className="text-xs text-zinc-400">
                    Chennai Hyper-Local Directory
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close Sidebar Menu"
                  className="min-h-[44px] min-w-[44px] rounded-xl vibe-card-subtle border flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Color Theme Switcher (Light & Dark Solid Themes inside Menu) */}
              <div className="mt-4 p-3.5 rounded-2xl vibe-card-subtle border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-4 h-4 vibe-text-accent" />
                    <span className="text-xs font-extrabold text-white">
                      Color Theme
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsVibeModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-full vibe-cta-primary text-[10px] font-bold"
                  >
                    All {VIBE_PALETTES.length} Themes
                  </button>
                </div>

                {/* Light Themes Row */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                    <Sun className="w-3 h-3" />
                    <span>Light Theme (Solid)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {lightThemes.map((t) => {
                      const active = t.id === vibePaletteId;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setVibePaletteId(t.id);
                            showToast(
                              `${t.emoji} ${t.name} Theme`,
                              t.pairLabel,
                              'emerald'
                            );
                          }}
                          title={t.name}
                          className={`min-h-[34px] rounded-xl border flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold transition-transform ${
                            active
                              ? 'ring-2 ring-offset-1 scale-105'
                              : 'opacity-85 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: t.cssVars['--vibe-accent'],
                            color: t.cssVars['--vibe-accent-fg'],
                            borderColor: t.cssVars['--vibe-border'],
                          }}
                        >
                          <span>{t.emoji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dark Negative Themes Row */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                    <Moon className="w-3 h-3" />
                    <span>Dark Theme (Negative + Light Shade)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {darkThemes.map((t) => {
                      const active = t.id === vibePaletteId;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setVibePaletteId(t.id);
                            showToast(
                              `${t.emoji} ${t.name} Theme`,
                              t.pairLabel,
                              'emerald'
                            );
                          }}
                          title={t.name}
                          className={`min-h-[34px] rounded-xl border flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold transition-transform ${
                            active
                              ? 'ring-2 ring-offset-1 scale-105'
                              : 'opacity-85 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: t.cssVars['--vibe-bg'],
                            color: t.cssVars['--vibe-accent'],
                            borderColor: t.cssVars['--vibe-accent'],
                          }}
                        >
                          <span>{t.emoji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 truncate">
                  Active: <strong className="text-white">{activeVibePalette.name}</strong>
                </div>
              </div>

              {/* Doodle Menu List */}
              <div className="mt-4 space-y-1">
                <p className="text-[11px] font-medium text-zinc-400 px-2 mb-1.5">
                  Navigation Menu
                </p>
                {drawerItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className="w-full min-h-[50px] px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl vibe-card-subtle border flex items-center justify-center vibe-text-accent shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-100 truncate">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Safety & Verification Quick Access */}
              <div className="mt-5 pt-4 border-t border-white/10 space-y-1">
                <p className="text-[11px] font-medium vibe-text-accent px-2 mb-1.5">
                  Safeguard+ &amp; Verification Flows
                </p>
                {safetyFlows.map((flow) => {
                  const Icon = flow.icon;
                  return (
                    <button
                      key={flow.id}
                      type="button"
                      onClick={flow.onClick}
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 vibe-text-accent" />
                        <span className="text-xs font-medium text-zinc-200">
                          {flow.label}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer User Summary */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>No-Flake Cashback Wallet:</span>
              <span className="font-mono font-bold vibe-text-accent">
                ₹{user.walletBalance}
              </span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
