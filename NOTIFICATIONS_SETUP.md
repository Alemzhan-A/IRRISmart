# 🔔 Push Notifications Setup Guide

## Overview

IRRISmart supports push notifications for low moisture alerts and irrigation updates.

## 📱 For iOS (iPhone/iPad)

### Requirements
1. **iOS 16.4 or later** (push notifications for PWAs)
2. **Safari browser**
3. **App installed as PWA** (Add to Home Screen)

### Setup Steps

#### 1. Install as PWA on iPhone/iPad

1. Open Safari and go to your IRRISmart app
2. Tap the **Share button** (box with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top right
5. The app icon will appear on your home screen

#### 2. Enable Notifications

1. Open IRRISmart from your **Home Screen** (not Safari)
2. Go to **Settings** (gear icon in sidebar)
3. Scroll to **Notification Preferences** section
4. Click **"Enable Notifications"** button
5. When prompted, tap **"Allow"** to grant permission

#### 3. Test Notification

1. In the same section, click **"Low Moisture Alert"** button
2. You should see a notification appear!

### Important Notes for iOS

- ⚠️ **Must be launched from Home Screen** - Notifications only work when the app is installed as PWA
- ⚠️ **Safari only** - Chrome and other browsers don't support PWA notifications on iOS
- ⚠️ **iOS 16.4+** - Older versions don't support push notifications for web apps
- ✅ Works in background - You'll get notifications even when the app is closed

## 🖥️ For Desktop (Mac/Windows/Linux)

### Setup Steps

1. Open IRRISmart in **Chrome, Edge, or Firefox**
2. Go to **Settings**
3. Click **"Enable Notifications"**
4. When prompted, click **"Allow"**
5. Click **"Low Moisture Alert"** to test

### Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (Mac)
- ❌ Internet Explorer

## 📱 For Android

### Setup Steps

1. Open IRRISmart in **Chrome**
2. Tap menu (3 dots) → **"Install app"** or **"Add to Home screen"**
3. Open the installed app
4. Go to **Settings**
5. Click **"Enable Notifications"**
6. Tap **"Allow"** when prompted
7. Click **"Low Moisture Alert"** to test

## 🔧 Notification Types

### Currently Available

1. **Low Moisture Alert**
   - Triggered when soil moisture drops below threshold
   - Shows field name and current moisture level
   - Recommended action: Start irrigation

### Coming Soon

2. **Irrigation Complete**
   - Notifies when irrigation cycle finishes
   
3. **High Temperature Alert**
   - Warns about extreme heat conditions

4. **Fertigation Reminders**
   - Scheduled fertilizer application alerts

## 🎯 Using the Test Button

The **"Low Moisture Alert"** button in Settings sends a test notification:

```
⚠️ Low Moisture Alert
North Field moisture level is at 35%. Irrigation recommended.
```

This helps you verify that notifications are working correctly.

## 🛠️ Troubleshooting

### Notifications Not Working?

**Check Permission:**
1. Go to device Settings
2. Find IRRISmart app
3. Check that Notifications are enabled

**iOS Specific:**
- Make sure you opened the app from Home Screen (not Safari)
- iOS version must be 16.4 or newer
- Try removing and re-adding the app to Home Screen

**Desktop Specific:**
- Check browser notification settings
- Make sure the site has permission
- Check that browser notifications aren't blocked

### Reset Notifications

**iOS:**
1. Settings → IRRISmart → Notifications → Toggle off/on

**Desktop:**
1. Browser settings → Site settings → Notifications
2. Find your site and reset permission

**Android:**
1. Settings → Apps → IRRISmart → Notifications → Toggle off/on

## 📝 Privacy & Permissions

- ✅ Notifications are sent directly from your device
- ✅ No data is sent to external servers
- ✅ You can disable notifications anytime in Settings
- ✅ No personal information is included in notifications

## 🔐 Security

- Notifications use the Web Push API standard
- Encrypted end-to-end
- No third-party services involved
- Fully GDPR compliant

## 💡 Tips

1. **Test First:** Always test notifications after enabling to ensure they work
2. **iOS Users:** Must install as PWA for notifications to work
3. **Background:** Notifications work even when app is closed
4. **Quiet Hours:** iOS respects your device's "Do Not Disturb" settings
5. **Battery:** Notifications have minimal impact on battery life

## 🚀 Next Steps

After enabling notifications:

1. Set your moisture thresholds in Settings
2. Configure irrigation schedules
3. Add your fields on the Map
4. Notifications will trigger automatically based on sensor data

---

**Need Help?** Visit the Help page or contact support@irrismart.com

