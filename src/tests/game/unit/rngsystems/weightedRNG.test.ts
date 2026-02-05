import WeightedRNG from "src/game/rng/weightedRNG";

describe("WeightedRNG", () => {
  const mockRng = {
    next: jest.fn(),
  };

  test("throws error if no entry has weight > 0", () => {
    const rng = new WeightedRNG(mockRng);

    expect(() =>
      rng.pick([
        { id: "a", weight: 0 },
        { id: "b", weight: 0 },
      ]),
    ).toThrow("No entries with weight > 0");
  });

  test("picks entry based on weight (deterministic)", () => {
    mockRng.next.mockReturnValue(0.1); // baixo → primeiro item

    const rng = new WeightedRNG(mockRng);

    const result = rng.pick([
      { id: "a", weight: 1 },
      { id: "b", weight: 3 },
    ]);

    expect(result.id).toBe("a");
  });

  test("picks heavier entry when roll is high", () => {
    mockRng.next.mockReturnValue(0.9); // alto → segundo item

    const rng = new WeightedRNG(mockRng);

    const result = rng.pick([
      { id: "a", weight: 1 },
      { id: "b", weight: 3 },
    ]);

    expect(result.id).toBe("b");
  });
});
