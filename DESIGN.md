# Design System - IRRISmart Dashboard

## Design Philosophy

The IRRISmart dashboard follows a clean, modern design approach inspired by professional project management tools, adapted for agricultural irrigation management.

## Layout Structure

### 1. Sidebar Navigation (Fixed Left)
- **Width**: 256px (16rem)
- **Position**: Fixed left, full height
- **Background**: White (#ffffff)
- **Border**: Right border with gray-200

**Components**:
- Logo and branding at top
- Menu section (Dashboard, Irrigation, Schedule, Analytics, Team)
- General section (Settings, Help, Logout)
- Mobile app promo card at bottom

### 2. Main Content Area
- **Margin Left**: 256px (to account for sidebar)
- **Background**: Light gray (#f9fafb)

**Structure**:
- Top header (sticky)
- Page title and actions
- Zone stats cards
- Content grid layout

## Color Palette

### Primary Colors
- **Primary Green**: `#22c55e` - Used for CTAs, active states, and success
- **Primary Foreground**: `#ffffff` - Text on primary color

### Neutral Colors
- **Background**: `#f9fafb` - Main page background
- **Card Background**: `#ffffff` - Card and component backgrounds
- **Foreground**: `#111827` - Primary text color
- **Muted Foreground**: `#6b7280` - Secondary text

### Status Colors
- **Success/Optimal**: Green gradients (`#22c55e`, `#16a34a`)
- **Warning/Attention**: Yellow gradients (`#eab308`, `#f59e0b`)
- **Critical/Destructive**: Red (`#ef4444`)
- **Info**: Blue gradients (`#3b82f6`, `#2563eb`)

### Gradient Combinations
```css
/* Primary Card Gradient */
background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);

/* Dark Card Gradient (Time Tracker, Mobile App) */
background: linear-gradient(135deg, #1f2937 0%, #111827 100%);

/* Zone Avatar Gradients */
- Red-Pink: from-red-400 to-pink-500
- Green-Teal: from-green-400 to-teal-500
- Blue-Indigo: from-blue-400 to-indigo-500
- Orange-Yellow: from-orange-400 to-yellow-500
```

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes
- **Heading 1**: 30px (1.875rem) - Page titles
- **Heading 2**: 20px (1.25rem) - Card titles
- **Heading 3**: 18px (1.125rem) - Section headings
- **Body**: 14px (0.875rem) - Default text
- **Small**: 12px (0.75rem) - Labels, captions
- **XSmall**: 10px (0.625rem) - Badges, tags

### Font Weights
- **Bold**: 700 - Headings, numbers
- **Semibold**: 600 - Subheadings, labels
- **Medium**: 500 - Buttons, active items
- **Regular**: 400 - Body text

## Spacing System

Based on Tailwind's spacing scale (1 unit = 0.25rem = 4px):

- **xs**: 0.5rem (2 units) - Tight spacing
- **sm**: 0.75rem (3 units) - Compact elements
- **md**: 1rem (4 units) - Default spacing
- **lg**: 1.5rem (6 units) - Section spacing
- **xl**: 2rem (8 units) - Major sections
- **2xl**: 3rem (12 units) - Page sections

## Component Design Patterns

### Cards
```tsx
- Border radius: 0.75rem (rounded-xl)
- Shadow: subtle drop shadow
- Border: 1px solid #e5e7eb
- Padding: 1.5rem (p-6)
- Background: white
```

### Buttons
```tsx
Primary Button:
- Background: #22c55e
- Text: white
- Padding: 0.5rem 1rem
- Border radius: 0.5rem
- Hover: 90% opacity

Outline Button:
- Border: 1px solid #e5e7eb
- Text: #111827
- Background: white
- Hover: #f3f4f6 background
```

### Badges
```tsx
- Border radius: 0.375rem (rounded-md)
- Padding: 0.125rem 0.625rem
- Font size: 12px
- Font weight: 600

Status Variants:
- Completed: bg-green-100, text-green-700
- In Progress: bg-yellow-100, text-yellow-700
- Pending: bg-red-100, text-red-700
```

### Progress Bars
```tsx
- Height: 0.5rem (h-2)
- Border radius: 9999px (rounded-full)
- Background: #e5e7eb
- Indicator: Dynamic based on status
  - Good: #22c55e
  - Warning: #eab308
  - Critical: #ef4444
```

### Avatar Circles
```tsx
- Size: 40px (10)
- Border radius: 50% (rounded-full)
- Gradient backgrounds
- White text, centered
- Font weight: 600
```

## Icon System

Using Lucide React icons:
- **Size**: 20px (h-5 w-5) for most contexts
- **Size**: 16px (h-4 w-4) for buttons and small contexts
- **Stroke Width**: 2px (default)
- **Colors**: Match context (muted, primary, status colors)

### Common Icons
- Droplet: Water/irrigation related
- Sprout/Leaf: Crops and plants
- Calendar: Scheduling
- BarChart3: Analytics
- Settings2: Configuration
- Users: Team
- Bell: Notifications
- Clock: Time/uptime

## Interactive States

### Hover
- Slight background color change
- Smooth transition (150-300ms)
- Scale on hover for interactive elements (optional)

### Active
- Bold background color
- White text for dark backgrounds
- Distinct visual indicator

### Focus
- Ring outline with primary color
- 2px offset for accessibility

## Responsive Breakpoints

Following Tailwind defaults:
- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Small laptops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large screens

### Layout Adaptations
- Sidebar: Fixed on desktop, hidden on mobile (future: hamburger menu)
- Grid: 
  - Mobile: 1 column
  - Tablet (md): 2 columns
  - Desktop (lg): 3 columns for some grids

## Animation & Transitions

### Transition Timing
```css
/* Standard */
transition: all 150ms ease;

/* Smooth */
transition: all 300ms ease-out;

/* Progress/Loading */
transition: all 1000ms ease-out;
```

### Animation Use Cases
- Page load: Fade in
- Modal/drawer: Slide in
- Progress bars: Smooth width change
- Hover states: Quick color/scale change
- Loading states: Pulse or spinner

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements clearly distinguishable

### Focus States
- Visible focus rings on keyboard navigation
- Tab order follows logical flow

### ARIA Labels
- Icons include descriptive labels
- Interactive elements have proper roles

## Dark Mode (Future)

Variables are set up for dark mode theming:
- Background: #111827
- Foreground: #f9fafb
- Card: #1f2937
- Borders: #374151

## Special Visual Elements

### Blur Effects
```tsx
backdrop-blur: For glass-morphism effects
blur-3xl: For decorative background circles
```

### Gradients
```tsx
/* Mesh Gradients */
bg-gradient-to-br from-green-50 via-blue-50 to-gray-50

/* Card Gradients */
bg-gradient-to-br from-gray-900 to-gray-800
```

### Patterns
```tsx
/* Diagonal Stripes (Analytics bars) */
repeating-linear-gradient(45deg, 
  transparent, 
  transparent 10px, 
  rgba(255,255,255,.1) 10px, 
  rgba(255,255,255,.1) 20px
)
```

## Best Practices

1. **Consistency**: Use the same patterns throughout
2. **White Space**: Don't overcrowd - let content breathe
3. **Hierarchy**: Clear visual hierarchy with size and weight
4. **Feedback**: Provide immediate visual feedback on interactions
5. **Performance**: Optimize images, lazy load when possible
6. **Accessibility**: Always consider keyboard and screen reader users

---

**Last Updated**: October 2025
**Design Version**: 1.0

