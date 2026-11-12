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
} from 'lucide-react';
import { useMeet } from '../context/MeetContext';

export const SidebarDrawer: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    user,
    setRoute,
    setIsFilterOpen,
    setFeedTab,
    setIsCreateModalOpen,
    setIsRandomModalOpen,
  } = useMeet();

  const drawerItems = [
    {
      id: 'profile',
      label: 'Profile',
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
      subtitle: 'Your joined & escrow-locked meets',
      icon: CalendarClock,
      onClick: () => {
        setFeedTab('upcoming');
        setRoute('/home');
        setIsSidebarOpen(false);
      },
    },
    {
      id: 'create',
      label: 'Create Meet',
      subtitle: 'Host a meet + AI Flyer & Venue Grounding',
      icon: PlusCircle,
      onClick: () => {
        setIsSidebarOpen(false);
        setIsCreateModalOpen(true);
      },
    },
    {
      id: 'random',
      label: 'Random Meet',
      subtitle: 'Roll the dice for a spontaneous match',
      icon: Dices,
      onClick: () => {
        setIsSidebarOpen(false);
        setIsRandomModalOpen(true);
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
      label: 'Active Meet & Rolling TOTP QR',
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
            className="relative z-10 w-full max-w-xs bg-[#121215] border-l border-white/10 h-full flex flex-col justify-between overflow-y-auto p-5"
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
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Doodle Menu List (Profile, Filter, Available Meets, Upcoming Meets, Create Meet, Random Meet, Sponsor Ads) */}
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
                      className="w-full min-h-[52px] px-3 py-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 truncate">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Safety & Verification Quick Access */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
                <p className="text-[11px] font-medium text-emerald-400 px-2 mb-1.5">
                  Safeguard+ &amp; Verification Flows
                </p>
                {safetyFlows.map((flow) => {
                  const Icon = flow.icon;
                  return (
                    <button
                      key={flow.id}
                      type="button"
                      onClick={flow.onClick}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl hover:bg-emerald-500/10 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-zinc-200 group-hover:text-emerald-200">
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
              <span>Escrow Wallet:</span>
              <span className="font-mono font-bold text-emerald-400">
                ₹{user.walletBalance}
              </span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
