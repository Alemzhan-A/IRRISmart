export interface CropThresholds {
  temperature: {
    min: number;
    max: number;
    unit: string;
  };
  moisture: {
    min: number;
    max: number;
    unit: string;
  };
  salinity: {
    max: number;
    unit: string;
  };
}

export interface CropCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  thresholds: CropThresholds;
  examples: string[];
}

export const CROP_CATEGORIES: CropCategory[] = [
  {
    id: "fruits",
    name: "Fruits",
    emoji: "🍎",
    description: "Fruit trees and berry crops",
    thresholds: {
      temperature: { min: 15, max: 30, unit: "°C" },
      moisture: { min: 60, max: 80, unit: "%" },
      salinity: { max: 1.5, unit: "dS/m" },
    },
    examples: ["Apples", "Oranges", "Grapes", "Strawberries", "Blueberries"],
  },
  {
    id: "vegetables",
    name: "Vegetables",
    emoji: "🥬",
    description: "Leafy and root vegetables",
    thresholds: {
      temperature: { min: 10, max: 25, unit: "°C" },
      moisture: { min: 65, max: 85, unit: "%" },
      salinity: { max: 2.0, unit: "dS/m" },
    },
    examples: ["Tomatoes", "Lettuce", "Cucumbers", "Carrots", "Peppers"],
  },
  {
    id: "grains",
    name: "Grains & Cereals",
    emoji: "🌾",
    description: "Wheat, rice, and other grains",
    thresholds: {
      temperature: { min: 15, max: 35, unit: "°C" },
      moisture: { min: 50, max: 70, unit: "%" },
      salinity: { max: 2.5, unit: "dS/m" },
    },
    examples: ["Wheat", "Rice", "Corn", "Barley", "Oats"],
  },
  {
    id: "legumes",
    name: "Legumes",
    emoji: "🫘",
    description: "Beans, peas, and lentils",
    thresholds: {
      temperature: { min: 15, max: 28, unit: "°C" },
      moisture: { min: 55, max: 75, unit: "%" },
      salinity: { max: 2.0, unit: "dS/m" },
    },
    examples: ["Soybeans", "Chickpeas", "Lentils", "Green Beans", "Peas"],
  },
  {
    id: "nuts",
    name: "Nuts & Seeds",
    emoji: "🥜",
    description: "Nut trees and seed crops",
    thresholds: {
      temperature: { min: 18, max: 32, unit: "°C" },
      moisture: { min: 55, max: 70, unit: "%" },
      salinity: { max: 1.8, unit: "dS/m" },
    },
    examples: ["Almonds", "Walnuts", "Pistachios", "Sunflowers", "Hazelnuts"],
  },
  {
    id: "herbs",
    name: "Herbs & Spices",
    emoji: "🌿",
    description: "Culinary and medicinal herbs",
    thresholds: {
      temperature: { min: 12, max: 26, unit: "°C" },
      moisture: { min: 50, max: 70, unit: "%" },
      salinity: { max: 1.5, unit: "dS/m" },
    },
    examples: ["Basil", "Mint", "Rosemary", "Thyme", "Oregano"],
  },
  {
    id: "root_crops",
    name: "Root Crops",
    emoji: "🥔",
    description: "Potatoes, tubers, and root vegetables",
    thresholds: {
      temperature: { min: 10, max: 24, unit: "°C" },
      moisture: { min: 60, max: 80, unit: "%" },
      salinity: { max: 2.0, unit: "dS/m" },
    },
    examples: ["Potatoes", "Sweet Potatoes", "Beets", "Turnips", "Radishes"],
  },
  {
    id: "cotton",
    name: "Cotton & Fiber",
    emoji: "🌱",
    description: "Cotton and other fiber crops",
    thresholds: {
      temperature: { min: 20, max: 35, unit: "°C" },
      moisture: { min: 45, max: 65, unit: "%" },
      salinity: { max: 3.0, unit: "dS/m" },
    },
    examples: ["Cotton", "Flax", "Hemp", "Jute"],
  },
];

// Helper function to get field status based on thresholds
export function getFieldStatus(
  cropCategoryId: string,
  sensorData: {
    temperature: number;
    moisture: number;
    salinity: number;
  },
  isIrrigating: boolean
): "needs_irrigation" | "normal" | "irrigating" {
  if (isIrrigating) {
    return "irrigating";
  }

  const category = CROP_CATEGORIES.find((c) => c.id === cropCategoryId);
  if (!category) {
    return "normal";
  }

  const { temperature, moisture, salinity } = category.thresholds;

  // Check if any threshold is violated
  const temperatureOk =
    sensorData.temperature >= temperature.min &&
    sensorData.temperature <= temperature.max;
  const moistureOk =
    sensorData.moisture >= moisture.min &&
    sensorData.moisture <= moisture.max;
  const salinityOk = sensorData.salinity <= salinity.max;

  // If moisture is below minimum, needs irrigation (highest priority)
  if (sensorData.moisture < moisture.min) {
    return "needs_irrigation";
  }

  // If salinity is above maximum or temperature is out of range, needs attention (show as red)
  if (!salinityOk || !temperatureOk) {
    return "needs_irrigation";
  }

  // If all conditions are normal
  if (temperatureOk && moistureOk && salinityOk) {
    return "normal";
  }

  // If moisture is too high (above max), also needs attention
  if (!moistureOk) {
    return "needs_irrigation";
  }

  return "normal";
}

// Get color based on field status
export function getFieldColor(status: "needs_irrigation" | "normal" | "irrigating"): string {
  switch (status) {
    case "needs_irrigation":
      return "#ef4444"; // Red
    case "normal":
      return "#22c55e"; // Green
    case "irrigating":
      return "#f97316"; // Orange
    default:
      return "#22c55e";
  }
}
