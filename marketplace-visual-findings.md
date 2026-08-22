# Marketplace visual verification

The Marketplace route now renders real listing data from the public marketplace query rather than the former hardcoded material cards. The Arabic and English layouts preserve the existing header, filters, RTL alignment, and listing-card structure. A persisted database listing without a stored image is not shown by the current image-required card filter; new successful publications carry their classified image through server storage and expose imageUrl for cards. The empty-state copy and publish CTA are implemented for the no-listing/no-image-visible state.
