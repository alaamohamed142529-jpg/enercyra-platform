# Enercyra Verification Notes

## Production checkpoint

The ONNX Runtime deployment is published at https://enercyraai-drvxzjat.manus.space/ from checkpoint `95c738dd`. The custom container installs Python, Pillow, NumPy, and ONNX Runtime rather than the heavyweight PyTorch runtime.

## Verified flows

The same one-pixel PNG fixture produced the same top class and effectively identical confidence from the original PyTorch script and the ONNX script (`light_bulb`, 0.261873 versus 0.261876). The local suite passes all 13 Vitest tests, TypeScript validation, and the production build. The published Classify page displays the live MobileNetV3 inference message, visible image and camera controls, and the reference-estimate disclaimer.

On the published site, the theme toggle visibly changes the page between light and dark modes and the selected dark mode persists after reload. Signed-out `/publish` and `/my-listings` show authentication gates. Arabic navigation and RTL Classify layout are visible; Result safety copy is checked separately below.

## Browser automation limitation

The published page exposes a browser file input inside the styled upload label, but the browser automation environment could not locate the hidden input for upload. This is an automation limitation rather than an application error. Manual device selection remains available through **Choose Image** and **Use Camera**. The visible Classify status and error copy are implemented in the UI, and the inference error contract is covered by the server tests.

## Arabic Result safety check

The published Arabic Result route renders in RTL with a visible confidence ring, the Arabic sentence that all values are reference estimates, and `تقدير مرجعي` tags on reference price, estimated value, and estimated energy. The light/dark theme contrast remains readable in the checked views.

The published tRPC procedure was also exercised directly with the fixture because the browser could not target the hidden file input. It returned `classId: 11`, `className: light_bulb`, confidence `0.261876`, and the same top-five ordering as the local ONNX run.
