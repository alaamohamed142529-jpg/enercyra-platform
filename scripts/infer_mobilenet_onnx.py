import json
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: infer_mobilenet_onnx.py IMAGE_PATH")
    root = Path(__file__).resolve().parents[1]
    model_dir = root / "model"
    with (model_dir / "model_info.json").open("r", encoding="utf-8") as handle:
        info = json.load(handle)
    with (model_dir / "class_mapping.json").open("r", encoding="utf-8") as handle:
        class_mapping = json.load(handle)
    size = int(info["input_size"])
    with Image.open(sys.argv[1]) as source:
        image = source.convert("RGB").resize((size, size))
        array = np.asarray(image, dtype=np.float32) / 255.0
    mean = np.asarray(info["normalize_mean"], dtype=np.float32)
    std = np.asarray(info["normalize_std"], dtype=np.float32)
    array = (array - mean) / std
    tensor = np.transpose(array, (2, 0, 1))[None, ...]
    session = ort.InferenceSession(str(model_dir / "mobilenetv3.onnx"), providers=["CPUExecutionProvider"])
    logits = session.run(None, {session.get_inputs()[0].name: tensor})[0][0]
    logits = logits - np.max(logits)
    probabilities = np.exp(logits) / np.exp(logits).sum()
    indices = np.argsort(probabilities)[::-1][:5]
    top = []
    for index in indices:
        key = str(int(index))
        top.append({"classId": key, "className": class_mapping.get(key, key), "confidence": round(float(probabilities[index]), 6)})
    best = top[0]
    print(json.dumps({"classId": best["classId"], "className": best["className"], "confidence": best["confidence"], "top": top}, ensure_ascii=False))


if __name__ == "__main__":
    main()
