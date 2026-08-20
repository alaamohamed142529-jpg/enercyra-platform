import json
import sys
from pathlib import Path

import torch
from PIL import Image
from torchvision import models, transforms


def load_model(model_dir: Path):
    with (model_dir / "model_info.json").open("r", encoding="utf-8") as handle:
        info = json.load(handle)
    with (model_dir / "class_mapping.json").open("r", encoding="utf-8") as handle:
        class_mapping = json.load(handle)

    model = models.mobilenet_v3_large(weights=None)
    model.classifier[3] = torch.nn.Linear(model.classifier[3].in_features, int(info["num_classes"]))
    state = torch.load(model_dir / "best_mobilenetv3.pth", map_location="cpu", weights_only=True)
    model.load_state_dict(state)
    model.eval()
    transform = transforms.Compose([
        transforms.Resize((int(info["input_size"]), int(info["input_size"]))),
        transforms.ToTensor(),
        transforms.Normalize(mean=info["normalize_mean"], std=info["normalize_std"]),
    ])
    return model, transform, class_mapping


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: infer_mobilenet.py IMAGE_PATH")
    project_root = Path(__file__).resolve().parents[1]
    model, transform, class_mapping = load_model(project_root / "model")
    with Image.open(sys.argv[1]) as source:
        image = source.convert("RGB")
        tensor = transform(image).unsqueeze(0)
    with torch.inference_mode():
        probabilities = torch.softmax(model(tensor), dim=1)[0]
    top_values, top_indices = torch.topk(probabilities, k=min(5, probabilities.shape[0]))
    top = []
    for value, index in zip(top_values.tolist(), top_indices.tolist()):
        key = str(index)
        top.append({"classId": key, "className": class_mapping.get(key, key), "confidence": round(float(value), 6)})
    best = top[0]
    print(json.dumps({"classId": best["classId"], "className": best["className"], "confidence": best["confidence"], "top": top}, ensure_ascii=False))


if __name__ == "__main__":
    main()
