import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link, Route, Switch, useLocation, useRoute } from "wouter";
import {
  ArrowLeft,
  BadgeDollarSign,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  Filter,
  Globe2,
  Grid2X2,
  Handshake,
  Leaf,
  Lightbulb,
  ListFilter,
  LogIn,
  Mail,
  MapPin,
  Menu,
  Moon,
  PackageSearch,
  QrCode,
  Recycle,
  Search,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Sun,
  Tag,
  Target,
  Trash2,
  Upload,
  UserRound,
  Phone,
  ExternalLink,
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
import { energyRecoveryLabel, notebookReferenceNotice, pendingDataNotice, pendingMetricLabel, pendingMetricStatus } from "../../shared/result-copy";
import { mapInferenceToClassification, type StoredClassification } from "../../shared/classification-contract";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

const referenceData = mobileNetReferenceCatalog.map((item) => ({ id: item.id, en: item.displayNameEn, ar: item.displayNameAr, category: item.category, status: item.status, price: item.priceEgpPerKg, lhv: item.lhvMjPerKg, combustible: item.combustible, sourceNote: item.sourceNote, disclaimer: item.disclaimer }));

const egyptianBusinesses = [
  { id: "bekia", name: "Bekia", arName: "بيكيا", type: "Collection & recycling platform", arType: "منصة جمع وإعادة تدوير", city: "Giza", arCity: "الجيزة", address: "42 El-Madina El-Monawwara, Doqi, Dokki, Giza Governorate", arAddress: "42 شارع المدينة المنورة، الدقي، محافظة الجيزة", phone: ["01125428292", "01008366291"], email: "hello@bekia-egypt.com", website: "https://bekia-egypt.com/", materials: ["Plastic", "Paper", "Metal", "Electronics"], arMaterials: ["بلاستيك", "ورق", "معادن", "إلكترونيات"], source: "Official Bekia website" },
  { id: "eerc", name: "Egyptian Electronics Recycling Co. (EERC)", arName: "الشركة المصرية لإعادة تدوير الإلكترونيات", type: "E-waste recycling", arType: "إعادة تدوير المخلفات الإلكترونية", city: "6th of October", arCity: "السادس من أكتوبر", address: "787, Industrial Zone, 6th of October, Egypt", arAddress: "787، المنطقة الصناعية، السادس من أكتوبر، مصر", phone: ["01062218955", "01116604831"], email: "info@eerc-group.com", website: "https://eerc-group.com/contact-us/", materials: ["Computers", "Phones", "Cables", "Screens"], arMaterials: ["أجهزة كمبيوتر", "هواتف", "كابلات", "شاشات"], source: "Official EERC contact page" },
  { id: "geocycle", name: "Geocycle Egypt", arName: "جيوسايكل مصر", type: "Industrial waste management", arType: "إدارة المخلفات الصناعية", city: "New Cairo / Suez", arCity: "القاهرة الجديدة / السويس", address: "Summit 15, El Teseen St., Sector One, 5th Settlement, Cairo", arAddress: "سَمِت 15، شارع التسعين، القطاع الأول، التجمع الخامس، القاهرة", phone: [], email: "INFO-EGYPT@GEOCYCLE.COM", website: "https://www.geocycle.com/geocycle-egypt", materials: ["Industrial waste", "Plastic", "Paper", "Tires"], arMaterials: ["مخلفات صناعية", "بلاستيك", "ورق", "إطارات"], source: "Official Geocycle Egypt page" },
  { id: "ecaru", name: "ECARU", arName: "إيكارو", type: "Solid waste management & MRF", arType: "إدارة المخلفات الصلبة ومرافق الفرز", city: "El Obour", arCity: "العبور", address: "El Obour City, First Industrial Zone, Block No. 12013", arAddress: "مدينة العبور، المنطقة الصناعية الأولى، قطعة رقم 12013", phone: ["+20244891061", "+20244891062", "+20244891164"], email: "info@ecaru.net", website: "https://ecaru.net/en/Contact", materials: ["Municipal solid waste", "Compost", "Alternative solid fuel"], arMaterials: ["مخلفات صلبة بلدية", "سماد عضوي", "وقود بديل"], source: "Official ECARU contact page" },
  { id: "altawheed", name: "Al-Tawhid Environmental Services / I Recycle", arName: "التوحيد للخدمات البيئية / آي ريسايكل", type: "Collection, sorting & waste purchasing", arType: "جمع وفرز وشراء المخلفات", city: "6th of October", arCity: "السادس من أكتوبر", address: "Extension of Sixth Industrial Zone, Plot 53, 6th of October City, Giza", arAddress: "امتداد المنطقة الصناعية السادسة، قطعة 53، مدينة السادس من أكتوبر، الجيزة", phone: ["01157570643", "+20238295280"], email: "info@altawheed.co", website: "https://irecycle-eg.com/index-en.html", materials: ["Glass", "Wood", "Paper", "Cardboard", "Metals", "Plastic"], arMaterials: ["زجاج", "أخشاب", "ورق", "كرتون", "معادن", "بلاستيك"], source: "Official I Recycle / Al-Tawhid page" },
  { id: "banlastic", name: "Banlastic Egypt", arName: "بانلاستيك مصر", type: "Plastic pollution & recycling initiatives", arType: "مبادرات البلاستيك وإعادة التدوير", city: "Alexandria", arCity: "الإسكندرية", address: "23 El Nasr St., El Mansheya, Alexandria, Egypt", arAddress: "23 شارع النصر، المنشية، الإسكندرية، مصر", phone: ["+201003042404"], email: "info@banlasticegypt.com", website: "https://banlasticegypt.com/", materials: ["Single-use plastics", "Plastic", "Metals"], arMaterials: ["بلاستيك أحادي الاستخدام", "بلاستيك", "معادن"], source: "Official Banlastic Egypt website" },
  { id: "elshams", name: "El Shams Recycling", arName: "الشمس لإعادة التدوير", type: "Alternative fuel & organic fertilizer", arType: "وقود بديل وسماد عضوي", city: "Egypt", arCity: "مصر", address: "Not listed publicly on the reviewed official page", arAddress: "لم يُذكر العنوان علنًا في الصفحة الرسمية التي تمت مراجعتها", phone: ["+201208020202"], email: "info@elshamsrecycling.com", website: "https://elshamsrecycling.com/", materials: ["Agricultural waste", "Plastic", "Solid waste"], arMaterials: ["مخلفات زراعية", "بلاستيك", "مخلفات صلبة"], source: "Official El Shams Recycling website" },
] as const;


type Lang = "en" | "ar";
type Currency = "EGP" | "SAR" | "USD" | "EUR";
const displayCurrencyRates: Record<Currency, number> = { EGP: 1, SAR: 0.077, USD: 0.0205, EUR: 0.0175 };

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
    nav: { dashboard: "Dashboard", classify: "Classify", marketplace: "Marketplace", businesses: "Businesses", how: "How It Works", about: "About" },
    heroTitle: "See Waste. See Value.",
    heroSub: "AI-powered waste classification, reference value estimation, and energy insights.",
    classify: "Classify Waste",
    marketplace: "Explore Marketplace",
    featureTitle: "Turn a photo into a business signal.",
    featureCopy: "Enercyra helps you identify materials, understand reference estimates, and find the next useful connection.",
    valueTitle: "Reference estimates",
    valueCopy: "Review price status, LHV, MJ, and kWh when catalog data is available.",
    connectTitle: "Buyer discovery",
    connectCopy: "Find relevant businesses and recycling partners for the classified material.",
    uploadTitle: "Drag & drop your image here",
    uploadSub: "or browse from your device",
    choose: "Choose Image",
    camera: "Use Camera",
    reference: "Reference listing",
    pending: "Price pending",
  },
  ar: {
    nav: { dashboard: "لوحة التحكم", classify: "التصنيف", marketplace: "السوق", businesses: "الشركات", how: "كيف تعمل المنصة", about: "من نحن" },
    heroTitle: "شوف النفايات شوف قيمتها",
    heroSub: "منصة ذكية لتصنيف النفايات وتقدير قيمتها ومحتواها الطاقي وربطها بفرص الأعمال", 
    classify: "صنّف نفاياتك",
    marketplace: "استكشف السوق",
    featureTitle: "حوّل الصورة إلى إشارة تجارية",
    featureCopy: "تساعدك إنِرسيرا على معرفة نوع المادة وفهم التقديرات المرجعية والوصول إلى الاتصال المناسب",
    valueTitle: "تقديرات مرجعية",
    valueCopy: "راجع حالة السعر وLHV وMJ وkWh عند توافر بيانات الكتالوج",
    connectTitle: "اكتشف المشترين",
    connectCopy: "اعثر على شركات وشركاء إعادة تدوير مناسبين للمادة المصنّفة",
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
  const [currency, setCurrency] = useState<Currency>(() => (window.localStorage.getItem("enercyra-currency") as Currency) || "EGP");
  useEffect(() => { window.localStorage.setItem("enercyra-currency", currency); }, [currency]);
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
            <Route path="/classify" component={() => <Classify text={text} lang={lang} currency={currency} setCurrency={setCurrency} />} />
            <Route path="/result" component={() => <Result text={text} lang={lang} currency={currency} setCurrency={setCurrency} />} />
            <Route path="/marketplace/:id" component={() => <ListingDetail text={text} lang={lang} />} />
            <Route path="/marketplace" component={() => <Marketplace text={text} lang={lang} />} />
            <Route path="/businesses" component={() => <Businesses lang={lang} />} />
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
    ["/businesses", "Businesses", "الشركات", Building2],
    ["/how-it-works", "How It Works", "كيف تعمل المنصة", CircleHelp],
    ["/about", "About", "من نحن", UserRound],
  ] as const;
  return (
    <header className="site-header">
      <Link href="/" className="brand-link">
        <BrandMark className="brand-mark-header" />
        <span className="brand-copy"><strong>Enercyra</strong><small>{lang === "ar" ? "اكتشف النفايات، اكتشف قيمتها" : "See Waste. See Value."}</small></span>
      </Link>
      <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`}>
        {links.map(([href, en, ar, Icon]) => <Link key={href} href={href} className="nav-link"><Icon size={16} />{lang === "ar" ? ar : text.nav[en === "Dashboard" ? "dashboard" : en === "Classify" ? "classify" : en === "Marketplace" ? "marketplace" : en === "Businesses" ? "businesses" : en === "How It Works" ? "how" : "about"]}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Switch language" onClick={() => setLang(lang === "en" ? "ar" : "en")}><Globe2 size={17} /><span>{lang === "en" ? "العربية" : "English"}</span></button>
        <button className="theme-toggle" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDark(!dark)}>{dark ? <Moon size={16} /> : <Sun size={16} />}<span className="toggle-dot" /></button>
        {user ? <Link href="/my-listings" className="avatar-button"><UserRound size={17} /></Link> : <button className="login-button" onClick={() => startLogin()}><LogIn size={16} />{lang === "ar" ? "دخول" : "Sign in"}</button>}
        <button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
  );
}

const ENERCYRA_MARK_URL = "/manus-storage/enercyra-circular-mark_43fba3fa.png";

function BrandMark({ className = "" }: { className?: string }) { return <img className={`brand-mark ${className}`} src={ENERCYRA_MARK_URL} alt="" aria-hidden="true" />; }

function Home({ text, lang }: { text: Copy; lang: Lang }) {
  return <div className="page home-page">
    <section className="hero container">
      <div className="hero-copy">
        <h1><span>{lang === "ar" ? "شوف النفايات" : "See Waste."}</span><span>{lang === "ar" ? "شوف قيمتها" : "See Value."}</span></h1>
        <span className="hero-rule" aria-hidden="true" />
        <p>{text.heroSub}</p>
        <div className="hero-actions"><Link href="/classify" className="btn btn-primary"><Sparkles size={18} />{text.classify}<ArrowRight size={17} /></Link><Link href="/marketplace" className="btn btn-secondary"><PackageSearch size={18} />{text.marketplace}<ArrowRight size={17} /></Link></div>
      </div>
      <InteractiveHeroVisual lang={lang} />
    </section>
    <section className="feature-strip container"><FeatureCard href="/classify" icon={<ScanSearch />} title={lang === "ar" ? "تعرّف على المادة" : "Material identification"} copy={lang === "ar" ? "ارفع صورة ليحدد النموذج فئة المادة ودرجة الثقة" : "Upload one image to identify its material class and confidence."} /><FeatureCard href="/result" icon={<BadgeDollarSign />} title={text.valueTitle} copy={text.valueCopy} /><FeatureCard href="/businesses" icon={<Handshake />} title={text.connectTitle} copy={text.connectCopy} /><RecentAnalysis lang={lang} /></section>
  </div>;
}

function InteractiveHeroVisual({ lang }: { lang: Lang }) {
  return <div className="hero-visual hero-composed" data-hero-version="visible-connect-live-v1" aria-label={lang === "ar" ? "زجاجة بلاستيك وعلبة صفيح وزجاجة زجاج وكرتون ومخلفات عضوية حول مركز الطاقة" : "Plastic bottle, tin can, glass bottle, cardboard, and organic waste around an energy center"}>
    <div className="hero-grid" aria-hidden="true" /><div className="hero-glow hero-glow-one" aria-hidden="true" /><div className="hero-glow hero-glow-two" aria-hidden="true" />
    <div className="interactive-material-orbit" aria-label={lang === "ar" ? "زجاجة بلاستيك وعلبة صفيح وزجاجة زجاج وكرتون ومخلفات عضوية تتحرك حول مركز طاقة" : "Plastic bottle, tin can, glass bottle, cardboard, and organic waste moving around an energy core"}>
      <span className="energy-ring energy-ring-outer" /><span className="energy-ring energy-ring-middle" /><span className="energy-ring energy-ring-inner" /><span className="energy-wave energy-wave-one" /><span className="energy-wave energy-wave-two" />
      <span className="energy-particle particle-a" /><span className="energy-particle particle-b" /><span className="energy-particle particle-c" /><span className="energy-particle particle-d" /><span className="energy-particle particle-e" /><span className="energy-particle particle-f" />
      <span className="material-object material-bottle" tabIndex={0} role="img" aria-label={lang === "ar" ? "زجاجة بلاستيكية" : "Plastic bottle"}><img src="/manus-storage/enercyra-plastic-bottle-hero_1a2f45aa.webp" alt="" aria-hidden="true" /></span><span className="material-object material-can" tabIndex={0} role="img" aria-label={lang === "ar" ? "علبة معدنية" : "Metal can"}><img src="/manus-storage/enercyra-can-hero_941405f5.webp" alt="" aria-hidden="true" /></span><span className="material-object material-glass" tabIndex={0} role="img" aria-label={lang === "ar" ? "زجاجة زجاجية" : "Glass bottle"}><img src="/manus-storage/enercyra-glass-bottle-clear-v2_0adf2f18.webp" alt="" aria-hidden="true" /></span><span className="material-object material-cardboard" tabIndex={0} role="img" aria-label={lang === "ar" ? "كرتون" : "Cardboard"}><img src="/manus-storage/enercyra-cardboard-hero_14d3326e.webp" alt="" aria-hidden="true" /></span><span className="material-object material-organic" tabIndex={0} role="img" aria-label={lang === "ar" ? "مخلفات عضوية" : "Organic waste"}><img src="/manus-storage/enercyra-organic-hero_5ad406e3.webp" alt="" aria-hidden="true" /></span>
      <span className="energy-core"><BrandMark /><span className="core-pulse" /></span>
    </div>
    <a className="hero-function-label label-connect" href="/businesses" aria-label={lang === "ar" ? "تواصل مع المشترين" : "Connect with buyers"}><UsersRound size={13} /><span>{lang === "ar" ? "تواصل" : "CONNECT"}</span><small>{lang === "ar" ? "السوق والشركات" : "MARKETPLACE"}</small></a>
    <div className="hero-function-label label-classify"><Sparkles size={13} /><span>{lang === "ar" ? "تصنيف" : "CLASSIFY"}</span><small>{lang === "ar" ? "MobileNet AI" : "MobileNet AI"}</small></div><div className="hero-function-label label-calculate"><BarChart3 size={13} /><span>{lang === "ar" ? "حساب" : "CALCULATE"}</span><small>{lang === "ar" ? "القيمة + الطاقة" : "VALUE + ENERGY"}</small></div>
    <div className="hero-corner corner-tl" aria-hidden="true" /><div className="hero-corner corner-br" aria-hidden="true" />
  </div>;
}

function FeatureCard({ href, icon, title, copy: description }: { href: string; icon: React.ReactNode; title: string; copy: string }) { return <a href={href} className="feature-card"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{description}</p><ArrowRight className="feature-arrow" size={18} /></a>; }
function Step({ n, title }: { n: string; title: string }) { return <div className="step"><span>{n}</span><strong>{title}</strong></div>; }
function WasteOrbit() { return <div className="waste-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-ring ring-three" /><div className="orbit-core"><BrandMark /></div><div className="waste-object bottle">♢</div><div className="waste-object can">◒</div><div className="waste-object cardboard">▤</div><div className="waste-object glass">◉</div><div className="waste-object organic">✦</div></div>; }
function readRecentClassification(): StoredClassification | null {
  try {
    const raw = window.sessionStorage.getItem("enercyra-classification");
    return raw ? JSON.parse(raw) as StoredClassification : null;
  } catch {
    return null;
  }
}

function RecentAnalysis({ lang }: { lang: Lang }) {
  const [classification, setClassification] = useState<StoredClassification | null>(() => readRecentClassification());
  useEffect(() => {
    const refresh = () => setClassification(readRecentClassification());
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    return () => { window.removeEventListener("focus", refresh); window.removeEventListener("pageshow", refresh); };
  }, []);
  const item = classification ? referenceData.find((entry) => entry.id === classification.classId) : null;
  const name = classification ? (lang === "ar" ? classification.displayNameAr : classification.displayNameEn) : "";
  const confidence = classification?.confidence != null ? `${(classification.confidence * 100).toFixed(1)}%` : "";
  const confidenceLabel = classification?.confidence != null ? (classification.confidence >= 0.8 ? (lang === "ar" ? "ثقة عالية" : "High confidence") : classification.confidence >= 0.5 ? (lang === "ar" ? "ثقة متوسطة" : "Medium confidence") : (lang === "ar" ? "ثقة منخفضة" : "Low confidence")) : "";
  const materialCode = (item?.id ?? classification?.classId ?? "material").slice(0, 4).toUpperCase();
  return <div className="recent-card"><div className="recent-header"><span><BarChart3 size={17} />{lang === "ar" ? "أحدث تحليل" : "Recent Analysis"}</span><Link href={classification ? "/result" : "/classify"}>{classification ? (lang === "ar" ? "عرض الكل" : "View all") : (lang === "ar" ? "ابدأ" : "Start")}<ArrowRight size={15} /></Link></div>{classification ? <div className="recent-result"><div className="recent-row"><div className="recent-image">{classification.imageDataUrl ? <img src={classification.imageDataUrl} alt={name} /> : <div className="mini-material">{materialCode}</div>}</div><div><strong>{name || materialCode}</strong><small>{confidenceLabel} · {confidence}</small>{classification.imageName && <small className="recent-filename">{classification.imageName}</small>}</div><div className="recent-stat"><small>{lang === "ar" ? "حالة القيمة" : "Value status"}</small><strong>{item?.price !== null && item?.price !== undefined ? (lang === "ar" ? "متاح" : "Available") : "—"}</strong></div><div className="recent-stat"><small>{lang === "ar" ? "حالة الطاقة" : "Energy status"}</small><strong>{item?.lhv !== null && item?.lhv !== undefined ? (lang === "ar" ? "متاح" : "Available") : "—"}</strong></div></div></div> : <div className="recent-empty"><strong>{lang === "ar" ? "لا توجد تحليلات بعد" : "No analyses yet"}</strong><small>{lang === "ar" ? "ارفع صورة لتظهر أحدث نتيجة هنا." : "Upload an image to show your latest result here."}</small></div>}</div>;
}

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

function Classify({ text, lang, currency, setCurrency }: { text: Copy; lang: Lang; currency: Currency; setCurrency: (value: Currency) => void }) {
  const [, navigate] = useLocation();
  const classifyMutation = trpc.inference.classify.useMutation();
  const onFile = async (file: File) => {
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
  return <div className="page container narrow-page"><div className="page-heading"><h1>{lang === "ar" ? "صنّف نفاياتك بالذكاء الاصطناعي" : <><span>Classify </span><span className="heading-accent">Your Waste</span></>}</h1><p>{lang === "ar" ? "ارفع صورة ودع إنِرسيرا تتعرّف على المادة" : "Upload an image and let Enercyra identify the material"}</p></div><div className="classify-grid"><label className="upload-card"><input type="file" accept="image/*" capture="environment" onChange={(event) => event.target.files?.[0] && onFile(event.target.files[0])} /><CloudUpload size={46} /><strong>{busy ? (lang === "ar" ? "جارٍ تحليل الصورة..." : "Analyzing image...") : text.uploadTitle}</strong><span>{busy ? (lang === "ar" ? "يتم تشغيل MobileNetV3" : "Running MobileNetV3") : text.uploadSub}</span><button type="button" className="btn btn-primary" disabled={busy} onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}><Upload size={17} />{text.choose}</button><button type="button" className="btn btn-secondary" disabled={busy} onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}><Camera size={17} />{text.camera}</button><small><ShieldCheck size={14} />{lang === "ar" ? "تُحلّل الصورة بأمان ولا تُنشر تلقائيًا" : "Images are processed securely and never published automatically"}</small></label><div className="benefit-panel"><h3>{lang === "ar" ? "ماذا ستعرف عن نفاياتك" : "What you’ll get"}</h3><Benefit icon={<Leaf />} title={lang === "ar" ? "فئة النفايات" : "Waste category"} copy={lang === "ar" ? "تعرّف على نوع المادة" : "Identify the material type"} /><Benefit icon={<Target />} title={lang === "ar" ? "درجة الثقة" : "Confidence score"} copy={lang === "ar" ? "اطّلع على درجة ثقة النموذج" : "See how confident the AI is"} /><Benefit icon={<BarChart3 />} title={lang === "ar" ? "القيمة والطاقة المرجعية" : "Reference value & energy"} copy={lang === "ar" ? "اعرف القيمة والطاقة التقديرية" : "Get estimated value and energy potential"} /><div className="progress-steps"><span className="active">1</span><i /><span>2</span><i /><span>3</span><p>{lang === "ar" ? "ارفع، حلّل، انشر" : "Upload, analyze, publish"}</p></div></div></div><div className="demo-note" aria-live="polite"><Lightbulb size={17} /><span>{lang === "ar" ? "التحليل الحقيقي متاح الآن: سيعرض MobileNetV3 الفئة ودرجة الثقة قبل الحسابات المرجعية." : "Live MobileNetV3 inference is enabled and returns the class and confidence before reference calculations."}</span><button className="text-button" onClick={() => navigate("/result")}>{lang === "ar" ? "عرض نتيجة توضيحية" : "View example result"}<ArrowRight size={15} /></button></div></div>;
}
function Benefit({ icon, title, copy: description }: { icon: React.ReactNode; title: string; copy: string }) { return <div className="benefit"><span>{icon}</span><div><strong>{title}</strong><small>{description}</small></div></div>; }

type PublishDraft = { weight?: string; displayNameEn?: string; displayNameAr?: string; category?: string; imageDataUrl?: string; condition?: string };
function readPublishDraft(): PublishDraft { try { return JSON.parse(window.sessionStorage.getItem("enercyra-publish-draft") || "null") || {}; } catch { return {}; } }
function Result({ text, lang, currency, setCurrency }: { text: Copy; lang: Lang; currency: Currency; setCurrency: (value: Currency) => void }) {
  const [weight, setWeight] = useState("");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [classification] = useState<StoredClassification>(() => {
    try { return JSON.parse(window.sessionStorage.getItem("enercyra-classification") || "") as StoredClassification; } catch { return { source: "demo", classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك", confidence: 0.968 }; }
  });
  const item = referenceData.find((entry) => entry.id === classification.classId) ?? referenceData.find((entry) => entry.id === "plastic") ?? referenceData[0];
  const confidence = classification.confidence ?? 0.968;
  const parsedWeight = parseWeightInput(weight);
  const hasWeight = parsedWeight !== null && parsedWeight > 0;
  const estimate = calculateEstimate(parsedWeight, { priceEgpPerKg: item.price, lhvMjPerKg: item.lhv, status: item.status });
  const displayRate = displayCurrencyRates[currency];
  const displayUnit = currency;
  const displayValue = hasWeight && estimate.valueEgp !== null ? (estimate.valueEgp * displayRate).toFixed(2) : "—";
  const referencePriceValue = item.price !== null ? (item.price * displayRate).toFixed(2) : "—";
  const energy = estimate.energyMj;
  const confidenceLabel = confidence >= 0.8 ? (lang === "ar" ? "ثقة عالية" : "High confidence") : confidence >= 0.5 ? (lang === "ar" ? "ثقة متوسطة" : "Medium confidence") : (lang === "ar" ? "ثقة منخفضة" : "Low confidence");
  const openPublish = () => { window.sessionStorage.setItem("enercyra-publish-draft", JSON.stringify({ weight, displayNameEn: classification.displayNameEn, displayNameAr: classification.displayNameAr, category: item.category, imageDataUrl: classification.imageDataUrl, condition: (classification as StoredClassification & { condition?: string }).condition })); if (user) navigate("/publish"); else { toast.info(lang === "ar" ? "يجب تسجيل الدخول للنشر." : "Sign in is required to publish."); startLogin(); } };
  return <div className="page container result-page" data-result-version="source-panel-removed-v4"><div className="page-heading compact"><span className="eyebrow"><Check size={15} />{lang === "ar" ? "تحليل مكتمل" : "Analysis complete"}</span><h1>{lang === "ar" ? "نتيجة تصنيف الذكاء الاصطناعي" : "AI Classification Result"}</h1><p>{lang === "ar" ? "راجع المادة المكتشفة ودرجة الثقة والتقديرات المرجعية." : "Review the detected material, confidence, and reference estimates."}</p></div><div className="result-card"><div className="material-preview">{classification.imageDataUrl ? <img className="uploaded-preview" src={classification.imageDataUrl} alt={lang === "ar" ? "الصورة المحللة" : "Analyzed waste"} /> : <div className="bottle-illustration">{item.en.slice(0, 4).toUpperCase()}</div>}</div><div className="result-main"><h2>{lang === "ar" ? item.ar : item.en}</h2><p>{lang === "ar" ? "الفئة المكتشفة" : "Detected category"}: <strong>{lang === "ar" ? item.ar : item.en}</strong></p><div className="confidence-ring"><div><strong>{(confidence * 100).toFixed(1)}%</strong><small>{lang === "ar" ? "ثقة النموذج" : "model confidence"}</small></div></div><span className="confidence-pill"><ShieldCheck size={15} />{confidenceLabel}</span></div><div className="material-details"><h3>{lang === "ar" ? "تفاصيل المادة" : "Material Details"}</h3><Detail icon={<Leaf />} label={lang === "ar" ? "الفئة" : "Category"} value={lang === "ar" ? item.category : item.category} /><Detail icon={<Tag />} label={lang === "ar" ? "المادة" : "Material"} value={lang === "ar" ? item.ar : item.en} /><Detail icon={<Zap />} label={lang === "ar" ? "إمكانية الاسترداد الطاقي" : "Energy recovery potential"} value={energyRecoveryLabel(lang, item.combustible)} /><div className="notice"><CircleHelp size={16} />{lang === "ar" ? "كل القيم أدناه تقديرات مرجعية وقد تختلف حسب السوق وجودة المادة." : "All figures below are Reference Estimates and may vary by market and material quality."}</div></div></div><div className="calculation-panel"><div className="calc-intro"><div className="feature-icon"><BarChart3 /></div><div><h3>{lang === "ar" ? "احسب القيمة والطاقة" : "Calculate Your Value"}</h3><p>{lang === "ar" ? "أدخل الوزن لمعرفة التقدير المرجعي." : "Enter the weight to see a reference estimate."}</p></div></div><div className="calculation-metrics"><div className="metric weight-metric"><div className="metric-label"><PackageSearch size={15} />{lang === "ar" ? "الوزن (كجم)" : "Weight (kg)"}</div><input type="text" inputMode="decimal" pattern="[0-9٠-٩.,٫]*" minLength={1} value={weight} placeholder={lang === "ar" ? "اكتب الوزن" : "Enter weight"} autoComplete="off" aria-describedby="weight-help" onInput={(event) => { const nextWeight = event.currentTarget.value; setWeight(nextWeight); window.sessionStorage.setItem("enercyra-publish-draft", JSON.stringify({ weight: nextWeight })); }} onChange={(event) => { const nextWeight = event.currentTarget.value; setWeight(nextWeight); window.sessionStorage.setItem("enercyra-publish-draft", JSON.stringify({ weight: nextWeight })); }} />{!hasWeight && <small id="weight-help" className="field-help">{lang === "ar" ? "أدخل وزنًا موجبًا" : "Enter a positive weight"}</small>}<label className="currency-control classify-currency" title={lang === "ar" ? "عملة عرض التقدير" : "Estimate display currency"}><span>{lang === "ar" ? "العملة" : "Currency"}</span><select aria-label={lang === "ar" ? "عملة التقدير" : "Estimate currency"} value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>{(["EGP", "SAR", "USD", "EUR"] as Currency[]).map((code) => <option key={code} value={code}>{code}</option>)}</select></label></div><Metric icon={<BadgeDollarSign size={15} />} lang={lang} label={lang === "ar" ? "السعر المرجعي" : "Reference price"} value={referencePriceValue} unit={`${currency}/kg`} pending={item.price === null} secondaryLabel={lang === "ar" ? "الطاقة الأصلية" : "Original energy"} secondaryValue={item.lhv === null ? "—" : item.lhv.toFixed(1)} secondaryUnit="MJ/kg" note={lang === "ar" ? "تقدير مرجعي حسب المادة" : "Reference estimate by material"} /><Metric icon={<BarChart3 size={15} />} lang={lang} label={lang === "ar" ? "القيمة المقدرة" : "Estimated value"} value={displayValue} unit={displayUnit} pending={estimate.valueEgp === null} empty={!hasWeight} /><Metric icon={<Zap size={15} />} lang={lang} label={lang === "ar" ? "الطاقة المقدرة" : "Estimated energy"} value={hasWeight && estimate.energyMj !== null ? estimate.energyMj.toFixed(1) : "—"} unit="MJ" pending={estimate.energyMj === null && item.combustible} notApplicable={!item.combustible} empty={!hasWeight} /></div><div className="result-actions"><button className="btn btn-primary" onClick={openPublish}><PackageSearch size={17} />{lang === "ar" ? "انشر في السوق" : "Publish to Marketplace"}<ArrowRight size={17} /></button><button className="btn btn-secondary" onClick={() => navigate("/classify")}><Camera size={17} />{lang === "ar" ? "صنّف صورة أخرى" : "Classify Another Image"}<ArrowRight size={17} /></button></div></div></div>;
}
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="detail-row"><span>{icon}</span><small>{label}</small><strong>{value}</strong></div>; }
function Metric({ icon, lang, label, value, unit, pending, empty, notApplicable, note, secondaryLabel, secondaryValue, secondaryUnit }: { icon?: React.ReactNode; lang: Lang; label: string; value: string; unit: string; pending?: boolean; empty?: boolean; notApplicable?: boolean; note?: string; secondaryLabel?: string; secondaryValue?: string; secondaryUnit?: string }) { const shownValue = notApplicable ? (lang === "ar" ? "غير منطبق" : "N/A") : empty ? "—" : pending ? pendingMetricLabel(lang) : value; const status = notApplicable ? (lang === "ar" ? "لا توجد طاقة حرارية للمادة" : "Not an energy-recovery material") : empty ? (lang === "ar" ? "أدخل الوزن" : "Enter weight") : pending ? pendingMetricStatus(lang) : (lang === "ar" ? "محسوب" : "Calculated"); return <div className={`metric${secondaryLabel ? " metric-with-reference" : ""}`}><small className="metric-label">{icon}{label}</small><strong>{shownValue} {!empty && !pending && !notApplicable && <em>{unit}</em>}</strong>{secondaryLabel && <div className="metric-secondary"><small>{secondaryLabel}</small><strong>{secondaryValue} <em>{secondaryUnit}</em></strong></div>}{note && <span className="metric-note">{note}</span>}<span className={empty || pending || notApplicable ? "pending" : "reference-tag"}>{status}</span></div>; }

type MarketplaceListing = { id: number; displayNameEn: string; displayNameAr: string; weightKg: string | number; location: string; contactPhone?: string | null; condition?: string | null; notes?: string | null; imageUrl?: string | null; imageMetadata?: string | null; status: string };
const EGYPT_GOVERNORATES = [
  ["Cairo", "القاهرة"], ["Alexandria", "الإسكندرية"], ["Giza", "الجيزة"], ["Qalyubia", "القليوبية"], ["Port Said", "بورسعيد"], ["Suez", "السويس"], ["Ismailia", "الإسماعيلية"], ["Damietta", "دمياط"], ["Dakahlia", "الدقهلية"], ["Sharqia", "الشرقية"], ["Gharbia", "الغربية"], ["Kafr El Sheikh", "كفر الشيخ"], ["Beheira", "البحيرة"], ["Fayoum", "الفيوم"], ["Beni Suef", "بني سويف"], ["Minya", "المنيا"], ["Assiut", "أسيوط"], ["Sohag", "سوهاج"], ["Qena", "قنا"], ["Luxor", "الأقصر"], ["Aswan", "أسوان"], ["Red Sea", "البحر الأحمر"], ["New Valley", "الوادي الجديد"], ["Matrouh", "مطروح"], ["North Sinai", "شمال سيناء"], ["South Sinai", "جنوب سيناء"], ["Monufia", "المنوفية"],
] as const;
function Marketplace({ text, lang }: { text: Copy; lang: Lang }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All materials");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const active = trpc.marketplace.list.useQuery();
  const listings = ((active.data ?? []) as MarketplaceListing[]).filter((item) => Boolean(item.imageUrl));
  const filtered = useMemo(() => listings.filter((item) => `${item.displayNameEn} ${item.displayNameAr} ${item.location}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All materials" || item.displayNameEn.toLowerCase().includes(filter.toLowerCase())) && (locationFilter === "All locations" || EGYPT_GOVERNORATES.some(([en, ar]) => en === locationFilter && [en, ar].some((name) => item.location.toLowerCase().includes(name.toLowerCase()))))), [listings, query, filter, locationFilter]);
  return <div className="page container marketplace-page"><div className="market-heading"><div><h1>{lang === "ar" ? "السوق" : "Marketplace"}</h1><p>{lang === "ar" ? "اعثر على المواد وتواصل مع المشترين المحتملين." : "Find waste materials and connect with potential buyers."}</p></div><Link href="/result" className="btn btn-primary"><Tag size={17} />{lang === "ar" ? "انشر مادة" : "Publish material"}</Link></div><div className="market-tools"><div className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={lang === "ar" ? "ابحث عن مادة أو موقع" : "Search material or location"} /></div><div className="select-field"><ListFilter size={17} /><select aria-label={lang === "ar" ? "نوع المادة" : "Material type"} value={filter} onChange={(event) => setFilter(event.target.value)}><option value="All materials">{lang === "ar" ? "كل المواد" : "All materials"}</option><option value="Plastic">{lang === "ar" ? "بلاستيك" : "Plastic"}</option><option value="Cardboard">{lang === "ar" ? "كرتون" : "Cardboard"}</option><option value="Paper">{lang === "ar" ? "ورق" : "Paper"}</option><option value="Glass">{lang === "ar" ? "زجاج" : "Glass"}</option></select><ChevronDown size={15} /></div><div className="select-field"><Globe2 size={17} /><select aria-label={lang === "ar" ? "الموقع" : "Location"} value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}><option value="All locations">{lang === "ar" ? "كل المواقع" : "All locations"}</option>{EGYPT_GOVERNORATES.map(([en, ar]) => <option key={en} value={en}>{lang === "ar" ? ar : en}</option>)}</select><ChevronDown size={15} /></div><button className="filter-button"><Filter size={17} />{lang === "ar" ? "فلاتر" : "Filters"}</button></div><div className="market-grid">{filtered.map((item) => <ListingCard key={item.id} item={item} lang={lang} text={text} />)}</div>{!active.isLoading && filtered.length === 0 && <div className="empty-state"><PackageSearch size={35} /><h3>{lang === "ar" ? "لا توجد إعلانات منشورة بعد" : "No published listings yet"}</h3><p>{lang === "ar" ? "انشر أول مادة حقيقية لتظهر هنا." : "Publish a real material listing to see it here."}</p><Link href="/publish" className="btn btn-primary"><Tag size={17} />{lang === "ar" ? "انشر مادة" : "Publish material"}<ArrowRight size={17} /></Link></div>}<div className="market-disclaimer"><CircleHelp size={16} />{lang === "ar" ? "الإعلانات والقيم تحتاج إلى التحقق قبل أي اتفاق تجاري." : "Listings and values may require verification before a business agreement."}</div></div>;
}
function ListingCard({ item, lang, text }: { item: MarketplaceListing; lang: Lang; text: Copy }) {
  const [, navigate] = useLocation();
  const title = lang === "ar" ? item.displayNameAr : item.displayNameEn;
  const openDetails = () => navigate(`/marketplace/${item.id}`);
  return <article className="listing-card listing-card-clickable" onClick={openDetails} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openDetails(); } }} role="link" tabIndex={0} aria-label={lang === "ar" ? `عرض تفاصيل ${title}` : `View details for ${title}`}><img className="listing-image" src={item.imageUrl || ""} alt={title} /><div className="listing-content"><div className="listing-title"><div><h3>{title}</h3><small>{item.status === "Price pending" ? text.pending : text.reference}</small></div><Tag size={17} /></div><div className="listing-meta"><span><PackageSearch size={15} />{item.weightKg} kg</span><span><Globe2 size={15} />{item.location}</span></div>{item.condition && <p className="listing-notes">{item.condition}</p>}<div className="listing-bottom"><strong>{item.status === "Price pending" ? (lang === "ar" ? "السعر قيد التجهيز" : "Price pending") : (lang === "ar" ? "قيمة مرجعية" : "Reference value")}</strong><button onClick={(event) => { event.stopPropagation(); toast.info(item.contactPhone || (lang === "ar" ? "لا يوجد رقم تواصل محفوظ لهذا الإعلان." : "No contact phone saved for this listing.")); }}><UsersRound size={15} />{lang === "ar" ? "تواصل" : "Contact"}</button></div></div></article>;
}
function ListingDetail({ lang, text }: { text: Copy; lang: Lang }) {
  const [, params] = useRoute("/marketplace/:id");
  const [, navigate] = useLocation();
  const active = trpc.marketplace.list.useQuery();
  const item = (active.data ?? []).find((listing) => listing.id === Number(params?.id)) as MarketplaceListing | undefined;
  if (active.isLoading) return <div className="page container empty-state"><Sparkles className="spin" /><h2>{lang === "ar" ? "جارٍ تحميل تفاصيل الإعلان" : "Loading listing details"}</h2></div>;
  if (!item) return <div className="page container empty-state"><PackageSearch size={38} /><h2>{lang === "ar" ? "الإعلان غير موجود" : "Listing not found"}</h2><button className="btn btn-primary" onClick={() => navigate("/marketplace")}><ArrowLeft size={17} />{lang === "ar" ? "العودة إلى السوق" : "Back to Marketplace"}</button></div>;
  const title = lang === "ar" ? item.displayNameAr : item.displayNameEn;
  const status = item.status === "Price pending" ? (lang === "ar" ? "السعر قيد التجهيز" : "Price pending") : (lang === "ar" ? "قيمة مرجعية" : "Reference value");
  return <div className="page container listing-detail-page"><button className="text-button listing-back" onClick={() => navigate("/marketplace")}><ArrowLeft size={17} />{lang === "ar" ? "العودة إلى السوق" : "Back to Marketplace"}</button><div className="listing-detail-card"><img className="listing-detail-image" src={item.imageUrl || ""} alt={title} /><div className="listing-detail-content"><span className="eyebrow"><Tag size={15} />{lang === "ar" ? "تفاصيل الإعلان" : "Listing details"}</span><h1>{title}</h1><p className="listing-detail-status">{status}</p><div className="listing-detail-grid"><div><span>{lang === "ar" ? "الوزن" : "Weight"}</span><strong>{item.weightKg} kg</strong></div><div><span>{lang === "ar" ? "الموقع" : "Location"}</span><strong>{item.location}</strong></div>{item.condition && <div><span>{lang === "ar" ? "الحالة" : "Condition"}</span><strong>{item.condition}</strong></div>}</div>{item.notes && <div className="listing-detail-notes"><span>{lang === "ar" ? "ملاحظات الناشر" : "Publisher notes"}</span><p>{item.notes}</p></div>}<button className="btn btn-primary" onClick={() => toast.info(item.contactPhone || (lang === "ar" ? "لا يوجد رقم تواصل محفوظ لهذا الإعلان." : "No contact phone saved for this listing."))}><UsersRound size={17} />{lang === "ar" ? "تواصل مع البائع" : "Contact seller"}</button></div></div></div>;
}
function Businesses({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [focus, setFocus] = useState("all");
  const isAr = lang === "ar";
  const cities = Array.from(new Set(egyptianBusinesses.map((business) => business.city)));
  const filtered = egyptianBusinesses.filter((business) => {
    const haystack = [business.name, business.arName, business.type, business.arType, business.city, business.arCity, ...business.materials, ...business.arMaterials].join(" ").toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesCity = city === "all" || business.city === city;
    const matchesFocus = focus === "all" || business.materials.some((material) => material.toLowerCase().includes(focus.toLowerCase()));
    return matchesQuery && matchesCity && matchesFocus;
  });
  return <div className="page container content-page businesses-page">
    <div className="page-heading businesses-heading"><span className="eyebrow"><Building2 size={15} />{isAr ? "دليل الأعمال البيئية" : "Verified business directory"}</span><h1>{isAr ? "الشركات" : "Businesses"}</h1><p>{isAr ? "شركات مصرية تعمل في جمع المخلفات أو إعادة تدويرها أو تحويلها إلى موارد. البيانات مأخوذة من المواقع الرسمية للشركات." : "Egyptian companies involved in collecting, recycling, recovering, or managing waste. Details are taken from official company websites."}</p><div className="business-stats"><span><strong>{egyptianBusinesses.length}</strong>{isAr ? " جهات مدرجة" : " verified listings"}</span><span><strong>{cities.length}</strong>{isAr ? " مناطق" : " areas"}</span><span><ShieldCheck size={15} />{isAr ? "بيانات منشورة علنًا" : "Publicly published data"}</span></div></div>
    <div className="business-tools"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isAr ? "ابحث باسم الشركة أو نوع المخلفات" : "Search company or material"} /></label><select value={city} onChange={(event) => setCity(event.target.value)} aria-label={isAr ? "تصفية حسب المنطقة" : "Filter by area"}><option value="all">{isAr ? "كل المناطق" : "All areas"}</option>{cities.map((item) => <option key={item} value={item}>{isAr ? egyptianBusinesses.find((business) => business.city === item)?.arCity : item}</option>)}</select><select value={focus} onChange={(event) => setFocus(event.target.value)} aria-label={isAr ? "تصفية حسب المادة" : "Filter by material"}><option value="all">{isAr ? "كل المواد" : "All materials"}</option><option value="plastic">{isAr ? "بلاستيك" : "Plastic"}</option><option value="electronics">{isAr ? "إلكترونيات" : "Electronics"}</option><option value="paper">{isAr ? "ورق وكرتون" : "Paper & cardboard"}</option><option value="metal">{isAr ? "معادن" : "Metals"}</option></select></div>
    <div className="business-grid">{filtered.map((business) => <article className="business-card" key={business.id}><div className="business-card-top"><div className="business-logo"><Recycle size={22} /></div><div><span className="business-city"><MapPin size={13} />{isAr ? business.arCity : business.city}</span><h2>{isAr ? business.arName : business.name}</h2><p>{isAr ? business.arType : business.type}</p></div></div><div className="business-materials">{(isAr ? business.arMaterials : business.materials).map((material) => <span key={material}>{material}</span>)}</div><div className="business-contact"><span><MapPin size={15} />{isAr ? business.arAddress : business.address}</span>{business.phone.length > 0 ? <span><Phone size={15} />{business.phone.join(" · ")}</span> : <span><Phone size={15} />{isAr ? "الهاتف غير منشور" : "Phone not publicly listed"}</span>}<span><Mail size={15} />{business.email}</span></div><div className="business-actions"><a className="btn btn-primary" href={business.website} target="_blank" rel="noreferrer"><ExternalLink size={15} />{isAr ? "الموقع الرسمي" : "Official website"}</a>{business.phone[0] && <a className="btn btn-secondary" href={`tel:${business.phone[0]}`}><Phone size={15} />{isAr ? "اتصال" : "Call"}</a>}</div><small className="business-source"><ShieldCheck size={13} />{isAr ? "المصدر: " : "Source: "}<a href={business.website} target="_blank" rel="noreferrer">{business.source}</a></small></article>)}</div>{filtered.length === 0 && <div className="empty-state"><Search size={35} /><h3>{isAr ? "لا توجد نتائج" : "No businesses found"}</h3><p>{isAr ? "جربي تغيير البحث أو الفلاتر." : "Try another search or filter."}</p></div>}<div className="business-disclaimer"><ShieldCheck size={18} /><p>{isAr ? "تنبيه: الإدراج لا يعني اعتمادًا أو ضمانًا للخدمة. تحققي من الأسعار، نطاق الاستلام، والتراخيص مباشرة مع الشركة قبل تسليم أي مخلفات أو توقيع اتفاق." : "Directory note: listing does not constitute endorsement or guarantee. Verify pricing, pickup coverage, and licensing directly with each company before handing over waste or signing an agreement."}</p></div>
  </div>;
}
function HowItWorks({ lang }: { text: Copy; lang: Lang }) { return <div className="page container content-page"><div className="page-heading"><span className="eyebrow"><Zap size={15} />{lang === "ar" ? "كيف تعمل إنِرسيرا" : "How Enercyra works"}</span><h1>{lang === "ar" ? "من الصورة إلى فرصة عمل." : "From image to business opportunity."}</h1><p>{lang === "ar" ? "ثلاث خطوات تجعل المادة أوضح وأسهل في الوصول إلى الاتصال المناسب." : "Three clear steps make a material easier to understand and easier to connect."}</p></div><div className="flow-grid"><FlowCard n="01" icon={<Sparkles />} title={lang === "ar" ? "صنّف" : "Classify"} copy={lang === "ar" ? "ارفع صورة. يحدد MobileNet نوع المادة من بين 37 فئة." : "Upload an image. MobileNet identifies the material across 37 categories."} /><FlowCard n="02" icon={<BarChart3 />} title={lang === "ar" ? "احسب" : "Calculate"} copy={lang === "ar" ? "أدخل الوزن وشاهد القيمة والطاقة كتقديرات مرجعية واضحة." : "Add weight and see clearly labeled reference value and energy estimates."} /><FlowCard n="03" icon={<UsersRound />} title={lang === "ar" ? "تواصل" : "Connect"} copy={lang === "ar" ? "انشر المادة واعثر على مشترين محتملين عبر السوق." : "Publish the material and find potential buyers through the marketplace."} /></div><div className="principles-card"><div><ShieldCheck size={23} /><h3>{lang === "ar" ? "مصمم بوضوح" : "Designed for clarity"}</h3></div><p>{lang === "ar" ? "نفرّق دائمًا بين نتيجة النموذج وبين التقديرات المرجعية. لا يوجد سعر مخفي أو رقم معروض كحقيقة سوقية دون وسم." : "We keep model output separate from reference estimates. No hidden price or number is presented as a market fact without a label."}</p></div></div>; }
function FlowCard({ n, icon, title, copy: description }: { n: string; icon: React.ReactNode; title: string; copy: string }) { return <div className="flow-card"><span className="flow-number">{n}</span><div className="feature-icon">{icon}</div><h2>{title}</h2><p>{description}</p><ArrowRight className="feature-arrow" size={19} /></div>; }
const teamMembers = [
  { nameEn: "Alaa Mohamed", nameAr: "آلاء محمد", image: "/manus-storage/alaa_3689a963.jpg", linkedin: "https://www.linkedin.com/in/alaa-mohamed-analyst/" },
  { nameEn: "Huda Taha", nameAr: "عهود طه", image: "/manus-storage/ohoud_5d143c3b.jpg", linkedin: "https://www.linkedin.com/in/ohoudtaha/" },
  { nameEn: "Rahma Mohamed", nameAr: "رحمة محمد", image: "/manus-storage/rahma_00948031.jpg", linkedin: "https://www.linkedin.com/in/rahma-mohamed-data/" },
] as const;
function About({ lang }: { text: Copy; lang: Lang }) {
  const shareUrl = "https://enercyraai-drvxzjat.manus.space/";
  return <div className="page container content-page"><div className="about-panel"><div><span className="eyebrow"><Leaf size={15} />Enercyra</span><h1>{lang === "ar" ? "رؤية أوضح للنفايات. فرصة أفضل للأعمال." : "A clearer view of waste. A better business opportunity."}</h1><p>{lang === "ar" ? "إنِرسيرا منصة ذكاء نفايات تساعد المستخدمين والشركات على فهم المادة قبل اتخاذ الخطوة التالية." : "Enercyra is a waste intelligence platform that helps people and businesses understand a material before taking the next step."}</p></div><div className="about-mark"><BrandMark className="brand-mark-feature" /><span>{lang === "ar" ? <>اكتشف النفايات.<br />اكتشف قيمتها.</> : <>See Waste.<br />See Value.</>}</span></div></div><div className="about-grid"><div><h3>{lang === "ar" ? "ما الذي نبنيه؟" : "What we are building"}</h3><p>{lang === "ar" ? "تجربة عملية تبدأ بالصورة وتنتهي بمعلومة أوضح واتصال تجاري محتمل." : "A practical experience that starts with a photo and ends with a clearer signal and a potential business connection."}</p></div><div><h3>{lang === "ar" ? "لمن؟" : "For whom?"}</h3><p>{lang === "ar" ? "للأفراد، جامعي النفايات، الشركات، والمشترين الذين يحتاجون إلى نقطة بداية واضحة." : "For individuals, collectors, companies, and buyers who need a clearer starting point."}</p></div></div><section className="team-section" aria-labelledby="team-heading"><div className="team-heading"><span className="eyebrow"><UsersRound size={15} />{lang === "ar" ? "الفريق" : "Team"}</span><h2 id="team-heading">{lang === "ar" ? "من صنع Enercyra؟" : "Meet the team behind Enercyra"}</h2></div><div className="team-grid" dir={lang === "ar" ? "rtl" : "ltr"}>{(lang === "ar" ? [teamMembers[2], teamMembers[1], teamMembers[0]] : teamMembers).map((member) => { const memberName = lang === "ar" ? member.nameAr : member.nameEn; return <a key={member.linkedin} className="team-card" href={member.linkedin} target="_blank" rel="noopener noreferrer"><span className="team-avatar-wrap"><img className="team-avatar" src={member.image} alt={memberName} /></span><strong>{memberName}</strong></a>; })}</div></section><div className="about-qr-card"><div className="about-qr-copy"><span className="eyebrow"><QrCode size={15} />{lang === "ar" ? "شارك المنصة" : "Share Enercyra"}</span><h2>{lang === "ar" ? "امسح لزيارة Enercyra" : "Scan to visit Enercyra"}</h2><p>{lang === "ar" ? "افتح الصفحة الرئيسية مباشرة من هاتفك." : "Open the Enercyra homepage directly from your phone."}</p></div><a className="about-qr-shell" href={shareUrl} target="_blank" rel="noreferrer" aria-label={lang === "ar" ? "فتح الصفحة الرئيسية" : "Open Enercyra homepage"}><QRCodeSVG value={shareUrl} size={192} marginSize={4} bgColor="#ffffff" fgColor="#082230" level="H" /></a></div></div>;
}
function MyListings({ lang }: { text: Copy; lang: Lang }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const mine = trpc.marketplace.mine.useQuery(undefined, { enabled: Boolean(user) });
  const remove = trpc.marketplace.remove.useMutation({ onSuccess: () => mine.refetch(), onError: () => toast.error(lang === "ar" ? "تعذر حذف الإعلان." : "The listing could not be deleted.") });
  if (loading || (user && mine.isLoading)) return <div className="page container empty-state"><Sparkles className="spin" /><h2>{lang === "ar" ? "جارٍ التحقق من الإعلانات" : "Loading listings"}</h2></div>;
  if (!user) return <div className="page container auth-card"><LogIn size={35} /><h1>{lang === "ar" ? "سجّل الدخول للوصول إلى إعلاناتك" : "Sign in to access your listings"}</h1><p>{lang === "ar" ? "النشر وإدارة الإعلانات محميان بتسجيل الدخول." : "Publishing and listing management are protected by sign-in."}</p><button className="btn btn-primary" onClick={() => startLogin()}><LogIn size={17} />{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</button></div>;
  return <div className="page container content-page"><div className="market-heading"><div><span className="eyebrow"><UserRound size={15} />{lang === "ar" ? "حسابك" : "Your account"}</span><h1>{lang === "ar" ? "إعلاناتي" : "My Listings"}</h1><p>{lang === "ar" ? "إعلاناتك المنشورة والمملوكة لحسابك." : "Your published materials owned by this account."}</p></div><button className="btn btn-primary" onClick={() => navigate("/publish")}><Tag size={17} />{lang === "ar" ? "نشر مادة" : "Publish material"}</button></div>{!mine.data?.length ? <div className="empty-state"><PackageSearch size={38} /><h3>{lang === "ar" ? "لا توجد إعلانات بعد" : "No listings yet"}</h3><p>{lang === "ar" ? "انشر أول مادة لك من صفحة النتيجة." : "Publish your first material from the result page."}</p></div> : <div className="market-grid">{mine.data.map((listing) => <article className="listing-card" key={listing.id}><div className="listing-content"><div className="listing-title"><div><h3>{lang === "ar" ? listing.displayNameAr : listing.displayNameEn}</h3><small>{listing.location}</small></div><Tag size={17} /></div><div className="listing-meta"><span><PackageSearch size={15} />{listing.weightKg} kg</span><span><CircleHelp size={15} />{listing.status}</span></div><div className="listing-bottom"><strong>{lang === "ar" ? "إعلانك" : "Your listing"}</strong><button onClick={() => remove.mutate({ id: listing.id })} disabled={remove.isPending}><Trash2 size={15} />{lang === "ar" ? "حذف" : "Delete"}</button></div></div></article>)}</div>}</div>;
}
function Footer({ lang }: { lang: Lang }) { return <footer className="site-footer container"><div><BrandMark className="brand-mark-footer" /><strong>Enercyra</strong><small>{lang === "ar" ? "اكتشف النفايات، اكتشف قيمتها" : "See Waste. See Value."}</small></div><span>© 2026 Enercyra.</span><div className="footer-links"><Link href="/about">{lang === "ar" ? "من نحن" : "About"}</Link><Link href="/how-it-works">{lang === "ar" ? "كيف تعمل" : "How it works"}</Link></div></footer>; }

export default App;

function Publish({ lang }: { text: Copy; lang: Lang }) {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const profile = user as (typeof user & { location?: string; phone?: string }) | null;
  const publishDraft = readPublishDraft();
  const [location, setLocation] = useState(() => profile?.location || "");
  const [contactPhone, setContactPhone] = useState(() => profile?.phone || "");
  const [weight, setWeight] = useState(() => publishDraft.weight || "");
  const [condition, setCondition] = useState(() => publishDraft.condition || "");
  const [material, setMaterial] = useState(() => lang === "ar" ? publishDraft.displayNameAr || "بلاستيك" : publishDraft.displayNameEn || "Plastic");
  const [notes, setNotes] = useState("");
  const [classification] = useState<{ source?: "model" | "demo"; modelClassId?: string; classId: string; displayNameEn: string; displayNameAr: string; confidence?: number; imageName?: string; imageDataUrl?: string }>(() => { try { return JSON.parse(window.sessionStorage.getItem("enercyra-classification") || "null") || { source: "demo", classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك" }; } catch { return { source: "demo", classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك" }; } });
  const createListing = trpc.marketplace.create.useMutation({
    onSuccess: () => { toast.success(lang === "ar" ? "تم نشر المادة." : "Material published."); navigate("/my-listings"); },
    onError: () => toast.error(lang === "ar" ? "تعذر نشر المادة الآن." : "The material could not be published yet."),
  });
  if (loading) return <div className="page container empty-state"><Sparkles className="spin" /><h2>{lang === "ar" ? "جارٍ التحقق من الدخول" : "Checking sign-in"}</h2></div>;
  if (!user) return <div className="page container auth-card"><LogIn size={35} /><h1>{lang === "ar" ? "سجّل الدخول للنشر" : "Sign in to publish"}</h1><p>{lang === "ar" ? "يمكنك تصفح الموقع دون دخول، لكن نشر المواد وإدارتها يحتاجان إلى حساب." : "You can browse publicly, but publishing and managing materials requires an account."}</p><button className="btn btn-primary" onClick={() => startLogin()}><LogIn size={17} />{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</button></div>;
  return <div className="page container narrow-page"><div className="page-heading"><span className="eyebrow"><Tag size={15} />{lang === "ar" ? "إعلان جديد" : "New listing"}</span><h1>{lang === "ar" ? "انشر مادة في السوق." : "Publish material."}</h1><p>{lang === "ar" ? "أضف التفاصيل التي تساعد المشتري المحتمل على فهم الإعلان." : "Add the details a potential buyer needs to understand the listing."}</p></div><div className="publish-source-summary">{(publishDraft.imageDataUrl || classification.imageDataUrl) && <img src={publishDraft.imageDataUrl || classification.imageDataUrl} alt={lang === "ar" ? "الصورة المصنفة" : "Classified waste"} />}<div><strong>{lang === "ar" ? "بيانات التصنيف جاهزة" : "Classification details ready"}</strong><span>{lang === "ar" ? `المادة: ${material} · الوزن: ${publishDraft.weight || "—"} كجم${publishDraft.category ? ` · الفئة: ${publishDraft.category}` : ""}` : `Material: ${material} · Weight: ${publishDraft.weight || "—"} kg${publishDraft.category ? ` · Category: ${publishDraft.category}` : ""}`}</span></div></div><form className="benefit-panel publish-form" onSubmit={(event) => { event.preventDefault(); createListing.mutate(buildListingPayload({ ...classification, displayNameEn: lang === "ar" ? classification.displayNameEn : material, displayNameAr: lang === "ar" ? material : classification.displayNameAr }, { weightKg: Number(weight), location, contactPhone, condition, notes })); }}><div className="form-grid"><label className="form-field"><span>{lang === "ar" ? "المادة" : "Material"}</span><input value={material} onChange={(event) => setMaterial(event.target.value)} required /></label><label className="form-field"><span>{lang === "ar" ? "الوزن (كجم)" : "Weight (kg)"}</span><input type="number" min="0.1" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} required /></label><label className="form-field"><span>{lang === "ar" ? "الموقع / العنوان" : "Location / address"}</span><input placeholder={lang === "ar" ? "مثال: القاهرة" : "e.g. Cairo"} value={location} onChange={(event) => setLocation(event.target.value)} required /></label><label className="form-field"><span>{lang === "ar" ? "رقم التواصل" : "Contact phone"}</span><input type="tel" inputMode="tel" placeholder={lang === "ar" ? "رقم الهاتف" : "Your phone number"} value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} /></label><label className="form-field"><span>{lang === "ar" ? "الحالة (اختياري)" : "Condition (optional)"}</span><input placeholder={lang === "ar" ? "نظيفة / مختلطة" : "Clean / mixed"} value={condition} onChange={(event) => setCondition(event.target.value)} /></label></div><label className="form-field"><span>{lang === "ar" ? "ملاحظات (اختياري)" : "Notes (optional)"}</span><textarea rows={5} placeholder={lang === "ar" ? "أضف أي تفاصيل عن المادة" : "Add details about the material"} value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="notice"><CircleHelp size={16} />{lang === "ar" ? "سيظهر الإعلان كقيمة مرجعية أو سعر قيد التجهيز، ولا يمثل عرضًا تجاريًا ملزمًا." : "The listing will show a reference or pending price and is not a binding commercial offer."}</div><div className="result-actions"><button className="btn btn-primary" type="submit" disabled={createListing.isPending}><PackageSearch size={17} />{createListing.isPending ? (lang === "ar" ? "جارٍ النشر" : "Publishing") : (lang === "ar" ? "نشر الإعلان" : "Publish listing")}</button><button className="btn btn-secondary" type="button" onClick={() => navigate("/result")}><ArrowLeft size={17} />{lang === "ar" ? "رجوع" : "Back"}</button></div></form></div>;
}
