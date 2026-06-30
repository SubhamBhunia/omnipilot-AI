/**
 * Crop & Soil Specialist Agent (CropSoilAgent)
 * Part of the AgriSustain ADK Multi-Agent Team.
 * 
 * Mandate: Analyze soil telemetry reports and crop metrics. Recommend soil enhancements,
 * watering changes, or nutritional supplements.
 */

export interface SoilAnalysisInput {
  zoneId: string;
  telemetry: {
    cropType: string;
    soilPH: number;
    moisturePercentage: number;
    nitrogenLevel: number;
    phosphorusLevel: number;
    potassiumLevel: number;
    distanceToWaterBodyMeters: number;
  };
}

export interface SoilRecommendation {
  agentName: "CropSoilAgent";
  diagnosis: string;
  proposedAction: string;
  substanceRequired?: string;
  dosageGPerSqm?: number;
}

export class CropSoilAgent {
  private name = "CropSoilAgent";
  private systemPrompt = `You are an expert Agronomist and Soil Scientist. 
Your role is to diagnose nutrient deficiencies (Nitrogen N, Phosphorus P, Potassium K), 
pH imbalances, and irrigation issues using sensor telemetry data. 
Always suggest organic remedies first. If chemical fertilizers are recommended, state the chemical name and dosage explicitly.`;

  public analyze(input: SoilAnalysisInput): SoilRecommendation {
    const { zoneId, telemetry } = input;
    let diagnosis = "";
    let proposedAction = "";
    let substanceRequired: string | undefined;
    let dosageGPerSqm: number | undefined;

    // Check pH limits
    if (telemetry.soilPH < 6.0) {
      diagnosis += `Acidic soil (pH ${telemetry.soilPH}) is limiting nutrient uptake. `;
      proposedAction += "Apply agricultural lime (calcium carbonate) to raise pH. ";
    } else if (telemetry.soilPH > 7.5) {
      diagnosis += `Alkaline soil (pH ${telemetry.soilPH}) detected. `;
      proposedAction += "Apply elemental sulfur to lower pH. ";
      substanceRequired = "sulfur";
      dosageGPerSqm = 4.0;
    }

    // Check moisture
    if (telemetry.moisturePercentage < 40) {
      diagnosis += `Low moisture (${telemetry.moisturePercentage}%) indicates drought stress. `;
      proposedAction += "Increase irrigation cycle by 20% or set up drip irrigation. ";
    }

    // Check Nitrogen
    if (telemetry.nitrogenLevel < 50) {
      diagnosis += `Nitrogen deficiency (${telemetry.nitrogenLevel} mg/kg) detected. `;
      proposedAction += "Recommend organic compost or a light application of nitrogen fertilizer. ";
      substanceRequired = "neem_oil"; // organic nitrogen source
      dosageGPerSqm = 10.0;
    }

    if (!diagnosis) {
      diagnosis = "Soil nutrient levels, moisture, and pH are within normal parameters.";
      proposedAction = "Continue current soil management routine.";
    }

    return {
      agentName: "CropSoilAgent",
      diagnosis,
      proposedAction,
      substanceRequired,
      dosageGPerSqm
    };
  }

  public getAgentMetadata() {
    return {
      name: this.name,
      prompt: this.systemPrompt,
      capabilities: ["soil_analysis", "nutrient_remediation"]
    };
  }
}
