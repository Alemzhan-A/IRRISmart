import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Field from "@/lib/db/models/Field";
import { getAuthUser } from "@/lib/auth/middleware";
import { z } from "zod";

const createFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  crop: z.string().min(1, "Crop type is required"),
  area: z.number().min(0.1, "Area must be at least 0.1 hectares"),
  color: z.string().default("#22c55e"),
  coordinates: z
    .array(z.array(z.number()))
    .min(3, "Polygon must have at least 3 points"),
});

// GET all fields for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const fields = await Field.find({ userId: authUser.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ fields });
  } catch (error: any) {
    console.error("Get fields error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new field
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = createFieldSchema.parse(body);

    await connectDB();

    // Create field
    const field = await Field.create({
      userId: authUser.userId,
      ...validatedData,
      sensorData: {
        moisture: Math.floor(Math.random() * 30 + 50), // 50-80%
        temperature: Math.floor(Math.random() * 10 + 20), // 20-30°C
        salinity: Math.random() * 1.5 + 0.5, // 0.5-2.0 dS/m
        lastUpdated: new Date(),
      },
      irrigation: {
        isActive: false,
        totalMinutes: 60,
        remainingMinutes: 0,
        flowRate: 2.5,
      },
    });

    return NextResponse.json(
      {
        message: "Field created successfully",
        field,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create field error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

