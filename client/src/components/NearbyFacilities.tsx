import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, LocateFixed, MapPin, Navigation, ShieldCheck } from "lucide-react";
import { MapView } from "./Map";

type NearbyBusiness = {
  id: string;
  name: string;
  arName: string;
  city: string;
  arCity: string;
  address: string;
  arAddress: string;
  materials: readonly string[];
  arMaterials: readonly string[];
  website: string;
};

type LocatedBusiness = NearbyBusiness & {
  distanceKm: number;
  position: google.maps.LatLngLiteral;
};

type NearbyFacilitiesProps = {
  lang: "en" | "ar";
  businesses: readonly NearbyBusiness[];
  material?: string;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[()\-_/]/g, " ").replace(/\s+/g, " ").trim();
}

function matchesMaterial(business: NearbyBusiness, material: string) {
  if (!material.trim()) return true;
  const terms = normalize(material).split(" ").filter((term) => term.length > 2);
  const supported = [...business.materials, ...business.arMaterials].map(normalize);
  return terms.some((term) => supported.some((entry) => entry.includes(term) || term.includes(entry)));
}

function distanceKm(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral) {
  return google.maps.geometry?.spherical
    ? google.maps.geometry.spherical.computeDistanceBetween(a, b) / 1000
    : Math.sqrt((a.lat - b.lat) ** 2 + (a.lng - b.lng) ** 2) * 111;
}

export function NearbyFacilities({ lang, businesses, material = "" }: NearbyFacilitiesProps) {
  const isAr = lang === "ar";
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locations, setLocations] = useState<LocatedBusiness[]>([]);
  const [status, setStatus] = useState<"idle" | "locating" | "searching" | "ready" | "error">("idle");
  const [error, setError] = useState("");
  const markerRefs = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const candidates = useMemo(() => businesses.filter((business) => matchesMaterial(business, material)), [businesses, material]);

  useEffect(() => {
    if (!map || !userPosition || candidates.length === 0) return;
    let cancelled = false;
    setStatus("searching");
    setError("");
    markerRefs.current.forEach((marker) => { marker.map = null; });
    markerRefs.current = [];
    const geocoder = new google.maps.Geocoder();
    const lookups = candidates.map((business) => new Promise<LocatedBusiness | null>((resolve) => {
      geocoder.geocode({ address: `${business.address}, Egypt` }, (results, geocodeStatus) => {
        if (geocodeStatus !== "OK" || !results?.[0]) return resolve(null);
        const location = results[0].geometry.location;
        resolve({ ...business, position: { lat: location.lat(), lng: location.lng() }, distanceKm: distanceKm(userPosition, { lat: location.lat(), lng: location.lng() }) });
      });
    }));
    Promise.all(lookups).then((resolved) => {
      if (cancelled) return;
      const ranked = resolved.filter((entry): entry is LocatedBusiness => Boolean(entry)).sort((a, b) => a.distanceKm - b.distanceKm);
      setLocations(ranked);
      setStatus("ready");
      map.setCenter(userPosition);
      map.setZoom(9);
      const userMarker = new google.maps.marker.AdvancedMarkerElement({ map, position: userPosition, title: isAr ? "موقعك" : "Your location" });
      markerRefs.current.push(userMarker);
      ranked.forEach((business) => markerRefs.current.push(new google.maps.marker.AdvancedMarkerElement({ map, position: business.position, title: isAr ? business.arName : business.name })));
      if (ranked.length === 0) setError(isAr ? "لم نتمكن من تحديد مواقع جهات متوافقة. جرّبي البحث يدويًا في دليل الشركات." : "We could not geocode a compatible facility. Try the Businesses directory search instead.");
    }).catch(() => {
      if (!cancelled) { setStatus("error"); setError(isAr ? "تعذر البحث عن الجهات القريبة حاليًا." : "Nearby facility search is unavailable right now."); }
    });
    return () => { cancelled = true; };
  }, [candidates, isAr, map, userPosition]);

  const locate = () => {
    if (!navigator.geolocation) { setStatus("error"); setError(isAr ? "المتصفح لا يدعم تحديد الموقع." : "This browser does not support location access."); return; }
    setStatus("locating");
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => { setStatus("error"); setError(isAr ? "لم يتم السماح بالموقع. يمكنك استخدام دليل الشركات والبحث يدويًا." : "Location permission was not granted. You can still use the Businesses directory manually."); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return <section className="nearby-facilities" aria-labelledby="nearby-facilities-title">
    <div className="nearby-heading">
      <div><span className="eyebrow"><Navigation size={15} />{isAr ? "مطابقة جغرافية" : "Location matching"}</span><h2 id="nearby-facilities-title">{isAr ? "أقرب جهة مناسبة للمادة" : "Nearest compatible facility"}</h2><p>{material ? (isAr ? `سنبحث عن جهات تقبل: ${material}` : `We will look for facilities that accept: ${material}`) : (isAr ? "اسمحي بالموقع للعثور على أقرب جهة من دليل الشركات." : "Share your location to find the nearest facility in the directory.")}</p></div>
      <div className="nearby-icon"><LocateFixed size={22} /></div>
    </div>
    {!userPosition && <button className="btn btn-primary" type="button" onClick={locate} disabled={status === "locating"}><LocateFixed size={17} />{status === "locating" ? (isAr ? "جارٍ تحديد موقعك..." : "Locating you...") : (isAr ? "استخدم موقعي" : "Use my location")}<ArrowRight size={17} /></button>}
    {error && <p className="field-error" role="alert">{error}</p>}
    {userPosition && <div className="nearby-results"><div className="nearby-map"><MapView initialCenter={userPosition} initialZoom={9} onMapReady={setMap} /></div>{status === "searching" && <p className="nearby-status">{isAr ? "جارٍ تحديد مواقع الجهات المتوافقة..." : "Finding compatible facilities..."}</p>}{status === "ready" && locations.length > 0 && <div className="nearby-list">{locations.slice(0, 3).map((business) => <a className="nearby-result" key={business.id} href={business.website} target="_blank" rel="noreferrer"><div><strong>{isAr ? business.arName : business.name}</strong><span><MapPin size={14} />{isAr ? business.arCity : business.city} · {business.distanceKm.toFixed(1)} km</span></div><ArrowRight size={16} /></a>)}</div>}</div>}
    <small className="nearby-disclaimer"><ShieldCheck size={13} />{isAr ? "تحتاج النتائج إلى مراجعة العنوان ونطاق الاستلام مع الجهة مباشرة. لا يتم مشاركة موقعك مع الموقع." : "Verify the address and pickup coverage directly with the facility. Your location is not sent to the directory."}</small>
  </section>;
}
