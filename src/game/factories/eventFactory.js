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

    // 4️⃣ Morte
    if (result.isDead) {
      events.push({
        type: "DEATH",
        payload: {
          target: result.defender,
        },
      });
    }

    return events;
  }
}
