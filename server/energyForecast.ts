import fs from "node:fs";
import path from "node:path";

type Matrix = number[][];
type Vector = number[];
type EnergyArtifacts = {
  lookback: number;
  horizon: number;
  weights: Record<string, number[][] | number[]>;
};
type TrainingMetadata = {
  scaler_data_min: number;
  scaler_data_max: number;
  scaler_scale: number;
  scaler_min: number;
};

const artifactDirectory = path.resolve(process.cwd(), "server/models");
const modelPath = path.join(artifactDirectory, "lstm_model.json");
const metadataPath = path.join(artifactDirectory, "training_metadata.json");

function readArtifacts(): { model: EnergyArtifacts; metadata: TrainingMetadata } {
  if (!fs.existsSync(modelPath) || !fs.existsSync(metadataPath)) {
    throw new Error(`Energy forecast artifacts are missing in ${artifactDirectory}`);
  }
  return {
    model: JSON.parse(fs.readFileSync(modelPath, "utf8")) as EnergyArtifacts,
    metadata: JSON.parse(fs.readFileSync(metadataPath, "utf8")) as TrainingMetadata,
  };
}

const artifacts = readArtifacts();
const { model, metadata } = artifacts;
const W_ih = model.weights["lstm.weight_ih_l0"] as Matrix;
const W_hh = model.weights["lstm.weight_hh_l0"] as Matrix;
const b_ih = model.weights["lstm.bias_ih_l0"] as Vector;
const b_hh = model.weights["lstm.bias_hh_l0"] as Vector;
const W_ih_1 = model.weights["lstm.weight_ih_l1"] as Matrix;
const W_hh_1 = model.weights["lstm.weight_hh_l1"] as Matrix;
const b_ih_1 = model.weights["lstm.bias_ih_l1"] as Vector;
const b_hh_1 = model.weights["lstm.bias_hh_l1"] as Vector;
const W_fc = model.weights["fc.weight"] as Matrix;
const b_fc = (model.weights["fc.bias"] as Vector | undefined) ?? [];

if (![W_ih, W_hh, b_ih, b_hh, W_ih_1, W_hh_1, b_ih_1, b_hh_1, W_fc].every(Boolean)) {
  throw new Error("Energy forecast LSTM artifact has an unexpected architecture");
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function runLayer(sequence: number[][], inputWeights: Matrix, hiddenWeights: Matrix, inputBias: Vector, hiddenBias: Vector, hiddenSize: number) {
  let hidden = Array.from({ length: hiddenSize }, () => 0);
  let cell = Array.from({ length: hiddenSize }, () => 0);
  const outputs: number[][] = [];
  for (const inputValue of sequence) {
    const gates = Array.from({ length: hiddenSize * 4 }, (_, gateIndex) => {
      const inputTerm = inputWeights[gateIndex].reduce((sum, weight, index) => sum + weight * inputValue[index], 0);
      const hiddenTerm = hiddenWeights[gateIndex].reduce((sum, weight, index) => sum + weight * hidden[index], 0);
      return inputTerm + hiddenTerm + inputBias[gateIndex] + hiddenBias[gateIndex];
    });
    const nextHidden: number[] = [];
    const nextCell: number[] = [];
    for (let index = 0; index < hiddenSize; index += 1) {
      const inputGate = sigmoid(gates[index]);
      const forgetGate = sigmoid(gates[hiddenSize + index]);
      const cellGate = Math.tanh(gates[hiddenSize * 2 + index]);
      const outputGate = sigmoid(gates[hiddenSize * 3 + index]);
      const cellValue = forgetGate * cell[index] + inputGate * cellGate;
      nextCell.push(cellValue);
      nextHidden.push(outputGate * Math.tanh(cellValue));
    }
    hidden = nextHidden;
    cell = nextCell;
    outputs.push(hidden);
  }
  return outputs;
}

function runLstm(values: number[]) {
  const firstLayer = runLayer(values.map((value) => [value]), W_ih, W_hh, b_ih, b_hh, 64);
  const secondLayer = runLayer(firstLayer, W_ih_1, W_hh_1, b_ih_1, b_hh_1, 64);
  const lastHidden = secondLayer[secondLayer.length - 1];
  return W_fc.map((weights, index) => weights.reduce((sum, weight, hiddenIndex) => sum + weight * lastHidden[hiddenIndex], 0) + (b_fc[index] ?? 0));
}

export function forecastEnergy(input: number[]) {
  if (input.length !== model.lookback) throw new Error(`Exactly ${model.lookback} daily kWh values are required`);
  if (input.some((value) => !Number.isFinite(value) || value < 0)) throw new Error("Daily kWh values must be finite non-negative numbers");
  const scaled = input.map((value) => value * metadata.scaler_scale + metadata.scaler_min);
  const scaledForecast = runLstm(scaled);
  return scaledForecast.map((value) => Math.max(0, value - metadata.scaler_min) / metadata.scaler_scale);
}

export const energyForecastConfig = Object.freeze({ lookback: model.lookback, horizon: model.horizon, artifactDirectory });
