import type { BodyPart } from '../lib/data/types';

// Single source of truth for the app's dark palette. Mirrored into
// tailwind.config.js so both Tailwind utility classes (`bg-surface`,
// `text-accent`, etc.) and raw JS/TS consumers (recharts colors, canvas,
// inline styles) draw from the same values. If you change a color, change
// it in both places.
//
// OWNERSHIP: owned by Agent 1 (scaffold) — see docs/CONTRACTS.md. Reuse
// these tokens rather than inventing new colors.

export const colors = {
  bg: '#0F1115',
  surface: '#181B20',
  surfaceHover: '#21252C',
  border: '#2A2E37',

  textPrimary: '#F5F6F7',
  textSecondary: '#A0A6B0',
  textTertiary: '#6B7280',

  accentLight: '#FF9152',
  accent: '#F97316',
  accentHover: '#EA5F0A',

  muted: {
    teal: '#4FB6AC',
    blue: '#6C8EBF',
    lavender: '#9B8AC4',
    gold: '#D9B85C',
    success: '#6FAE8C',
    danger: '#D9756B',
  },
} as const;

/** Body-part -> color map. Reused by the Exercise Library and Monthly Summary charts. */
export const bodyPartColors: Record<BodyPart, string> = {
  chest: '#E08A5C',
  back: '#6C8EBF',
  shoulders: '#9B8AC4',
  legs: '#4FB6AC',
  arms: '#D9B85C',
  core: '#6FAE8C',
  cardio: '#D9756B',
  full_body: '#A0A6B0',
};

export const bodyPartLabels: Record<BodyPart, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  legs: 'Legs',
  arms: 'Arms',
  core: 'Core',
  cardio: 'Cardio',
  full_body: 'Full Body',
};
