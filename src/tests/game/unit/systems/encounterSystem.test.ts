jest.mock("src/game/factories/mobFactory", () => ({
  __esModule: true,
  default: {
    fromMobId: jest.fn((id) => ({ id, mocked: true })),
  },
}));

import EncounterSystem from "src/game/systems/encounterSystem";
import MobFactory from "src/game/factories/mobFactory";
import SeedRNG from "src/game/rng/seedRNG";

describe("EncounterSystem", () => {
  const mockRng = {
    next: jest.fn(),
  };

  const encounter = {
    rounds: 5,
    pool: [
      { id: "a", weight: 1, maxAppear: 2 },
      { id: "b", weight: 1, maxAppear: 3 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("generates exactly N rounds", () => {
    mockRng.next.mockReturnValue(0.1);

    const system = new EncounterSystem(encounter, { rng: mockRng });
    const result = system.generate();

    expect(result).toHaveLength(5);
  });

  test("does not exceed maxAppear", () => {
    mockRng.next.mockReturnValue(0.1);

    const system = new EncounterSystem(encounter, { rng: mockRng });
    const result = system.generate();

    const counts = result.reduce((acc, mob) => {
      acc[mob.id] = (acc[mob.id] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts["a"]).toBeLessThanOrEqual(2);
    expect(counts["b"]).toBeLessThanOrEqual(3);
  });

  test("respects fixedRound", () => {
    mockRng.next.mockReturnValue(0.9);

    const fixedEncounter = {
      rounds: 3,
      pool: [
        { id: "boss", weight: 1, fixedRound: 3 },
        { id: "mob", weight: 1 },
      ],
    };

    const system = new EncounterSystem(fixedEncounter, { rng: mockRng });
    const result = system.generate();

    expect(result[2].id).toBe("boss");
  });

  test("throws error if no valid mobs can fill encounter", () => {
    const brokenEncounter = {
      rounds: 2,
      pool: [{ id: "a", weight: 1, maxAppear: 1 }],
    };

    mockRng.next.mockReturnValue(0.1);

    const system = new EncounterSystem(brokenEncounter, { rng: mockRng });

    expect(() => system.generate()).toThrow("No valid mobs to fill encounter");
  });

  test("resolves mob ids into Mob instances", () => {
    mockRng.next.mockReturnValue(0.1);

    const system = new EncounterSystem(encounter, { rng: mockRng });
    const result = system.generate();

    expect(MobFactory.fromMobId).toHaveBeenCalled();
    expect(result[0]).toHaveProperty("mocked", true);
  });
});

describe("EncounterSystem - deterministic seed", () => {
  test("generates the same encounter with the same seed", () => {
    const seed = 123456;

    const encounter = {
      rounds: 6,
      pool: [
        { id: "wolf", weight: 1, maxAppear: 3 },
        { id: "rat", weight: 1, maxAppear: 3 },
        { id: "bandit", weight: 0.5, maxAppear: 2 },
      ],
    };

    const rngA = new SeedRNG(seed);
    const rngB = new SeedRNG(seed);

    const systemA = new EncounterSystem(encounter, { rng: rngA });
    const systemB = new EncounterSystem(encounter, { rng: rngB });

    const resultA = systemA.generate().map((mob) => mob.id);
    const resultB = systemB.generate().map((mob) => mob.id);

    expect(resultA).toEqual(resultB);
  });

  test("different seeds generate different encounters", () => {
    const encounter = {
      rounds: 6,
      pool: [
        { id: "wolf", weight: 1 },
        { id: "rat", weight: 1 },
        { id: "bandit", weight: 1 },
      ],
    };

    const systemA = new EncounterSystem(encounter, {
      rng: new SeedRNG(111),
    });

    const systemB = new EncounterSystem(encounter, {
      rng: new SeedRNG(999),
    });

    const resultA = systemA.generate().map((mob) => mob.id);
    const resultB = systemB.generate().map((mob) => mob.id);

    expect(resultA).not.toEqual(resultB);
  });
});
