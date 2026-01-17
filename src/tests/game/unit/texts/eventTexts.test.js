import EventTexts from "src/game/texts/eventTexts";

describe("EventTexts", () => {
  test("should render physical attack text", () => {
    const events = [
      {
        type: "ATTACK",
        payload: {
          source: { name: "Hero" },
          target: { name: "Goblin" },
          damage: 12,
          damageType: "physical",
          critical: false,
        },
      },
    ];

    const text = EventTexts.fromEvents(events);

    expect(text).toContain("Hero atacou Goblin");
    expect(text).toContain("12");
    expect(text).toContain("⚔️");
  });

  test("should render critical attack", () => {
    const events = [
      {
        type: "ATTACK",
        payload: {
          source: { name: "Hero" },
          target: { name: "Goblin" },
          damage: 20,
          damageType: "physical",
          critical: true,
        },
      },
    ];

    const text = EventTexts.fromEvents(events);

    expect(text).toContain("💥");
  });

  test("should render dot tick", () => {
    const events = [
      {
        type: "DOT_TICK",
        payload: {
          target: { name: "Goblin" },
          amount: 5,
        },
      },
    ];

    const text = EventTexts.fromEvents(events);

    expect(text).toContain("Goblin");
    expect(text).toContain("5");
    expect(text).toContain("🩸");
  });

  test("should render death event", () => {
    const events = [
      {
        type: "DEATH",
        payload: {
          target: { name: "Goblin" },
        },
      },
    ];

    const text = EventTexts.fromEvents(events);

    expect(text).toContain("Goblin foi morto");
    expect(text).toContain("⚰️");
  });
});
