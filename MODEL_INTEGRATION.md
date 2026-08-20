# Enercyra model integration note

The uploaded model package provides the MobileNetV3-Large architecture details, the 224px preprocessing contract, the 37-class mapping, and the `.pth` weights. The web project now includes a real PyTorch inference bridge; the Result route remains able to show a clearly labeled demo state only when no classification session exists.

The project uses a root Dockerfile that adds Python 3, CPU PyTorch/torchvision, Pillow, and the model files to the Node runtime. This is intentionally explicit because the default Node-only image cannot execute the uploaded checkpoint.

The endpoint contract accepts an image data URL and returns `class_id`, `class_name`, `confidence`, and top predictions. The reference calculation layer remains separate: it consumes the predicted class and user-provided weight, then returns only explicitly labeled Reference Estimates. Missing price or LHV values remain `null`/pending rather than being invented.

## Real inference contract

The Classify page converts the selected image to a bounded JPEG data URL and calls `inference.classify`. The server validates the image data, writes a short-lived file under `/tmp`, and invokes `scripts/infer_mobilenet.py`. The script loads `model/best_mobilenetv3.pth`, rebuilds MobileNetV3-Large with 37 output classes, applies 224x224 RGB preprocessing and the notebook ImageNet mean/std values, then returns the numeric class ID, mapped class name, confidence, and top predictions.

The client maps the returned class name through `shared/model-classes.ts` and stores this Result session contract:

```json
{
  "source": "model",
  "modelClassId": "24",
  "classId": "plastic",
  "displayNameEn": "Plastic",
  "displayNameAr": "بلاستيك",
  "confidence": 0.941234,
  "imageName": "waste-photo.jpg",
  "imageDataUrl": "data:image/jpeg;base64,..."
}
```

Result reads the stored class and confidence to render the model output and uses the matching catalog record for reference calculations. Publish uses the same stored object and persists `classId`, bilingual display names, and `imageMetadata` containing `source`, `modelClassId`, `confidence`, filename, and timestamp. `server/classification-contract.test.ts` verifies this complete mapping contract.

Production deployment uses the root Dockerfile to add Python 3, CPU PyTorch/torchvision, Pillow, and the model files. The container remains request-bound: one inference is executed during the upload request and temporary files are removed afterward.
