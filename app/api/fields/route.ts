import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Field from "@/lib/db/models/Field";
import { getAuthUser } from "@/lib/auth/middleware";
import { z } from "zod";
import { getFieldColor, getFieldStatus, CROP_CATEGORIES } from "@/lib/constants/crop-categories";

const createFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  crop: z.string().min(1, "Crop type is required"),
  cropCategory: z.string().min(1, "Crop category is required"),
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

    // Update colors based on current status
    const fieldsWithUpdatedColors = fields.map((field) => {
      const status = getFieldStatus(
        field.cropCategory,
        {
          moisture: field.sensorData.moisture,
          temperature: field.sensorData.temperature,
          salinity: field.sensorData.salinity,
        },
        field.irrigation.isActive
      );
      const color = getFieldColor(status);

      // Update color if different
      if (field.color !== color) {
        field.color = color;
        field.save();
      }

      return field;
    });

    return NextResponse.json({ fields: fieldsWithUpdatedColors });
  } catch (error) {
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

    // Generate sensor data within optimal range to ensure green color
    // Get the crop category thresholds
    const category = CROP_CATEGORIES.find(
      (c) => c.id === validatedData.cropCategory
    );

    // Generate sensor data within optimal thresholds
    const sensorData = category
      ? {
          // Moisture in the middle of the optimal range
          moisture: Math.floor(
            (category.thresholds.moisture.min + category.thresholds.moisture.max) / 2 +
            Math.random() * 5 - 2.5 // Add slight variation ±2.5%
          ),
          // Temperature in the middle of the optimal range
          temperature: Math.floor(
            (category.thresholds.temperature.min + category.thresholds.temperature.max) / 2 +
            Math.random() * 4 - 2 // Add slight variation ±2°C
          ),
          // Salinity well below the max
          salinity: category.thresholds.salinity.max * 0.5, // 50% of max
          lastUpdated: new Date(),
        }
      : {
          moisture: 70, // Safe default
          temperature: 22, // Safe default
          salinity: 1.0, // Safe default
          lastUpdated: new Date(),
        };

    const irrigation = {
      isActive: false,
      totalMinutes: 60,
      remainingMinutes: 0,
      flowRate: 2.5,
    };

    // Color will always be green for new fields (not irrigating, optimal conditions)
    const color = "#22c55e"; // Green

    // Create field
    const field = await Field.create({
      userId: authUser.userId,
      ...validatedData,
      color,
      sensorData,
      irrigation,
    });

    return NextResponse.json(
      {
        message: "Field created successfully",
        field,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create field error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

