from pathlib import Path
import json
import pickle

import joblib
import numpy as np
import torch
from sklearn.preprocessing import MinMaxScaler
from torch import nn

LOOKBACK = 14
HORIZON = 7
N_DAYS = 200
ARTIFACT_DIR = Path(__file__).resolve().parents[1] / "server" / "models"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

# The notebook Section 3 is explicitly synthetic/demo historical data.
np.random.seed(42)
torch.manual_seed(42)
days = np.arange(N_DAYS)
base_level = 150.0
weekly_pattern = 20 * np.sin(2 * np.pi * days / 7)
trend = 0.15 * days
noise = np.random.normal(0, 8, size=N_DAYS)
energy_kwh = base_level + weekly_pattern + trend + noise
for day in [40, 95, 150, 180]:
    energy_kwh[day] += np.random.choice([-60, 90])

scaler = MinMaxScaler()
scaled_energy = scaler.fit_transform(energy_kwh.reshape(-1, 1)).flatten()

def make_windows(series, lookback, horizon):
    X, y = [], []
    for index in range(len(series) - lookback - horizon + 1):
        X.append(series[index:index + lookback])
        y.append(series[index + lookback:index + lookback + horizon])
    return np.asarray(X), np.asarray(y)

X, y = make_windows(scaled_energy, LOOKBACK, HORIZON)
split_idx = int(len(X) * 0.8)
X_train = torch.tensor(X[:split_idx], dtype=torch.float32).unsqueeze(-1)
y_train = torch.tensor(y[:split_idx], dtype=torch.float32)
X_val = torch.tensor(X[split_idx:], dtype=torch.float32).unsqueeze(-1)
y_val = torch.tensor(y[split_idx:], dtype=torch.float32)

class EnergyLSTM(nn.Module):
    def __init__(self, hidden_size=64, num_layers=2, horizon=HORIZON):
        super().__init__()
        self.lstm = nn.LSTM(input_size=1, hidden_size=hidden_size, num_layers=num_layers, batch_first=True, dropout=0.2)
        self.fc = nn.Linear(hidden_size, horizon)

    def forward(self, x):
        output, _ = self.lstm(x)
        return self.fc(output[:, -1, :])

model = EnergyLSTM()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.MSELoss()
for _ in range(200):
    model.train()
    optimizer.zero_grad()
    loss = criterion(model(X_train), y_train)
    loss.backward()
    optimizer.step()

model.eval()
with torch.no_grad():
    sample = torch.tensor(scaled_energy[-LOOKBACK:], dtype=torch.float32).view(1, LOOKBACK, 1)
    sample_prediction = model(sample).numpy().flatten()
preview = scaler.inverse_transform(sample_prediction.reshape(-1, 1)).flatten().tolist()

# Requested notebook artifacts.
torch.save(model.state_dict(), ARTIFACT_DIR / "lstm_model.pt")
joblib.dump(scaler, ARTIFACT_DIR / "scaler.pkl")
# JSON is a deployment-friendly copy used by the Node inference bridge; .pt/.pkl remain canonical artifacts.
weights = {key: value.detach().cpu().numpy().tolist() for key, value in model.state_dict().items()}
(ARTIFACT_DIR / "lstm_model.json").write_text(json.dumps({"lookback": LOOKBACK, "horizon": HORIZON, "weights": weights}), encoding="utf-8")
(ARTIFACT_DIR / "training_metadata.json").write_text(json.dumps({"source": "EcoSyncAI_Energy_Pipeline.ipynb Sections 3-4", "historical_data": "synthetic demo data", "n_days": N_DAYS, "lookback": LOOKBACK, "horizon": HORIZON, "seed": 42, "scaler_data_min": float(scaler.data_min_[0]), "scaler_data_max": float(scaler.data_max_[0]), "scaler_scale": float(scaler.scale_[0]), "scaler_min": float(scaler.min_[0]), "preview_forecast_kwh": [round(value, 6) for value in preview]}, indent=2), encoding="utf-8")
print(json.dumps({"artifacts": [str(ARTIFACT_DIR / name) for name in ("lstm_model.pt", "scaler.pkl", "lstm_model.json")], "preview_forecast_kwh": [round(value, 3) for value in preview]}))
