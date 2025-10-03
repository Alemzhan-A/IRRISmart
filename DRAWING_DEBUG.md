# Drawing Debug Guide

## Step-by-Step Debugging

### 1. Check Your Mapbox Token

First, verify your Mapbox token is set:

```bash
# Check if .env.local exists
cat .env.local

# Should show:
# NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

If the file doesn't exist or the token is wrong:
1. Go to https://account.mapbox.com/access-tokens/
2. Copy your token (starts with `pk.`)
3. Create `.env.local` in project root:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_actual_token_here
   ```
4. Restart the dev server: `npm run dev`

### 2. Open Browser Console

1. Go to http://localhost:3000/map
2. Press **F12** (or Cmd+Option+I on Mac)
3. Click on the **Console** tab
4. Clear the console (trash icon or Cmd+K)

### 3. Test Drawing

1. Click the **"Add Zone"** button
2. Watch the console for these messages:

**Expected Console Output:**
```
Add zone clicked, current drawing mode: false
Draw ref exists: true
Drawing mode changed to: true
Changing to draw_polygon mode
Mode changed successfully
```

3. Try clicking on the map
4. Look for any error messages in RED

### 4. Common Issues & Solutions

#### Issue: "Mapbox Draw initialized" never appears
**Solution**: Token is wrong or not set
- Check `.env.local` file
- Verify token starts with `pk.`
- Restart dev server

#### Issue: "Draw ref exists: false"
**Solution**: Mapbox Draw didn't initialize
- Refresh the page
- Check console for initialization errors
- Verify map loaded successfully

#### Issue: Button turns green but can't draw
**Solution**: Mode change failed
- Look for "Error changing draw mode" in console
- Check if error mentions permissions or invalid mode
- Try refreshing the page

#### Issue: Can draw but modal doesn't open
**Solution**: Event not firing
- Look for "Draw create event fired" in console
- If you see it, check for "handleZoneCreate called"
- If missing, there's an event binding issue

#### Issue: Modal opens but zone not added
**Solution**: Store issue
- Look for "Creating zone:" in console
- Check if zone appears in the zones list
- Verify no errors after "Creating zone:"

### 5. Full Test Sequence

Run this test to verify everything works:

1. **Open Map Page**: http://localhost:3000/map
2. **Open Console**: F12 → Console tab
3. **Click "Add Zone"**: Should log 3-4 messages
4. **Click 4 points on map**: Creates a square
5. **Double-click**: Should log "Draw create event fired"
6. **Check for Modal**: Dialog should open
7. **Fill Form**: Enter crop and name
8. **Click Create**: Zone appears in list

### 6. Console Command Tests

Paste these in console to test manually:

```javascript
// Check if stores are working
console.log("Zone Store:", useZoneStore.getState())
console.log("Modal Store:", useModalStore.getState())

// Check if drawing mode can be set
useZoneStore.getState().setDrawingMode(true)
console.log("Drawing mode:", useZoneStore.getState().isDrawingMode)
```

### 7. Network Tab Check

1. Go to **Network** tab in DevTools
2. Filter by "mapbox"
3. Refresh page
4. Look for:
   - Map tile requests (should be green/200 status)
   - If red/401: Token is invalid
   - If red/403: Token lacks permissions

### 8. Manual Draw Test

If automatic drawing doesn't work, test manually:

```javascript
// In console:
const draw = document.querySelector('.mapboxgl-ctrl-group')?.__proto__
console.log("Draw control found:", !!draw)

// Try to get the draw instance
// If it exists, you should see methods like changeMode, add, delete
```

### 9. Verify Installation

Check if all packages are installed:

```bash
npm list | grep -E "(mapbox|zustand|turf)"

# Should show:
# ├── mapbox-gl@3.x.x
# ├── react-map-gl@8.x.x
# ├── @mapbox/mapbox-gl-draw@1.x.x
# ├── zustand@4.x.x
# └── @turf/turf@6.x.x
```

### 10. Last Resort: Clean Install

If nothing works:

```bash
# Stop dev server (Ctrl+C)
rm -rf node_modules .next
npm install
npm run dev
```

## Getting Help

If you're still stuck, provide:

1. **Console output** when clicking "Add Zone"
2. **Network tab** screenshot showing mapbox requests
3. **Error messages** (full text in RED)
4. **Browser and version**
5. **Node version**: `node -v`

## Quick Fixes

### Fix 1: Token Issues
```bash
echo "NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token" > .env.local
npm run dev
```

### Fix 2: Cache Issues  
```bash
rm -rf .next
npm run dev
```

### Fix 3: Reinstall Mapbox
```bash
npm uninstall mapbox-gl react-map-gl @mapbox/mapbox-gl-draw
npm install mapbox-gl@latest react-map-gl@latest @mapbox/mapbox-gl-draw@latest
npm run dev
```

## Success Indicators

✅ Map loads with satellite imagery
✅ "Mapbox Draw initialized" in console
✅ Button turns green when clicked
✅ Cursor changes to crosshair
✅ Can click points on map
✅ Points appear with green outline
✅ Double-click completes polygon
✅ Modal opens
✅ Zone appears in list

---

**Still not working?** Share your console output and I'll help debug!

