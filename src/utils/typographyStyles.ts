import { MeetCategory, TypographyStyleVariant } from '../types/meet';

export interface CategoryTypographySpec {
  variant: TypographyStyleVariant;
  styleName: string;
  vibeNote: string;
  fontFamily: string;
  titleClassName: string;
  badgeLabel: string;
}

export interface CategoryTypographyGroup {
  category: MeetCategory;
  categoryLabel: string;
  vibeDescription: string;
  variants: Record<TypographyStyleVariant, CategoryTypographySpec>;
}

export const CATEGORY_TYPOGRAPHY_MAP: Record<MeetCategory, CategoryTypographyGroup> = {
  Playground: {
    category: 'Playground',
    categoryLabel: 'Playground Meet (Sports, Turf, Cricket, Running)',
    vibeDescription: 'Athletic, high-impact, stadium-scoreboard energy.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Heavy Italicized Sans (Speed & Motion)',
        vibeNote: 'Speed & Motion',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        titleClassName: 'font-black italic uppercase tracking-wider text-xl sm:text-2xl',
        badgeLabel: 'Style A · Speed Italic',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Condensed Block Caps (Jersey Stencil)',
        vibeNote: 'Jersey Stencil Style',
        fontFamily: "'Bebas Neue', sans-serif",
        titleClassName: 'uppercase tracking-[0.12em] text-2xl sm:text-[26px] font-normal',
        badgeLabel: 'Style B · Jersey Stencil',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Chunky Retro Varsity Block',
        vibeNote: 'Varsity Collegiate Block',
        fontFamily: "'Bungee', cursive",
        titleClassName: 'uppercase tracking-wide text-lg sm:text-xl font-normal leading-snug',
        badgeLabel: 'Style C · Varsity Block',
      },
    },
  },
  Shopping: {
    category: 'Shopping',
    categoryLabel: 'Shopping Meet (Bundle Split, Thrift, Mall Deals)',
    vibeDescription: 'Retail flyer, high-street fashion, trendy sale tagging.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Sleek Editorial Serif (Vogue/Bazaar)',
        vibeNote: 'Vogue / Bazaar Editorial',
        fontFamily: "'Playfair Display', serif",
        titleClassName: 'italic font-bold tracking-tight text-xl sm:text-2xl',
        badgeLabel: 'Style A · Editorial Serif',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Bold Retail Price-Tag Geometric Sans',
        vibeNote: 'Retail Price-Tag Sans',
        fontFamily: "'Space Grotesk', sans-serif",
        titleClassName: 'font-bold uppercase tracking-tight text-xl sm:text-2xl',
        badgeLabel: 'Style B · Price-Tag Sans',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Playful Marker-Scrawl Discount Script',
        vibeNote: 'Marker-Scrawl Script',
        fontFamily: "'Permanent Marker', cursive",
        titleClassName: 'tracking-wide text-xl sm:text-2xl font-normal',
        badgeLabel: 'Style C · Marker Scrawl',
      },
    },
  },
  Community: {
    category: 'Community',
    categoryLabel: 'Community Meet (Local Hangouts, Public Gatherings)',
    vibeDescription: 'Warm, welcoming, grassroots neighborhood bulletin.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Rounded Friendly Bubble-Sans',
        vibeNote: 'Cozy & Approachable',
        fontFamily: "'Fredoka', sans-serif",
        titleClassName: 'font-bold tracking-normal text-xl sm:text-2xl',
        badgeLabel: 'Style A · Bubble Sans',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Clean Humanist Sans-Serif',
        vibeNote: 'Neutral & Clear',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        titleClassName: 'font-bold tracking-tight text-xl sm:text-2xl',
        badgeLabel: 'Style B · Humanist Sans',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Handwritten Community Poster Script',
        vibeNote: 'Neighborhood Poster Script',
        fontFamily: "'Caveat', cursive",
        titleClassName: 'font-bold text-2xl sm:text-3xl tracking-normal leading-tight',
        badgeLabel: 'Style C · Poster Script',
      },
    },
  },
  Food: {
    category: 'Food',
    categoryLabel: 'Food Meet (Thalis, Cafes, Street Food Crawls)',
    vibeDescription: 'Mouth-watering, menu-style, artisanal culinary feel.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Elegant Restaurant Menu Serif',
        vibeNote: 'Classy & Savory Menu',
        fontFamily: "'Cormorant Garamond', serif",
        titleClassName: 'font-bold italic text-2xl sm:text-[26px] tracking-normal leading-tight',
        badgeLabel: 'Style A · Menu Serif',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Quirky Handwritten Cafe Chalkboard',
        vibeNote: 'Cafe Chalkboard Font',
        fontFamily: "'Kalam', cursive",
        titleClassName: 'font-bold text-xl sm:text-2xl tracking-wide',
        badgeLabel: 'Style B · Cafe Chalkboard',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Soft Rounded Comfort Font',
        vibeNote: 'Artisanal Comfort Rounded',
        fontFamily: "'Fredoka', sans-serif",
        titleClassName: 'font-semibold text-xl sm:text-2xl tracking-wide',
        badgeLabel: 'Style C · Comfort Rounded',
      },
    },
  },
  Contest: {
    category: 'Contest',
    categoryLabel: 'Contest Meet (Hackathons, Coding Battles, Gaming)',
    vibeDescription: 'Cyber, algorithmic, competitive leaderboard.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Crisp Monospace Code Font',
        vibeNote: 'JetBrains Terminal Style',
        fontFamily: "'JetBrains Mono', monospace",
        titleClassName: 'font-extrabold tracking-tight text-lg sm:text-xl',
        badgeLabel: 'Style A · Terminal Mono',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Futuristic Cyberpunk Digital Display',
        vibeNote: 'Cyberpunk Digital Display',
        fontFamily: "'Orbitron', sans-serif",
        titleClassName: 'font-extrabold uppercase tracking-wider text-lg sm:text-xl',
        badgeLabel: 'Style B · Cyber Display',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Sharp Geometric Techno Sans',
        vibeNote: 'Geometric Techno Sans',
        fontFamily: "'Chakra Petch', sans-serif",
        titleClassName: 'font-bold uppercase tracking-wide text-xl sm:text-2xl',
        badgeLabel: 'Style C · Techno Sans',
      },
    },
  },
  Tour: {
    category: 'Tour',
    categoryLabel: 'Tour Meet (Marina Walks, Ooty Trips, Heritage Trails)',
    vibeDescription: 'Adventurous, exploratory, travel postcard.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Vintage Typewriter Postcard Font',
        vibeNote: 'Vintage Postcard Typewriter',
        fontFamily: "'Special Elite', cursive",
        titleClassName: 'tracking-wide text-xl sm:text-2xl font-normal',
        badgeLabel: 'Style A · Typewriter Postcard',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Bold Adventure Stamp Lettering',
        vibeNote: 'Adventure Passport Stamp',
        fontFamily: "'Staatliches', cursive",
        titleClassName: 'uppercase tracking-[0.1em] text-2xl sm:text-[26px] font-normal',
        badgeLabel: 'Style B · Adventure Stamp',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Airy Wide-Tracked Explorer Sans',
        vibeNote: 'Wide-Tracked Explorer',
        fontFamily: "'Space Grotesk', sans-serif",
        titleClassName: 'font-bold uppercase tracking-[0.15em] text-base sm:text-lg',
        badgeLabel: 'Style C · Explorer Wide',
      },
    },
  },
  Couple: {
    category: 'Couple',
    categoryLabel: 'Couple Meet (Dates, Mixers, Romantic Socials)',
    vibeDescription: 'Intimate, soft, elegant, and magnetic.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Delicate Modern Cursive Script',
        vibeNote: 'Romantic Cursive Script',
        fontFamily: "'Dancing Script', cursive",
        titleClassName: 'font-bold text-2xl sm:text-3xl tracking-normal',
        badgeLabel: 'Style A · Cursive Script',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Soft Minimalist Elegant Serif',
        vibeNote: 'Minimalist Elegant Serif',
        fontFamily: "'Playfair Display', serif",
        titleClassName: 'italic font-bold text-xl sm:text-2xl tracking-tight',
        badgeLabel: 'Style B · Elegant Serif',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Warm Rounded Romantic Display',
        vibeNote: 'Warm Romantic Display',
        fontFamily: "'Fredoka', sans-serif",
        titleClassName: 'font-semibold text-xl sm:text-2xl tracking-wide',
        badgeLabel: 'Style C · Warm Display',
      },
    },
  },
  Study: {
    category: 'Study',
    categoryLabel: 'Study Meet (Library Jams, Design Critiques, Book Clubs)',
    vibeDescription: 'Academic, focused, intellectual, editorial.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Traditional Literary Book Serif',
        vibeNote: 'Editorial & Smart Book Serif',
        fontFamily: "'Merriweather', serif",
        titleClassName: 'font-bold text-lg sm:text-xl tracking-normal leading-snug',
        badgeLabel: 'Style A · Literary Serif',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Clean Scholarly Minimalist Sans',
        vibeNote: 'Scholarly Minimalist Sans',
        fontFamily: "'DM Sans', sans-serif",
        titleClassName: 'font-bold tracking-tight text-xl sm:text-2xl',
        badgeLabel: 'Style B · Scholarly Sans',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Notebook Margin Handwritten Font',
        vibeNote: 'Notebook Margin Handwritten',
        fontFamily: "'Patrick Hand', cursive",
        titleClassName: 'text-2xl sm:text-[26px] tracking-wide font-normal leading-tight',
        badgeLabel: 'Style C · Margin Notes',
      },
    },
  },
  Party: {
    category: 'Party',
    categoryLabel: 'Party Meet (Nightlife, Clubbing, Acoustic Jam Sessions)',
    vibeDescription: 'Loud, neon, high-energy weekend festival.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Bold Bouncy Bubble-Pop Font',
        vibeNote: 'Bouncy Bubble-Pop',
        fontFamily: "'Righteous', cursive",
        titleClassName: 'tracking-wide text-xl sm:text-2xl font-normal',
        badgeLabel: 'Style A · Bubble-Pop',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Heavy Retro Disco Marquee Lettering',
        vibeNote: 'Retro Disco Marquee',
        fontFamily: "'Bungee', cursive",
        titleClassName: 'uppercase tracking-wider text-lg sm:text-xl font-normal',
        badgeLabel: 'Style B · Disco Marquee',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Glowing Neon Script Font',
        vibeNote: 'Festival Neon Script',
        fontFamily: "'Pacifico', cursive",
        titleClassName: 'tracking-wide text-xl sm:text-2xl font-normal',
        badgeLabel: 'Style C · Neon Script',
      },
    },
  },
  Tech: {
    category: 'Tech',
    categoryLabel: 'Tech & Code (Indie Hackers, AI Builders, OCI / n8n Meetups)',
    vibeDescription: 'Raw builder culture, terminal output, garage startup.',
    variants: {
      A: {
        variant: 'A',
        styleName: 'Style A · Raw Code-Editor Monospace',
        vibeNote: 'Syntax Editor Monospace',
        fontFamily: "'JetBrains Mono', monospace",
        titleClassName: 'font-extrabold tracking-tight text-lg sm:text-xl',
        badgeLabel: 'Style A · Code Mono',
      },
      B: {
        variant: 'B',
        styleName: 'Style B · Brutalist Industrial Developer Font',
        vibeNote: 'Brutalist Developer Display',
        fontFamily: "'Chakra Petch', sans-serif",
        titleClassName: 'font-bold uppercase tracking-widest text-xl sm:text-2xl',
        badgeLabel: 'Style B · Brutalist Dev',
      },
      C: {
        variant: 'C',
        styleName: 'Style C · Clean Minimalist System-UI Font',
        vibeNote: 'Garage Startup System UI',
        fontFamily: "'Space Grotesk', sans-serif",
        titleClassName: 'font-extrabold tracking-tight text-xl sm:text-2xl',
        badgeLabel: 'Style C · System UI',
      },
    },
  },
};

const VARIANT_ORDER: TypographyStyleVariant[] = ['A', 'B', 'C'];

/**
 * Deterministically picks or resolves Style A, B, or C for a meet based on its ID or explicit variant.
 */
export function resolveMeetTypography(
  category: MeetCategory,
  meetId: string,
  explicitVariant?: TypographyStyleVariant
): CategoryTypographySpec {
  const group = CATEGORY_TYPOGRAPHY_MAP[category] || CATEGORY_TYPOGRAPHY_MAP.Community;
  if (explicitVariant && group.variants[explicitVariant]) {
    return group.variants[explicitVariant];
  }
  let hash = 0;
  for (let i = 0; i < meetId.length; i++) {
    hash = (hash * 31 + meetId.charCodeAt(i)) % 997;
  }
  const pickedVariant = VARIANT_ORDER[Math.abs(hash) % 3];
  return group.variants[pickedVariant];
}

export function getNextTypographyVariant(
  current: TypographyStyleVariant
): TypographyStyleVariant {
  if (current === 'A') return 'B';
  if (current === 'B') return 'C';
  return 'A';
}
