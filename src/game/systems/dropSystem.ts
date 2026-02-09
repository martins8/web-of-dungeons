import type { RandomSource } from "src/game/rng/seedRNG";
import Item from "src/game/value-objects/item";
import ItemFactory from "src/game/factories/itemFactory";

/**
 * Drop entry definition for mob rewards.
 * Each entry represents a possible item drop with its chance.
 *
 * NOTE: Unlike WeightedRNG (used in EncounterSystem) which uses proportional weights,
 * DropSystem uses ABSOLUTE percentage chances (0-100).
 *
 * WeightedRNG: weight values are relative (1:1 = 50% each, 3:1 = 75%/25%)
 * DropSystem: weight is the exact % chance (30 = 30%, 100 = guaranteed)
 *
 * This allows each item to roll independently - multiple items can drop from one mob.
 */
export interface DropEntry {
  itemId: string;
  /**
   * Drop chance as an absolute percentage (0-100).
   * - 0 = never drops
   * - 50 = 50% chance to drop
   * - 100 = always drops
   *
   * Each item rolls independently, so multiple items can drop.
   */
  weight: number;
  /**
   * Maximum times this item can appear in a single drop.
   * Default: 1 (no stacking).
   * Use higher values for materials/misc items that can stack.
   * Note: equipment items should always have maxStack = 1.
   */
  maxStack?: number;
}

export interface DropResult {
  items: Item[];
  droppedIds: string[];
}

/**
 * DropSystem handles item drop logic using weighted random chance.
 * Each item in the drop table has an independent chance to drop.
 *
 * Following DDD patterns, this system encapsulates drop calculation logic
 * and uses the project's RNG system for deterministic drops (useful for testing).
 */
export default class DropSystem {
  private rng: RandomSource;

  constructor(rng: RandomSource) {
    this.rng = rng;
  }

  /**
   * Calculate drops from a list of possible drop entries.
   * Each item has an independent chance to drop based on its weight (0-100).
   *
   * @param drops - Array of possible drops with their weights
   * @returns DropResult containing the dropped Item instances and their IDs
   */
  public calculateDrops(drops: DropEntry[] | null): DropResult {
    const result: DropResult = {
      items: [],
      droppedIds: [],
    };

    if (!drops || drops.length === 0) {
      return result;
    }

    for (const drop of drops) {
      const maxStack = drop.maxStack ?? 1;
      let dropCount = 0;

      for (let i = 0; i < maxStack; i++) {
        const roll = this.rng.next() * 100;

        if (roll <= drop.weight) {
          dropCount++;
        } else {
          // If first roll fails and maxStack > 1, could break or continue
          // For now, each stack chance is independent
          break;
        }
      }

      // Create items for the drop count
      for (let i = 0; i < dropCount; i++) {
        try {
          const item = ItemFactory.fromItemId(drop.itemId);
          result.items.push(item);
          result.droppedIds.push(drop.itemId);
        } catch (error) {
          // If item doesn't exist in registry, skip it silently
          // This prevents crashes if item data is misconfigured
          console.warn(
            `DropSystem: Failed to create item '${drop.itemId}':`,
            error,
          );
        }
      }
    }

    return result;
  }

  /**
   * Simple helper to check if a single drop would succeed.
   * Useful for testing or preview purposes.
   */
  public rollDrop(weight: number): boolean {
    const roll = this.rng.next() * 100;
    return roll <= weight;
  }
}
