import type { WasteReference } from "./enercyra";

const labels: Record<string, [string, string, string]> = {
  battery: ["Battery", "بطارية", "Hazardous"], cardboard: ["Cardboard", "كرتون", "Recyclable"], food_waste: ["Food Waste", "مخلفات طعام", "Organic"], fresh_apples: ["Fresh Apples", "تفاح طازج", "Organic"], fresh_banana: ["Fresh Banana", "موز طازج", "Organic"], fresh_citrus: ["Fresh Citrus", "حمضيات طازجة", "Organic"], fresh_vegetables: ["Fresh Vegetables", "خضروات طازجة", "Organic"], glass: ["Glass", "زجاج", "Recyclable"], gloves: ["Gloves", "قفازات", "General"], hazardous_waste: ["Hazardous Waste", "نفايات خطرة", "Hazardous"], keyboard: ["Keyboard", "لوحة مفاتيح", "E-Waste"], light_bulb: ["Light Bulb", "مصباح", "E-Waste"], mask: ["Mask", "كمامة", "Medical"], medical_equipment: ["Medical Equipment", "معدات طبية", "Medical"], medical_protective_items: ["Medical Protective Items", "مستلزمات حماية طبية", "Medical"], metal: ["Metal", "معدن", "Recyclable"], microwave: ["Microwave", "ميكروويف", "E-Waste"], miscellaneous_trash: ["Miscellaneous Trash", "مخلفات متنوعة", "General"], mixed_recyclables: ["Mixed Recyclables", "مواد قابلة لإعادة التدوير مختلطة", "Recyclable"], mobile: ["Mobile Phone", "هاتف محمول", "E-Waste"], mouse: ["Computer Mouse", "فأرة كمبيوتر", "E-Waste"], other_waste: ["Other Waste", "نفايات أخرى", "General"], paper: ["Paper", "ورق", "Recyclable"], pcb: ["PCB", "لوحة دوائر إلكترونية", "E-Waste"], plastic: ["Plastic", "بلاستيك", "Recyclable"], printer: ["Printer", "طابعة", "E-Waste"], rotten_apples: ["Rotten Apples", "تفاح فاسد", "Organic"], rotten_banana: ["Rotten Banana", "موز فاسد", "Organic"], rotten_citrus: ["Rotten Citrus", "حمضيات فاسدة", "Organic"], rotten_vegetables: ["Rotten Vegetables", "خضروات فاسدة", "Organic"], syringe: ["Syringe", "حقنة", "Medical"], syringe_needle: ["Syringe Needle", "إبرة حقن", "Medical"], television: ["Television", "تلفاز", "E-Waste"], test_tube: ["Test Tube", "أنبوب اختبار", "Medical"], textile_footwear: ["Textile & Footwear", "منسوجات وأحذية", "Textile"], vegetation: ["Vegetation", "مخلفات نباتية", "Organic"], washing_machine: ["Washing Machine", "غسالة", "E-Waste"],
};

const energyRecoveryPotential = new Set([
  "cardboard", "food_waste", "fresh_apples", "fresh_banana", "fresh_citrus", "fresh_vegetables",
  "gloves", "mixed_recyclables", "miscellaneous_trash", "other_waste", "paper", "plastic",
  "rotten_apples", "rotten_banana", "rotten_citrus", "rotten_vegetables", "textile_footwear", "vegetation",
]);

/**
 * Explicit mappings from the attached EcoSyncAI notebook. These are not live market
 * prices or lab measurements; they are labeled reference scenarios for the Result page.
 */
const notebookReferenceRows: Record<string, { price: number; lhv: number; notebookClass: string }> = {
  plastic: { price: 4, lhv: 35, notebookClass: "Plastic_Products" },
  paper: { price: 2.5, lhv: 14, notebookClass: "Paper_Loose" },
  cardboard: { price: 3, lhv: 16, notebookClass: "Cardboard_Boxes" },
  glass: { price: 0.5, lhv: 0, notebookClass: "Glass_Bottles_Objects" },
  metal: { price: 8, lhv: 0, notebookClass: "Metal_Scrap_Cans" },
  mobile: { price: 15, lhv: 0, notebookClass: "E_Waste_Phones" },
  keyboard: { price: 5, lhv: 0, notebookClass: "E_Waste_Keyboards" },
  mouse: { price: 3, lhv: 0, notebookClass: "E_Waste_Computer_Mouse" },
  microwave: { price: 10, lhv: 0, notebookClass: "E_Waste_Large_Appliances" },
  washing_machine: { price: 10, lhv: 0, notebookClass: "E_Waste_Large_Appliances" },
  television: { price: 10, lhv: 0, notebookClass: "E_Waste_Large_Appliances" },
  rotten_apples: { price: 0, lhv: 4.5, notebookClass: "Rotten_Apples" },
  fresh_apples: { price: 0, lhv: 4, notebookClass: "Fresh_Apples" },
  rotten_banana: { price: 0, lhv: 4.2, notebookClass: "Rotten_Banana" },
  fresh_banana: { price: 0, lhv: 3.8, notebookClass: "Fresh_Banana" },
  mask: { price: 0, lhv: 15, notebookClass: "Medical_Face_Masks" },
  textile_footwear: { price: 1.5, lhv: 18, notebookClass: "Textiles_Clothes" },
  vegetation: { price: 0, lhv: 5, notebookClass: "Organic_General_Trash" },
  miscellaneous_trash: { price: 0, lhv: 10, notebookClass: "General_Unsorted_Trash" },
  other_waste: { price: 0, lhv: 10, notebookClass: "General_Unsorted_Trash" },
};

export const mobileNetReferenceCatalog: WasteReference[] = Object.entries(labels).map(([id, [displayNameEn, displayNameAr, category]]) => {
  const row = notebookReferenceRows[id];
  const hasNumericPrice = row && row.price > 0;
  const hasNumericLhv = row && row.lhv > 0;
  return {
    id,
    displayNameEn,
    displayNameAr,
    category,
    priceEgpPerKg: hasNumericPrice ? row.price : null,
    lhvMjPerKg: hasNumericLhv ? row.lhv : null,
    combustible: energyRecoveryPotential.has(id),
    status: row && (hasNumericPrice || hasNumericLhv) ? "reference" : "pending",
    sourceNote: row ? `EcoSyncAI notebook reference scenario: ${row.notebookClass}; price is an indicative EGP/kg estimate and LHV is a literature-based MJ/kg estimate.` : "Display mapping from the uploaded MobileNetV3 class mapping. Reference price and LHV require verification before publication.",
    disclaimer: row ? "Reference Estimate from the attached notebook, not a live market quote or laboratory measurement. Confirm material subtype, moisture, country, and date before commercial use." : "Reference Estimate only. Price and LHV are pending verification and may vary by market and material quality.",
  } satisfies WasteReference;
});
