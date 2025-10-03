import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import connectDB from "@/lib/db/mongodb";
import PushSubscription from "@/lib/db/models/PushSubscription";
import { getAuthUser } from "@/lib/auth/middleware";

export async function POST(request: NextRequest) {
  try {
    // Configure web-push with VAPID keys
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL || "mailto:noreply@irrismart.com";

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        {
          error: "Push notifications not configured",
          message: "VAPID keys are missing"
        },
        { status: 503 }
      );
    }

    // Set VAPID details for this request
    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, targetUserId, icon, badge, tag } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get subscriptions for target user (or current user if not specified)
    const userId = targetUserId || authUser.userId;
    const subscriptions = await PushSubscription.find({ userId });

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: "No subscriptions found for user" },
        { status: 404 }
      );
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body: message,
      icon: icon || "/icon-192x192.png",
      badge: badge || "/icon-192x192.png",
      tag: tag || "general",
      data: {
        url: "/",
        timestamp: Date.now(),
      },
    });

    // Send to all user's subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
              },
            },
            payload
          );
          return { success: true, endpoint: subscription.endpoint };
        } catch (error) {
          console.error("Error sending to subscription:", error);

          // If subscription is invalid (410 Gone), delete it
          if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
            await PushSubscription.deleteOne({ _id: subscription._id });
          }

          return {
            success: false,
            endpoint: subscription.endpoint,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - successful;

    return NextResponse.json({
      message: "Notifications sent",
      stats: {
        total: subscriptions.length,
        successful,
failed,
      },
      results: results.map((r) =>
        r.status === "fulfilled" ? r.value : { success: false, error: r.reason }
      ),
    });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
