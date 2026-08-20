import type { WasteReference } from "./enercyra";

const labels: Record<string, [string, string, string]> = {
  battery: ["Battery", "بطارية", "Hazardous"], cardboard: ["Cardboard", "كرتون", "Recyclable"], food_waste: ["Food Waste", "مخلفات طعام", "Organic"], fresh_apples: ["Fresh Apples", "تفاح طازج", "Organic"], fresh_banana: ["Fresh Banana", "موز طازج", "Organic"], fresh_citrus: ["Fresh Citrus", "حمضيات طازجة", "Organic"], fresh_vegetables: ["Fresh Vegetables", "خضروات طازجة", "Organic"], glass: ["Glass", "زجاج", "Recyclable"], gloves: ["Gloves", "قفازات", "General"], hazardous_waste: ["Hazardous Waste", "نفايات خطرة", "Hazardous"], keyboard: ["Keyboard", "لوحة مفاتيح", "E-Waste"], light_bulb: ["Light Bulb", "مصباح", "E-Waste"], mask: ["Mask", "كمامة", "Medical"], medical_equipment: ["Medical Equipment", "معدات طبية", "Medical"], medical_protective_items: ["Medical Protective Items", "مستلزمات حماية طبية", "Medical"], metal: ["Metal", "معدن", "Recyclable"], microwave: ["Microwave", "ميكروويف", "E-Waste"], miscellaneous_trash: ["Miscellaneous Trash", "مخلفات متنوعة", "General"], mixed_recyclables: ["Mixed Recyclables", "مواد قابلة لإعادة التدوير مختلطة", "Recyclable"], mobile: ["Mobile Phone", "هاتف محمول", "E-Waste"], mouse: ["Computer Mouse", "فأرة كمبيوتر", "E-Waste"], other_waste: ["Other Waste", "نفايات أخرى", "General"], paper: ["Paper", "ورق", "Recyclable"], pcb: ["PCB", "لوحة دوائر إلكترونية", "E-Waste"], plastic: ["Plastic", "بلاستيك", "Recyclable"], printer: ["Printer", "طابعة", "E-Waste"], rotten_apples: ["Rotten Apples", "تفاح فاسد", "Organic"], rotten_banana: ["Rotten Banana", "موز فاسد", "Organic"], rotten_citrus: ["Rotten Citrus", "حمضيات فاسدة", "Organic"], rotten_vegetables: ["Rotten Vegetables", "خضروات فاسدة", "Organic"], syringe: ["Syringe", "حقنة", "Medical"], syringe_needle: ["Syringe Needle", "إبرة حقن", "Medical"], television: ["Television", "تلفاز", "E-Waste"], test_tube: ["Test Tube", "أنبوب اختبار", "Medical"], textile_footwear: ["Textile & Footwear", "منسوجات وأحذية", "Textile"], vegetation: ["Vegetation", "مخلفات نباتية", "Organic"], washing_machine: ["Washing Machine", "غسالة", "E-Waste"],
};

export const mobileNetReferenceCatalog: WasteReference[] = Object.entries(labels).map(([id, [displayNameEn, displayNameAr, category]]) => ({
  id,
  displayNameEn,
  displayNameAr,
  category,
  priceEgpPerKg: null,
  lhvMjPerKg: null,
  combustible: category === "Organic",
  status: "pending",
  sourceNote: "Display mapping from the uploaded MobileNetV3 class mapping. Reference price and LHV require verification before publication.",
  disclaimer: "Reference Estimate only. Price and LHV are pending verification and may vary by market and material quality.",
}));
