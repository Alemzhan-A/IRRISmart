# IRRISmart - AI Irrigation Advisory Dashboard

An intelligent irrigation and fertigation management system designed for farmers using desalinated or brackish water sources. This dashboard helps optimize water usage, reduce energy consumption, and improve crop quality through AI-powered insights.

![Dashboard Preview](https://img.shields.io/badge/Status-Production_Ready-green) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## Problem Statement

Water scarcity and high costs (especially from desalinated/brackish sources) make efficient irrigation critical. Over- or under-irrigation leads to:
- Wasted energy and water resources
- Increased soil salinity
- Reduced crop quality and yield

## Solution

IRRISmart provides an AI-powered advisory system that integrates:
- **Weather forecasts** for intelligent scheduling
- **Crop growth stages** for precise water/nutrient requirements
- **Soil/substrate moisture monitoring** in real-time
- **Water quality analysis** (EC, pH, TDS, chlorides)
- **Greenhouse climate control** (pad/fog systems)
- **Simple set-points** for easy on-farm configuration
- **Offline edge operation** for reliability

## Features

### 📊 Real-Time Monitoring
- Soil moisture levels across multiple zones
- Water quality parameters (EC, pH, TDS, chloride)
- Active irrigation and fertigation schedules
- Greenhouse climate controls

### 🤖 AI-Powered Recommendations
- Smart irrigation scheduling based on weather forecasts
- Crop stage-specific nutrient management
- Water conservation insights
- Cost and energy savings tracking

### 🌱 Crop Management
- Growth stage tracking
- Water and nutrient requirement indicators
- Days to harvest countdown
- Zone-specific monitoring

### ⚙️ Easy Configuration
- Simple set-points interface
- Customizable thresholds for moisture, EC, pH
- Daily water limits per zone
- One-click system controls

### 🌐 Offline Capable
- Progressive Web App (PWA) ready
- Edge computing enabled
- Works without internet connectivity
- Real-time online/offline status indicator

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Maps**: Mapbox GL JS v3 with React Map GL
- **Drawing**: Mapbox GL Draw

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mapbox account (free tier available)

### Installation

1. Clone the repository:
\`\`\`bash
cd IRRISmart
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up Mapbox token:
   - Sign up at [mapbox.com](https://www.mapbox.com/)
   - Get your access token from [account settings](https://account.mapbox.com/access-tokens/)
   - Create a \`.env.local\` file in the root directory:
   \`\`\`bash
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   \`\`\`
   - See [MAPBOX_SETUP.md](./MAPBOX_SETUP.md) for detailed instructions

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
IRRISmart/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Main dashboard page
│   └── globals.css                # Global styles and Tailwind v4 theme
├── components/
│   ├── ui/                        # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── progress.tsx
│   ├── sidebar.tsx                # Left navigation sidebar
│   ├── top-header.tsx             # Top header with search and user menu
│   ├── zone-stats.tsx             # 4 stat cards for zone overview
│   ├── moisture-analytics.tsx     # Weekly bar chart
│   ├── moisture-monitor.tsx       # Real-time moisture levels
│   ├── water-quality.tsx          # Water parameters monitoring
│   ├── irrigation-schedule.tsx    # Daily irrigation schedule
│   ├── weather-forecast.tsx       # 4-day weather forecast
│   ├── greenhouse-controls.tsx    # Climate control systems
│   ├── crop-stage.tsx             # Crop growth tracking
│   ├── ai-recommendations.tsx     # AI insights panel
│   ├── setpoints-config.tsx       # System configuration
│   ├── team-collaboration.tsx     # Team member task tracking
│   ├── zone-progress.tsx          # Circular progress chart
│   ├── upcoming-reminders.tsx     # Reminder card
│   ├── active-zones-list.tsx      # Zone management list
│   └── time-tracker.tsx           # System uptime tracker
├── lib/
│   └── utils.ts                   # Utility functions (cn, etc.)
└── public/
    └── manifest.json              # PWA manifest
\`\`\`

## Dashboard Components

### Navigation & Layout
- **Sidebar Navigation**: Clean, organized menu with Dashboard, Irrigation, Schedule, Analytics, and Team sections
- **Top Header**: Search functionality, online/offline status, notifications, and user profile
- **Responsive Grid Layout**: Optimized for desktop and tablet viewing

### 1. Zone Statistics Cards
Four key metrics at a glance:
- **Total Zones**: Overview of all active irrigation zones (highlighted card)
- **Optimal Zones**: Zones operating at ideal parameters
- **Needs Attention**: Zones requiring adjustments
- **Critical Zones**: Zones with urgent issues

### 2. Interactive Zone Map ⭐ NEW
Advanced mapping features with Mapbox GL:
- **Interactive Satellite Map**: High-resolution satellite imagery with street overlays
- **Draw Irrigation Zones**: Click-to-draw polygon tool for creating zone boundaries
- **Zone Management Panel**: Side panel with all zones, area calculations, and crop assignments
- **Edit Capabilities**: Modify zone boundaries by dragging points
- **Select & Highlight**: Click zones to select and view details
- **Delete Zones**: Remove zones with trash icon
- **Navigation Controls**: Zoom, pan, rotate, and geolocate
- **Real-time Updates**: Instant visual feedback on all changes
- **Area Calculation**: Automatic hectare calculations for each zone
- **Color Coding**: Visual zone differentiation with custom colors

### 3. AI Recommendations
Smart insights panel with priority-based recommendations:
- Irrigation optimization based on weather forecasts
- Fertigation adjustments by crop growth stage
- Water conservation opportunities with savings calculations
- Priority levels (High, Medium, Low) with visual indicators

### 4. Irrigation Analytics
Weekly bar chart visualization showing:
- Water usage patterns across the week
- Peak usage identification
- Trend analysis for optimization
- Hatched pattern design for active days

### 5. Moisture Monitor
Real-time soil moisture tracking:
- Zone-specific moisture levels
- Status indicators (optimal, low, critical)
- Trend arrows (up, down, stable)
- Progress bars with color-coded status

### 6. Water Quality Analysis
Comprehensive water source monitoring:
- EC (Electrical Conductivity/Salinity)
- pH levels
- TDS (Total Dissolved Solids)
- Chloride content
- Color-coded status cards

### 7. Team Collaboration
Staff assignment and task tracking:
- Team member avatars with gradient colors
- Current task assignments
- Status badges (Completed, In Progress, Pending)
- Add member functionality

### 8. Zone Progress Tracker
Circular progress visualization:
- Overall zone efficiency percentage
- Completed vs In Progress breakdown
- Pending tasks visualization
- Clean, modern circular chart design

### 9. Upcoming Reminders
Quick access to scheduled events:
- System maintenance schedules
- Upcoming inspections
- Calendar integration
- Quick action buttons

### 10. Active Zones List
Comprehensive zone management:
- All zones with crop information
- Growth stage indicators
- Due dates and deadlines
- Status badges for each zone
- Add new zone functionality

### 11. Irrigation Schedule
Today's automated schedule:
- Time-based irrigation events
- Fertigation cycles
- Duration and water volume
- Start/pause controls
- Status tracking

### 12. Greenhouse Controls
Climate management systems:
- Fog cooling system with scheduling
- Evaporative cooling pad management
- Ventilation control
- Real-time status and manual overrides

### 13. System Uptime Tracker
Real-time monitoring widget:
- Continuous uptime display
- Pause/reset controls
- Dark gradient design with wave patterns
- Visual appeal similar to time tracking apps

### 14. Download Mobile App Card (Removed)
Promotional card in sidebar:
- Call-to-action for mobile app
- Gradient dark design
- Download button
- Decorative blur effects

## Future Enhancements

- Backend integration with sensor networks
- Machine learning models for predictive irrigation
- Historical data analytics and reporting
- Mobile app (iOS/Android)
- Multi-farm management
- Integration with weather APIs
- Automated alert notifications
- Export reports and compliance documentation

## License

MIT License - Feel free to use this project for your irrigation management needs.

## Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for sustainable agriculture**
