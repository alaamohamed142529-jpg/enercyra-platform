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
- [x] Study the supplied reference site’s motion patterns and redesign Enercyra’s hero as layered HTML/CSS rather than a single animated image
- [x] Verify the interactive hero in English, Arabic RTL, desktop, mobile, and reduced-motion mode
- [x] Publish the interactive hero redesign and provide the public URL
- [x] Force and verify a fresh public bundle if the live domain still serves the previous image-led hero

- [x] Rebuild the homepage to match the supplied premium dark reference layout, typography, logo, navigation, hero, cards, and Recent Analysis panel
- [x] Add tasteful responsive motion for the hero visual, image, and cards with prefers-reduced-motion support
- [x] Verify the redesigned homepage in English, Arabic RTL, desktop, light/dark, and mobile views
- [x] Publish the homepage redesign and provide the live public URL

- [x] Approve and wire explicitly labeled notebook-derived reference price and LHV values for the supported result class
- [x] Make weight-to-price and weight-to-energy calculations visibly update on Result with units and reference-source labeling
- [x] Remove the framed/image-like treatment from the homepage hero and simplify the composition without losing responsive motion
- [x] Re-test and publish the calculation and visual cleanup changes on the public URL

- [x] Diagnose why the public Result bundle still shows Pending while the local catalog contains EcoSyncAI reference values
- [x] Force a fresh public Result bundle and verify the live numeric outputs in English and Arabic
- [x] Confirm arbitrary weight changes update the public calculation before closing the bug

- [x] Remove the confusing fixed-looking default weight and make the Result weight field clearly editable/optional
- [x] Redesign Result metrics to show price, LHV, energy MJ/kWh, value, units, and source labels clearly in Arabic and English
- [x] Research authoritative current price and energy sources with country, date, and units before replacing notebook assumptions
- [x] Re-test and publish the clearer Result page on the public URL

- [x] Fix Result light-mode palette and contrast so headings, labels, and energy metrics are clearly readable
- [x] Ensure energy MJ/kWh values render for every catalog class with approved reference LHV data instead of incorrectly showing Pending
- [x] Remove every fixed-looking weight value and keep the Result weight field empty until the user enters a value
- [x] Re-test and publish the corrected Result page in English and Arabic RTL

- [x] Save a new checkpoint to publish the latest Result fixes, then verify the public URL in English and Arabic RTL
- [x] Verify the live public Result page in light and dark modes for Plastic numeric MJ/kWh output and Metal non-energy labeling

- [x] Verify the public Result page with a Plastic classification by entering a weight and confirm numeric Total energy (MJ) and Energy equivalent (kWh)
- [x] Verify the public Result bundle contains Metal non-energy/not-applicable labels; the exact Metal rendering was also verified locally in English and Arabic
- [x] Re-check the public Result page in both light and dark modes after the live validations

- [x] Verify the published Metal Result behavior in English and Arabic using the exact deployed bundle; local rendered fixture confirms LHV/MJ/kWh explicitly not applicable
- [x] Re-check the live Result page in both dark and light modes after the successful Plastic validation and published Metal-bundle validation

- [x] Replace the numeric weight placeholder 2.5 with explicit bilingual instruction text so the empty field cannot look pre-filled
- [x] Verify the clarified empty field still recalculates correctly after entering a real weight, then publish the fix

- [x] Save a new checkpoint to publish the placeholder clarification fix
- [x] Verify the live public Result page in English and Arabic RTL shows non-numeric placeholder/help text and still recalculates after entering a real weight

- [x] Force a fresh public Result bundle after the placeholder update and verify the live domain no longer serves “e.g. 2.5”

- [x] Replace the gray light-mode background and surfaces with a warmer premium palette and stronger visual hierarchy
- [x] Verify the refined palette in light mode, dark mode, and Arabic RTL, then publish it

- [x] Save a checkpoint to publish the warmer light-mode palette update
- [x] Verify the published homepage and Result page in light mode, dark mode, and Arabic RTL with readable contrast and warm ivory surfaces

- [x] Visually verify the live public homepage in light mode and Arabic RTL: warm ivory background, white surfaces, and navy text
- [x] Visually verify the live public Result page in light and dark modes: refined palette and readable contrast

- [x] Remove the visible EcoSyncAI source notice from the Result calculation panel while preserving essential calculation disclaimers elsewhere
- [x] Refine the homepage hero into a dynamic HTML/CSS waste orbit with separate bottle, can, glass, cardboard, and organic material elements
- [x] Add rotating energy rings and material motion with reduced-motion support, then verify English, Arabic RTL, light/dark, and mobile layouts

- [x] Add a compact calculation disclaimer without naming the notebook or showing a source section: indicative price, LHV meaning, MJ-to-kWh conversion, and market/date/grade confirmation
- [x] Verify the new hero locally in light mode, dark mode, Arabic RTL, and mobile viewport after the material-orbit implementation
- [x] Publish the dynamic hero and source-panel removal, then verify the public homepage and Result page

- [x] Capture explicit local post-change hero checks in dark and light mode on desktop and mobile before publishing

- [x] Force a fresh public Result bundle after the source-panel removal and verify the public route serves the compact disclaimer instead

- [x] Visually verify the live public homepage after the final publish, confirming separate material objects and rotating energy rings; refresh the homepage bundle if stale

- [x] Create a transparent-background Enercyra logo asset from the supplied bilingual logo concept without changing the mark or wordmarks

- [x] Replace the current center mark with the Enercyra logo treatment inside the interactive hero
- [x] Animate the logo with subtle rotation, glow pulse, and orbit integration while preserving reduced-motion and responsive behavior
- [x] Verify and publish the animated logo hero in English, Arabic RTL, light/dark, and mobile views

- [x] Save a new checkpoint to publish the animated logo-centered hero
- [x] Verify the published homepage hero in English and Arabic RTL, light and dark modes, desktop and mobile

- [x] Visually confirm the published hero in English desktop and Arabic RTL desktop with the logo-centered orbit composition
- [x] Confirm the published hero switches correctly between dark and light themes
- [x] Confirm the matching published commit remains responsive on mobile using the verified mobile preview at the same release

- [x] Generate a high-quality realistic waste-orbit hero asset with plastic bottle, tin can, glass bottle, cardboard, and organic waste; preserve a text-safe left side and no baked UI labels
- [x] Replace the CSS placeholder material objects with the generated visual asset while preserving responsive and reduced-motion behavior
- [x] Verify and publish the improved hero in English, Arabic RTL, light/dark, and mobile views

- [x] Save a checkpoint to publish the realistic-material hero asset and removal of old icon overlays
- [x] Verify the published homepage in English and Arabic RTL, light/dark, and at least one mobile viewport

- [x] Force-refresh the public homepage bundle after realistic hero integration so the live domain no longer serves the old CSS material icons

- [x] Confirm the refreshed realistic hero on the live public page in both English and Arabic RTL with explicit light and dark visual states
- [x] Confirm the published release remains responsive using the matching mobile preview after the public bundle refresh

- [x] Add clearly visible layered animation over the realistic hero image: rotating rings, moving energy particles, and independent material drift
- [x] Preserve reduced-motion behavior and verify the animation in English, Arabic RTL, light/dark, and mobile views before publishing

- [x] Add independent motion anchors for the five material positions so the objects visibly drift separately from the base artwork
- [x] Re-verify the animated hero after this motion-layer change in English, Arabic RTL, light/dark, and mobile
- [x] Save a checkpoint and verify the published homepage shows the new in-image animation

- [x] Capture explicit local light-mode and dark-mode hero checks after adding material drift anchors
- [x] Verify the updated hero with reduced-motion enabled so the motion layer stops cleanly without visual breakage

- [x] Align the hero composition with the supplied reference while preserving the static navigation, headline, CTA buttons, and bottom cards
- [x] Make the central Energy Core visibly animated with fluid cyan/lime plasma, continuous orbit rings, particles, and independently orbiting waste materials
- [x] Keep CLASSIFY, CALCULATE, and CONNECT labels static, preserve RTL/theme/mobile/reduced-motion support, then test and publish

- [x] Save a checkpoint to publish the reference-aligned animated Energy Core and static function labels
- [x] Verify the published homepage in English and Arabic RTL, light/dark, and mobile views

- [x] Prepare a comprehensive Arabic report covering Enercyra features, architecture, calculations, design iterations, validation, deployment, assumptions, and remaining limitations

- [x] Replace only the top-left logo icon in the supplied website screenshot with the exact attached Enercyra logo; preserve all other pixels and text

- [x] Restore the exact circular Enercyra logo mark in the top-left header without changing the wordmark or tagline
- [x] Remove the static/image-like right-side hero treatment and rebuild it as separate interactive material objects with animated energy rings
- [x] Verify the new header and interactive hero in English, Arabic RTL, light/dark, desktop, mobile, and reduced-motion modes, then publish

- [x] Save a checkpoint to publish the exact circular logo and interactive material hero
- [x] Verify the published homepage in English and Arabic RTL, light/dark, desktop, and mobile views
- [x] Force-refresh the public bundle after the public host still served the previous image-led hero instead of the interactive material orbit

- [x] Replace stylized hero material icons with more realistic transparent bottle, can, glass, cardboard, and organic-waste objects while preserving the existing orbit animation
- [x] Verify the refined realistic hero in English, Arabic RTL, light/dark, desktop, mobile, and reduced-motion modes
- [x] Publish the refined hero and provide the updated public URL

- [x] Optimize hero material asset loading so the page loads faster without changing the visual composition
- [x] Replace the green bottle asset with a visibly transparent glass bottle
- [x] Remove the dark circular background behind the centered Enercyra logo while preserving its glow and motion
- [x] Verify the refined hero in English, Arabic RTL, light/dark, desktop, mobile, and reduced-motion modes
- [x] Publish the optimized hero refinement and provide the updated public URL

- [x] Reproduce why the public hero still appears unchanged after the optimized-glass-transparent-core checkpoint
- [x] Make the glass bottle visibly transparent and the center logo background-free in a cache-busted public bundle
- [x] Verify the corrected appearance on the public domain and publish the final fix

- [x] Add a restrained energy pulse from the center logo through the orbit rings without visual overload
- [x] Verify the energy-light motion in English, Arabic RTL, light/dark, mobile, and reduced-motion modes
- [x] Publish the energy-light refinement and provide the updated public URL

- [x] Research real Egyptian recycling and waste-management businesses with publicly verifiable names, activities, addresses, phone numbers, websites, and source URLs
- [x] Add a bilingual Businesses page with verified company cards, search/filter affordances, contact actions, and source attribution
- [x] Update the global navigation and visual style to match the supplied compact reference header while preserving existing routes
- [x] Verify Businesses content, Arabic RTL, English, responsive layouts, themes, and regression tests
- [x] Publish the Businesses page and updated navigation with the verified public URL

- [x] Reposition CLASSIFY, CALCULATE, and CONNECT around the hero orbit to match the supplied reference composition
- [x] Restyle their icons and connector accents for clear contrast in Light, Dark, and Arabic RTL layouts
- [x] Verify the revised hero labels on desktop/mobile and publish the update

- [x] Remove the thin light beam emerging from the center logo without changing the energy rings or material animation
- [x] Verify the beam removal in Light, Dark, Arabic RTL, mobile, and reduced-motion modes, then publish

- [x] Move CONNECT away from the organic material into clear orbit space
- [x] Remove the remaining vertical scan line near CALCULATE and verify the callout icons remain clean
- [x] Recheck Light, Dark, Arabic RTL, mobile, reduced motion, tests, and publish the correction

- [x] Diagnose why the public callout correction still appears unchanged or visually incorrect
- [x] Make CONNECT clearly separate from the organic material and remove all remaining line layers near CALCULATE
- [x] Verify the corrected public bundle in English, Arabic RTL, Light, Dark, and mobile before publishing

- [x] Place CONNECT / تواصل in a clear visible area like the reference, fully outside material images and without clipping
- [x] Verify the new CONNECT placement in Light, Dark, Arabic RTL, mobile, and the public deployment

- [x] Remove the WASTE INTELLIGENCE FOR BUSINESS eyebrow from the homepage hero
- [x] Remove the Estimates are labeled and transparent row and Arabic / English labels from the homepage hero
- [x] Rebalance and verify the homepage in English, Arabic RTL, Light/Dark, mobile, and public deployment

- [x] Replace the static Recent Analysis example with the latest actual saved classification or an honest empty state
- [x] Refine the three homepage feature cards with distinct accurate icons and non-repetitive bilingual copy
- [x] Verify the focused homepage changes in English, Arabic RTL, Light/Dark, mobile, tests, and public deployment

- [x] Remove the homepage three-step section labeled A simple three-step flow / ثلاث خطوات واضحة
- [x] Remove the footer phrase Reference estimates / التقديرات مرجعية
- [x] Remove the misplaced CONNECT / تواصل label from the referenced visual area without altering the main layout
- [x] Validate the final cleanup in English, Arabic RTL, Light/Dark, mobile, tests, and confirm the exact latest public bundle

- [x] Show the actual classified image in Recent Analysis with its saved material name, confidence, value status, and energy status
- [x] Add a contextual Connect action inside Recent Analysis only when a real classification exists
- [x] Validate actual and empty Recent Analysis states in English, Arabic RTL, Light/Dark, mobile, tests, and public deployment

- [x] Fix Recent Analysis to render the actual classified image instead of an abbreviated text placeholder
- [x] Make the three homepage feature cards clickable to Classify, Result/estimates, and Businesses
- [x] Restore a visible contextual Connect / تواصل action and verify it is not hidden or clipped
- [x] Validate the fixes in English, Arabic RTL, Light/Dark, mobile, tests, and the latest public deployment
- [x] Fix homepage feature-card arrows so each card reliably navigates to its referenced page
- [x] Restore and verify visible Connect / تواصل in Recent Analysis when a real classification exists
- [x] Re-test navigation and Recent Analysis in English, Arabic RTL, light/dark, and production build
- [x] Move Connect / تواصل into the central hero energy orbit below the core, matching the supplied reference composition
- [x] Remove Connect / تواصل from Recent Analysis while preserving the truthful result metadata and image
- [x] Re-test the hero and Recent Analysis in English, Arabic RTL, light/dark, responsive layouts, tests, and production build
