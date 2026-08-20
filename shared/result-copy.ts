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
    ? "المصدر: نوت بوك EcoSyncAI المرفق. السعر إرشادي بالجنيه/كجم، وLHV هي القيمة الحرارية الدنيا للمادة بالـMJ/kg؛ نحسب الطاقة الكلية بالـMJ ثم نحوّلها إلى kWh بقسمة الـMJ على 3.6. هذه ليست قراءة معملية ولا سعر سوق مباشر، ويجب تأكيد الدولة والدرجة والتاريخ قبل الاستخدام التجاري."
    : "Source: the attached EcoSyncAI notebook. Price is an indicative EGP/kg reference; LHV is the material’s lower heating value in MJ/kg. Total energy is calculated in MJ, then converted to kWh by dividing MJ by 3.6. This is not a laboratory measurement or live market quote; confirm country, grade, and date before commercial use.";
}
