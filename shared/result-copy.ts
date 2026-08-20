export type ResultLanguage = "en" | "ar";

export function energyRecoveryLabel(lang: ResultLanguage, potential: boolean): string {
  if (potential) return lang === "ar" ? "مبدئيًا نعم" : "Potential";
  return lang === "ar" ? "غير مناسبة مبدئيًا" : "Not indicated";
}

export function pendingMetricLabel(lang: ResultLanguage): string {
  return lang === "ar" ? "قيد التحقق" : "Pending";
}

export function pendingMetricStatus(lang: ResultLanguage): string {
  return lang === "ar" ? "بانتظار التحقق" : "Pending verification";
}

export function pendingDataNotice(lang: ResultLanguage): string {
  return lang === "ar"
    ? "بيانات السعر والقيمة الحرارية لهذه الفئة قيد التحقق؛ لذلك لن تظهر أرقام قبل اعتماد مصدر موثوق."
    : "Price and energy data for this material are pending verification, so numerical estimates stay hidden until a trusted source is approved.";
}

export function notebookReferenceNotice(lang: ResultLanguage): string {
  return lang === "ar"
    ? "الأرقام المعروضة تقدير مرجعي مستخرج من نوت بوك EcoSyncAI: السعر إرشادي بالجنيه/كجم، والقيمة الحرارية تقدير أدبي بالميجا جول/كجم، وليست سعر سوق حاليًا أو قياسًا معمليًا."
    : "These are notebook-derived Reference Estimates from EcoSyncAI: indicative EGP/kg pricing and literature-based MJ/kg energy, not a live market quote or laboratory measurement.";
}
