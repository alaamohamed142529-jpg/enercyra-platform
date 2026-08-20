# Project TODO

- [x] Establish Enercyra branding, dark navy/emerald/lime design tokens, and responsive mobile-first layout
- [x] Add bilingual English/Arabic support with full RTL layout switching across every page
- [x] Add light/dark mode toggle and persist the selected preference
- [x] Build public Home landing page with See Waste. See Value. messaging and QR-ready responsive URL
- [x] Build public Classify page with drag-and-drop, file upload, and camera capture affordances
- [x] Add MobileNetV3-Large inference integration using best_mobilenetv3.pth, class_mapping.json, and the documented 224px preprocessing
- [x] Add safe 37-class reference data mapping with Arabic/English display names, category, reference/pending status, price, LHV, and disclaimer metadata
- [x] Build AI Result page with confidence ring, material details, weight input, reference value, reference energy, and explicit disclaimer
- [x] Implement value = weight × price_egp_per_kg and energy_mj = weight × lhv_mj_per_kg; energy_kwh = energy_mj ÷ 3.6
- [x] Build public Marketplace page with search, material-type filter, location filter, reference/pending price labels, and Contact seller CTA
- [x] Add Manus OAuth authentication gate for Publish and My Listings only
- [x] Add authenticated Publish Waste flow from Result page with category, weight, location, condition, notes, and image metadata
- [x] Add authenticated My Listings page with ownership filtering and delete action
- [x] Add How It Works / About page explaining Classify → Calculate → Connect
- [x] Add database schema, queries, and tRPC procedures for reference data and listings
- [x] Add Vitest coverage for reference calculations, class mapping, listing ownership, and protected publish/delete flows
- [x] Verify desktop/mobile layouts, English/Arabic RTL behavior, theme switching, visible upload states, and public/protected route access after inference integration
- [x] Create final checkpoint and provide the QR-ready project version for publishing from the Management UI

- [x] Localize all remaining hardcoded English strings and status labels so every public page is fully bilingual in Arabic/English with RTL-safe copy
- [x] Persist the light/dark theme selection using localStorage and restore it on page load
- [x] Add a real Marketplace location filter control and wire it into listing filtering logic
- [x] Wire the Result page to real inference/reference data inputs; numeric value/energy remain pending until verified catalog data exists
- [x] Add Vitest tests for marketplace ownership restrictions and protected create/remove procedures
- [x] Localize remaining Marketplace filter labels/options and any other public-page strings so Arabic mode is fully translated and RTL-safe
- [x] Wire the Publish form to actual Result/inference data instead of hardcoded Plastic, and pass class and image metadata through the publish mutation
- [x] Extend the listing schema and mutation to persist image metadata or a documented image reference field
- [x] Audit Arabic mode across public routes and localize remaining fixed UI copy while keeping the brand name/tagline as intentional brand assets if retained
- [x] Add explicit disclaimer metadata to each 37-class reference record and wire the catalog into the runtime reference source
- [x] Localize remaining seeded public listing locations and verify every public route in Arabic and English
- [x] Use the 37-class catalog through the shared runtime source rather than leaving it unused beside the UI data
- [x] Verify all public routes (/ , /classify, /result, /marketplace, /how-it-works, /about) in both English and Arabic/RTL and record the result

- [x] Add actual PyTorch MobileNetV3 inference runtime using best_mobilenetv3.pth and the uploaded 37-class mapping
- [x] Apply the notebook preprocessing contract: 224x224 RGB input and ImageNet normalization
- [x] Add a server inference endpoint with image upload validation, confidence output, and safe error handling
- [x] Connect the Classify upload flow to the real inference result and normalize model class names before storing state
- [x] Pass the real class, confidence, and image metadata into Result calculations and Publish
- [x] Add inference tests and verify an actual uploaded image and public tRPC flow end to end

- [x] Normalize numeric MobileNet class IDs through class_mapping.json before storing Result state, and keep demo fallback separate from real inference
- [x] Verify Publish consumes the real class, confidence, and image metadata payload after inference
- [x] Add and run a Classify → inference → Result → Publish contract verification with a real model image fixture and document the production runtime path

- [x] Add a focused Publish payload contract test proving real inferred class, confidence, and image metadata are submitted
- [x] Add a documented full-flow contract test covering Classify inference output through Result into Publish payload
- [x] Add one integration test that maps an inference result through the 37-class catalog into the exact Publish payload
- [x] Document the verified Classify → Result → Publish session fields and payload fields for regression safety

- [x] Keep all 37 catalog prices and LHV values pending until verified data is approved; do not invent numeric market values
- [x] Add a focused calculation test proving numeric value/energy output when a verified catalog record is supplied, while pending records remain blank

- [x] Recheck /classify and /result after inference integration on mobile in English and Arabic RTL
- [x] Recheck the live theme toggle and signed-out /publish and /my-listings protection after inference integration
- [x] Exercise visible loading/error behavior for Classify and document the upload automation limitation if the browser cannot submit a local file
- [x] Replace heavyweight PyTorch deployment runtime with ONNX Runtime and commit the exported MobileNet artifact
- [x] Verify ONNX inference parity, build, and deployment after the runtime migration
- [x] Recheck Arabic RTL contrast and safety labels after the deployment fix

- [x] Replace the stale Classify-page copy that says the Python inference endpoint is not connected, and verify the deployed copy after the MobileNet checkpoint

- [x] Fix combustible classification semantics so recyclable plastic is not presented as non-combustible when its reference record supports energy recovery
- [x] Make pending price and LHV data explicit on Result instead of showing unexplained dashes after weight entry
- [x] Audit missing MVP capabilities and identify the next highest-value implementation items
- [x] Add regression tests for combustible semantics and pending calculation messaging

- [x] Redesign the homepage hero visual to match the supplied waste-orbit reference more closely
- [x] Verify the redesigned hero in English, Arabic RTL, desktop, and mobile layouts
- [x] Publish the hero update and provide the live public URL

- [x] Fix Result weight input so changing the default value is accepted and recalculates immediately
- [x] Explain missing reference price and energy data separately from weight-entry behavior in English and Arabic
- [x] Add regression tests for arbitrary weight updates and pending catalog calculations
- [x] Publish and verify the Result fix on the public domain
- [x] Force a fresh Result bundle deployment if the public route continues serving the previous input implementation

- [x] Review the friend-provided notebook and extract energy/price tables, formulas, units, relationships, and provenance limitations without importing values
- [x] Re-review the newly attached EcoSyncAI notebook and identify useful price, energy, LHV, and calculation data for safe Enercyra integration

- [x] Rebuild the homepage to match the supplied premium dark reference layout, typography, logo, navigation, hero, cards, and Recent Analysis panel
- [x] Add tasteful responsive motion for the hero visual, image, and cards with prefers-reduced-motion support
- [x] Verify the redesigned homepage in English, Arabic RTL, desktop, light/dark, and mobile views
- [x] Publish the homepage redesign and provide the live public URL
