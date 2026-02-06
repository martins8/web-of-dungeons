import Attributes from "src/game/value-objects/attributes";

describe("ATTRIBUTES TESTS", () => {
  const validAttrs = {
    sta: 10,
    str: 10,
    con: 10,
    dex: 10,
    int: 10,
    wis: 10,
    agi: 10,
    cha: 10,
  };

  test("should create attributes with valid positive integers", () => {
    const attrs = new Attributes(validAttrs);

    expect(attrs.str).toBe(10);
    expect(attrs.dex).toBe(10);
    expect(attrs.agi).toBe(10);
  });

  test("should allow negative attributes for debuffs", () => {
    const attrs = new Attributes({ ...validAttrs, str: -5 });
    expect(attrs.str).toBe(-5);

    const attrs2 = new Attributes({ ...validAttrs, dex: 0 });
    expect(attrs2.dex).toBe(0);
  });

  test("should throw error if any attribute is not integer", () => {
    expect(() => new Attributes({ ...validAttrs, int: 1.5 })).toThrow();
    expect(() => new Attributes({ ...validAttrs, wis: NaN })).toThrow();
  });

  test("increase should return a new instance", () => {
    const attrs = new Attributes(validAttrs);
    const updated = attrs.increase("str", 5);

    expect(updated).not.toBe(attrs);
    expect(updated.str).toBe(15);
    expect(attrs.str).toBe(10);
  });

  test("increase should only affect the chosen attribute", () => {
    const attrs = new Attributes(validAttrs);
    const updated = attrs.increase("agi", 3);

    expect(updated.agi).toBe(13);
    expect(updated.dex).toBe(10);
    expect(updated.str).toBe(10);
  });
});
