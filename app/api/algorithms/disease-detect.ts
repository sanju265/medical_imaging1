import { spawn } from "child_process";

export type DiseaseDetectInput = {
  imageBase64?: string
  text: string
  details: Record<string, any>
}

export type DiseaseDetectOutput = {
  prediction: string
  probabilities: Record<string, number>
  severity: number // 0-100
  description: string
  heatmap?: string | null
}

const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  Melanoma: [
    "irregular mole", "asymmetrical lesion", "irregular border", "uneven edges", "color variation",
    "dark brown patch", "black mole", "blue-black area", "irregular pigmentation", "raised nodule",
    "ulcerated mole", "bleeding spot", "itching mole", "painful mole", "growing mole", "large lesion",
    "satellite lesion", "crusted spot", "regression area", "non-healing mole", "multicolored lesion",
    "scaly patch", "uneven surface", "irregular shape", "pigmented macule", "mole with halo",
    "irregular outline", "irregular surface", "nodular melanoma", "irregular dots"
  ],
  "Melanocytic Nevus": [
    "round mole", "flat mole", "raised mole", "brown spot", "uniform color", "small lesion",
    "symmetric mole", "smooth surface", "regular border", "benign mole", "dome-shaped", "hair in mole",
    "light brown patch", "pinkish mole", "stable mole", "non-itchy", "unchanged size", "circular spot",
    "regular pigment network", "small dark dot", "childhood mole", "congenital mole", "evenly pigmented",
    "soft lesion", "well-defined edge", "small bump", "tan spot", "symmetrical macule", "smooth nodule",
    "harmless spot"
  ],
  "Basal Cell Carcinoma": [
    "pearly nodule", "translucent bump", "shiny lesion", "rolled border", "telangiectasia", "central ulcer",
    "bleeding sore", "non-healing ulcer", "scabbed area", "pink bump", "waxy patch", "crusted lesion",
    "depressed center", "raised edge", "pearly papule", "shiny surface", "sore that won’t heal", "bleeding bump",
    "open sore", "red patch", "scar-like area", "slow growing lesion", "ulcerated nodule", "white waxy spot",
    "crusted ulcer", "fragile skin area", "erosion", "smooth nodule", "small crater", "irregular growth"
  ],
  "Actinic Keratosis / Intraepithelial Carcinoma": [
    "rough patch", "scaly lesion", "crusted spot", "red scaly area", "sun-damaged skin", "thickened patch",
    "sandpaper texture", "flat crusted area", "tender patch", "pre-cancerous spot", "dry lesion", "flaky area",
    "hyperkeratotic plaque", "sore patch", "erythematous area", "crusty lesion", "gritty patch", "painful spot",
    "non-healing scale", "inflamed patch", "keratinized lesion", "scaly crust", "burning sensation", "pink crust",
    "itchy patch", "irregular plaque", "sun-exposed lesion", "crusty nodule", "small hard bump", "precancerous crust"
  ],
  "Benign Keratosis": [
    "waxy lesion", "stuck-on spot", "brown patch", "rough surface", "scaly plaque", "wart-like growth", "greasy texture",
    "elevated lesion", "flat-topped bump", "thickened patch", "keratin plug", "verrucous surface", "well-demarcated border",
    "hyperpigmented area", "soft lesion", "dark brown growth", "non-painful", "slow growing", "oval lesion",
    "slightly raised plaque", "keratotic papule", "smooth edge", "itchy patch", "crusted area", "uneven texture",
    "waxy bump", "sharply demarcated", "dull surface", "lichenified patch", "benign wart"
  ],
  Dermatofibroma: [
    "firm nodule", "small bump", "brown papule", "pink nodule", "hard spot", "dome-shaped lesion", "dimple sign",
    "fibrous lesion", "hyperpigmented papule", "skin-colored bump", "slightly raised nodule", "movable under skin",
    "non-itchy bump", "firm to touch", "painless spot", "round papule", "smooth surface", "small hard lump",
    "central depression", "indurated lesion", "well-defined nodule", "small scar-like bump", "single lesion",
    "red-brown spot", "stable size", "firm growth", "fibrotic papule", "asymptomatic nodule", "small firm papule",
    "benign nodule"
  ],
  "Vascular Lesion": [
    "red papule", "purple spot", "cherry angioma", "vascular nodule", "bright red bump", "bluish patch",
    "bleeding lesion", "compressible nodule", "dome-shaped red bump", "telangiectatic area", "soft lesion",
    "spongy texture", "blanching spot", "red-blue papule", "fragile bump", "bleeding easily", "pulsatile lesion",
    "smooth red patch", "shiny red nodule", "small vascular papule", "dark red patch", "cluster of red dots",
    "angiomatous lesion", "tiny red macule", "bright cherry spot", "raised vascular growth", "red bleeding papule",
    "friable nodule", "vascular overgrowth", "soft red spot"
  ]
};

function getDescription(label: string) {
  const descriptionMap: Record<string, string> = {
    Melanoma: "Suspicious pigmented lesion with features concerning for melanoma. Recommend prompt specialist evaluation.",
    "Seborrheic Keratosis": "Common benign epidermal tumor. Often appears as a waxy or stuck-on lesion.",
    "Melanocytic Nevus": "Benign melanocytic nevus. Monitor for changes in asymmetry, border, color, diameter, and evolution.",
    "Basal Cell Carcinoma": "Slow-growing skin cancer presenting as pearly or translucent nodules with rolled borders.",
    "Actinic Keratosis / Intraepithelial Carcinoma": "Pre-cancerous lesion with rough, scaly patches often due to sun damage.",
    "Benign Keratosis": "Non-cancerous epidermal tumors that appear as scaly, waxy, or wart-like lesions.",
    Dermatofibroma: "Benign fibrous nodules typically firm and movable under the skin.",
    "Vascular Lesion": "Lesions related to blood vessels such as hemangiomas or angiokeratomas."
  };
  return descriptionMap[label] || "No description available.";
}

// Analyze symptoms in free-text notes
function analyzeTextSymptoms(text: string): { winner: string; matchCounts: Record<string, number> } {
  text = text.toLowerCase();
  const matchCounts: Record<string, number> = {};
  let maxMatches = 0;
  let winner = "Benign Nevus";
  for (const [label, symptoms] of Object.entries(SYMPTOM_KEYWORDS)) {
    const count = symptoms.reduce((acc, phrase) => acc + (text.includes(phrase) ? 1 : 0), 0);
    matchCounts[label] = count;
    if (count > maxMatches) {
      maxMatches = count;
      winner = label;
    }
  }
  return { winner, matchCounts };
}

// Analyze the image (use your real ML model here!)
function analyzeImage(imageBase64: string): {
  prediction: string,
  probabilities: Record<string, number>,
  severity: number
} {
  const labels = Object.keys(SYMPTOM_KEYWORDS);
  const probs = labels.map(() => 0.01 + Math.random());
  const norm = probs.reduce((a, b) => a + b, 0);
  const normalized = probs.map(p => Math.max(0.01, p / norm));
  const map: Record<string, number> = {};
  labels.forEach((l, i) => (map[l] = normalized[i]));
  const winner = labels[normalized.indexOf(Math.max(...normalized))];
  const severity = Math.round(Math.max(10, Math.min(100, normalized[normalized.indexOf(Math.max(...normalized))] * 100)));
  return { prediction: winner, probabilities: map, severity };
}

// Call your real Grad-CAM Python script
async function runGradCAM(imageBase64: string, predictedLabel: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", ["path/to/your_gradcam_script.py"]);
    let result = "";
    let err = "";
    py.stdin.write(JSON.stringify({ imageBase64, predictedLabel }) + "\n");
    py.stdin.end();
    py.stdout.on("data", (data) => result += data.toString());
    py.stderr.on("data", (data) => err += data.toString());
    py.on("close", (code) => {
      if (code === 0 && result) {
        resolve(result.trim()); // Expect base64 string from Python
      } else {
        console.error("[GradCAM Error]", err);
        resolve(null);
      }
    });
  });
}

export async function runDiseaseDetect(input: DiseaseDetectInput): Promise<DiseaseDetectOutput> {
  const { text, imageBase64 } = input;
  let hasText = Boolean(text && text.trim().length > 0);
  let textInfo: { winner: string, matchCounts: Record<string, number> } | null = null;
  let useText = false;

  if (hasText) {
    textInfo = analyzeTextSymptoms(text!.trim());
    useText = Object.values(textInfo.matchCounts).some(v => v > 0);
  }

  if (useText && textInfo) {
    // Use TEXT as primary, GradCAM heatmap if image provided
    const labels = Object.keys(SYMPTOM_KEYWORDS);
    const totalMatches = Object.values(textInfo.matchCounts).reduce((sum, v) => sum + v, 0) || 1;
    const probabilities: Record<string, number> = {};
    for (const label of labels) {
      probabilities[label] = (textInfo.matchCounts[label] || 0.01) / totalMatches;
    }
    const winner = textInfo.winner;
    const severity = Math.min(100, Math.max(10, Math.round(probabilities[winner] * 100)));
    let heatmap: string | null = null;
    if (imageBase64) {
      heatmap = await runGradCAM(imageBase64, winner);
    }
    return {
      prediction: winner,
      probabilities,
      severity,
      description: getDescription(winner),
      heatmap
    };
  } else if (imageBase64) {
    // Use IMAGE as fallback
    const imgInfo = analyzeImage(imageBase64);
    const heatmap = await runGradCAM(imageBase64, imgInfo.prediction);
    return {
      prediction: imgInfo.prediction,
      probabilities: imgInfo.probabilities,
      severity: imgInfo.severity,
      description: getDescription(imgInfo.prediction),
      heatmap
    }
  } else {
    // Neither text nor image provided
    return {
      prediction: "Benign Nevus",
      probabilities: Object.fromEntries(Object.keys(SYMPTOM_KEYWORDS).map(l => [l, l === "Benign Nevus" ? 1 : 0.01])),
      severity: 10,
      description: getDescription("Benign Nevus"),
      heatmap: null
    }
  }
}
