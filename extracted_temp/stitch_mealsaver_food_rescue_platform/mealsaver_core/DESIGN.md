---
name: MealSaver Core
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#6e7b6c'
  outline-variant: '#bdcab9'
  surface-tint: '#006e2b'
  primary: '#006b2a'
  on-primary: '#ffffff'
  primary-container: '#008737'
  on-primary-container: '#f7fff2'
  inverse-primary: '#63df7b'
  secondary: '#59605c'
  on-secondary: '#ffffff'
  secondary-container: '#dae1dd'
  on-secondary-container: '#5d6461'
  tertiary: '#795600'
  on-tertiary: '#ffffff'
  tertiary-container: '#986d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#80fc94'
  primary-fixed-dim: '#63df7b'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#00531f'
  secondary-fixed: '#dde4df'
  secondary-fixed-dim: '#c1c8c4'
  on-secondary-fixed: '#161d1a'
  on-secondary-fixed-variant: '#414845'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#ffba20'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality is **Community-focused, Trustworthy, and Lightweight**. It aims to evoke a sense of optimistic action—making the serious task of food rescue feel as approachable and rewarding as a language lesson or a community gathering.

The design system adopts a **Modern Minimalism** style. It prioritizes clarity through heavy use of white space, a vibrant yet soft color palette, and high-readability typography. Inspired by the "bento box" and card-based layouts of Notion and Airbnb, it organizes complex logistics into digestible, friendly modules. The interface avoids "industrial" or "enterprise" aesthetics in favor of a soft, consumer-grade experience that reduces the cognitive load for both donors and NGOs.

## Colors

The palette is anchored by **Soft Green (#1FA64A)**, symbolizing growth, health, and environmental impact. This is the primary action color.

- **Primary:** Soft Green (#1FA64A) for main CTAs, progress indicators, and "Success" states.
- **Secondary:** Mint Wash (#F2F9F4) used for large background surfaces and subtle card grouping.
- **Tertiary:** Amber (#FFB800) reserved for urgent pickup windows, expiring donations, or warnings.
- **Neutral:** A deep Ink (#1A1C1E) for high-contrast typography, paired with a series of cool greys (#64748B) for labels and secondary information.

The design defaults to **light mode** to maximize the feeling of cleanliness and openness, using subtle borders and soft backgrounds rather than heavy dark backgrounds.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral, modern tone. The type scale is designed to be highly readable for diverse users, including those in high-stress, fast-paced environments like commercial kitchens or delivery vehicles.

- **Headlines:** Use Bold weights with tight letter-spacing for a confident, editorial look.
- **Body:** Generous line-heights (1.5x minimum) are maintained to ensure blocks of text are never intimidating.
- **Labels:** Semi-bold or Medium weights are used for data points (e.g., "8 Portions", "2.3 km") to ensure they pop against neutral backgrounds.
- **Mobile scaling:** Headline sizes are reduced by roughly 20% on mobile to maintain hierarchy without overwhelming the small viewport.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a "safe-margin" approach to create a sense of breathability.

- **Desktop:** 12-column grid with a 1280px max-width. Large 48px margins create the "island" effect for the UI.
- **Tablet:** 8-column grid with 32px margins.
- **Mobile:** 4-column grid with 16px margins. 

The rhythm is built on an **8px baseline**. Vertical spacing between sections should be generous (32px or 48px) to reinforce the "Minimalist" brand requirement. Cards and modules should use internal padding of 24px to ensure content never feels cramped.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than stark lines.

- **Level 0 (Background):** Solid white (#FFFFFF) or very light Mint (#F2F9F4).
- **Level 1 (Cards/Surface):** White cards with a subtle, very soft shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) or a 1px soft-grey border (#E2E8F0).
- **Level 2 (Modals/Popovers):** Slightly more pronounced shadow (0px 10px 30px rgba(0, 0, 0, 0.08)) to pull the element toward the user.

Avoid heavy black shadows or high-contrast borders. The goal is for elements to feel like they are resting lightly on a clean surface.

## Shapes

The shape language is **Rounded**, leaning into a friendly and safe aesthetic.

- **Standard Elements:** Inputs, small buttons, and chips use a **16px (1rem)** radius.
- **Large Elements:** Featured cards, dashboard modules, and hero images use a **24px (1.5rem)** radius.
- **Interactive States:** On hover, buttons do not change radius, but may increase in shadow depth to simulate physical "lift."

## Components

### Buttons
- **Primary:** Soft Green background, white text. 16px corner radius. Heavy vertical padding (16px) for a "touch-friendly" feel.
- **Secondary:** Soft Green border (2px) with a Mint Wash background.
- **Tertiary:** Text-only with an icon, used for less critical actions like "View Details."

### Cards
Cards are the primary vessel for information. They must include:
- **Header:** Bold title and a status chip.
- **Body:** Use icons (24px) for key metadata (time, distance, quantity).
- **Footer:** A single, clear primary action.

### Status Chips
Pill-shaped with low-opacity background tints (e.g., a light green background with dark green text for "Available", light amber for "Expiring Soon").

### Progress Trackers
Horizontal step-indicators with icons. Completed steps use the primary green; active steps use a stroke; upcoming steps are muted grey.

### Input Fields
Large, accessible touch targets. 16px rounded corners. Labels sit outside the field for permanent visibility. Active states use a 2px green border glow.