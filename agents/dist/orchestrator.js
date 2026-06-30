import { CropSoilAgent } from "./crop_soil.js";
import { PestDiseaseAgent } from "./pest_disease.js";
import { SafetyEnforcerAgent } from "./safety_enforcer.js";
export class AgriOrchestratorAgent {
    name = "AgriOrchestratorAgent";
    systemPrompt = `You are the primary AgriSustain Orchestrator. 
Your mandate is to coordinate a team of agricultural AI agents.
1. Receive questions from farmers.
2. Query zone telemetry using local tools.
3. Delegate soil issues to CropSoilAgent, and disease/pest issues to PestDiseaseAgent.
4. Run all specialist proposals through SafetyEnforcerAgent.
5. Provide a consolidated, safe response.`;
    cropSoilAgent = new CropSoilAgent();
    pestDiseaseAgent = new PestDiseaseAgent();
    safetyEnforcer = new SafetyEnforcerAgent();
    async runWorkflow(query, zoneId, zoneTelemetry, mcpValidateFn) {
        const trace = [];
        const normalizedQuery = query.toLowerCase();
        trace.push({
            step: "Ingest Query",
            agent: this.name,
            action: `Received query for zone ${zoneId}: "${query}"`,
            output: { zoneId, query }
        });
        trace.push({
            step: "Telemetry Fetch",
            agent: this.name,
            action: "Queried MCP database for zone sensor data.",
            output: zoneTelemetry
        });
        let cropSoilAdvice;
        let pestDiseaseAdvice;
        // Route to CropSoilAgent
        if (normalizedQuery.includes("soil") || normalizedQuery.includes("yellow") || normalizedQuery.includes("spot") || normalizedQuery.includes("water") || normalizedQuery.includes("ph") || normalizedQuery.includes("fertilizer")) {
            trace.push({
                step: "Delegate Crop & Soil Analysis",
                agent: this.name,
                action: "Delegating telemetry to CropSoilAgent.",
                output: null
            });
            cropSoilAdvice = this.cropSoilAgent.analyze({
                zoneId,
                telemetry: zoneTelemetry
            });
            trace.push({
                step: "Analyze Soil",
                agent: "CropSoilAgent",
                action: "Evaluated nutrient indicators.",
                output: cropSoilAdvice
            });
        }
        // Route to PestDiseaseAgent
        if (normalizedQuery.includes("pest") || normalizedQuery.includes("disease") || normalizedQuery.includes("yellow") || normalizedQuery.includes("spot") || normalizedQuery.includes("bug") || normalizedQuery.includes("mildew") || normalizedQuery.includes("pesticide") || normalizedQuery.includes("infestation")) {
            trace.push({
                step: "Delegate Disease Diagnosis",
                agent: this.name,
                action: "Delegating query to PestDiseaseAgent.",
                output: null
            });
            // Gather symptoms from query
            const symptoms = [];
            if (normalizedQuery.includes("yellow"))
                symptoms.push("yellow spots");
            if (normalizedQuery.includes("mildew"))
                symptoms.push("powdery mildew");
            if (normalizedQuery.includes("bug") || normalizedQuery.includes("aphid"))
                symptoms.push("aphids");
            pestDiseaseAdvice = this.pestDiseaseAgent.diagnose({
                zoneId,
                cropType: zoneTelemetry.cropType,
                symptoms: symptoms.length > 0 ? symptoms : ["general spots"]
            });
            trace.push({
                step: "Diagnose Plant Disease",
                agent: "PestDiseaseAgent",
                action: "Identified plant pathology indicators.",
                output: pestDiseaseAdvice
            });
        }
        // Determine substance proposals
        let proposedSubstance;
        let proposedDosage;
        let combinedRemedyDescription = "";
        if (pestDiseaseAdvice && pestDiseaseAdvice.substanceRequired) {
            proposedSubstance = pestDiseaseAdvice.substanceRequired;
            proposedDosage = pestDiseaseAdvice.dosageGPerSqm;
            combinedRemedyDescription = pestDiseaseAdvice.treatmentProposal;
        }
        else if (cropSoilAdvice && cropSoilAdvice.substanceRequired) {
            proposedSubstance = cropSoilAdvice.substanceRequired;
            proposedDosage = cropSoilAdvice.dosageGPerSqm;
            combinedRemedyDescription = cropSoilAdvice.proposedAction;
        }
        else {
            combinedRemedyDescription = [
                cropSoilAdvice?.proposedAction,
                pestDiseaseAdvice?.treatmentProposal
            ].filter(Boolean).join(" & ") || "No chemical treatments recommended. Standard crop monitoring advised.";
        }
        // Direct malicious query attempt (e.g. user manually trying to bypass or specify banned pesticide)
        if (normalizedQuery.includes("paraquat") || normalizedQuery.includes("ddt")) {
            proposedSubstance = normalizedQuery.includes("paraquat") ? "paraquat" : "ddt";
            proposedDosage = 50.0;
            combinedRemedyDescription = `User manually requested application of ${proposedSubstance}.`;
        }
        trace.push({
            step: "Safety Audit Gate",
            agent: this.name,
            action: "Forwarding treatment plan to SafetyEnforcerAgent for ecological compliance review.",
            output: { proposedSubstance, proposedDosage }
        });
        // Run Safety Audit
        const safetyAudit = this.safetyEnforcer.audit({
            zoneId,
            proposedSubstance,
            proposedDosage,
            specialistRecommendation: combinedRemedyDescription
        }, mcpValidateFn);
        trace.push({
            step: "Audit Compliance",
            agent: "SafetyEnforcerAgent",
            action: "Queried MCP safety limits and validated environment buffers.",
            output: safetyAudit
        });
        const finalAnswer = safetyAudit.finalRecommendation;
        trace.push({
            step: "Formulate Answer",
            agent: this.name,
            action: "Coordinated replies into final farmer response.",
            output: { finalAnswer }
        });
        return {
            query,
            zoneId,
            cropType: zoneTelemetry.cropType,
            cropSoilAdvice,
            pestDiseaseAdvice,
            safetyAudit,
            finalAnswer,
            trace
        };
    }
    getAgentMetadata() {
        return {
            name: this.name,
            prompt: this.systemPrompt,
            specialists: ["CropSoilAgent", "PestDiseaseAgent", "SafetyEnforcerAgent"]
        };
    }
}
