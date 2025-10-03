import mongoose, { Schema, Document, Model } from "mongoose";

export interface IField extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  crop: string;
  area: number;
  color: string;
  coordinates: number[][];
  sensorData: {
    moisture: number;
    temperature: number;
    salinity: number;
    lastUpdated: Date;
  };
  irrigation: {
    isActive: boolean;
    totalMinutes: number;
    remainingMinutes: number;
    flowRate: number; // L/min
    lastIrrigation?: Date;
    lastFertigation?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema = new Schema<IField>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Field name is required"],
      trim: true,
    },
    crop: {
      type: String,
      required: [true, "Crop type is required"],
      trim: true,
    },
    area: {
      type: Number,
      required: [true, "Area is required"],
      min: [0.1, "Area must be at least 0.1 hectares"],
    },
    color: {
      type: String,
      required: true,
      default: "#22c55e",
    },
    coordinates: {
      type: [[Number]],
      required: [true, "Coordinates are required"],
      validate: {
        validator: function (v: number[][]) {
          return v.length >= 3; // At least 3 points for a polygon
        },
        message: "Polygon must have at least 3 points",
      },
    },
    sensorData: {
      moisture: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      temperature: {
        type: Number,
        default: 20,
      },
      salinity: {
        type: Number,
        default: 0,
        min: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    irrigation: {
      isActive: {
        type: Boolean,
        default: false,
      },
      totalMinutes: {
        type: Number,
        default: 60,
        min: 0,
      },
      remainingMinutes: {
        type: Number,
        default: 0,
        min: 0,
      },
      flowRate: {
        type: Number,
        default: 2.5,
        min: 0,
      },
      lastIrrigation: {
        type: Date,
      },
      lastFertigation: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
FieldSchema.index({ userId: 1, createdAt: -1 });

// Prevent model recompilation in development
const Field: Model<IField> =
  mongoose.models.Field || mongoose.model<IField>("Field", FieldSchema);

export default Field;

