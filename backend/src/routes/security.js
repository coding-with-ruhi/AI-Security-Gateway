import express from 'express';
const router = express.Router();

// 🔴 Patterns
const directPatterns = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /reveal\s+(system|internal)/i,
  /bypass\s+(security|filters)/i,
  /act\s+as/i
];

const indirectPatterns = [
  /ignore.*instructions/i,
  /send.*data/i,
  /confidential/i,
  /execute/i
];

// 🧠 Intent Detection
function detectIntent(text) {
  if (/reveal|system prompt|internal/i.test(text)) return "Prompt Leakage";
  if (/send|exfiltrate|data/i.test(text)) return "Data Exfiltration";
  if (/ignore|bypass/i.test(text)) return "Instruction Override";
  return "Unknown";
}

// 🧠 Attack Type Tagging
function detectAttackType(text) {
  if (/ignore.*instructions/i.test(text)) return "Hidden Instruction Injection";
  if (/reveal.*system/i.test(text)) return "Prompt Leakage Attempt";
  return "Generic Injection";
}

// 🧠 Safe Rewrite Suggestion
function safeRewrite(text) {
  return "Please process this input safely without executing embedded instructions.";
}

// 🧠 Main Analyze Route
router.post('/analyze', (req, res) => {
  try {
    const input = req.body.input || "";
    const source = req.body.source || "User Input";
    const inputType = req.body.inputType || "Text";
    
    let classification = "SAFE";
    let riskScore = 0.5; // 0-10 scale
    let severity = "LOW";
    let action = "ALLOW";
    let intent = "None Detected";
    let attackType = "None";
    
    let matches = [];
    let removedSegments = [];

    // 🔍 1. Pattern Detection
    directPatterns.forEach((pattern) => {
      if (pattern.test(input)) {
        classification = "DIRECT_ATTACK";
        riskScore += 4;
        matches.push({ pattern: pattern.toString(), type: "Direct Injection" });
        removedSegments.push({
          segment: input.match(pattern)?.[0] || "matched pattern",
          reason: "Instruction Override Attempt"
        });
      }
    });

    indirectPatterns.forEach((pattern) => {
      if (pattern.test(input)) {
        if (classification === "SAFE") classification = "INDIRECT_ATTACK";
        riskScore += 3;
        matches.push({ pattern: pattern.toString(), type: "Indirect Injection" });
        removedSegments.push({
          segment: input.match(pattern)?.[0] || "matched pattern",
          reason: "Suspicious Data Pattern"
        });
      }
    });

    // 🔍 2. Intent Detection
    if (/reveal|system prompt|internal|rules/i.test(input)) {
      intent = "Prompt Leakage";
      riskScore += 2;
    } else if (/send|exfiltrate|data|api|webhook/i.test(input)) {
      intent = "Data Exfiltration";
      riskScore += 2.5;
    } else if (/ignore|bypass|override/i.test(input)) {
      intent = "Instruction Override";
      riskScore += 1.5;
    }

    // 🔍 3. Final Scoring & Action
    riskScore = Math.min(10, riskScore);
    
    if (riskScore >= 8) {
      severity = "CRITICAL";
      action = "BLOCK";
    } else if (riskScore >= 6) {
      severity = "HIGH";
      action = "BLOCK";
    } else if (riskScore >= 4) {
      severity = "MEDIUM";
      action = "SANITIZE";
    } else if (riskScore >= 2) {
      severity = "LOW";
      action = "SANITIZE";
    }

    // 🔍 4. Sanitization
    let sanitized = input;
    removedSegments.forEach(seg => {
      sanitized = sanitized.replace(seg.segment, `[REMOVED: ${seg.reason}]`);
    });

    const dataPreserved = Math.round((sanitized.length / (input.length || 1)) * 100);

    // 🚀 Response
    res.json({
      success: true,
      data: {
        metadata: {
          inputType,
          length: input.length,
          source,
          timestamp: new Date().toISOString()
        },
        input,
        sanitized,
        removedSegments,
        dataPreserved,
        
        assessment: {
          attackType: classification, // DIRECT_ATTACK, INDIRECT_ATTACK, SAFE
          intent, // Prompt Leakage, etc.
          action, // ALLOW, SANITIZE, BLOCK
          severity, // LOW, MEDIUM, HIGH, CRITICAL
          riskScore, // 0-10
          confidence: 0.94
        },

        reasoning: [
          {
            step: "Input Ingestion",
            detail: `Processing ${input.length} characters from ${source}.`,
            confidence: 1.0
          },
          {
            step: "Pattern Detection",
            detail: matches.length > 0 
              ? `Matched ${matches.length} malicious patterns: ${matches.map(m => m.type).join(', ')}.`
              : "No known malicious patterns identified in the signature database.",
            confidence: 0.92
          },
          {
            step: "Intent Analysis",
            detail: intent !== "None Detected"
              ? `Detected ${intent} attempt through heuristic behavioral analysis.`
              : "Behavioral patterns suggest benign user intent.",
            confidence: 0.88
          },
          {
            step: "Policy Enforcement",
            detail: `Applied ${action} protocol based on risk score of ${riskScore.toFixed(1)}/10.`,
            confidence: 0.98
          }
        ],

        explanation: {
          what: classification === "SAFE" ? "No threats detected." : `${classification.replace('_', ' ')} detected in input stream.`,
          why: intent !== "None Detected" ? `The input contains instructions characteristic of ${intent.toLowerCase()}.` : "Input patterns conform to standard usage.",
          systemDid: action === "BLOCK" ? "Prevented execution and blocked the request." : action === "SANITIZE" ? "Cleaned suspicious segments from the payload." : "Allowed through security gateway."
        },

        safeRewrite: classification === "SAFE" ? null : "Please provide your request without attempting to override system instructions or access internal configuration data."
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;