import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { farmDatabase } from './data.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load policy synchronously
let safetyPolicy = {
    bannedSubstances: [],
    maxDosageGPerSqm: {},
    waterBodyBufferZoneMeters: {},
    cropRestrictions: {}
};
try {
    const policyPath = path.resolve(__dirname, '../config/chemical-policy.json');
    const fileContent = fs.readFileSync(policyPath, 'utf8');
    safetyPolicy = JSON.parse(fileContent);
    console.log("[SECURITY ENGINE] Safety policy loaded successfully.");
}
catch (error) {
    console.error("[SECURITY ENGINE] Failed to load safety policy, using defaults:", error);
}
/**
 * Validates input parameters for safety, sanitation, and types.
 * Helps prevent injection attempts and invalid parameter exploits.
 */
export function sanitizeAndValidateString(input, fieldName) {
    if (typeof input !== 'string') {
        throw new Error(`Validation Error: Field '${fieldName}' must be a string.`);
    }
    // Basic sanity cleaning - strip control characters, prevent basic shell injection characters
    const sanitized = input.replace(/[\x00-\x1F\x7F<>|;&$]/g, "").trim();
    if (sanitized.length === 0) {
        throw new Error(`Validation Error: Field '${fieldName}' cannot be empty.`);
    }
    if (sanitized.length > 100) {
        throw new Error(`Validation Error: Field '${fieldName}' exceeds maximum length of 100 characters.`);
    }
    return sanitized;
}
/**
 * Evaluates the safety of applying a substance in a given farm zone.
 * Implements policy-driven safe execution checks.
 */
export function evaluateChemicalSafety(zoneId, substance, dosage) {
    const normalizedSubstance = substance.toLowerCase().trim();
    const normalizedZone = zoneId.trim();
    // 1. Validate Zone exists
    const zone = farmDatabase.zones[normalizedZone];
    if (!zone) {
        return {
            approved: false,
            code: "ZONE_NOT_FOUND",
            reason: `Zone '${normalizedZone}' does not exist in agricultural records.`
        };
    }
    // 2. Validate dosage input
    if (isNaN(dosage) || dosage <= 0 || dosage > 1000) {
        return {
            approved: false,
            code: "INVALID_DOSAGE",
            reason: `Dosage must be a positive number less than 1000g/sqm.`
        };
    }
    // 3. Check for Banned Substances
    if (safetyPolicy.bannedSubstances.includes(normalizedSubstance)) {
        return {
            approved: false,
            code: "SUBSTANCE_BANNED",
            reason: `CRITICAL ACTION BLOCKED: Chemical '${substance}' is globally banned due to severe health and environmental hazards.`
        };
    }
    // 4. Check Crop Compatibility
    const crop = zone.cropType.toLowerCase();
    const restrictedCrops = safetyPolicy.cropRestrictions[normalizedSubstance];
    if (restrictedCrops && restrictedCrops.includes(crop)) {
        return {
            approved: false,
            code: "CROP_INCOMPATIBILITY",
            reason: `ACTION BLOCKED: Chemical '${substance}' is phytotoxic or forbidden for crop type '${crop}'.`
        };
    }
    // 5. Check Water Buffer Zone
    const distanceToWater = zone.distanceToWaterBodyMeters;
    const requiredBuffer = safetyPolicy.waterBodyBufferZoneMeters[normalizedSubstance];
    if (requiredBuffer !== undefined && distanceToWater < requiredBuffer) {
        return {
            approved: false,
            code: "WATER_BUFFER_VIOLATION",
            reason: `ECOLOGICAL ALERT: Application of '${substance}' in ${zoneId} is blocked. Zone is ${distanceToWater}m from water, but a minimum buffer of ${requiredBuffer}m is required to prevent aquatic contamination.`
        };
    }
    // 6. Check Max Allowed Dosage
    const maxDosage = safetyPolicy.maxDosageGPerSqm[normalizedSubstance];
    if (maxDosage !== undefined && dosage > maxDosage) {
        return {
            approved: false,
            code: "DOSAGE_LIMIT_EXCEEDED",
            reason: `OVERDOSAGE DETECTED: Proposed dosage of ${dosage}g/sqm exceeds the maximum safety limit of ${maxDosage}g/sqm for '${substance}'.`
        };
    }
    return {
        approved: true,
        code: "APPROVED",
        reason: `Validation passed: Chemical '${substance}' is cleared for application in ${zoneId}.`
    };
}
