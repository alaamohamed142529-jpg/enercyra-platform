import json
from pathlib import Path

import torch
from torchvision import models

root = Path(__file__).resolve().parents[1]
model_dir = root / "model"
with (model_dir / "model_info.json").open("r", encoding="utf-8") as handle:
    info = json.load(handle)

model = models.mobilenet_v3_large(weights=None)
model.classifier[3] = torch.nn.Linear(model.classifier[3].in_features, int(info["num_classes"]))
state = torch.load(model_dir / "best_mobilenetv3.pth", map_location="cpu", weights_only=True)
model.load_state_dict(state)
model.eval()
example = torch.zeros(1, 3, int(info["input_size"]), int(info["input_size"]), dtype=torch.float32)
torch.onnx.export(
    model,
    example,
    model_dir / "mobilenetv3.onnx",
    input_names=["image"],
    output_names=["logits"],
    dynamic_axes={"image": {0: "batch"}, "logits": {0: "batch"}},
    opset_version=17,
)
print(model_dir / "mobilenetv3.onnx")
