# Admin Panel UPD Design System Implementation Plan

## Overview
Apply the pixel-perfect UPD design system from `upd-dashboard.html` to the admin-panel Next.js application.

## Design System Analysis from upd-dashboard.html

### Color Palette
```css
--ink: #0d0d0d;        /* Primary text/dark elements */
--paper: #f5f2eb;      /* Background */
--cream: #ede9df;      /* Secondary background */
--accent: #c8401a;     /* Primary accent (red-orange) */
--accent2: #1a6bc8;    /* Blue accent */
--accent3: #1e8a52;    /* Green accent (success) */
--gold: #c9a227;       /* Gold accent */
--muted: #888070;      /* Muted text */
--border: #d6d0c4;     /* Borders */
--panel: #ffffff;      /* White panels */
```

### Typography
- **Display Font**: Bebas Neue (headings, large text)
- **Body Font**: DM Sans (regular text)
- **Mono Font**: DM Mono (code, numbers, SKUs)

### Key Components to Implement

#### 1. Navigation Bar
- Height: 56px
- Background: var(--ink)
- Border-bottom: 3px solid var(--accent)
- Logo: Bebas Neue, 22px
- Tabs: 13px, 500 weight, 8px 16px padding
- Active tab: background var(--accent)
- Badge: 10px, 600 weight, rounded-full

#### 2. Sidebar (Admin)
- Width: 220px
- Background: var(--ink)
- Padding: 24px 0
- Items: 13.5px, 10px 20px padding
- Active: border-left 3px var(--accent), background rgba(200,64,26,0.12)
- Labels: 10px, 600 weight, uppercase, letter-spacing 1.2px
- Count badges: 10px, 700 weight, rounded-full, background var(--accent)

#### 3. Stats Cards
- Grid: 4 columns, 16px gap
- Padding: 20px 22px
- Border-radius: 6px
- Top border: 3px colored accent
- Label: 11px, 600 weight, uppercase, letter-spacing 0.8px
- Value: Bebas Neue, 38px
- Sub: 12px, muted color

#### 4. Table Card
- Background: white
- Border: 1px solid var(--border)
- Border-radius: 6px
- Shadow: 0 2px 12px rgba(13,13,13,0.10)
- Header: padding 16px 20px, background var(--cream)
- Table header: 11px, 600 weight, uppercase, letter-spacing 0.6px
- Table cells: 13.5px, padding 13px 16px
- Hover: background var(--cream)

#### 5. Detail Panel
- Width: 380px
- Background: var(--paper)
- Border-left: 1px solid var(--border)
- Padding: 24px
- Section headers: 11px, 700 weight, uppercase, letter-spacing 0.8px
- Detail rows: 13px, flex justify-between

#### 6. Buttons
- Primary: background var(--ink), color white
- Secondary: border 1.5px var(--border), transparent background
- Success: background var(--accent3)
- Danger: background var(--accent)
- Padding: 10px 22px (regular), 6px 14px (small)
- Border-radius: 6px
- Font-size: 14px (regular), 12px (small)
- Font-weight: 600
- Letter-spacing: 0.2px

#### 7. Status Pills
- Padding: 6px 14px
- Border-radius: 20px
- Font-size: 12px
- Font-weight: 600
- Letter-spacing: 0.4px
- Text-transform: uppercase
- Dot: 6px circle, same color as text

**Variants:**
- Pending: background #fef8e7, color #856404, border #f0c040
- Approved: background #f0faf5, color var(--accent3), border #a8dfc0
- Rejected: background #fef2f0, color var(--accent), border #f0b0a0

#### 8. Risk Flags
- Padding: 2px 8px
- Border-radius: 4px
- Font-size: 11px
- Font-weight: 500
- Default: background #fef8e7, color #856404, border #f0c040
- High: background #fef2f0, color var(--accent), border #f0b0a0

#### 9. Chips
- Background: var(--cream)
- Border: 1px solid var(--border)
- Border-radius: 4px
- Font-size: 11px
- Font-weight: 500
- Padding: 2px 8px

## Implementation Steps

### Phase 1: Global Styles & Fonts
1. Update `app/globals.css` with UPD CSS variables
2. Add Google Fonts (Bebas Neue, DM Sans, DM Mono)
3. Set base typography styles

### Phase 2: Layout Components
1. Create/Update `components/layout/AdminNav.tsx`
2. Create/Update `components/layout/AdminSidebar.tsx`
3. Update dashboard layout structure

### Phase 3: UI Components
1. Update `components/ui/Button.tsx` with all variants
2. Create `components/ui/StatusPill.tsx`
3. Create `components/ui/StatCard.tsx`
4. Create `components/ui/TableCard.tsx`
5. Create `components/ui/DetailPanel.tsx`
6. Create `components/ui/RiskFlag.tsx`
7. Create `components/ui/Chip.tsx`

### Phase 4: Dashboard Pages
1. Update pending applications page
2. Update approved retailers page
3. Update rejected applications page
4. Update flagged inventory page
5. Update activity log page

### Phase 5: Detail Views
1. Implement application review detail panel
2. Add approve/reject actions
3. Add internal notes textarea

## File Structure

```
admin-panel/
├── app/
│   ├── globals.css (UPDATE with UPD variables)
│   ├── layout.tsx (UPDATE with fonts)
│   └── (dashboard)/
│       ├── layout.tsx (UPDATE with AdminNav + AdminSidebar)
│       ├── page.tsx (Dashboard overview)
│       ├── pending/
│       │   └── page.tsx (Pending applications)
│       ├── approved/
│       │   └── page.tsx (Approved retailers)
│       ├── rejected/
│       │   └── page.tsx (Rejected applications)
│       ├── inventory/
│       │   └── page.tsx (Flagged inventory)
│       └── logs/
│           └── page.tsx (Activity log)
├── components/
│   ├── layout/
│   │   ├── AdminNav.tsx (NEW/UPDATE)
│   │   └── AdminSidebar.tsx (NEW/UPDATE)
│   └── ui/
│       ├── Button.tsx (UPDATE)
│       ├── StatusPill.tsx (NEW)
│       ├── StatCard.tsx (NEW)
│       ├── TableCard.tsx (NEW)
│       ├── DetailPanel.tsx (NEW)
│       ├── RiskFlag.tsx (NEW)
│       └── Chip.tsx (NEW)
└── types/
    └── admin.ts (NEW - admin-specific types)
```

## Priority Order

1. **High Priority** (Core UX):
   - Global styles & fonts
   - Navigation bar
   - Sidebar
   - Pending applications page with table
   - Detail panel for review

2. **Medium Priority** (Enhanced UX):
   - Stats cards
   - Status pills
   - Buttons with all variants
   - Approved/Rejected pages

3. **Low Priority** (Nice to have):
   - Activity log
   - Flagged inventory
   - Advanced filtering
   - Search functionality

## Notes

- Use Tailwind CSS with custom config for UPD colors
- All spacing should use bracket notation for pixel-perfect implementation
- Maintain responsive design (mobile-first approach)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Add loading states for all async operations
- Implement optimistic UI updates where appropriate

## Testing Checklist

- [ ] All colors match UPD design system
- [ ] Typography uses correct fonts and sizes
- [ ] Spacing is pixel-perfect
- [ ] Hover states work correctly
- [ ] Active states are visible
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Loading states implemented
- [ ] Error states handled
