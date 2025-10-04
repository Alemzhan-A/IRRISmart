import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Field from "@/lib/db/models/Field";
import { getAuthUser } from "@/lib/auth/middleware";
import { z } from "zod";
import { getFieldColor, getFieldStatus } from "@/lib/constants/crop-categories";

const updateFieldSchema = z.object({
  name: z.string().min(1).optional(),
  crop: z.string().min(1).optional(),
  color: z.string().optional(),
  sensorData: z
    .object({
      moisture: z.number().min(0).max(100).optional(),
      temperature: z.number().optional(),
      salinity: z.number().min(0).optional(),
    })
    .optional(),
  irrigation: z
    .object({
      isActive: z.boolean().optional(),
      totalMinutes: z.number().min(0).optional(),
      remainingMinutes: z.number().min(0).optional(),
      flowRate: z.number().min(0).optional(),
    })
    .optional(),
});

// GET single field
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const field = await Field.findOne({
      _id: id,
      userId: authUser.userId,
    });

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    return NextResponse.json({ field });
  } catch (error) {
    console.error("Get field error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update field
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = updateFieldSchema.parse(body);

    await connectDB();

    // Get current field to check cropCategory
    const currentField = await Field.findOne({
      _id: id,
      userId: authUser.userId,
    });

    if (!currentField) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    // Merge sensor data and irrigation data
    const updatedSensorData = {
      ...currentField.sensorData,
      ...validatedData.sensorData,
    };

    const updatedIrrigation = {
      ...currentField.irrigation,
      ...validatedData.irrigation,
    };

    // Calculate new color based on status
    const status = getFieldStatus(
      currentField.cropCategory,
      {
        moisture: updatedSensorData.moisture,
        temperature: updatedSensorData.temperature,
        salinity: updatedSensorData.salinity,
      },
      updatedIrrigation.isActive
    );
    const color = getFieldColor(status);

    // Update field
    const field = await Field.findOneAndUpdate(
      { _id: id, userId: authUser.userId },
      {
        $set: {
          ...validatedData,
          color,
          ...(validatedData.sensorData && {
            "sensorData.lastUpdated": new Date(),
          }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Field updated successfully",
      field,
    });
  } catch (error) {
    console.error("Update field error:", error);

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

// DELETE field
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const field = await Field.findOneAndDelete({
      _id: id,
      userId: authUser.userId,
    });

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Field deleted successfully",
    });
  } catch (error) {
    console.error("Delete field error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

