import { describe, expect, it } from "vitest";
import { energyForecastConfig, forecastEnergy } from "./energyForecast";

describe("energy forecast inference", () => {
  it("loads the persisted 14-step LSTM contract and returns seven non-negative predictions", () => {
    expect(energyForecastConfig.lookback).toBe(14);
    expect(energyForecastConfig.horizon).toBe(7);
    const predictions = forecastEnergy(Array.from({ length: 14 }, (_, index) => 150 + index));
    expect(predictions).toHaveLength(7);
    expect(predictions.every((value) => Number.isFinite(value) && value >= 0)).toBe(true);
  });

  it("rejects invalid forecast inputs", () => {
    expect(() => forecastEnergy([1, 2])).toThrow(/Exactly 14/);
    expect(() => forecastEnergy([...Array(13).fill(1), Number.NaN])).toThrow(/finite non-negative/);
    expect(() => forecastEnergy([...Array(13).fill(1), -1])).toThrow(/finite non-negative/);
  });
});
