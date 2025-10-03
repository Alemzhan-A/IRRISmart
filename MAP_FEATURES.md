# Interactive Zone Map - Feature Documentation

## Overview

The IRRISmart dashboard now includes a powerful interactive map feature built with Mapbox GL JS that allows farmers to visually create, manage, and monitor irrigation zones directly on satellite imagery.

## Key Features

### 🗺️ Interactive Satellite Map
- **High-Resolution Imagery**: Mapbox satellite view with street overlay
- **Real Farm Visualization**: See actual land conditions and terrain
- **Smooth Navigation**: Pan, zoom, and rotate with intuitive controls
- **Geolocation**: Find and center on your current location

### ✏️ Draw Irrigation Zones
- **Click-to-Draw Tool**: Simple polygon drawing interface
- **Precise Boundaries**: Define exact zone perimeters
- **Visual Feedback**: Green highlighting for active zones
- **Custom Styling**: Color-coded zones for easy identification

### 📊 Zone Management Panel
Located on the left side of the map:
- **Zone List**: All created zones with details
- **Quick Actions**: Edit, select, and delete zones
- **Area Calculations**: Automatic hectare measurements
- **Crop Assignment**: Associate crops with each zone
- **Color Coding**: Unique colors for visual differentiation

### 🎯 Interactive Features
- **Select Zones**: Click zones in the list to highlight on map
- **Edit Boundaries**: Modify zone shapes by dragging points
- **Delete Zones**: Remove zones with confirmation
- **Real-time Updates**: Instant visual feedback on all changes

## How to Use

### Getting Started

1. **Set Up Mapbox Token** (First Time Only)
   - Create a free account at [mapbox.com](https://www.mapbox.com/)
   - Get your access token from account settings
   - Create `.env.local` file in project root
   - Add: `NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here`
   - Restart development server

2. **Navigate to Dashboard**
   - Open http://localhost:3000
   - Scroll to the "Farm Map" section
   - The map will load with satellite view

### Creating a New Zone

1. Click **"Add New Zone"** button in the zone panel
2. The cursor will change to a crosshair
3. Click on the map to add points (minimum 3 points)
4. Create a polygon by clicking multiple points
5. **Double-click** or press **Enter** to complete the zone
6. The new zone appears in the zone list with:
   - Auto-generated name (e.g., "Zone 4")
   - Calculated area in hectares
   - Random color assignment
   - "Not assigned" crop status

### Editing a Zone

1. Click on a zone in the zone list to select it
2. The zone will be highlighted on the map
3. Click on the zone boundary on the map
4. Drag the white control points to adjust boundaries
5. Changes are saved automatically
6. Area calculations update in real-time

### Deleting a Zone

1. Find the zone in the zone list
2. Click the **trash icon** (🗑️) next to the zone
3. The zone is removed from both map and list
4. Total area calculations update automatically

### Navigation Controls

Located in the top-left of the map:
- **Zoom In/Out**: `+` and `-` buttons
- **Compass**: Click to reset north orientation
- **Geolocate**: Find your current position (📍 icon)

### Zone Information

Each zone card shows:
- **Zone Name**: Editable identifier
- **Crop Type**: Assigned crop (click edit to change)
- **Area**: Calculated in hectares
- **Color**: Visual identifier on map
- **Actions**: Edit and delete buttons

### Summary Statistics

At the bottom of the zone panel:
- **Total Area**: Sum of all zones in hectares
- **Active Zones**: Count of created zones

## Technical Details

### Map Configuration
- **Map Style**: `satellite-streets-v12` (satellite with labels)
- **Default Center**: Dubai, UAE (25.2048°N, 51.5074°E)
- **Default Zoom**: Level 15 (detailed view)
- **Drawing Tool**: Mapbox GL Draw

### Zone Properties
- **Type**: Polygon (closed shape)
- **Minimum Points**: 3
- **Fill Color**: 20% opacity with zone color
- **Stroke**: 3px width with zone color
- **Vertices**: White circles with colored border

### Area Calculation
- Measured in hectares (ha)
- 1 hectare = 10,000 square meters
- Calculations update in real-time
- Accurate using geographic coordinates

## UI Design

### Zone Panel (Left Side)
- **Width**: 1/4 of layout on desktop
- **Background**: White card with shadow
- **Border**: Rounded corners
- **Scroll**: Vertical overflow for many zones

### Map Container (Right Side)
- **Width**: 3/4 of layout on desktop
- **Height**: 600px
- **Border Radius**: Rounded bottom corners
- **Overlay**: Instructions panel at bottom

### Colors Used
- **Primary Green**: `#22c55e` - Drawing tools, selected state
- **Blue**: `#3b82f6` - Map icon
- **Gray**: `#e5e7eb` - Borders, backgrounds
- **Random Zone Colors**: Green, Blue, Yellow, Red, Purple, Pink

### Responsive Behavior
- **Desktop (lg+)**: 1/4 panel + 3/4 map side-by-side
- **Tablet**: Stacked layout with full-width components
- **Mobile**: Full-width, optimized touch controls

## Best Practices

### For Accurate Zones
1. Zoom in close to your actual field
2. Use satellite imagery to identify boundaries
3. Follow natural or constructed boundaries
4. Click points at corners and edges
5. Keep polygons simple and convex when possible

### For Performance
1. Limit zones to actual irrigation areas
2. Avoid creating hundreds of tiny zones
3. Use reasonable number of polygon vertices
4. Delete unused or test zones

### For Organization
1. Name zones descriptively (e.g., "North Field - Tomatoes")
2. Assign crops immediately after creation
3. Use consistent color schemes
4. Delete old/inactive zones regularly

## Troubleshooting

### Map Not Loading
- ✅ Check Mapbox token in `.env.local`
- ✅ Verify token is active in Mapbox dashboard
- ✅ Restart development server after adding token
- ✅ Check browser console for errors

### Drawing Not Working
- ✅ Click "Add New Zone" button first
- ✅ Ensure map has loaded completely
- ✅ Try refreshing the page
- ✅ Check that you're clicking on the map area

### Zones Not Saving
- ✅ Complete the polygon (double-click or Enter)
- ✅ Ensure polygon has at least 3 points
- ✅ Check browser console for errors
- ✅ Current version stores in memory (not persisted)

### Performance Issues
- ✅ Reduce number of zones if map is slow
- ✅ Close other browser tabs
- ✅ Try a different browser (Chrome recommended)
- ✅ Check internet connection for map tiles

## Future Enhancements

Planned features for the map:
- [ ] Backend persistence (save zones to database)
- [ ] Zone naming and editing dialog
- [ ] Crop assignment dropdown
- [ ] Import zones from GeoJSON files
- [ ] Export zones as KML/GeoJSON
- [ ] Soil type overlay
- [ ] Weather data overlay
- [ ] Historical satellite imagery
- [ ] 3D terrain view
- [ ] Measurement tools (distance, area)
- [ ] Zone comparison and analytics
- [ ] Print/export map views
- [ ] Share zone configurations
- [ ] Multi-farm support
- [ ] Zone templates and presets

## API Integration (Future)

When backend is ready, zones will include:
- Unique database IDs
- Timestamps (created, updated)
- User/farm associations
- Sensor connections
- Historical data
- Irrigation schedules
- Performance metrics

## Support Resources

- **Mapbox GL JS Docs**: https://docs.mapbox.com/mapbox-gl-js/
- **Mapbox Draw Docs**: https://github.com/mapbox/mapbox-gl-draw
- **React Map GL**: https://visgl.github.io/react-map-gl/
- **GeoJSON Spec**: https://geojson.org/

## Credits

Built with:
- Mapbox GL JS v3
- React Map GL
- Mapbox GL Draw
- Next.js 15
- TypeScript
- Tailwind CSS v4

---

**Version**: 1.0  
**Last Updated**: October 2025  
**Maintained by**: IRRISmart Development Team

