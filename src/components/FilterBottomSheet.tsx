import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Calendar, Clock, RotateCcw, Check } from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { ALL_MEET_CATEGORIES } from '../utils/meetLogic';
import {
  AgeDemographic,
  DistanceOption,
  GenderDemographic,
  MeetCategory,
} from '../types/meet';

export const FilterBottomSheet: React.FC = () => {
  const {
    isFilterOpen,
    setIsFilterOpen,
    filters,
    setFilters,
    resetFilters,
    filteredMeets,
  } = useMeet();

  const toggleCategory = (cat: MeetCategory) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const distanceOptions: { value: DistanceOption; label: string }[] = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 20, label: '20 km' },
    { value: 25, label: '25 km +' },
  ];

  const ageOptions: AgeDemographic[] = ['All', 'Young', 'Mid', 'Senior'];
  const genderOptions: GenderDemographic[] = ['Both', 'Men Only', 'Women Only'];

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Filter Meets"
            className="relative z-10 w-full max-w-lg rounded-t-3xl bg-[#121215] border-t border-white/15 max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Drag Handle */}
            <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mt-3 mb-1 shrink-0" />

            {/* Sheet Header */}
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-display font-bold text-lg text-white">Filter</h2>
                <p className="text-xs text-zinc-400">
                  Refine Chennai hyper-local meets ({filteredMeets.length} matching)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-[40px] px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-300 inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close Filter Sheet"
                  className="min-h-[40px] min-w-[40px] rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Sections mapped from App Design.pdf */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* 1. Date (after/before) & Time */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Date (after / before) &amp; Time
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(['any', 'after', 'before'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, dateMode: mode }))}
                      className={`min-h-[40px] rounded-xl text-xs font-medium capitalize border transition-colors ${
                        filters.dateMode === mode
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {mode === 'any' ? 'Any Date' : `${mode} Date`}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[11px] text-zinc-400 block mb-1">Select Date</span>
                    <input
                      type="date"
                      value={filters.dateValue}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateMode: prev.dateMode === 'any' ? 'after' : prev.dateMode,
                          dateValue: e.target.value,
                        }))
                      }
                      className="w-full min-h-[42px] px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Time
                    </span>
                    <input
                      type="time"
                      value={filters.timeValue}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateMode: prev.dateMode === 'any' ? 'after' : prev.dateMode,
                          timeValue: e.target.value,
                        }))
                      }
                      className="w-full min-h-[42px] px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>
              </div>

              {/* 2. Distance (5 km, 10 km, 20 km, 25 km+) */}
              <div>
                <span className="text-xs font-semibold text-zinc-200 block mb-2.5">
                  ▾ Distance
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {distanceOptions.map((opt) => {
                    const active = filters.distanceKm === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, distanceKm: opt.value }))
                        }
                        className={`min-h-[44px] rounded-xl font-mono text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${
                          active
                            ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-white/25'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Type (Multi-select from doodle: Playground, Shopping, Community, Food, Contest, Tour, Couple, Study, Party) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-zinc-200">
                    ▾ Type (Multi-select)
                  </span>
                  {filters.categories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, categories: [] }))}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Clear types
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_MEET_CATEGORIES.map((cat) => {
                    const selected = filters.categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                          selected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                            : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                            selected
                              ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
                              : 'border-zinc-600'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Price (free / paid) */}
              <div>
                <span className="text-xs font-semibold text-zinc-200 block mb-2.5">
                  ▾ Price
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'all', label: 'All Meets' },
                      { id: 'free', label: '₹ Free' },
                      { id: 'paid', label: '₹ Paid (Escrow)' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, priceMode: item.id }))
                      }
                      className={`min-h-[44px] px-3 rounded-xl text-xs font-semibold border transition-all ${
                        filters.priceMode === item.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Age (Young / Mid / Senior) & Gender (Both / Men Only / Women Only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block mb-2">
                    ▾ Age
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {ageOptions.map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, ageGroup: age }))
                        }
                        className={`min-h-[40px] px-2.5 rounded-xl text-xs font-medium border transition-colors ${
                          filters.ageGroup === age
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-zinc-900 border-white/10 text-zinc-400'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-zinc-200 block mb-2">
                    ▾ Gender
                  </span>
                  <div className="space-y-1.5">
                    {genderOptions.map((gen) => (
                      <button
                        key={gen}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, genderGroup: gen }))
                        }
                        className={`w-full min-h-[38px] px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-colors ${
                          filters.genderGroup === gen
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-zinc-900 border-white/10 text-zinc-400'
                        }`}
                      >
                        <span>{gen}</span>
                        {filters.genderGroup === gen && (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom CTA */}
            <div className="p-4 border-t border-white/10 bg-[#09090B]/95 shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-sm transition-transform active:scale-[0.98]"
              >
                Show {filteredMeets.length} Matching Chennai Meets
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
