# Live MVP Review — 2026-08-20

The deployed homepage is available at `https://enercyraai-drvxzjat.manus.space/`.

English review: the public homepage renders the Enercyra brand, dark navy/emerald/lime visual system, navigation, Classify and Marketplace CTAs, transparent Reference Estimate messaging, and a recent-analysis preview. The homepage is visually coherent and mobile-first, but the recent analysis remains a preview with pending value/energy.

Arabic review: the live RTL switch works across the header, navigation, hero, cards, and footer. The Arabic heading uses conversational copy “شوف النفايات. شوف قيمتها.”, while the formal supporting text explains classification, reference value, energy content, and business connections. The layout reverses correctly and remains readable on the desktop viewport.

Adjustment candidates to revisit: decide whether the Arabic tagline should remain conversational or use “اكتشف النفايات. اكتشف قيمتها.” consistently; replace the temporary PET/recent-analysis preview when real inference is connected; and review the mobile header density after all public routes are checked.

The deployed Classify page exposes the upload area, Choose Image, Use Camera, privacy note, example-result link, and an explicit note that the Python inference endpoint is not connected. The public route is reachable without authentication.

The live theme toggle successfully switches the page from the dark navy system to a light theme and keeps the layout interactive. The light variant is readable but has lower contrast in some secondary card text; this is a possible visual refinement for the next pass.

Signed-out protection checks: `/publish` shows “Sign in to publish” and no form fields; `/my-listings` shows “Sign in to access your listings” and no private listing data. Both routes expose only the authentication CTA while public navigation remains available.

The deployed `/publish` and `/my-listings` routes were verified while signed out: both show authentication gates and no private content. The Classify upload control is present, but automated file attachment could not locate the hidden input in the deployed browser session; this is a tooling limitation for the hidden input, not a confirmed product error. The page still exposes both Choose Image and Use Camera controls and a clear Preview note.

Post-fix visual verification: the Home hero now shows the Enercyra mark in the orbit center and five clear vector material icons around it instead of the earlier text glyph placeholders. Desktop and 390px mobile captures were checked in English and Arabic RTL, with light-theme preview states included. The visual stays within the approved navy/emerald/lime/cyan direction; the mobile layout stacks the hero cleanly and preserves the Arabic RTL order.

Asset decision: keep the hero as inline vector visuals rather than external PNG mockup assets. The supplied concept image is a design reference sheet, not a production-ready transparent asset; inline vectors avoid broken image URLs and scale better across themes and devices.

Contrast refinement review: Light Mode now uses deeper navy body text, deeper green accent text, darker cyan labels, stronger button fills, and slightly more visible card borders. The revised English and Arabic hero captures read more clearly on desktop and 390px mobile. The headline remains large and intentionally dominant, while the orbit visual is visually connected through matching green/cyan accents.
