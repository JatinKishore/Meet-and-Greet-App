import { VibePaletteId } from '../types/meet';

export interface VibePaletteConfig {
  id: VibePaletteId;
  emoji: string;
  name: string;
  pairLabel: string;
  modeCategory: 'Light Theme' | 'Dark Theme';
  vibeDescription: string;
  colorsDescription: string;
  bestFor: string;
  isLightMode: boolean;
  swatches: [string, string, string];
  cssVars: {
    '--vibe-bg': string;
    '--vibe-bg-elevated': string;
    '--vibe-card': string;
    '--vibe-card-muted': string;
    '--vibe-text': string;
    '--vibe-text-muted': string;
    '--vibe-accent': string;
    '--vibe-accent-secondary': string;
    '--vibe-accent-fg': string;
    '--vibe-border': string;
    '--vibe-glow': string;
  };
}

export const VIBE_PALETTES: VibePaletteConfig[] = [
  /* ------------------------------------------------------------------------ */
  /* LIGHT THEMES (Clean Flat Solid Colors: Light Blue, White, Golden Yellow, */
  /*               Dark Pink, Purple)                                         */
  /* ------------------------------------------------------------------------ */
  {
    id: 'light-blue',
    emoji: '💧',
    name: 'Light Blue',
    pairLabel: 'Light Theme · Clean Sky Blue',
    modeCategory: 'Light Theme',
    vibeDescription:
      'Crisp, breezy, and trustworthy light mode with clean flat sky-blue primary actions and pure white cards.',
    colorsDescription:
      'Soft light-blue canvas (#F0F9FF) with solid azure blue (#0284C7) buttons—zero gradients.',
    bestFor: 'Daytime Hangouts, Beach Walks & Tech Mixers',
    isLightMode: true,
    swatches: ['#F0F9FF', '#0284C7', '#FFFFFF'],
    cssVars: {
      '--vibe-bg': '#F0F9FF',
      '--vibe-bg-elevated': '#E0F2FE',
      '--vibe-card': '#FFFFFF',
      '--vibe-card-muted': '#F1F5F9',
      '--vibe-text': '#0F172A',
      '--vibe-text-muted': '#475569',
      '--vibe-accent': '#0284C7',
      '--vibe-accent-secondary': '#0369A1',
      '--vibe-accent-fg': '#FFFFFF',
      '--vibe-border': 'rgba(2, 132, 199, 0.22)',
      '--vibe-glow': 'rgba(2, 132, 199, 0.14)',
    },
  },
  {
    id: 'clean-white',
    emoji: '⚪',
    name: 'Pure White',
    pairLabel: 'Light Theme · Minimal White',
    modeCategory: 'Light Theme',
    vibeDescription:
      'Ultra-clean, distraction-free pure white surface with solid high-contrast ink buttons and crisp borders.',
    colorsDescription:
      'Alabaster white canvas (#F8FAFC), pure white cards (#FFFFFF), and solid slate-ink (#0F172A) accents.',
    bestFor: 'Study Jams, Book Clubs & Community Boards',
    isLightMode: true,
    swatches: ['#FFFFFF', '#0F172A', '#E2E8F0'],
    cssVars: {
      '--vibe-bg': '#F8FAFC',
      '--vibe-bg-elevated': '#F1F5F9',
      '--vibe-card': '#FFFFFF',
      '--vibe-card-muted': '#F1F5F9',
      '--vibe-text': '#09090B',
      '--vibe-text-muted': '#52525B',
      '--vibe-accent': '#0F172A',
      '--vibe-accent-secondary': '#334155',
      '--vibe-accent-fg': '#FFFFFF',
      '--vibe-border': 'rgba(15, 23, 42, 0.16)',
      '--vibe-glow': 'rgba(15, 23, 42, 0.08)',
    },
  },
  {
    id: 'golden-yellow',
    emoji: '☀️',
    name: 'Golden Yellow',
    pairLabel: 'Light Theme · Solid Gold',
    modeCategory: 'Light Theme',
    vibeDescription:
      'Warm, high-energy daytime utility mode inspired by Rapido & sunny weekend sports meets.',
    colorsDescription:
      'Warm ivory canvas (#FFFBEB) with pure white cards and flat solid golden yellow (#EAB308) buttons.',
    bestFor: 'Turf Cricket, Rapido Rides & Morning Runs',
    isLightMode: true,
    swatches: ['#FFFBEB', '#EAB308', '#FFFFFF'],
    cssVars: {
      '--vibe-bg': '#FFFBEB',
      '--vibe-bg-elevated': '#FEF3C7',
      '--vibe-card': '#FFFFFF',
      '--vibe-card-muted': '#FEF9C3',
      '--vibe-text': '#1C1917',
      '--vibe-text-muted': '#57534E',
      '--vibe-accent': '#EAB308',
      '--vibe-accent-secondary': '#CA8A04',
      '--vibe-accent-fg': '#09090B',
      '--vibe-border': 'rgba(202, 138, 4, 0.25)',
      '--vibe-glow': 'rgba(234, 179, 8, 0.16)',
    },
  },
  {
    id: 'dark-pink',
    emoji: '🌺',
    name: 'Dark Pink',
    pairLabel: 'Light Theme · Solid Berry Pink',
    modeCategory: 'Light Theme',
    vibeDescription:
      'Bold, social, and expressive light mode with clean flat dark-pink accents and crisp white cards.',
    colorsDescription:
      'Soft rose-tinted white (#FFF1F2) paired with solid dark pink (#BE185D) pill buttons—no gradients.',
    bestFor: 'Social Mixers, Food Crawls & Shopping Pools',
    isLightMode: true,
    swatches: ['#FFF1F2', '#BE185D', '#FFFFFF'],
    cssVars: {
      '--vibe-bg': '#FFF1F2',
      '--vibe-bg-elevated': '#FFE4E6',
      '--vibe-card': '#FFFFFF',
      '--vibe-card-muted': '#FCE7F3',
      '--vibe-text': '#1F0913',
      '--vibe-text-muted': '#701A46',
      '--vibe-accent': '#BE185D',
      '--vibe-accent-secondary': '#9D174D',
      '--vibe-accent-fg': '#FFFFFF',
      '--vibe-border': 'rgba(190, 24, 93, 0.22)',
      '--vibe-glow': 'rgba(190, 24, 93, 0.14)',
    },
  },
  {
    id: 'purple',
    emoji: '🔮',
    name: 'Royal Purple',
    pairLabel: 'Light Theme · Solid Purple',
    modeCategory: 'Light Theme',
    vibeDescription:
      'Creative, modern consumer light mode with flat solid royal purple buttons on clean white cards.',
    colorsDescription:
      'Soft lavender-white canvas (#FAF5FF) with solid purple (#7E22CE) primary actions.',
    bestFor: 'Indie Hackers, Creative Jams & Coffee Meets',
    isLightMode: true,
    swatches: ['#FAF5FF', '#7E22CE', '#FFFFFF'],
    cssVars: {
      '--vibe-bg': '#FAF5FF',
      '--vibe-bg-elevated': '#F3E8FF',
      '--vibe-card': '#FFFFFF',
      '--vibe-card-muted': '#F3E8FF',
      '--vibe-text': '#1E0B36',
      '--vibe-text-muted': '#581C87',
      '--vibe-accent': '#7E22CE',
      '--vibe-accent-secondary': '#6B21A8',
      '--vibe-accent-fg': '#FFFFFF',
      '--vibe-border': 'rgba(126, 34, 206, 0.22)',
      '--vibe-glow': 'rgba(126, 34, 206, 0.14)',
    },
  },

  /* ------------------------------------------------------------------------ */
  /* DARK THEMES (Dark Negative Surfaces with Clean Light-Shade Solid Colors) */
  /* ------------------------------------------------------------------------ */
  {
    id: 'dark-blue',
    emoji: '🌌',
    name: 'Dark Negative · Sky Blue',
    pairLabel: 'Dark Theme · Light Blue Shade',
    modeCategory: 'Dark Theme',
    vibeDescription:
      'Deep negative slate canvas paired with a clean, flat light-blue shade for effortless night readability.',
    colorsDescription:
      'Dark negative slate (#0B0F17), charcoal cards (#131B26), and flat light sky-blue (#38BDF8) buttons.',
    bestFor: 'Evening Networking, Tidel Meets & Night Rides',
    isLightMode: false,
    swatches: ['#0B0F17', '#38BDF8', '#131B26'],
    cssVars: {
      '--vibe-bg': '#0B0F17',
      '--vibe-bg-elevated': '#111827',
      '--vibe-card': '#131B26',
      '--vibe-card-muted': '#1E293B',
      '--vibe-text': '#F8FAFC',
      '--vibe-text-muted': '#94A3B8',
      '--vibe-accent': '#38BDF8',
      '--vibe-accent-secondary': '#0284C7',
      '--vibe-accent-fg': '#09090B',
      '--vibe-border': 'rgba(56, 189, 248, 0.24)',
      '--vibe-glow': 'rgba(56, 189, 248, 0.14)',
    },
  },
  {
    id: 'dark-gold',
    emoji: '⚡',
    name: 'Dark Negative · Golden',
    pairLabel: 'Dark Theme · Light Gold Shade',
    modeCategory: 'Dark Theme',
    vibeDescription:
      'Dark negative carbon surface paired with flat light golden-yellow buttons—zero gradients.',
    colorsDescription:
      'Deep carbon (#0B0C0E), dark slate cards (#14161B), and solid light gold (#FACC15) accents.',
    bestFor: 'Late-Night Rapido Coordination & Turf Matches',
    isLightMode: false,
    swatches: ['#0B0C0E', '#FACC15', '#14161B'],
    cssVars: {
      '--vibe-bg': '#0B0C0E',
      '--vibe-bg-elevated': '#121418',
      '--vibe-card': '#14161B',
      '--vibe-card-muted': '#1E2128',
      '--vibe-text': '#FAFAFA',
      '--vibe-text-muted': '#A1A1AA',
      '--vibe-accent': '#FACC15',
      '--vibe-accent-secondary': '#EAB308',
      '--vibe-accent-fg': '#09090B',
      '--vibe-border': 'rgba(250, 204, 21, 0.24)',
      '--vibe-glow': 'rgba(250, 204, 21, 0.14)',
    },
  },
  {
    id: 'dark-pink-neg',
    emoji: '🌸',
    name: 'Dark Negative · Rose Pink',
    pairLabel: 'Dark Theme · Light Pink Shade',
    modeCategory: 'Dark Theme',
    vibeDescription:
      'Dark negative obsidian-plum surface paired with clean flat pastel rose-pink buttons.',
    colorsDescription:
      'Dark negative base (#110B10), elevated cards (#1B1219), and solid light rose-pink (#F472B6) accents.',
    bestFor: 'Nightlife Mixers, Acoustic Jams & Parties',
    isLightMode: false,
    swatches: ['#110B10', '#F472B6', '#1B1219'],
    cssVars: {
      '--vibe-bg': '#110B10',
      '--vibe-bg-elevated': '#181016',
      '--vibe-card': '#1B1219',
      '--vibe-card-muted': '#271A24',
      '--vibe-text': '#FDF2F8',
      '--vibe-text-muted': '#F9A8D4',
      '--vibe-accent': '#F472B6',
      '--vibe-accent-secondary': '#EC4899',
      '--vibe-accent-fg': '#110B10',
      '--vibe-border': 'rgba(244, 114, 182, 0.24)',
      '--vibe-glow': 'rgba(244, 114, 182, 0.14)',
    },
  },
  {
    id: 'dark-purple',
    emoji: '🪐',
    name: 'Dark Negative · Lavender',
    pairLabel: 'Dark Theme · Light Purple Shade',
    modeCategory: 'Dark Theme',
    vibeDescription:
      'Dark negative midnight violet surface paired with a clean light-lavender purple solid accent.',
    colorsDescription:
      'Dark negative violet (#0D0A14), deep cards (#161122), and flat light purple (#C084FC) buttons.',
    bestFor: 'Hackathons, codeClubs Jams & Gaming Contests',
    isLightMode: false,
    swatches: ['#0D0A14', '#C084FC', '#161122'],
    cssVars: {
      '--vibe-bg': '#0D0A14',
      '--vibe-bg-elevated': '#130F1E',
      '--vibe-card': '#161122',
      '--vibe-card-muted': '#221A34',
      '--vibe-text': '#FAF5FF',
      '--vibe-text-muted': '#D8B4FE',
      '--vibe-accent': '#C084FC',
      '--vibe-accent-secondary': '#A855F7',
      '--vibe-accent-fg': '#0D0A14',
      '--vibe-border': 'rgba(192, 132, 252, 0.25)',
      '--vibe-glow': 'rgba(192, 132, 252, 0.14)',
    },
  },
  {
    id: 'dark-emerald',
    emoji: '🌲',
    name: 'Dark Negative · Mint',
    pairLabel: 'Dark Theme · Light Mint Shade',
    modeCategory: 'Dark Theme',
    vibeDescription:
      'Dark negative forest-carbon canvas with flat solid mint-emerald buttons and safety badges.',
    colorsDescription:
      'Dark negative base (#090D0B), elevated cards (#111815), and flat solid mint (#34D399) primary.',
    bestFor: 'Safeguard+ Night Walks & Outdoor Trails',
    isLightMode: false,
    swatches: ['#090D0B', '#34D399', '#111815'],
    cssVars: {
      '--vibe-bg': '#090D0B',
      '--vibe-bg-elevated': '#0E1512',
      '--vibe-card': '#111815',
      '--vibe-card-muted': '#192420',
      '--vibe-text': '#ECFDF5',
      '--vibe-text-muted': '#6EE7B7',
      '--vibe-accent': '#34D399',
      '--vibe-accent-secondary': '#10B981',
      '--vibe-accent-fg': '#06120C',
      '--vibe-border': 'rgba(52, 211, 153, 0.24)',
      '--vibe-glow': 'rgba(52, 211, 153, 0.14)',
    },
  },
];

export function getVibePaletteById(id: VibePaletteId): VibePaletteConfig {
  return VIBE_PALETTES.find((p) => p.id === id) || VIBE_PALETTES[0];
}
