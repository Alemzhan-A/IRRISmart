"use client";

/**
 * iOS Notification Workaround
 *
 * IMPORTANT: iOS Safari does NOT support Web Push Notifications API
 * As of iOS 16.4+, Push API is only available for PWAs added to Home Screen
 *
 * This module provides in-app notification alternatives for iOS
 */

// Check if running on iOS
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Check if running as standalone PWA on iOS
export function isIOSPWA(): boolean {
  if (typeof window === 'undefined') return false;

  return isIOS() && 'standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true;
}

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;

  // iOS only supports notifications in PWA mode
  if (isIOS() && !isIOSPWA()) {
    return false;
  }

  return 'Notification' in window;
}

// Show in-app alert for iOS (fallback)
export function showIOSAlert(title: string, message: string, callback?: () => void) {
  if (typeof window === 'undefined') return;

  // Create custom in-app notification
  const notification = document.createElement('div');
  notification.className = 'ios-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      max-width: 90vw;
      min-width: 280px;
      animation: slideDown 0.3s ease-out;
    ">
      <div style="display: flex; align-items: start; gap: 12px;">
        <div style="
          width: 40px;
          height: 40px;
          background: #22c55e;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 15px; color: #1f2937; margin-bottom: 4px;">
            ${title}
          </div>
          <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
            ${message}
          </div>
        </div>
        <button onclick="this.closest('.ios-notification').remove()" style="
          background: none;
          border: none;
          font-size: 24px;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          margin-left: 8px;
        ">×</button>
      </div>
    </div>
    <style>
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
    </style>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);

  // Execute callback if provided
  if (callback) {
    notification.addEventListener('click', callback);
  }
}

// Unified notification function that works on iOS and other platforms
export function sendUniversalNotification(
  title: string,
  message: string,
  options?: { onClick?: () => void }
) {
  // If on iOS and not in PWA mode, use in-app alert
  if (isIOS() && !isIOSPWA()) {
    showIOSAlert(title, message, options?.onClick);
    return;
  }

  // Otherwise, try to use native notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: message,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
    });

    if (options?.onClick) {
      notification.onclick = options.onClick;
    }

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  } else {
    // Fallback to in-app alert
    showIOSAlert(title, message, options?.onClick);
  }
}

// Request permission with iOS-aware messaging
export async function requestUniversalNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // On iOS, explain PWA installation is required
  if (isIOS() && !isIOSPWA()) {
    showIOSAlert(
      'Notifications Not Available',
      'To receive notifications on iOS, please add this app to your Home Screen. Tap the Share button, then "Add to Home Screen".'
    );
    return false;
  }

  // Request permission normally
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}
