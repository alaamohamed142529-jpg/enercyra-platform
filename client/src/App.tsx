import { useEffect, useMemo, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  Filter,
  Globe2,
  Grid2X2,
  Leaf,
  Lightbulb,
  ListFilter,
  LogIn,
  Menu,
  Moon,
  PackageSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Tag,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "./lib/trpc";
import { calculateEstimate, parseWeightInput } from "../../shared/enercyra";
import { mobileNetReferenceCatalog } from "../../shared/model-classes";
import { buildListingPayload } from "../../shared/listing-payload";
import { energyRecoveryLabel, pendingDataNotice, pendingMetricLabel, pendingMetricStatus } from "../../shared/result-copy";
import { mapInferenceToClassification, type StoredClassification } from "../../shared/classification-contract";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

const referenceData = mobileNetReferenceCatalog.map((item) => ({ id: item.id, en: item.displayNameEn, ar: item.displayNameAr, category: item.category, status: item.status, price: item.priceEgpPerKg, lhv: item.lhvMjPerKg, combustible: item.combustible, disclaimer: item.disclaimer }));

const listings = [
  { id: 1, name: "Plastic Bottles", ar: "زجاجات بلاستيكية", weight: "250 kg", locationEn: "Riyadh, Saudi Arabia", locationAr: "الرياض، السعودية", status: "Reference listing", color: "lime", icon: "plastic" },
  { id: 2, name: "Cardboard", ar: "كرتون", weight: "500 kg", locationEn: "Jeddah, Saudi Arabia", locationAr: "جدة، السعودية", status: "Reference listing", color: "cyan", icon: "cardboard" },
  { id: 3, name: "Aluminum Cans", ar: "علب ألومنيوم", weight: "150 kg", locationEn: "Dammam, Saudi Arabia", locationAr: "الدمام، السعودية", status: "Reference listing", color: "violet", icon: "metal" },
  { id: 4, name: "Glass", ar: "زجاج", weight: "300 kg", locationEn: "Riyadh, Saudi Arabia", locationAr: "الرياض، السعودية", status: "Reference listing", color: "green", icon: "glass" },
  { id: 5, name: "Paper", ar: "ورق", weight: "200 kg", locationEn: "Jeddah, Saudi Arabia", locationAr: "جدة، السعودية", status: "Reference listing", color: "blue", icon: "paper" },
  { id: 6, name: "Mixed Materials", ar: "مواد مختلطة", weight: "400 kg", locationEn: "Dammam, Saudi Arabia", locationAr: "الدمام، السعودية", status: "Price pending", color: "orange", icon: "mixed" },
];

type Lang = "en" | "ar";

type Copy = {
  nav: Record<string, string>;
  heroTitle: string;
  heroSub: string;
  classify: string;
  marketplace: string;
  featureTitle: string;
  featureCopy: string;
  valueTitle: string;
  valueCopy: string;
  connectTitle: string;
  connectCopy: string;
  uploadTitle: string;
  uploadSub: string;
  choose: string;
  camera: string;
  reference: string;
  pending: string;
};

const copy: Record<Lang, Copy> = {
  en: {
    nav: { dashboard: "Dashboard", classify: "Classify", marketplace: "Marketplace", how: "How It Works", about: "About" },
    heroTitle: "See Waste. See Value.",
    heroSub: "AI-powered waste classification, reference value estimation, energy insights, and business connections.",
    classify: "Classify Waste",
    marketplace: "Explore Marketplace",
    featureTitle: "Turn a photo into a business signal.",
    featureCopy: "Enercyra helps you identify materials, understand reference estimates, and find the next useful connection.",
    valueTitle: "Reference value",
    valueCopy: "Clear estimates, always labeled and easy to verify.",
    connectTitle: "Business connections",
    connectCopy: "Move from a classified material to a potential buyer.",
    uploadTitle: "Drag & drop your image here",
    uploadSub: "or browse from your device",
    choose: "Choose Image",
    camera: "Use Camera",
    reference: "Reference listing",
    pending: "Price pending",
  },
  ar: {
    nav: { dashboard: "لوحة التحكم", classify: "التصنيف", marketplace: "السوق", how: "كيف تعمل المنصة", about: "من نحن" },
    heroTitle: "شوف النفايات. شوف قيمتها.",
    heroSub: "منصة ذكية لتصنيف النفايات وتقدير قيمتها ومحتواها الطاقي وربطها بفرص الأعمال.",
    classify: "صنّف نفاياتك",
    marketplace: "استكشف السوق",
    featureTitle: "حوّل الصورة إلى إشارة تجارية.",
    featureCopy: "تساعدك إنِرسيرا على معرفة نوع المادة وفهم التقديرات المرجعية والوصول إلى الاتصال المناسب.",
    valueTitle: "قيمة مرجعية",
    valueCopy: "تقديرات واضحة وموسومة دائمًا ليسهل التحقق منها.",
    connectTitle: "روابط الأعمال",
    connectCopy: "انتقل من مادة مصنّفة إلى مشترٍ محتمل.",
    uploadTitle: "اسحب الصورة وأفلتها هنا",
    uploadSub: "أو اخترها من جهازك",
    choose: "اختر صورة",
    camera: "استخدم الكاميرا",
    reference: "إعلان مرجعي",
    pending: "السعر قيد التجهيز",
  },
};

function App() {
  const [lang, setLang] = useState<Lang>(() => new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en");
  const [dark, setDark] = useState(() => window.localStorage.getItem("enercyra-theme") !== "light");
  useEffect(() => { window.localStorage.setItem("enercyra-theme", dark ? "dark" : "light"); }, [dark]);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const text = copy[lang];

  return (
    <ThemeProvider defaultTheme="dark" switchable>
      <div className={`app-shell ${dark ? "theme-dark" : "theme-light"}`} dir={dir}>
        <SiteHeader lang={lang} setLang={setLang} dark={dark} setDark={setDark} text={text} />
        <main>
          <Switch>
            <Route path="/" component={() => <Home text={text} lang={lang} />} />
            <Route path="/classify" component={() => <Classify text={text} lang={lang} />} />
            <Route path="/result" component={() => <Result text={text} lang={lang} />} />
            <Route path="/marketplace" component={() => <Marketplace text={text} lang={lang} />} />
            <Route path="/how-it-works" component={() => <HowItWorks text={text} lang={lang} />} />
            <Route path="/about" component={() => <About text={text} lang={lang} />} />
            <Route path="/my-listings" component={() => <MyListings text={text} lang={lang} />} />
            <Route path="/publish" component={() => <Publish text={text} lang={lang} />} />
            <Route component={() => <Home text={text} lang={lang} />} />
          </Switch>
        </main>
        <Footer lang={lang} />
        <Toaster richColors position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}

function SiteHeader({ lang, setLang, dark, setDark, text }: { lang: Lang; setLang: (value: Lang) => void; dark: boolean; setDark: (value: boolean) => void; text: Copy }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const links = [
    ["/", "Dashboard", "لوحة التحكم", Grid2X2],
    ["/classify", "Classify", "التصنيف", Sparkles],
    ["/marketplace", "Marketplace", "السوق", PackageSearch],
    ["/how-it-works", "How It Works", "كيف تعمل المنصة", CircleHelp],
    ["/about", "About", "من نحن", UserRound],
  ] as const;
  return (
    <header className="site-header">
      <Link href="/" className="brand-link">
        <BrandMark />
        <span className="brand-copy"><strong>Enercyra</strong><small>{lang === "ar" ? "اكتشف النفايات. اكتشف قيمتها." : "See Waste. See Value."}</small></span>
      </Link>
      <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`}>
        {links.map(([href, en, ar, Icon]) => <Link key={href} href={href} className="nav-link"><Icon size={16} />{lang === "ar" ? ar : text.nav[en === "Dashboard" ? "dashboard" : en === "Classify" ? "classify" : en === "Marketplace" ? "marketplace" : en === "How It Works" ? "how" : "about"]}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Switch language" onClick={() => setLang(lang === "en" ? "ar" : "en")}><Globe2 size={17} /><span>{lang === "en" ? "العربية" : "English"}</span></button>
        <button className="theme-toggle" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={16} /> : <Moon size={16} />}<span className="toggle-dot" /></button>
        {user ? <Link href="/my-listings" className="avatar-button"><UserRound size={17} /></Link> : <button className="login-button" onClick={() => startLogin()}><LogIn size={16} />{lang === "ar" ? "دخول" : "Sign in"}</button>}
        <button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
  );
}

function BrandMark() { return <span className="brand-mark" aria-hidden="true"><span /><span /><span /><b /></span>; }

function Home({ text, lang }: { text: Copy; lang: Lang }) {
  return <div className="page home-page">
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={15} /> {lang === "ar" ? "ذكاء النفايات للأعمال" : "Waste intelligence for business"}</span>
        <h1>{text.heroTitle}</h1>
        <p>{text.heroSub}</p>
        <div className="hero-actions"><Link href="/classify" className="btn btn-primary"><Sparkles size={18} />{text.classify}<ArrowRight size={17} /></Link><Link href="/marketplace" className="btn btn-secondary"><PackageSearch size={18} />{text.marketplace}<ArrowRight size={17} /></Link></div>
        <div className="trust-row"><ShieldCheck size={17} /><span>{lang === "ar" ? "التقديرات مرجعية وواضحة المصدر" : "Estimates are labeled and transparent"}</span><span className="dot-separator" /> <span>{lang === "ar" ? "عربي / English" : "Arabic / English"}</span></div>
      </div>
      <div className="hero-visual"><img className="hero-orbit-image" src="/manus-storage/enercyra-waste-orbit-hero_e9e2ae6c.png" alt={lang === "ar" ? "منظومة إنرسيرا لتصنيف النفايات وحساب قيمتها وربطها بالأعمال" : "Enercyra waste intelligence orbit for classifying, calculating, and connecting materials"} /></div>
    </section>
    <section className="feature-strip container"><FeatureCard icon={<Sparkles />} title={lang === "ar" ? "تصنيف بالذكاء الاصطناعي" : "AI Classification"} copy={lang === "ar" ? "تعرّف على نوع المادة من صورة واحدة." : "Identify a material from a single image."} /><FeatureCard icon={<BarChart3 />} title={text.valueTitle} copy={text.valueCopy} /><FeatureCard icon={<UsersRound />} title={text.connectTitle} copy={text.connectCopy} /><RecentAnalysis lang={lang} /></section>
    <section className="how-preview container"><div><span className="eyebrow"><Zap size={15} /> {lang === "ar" ? "ثلاث خطوات واضحة" : "A simple three-step flow"}</span><h2>{text.featureTitle}</h2><p>{text.featureCopy}</p></div><div className="step-line"><Step n="01" title={lang === "ar" ? "صنّف" : "Classify"} /><Step n="02" title={lang === "ar" ? "احسب" : "Calculate"} /><Step n="03" title={lang === "ar" ? "تواصل" : "Connect"} /></div></section>
  </div>;
}

function FeatureCard({ icon, title, copy: description }: { icon: React.ReactNode; title: string; copy: string }) { return <div className="feature-card"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{description}</p><ArrowRight className="feature-arrow" size={18} /></div>; }
function Step({ n, title }: { n: string; title: string }) { return <div className="step"><span>{n}</span><strong>{title}</strong></div>; }
function WasteOrbit() { return <div className="waste-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-ring ring-three" /><div className="orbit-core"><BrandMark /></div><div className="waste-object bottle">♢</div><div className="waste-object can">◒</div><div className="waste-object cardboard">▤</div><div className="waste-object glass">◉</div><div className="waste-object organic">✦</div></div>; }
function RecentAnalysis({ lang }: { lang: Lang }) { return <div className="recent-card"><div className="recent-header"><span><BarChart3 size={17} />{lang === "ar" ? "أحدث تحليل" : "Recent Analysis"}</span><Link href="/result">{lang === "ar" ? "عرض" : "View"}<ArrowRight size={15} /></Link></div><div className="recent-row"><div className="mini-material">PET</div><div><strong>{lang === "ar" ? "زجاجة بلاستيكية" : "Plastic Bottle"}</strong><small>{lang === "ar" ? "ثقة عالية" : "High confidence"}</small></div><div className="recent-stat"><small>{lang === "ar" ? "القيمة المرجعية" : "Reference value"}</small><strong>—</strong></div><div className="recent-stat"><small>{lang === "ar" ? "الطاقة التقديرية" : "Estimated energy"}</small><strong>—</strong></div></div></div>; }

async function imageFileToDataUrl(file: File): Promise<string> {
  const source = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The selected file is not a readable image."));
    image.src = URL.createObjectURL(file);
  });
  const scale = Math.min(1, 1024 / Math.max(source.naturalWidth, source.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.84);
}

function Classify({ text, lang }: { text: Copy; lang: Lang }) {
  const [, navigate] = useLocation();
  const [fileName, setFileName] = useState("");
  const classifyMutation = trpc.inference.classify.useMutation();
  const onFile = async (file: File) => {
    setFileName(file.name);
    try {
      const imageDataUrl = await imageFileToDataUrl(file);
      const inference = await classifyMutation.mutateAsync({ imageDataUrl });
      const classification = mapInferenceToClassification(inference, mobileNetReferenceCatalog, { name: file.name, dataUrl: imageDataUrl });
      window.sessionStorage.setItem("enercyra-classification", JSON.stringify(classification));
      toast.success(lang === "ar" ? `تم التعرف على ${classification.displayNameAr}` : `Detected ${classification.displayNameEn}`);
      navigate("/result");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (lang === "ar" ? "تعذر تحليل الصورة." : "The image could not be analyzed."));
    }
  };
  const busy = classifyMutation.isPending;
  return <div className="page container narrow-page"><div className="page-heading"><span className="eyebrow"><Sparkles size={15} />{lang === "ar" ? "الخطوة الأولى" : "Step one"}</span><h1>{lang === "ar" ? "حلّل نفاياتك بالذكاء الاصطناعي." : "Classify your waste."}</h1><p>{lang === "ar" ? "ارفع صورة وسيحدد نظام إنِرسيرا نوع المادة." : "Upload an image and let Enercyra identify the material."}</p></div><div className="classify-grid"><label className="upload-card"><input type="file" accept="image/*" capture="environment" onChange={(event) => event.target.files?.[0] && onFile(event.target.files[0])} /><CloudUpload size={46} /><strong>{busy ? (lang === "ar" ? "جارٍ تحليل الصورة..." : "Analyzing image...") : fileName || text.uploadTitle}</strong><span>{busy ? (lang === "ar" ? "يتم تشغيل MobileNetV3" : "Running MobileNetV3") : fileName ? fileName : text.uploadSub}</span><button type="button" className="btn btn-primary" disabled={busy} onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}><Upload size={17} />{text.choose}</button><button type="button" className="btn btn-secondary" disabled={busy} onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}><Camera size={17} />{text.camera}</button><small><ShieldCheck size={14} />{lang === "ar" ? "الصورة تُحلّل دون نشرها تلقائيًا." : "The image is analyzed without being published automatically."}</small></label><div className="benefit-panel"><h3>{lang === "ar" ? "ما الذي ستحصل عليه؟" : "What you’ll get"}</h3><Benefit icon={<Leaf />} title={lang === "ar" ? "فئة النفايات" : "Waste category"} copy={lang === "ar" ? "اسم عربي وإنجليزي واضح." : "Clear Arabic and English names."} /><Benefit icon={<Sparkles />} title={lang === "ar" ? "درجة الثقة" : "Confidence score"} copy={lang === "ar" ? "مؤشر بصري من النموذج الحقيقي." : "A visual score from the real model."} /><Benefit icon={<BarChart3 />} title={lang === "ar" ? "القيمة والطاقة" : "Value & energy"} copy={lang === "ar" ? "تقديرات مرجعية مع تنبيه واضح." : "Reference estimates with a disclaimer."} /><div className="progress-steps"><span className="active">1</span><i /><span>2</span><i /><span>3</span><p>{lang === "ar" ? "ارفع، حلّل، افهم" : "Upload, analyze, understand"}</p></div></div></div><div className="demo-note" aria-live="polite"><Lightbulb size={17} /><span>{lang === "ar" ? "التحليل الحقيقي متاح الآن: سيعرض MobileNetV3 الفئة ودرجة الثقة قبل الحسابات المرجعية." : "Live MobileNetV3 inference is enabled and returns the class and confidence before reference calculations."}</span><button className="text-button" onClick={() => navigate("/result")}>{lang === "ar" ? "عرض نتيجة توضيحية" : "View example result"}<ArrowRight size={15} /></button></div></div>;
}
function Benefit({ icon, title, copy: description }: { icon: React.ReactNode; title: string; copy: string }) { return <div className="benefit"><span>{icon}</span><div><strong>{title}</strong><small>{description}</small></div></div>; }

function Result({ text, lang }: { text: Copy; lang: Lang }) {
  const [weight, setWeight] = useState("10");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [classification] = useState<StoredClassification>(() => {
    try { return JSON.parse(window.sessionStorage.getItem("enercyra-classification") || "") as StoredClassification; } catch { return { source: "demo", classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك", confidence: 0.968 }; }
  });
  const item = referenceData.find((entry) => entry.id === classification.classId) ?? referenceData.find((entry) => entry.id === "plastic") ?? referenceData[0];
  const confidence = classification.confidence ?? 0.968;
  const estimate = calculateEstimate(parseWeightInput(weight), { priceEgpPerKg: item.price, lhvMjPerKg: item.lhv, status: item.status as "reference" | "pending" });
  const energy = estimate.energyMj;
  const confidenceLabel = confidence >= 0.8 ? (lang === "ar" ? "ثقة عالية" : "High confidence") : confidence >= 0.5 ? (lang === "ar" ? "ثقة متوسطة" : "Medium confidence") : (lang === "ar" ? "ثقة منخفضة" : "Low confidence");
  return <div className="page container result-page" data-result-version="weight-input-v2"><div className="page-heading compact"><span className="eyebrow"><Check size={15} />{lang === "ar" ? "تحليل مكتمل" : "Analysis complete"}</span><h1>{lang === "ar" ? "نتيجة تصنيف الذكاء الاصطناعي" : "AI Classification Result"}</h1><p>{lang === "ar" ? "توضح هذه الشاشة نتيجة MobileNetV3 والتقديرات المرجعية." : "This screen shows the MobileNetV3 result and reference estimates."}</p></div><div className="result-card"><div className="material-preview">{classification.imageDataUrl ? <img className="uploaded-preview" src={classification.imageDataUrl} alt={lang === "ar" ? "الصورة المحللة" : "Analyzed waste"} /> : <div className="bottle-illustration">{item.en.slice(0, 4).toUpperCase()}</div>}<small>{classification.imageName || (lang === "ar" ? "نتيجة تجريبية" : "Demo result")}</small></div><div className="result-main"><h2>{lang === "ar" ? item.ar : item.en}</h2><p>{lang === "ar" ? "الفئة المكتشفة" : "Detected category"}: <strong>{lang === "ar" ? item.ar : item.en}</strong></p><div className="confidence-ring"><div><strong>{(confidence * 100).toFixed(1)}%</strong><small>{lang === "ar" ? "ثقة النموذج" : "model confidence"}</small></div></div><span className="confidence-pill"><ShieldCheck size={15} />{confidenceLabel}</span></div><div className="material-details"><h3>{lang === "ar" ? "تفاصيل المادة" : "Material Details"}</h3><Detail icon={<Leaf />} label={lang === "ar" ? "الفئة" : "Category"} value={lang === "ar" ? item.category : item.category} /><Detail icon={<Tag />} label={lang === "ar" ? "المادة" : "Material"} value={lang === "ar" ? item.ar : item.en} /><Detail icon={<Zap />} label={lang === "ar" ? "إمكانية الاسترداد الطاقي" : "Energy recovery potential"} value={energyRecoveryLabel(lang, item.combustible)} /><div className="notice"><CircleHelp size={16} />{lang === "ar" ? "كل القيم أدناه تقديرات مرجعية وقد تختلف حسب السوق وجودة المادة." : "All figures below are Reference Estimates and may vary by market and material quality."}</div></div></div><div className="calculation-panel"><div className="calc-intro"><div className="feature-icon"><BarChart3 /></div><div><h3>{lang === "ar" ? "احسب القيمة والطاقة" : "Calculate Your Value"}</h3><p>{lang === "ar" ? "أدخل الوزن لمعرفة التقدير المرجعي." : "Enter the weight to see a reference estimate."}</p></div></div>{(item.price === null || item.lhv === null) && <div className="notice pending-data-note"><CircleHelp size={16} />{pendingDataNotice(lang)}</div>}<label>{lang === "ar" ? "الوزن (كجم)" : "Weight (kg)"}<input type="text" inputMode="decimal" pattern="[0-9٠-٩.,٫]*" minLength={1} value={weight} placeholder="10" aria-describedby="weight-help" onInput={(event) => setWeight(event.currentTarget.value)} onChange={(event) => setWeight(event.currentTarget.value)} /><small id="weight-help" className="field-help">{lang === "ar" ? "يمكنك إدخال أي وزن موجب، مثل 2 أو 10.5 كجم." : "Enter any positive weight, such as 2 or 10.5 kg."}</small></label><Metric lang={lang} label={lang === "ar" ? "السعر المرجعي" : "Reference price"} value={item.price !== null ? item.price.toFixed(2) : "—"} unit="EGP/kg" pending={item.price === null} /><Metric lang={lang} label={lang === "ar" ? "القيمة التقديرية" : "Estimated value"} value={estimate.valueEgp !== null ? estimate.valueEgp.toFixed(2) : "—"} unit="EGP" pending={estimate.valueEgp === null} /><Metric lang={lang} label={lang === "ar" ? "الطاقة التقديرية" : "Estimated energy"} value={estimate.energyKwh !== null ? estimate.energyKwh.toFixed(1) : "—"} unit="kWh" pending={estimate.energyKwh === null} /></div><div className="result-actions"><button className="btn btn-primary" onClick={() => { if (user) navigate("/publish"); else { toast.info(lang === "ar" ? "يجب تسجيل الدخول للنشر." : "Sign in is required to publish."); startLogin(); } }}><PackageSearch size={17} />{lang === "ar" ? "انشر في السوق" : "Publish to Marketplace"}<ArrowRight size={17} /></button><button className="btn btn-secondary" onClick={() => navigate("/classify")}><Upload size={17} />{lang === "ar" ? "صنّف صورة أخرى" : "Classify Another Image"}</button></div></div>;
}
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="detail-row"><span>{icon}</span><small>{label}</small><strong>{value}</strong></div>; }
function Metric({ lang, label, value, unit, pending }: { lang: Lang; label: string; value: string; unit: string; pending?: boolean }) { const shownValue = pending ? pendingMetricLabel(lang) : value; return <div className="metric"><small>{label}<i>ⓘ</i></small><strong>{shownValue} {!pending && <em>{unit}</em>}</strong><span className={pending ? "pending" : "reference-tag"}>{pending ? pendingMetricStatus(lang) : (lang === "ar" ? "محسوب" : "Calculated")}</span></div>; }

function Marketplace({ text, lang }: { text: Copy; lang: Lang }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All materials");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const filtered = useMemo(() => listings.filter((item) => `${item.name} ${item.ar} ${item.locationEn} ${item.locationAr}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All materials" || item.name.toLowerCase().includes(filter.toLowerCase())) && (locationFilter === "All locations" || item.locationEn.toLowerCase().includes(locationFilter.toLowerCase()))), [query, filter, locationFilter]);
  return <div className="page container marketplace-page"><div className="market-heading"><div><span className="eyebrow"><PackageSearch size={15} />{lang === "ar" ? "اتصالات الأعمال" : "Business connections"}</span><h1>{lang === "ar" ? "السوق" : "Marketplace"}</h1><p>{lang === "ar" ? "اعثر على المواد وتواصل مع المشترين المحتملين." : "Find waste materials and connect with potential buyers."}</p></div><Link href="/result" className="btn btn-primary"><Tag size={17} />{lang === "ar" ? "انشر مادة" : "Publish material"}</Link></div><div className="market-tools"><div className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={lang === "ar" ? "ابحث عن مادة أو موقع" : "Search material or location"} /></div><div className="select-field"><ListFilter size={17} /><select aria-label={lang === "ar" ? "نوع المادة" : "Material type"} value={filter} onChange={(event) => setFilter(event.target.value)}><option value="All materials">{lang === "ar" ? "كل المواد" : "All materials"}</option><option value="Plastic">{lang === "ar" ? "بلاستيك" : "Plastic"}</option><option value="Cardboard">{lang === "ar" ? "كرتون" : "Cardboard"}</option><option value="Paper">{lang === "ar" ? "ورق" : "Paper"}</option><option value="Glass">{lang === "ar" ? "زجاج" : "Glass"}</option></select><ChevronDown size={15} /></div><div className="select-field"><Globe2 size={17} /><select aria-label={lang === "ar" ? "الموقع" : "Location"} value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}><option value="All locations">{lang === "ar" ? "كل المواقع" : "All locations"}</option><option value="Riyadh">{lang === "ar" ? "الرياض" : "Riyadh"}</option><option value="Jeddah">{lang === "ar" ? "جدة" : "Jeddah"}</option><option value="Dammam">{lang === "ar" ? "الدمام" : "Dammam"}</option></select><ChevronDown size={15} /></div><button className="filter-button"><Filter size={17} />{lang === "ar" ? "فلاتر" : "Filters"}</button></div><div className="market-grid">{filtered.map((item) => <ListingCard key={item.id} item={item} lang={lang} text={text} />)}</div>{filtered.length === 0 && <div className="empty-state"><PackageSearch size={35} /><h3>{lang === "ar" ? "لا توجد نتائج بعد" : "No listings yet"}</h3><p>{lang === "ar" ? "جرّب تغيير البحث أو الفلتر." : "Try changing your search or filter."}</p></div>}<div className="market-disclaimer"><CircleHelp size={16} />{lang === "ar" ? "الإعلانات والقيم تحتاج إلى التحقق قبل أي اتفاق تجاري." : "Listings and values may require verification before a business agreement."}</div></div>;
}
function ListingCard({ item, lang, text }: { item: typeof listings[number]; lang: Lang; text: Copy }) { return <article className="listing-card"><div className={`listing-art ${item.color}`}><span>{item.icon === "plastic" ? "PET" : item.icon === "cardboard" ? "CARDBOARD" : item.icon.toUpperCase()}</span></div><div className="listing-content"><div className="listing-title"><div><h3>{lang === "ar" ? item.ar : item.name}</h3><small>{item.status === "Price pending" ? text.pending : text.reference}</small></div><Tag size={17} /></div><div className="listing-meta"><span><PackageSearch size={15} />{item.weight}</span><span><Globe2 size={15} />{lang === "ar" ? item.locationAr : item.locationEn}</span></div><div className="listing-bottom"><strong>{item.status === "Price pending" ? (lang === "ar" ? "السعر قيد التجهيز" : "Price pending") : (lang === "ar" ? "قيمة مرجعية" : "Reference value")}</strong><button onClick={() => toast.info(lang === "ar" ? "ستحتاج هذه الخطوة إلى تسجيل الدخول لاحقًا." : "Sign in will be required for contact messaging.")}><UsersRound size={15} />{lang === "ar" ? "تواصل" : "Contact seller"}</button></div></div></article>; }

function HowItWorks({ lang }: { text: Copy; lang: Lang }) { return <div className="page container content-page"><div className="page-heading"><span className="eyebrow"><Zap size={15} />{lang === "ar" ? "كيف تعمل إنِرسيرا" : "How Enercyra works"}</span><h1>{lang === "ar" ? "من الصورة إلى فرصة عمل." : "From image to business opportunity."}</h1><p>{lang === "ar" ? "ثلاث خطوات تجعل المادة أوضح وأسهل في الوصول إلى الاتصال المناسب." : "Three clear steps make a material easier to understand and easier to connect."}</p></div><div className="flow-grid"><FlowCard n="01" icon={<Sparkles />} title={lang === "ar" ? "صنّف" : "Classify"} copy={lang === "ar" ? "ارفع صورة. يحدد MobileNet نوع المادة من بين 37 فئة." : "Upload an image. MobileNet identifies the material across 37 categories."} /><FlowCard n="02" icon={<BarChart3 />} title={lang === "ar" ? "احسب" : "Calculate"} copy={lang === "ar" ? "أدخل الوزن وشاهد القيمة والطاقة كتقديرات مرجعية واضحة." : "Add weight and see clearly labeled reference value and energy estimates."} /><FlowCard n="03" icon={<UsersRound />} title={lang === "ar" ? "تواصل" : "Connect"} copy={lang === "ar" ? "انشر المادة واعثر على مشترين محتملين عبر السوق." : "Publish the material and find potential buyers through the marketplace."} /></div><div className="principles-card"><div><ShieldCheck size={23} /><h3>{lang === "ar" ? "مصمم بوضوح" : "Designed for clarity"}</h3></div><p>{lang === "ar" ? "نفرّق دائمًا بين نتيجة النموذج وبين التقديرات المرجعية. لا يوجد سعر مخفي أو رقم معروض كحقيقة سوقية دون وسم." : "We keep model output separate from reference estimates. No hidden price or number is presented as a market fact without a label."}</p></div></div>; }
function FlowCard({ n, icon, title, copy: description }: { n: string; icon: React.ReactNode; title: string; copy: string }) { return <div className="flow-card"><span className="flow-number">{n}</span><div className="feature-icon">{icon}</div><h2>{title}</h2><p>{description}</p><ArrowRight className="feature-arrow" size={19} /></div>; }
function About({ lang }: { text: Copy; lang: Lang }) { return <div className="page container content-page"><div className="about-panel"><div><span className="eyebrow"><Leaf size={15} />Enercyra</span><h1>{lang === "ar" ? "رؤية أوضح للنفايات. فرصة أفضل للأعمال." : "A clearer view of waste. A better business opportunity."}</h1><p>{lang === "ar" ? "إنِرسيرا منصة ذكاء نفايات تساعد المستخدمين والشركات على فهم المادة قبل اتخاذ الخطوة التالية." : "Enercyra is a waste intelligence platform that helps people and businesses understand a material before taking the next step."}</p></div><div className="about-mark"><BrandMark /><span>{lang === "ar" ? <>اكتشف النفايات.<br />اكتشف قيمتها.</> : <>See Waste.<br />See Value.</>}</span></div></div><div className="about-grid"><div><h3>{lang === "ar" ? "ما الذي نبنيه؟" : "What we are building"}</h3><p>{lang === "ar" ? "تجربة عملية تبدأ بالصورة وتنتهي بمعلومة أوضح واتصال تجاري محتمل." : "A practical experience that starts with a photo and ends with a clearer signal and a potential business connection."}</p></div><div><h3>{lang === "ar" ? "لمن؟" : "For whom?"}</h3><p>{lang === "ar" ? "للأفراد، جامعي النفايات، الشركات، والمشترين الذين يحتاجون إلى نقطة بداية واضحة." : "For individuals, collectors, companies, and buyers who need a clearer starting point."}</p></div></div></div>; }

function MyListings({ lang }: { text: Copy; lang: Lang }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const mine = trpc.marketplace.mine.useQuery(undefined, { enabled: Boolean(user) });
  const remove = trpc.marketplace.remove.useMutation({ onSuccess: () => mine.refetch(), onError: () => toast.error(lang === "ar" ? "تعذر حذف الإعلان." : "The listing could not be deleted.") });
  if (loading || (user && mine.isLoading)) return <div className="page container empty-state"><Sparkles className="spin" /><h2>{lang === "ar" ? "جارٍ التحقق من الإعلانات" : "Loading listings"}</h2></div>;
  if (!user) return <div className="page container auth-card"><LogIn size={35} /><h1>{lang === "ar" ? "سجّل الدخول للوصول إلى إعلاناتك" : "Sign in to access your listings"}</h1><p>{lang === "ar" ? "النشر وإدارة الإعلانات محميان بتسجيل الدخول." : "Publishing and listing management are protected by sign-in."}</p><button className="btn btn-primary" onClick={() => startLogin()}><LogIn size={17} />{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</button></div>;
  return <div className="page container content-page"><div className="market-heading"><div><span className="eyebrow"><UserRound size={15} />{lang === "ar" ? "حسابك" : "Your account"}</span><h1>{lang === "ar" ? "إعلاناتي" : "My Listings"}</h1><p>{lang === "ar" ? "إعلاناتك المنشورة والمملوكة لحسابك." : "Your published materials owned by this account."}</p></div><button className="btn btn-primary" onClick={() => navigate("/publish")}><Tag size={17} />{lang === "ar" ? "نشر مادة" : "Publish material"}</button></div>{!mine.data?.length ? <div className="empty-state"><PackageSearch size={38} /><h3>{lang === "ar" ? "لا توجد إعلانات بعد" : "No listings yet"}</h3><p>{lang === "ar" ? "انشر أول مادة لك من صفحة النتيجة." : "Publish your first material from the result page."}</p></div> : <div className="market-grid">{mine.data.map((listing) => <article className="listing-card" key={listing.id}><div className="listing-content"><div className="listing-title"><div><h3>{lang === "ar" ? listing.displayNameAr : listing.displayNameEn}</h3><small>{listing.location}</small></div><Tag size={17} /></div><div className="listing-meta"><span><PackageSearch size={15} />{listing.weightKg} kg</span><span><CircleHelp size={15} />{listing.status}</span></div><div className="listing-bottom"><strong>{lang === "ar" ? "إعلانك" : "Your listing"}</strong><button onClick={() => remove.mutate({ id: listing.id })} disabled={remove.isPending}><Trash2 size={15} />{lang === "ar" ? "حذف" : "Delete"}</button></div></div></article>)}</div>}</div>;
}
function Footer({ lang }: { lang: Lang }) { return <footer className="site-footer container"><div><BrandMark /><strong>Enercyra</strong><small>{lang === "ar" ? "اكتشف النفايات. اكتشف قيمتها." : "See Waste. See Value."}</small></div><span>© 2026 Enercyra. {lang === "ar" ? "التقديرات مرجعية." : "Reference estimates only."}</span><div className="footer-links"><Link href="/about">{lang === "ar" ? "من نحن" : "About"}</Link><Link href="/how-it-works">{lang === "ar" ? "كيف تعمل" : "How it works"}</Link></div></footer>; }

export default App;

function Publish({ lang }: { text: Copy; lang: Lang }) {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const [location, setLocation] = useState("");
  const [weight, setWeight] = useState("10");
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [classification] = useState<{ source?: "model" | "demo"; modelClassId?: string; classId: string; displayNameEn: string; displayNameAr: string; confidence?: number; imageName?: string; imageDataUrl?: string }>(() => { try { return JSON.parse(window.sessionStorage.getItem("enercyra-classification") || "null") || { source: "demo", classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك" }; } catch { return { source: "demo", classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك" }; } });
  const createListing = trpc.marketplace.create.useMutation({
    onSuccess: () => { toast.success(lang === "ar" ? "تم نشر المادة." : "Material published."); navigate("/my-listings"); },
    onError: () => toast.error(lang === "ar" ? "تعذر نشر المادة الآن." : "The material could not be published yet."),
  });
  if (loading) return <div className="page container empty-state"><Sparkles className="spin" /><h2>{lang === "ar" ? "جارٍ التحقق من الدخول" : "Checking sign-in"}</h2></div>;
  if (!user) return <div className="page container auth-card"><LogIn size={35} /><h1>{lang === "ar" ? "سجّل الدخول للنشر" : "Sign in to publish"}</h1><p>{lang === "ar" ? "يمكنك تصفح الموقع دون دخول، لكن نشر المواد وإدارتها يحتاجان إلى حساب." : "You can browse publicly, but publishing and managing materials requires an account."}</p><button className="btn btn-primary" onClick={() => startLogin()}><LogIn size={17} />{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</button></div>;
  return <div className="page container narrow-page"><div className="page-heading"><span className="eyebrow"><Tag size={15} />{lang === "ar" ? "إعلان جديد" : "New listing"}</span><h1>{lang === "ar" ? "انشر مادة في السوق." : "Publish material."}</h1><p>{lang === "ar" ? "أضف التفاصيل التي تساعد المشتري المحتمل على فهم الإعلان." : "Add the details a potential buyer needs to understand the listing."}</p></div><form className="benefit-panel publish-form" onSubmit={(event) => { event.preventDefault(); createListing.mutate(buildListingPayload(classification, { weightKg: Number(weight), location, condition, notes })); }}><div className="form-grid"><label>{lang === "ar" ? "المادة" : "Material"}<input value={lang === "ar" ? classification.displayNameAr : classification.displayNameEn} readOnly /></label><label>{lang === "ar" ? "الوزن (كجم)" : "Weight (kg)"}<input type="number" min="0.1" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} required /></label><label>{lang === "ar" ? "الموقع" : "Location"}<input placeholder={lang === "ar" ? "مثال: القاهرة" : "e.g. Cairo"} value={location} onChange={(event) => setLocation(event.target.value)} required /></label><label>{lang === "ar" ? "الحالة" : "Condition"}<input placeholder={lang === "ar" ? "نظيفة / مختلطة" : "Clean / mixed"} value={condition} onChange={(event) => setCondition(event.target.value)} /></label></div><label>{lang === "ar" ? "ملاحظات" : "Notes"}<textarea rows={5} placeholder={lang === "ar" ? "أضف أي تفاصيل عن المادة" : "Add details about the material"} value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="notice"><CircleHelp size={16} />{lang === "ar" ? "سيظهر الإعلان كقيمة مرجعية أو سعر قيد التجهيز، ولا يمثل عرضًا تجاريًا ملزمًا." : "The listing will show a reference or pending price and is not a binding commercial offer."}</div><div className="result-actions"><button className="btn btn-primary" type="submit" disabled={createListing.isPending}><PackageSearch size={17} />{createListing.isPending ? (lang === "ar" ? "جارٍ النشر" : "Publishing") : (lang === "ar" ? "نشر الإعلان" : "Publish listing")}</button><button className="btn btn-secondary" type="button" onClick={() => navigate("/result")}><ArrowLeft size={17} />{lang === "ar" ? "رجوع" : "Back"}</button></div></form></div>;
}
