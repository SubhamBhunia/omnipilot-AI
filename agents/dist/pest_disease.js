/**
 * Pest & Plant Disease Specialist Agent (PestDiseaseAgent)
 * Part of the AgriSustain ADK Multi-Agent Team.
 *
 * Mandate: Identify botanical diseases and pest infestations based on symptoms.
 * Propose effective biological or chemical remedies.
 */
export class PestDiseaseAgent {
    name = "PestDiseaseAgent";
    systemPrompt = `You are a Plant Pathologist and Entomologist.
Your role is to diagnose crop diseases and insect attacks based on physical symptoms.
Recommend targeted, eco-friendly pest control measures. When proposing a treatment,
clearly state the substance name and the exact dosage.`;
    diagnose(input) {
        const { cropType, symptoms } = input;
        let identifiedIssue = "Unknown Pathology";
        let treatmentProposal = "";
        let confidence = 0.5;
        let substanceRequired;
        let dosageGPerSqm;
        const lowerSymptoms = symptoms.map(s => s.toLowerCase());
        if (cropType.toLowerCase() === "tomato") {
            if (lowerSymptoms.some(s => s.includes("yellow") || s.includes("spot"))) {
                identifiedIssue = "Early Blight (Fungal Disease)";
                confidence = 0.85;
                treatmentProposal = "Early Blight is caused by Alternaria solani. Treat with copper-based organic fungicides or neem oil spray. Avoid overhead watering.";
                substanceRequired = "copper_sulfate";
                dosageGPerSqm = 2.0; // Proposed dose
            }
        }
        else if (cropType.toLowerCase() === "cucumber") {
            if (lowerSymptoms.some(s => s.includes("mildew") || s.includes("white"))) {
                identifiedIssue = "Powdery Mildew (Fungal Infection)";
                confidence = 0.9;
                treatmentProposal = "Powdery mildew forms a white powder on leaves. Treat with sulfur-based fungicides or bicarbonate sprays. Ensure plant spacing.";
                substanceRequired = "sulfur";
                dosageGPerSqm = 3.5;
            }
        }
        if (lowerSymptoms.some(s => s.includes("aphid") || s.includes("bug"))) {
            identifiedIssue = "Aphid Infestation";
            confidence = 0.95;
            treatmentProposal = "Aphids suck sap and transmit viruses. Introduce beneficial insects (ladybugs) or spray with neem oil solution.";
            substanceRequired = "neem_oil";
            dosageGPerSqm = 12.0;
        }
        if (identifiedIssue === "Unknown Pathology") {
            treatmentProposal = "Symptoms are inconclusive. Recommend physical crop inspection, crop rotation, and soil aeration as general hygiene.";
        }
        return {
            agentName: "PestDiseaseAgent",
            identifiedIssue,
            confidence,
            treatmentProposal,
            substanceRequired,
            dosageGPerSqm
        };
    }
    getAgentMetadata() {
        return {
            name: this.name,
            prompt: this.systemPrompt,
            capabilities: ["pathology_diagnosis", "pest_control_selection"]
        };
    }
}
