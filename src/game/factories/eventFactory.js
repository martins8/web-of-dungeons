export default class EventFactory {
  static fromActionResult(result) {
    const events = [];

    // 1️⃣ ATTACK
    if (!result.isEvaded && result.damage > 0) {
      events.push({
        type: "ATTACK",
        payload: {
          source: result.attacker,
          target: result.defender,
          damage: result.damage,
          isCritical: result.isCritical,
          damageType: result.typeDamage,
        },
      });
    }

    if (result.isEvaded) {
      events.push({
        type: "EVADE",
        payload: {
          source: result.defender,
          target: result.attacker,
        },
      });
    }
    // HEAL
    if (result.heal > 0) {
      events.push({
        type: "HEAL",
        payload: {
          source: result.attacker,
          heal: result.heal,
        },
      });
    }
    // 2️⃣ DOT
    if (result.dot?.onAttacker > 0) {
      events.push({
        type: "DOT_TICK",
        payload: {
          target: result.attacker,
          amount: result.dot.onAttacker,
        },
      });
    }

    if (result.dot?.onDefender > 0) {
      events.push({
        type: "DOT_TICK",
        payload: {
          target: result.defender,
          amount: result.dot.onDefender,
        },
      });
    }

    // 3️⃣ HOT
    if (result.hot?.onAttacker > 0) {
      events.push({
        type: "HOT_TICK",
        payload: {
          target: result.attacker,
          amount: result.hot.onAttacker,
        },
      });
    }

    if (result.hot?.onDefender > 0) {
      events.push({
        type: "HOT_TICK",
        payload: {
          target: result.defender,
          amount: result.hot.onDefender,
        },
      });
    }

    // 4️⃣ DEATH
    if (result.isDead && result.isDeadByDot === null) {
      events.push({
        type: "DEATH",
        payload: {
          target: result.defender,
        },
      });
    }

    if (result.isDeadByDot !== null) {
      events.push({
        type: "DEATH_BY_DOT",
        payload: {
          target:
            result.isDeadByDot === "attacker"
              ? result.attacker
              : result.defender,
        },
      });
    }

    if (result.isDraw) {
      events.push({
        type: "DRAW",
        payload: {
          source: result.attacker,
          target: result.defender,
        },
      });
    }

    return events;
  }
}
