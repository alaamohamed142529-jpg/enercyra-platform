# Enercyra model integration note

The uploaded model package provides the MobileNetV3-Large architecture details, the 224px preprocessing contract, the 37-class mapping, and the `.pth` weights. The current web MVP intentionally keeps the Result route as a clearly labeled preview until a real inference runtime is attached.

The remaining deployment decision is whether to host a Python/PyTorch inference service separately or add a custom production container that includes Python, PyTorch, torchvision, and the model weights. The default Node autoscale runtime should not silently receive a large PyTorch dependency or claim to classify images without the runtime being configured.

When the runtime is selected, the endpoint contract should accept an image and return `class_id`, `display_name_en`, `display_name_ar`, and `confidence`. The reference calculation layer must remain separate: it consumes the predicted class and user-provided weight, then returns only explicitly labeled Reference Estimates. Missing price or LHV values must remain `null`/pending rather than being invented.
