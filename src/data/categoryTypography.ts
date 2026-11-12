import React from 'react';
import { MeetCategory } from '../types/meet';

export type TypographyVariantKey = 'A' | 'B' | 'C';

export interface TypographyStyleSpec {
  variant: TypographyVariantKey;
  label: string;
  shortDesc: string;
  fontFamily: string;
  titleStyle: React.CSSProperties;
  badgeText: string;
}

export interface CategoryTypographyGroup {
  category: MeetCategory;
  groupTitle: string;
  vibe: string;
  styles: Record<TypographyVariantKey, TypographyStyleSpec>;
}

export const CATEGORY_TYPOGRAPHY: Record<MeetCategory, CategoryTypographyGroup> = {
  Playground: {
    category: 'Playground',
    groupTitle: 'Playground Meet (Sports, Turf, Cricket, Running)',
    vibe: 'Athletic, high-impact, stadium-scoreboard energy.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Speed & Motion',
        shortDesc: 'Heavy italicized sans-serif (Speed & Motion)',
        fontFamily: "'Archivo Black', sans-serif",
        titleStyle: {
          fontFamily: "'Archivo Black', sans-serif",
          fontStyle: 'italic',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          lineHeight: 1.12,
        },
        badgeText: 'STYLE A · SPEED ITALIC',
      },
      B: {
        variant: 'B',
        label: 'Style B · Jersey Stencil',
        shortDesc: 'Condensed geometric block caps (Jersey Stencil style)',
        fontFamily: "'Bebas Neue', sans-serif",
        titleStyle: {
          fontFamily: "'Bebas Neue', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '1.5rem',
          lineHeight: 1.05,
        },
        badgeText: 'STYLE B · JERSEY STENCIL',
      },
      C: {
        variant: 'C',
        label: 'Style C · Retro Varsity',
        shortDesc: 'Chunky retro varsity collegiate block',
        fontFamily: "'Alfa Slab One', serif",
        titleStyle: {
          fontFamily: "'Alfa Slab One', serif",
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE C · VARSITY BLOCK',
      },
    },
  },
  Shopping: {
    category: 'Shopping',
    groupTitle: 'Shopping Meet (Bundle Split, Thrift, Mall Deals)',
    vibe: 'Retail flyer, high-street fashion, trendy sale tagging.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Vogue Editorial',
        shortDesc: 'Sleek modern editorial serif (Vogue/Bazaar style)',
        fontFamily: "'Playfair Display', serif",
        titleStyle: {
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontWeight: 800,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE A · EDITORIAL SERIF',
      },
      B: {
        variant: 'B',
        label: 'Style B · Retail Price-Tag',
        shortDesc: 'Bold retail price-tag geometric sans',
        fontFamily: "'Space Grotesk', sans-serif",
        titleStyle: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '-0.03em',
          lineHeight: 1.12,
        },
        badgeText: 'STYLE B · PRICE-TAG SANS',
      },
      C: {
        variant: 'C',
        label: 'Style C · Marker Scrawl',
        shortDesc: 'Playful marker-scrawl discount script',
        fontFamily: "'Permanent Marker', cursive",
        titleStyle: {
          fontFamily: "'Permanent Marker', cursive",
          letterSpacing: '0.02em',
          lineHeight: 1.18,
        },
        badgeText: 'STYLE C · MARKER SCRAWL',
      },
    },
  },
  Community: {
    category: 'Community',
    groupTitle: 'Community Meet (Local Hangouts, Public Gatherings)',
    vibe: 'Warm, welcoming, grassroots neighborhood bulletin.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Cozy Bubble-Sans',
        shortDesc: 'Rounded friendly bubble-sans (Cozy & Approachable)',
        fontFamily: "'Fredoka', sans-serif",
        titleStyle: {
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.01em',
          lineHeight: 1.18,
        },
        badgeText: 'STYLE A · COZY BUBBLE',
      },
      B: {
        variant: 'B',
        label: 'Style B · Humanist Sans',
        shortDesc: 'Clean humanist sans-serif (Neutral & Clear)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        titleStyle: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.18,
        },
        badgeText: 'STYLE B · HUMANIST SANS',
      },
      C: {
        variant: 'C',
        label: 'Style C · Community Poster',
        shortDesc: 'Handwritten community poster script',
        fontFamily: "'Caveat', cursive",
        titleStyle: {
          fontFamily: "'Caveat', cursive",
          fontWeight: 700,
          fontSize: '1.55rem',
          lineHeight: 1.08,
        },
        badgeText: 'STYLE C · POSTER SCRIPT',
      },
    },
  },
  Food: {
    category: 'Food',
    groupTitle: 'Food Meet (Thalis, Cafes, Street Food Crawls)',
    vibe: 'Mouth-watering, menu-style, artisanal culinary feel.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Bistro Menu Serif',
        shortDesc: 'Elegant restaurant menu serif (Classy & Savory)',
        fontFamily: "'Cormorant Garamond', serif",
        titleStyle: {
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 700,
          fontStyle: 'italic',
          fontSize: '1.5rem',
          lineHeight: 1.1,
        },
        badgeText: 'STYLE A · MENU SERIF',
      },
      B: {
        variant: 'B',
        label: 'Style B · Cafe Chalkboard',
        shortDesc: 'Quirky handwritten cafe chalkboard font',
        fontFamily: "'Caveat', cursive",
        titleStyle: {
          fontFamily: "'Caveat', cursive",
          fontWeight: 700,
          fontSize: '1.55rem',
          letterSpacing: '0.01em',
          lineHeight: 1.08,
        },
        badgeText: 'STYLE B · CHALKBOARD',
      },
      C: {
        variant: 'C',
        label: 'Style C · Artisanal Comfort',
        shortDesc: 'Soft rounded comfort font',
        fontFamily: "'Fraunces', serif",
        titleStyle: {
          fontFamily: "'Fraunces', serif",
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.16,
        },
        badgeText: 'STYLE C · COMFORT ROUND',
      },
    },
  },
  Contest: {
    category: 'Contest',
    groupTitle: 'Contest Meet (Hackathons, Coding Battles, Gaming)',
    vibe: 'Cyber, algorithmic, competitive leaderboard.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Terminal Code',
        shortDesc: 'Crisp monospace code font (JetBrains / Terminal style)',
        fontFamily: "'JetBrains Mono', monospace",
        titleStyle: {
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE A · TERMINAL MONO',
      },
      B: {
        variant: 'B',
        label: 'Style B · Cyber Display',
        shortDesc: 'Futuristic cyberpunk digital display',
        fontFamily: "'Orbitron', sans-serif",
        titleStyle: {
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE B · CYBER DISPLAY',
      },
      C: {
        variant: 'C',
        label: 'Style C · Techno Geometric',
        shortDesc: 'Sharp geometric techno sans',
        fontFamily: "'Chakra Petch', sans-serif",
        titleStyle: {
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE C · TECHNO SANS',
      },
    },
  },
  Tour: {
    category: 'Tour',
    groupTitle: 'Tour Meet (Marina Walks, Ooty Trips, Heritage Trails)',
    vibe: 'Adventurous, exploratory, travel postcard.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Postcard Typewriter',
        shortDesc: 'Vintage typewriter postcard font',
        fontFamily: "'Special Elite', monospace",
        titleStyle: {
          fontFamily: "'Special Elite', monospace",
          letterSpacing: '0.02em',
          lineHeight: 1.2,
        },
        badgeText: 'STYLE A · POSTCARD TYPE',
      },
      B: {
        variant: 'B',
        label: 'Style B · Adventure Stamp',
        shortDesc: 'Bold adventure stamp lettering',
        fontFamily: "'Bebas Neue', sans-serif",
        titleStyle: {
          fontFamily: "'Bebas Neue', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '1.5rem',
          lineHeight: 1.06,
        },
        badgeText: 'STYLE B · STAMP CAPS',
      },
      C: {
        variant: 'C',
        label: 'Style C · Wide Explorer',
        shortDesc: 'Airy, wide-tracked explorer sans',
        fontFamily: "'Syne', sans-serif",
        titleStyle: {
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          letterSpacing: '0.04em',
          lineHeight: 1.14,
        },
        badgeText: 'STYLE C · EXPLORER SANS',
      },
    },
  },
  Couple: {
    category: 'Couple',
    groupTitle: 'Couple Meet (Dates, Mixers, Romantic Socials)',
    vibe: 'Intimate, soft, elegant, and magnetic.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Cursive Script',
        shortDesc: 'Delicate modern cursive script',
        fontFamily: "'Dancing Script', cursive",
        titleStyle: {
          fontFamily: "'Dancing Script', cursive",
          fontWeight: 700,
          fontSize: '1.55rem',
          lineHeight: 1.1,
        },
        badgeText: 'STYLE A · CURSIVE SCRIPT',
      },
      B: {
        variant: 'B',
        label: 'Style B · Minimalist Serif',
        shortDesc: 'Soft minimalist elegant serif',
        fontFamily: "'Cormorant Garamond', serif",
        titleStyle: {
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: '1.5rem',
          lineHeight: 1.1,
        },
        badgeText: 'STYLE B · ELEGANT SERIF',
      },
      C: {
        variant: 'C',
        label: 'Style C · Romantic Display',
        shortDesc: 'Warm rounded romantic display font',
        fontFamily: "'Fraunces', serif",
        titleStyle: {
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 600,
          lineHeight: 1.15,
        },
        badgeText: 'STYLE C · ROMANTIC DISPLAY',
      },
    },
  },
  Study: {
    category: 'Study',
    groupTitle: 'Study Meet (Library Jams, Design Critiques, Book Clubs)',
    vibe: 'Academic, focused, intellectual, editorial.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Literary Book Serif',
        shortDesc: 'Traditional literary book serif (Editorial & Smart)',
        fontFamily: "'Libre Baskerville', serif",
        titleStyle: {
          fontFamily: "'Libre Baskerville', serif",
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        },
        badgeText: 'STYLE A · LITERARY SERIF',
      },
      B: {
        variant: 'B',
        label: 'Style B · Scholarly Sans',
        shortDesc: 'Clean scholarly minimalist sans',
        fontFamily: "'DM Sans', sans-serif",
        titleStyle: {
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.16,
        },
        badgeText: 'STYLE B · SCHOLARLY SANS',
      },
      C: {
        variant: 'C',
        label: 'Style C · Margin Note',
        shortDesc: 'Notebook margin handwritten font',
        fontFamily: "'Caveat', cursive",
        titleStyle: {
          fontFamily: "'Caveat', cursive",
          fontWeight: 700,
          fontSize: '1.55rem',
          lineHeight: 1.08,
        },
        badgeText: 'STYLE C · MARGIN HAND',
      },
    },
  },
  Party: {
    category: 'Party',
    groupTitle: 'Party Meet (Nightlife, Clubbing, Acoustic Jam Sessions)',
    vibe: 'Loud, neon, high-energy weekend festival.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Bouncy Bubble-Pop',
        shortDesc: 'Bold bouncy bubble-pop font',
        fontFamily: "'Fredoka', sans-serif",
        titleStyle: {
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.02em',
          lineHeight: 1.14,
        },
        badgeText: 'STYLE A · BUBBLE-POP',
      },
      B: {
        variant: 'B',
        label: 'Style B · Disco Marquee',
        shortDesc: 'Heavy retro disco marquee lettering',
        fontFamily: "'Righteous', sans-serif",
        titleStyle: {
          fontFamily: "'Righteous', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.14,
        },
        badgeText: 'STYLE B · DISCO MARQUEE',
      },
      C: {
        variant: 'C',
        label: 'Style C · Neon Script',
        shortDesc: 'Glowing neon script font',
        fontFamily: "'Dancing Script', cursive",
        titleStyle: {
          fontFamily: "'Dancing Script', cursive",
          fontWeight: 700,
          fontSize: '1.6rem',
          textShadow: '0 0 12px rgba(255,255,255,0.45)',
          lineHeight: 1.08,
        },
        badgeText: 'STYLE C · NEON SCRIPT',
      },
    },
  },
  Tech: {
    category: 'Tech',
    groupTitle: 'Tech & Code (Indie Hackers, AI Builders, OCI / n8n Meetups)',
    vibe: 'Raw builder culture, terminal output, garage startup.',
    styles: {
      A: {
        variant: 'A',
        label: 'Style A · Syntax Mono',
        shortDesc: 'Raw code-editor monospace with syntax highlighting glow',
        fontFamily: "'JetBrains Mono', monospace",
        titleStyle: {
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE A · CODE MONO',
      },
      B: {
        variant: 'B',
        label: 'Style B · Brutalist Dev',
        shortDesc: 'Brutalist industrial developer font',
        fontFamily: "'Space Mono', monospace",
        titleStyle: {
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE B · BRUTALIST DEV',
      },
      C: {
        variant: 'C',
        label: 'Style C · System UI',
        shortDesc: 'Clean minimalist system-UI font',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif",
        titleStyle: {
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        },
        badgeText: 'STYLE C · SYSTEM UI',
      },
    },
  },
};

const VARIANTS: TypographyVariantKey[] = ['A', 'B', 'C'];

export function getTypographyForMeet(
  category: MeetCategory,
  meetId: string,
  explicitVariant?: TypographyVariantKey
): TypographyStyleSpec {
  const group = CATEGORY_TYPOGRAPHY[category] || CATEGORY_TYPOGRAPHY.Community;
  if (explicitVariant && group.styles[explicitVariant]) {
    return group.styles[explicitVariant];
  }
  let hash = 0;
  for (let i = 0; i < meetId.length; i++) {
    hash = (hash * 31 + meetId.charCodeAt(i)) % 997;
  }
  const picked = VARIANTS[hash % 3];
  return group.styles[picked];
}

export function getNextTypographyVariant(current: TypographyVariantKey): TypographyVariantKey {
  if (current === 'A') return 'B';
  if (current === 'B') return 'C';
  return 'A';
}
