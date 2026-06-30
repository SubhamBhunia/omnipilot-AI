import { farmDatabase, TreatmentRecord } from './data.js';
import { sanitizeAndValidateString, evaluateChemicalSafety } from './security.js';

export const TOOLS_LIST = [
  {
    name: "get_soil_telemetry",
    description: "Get current soil conditions (NPK levels, pH, moisture, crop type) and water body proximity for a specific farm zone.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "The identifier of the zone (e.g., 'Zone-A', 'Zone-B', 'Zone-C')"
        }
      },
      required: ["zoneId"]
    }
  },
  {
    name: "propose_treatment",
    description: "Propose a crop disease or pest treatment (chemical or organic) for safety clearance and logging.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "Target zone for chemical or organic treatment"
        },
        substance: {
          type: "string",
          description: "Name of pesticide, fertilizer, or organic alternative (e.g., 'copper_sulfate', 'neem_oil', 'sulfur')"
        },
        dosageGPerSqm: {
          type: "number",
          description: "Proposed dosage in grams per square meter"
        }
      },
      required: ["zoneId", "substance", "dosageGPerSqm"]
    }
  },
  {
    name: "get_safety_logs",
    description: "Retrieve historical security validation logs and treatment audit trails.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

export function handleToolExecution(name: string, args: any) {
  console.log(`[MCP ENGINE] Tool Execution Request: ${name}`, args);

  switch (name) {
    case "get_soil_telemetry": {
      const rawZoneId = args.zoneId;
      const zoneId = sanitizeAndValidateString(rawZoneId, "zoneId");
      
      const zoneData = farmDatabase.zones[zoneId];
      if (!zoneData) {
        throw new Error(`Execution Failed: Zone '${zoneId}' not found.`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(zoneData, null, 2)
          }
        ]
      };
    }

    case "propose_treatment": {
      const rawZoneId = args.zoneId;
      const rawSubstance = args.substance;
      const rawDosage = args.dosageGPerSqm;

      // 1. Input Validation (Type & Sanitation)
      const zoneId = sanitizeAndValidateString(rawZoneId, "zoneId");
      const substance = sanitizeAndValidateString(rawSubstance, "substance");
      if (typeof rawDosage !== 'number') {
        throw new Error("Validation Error: Field 'dosageGPerSqm' must be a number.");
      }

      // 2. Safe Execution Policy Verification
      const safetyResult = evaluateChemicalSafety(zoneId, substance, rawDosage);

      // 3. Update Database Logs
      const record: TreatmentRecord = {
        zoneId,
        substance,
        dosageGPerSqm: rawDosage,
        date: new Date().toISOString().split('T')[0],
        status: safetyResult.approved ? "APPROVED" : "BLOCKED",
        reason: safetyResult.reason
      };
      
      farmDatabase.treatmentLogs.push(record);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: record.status,
              code: safetyResult.code,
              reason: record.reason,
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }

    case "get_safety_logs": {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(farmDatabase.treatmentLogs, null, 2)
          }
        ]
      };
    }

    default:
      throw new Error(`Tool not found: ${name}`);
  }
}
