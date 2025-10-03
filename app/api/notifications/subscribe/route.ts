import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import PushSubscription from "@/lib/db/models/PushSubscription";
import { getAuthUser } from "@/lib/auth/middleware";

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint, keys, userAgent, deviceType } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if subscription already exists
    const existingSubscription = await PushSubscription.findOne({ endpoint });

    if (existingSubscription) {
      // Update userId if different (user logged in from different account)
      if (existingSubscription.userId !== authUser.userId) {
        existingSubscription.userId = authUser.userId;
        await existingSubscription.save();
      }

      return NextResponse.json({
        message: "Subscription already exists",
        subscription: existingSubscription,
      });
    }

    // Create new subscription
    const subscription = await PushSubscription.create({
      userId: authUser.userId,
      endpoint,
      keys,
      userAgent,
      deviceType,
    });

    return NextResponse.json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all subscriptions for current user
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const subscriptions = await PushSubscription.find({
      userId: authUser.userId,
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete subscription
export async function DELETE(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    await connectDB();

    await PushSubscription.deleteOne({
      endpoint,
      userId: authUser.userId,
    });

    return NextResponse.json({
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Delete subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
