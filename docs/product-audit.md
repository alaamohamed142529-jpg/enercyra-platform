# Enercyra Product Audit

## Current status

Enercyra now has a working bilingual public experience, real 37-class MobileNetV3 inference, safe reference-estimate calculations, marketplace listing flows, and authenticated publishing. The Result screen correctly distinguishes **energy-recovery potential** from a confirmed energy calculation. Numerical price and energy outputs remain intentionally unavailable until approved reference data is supplied.

## Highest-priority gaps

| Priority | Gap | Why it matters | Recommended next implementation |
| --- | --- | --- | --- |
| 1 | Verified reference data workflow | Without approved price and LHV records, users cannot receive numerical estimates for real classes. | Add an admin-only catalog review table with source, region, effective date, unit, and approval status. Keep unapproved values hidden. |
| 2 | Buyer/seller contact flow | Marketplace listings currently expose a contact action but do not yet provide a complete in-platform inquiry workflow. | Add a protected inquiry form, seller notifications, and a listing-level message status. |
| 3 | Listing moderation and trust | Public listings need report, hide, expiry, and basic abuse controls before wider sharing. | Add listing status, report reason, owner controls, and an admin moderation queue. |
| 4 | Explainability and uncertainty | A high model confidence score does not guarantee correct material identification. | Show top-3 alternatives, an “informational only” notice, and a retake-image path for low-confidence results. |
| 5 | Mobile upload robustness | Browser automation could not target the hidden file input, although manual mobile selection works. | Add a visible, labeled input with a stable test selector, file-size/type feedback, and a retry state. |
| 6 | Privacy and retention | Uploaded images flow through inference and may be retained in browser session state or listing metadata. | Add a short privacy notice, retention policy, delete-image action, and explicit consent before publishing. |
| 7 | QR and sharing polish | The public URL is QR-ready, but shared Result pages do not yet have a durable, privacy-safe share link. | Add a QR/share action for public informational pages and avoid exposing private uploaded images by default. |
| 8 | Observability | Inference failures and user drop-off are not yet visible to an operator. | Add privacy-safe error metrics, latency tracking, and a small admin health view. |

## Deliberately not filled with invented data

All 37 catalog price and LHV values remain pending. This is the correct safety behavior until a trusted dataset is approved for a defined geography and date range. The application should not convert a placeholder or a friend’s notebook into a market claim.
