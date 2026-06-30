export interface ZoneTelemetry {
  zoneId: string;
  cropType: string;
  soilPH: number;
  moisturePercentage: number;
  nitrogenLevel: number; // mg/kg
  phosphorusLevel: number; // mg/kg
  potassiumLevel: number; // mg/kg
  distanceToWaterBodyMeters: number;
  lastTreatmentDate: string;
  activeIssues: string[];
}

export interface TreatmentRecord {
  zoneId: string;
  substance: string;
  dosageGPerSqm: number;
  date: string;
  status: "APPROVED" | "BLOCKED";
  reason?: string;
}

export const farmDatabase: {
  zones: Record<string, ZoneTelemetry>;
  treatmentLogs: TreatmentRecord[];
} = {
  zones: {
    "Zone-A": {
      zoneId: "Zone-A",
      cropType: "tomato",
      soilPH: 6.2,
      moisturePercentage: 42,
      nitrogenLevel: 45,
      phosphorusLevel: 32,
      potassiumLevel: 180,
      distanceToWaterBodyMeters: 55,
      lastTreatmentDate: "2026-06-15",
      activeIssues: ["yellow_leaf_spots"]
    },
    "Zone-B": {
      zoneId: "Zone-B",
      cropType: "cucumber",
      soilPH: 5.8,
      moisturePercentage: 35,
      nitrogenLevel: 38,
      phosphorusLevel: 25,
      potassiumLevel: 140,
      distanceToWaterBodyMeters: 8, // Very close to a water stream!
      lastTreatmentDate: "2026-06-10",
      activeIssues: ["mildew"]
    },
    "Zone-C": {
      zoneId: "Zone-C",
      cropType: "maize",
      soilPH: 6.8,
      moisturePercentage: 60,
      nitrogenLevel: 90,
      phosphorusLevel: 40,
      potassiumLevel: 210,
      distanceToWaterBodyMeters: 120,
      lastTreatmentDate: "2026-06-01",
      activeIssues: []
    }
  },
  treatmentLogs: []
};
