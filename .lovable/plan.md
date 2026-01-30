
# UI Redesign: Dark "WALL OF FAIL" Theme

Transform the current friendly professional light theme into a bold, dark-themed design inspired by the reference image.

---

## Visual Changes Overview

The redesign introduces:
- **Dark background** with a network/constellation-style animated pattern
- **Bold typography** with "WALL OF FAIL" branding
- **Neon green accents** on dark backgrounds
- **Stats bar** showing platform metrics
- **Card-based failure display** with images and user avatars
- **Prominent "SUBMIT FAILURE" button** in the header

---

## Phase 1: Design System Overhaul

### 1.1 Color Palette Update
Switch the default theme to dark mode with new accent colors:
- **Background**: Near-black (#0a0a0a)
- **Cards**: Dark gray with subtle borders
- **Primary accent**: Neon green (#00ff88)
- **Secondary**: Muted gray tones
- **Text**: White/light gray hierarchy

### 1.2 Typography
- Replace serif headings with bold sans-serif
- Larger, more impactful display text
- Add custom font weights for emphasis

### 1.3 New Visual Elements
- Create animated network/constellation background component
- Add subtle glow effects on primary elements
- Sharper corners (reduce border-radius)

---

## Phase 2: Landing Page Redesign

### 2.1 Hero Section
Transform to match reference:
- **Large headline**: "Failure is the ultimate credential."
- **Subheadline**: Platform description
- **Two CTA buttons**: "Find an Expert by Failures" + "Explore the Wall"
- **Animated network background**

### 2.2 Stats Bar
Add a horizontal stats display:
- Total documented failures
- Verified engineers count
- Active blockers (TO FAIL projects)
- This creates social proof and platform activity visibility

### 2.3 Domain Tabs
Horizontal scrollable tabs for quick domain filtering:
- INDUSTRY | SaaS | Web3 | AI | Infrastructure | etc.

### 2.4 Status Filter Tabs
- TO FAIL | FAILED tabs prominently displayed
- Visual indication of current filter

---

## Phase 3: Header Redesign

### 3.1 New Header Layout
- **Left**: "WALL OF FAIL" logo in bold
- **Center**: Search bar with placeholder "Search for a specific failure history..."
- **Right**: "SUBMIT FAILURE" button (neon green) + "LOGIN/SIGNUP"

### 3.2 Mobile Responsive
- Collapsible menu for mobile
- Search accessible on mobile

---

## Phase 4: Failure Cards Redesign

### 4.1 Card Visual Updates
- Dark card backgrounds with subtle borders
- Status badges (TO FAIL / FAILED) prominently displayed
- Domain tag visible
- User avatar in corner
- Preview image/thumbnail area (placeholder for now)

### 4.2 Card Information Display
- Title prominently displayed
- "Reason" snippet visible
- Contributor avatar and name
- Timestamp

---

## Phase 5: Catalog Page Updates

### 5.1 Layout Changes
- Full-width grid of failure cards
- Domain filter tabs at top
- Status filter (TO FAIL / FAILED) tabs
- "Damage Assessment" section header styling

### 5.2 Filtering UI
- Horizontal tabs instead of dropdowns
- Active filter highlighted with neon accent

---

## Technical Implementation Details

### Files to Modify

1. **src/index.css**
   - Update CSS custom properties for dark theme as default
   - Add glow effects and new accent colors
   - Add animation keyframes for background

2. **tailwind.config.ts**
   - Update default theme values
   - Add custom utilities for glow effects

3. **src/components/layout/Header.tsx**
   - Redesign with new layout
   - Add search bar
   - Update button styling

4. **src/components/layout/Layout.tsx**
   - Add animated background component
   - Update overall structure

5. **src/pages/Index.tsx**
   - Complete redesign of hero section
   - Add stats bar component
   - Add domain/status quick filters
   - Show featured failures grid

6. **src/pages/Catalog.tsx**
   - Update filter tabs styling
   - Match new card grid layout

7. **src/components/failure/FailureCard.tsx**
   - Redesign card appearance
   - Add placeholder image area
   - Update badge positions

8. **New: src/components/ui/NetworkBackground.tsx**
   - Animated constellation/network pattern
   - SVG or Canvas-based animation

9. **New: src/components/home/StatsBar.tsx**
   - Platform statistics display component

### New Components to Create

| Component | Purpose |
|-----------|---------|
| NetworkBackground | Animated dark network pattern |
| StatsBar | Platform metrics display |
| SearchBar | Header search input |
| DomainTabs | Horizontal domain filter |

---

## Database Query for Stats

Add a stats query to display:
- COUNT of all failures
- COUNT of verified users
- COUNT of TO FAIL projects (active blockers)

---

## Migration Path

The redesign will be applied in stages:
1. First update design tokens (colors, fonts)
2. Then update layout components (Header, Layout)
3. Then update pages (Index, Catalog)
4. Finally polish individual components

This ensures the app remains functional throughout the redesign.
