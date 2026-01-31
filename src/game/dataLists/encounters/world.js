/**
 * Encounter definitions for world content. Each encounter contains a pool of
 * candidate mob ids with weights and optional limitations (`maxAppear` and
 * `fixedRound`). The `EncounterSystem` consumes these definitions to
 * generate concrete encounter sequences.
 *
 * Pool entry shape: { id: string, weight: number, maxAppear?: number, fixedRound?: number }
 */

export const worldEncounters = {
  encounter_01: {
    type: "world",
    rounds: 10,
    pool: [
      { id: "wolf_01", weight: 1, maxAppear: 3 },
      { id: "rat_01", weight: 1, maxAppear: 3 },
      { id: "bandit_01", weight: 1, maxAppear: 3 },
      { id: "mage_01", weight: 1, maxAppear: 2 },
      { id: "bandit_02", weight: 0.1, maxAppear: 1 },
    ],
  },
};
