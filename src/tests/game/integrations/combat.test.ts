// tests/game/systems/combat.integration.test.js
import Character from "src/game/entities/character";
import Combat from "src/game/systems/combat";
import physicalSkillsList from "src/game/dataLists/skills/physical/actionSkillsList";

const skills = physicalSkillsList;

describe("Combat - Integration Test", () => {
  test("should run combat, tick DoT/HoT and finish when one character dies", () => {
    // 🎲 RNG determinístico
    const rng: any = {
      rollPercent: jest.fn().mockReturnValue(99), // nunca evade nem crita
    };

    const player = new Character({
      name: "Hero",
      attrValues: {
        sta: 12,
        str: 2,
        con: 10,
        dex: 5,
        int: 5,
        wis: 5,
        agi: 5,
        cha: 5,
      },
      skills,
    });

    const enemy = new Character({
      name: "Goblin",
      attrValues: {
        sta: 8,
        str: 8,
        con: 8,
        dex: 5,
        int: 5,
        wis: 5,
        agi: 5,
        cha: 5,
      },
      skills,
    });

    const combat = new Combat(player, enemy, { rng });

    // ▶️ Inicializa combate
    combat.start();

    let result;
    let safety = 20; // evita loop infinito em caso de bug

    // 🔁 Loop de combate real
    while (!combat.finished && safety-- > 0) {
      const attacker = combat.getCurrentAttacker();
      const skill = attacker.skills[0]; // usa sempre a primeira skill

      result = combat.performAction(skill.id);

      // sanity check
      expect(result).not.toBeNull();
    }
    // ✅ Combate terminou
    expect(combat.finished).toBe(true);

    // ✅ Um dos personagens morreu
    expect(
      player.combatState !== null &&
        enemy.combatState !== null &&
        (player.combatState.isDead() || enemy.combatState.isDead()),
    ).toBe(true);

    // ✅ Log foi gerado corretamente
    expect(typeof combat.combatLog).toBe("string");
    expect(combat.combatLog.length).toBeGreaterThan(0);

    // ✅ RNG realmente participou do fluxo
    expect(rng.rollPercent).toHaveBeenCalled();

    combat.end();
    expect(enemy.combatState).toBe(null);
  });

  test("should tick DOT and HOT only once per turn (on first action)", () => {
    const rng: any = {
      rollPercent: jest.fn().mockReturnValue(99), // nunca evade nem crita
    };

    const dotSkill: any = {
      id: "dot_skill",
      name: "Dot Skill",
      rank: 1,
      typeSkill: "action",
      cooldown: 0,
      reach: 1,
      heal: 0,
      metadata: {},
      damage: {
        typeDamage: "physical",
        scaling: { pDmg: 0 },
      },
      effects: {
        effectType: "dot",
        scaling: { pDmg: 1 },
        duration: 2,
        target: "enemy",
      },
    };

    const hotSkill: any = {
      id: "hot_skill",
      name: "Hot Skill",
      rank: 1,
      typeSkill: "action",
      cooldown: 0,
      reach: 1,
      heal: 1,
      metadata: {},
      damage: {
        typeDamage: "physical",
        scaling: {},
      },
      effects: {
        effectType: "hot",
        scaling: { hPower: 1 },
        duration: 2,
        target: "self",
      },
    };

    const player = new Character({
      name: "Hero",
      attrValues: {
        sta: 10,
        str: 5,
        con: 10,
        dex: 5,
        int: 5,
        wis: 5,
        agi: 5,
        cha: 5,
      },
      skills: [dotSkill, hotSkill],
    });

    const enemy = new Character({
      name: "Goblin",
      attrValues: {
        sta: 10,
        str: 5,
        con: 10,
        dex: 5,
        int: 5,
        wis: 5,
        agi: 5,
        cha: 5,
      },
      skills: [dotSkill, hotSkill],
    });

    const combat = new Combat(player, enemy, { rng });
    combat.start();

    const playerHpBefore = player.combatState!.currentHp;
    const enemyHpBefore = enemy.combatState!.currentHp;

    // 🟢 Primeira ação do turno → TICK ACONTECE
    combat.performAction("dot_skill");

    const enemyHpAfterFirstAction = enemy.combatState!.currentHp;
    expect(enemyHpAfterFirstAction).toBeLessThan(enemyHpBefore);

    // 🟢 Segunda ação do MESMO turno → NÃO DEVE TICKAR
    combat.performAction("hot_skill");

    // 🧪 HOT foi aplicado (cura automática no tick)
    expect(player.combatState!.currentHp).toBeGreaterThanOrEqual(
      playerHpBefore,
    );

    const enemyHpAfterSecondAction = enemy.combatState!.currentHp;
    expect(enemyHpAfterSecondAction).toBe(enemyHpAfterFirstAction);
  });
});
