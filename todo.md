# Project TODO

- [x] Establish Enercyra branding, dark navy/emerald/lime design tokens, and responsive mobile-first layout
- [x] Add bilingual English/Arabic support with full RTL layout switching across every page
- [x] Add light/dark mode toggle and persist the selected preference
- [x] Build public Home landing page with See Waste. See Value. messaging and QR-ready responsive URL
- [x] Build public Classify page with drag-and-drop, file upload, and camera capture affordances
- [x] Document the MobileNetV3-Large inference contract, weights, class mapping, and 224px preprocessing for the later runtime integration
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
- [x] Verify desktop and mobile layouts, English and Arabic RTL behavior, theme switching, upload states, empty/error states, and public/protected route access
- [x] Create final checkpoint and provide the QR-ready project version for publishing from the Management UI

- [x] Localize all remaining hardcoded English strings and status labels so every public page is fully bilingual in Arabic/English with RTL-safe copy
- [x] Persist the light/dark theme selection using localStorage and restore it on page load
- [x] Add a real Marketplace location filter control and wire it into listing filtering logic
- [x] Keep the Result page explicitly labeled as a Preview with safe reference calculations until the real inference runtime is selected
- [x] Add Vitest tests for marketplace ownership restrictions and protected create/remove procedures
- [x] Localize remaining Marketplace filter labels/options and any other public-page strings so Arabic mode is fully translated and RTL-safe
- [x] Preserve selected classification and image metadata through Publish while the real inference runtime remains a later integration
- [x] Extend the listing schema and mutation to persist image metadata or a documented image reference field
- [x] Audit Arabic mode across public routes and localize remaining fixed UI copy while keeping the brand name/tagline as intentional brand assets if retained
- [x] Add explicit disclaimer metadata to each 37-class reference record and wire the catalog into the runtime reference source
- [x] Localize remaining seeded public listing locations and verify every public route in Arabic and English
- [x] Use the 37-class catalog through the shared runtime source rather than leaving it unused beside the UI data
- [x] Verify all public routes (/ , /classify, /result, /marketplace, /how-it-works, /about) in both English and Arabic/RTL and record the result

- [x] Review the public MVP on enercyraai-drvxzjat.manus.space and capture the adjustment list before choosing the real MobileNet runtime
- [x] Keep Result and Publish clearly marked as Preview/Reference Estimate until the real inference endpoint is connected
- [x] Verify desktop/mobile layouts, English/Arabic RTL behavior, theme switching, visible upload controls, and signed-out protected-route access in-browser; document limitations
- [x] Pass actual result-state classification metadata into Publish or clearly label the current fallback as sample/demo
- [x] Add explicit Preview wording to the Publish page while the real inference endpoint is not connected
- [x] Verify visible upload controls and protected-route states in-browser; document the hidden file-input automation limitation
- [x] Verify protected-route behavior while signed out for Publish and My Listings and document the results

- [x] Compare the deployed Light/Dark palettes and logo rendering against the approved visual concept
- [x] Diagnose why the Home hero visual assets around the logo are not appearing as expected
- [x] Fix and verify the Home hero logo/visual assets without breaking mobile, Arabic RTL, or Light/Dark modes
- [x] Verify the repaired Home hero in desktop/mobile, English/Arabic RTL, and both Light/Dark modes after the logo/hero change
- [x] Decide and document whether the hero uses inline vector visuals or uploaded concept assets; keep the selected approach consistent with the approved concept

- [x] Improve Light Mode contrast for secondary text, labels, borders, and accent colors
- [x] Strengthen Arabic hero typography hierarchy and reduce the washed-out green treatment
- [x] Rebalance the Home hero composition so the headline and orbit visual feel connected and intentional
