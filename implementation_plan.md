# Redesign Landing Page and Navigation

The goal is to fix the jarring white sections on the landing page by making the entire page match the new premium dark SaaS aesthetic, extending the animated grid to cover the full page background, and updating the header navigation to be more logical.

## Proposed Changes

### 1. Global Header Navigation (`frontend/app/layout.tsx`)
Currently, the header shows "Dashboard", "Models", and "Reports" (all pointing to `/dashboard`).
I propose changing these to:
- **Features** (links to `#features` on the landing page)
- **How it Works** (links to `#how-it-works` on the landing page)
- **Dashboard** (links to `/dashboard`)

### 2. Animated Grid Background (`frontend/app/globals.css` & `frontend/app/page.tsx`)
- Change the grid container from `position: absolute` to `position: fixed` so it remains visible as a persistent background while you scroll down the page.
- Remove the aggressive `.grid-fade` mask so the grid doesn't abruptly disappear halfway down the screen.

### 3. Dark SaaS Landing Page (`frontend/app/page.tsx`)
- Remove all white backgrounds (`#ffffff`, `#f8fafc`, `#f1f5f9`).
- Set the entire page background to transparent so the fixed 3D grid shows underneath.
- Update the "Problem" cards and "How it works" steps to use the same premium dark styling used in the dashboard:
  - Background: `#111111` with `.card-grid-texture`
  - Border: `#1c1c1c`
  - Text: `#f5f5f5` for headings, `#737373` for body text.

## User Review Required
> [!IMPORTANT]
> Please review the new navigation links (Features, How it Works, Dashboard). Do these make sense for your vision? Also confirm you are okay with keeping the "Problem" section on the main landing page, just redesigned to be completely dark and seamless!

## Verification Plan
After execution, you can view `http://localhost:3000` to confirm that the white sections are gone, the grid persists across the whole page, and the header navigation is updated.
