import StatsCalculator from "src/game/services/statsCalculator";
import Attributes, {
  AttributesProps,
  AttributeKey,
} from "src/game/value-objects/attributes";
import Health from "src/game/gcomponents/health";
import CritSystem from "../rng/critSystem";
import EvadeSystem from "../rng/evadeSystem";
import utils from "src/game/utils/utils";
import TurnSystem from "../systems/turnSystem";
import CombatState from "../gcomponents/combatState";
import Experience from "../gcomponents/experience";
import Gold from "../gcomponents/gold";
import Inventory from "../gcomponents/inventory";
import Item, { ItemParam } from "src/game/value-objects/item";
import type Skill from "src/game/value-objects/skill";
import type Stats from "src/game/value-objects/stats";
import { MobRewards } from "./mob";
import EquipmentsSlots from "../gcomponents/equipmentSlots";
import type {
  EquipmentSlotsInit,
  EquipmentSlotKey,
} from "../gcomponents/equipmentSlots";

const BASE_ATTR_POINTS = 14;
const ATTR_POINTS_PER_LEVEL = 2;

export type CharacterInit = {
  name: string;
  attrValues: AttributesProps;
  skills?: Skill[];
  isMob?: boolean;
  gold?: number;
  xp?: number;
  attrPoints?: number;
  inventorySize?: number;
  inventoryItems?: Item[];
  equippedItems?: EquipmentSlotsInit;
};

export default class Character {
  name: string;
  attributes: Attributes;
  stats: Stats;
  health: Health;
  critSystem: CritSystem;
  evadeSystem: EvadeSystem;
  skills: Skill[];
  turnSystem: TurnSystem;
  combatState: CombatState | null;
  private _isMob: boolean;
  gold: Gold;
  xp: Experience;
  attrPoints: number;
  inventory: Inventory;
  equipmentSlots: EquipmentsSlots;

  constructor(init: CharacterInit) {
    const {
      name,
      attrValues,
      skills = [],
      isMob = false,
      gold = 0,
      xp = 0,
      attrPoints = 0,
      inventorySize = 20,
      inventoryItems = [],
      equippedItems = {},
    } = init;
    utils.validateName(name, isMob);
    this.name = name;
    this.attributes = new Attributes(attrValues);
    this.stats = StatsCalculator.calculate(this.attributes);
    this.health = new Health(this.stats.maxHp);
    this.critSystem = new CritSystem({
      bonusPerFail: 2,
      maxChance: 50,
    });
    this.evadeSystem = new EvadeSystem({
      bonusPerFail: 1,
      maxChance: 40,
    });
    this.skills = skills;
    this.turnSystem = new TurnSystem();
    this.combatState = null;

    this._isMob = isMob;

    this.gold = new Gold(gold);
    this.xp = new Experience(xp);
    this.inventory = new Inventory(inventorySize, inventoryItems);

    if (!this._isMob && attrPoints < 0) {
      throw new Error("Invalid attrPoints state");
    }
    this.attrPoints = attrPoints;

    if (Object.keys(equippedItems).length > 0) {
      this.equipmentSlots = new EquipmentsSlots(equippedItems);
    } else {
      this.equipmentSlots = new EquipmentsSlots();
    }
  }
  // this method needs to go a factory
  /*
  initAttrPoints() {
    if (this._isMob) {
      this.attrPoints = 0;
      return;
    }
    const level = this.xp.level;
    this.attrPoints = BASE_ATTR_POINTS + (level - 1) * ATTR_POINTS_PER_LEVEL;
  }
  */

  // Inventory and Equipment management
  public bagToEquipmentSlots(id: string): void {
    const item = this.inventory.getItemById(id);
    if (!item) {
      throw new Error("Item not found in inventory.");
    }
    if (item.type !== "equipment" || !item.equipmentItem) {
      throw new Error("Item is not an equipment.");
    }
    this.equipmentSlots.equipItem(item.equipmentItem.slot, {
      id: item.id,
      type: item.type,
      metadata: item.metadata,
      equipmentItem: item.equipmentItem,
    });
    this.inventory.removeItem(id);
  }

  public equipmentSlotsToBag(id: string): void {
    const item = this.equipmentSlots.getEquippedItemById(id);
    if (!item) {
      throw new Error(`Equipment with id '${id}' not found in slots.`);
    }
    this.unequipToInventory(item);
  }

  public unequipSlotToBag(slot: EquipmentSlotKey): void {
    const item = this.equipmentSlots.getEquippedItem(slot);
    if (!item) {
      throw new Error(`No equipment in slot: ${slot}.`);
    }
    this.unequipToInventory(item);
  }

  // Rewards and progression
  public gainRewards(rewards: MobRewards, droppedItems: Item[] = []): void {
    this.gold.add(rewards.gold);
    this.gainXP(rewards.xp);

    // Add dropped items to inventory
    if (droppedItems.length > 0) {
      this.inventory.addItem(droppedItems);
    }
  }

  private gainXP(amount: number): void {
    const oldLevel = this.xp.level;
    this.xp.gain(amount);
    const newLevel = this.xp.level;

    if (newLevel > oldLevel) {
      this.onLevelUp(oldLevel, newLevel);
    }
  }

  private onLevelUp(oldLevel: number, newLevel: number): void {
    this.attrPoints += (newLevel - oldLevel) * ATTR_POINTS_PER_LEVEL;
  }

  public increaseAttr(attribute: AttributeKey, amount: number): void {
    if (amount > this.attrPoints) {
      throw new Error(
        `Error: insufficient attribute points amount: ${amount} | u have: ${this.attrPoints}`,
      );
    }
    if (amount < 1) {
      throw new Error("Error: increase needs to be a positive number");
    }

    this.attributes = this.attributes.increase(attribute, amount);
    this.attrPoints -= amount;
  }

  // Combat state management
  public initCombatState(): void {
    if (this.combatState) return;
    this.combatState = new CombatState(
      this.stats,
      this.attributes,
      this.equipmentSlots.getEquippedItems(),
    );
  }

  public finishCombatState(): void {
    this.combatState = null;
  }

  // Skill management
  public getSkillById(id: string): Skill {
    const skill = this.skills.find((s) => s.id === id);
    if (!skill) throw new Error(`Skill ${id} not found`);
    return skill;
  }

  // Turn management
  public startTurn(): void {
    this.turnSystem.startTurn();
  }

  public endTurn(): void {
    this.turnSystem.endTurn();
  }

  // Utility methods
  public isMob(): boolean {
    return this._isMob;
  }

  public isDead(): boolean {
    return this.combatState?.isDead() ?? false;
  }

  private unequipToInventory(
    item: Extract<ItemParam, { type: "equipment" }>,
  ): void {
    if (this.inventory.isFull()) {
      throw new Error("Inventory is full.");
    }
    this.equipmentSlots.unequipItem(item.equipmentItem.slot);
    this.inventory.addItem([new Item(item)]);
  }
}
