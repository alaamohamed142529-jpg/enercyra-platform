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
- [x] Refine the hero orbit wording into three clear functional labels without rebuilding the homepage
- [x] Add a bilingual View all action to Recent Analysis and preserve truthful result content
- [x] Improve orbit material spacing, image scale, and visual balance across responsive and RTL layouts
- [x] Re-test the incremental visual refinement in English, Arabic RTL, themes, tests, and production build
- [x] Balance orbit image scale, positions, and spacing against the supplied reference without changing the homepage structure
- [x] Refine CLASSIFY, CALCULATE, and CONNECT label size, spacing, and placement around the orbit
- [x] Re-test the refined orbit in desktop/mobile, Arabic RTL, themes, tests, and production build
- [x] Convert the reference-inspired orbit into independent interactive HTML/CSS rings and energy layers while preserving the current homepage structure
- [x] Match the reference material positions and proportions with separate animated image elements
- [x] Preserve readable labels, Arabic RTL, reduced-motion accessibility, responsiveness, tests, and production build
- [x] Bring the existing orbit visuals closer to the supplied reference through richer ring and energy treatment
- [x] Add restrained hover, focus, and touch interaction to materials and orbit labels without disrupting navigation
- [x] Preserve RTL, reduced motion, responsiveness, tests, and production build after the enhancement
- [x] Slightly enlarge the five hero material images while preserving balanced spacing and clear labels
- [x] Re-test the enlarged material composition on desktop, mobile, Arabic RTL, themes, tests, and production build
- [x] Enlarge the five hero material images with visually balanced, near-equal perceived scale based on the supplied reference
- [x] Rebalance the five image positions and verify desktop, mobile, Arabic RTL, themes, tests, and production build
- [x] Increase the five material images relative to the orbit while keeping their perceived sizes balanced
- [x] Replace disparate vertical drift timing with coordinated orbital motion and restrained phase offsets
- [x] Re-test the coordinated orbit in desktop, mobile, Arabic RTL, themes, reduced motion, tests, and production build
- [x] Correct the five hero material positions so the lower elements are not clipped and the orbit spacing is balanced
- [x] Correct optical sizes so the can does not dominate and the bottle, glass, cardboard, and organic materials read clearly
- [x] Re-test the corrected composition on desktop, mobile, Arabic RTL, themes, motion, tests, and production build
- [x] Unify waste-element visual scale, perspective, lighting, and depth while preserving the existing Hero identity
- [x] Rebalance orbit positions and protect the central AI logo and CLASSIFY/CALCULATE/CONNECT labels from collisions
- [x] Coordinate smooth premium motion with subtle per-element phase differences and restrained orbit rings
- [x] Validate desktop/mobile, Arabic RTL, reduced motion, tests, TypeScript, and production build
- [x] Reduce the plastic bottle by 10–15% while preserving its current position and orbit role
- [x] Enlarge and refine the food-waste silhouette, add cardboard depth, and soften the outer orbit ring
- [x] Preserve the AI focus and synchronized slow motion, then validate responsive, RTL, tests, and production build
- [x] Move food waste slightly down-left while preserving the green glass bottle and all other elements
- [x] Add enough motion-phase and translation separation to prevent glass/food collisions throughout animation
- [x] Re-test the isolated pair on desktop, mobile, Arabic RTL, reduced motion, tests, and production build
- [x] Enforce a larger static gap between the green glass bottle and food waste
- [x] Constrain their animation paths so the gap remains clear at every phase
- [x] Verify multiple motion states and rerun desktop/mobile, RTL, reduced motion, tests, and production build checks
- [x] Preserve and verify existing pages and functionality while refining the Home Hero toward the supplied EcoSyncAI reference
- [x] Preserve truthful MobileNet classification/confidence separation from reference value and energy calculations
- [x] Verify dark/light mode, Arabic/English, EGP/SAR/USD/EUR, user-friendly waste names, marketplace, Egyptian businesses, and dashboard flows
- [x] Validate responsive premium UI, accessibility, tests, TypeScript, and production build
- [x] Raise the existing Hero visual group slightly without changing the text/actions or internal orbit composition
- [x] Preserve responsive, RTL, theme, interaction, and accessibility behavior after the vertical alignment adjustment
- [x] Re-run tests, TypeScript, production build, and desktop/mobile visual verification
- [x] Move CONNECT outside the orbit with a minimal dotted connector matching the other callouts
- [x] Raise the complete Hero visual group slightly while preserving its internal geometry
- [x] Re-run desktop/mobile, RTL, theme, interaction, tests, TypeScript, and production verification
- [x] Normalize CONNECT spacing and motion timing to match CLASSIFY and CALCULATE
- [x] Replace the vertical CONNECT connector with a matching subtle angled dotted connector
- [x] Re-test callout alignment on desktop/mobile, RTL, themes, tests, TypeScript, and production build
- [x] Raise and center the existing Hero visual while preserving intentional space before Recent Analysis
- [x] Rebalance five waste objects and unify CLASSIFY/CALCULATE/CONNECT labels, subtitles, and core-directed connectors
- [x] Preserve subtle continuous motion and validate desktop/mobile, RTL, themes, tests, TypeScript, and production build
- [x] Make CONNECT use the same callout animation style, timing, opacity, glow, and motion as CLASSIFY/CALCULATE
- [x] Move CLASSIFY away from the aluminum can and separate food waste from the green glass bottle
- [x] Rebalance all five objects, unify callout typography/connectors, preserve raised Hero spacing, and validate all responsive/test/build checks
- [x] Make CONNECT motion exactly match CLASSIFY and CALCULATE without changing the callout system
- [x] Move CLASSIFY farther from the decorative corner frame while preserving the frame
- [x] Re-test callout alignment, spacing, responsive behavior, RTL, themes, tests, TypeScript, and production build
- [x] Add the same blue orbital dot to CONNECT that appears with CLASSIFY and CALCULATE
- [x] Synchronize CONNECT title, dot, connector, opacity, glow, and motion with the other two callouts
- [x] Re-test three-callout visual parity, responsive behavior, RTL, themes, TypeScript, tests, and production build
- [x] Diagnose why the CONNECT dot and motion difference is not visible in the current published bundle
- [x] Apply a clearly visible shared blue dot and animation treatment to CONNECT
- [x] Validate the visible correction on desktop/mobile, RTL, themes, TypeScript, tests, and production build
- [x] Make CONNECT’s visible transform movement match CLASSIFY and CALCULATE while preserving its lower position
- [x] Validate the unified motion on desktop/mobile, RTL, themes, TypeScript, tests, and production build
- [x] Keep CONNECT horizontally centered during hover, focus, and press while matching the other callout feedback
- [x] Validate CONNECT interaction on desktop/mobile, RTL, themes, TypeScript, tests, and production build
- [x] Remove CONNECT’s remaining horizontal hover shift and match the vertical-only motion of the other labels
- [x] Validate actual hover behavior on desktop/mobile, RTL, themes, TypeScript, tests, and production build
- [x] Match CLASSIFY base color to CALCULATE and CONNECT
- [x] Add the same hover/focus color, glow, and interaction feedback to CLASSIFY
- [x] Validate three-callout color parity on desktop/mobile, RTL, themes, TypeScript, tests, and production build
- [x] Make CONNECT use the same horizontal label/icon arrangement as CLASSIFY and CALCULATE
- [x] Make CONNECT hover movement and connector treatment match the two upper callouts
- [x] Recheck CONNECT visual parity against the provided recording
- [x] Analyze the new CONNECT movement recording against current hover transforms
- [x] Match CONNECT’s hover movement path to the reference without changing its visual layout
- [x] Verify the movement fix on desktop/mobile, RTL, themes, tests, and production build
- [x] Diagnose why CONNECT hover/focus movement is not visible
- [x] Restore a clearly visible CONNECT interaction without horizontal drift
- [x] Verify CONNECT movement and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Make the full CONNECT callout hit area trigger hover movement
- [x] Match CONNECT hover response to the upper callouts without changing layout
- [x] Verify hover behavior and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Instrument and reproduce the live CONNECT hover event in the browser
- [x] Replace the ineffective CONNECT interaction path with a reliable visible hover implementation
- [x] Validate the real hover behavior and project integrity before delivery
- [x] Remove CONNECT-specific React hover state and special motion overrides
- [x] Apply exactly the shared CLASSIFY/CALCULATE hover behavior to CONNECT
- [x] Verify the simplified parity and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Match CONNECT’s dotted arrow connector to the supplied reference image
- [x] Preserve the simplified shared callout movement while adjusting only the connector
- [x] Verify connector placement and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Replace the inappropriate CONNECT arrow with the short subtle dotted leader shown in the reference
- [x] Match CONNECT connector length, angle, opacity, and timing to the other callouts
- [x] Verify the corrected connector and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Reverse CONNECT’s dotted connector so it points inward toward the AI core
- [x] Preserve matching connector length, thickness, opacity, and animation
- [x] Verify the inward direction and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Move CONNECT’s dotted connector to the inner side nearest the orbit
- [x] Match CONNECT connector length, thickness, opacity, and angle to the upper callouts
- [x] Verify the corrected inward connector and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Match CONNECT line shape exactly to CLASSIFY and CALCULATE
- [x] Match CONNECT line tilt and transform origin to the upper callouts
- [x] Verify final line parity and project integrity across desktop/mobile, RTL, themes, tests, and production build
- [x] Refine Arabic heading sizes, weights, and line-heights without changing the font
- [x] Improve Arabic small-text clarity and RTL spacing
- [x] Remove final full stops from Arabic UI sentences
- [x] Verify Arabic/English layouts, themes, responsiveness, tests, and production build
- [x] Remove the currency selector from the homepage header
- [x] Add the currency selector beside the Classification weight field
- [x] Preserve currency persistence, estimates, RTL, responsive behavior, tests, and production build
- [x] Align Classification page typography and color hierarchy with the supplied reference
- [x] Refine Classification wording and benefit labels for clearer Arabic/English meaning
- [x] Improve upload panel, benefits-card spacing, and progress-step presentation without removing functionality
- [x] Verify real upload flow, RTL, themes, responsiveness, tests, and production build
- [x] Remove the Step One eyebrow from Classification
- [x] Refine Classification heading typography and spacing
- [x] Apply a distinct accent color to the English Your Waste phrase
- [x] Verify Arabic/English layouts, themes, responsiveness, tests, and build
- [x] Remove the remaining Step 1 of 3 label permanently from Classification
- [x] Verify heading spacing and Classification functionality after removal
- [x] Match Your Waste heading color to the Enercyra logo green
- [x] Verify heading color, themes, responsiveness, tests, and production build
- [x] Update Classification benefit wording to the agreed clearer Arabic/English copy
- [x] Apply reference-inspired benefit icons, accent colors, inner cards, spacing, and hierarchy
- [x] Verify Classification benefits in Arabic/English, themes, responsive layouts, tests, and production build
- [x] Rewrite the Arabic Classification benefits and progress wording for clarity
- [x] Verify revised Arabic copy, RTL layout, responsiveness, tests, and production build
- [x] Rewrite Classification progress steps as upload, analyze, and publish
- [x] Verify Arabic/English progress wording, layout, navigation, tests, and production build
- [x] Replace the rendered Arabic progress summary with «ارفع، حلّل، انشر»
- [x] Verify the concise progress wording in Arabic/English and validate the build
- [x] Replace gray inactive progress-step styling with a suitable dark teal/cyan accent
- [x] Verify active green step, themes, RTL, responsiveness, tests, and production build
- [x] Fix the light-theme gray overlay and muted Classification surfaces
- [x] Restore clear green/cyan accents and readable light-theme text
- [x] Verify light/dark themes, RTL, responsiveness, tests, and production build
- [x] Replace remaining gray-toned light-theme Classification surfaces with pale teal-blue
- [x] Verify light/dark themes, Arabic RTL, responsiveness, tests, and production build
- [x] Refactor Light Mode into centralized brand color tokens
- [x] Replace dark/gray Light Mode surfaces with bright accessible cards and page backgrounds
- [x] Improve Light Mode text contrast, icon treatments, and theme-toggle state clarity
- [x] Verify Light/Dark modes, Arabic RTL, English, responsive layouts, tests, and production build
- [x] Add subtle turquoise separation to the main Classification cards
- [x] Strengthen the Light Mode camera-button turquoise border while keeping its light fill
- [x] Verify Light/Dark modes, RTL, responsiveness, tests, and production build
- [x] Unify all Classification benefit subtitles to the same calm gray-teal color
- [x] Prevent inherited link or element styles from creating subtitle color differences
- [x] Verify subtitle parity in English/Arabic, themes, responsiveness, tests, and production build
- [x] Add a clear AI Classification Result heading
- [x] Consolidate weight, reference price, estimated value, and estimated energy into one unified metric row
- [x] Remove the obsolete five-column metric row and oversized reference-note layout
- [x] Update Classify Another Image to camera icon plus trailing arrow
- [x] Verify real result data, RTL, English, themes, responsiveness, tests, and production build
- [x] Synchronize Reference price and Estimated value units with the selected currency
- [x] Convert displayed reference and estimated values using the selected currency rate
- [x] Hide the weight validation hint for valid positive input and show it only for invalid states
- [x] Verify all currencies and empty, zero, negative, and text weight states
- [x] Re-run RTL, theme, responsive, tests, and production build checks
- [x] Show the material's original LHV/kg immediately beneath Reference price in the same metric card, while keeping calculated value and energy pending until valid weight
- [x] Prefill Publish form with classified material, entered weight, and available category/condition while leaving location and notes blank and all fields editable
- [x] Add regression coverage and verify the Result-to-Publish handoff in English, Arabic RTL, responsive layouts, and production build
- [x] Remove the technical uploaded filename bar from the classification image preview while preserving upload and analysis feedback
- [x] Add regression coverage and verify the clean preview in English, Arabic RTL, responsive layouts, and production build
- [x] Show classification-derived material, weight, and image context on Publish without requiring re-entry
- [x] Add editable account-prefilled location and phone fields; keep condition and notes optional
- [x] Fix vertical label/input layout and verify English, Arabic RTL, responsive behavior, tests, and production build
- [x] Fix the shared Publish listing field layout so Material, Weight, Location, and Condition render with labels above controls without overlap
- [x] Add regression coverage and verify the shared layout in English, Arabic RTL, responsive views, tests, and production build
- [x] Fix the Result-to-Publish handoff so Material and Weight are real editable input values, with image and category context carried over when available
- [x] Add end-to-end regression coverage for classify → calculate → publish and verify English, Arabic RTL, responsive behavior, and production build
- [x] Remove only the Arabic marketplace navigation label «اتصالات الأعمال» while preserving the icon, route, and other links
- [x] Verify the navigation in Arabic and English and run the focused validation before publishing
- [x] Remove every remaining Business connections / اتصالات الأعمال label from marketplace-related navigation while preserving icons and routes
- [x] Verify all language variants and publish the final label-removal checkpoint
- [x] Remove the remaining marketplace eyebrow icon while preserving the Marketplace title and unrelated navigation icons
- [x] Verify English and Arabic RTL marketplace headers and publish the correction
- [x] Remove all hardcoded Marketplace mock listings and read only real published listings
- [x] Persist successful listings with material, weight, location, condition, notes, and classified image; update Marketplace immediately
- [x] Add a clear empty state with publish CTA and regression coverage for persistence, real images, RTL, responsive behavior, and production build
- [x] Diagnose why the live Marketplace screenshot still shows old hardcoded mock cards after the real-data update
- [x] Remove any remaining stale mock-data path, verify the live empty state and real listing behavior, and publish a correction
- [x] Audit and improve Enercyra logo sizing across header, footer, and major visual cards while preserving aspect ratio and rendering clarity
- [x] Verify logo consistency in English, Arabic RTL, light/dark, responsive layouts, and production build
- [x] Make every real Marketplace listing card clickable and open complete listing details
- [x] Keep card Contact buttons independent and add regression coverage for card navigation and contact isolation
- [x] Verify detail views with multiple listings in English, Arabic RTL, responsive layouts, tests, and production build
- [x] Remove the unintended dark strip or border above the shared header across the application
- [x] Verify clean page starts across key routes in light/dark, Arabic RTL, responsive layouts, tests, and production build
- [x] Add a branded QR code to About only, linking to the Enercyra homepage with a clear Arabic/English caption
- [x] Match the existing Marketplace QR style and verify destination, RTL, themes, responsive layout, tests, and production build
- [x] Fix the About QR so it encodes the correct fully qualified public URL and opens reliably when scanned
- [x] Decode and verify the QR in English, Arabic RTL, responsive views, tests, and production build
- [x] Improve Share Enercyra QR-card spacing, icon/title separation, description line-height, QR centering, and uniform padding
- [x] Verify the refined card in Arabic RTL, English, themes, responsive layouts, tests, and production build
- [x] Replace non-Egyptian Marketplace locations with all Egyptian governorates and preserve bilingual filtering behavior
- [x] Verify the complete location list, search/filter behavior, RTL, responsive layout, tests, and production build
- [x] Fix Marketplace native location dropdown option contrast in Dark Mode while preserving Light Mode and filtering
- [x] Verify dropdown readability in Arabic/English, both themes, responsive layouts, tests, and production build
- [x] Add the three supplied portraits to reliable web storage and map them in a teamMembers data array with their correct LinkedIn URLs
- [x] Add a responsive About Team section with clickable circular avatars, names, roles, hover affordances, RTL support, and regression coverage
- [x] Verify the team images and links in English/Arabic, light/dark, desktop/mobile, tests, and production build
- [x] Diagnose why the public About page does not show the newly added Team section
- [x] Verify and republish the visible Team section across English, Arabic RTL, responsive layouts, and the public domain
- [x] Remove team role labels, correct the Arabic name to «آلاء محمد», and apply Arabic-only visual order آلاء ثم هدى ثم رحمة
- [x] Verify preserved card visuals, English/Arabic RTL ordering, responsive layouts, tests, and production build
- [x] Rename the second Arabic Team member from «هدى طه» to «عهود طه» without changing image, LinkedIn link, order, or design
- [x] Verify the corrected About Team name and publish the update
- [x] Swap only the Arabic Team card positions for «آلاء محمد» and «رحمة محمد», preserving all content and styling
- [x] Verify the swapped Team order and publish the correction
- [x] Undo only the latest Arabic Team position swap and restore the previous order, keeping «عهود طه» and all other Team changes
- [x] Verify and publish the restored Arabic Team order
- [x] Change only the English Team name from «Huda Taha» to «Ohoud Taha», preserving Arabic name «عهود طه» and all other Team details
- [x] Verify and publish the English Team name correction
- [x] Diagnose why the public About page does not show the updated English Team name «Ohoud Taha»
- [x] Verify and republish the live English/Arabic Team names after resolving any stale deployment or rendering issue
- [x] Replace the stale public English Team label visibly showing «Huda Taha» with «Ohoud Taha» and verify the live card
- [x] Use the Enercyra circular logo as the browser favicon and public app/home-screen icon
- [x] Verify favicon metadata, browser rendering, responsive branding, tests, and production build
- [x] Replace the black-looking favicon with a clear Enercyra circular icon suitable for dark browser tab bars
- [x] Verify the corrected favicon in the browser, tests, production build, and public deployment
- [x] Extract Sections 3 and 4 from EcoSyncAI_Energy_Pipeline.ipynb, including the daily kWh data flow, 14-step LSTM input, 7-step forecast output, model architecture, scaler, and artifact-saving code
- [x] Prepare persistent deployment-compatible LSTM model and scaler artifacts loaded once at server startup
- [x] Add validated POST /api/forecast endpoint accepting exactly 14 numeric daily kWh values and returning 7 inverse-scaled predictions
- [x] Add bilingual Energy Forecast UI with textarea, clear validation errors, forecast action, and historical/forecast line chart
- [x] Verify the complete forecast flow, responsive presentation, tests, TypeScript, production build, and publish
- [x] Diagnose why the public domain does not show the new Energy Forecast route and compare it with preview/build output
- [x] Fix any public route, deployment, or cache issue preventing Energy Forecast from appearing
- [x] Republish and verify the public forecast page and `/api/forecast` with cache-busting
- [x] Prepare a sanitized downloadable local archive of the current Enercyra source and model artifacts
- [x] Add local setup and run instructions without including secrets
- [x] Validate the archive contents and deliver it with the local installation steps
- [x] Create a Windows portable launcher that starts Enercyra locally from a USB-drive folder
- [x] Package the built app, dependencies, runtime guidance, and model artifacts for portable use
- [x] Validate the portable package and provide simple flash-drive launch instructions
- [x] Add a Vercel-compatible serverless entrypoint for the Express/tRPC backend
- [x] Add vercel.json with the correct Vite output directory, API function routing, rewrites, and included runtime assets
- [x] Configure or document required Vercel environment variables for database, auth, storage, and frontend runtime
- [ ] Deploy the connected Git repository to Vercel and verify the UI and API instead of raw source-file responses
- [x] Document Vercel limitations for Python-based MobileNet inference and any required follow-up architecture
- [ ] Verify public Vercel routes and inspect missing environment variables after SSO is disabled
- [ ] Connect an authorized free MySQL provider and obtain a valid DATABASE_URL without exposing credentials
- [ ] Add DATABASE_URL and required OAuth/Storage variables to Vercel and redeploy
- [ ] Verify Classify, Marketplace, About, and Energy Forecast on the public Vercel domain
- [ ] Inventory every `/manus-storage/` image reference and identify the corresponding persistent source assets
- [ ] Copy all referenced images into deployable local static assets and replace every code reference
- [ ] Verify the full asset inventory, tests, production build, and Vercel deployment on Classify, Marketplace, and About
- [ ] Audit Manus and Vercel parity, including routes, assets, database, storage, and inference runtime
- [ ] Complete external-host portability for static assets, backend storage, and model paths
- [ ] Connect authorized external MySQL/storage services and configure Vercel environment variables
- [ ] Redeploy and verify Classify, Marketplace, About, Forecast, and critical API workflows on Vercel
- [ ] Report backup readiness and any remaining differences from Manus hosting

- [x] Create and validate a complete Enercyra backup archive containing frontend, backend, model artifacts, local assets, deployment files, schema, and setup documentation

- [x] Publish the complete non-secret Enercyra project to a private GitHub repository and verify it can be connected to external hosting

- [x] Move production MobileNetV3 inference from Python subprocesses to direct Node.js onnxruntime-node, harden classification JSON responses, add regression coverage, and verify/push the Vercel-compatible fix

- [ ] Allow only required native install scripts for onnxruntime-node (and sharp if required), clean-install with frozen lockfile, verify Vercel ONNX classification, and push the result to main

- [ ] Diagnose the production classification endpoint returning HTML instead of JSON, prove whether the Vercel function is reached, apply the minimum routing fix, and verify real production ONNX inference
