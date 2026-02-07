import Experience from "src/game/gcomponents/experience";

describe("Experience TEST", () => {
  test("Experience should be initialized with the correct amount", () => {
    const experience = new Experience(200);
    expect(experience.amount).toBe(200);
  });

  test("Experience should be able to add XP", () => {
    const experience = new Experience(200);
    experience.gain(75);
    expect(experience.amount).toBe(275);
  });

  test("Experience should calculate level based on XP", () => {
    const experience = new Experience(0);
    expect(experience.level).toBe(1); // Assuming level 1 starts at 0 XP

    experience.gain(100);
    expect(experience.level).toBe(2); // Assuming level 2 starts at 100 XP

    experience.gain(250);
    expect(experience.level).toBe(3); // Assuming level 3 starts at 350 XP
  });
});
