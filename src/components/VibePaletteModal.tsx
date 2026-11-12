import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Check, Sparkles, Palette, Sun, Moon } from 'lucide-react';
import { useMeet } from '../context/MeetContext';
import { VIBE_PALETTES, VibePaletteConfig } from '../data/vibePalettes';

export const VibePaletteModal: React.FC = () => {
  const {
    vibePaletteId,
    setVibePaletteId,
    activeVibePalette,
    isVibeModalOpen,
    setIsVibeModalOpen,
    showToast,
  } = useMeet();

  const lightThemes = VIBE_PALETTES.filter((p) => p.isLightMode);
  const darkThemes = VIBE_PALETTES.filter((p) => !p.isLightMode);

  const renderPaletteCard = (palette: VibePaletteConfig) => {
    const isSelected = palette.id === vibePaletteId;
    return (
      <button
        key={palette.id}
        type="button"
        onClick={() => {
          setVibePaletteId(palette.id);
          showToast(
            `${palette.emoji} ${palette.name} Theme Activated!`,
            `${palette.pairLabel} — ${palette.bestFor}`,
            'emerald'
          );
        }}
        className={`w-full text-left p-4 rounded-3xl border transition-all flex flex-col gap-2 ${
          isSelected
            ? 'ring-2 ring-offset-1 border-transparent shadow-xl'
            : 'hover:scale-[1.01] opacity-95 hover:opacity-100'
        }`}
        style={{
          backgroundColor: palette.cssVars['--vibe-bg'],
          color: palette.cssVars['--vibe-text'],
          borderColor: isSelected
            ? palette.cssVars['--vibe-accent']
            : palette.cssVars['--vibe-border'],
          boxShadow: isSelected
            ? `0 14px 34px -10px ${palette.cssVars['--vibe-glow']}`
            : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl leading-none">{palette.emoji}</span>
            <div className="min-w-0">
              <div
                className="font-display font-extrabold text-base tracking-tight flex items-center gap-2 flex-wrap"
                style={{ color: palette.cssVars['--vibe-text'] }}
              >
                <span>{palette.name}</span>
                <span
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: palette.cssVars['--vibe-accent'],
                    color: palette.cssVars['--vibe-accent-fg'],
                  }}
                >
                  {palette.pairLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Swatches + Selected Check */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center -space-x-1.5">
              {palette.swatches.map((hex, idx) => (
                <span
                  key={idx}
                  className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            {isSelected && (
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: palette.cssVars['--vibe-accent'],
                  color: palette.cssVars['--vibe-accent-fg'],
                }}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ color: palette.cssVars['--vibe-text'] }}
        >
          <strong>Vibe:</strong> {palette.vibeDescription}
        </p>

        <p
          className="text-[11px] leading-relaxed"
          style={{ color: palette.cssVars['--vibe-text-muted'] }}
        >
          <strong>Colors:</strong> {palette.colorsDescription}
        </p>
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isVibeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVibeModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-label="Choose Your Clean Solid Color Theme"
            className="relative z-10 w-full max-w-xl rounded-t-3xl sm:rounded-3xl vibe-card backdrop-blur-xl border p-6 max-h-[88vh] overflow-y-auto shadow-2xl"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-zinc-500/40 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold vibe-cta-primary mb-2">
                  <Palette className="w-3.5 h-3.5" />
                  Clean Solid Themes · Zero Gradients
                </span>
                <h2 className="font-display font-extrabold text-xl tracking-tight text-white">
                  Light &amp; Dark Color Themes
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Choose a clean, flat solid Light Theme or a Dark Negative Theme with soft light-shade accents.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsVibeModalOpen(false)}
                aria-label="Close Theme Switcher"
                className="min-h-[42px] min-w-[42px] rounded-full bg-zinc-900/80 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Vibe Spotlight Banner */}
            <div
              className="mt-4 p-4 rounded-2xl border flex items-center justify-between gap-3"
              style={{
                backgroundColor: activeVibePalette.cssVars['--vibe-card-muted'],
                borderColor: activeVibePalette.cssVars['--vibe-border'],
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{activeVibePalette.emoji}</span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-sm text-white truncate">
                    Active: {activeVibePalette.name} ({activeVibePalette.pairLabel})
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {activeVibePalette.bestFor}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold vibe-cta-primary shrink-0">
                Active
              </span>
            </div>

            {/* Light Themes Section */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider vibe-text-accent px-1">
                <Sun className="w-4 h-4" />
                <span>Light Themes (Light Blue, White, Golden Yellow, Dark Pink, Purple)</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {lightThemes.map(renderPaletteCard)}
              </div>
            </div>

            {/* Dark Negative Themes Section */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider vibe-text-accent px-1">
                <Moon className="w-4 h-4" />
                <span>Dark Themes (Dark Negative + Clean Light Shades)</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {darkThemes.map(renderPaletteCard)}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsVibeModalOpen(false)}
                className="min-h-[46px] px-6 rounded-full vibe-cta-primary font-display font-bold text-xs inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Apply {activeVibePalette.emoji} {activeVibePalette.name}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
