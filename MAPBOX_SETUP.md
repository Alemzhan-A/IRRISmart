# Mapbox Setup Guide

## Getting Your Mapbox Token

1. **Create a Mapbox Account**
   - Go to [mapbox.com](https://www.mapbox.com/)
   - Sign up for a free account

2. **Get Your Access Token**
   - After signing in, go to [Account > Access Tokens](https://account.mapbox.com/access-tokens/)
   - Copy your "Default public token" or create a new one

3. **Add Token to Your Project**
   
   Create a file named `.env.local` in the project root:
   
   ```bash
   # .env.local
   NEXT_PUBLIC_MAPBOX_TOKEN=your_actual_token_here
   ```

   Replace `your_actual_token_here` with your Mapbox token.

4. **Restart Development Server**
   
   ```bash
   npm run dev
   ```

## Map Features

The Zone Map component provides:

- ✅ **Interactive Map**: Satellite view with street overlays
- ✅ **Draw Zones**: Click "Add New Zone" to draw irrigation zones
- ✅ **Select Zones**: Click on zones in the list to highlight them
- ✅ **Edit Zones**: Modify zone boundaries by dragging points
- ✅ **Delete Zones**: Remove zones using the trash icon
- ✅ **Zone Info**: View area, crop type, and other details
- ✅ **Navigation Controls**: Zoom, rotate, and locate your position
- ✅ **Real-time Updates**: All changes are reflected immediately

## Map Controls

- **Add New Zone**: Click the button to start drawing
- **Draw**: Click points on the map to create a polygon
- **Complete**: Double-click or press Enter to finish drawing
- **Edit**: Select a zone and drag the points to modify
- **Delete**: Click the trash icon next to a zone
- **Navigate**: Use mouse/trackpad to pan and zoom

## Customization

The map is configured for agricultural use with:
- Satellite imagery for accurate land visualization
- Custom styling for drawn zones
- Color-coded zones for easy identification
- Area calculations in hectares

## Troubleshooting

**Map not loading?**
- Check that your Mapbox token is correct
- Ensure `.env.local` file exists in the root directory
- Restart the development server after adding the token

**Drawing not working?**
- Click the "Add New Zone" button first
- Make sure you're in polygon drawing mode
- Click at least 3 points to create a valid zone

**Need help?**
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Draw Documentation](https://github.com/mapbox/mapbox-gl-draw)

---

**Free Tier Limits**: Mapbox free tier includes 50,000 map loads per month, which should be sufficient for development and small deployments.

