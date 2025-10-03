# Zone Creation Guide

## How to Create Irrigation Zones

### Method 1: Full-Screen Map Page (Recommended)

1. **Navigate to Map Page**
   - Click "Map" in the sidebar
   - Or go to http://localhost:3000/map

2. **Start Drawing**
   - Click the **"Add Zone"** button (top-left)
   - Button turns green and shows "Drawing..."
   - Map cursor changes to crosshair

3. **Draw the Zone**
   - Click on the map to add points
   - Create a polygon by clicking at least 3 points
   - **Double-click** or press **Enter** to finish
   - **Escape** or click "Cancel" to abort

4. **Fill Zone Details**
   - A dialog opens automatically
   - Enter **Crop Type** (e.g., "Tomatoes", "Cucumbers")
   - Zone name auto-fills based on crop
   - Click **"Create Zone"**

5. **Zone Created!**
   - Zone appears in the zones list (right side)
   - Area is automatically calculated in hectares
   - Color is randomly assigned
   - Click on zones in the list to select them

### Method 2: Dashboard Embedded Map

1. **From Dashboard**
   - Scroll to "Farm Map" section
   - Click **"Add New Zone"** in the zone panel

2. **Follow same drawing steps** as Method 1

## Features

### Drawing Mode
- ✅ Visual feedback (green button, crosshair cursor)
- ✅ Click to add polygon points
- ✅ Double-click or Enter to complete
- ✅ Escape or Cancel button to abort
- ✅ On-screen instructions

### Zone Management
- ✅ View all zones in a list
- ✅ Select zones to highlight on map
- ✅ Delete zones with X button
- ✅ Automatic area calculations
- ✅ Color-coded for easy identification

### Validation
- ✅ Minimum area: 0.1 hectares (1,000 m²)
- ✅ Prevents creating tiny zones
- ✅ Alert if zone is too small

## Troubleshooting

### Map Not Loading
- ✅ Check `.env.local` has your Mapbox token
- ✅ Token format: `NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx...`
- ✅ Restart dev server after adding token

### Drawing Not Working
1. **Check Drawing Mode**: Button should be green showing "Drawing..."
2. **Check Console**: Open browser DevTools (F12) and check for errors
3. **Check Map Load**: Map should be fully loaded before drawing
4. **Try Refresh**: Refresh the page and try again

### Modal Not Opening
- ✅ Complete the polygon (double-click)
- ✅ Ensure zone meets minimum area (0.1 ha)
- ✅ Check browser console for errors

### Zones Not Saving
- Currently zones are stored in **browser memory** only
- Zones will reset on page refresh
- Backend integration needed for persistence

## Debug Mode

Open browser console (F12) to see:
- "Zone created:" - When polygon is drawn
- "Area: X hectares" - Calculated area
- "Opening modal with coordinates" - Modal opening
- "Creating zone:" - Zone being added to store

## Keyboard Shortcuts

- **Enter**: Complete polygon
- **Escape**: Cancel drawing
- **Double-click**: Complete polygon

## Best Practices

1. **Zoom In**: Get close to your actual field before drawing
2. **Follow Boundaries**: Use satellite imagery to trace real boundaries
3. **Avoid Overlaps**: Don't create overlapping zones
4. **Descriptive Names**: Use clear names like "North Field - Tomatoes"
5. **Regular Cleanup**: Delete test or unused zones

## Future Enhancements

- [ ] Backend persistence (save to database)
- [ ] Edit existing zones
- [ ] Import zones from GeoJSON/KML
- [ ] Export zones
- [ ] Zone analytics
- [ ] Multi-layer support
- [ ] Historical tracking

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Mapbox token is set
3. Try refreshing the page
4. Clear browser cache if needed

---

**Navigation**: 
- Dashboard: http://localhost:3000
- Full Map: http://localhost:3000/map

