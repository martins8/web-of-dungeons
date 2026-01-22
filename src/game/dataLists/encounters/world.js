/* 
  mobs: list that contain possible mobs to encounters
  type: world | dungeon | event
      WORLD: this type is a normal mobs encounters that the player need to pass
              complete missions or get some specifics materials to open the dungeon of the phase
              like a farming and training combat etc.
      DUNGEON: this type is the main content of the game, is hard because all of mobs are elite,
               and have bosses to pass, the player will need more potions and cap the stats to pass
      EVENT: this is a narrative encounter (implements in future)

*/

/* 
  pool: [
  id: string;
  weight: number;
  maxAppear?: number;
  fixedRound?: number;
];

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
