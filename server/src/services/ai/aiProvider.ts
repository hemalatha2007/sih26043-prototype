import { CONTROLLED_DOMAINS, DomainCategory, SYSTEM_PROMPT } from "./prompts";

export interface AIAnalysisResult {
  primaryDomain: DomainCategory;
  confidence: number;
  summary: string;
  requiredExpertise: string[];
  extractedTags: string[];
}

/**
 * Deterministic NLP classifier acting as safe local fallback when external LLM API is unavailable.
 */
function localRuleBasedClassifier(text: string, suggestedDomain?: string): AIAnalysisResult {
  const lower = text.toLowerCase();

  let matchedDomain: DomainCategory = "OTHER";
  let confidence = 0.88;
  const tags = new Set<string>();
  const expertise = new Set<string>();

  if (/flood|monsoon|rain|drainage|landslide|cyclone|evacuation|disaster|early warning/i.test(lower)) {
    matchedDomain = "DISASTER_MANAGEMENT";
    confidence = 0.94;
    tags.add("Flood Monitoring");
    tags.add("Early Warning Systems");
    expertise.add("IoT");
    expertise.add("GIS");
    expertise.add("Civil Engineering");
  } else if (/farm|soil|crop|irrigation|agri|agriculture|harvest/i.test(lower)) {
    matchedDomain = "AGRICULTURE";
    confidence = 0.92;
    tags.add("AgriTech");
    tags.add("Soil Sensors");
    expertise.add("AgriTech");
    expertise.add("Sensors");
    expertise.add("Data Analytics");
  } else if (/water|effluent|sanitation|sewage|handpump|drain|clean water/i.test(lower)) {
    matchedDomain = "WATER_MANAGEMENT";
    confidence = 0.91;
    tags.add("Water Quality");
    tags.add("Effluent Monitoring");
    expertise.add("Sensors");
    expertise.add("IoT");
    expertise.add("Environmental Science");
  } else if (/health|patient|clinical|medical|hospital|clinic|doctor|disease/i.test(lower)) {
    matchedDomain = "HEALTHCARE";
    confidence = 0.93;
    tags.add("HealthTech");
    tags.add("Patient Monitoring");
    expertise.add("HealthTech");
    expertise.add("Machine Learning");
  } else if (/school|student|teacher|education|learn|literacy/i.test(lower)) {
    matchedDomain = "EDUCATION";
    confidence = 0.90;
    tags.add("EdTech");
    tags.add("Digital Literacy");
    expertise.add("Web Dev");
    expertise.add("Data Analytics");
  } else if (/traffic|city|road|bridge|street|urban|building/i.test(lower)) {
    matchedDomain = "URBAN_DEVELOPMENT";
    confidence = 0.89;
    tags.add("Smart Infrastructure");
    tags.add("Urban Transit");
    expertise.add("Civil Engineering");
    expertise.add("Embedded Systems");
  } else if (suggestedDomain && CONTROLLED_DOMAINS.includes(suggestedDomain.toUpperCase() as DomainCategory)) {
    matchedDomain = suggestedDomain.toUpperCase() as DomainCategory;
    confidence = 0.85;
  }

  if (/iot|sensor|microcontroller/i.test(lower)) {
    expertise.add("IoT");
    tags.add("IoT");
  }
  if (/machine learning|ml|predictive|ai/i.test(lower)) {
    expertise.add("Machine Learning");
    tags.add("Machine Learning");
  }
  if (/cloud|server|database/i.test(lower)) {
    expertise.add("Cloud Computing");
    tags.add("Cloud Computing");
  }

  const summary = text.length > 140 ? text.substring(0, 137) + "..." : text;

  return {
    primaryDomain: matchedDomain,
    confidence,
    summary: `AI Problem Summary: ${summary}`,
    requiredExpertise: Array.from(expertise).length > 0 ? Array.from(expertise) : ["Domain Engineering", "Data Analytics"],
    extractedTags: Array.from(tags).length > 0 ? Array.from(tags) : ["Societal Innovation"],
  };
}

/**
 * Executes LLM Provider call with automatic fallback handling.
 */
export async function callAIProvider(
  title: string,
  description: string,
  suggestedDomain?: string
): Promise<AIAnalysisResult> {
  const provider = (process.env.AI_PROVIDER || "LOCAL").toUpperCase();
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey || provider === "LOCAL") {
    console.log("[AI ENGINE] Running deterministic NLP AI problem understanding fallback...");
    return localRuleBasedClassifier(`${title}: ${description}`, suggestedDomain);
  }

  try {
    const prompt = `Title: ${title}\nDescription: ${description}\nSuggested Domain: ${suggestedDomain || "None"}`;

    if (provider === "GROQ" || provider === "OPENAI") {
      const endpoint =
        provider === "GROQ"
          ? "https://api.groq.com/openai/v1/chat/completions"
          : "https://api.openai.com/v1/chat/completions";

      const defaultModel = provider === "GROQ" ? "llama-3.3-70b-versatile" : "gpt-3.5-turbo";
      const model = process.env.AI_MODEL || defaultModel;

      console.log(`[AI ENGINE] Calling ${provider} API (${model})...`);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[AI ENGINE] ${provider} API error (${res.status}):`, errorText);
        throw new Error(`${provider} API error: ${res.statusText}`);
      }

      const data: any = await res.json();
      const contentStr = data?.choices?.[0]?.message?.content;
      if (contentStr) {
        const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : contentStr;
        const parsed = JSON.parse(jsonText);
        return sanitizeAIOutput(parsed);
      }
    }
  } catch (err: any) {
    console.warn("[AI ENGINE] External LLM API failed, utilizing fallback classifier:", err.message);
  }

  return localRuleBasedClassifier(`${title}: ${description}`, suggestedDomain);
}

function sanitizeAIOutput(raw: any): AIAnalysisResult {
  const domain = (raw.primaryDomain || "OTHER").toUpperCase();
  const primaryDomain: DomainCategory = CONTROLLED_DOMAINS.includes(domain as DomainCategory)
    ? (domain as DomainCategory)
    : "OTHER";

  return {
    primaryDomain,
    confidence: typeof raw.confidence === "number" ? Math.min(Math.max(raw.confidence, 0.5), 1.0) : 0.94,
    summary: raw.summary || "Problem statement analyzed by AI classifier.",
    requiredExpertise: Array.isArray(raw.requiredExpertise) ? raw.requiredExpertise : ["Data Analytics"],
    extractedTags: Array.isArray(raw.extractedTags) ? raw.extractedTags : ["AI Analysis"],
  };
}
