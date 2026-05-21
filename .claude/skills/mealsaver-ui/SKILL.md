---
name: mealsaver-ui
description: Build high-fidelity MealSaver frontend UI screens from the provided mockups. Use when creating or editing MealSaver pages, dashboards, forms, donation flows, NGO matching screens, pickup and delivery screens, admin dashboards, impact reports, or any React/Tailwind UI that should match the MealSaver green food-rescue design system.
---

# MealSaver UI Skill

Use this skill when building or modifying the MealSaver frontend.

## Goal

Create high-fidelity UI matching the MealSaver mockup style:
- Food rescue / NGO donation platform
- Clean green-and-white interface
- Rounded dashboard cards
- Soft shadows
- Large impact metrics
- Form-heavy onboarding flows
- Donor, NGO, admin, pickup, delivery, and impact dashboards

## Preferred Stack

Use:
- Next.js or React
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- lucide-react icons
- Recharts for charts

## Visual Design Rules

Use these design conventions consistently:

- Background: warm off-white or very light green-white
- Cards: white, rounded `2xl`, subtle border, soft shadow
- Primary color: deep green
- Secondary color: pale green backgrounds
- Accent color: orange for pending, urgent, pickup, expiry, or warning states
- Danger color: red for reject, failed, expired, or emergency states
- Text: dark navy / charcoal for headings, muted gray for supporting text
- Buttons: rounded, bold, green primary buttons
- Status labels: pill badges with soft background colors
- Icons: lucide-react outline icons, mostly green
- Forms: clean input groups, clear labels, required-field markers, large submit buttons
- Dashboards: sidebar navigation, metric cards, tables, status badges, activity timelines

## Component Rules

Before building pages, create reusable components where possible:

- `PageShell`
- `Logo`
- `SectionCard`
- `StatCard`
- `StatusBadge`
- `PrimaryButton`
- `SecondaryButton`
- `FormInput`
- `DashboardSidebar`
- `DonationCard`
- `TimelineStepper`
- `ImpactChart`
- `AdminMetricCard`
- `RoleSelector`
- `VerificationChecklist`

## Page Implementation Rules

When implementing a screen from a mockup:

1. Identify the page type: landing, login, registration, dashboard, donation detail, NGO matching, pickup, delivery, admin, or impact.
2. Reuse existing MealSaver components before creating new ones.
3. Match layout, spacing, typography, border radius, shadows, icon sizing, and color hierarchy.
4. Use realistic mock data in a separate `data/` or `lib/mock-data.ts` file.
5. Keep backend logic out unless explicitly requested.
6. Prioritize desktop fidelity first, then make the layout responsive.
7. Do not add unrelated features or visual styles.

## Quality Checklist

Before finishing, verify:

- The page visually matches the reference mockup.
- Cards have consistent radius, padding, border, and shadow.
- Green, orange, red, and muted states are used consistently.
- Sidebar and dashboard layouts are aligned.
- Forms have consistent label, input, and button spacing.
- Status badges are pill-shaped and readable.
- Icons are consistent in stroke style and size.
- Dummy data is centralized and easy to replace later.

## Suggested Route Structure

Use routes like:

```txt
/
 /login
 /register
 /donor/register
 /donor/dashboard
 /donor/donations/new
 /donor/donations/[id]
 /ngo/register
 /ngo/dashboard
 /ngo/donations/[id]
 /ngo/pickups/[id]
 /pickup/assignment
 /pickup/verify
 /delivery/confirm
 /impact
 /admin
```
## Prompting Pattern

When the user provides a mockup, follow this pattern:

Inspect the reference image.
Break the UI into components.
Implement reusable components first.
Implement the target route.
Run the app if possible.
Compare visually and fix spacing, sizing, colors, and alignment.