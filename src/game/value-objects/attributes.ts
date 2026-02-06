export type AttributeKey =
  | "sta"
  | "str"
  | "con"
  | "dex"
  | "int"
  | "wis"
  | "agi"
  | "cha";

export interface AttributesProps {
  sta: number;
  str: number;
  con: number;
  dex: number;
  int: number;
  wis: number;
  agi: number;
  cha: number;
}

export default class Attributes implements AttributesProps {
  sta: number;
  str: number;
  con: number;
  dex: number;
  int: number;
  wis: number;
  agi: number;
  cha: number;

  /**
   * Lightweight value object for base attributes.
   * Accepts integer values (can be zero or negative for debuffs).
   * @param attrs attributes map: { sta, str, con, dex, int, wis, agi, cha }
   */
  constructor({ sta, str, con, dex, int, wis, agi, cha }: AttributesProps) {
    // Validate that all attributes are integers (can be negative for debuffs)
    if (
      [sta, str, con, dex, int, wis, agi, cha].some((v) => !Number.isInteger(v))
    ) {
      throw new Error("Attributes must be integers");
    }
    this.sta = sta;
    this.str = str;
    this.con = con;
    this.dex = dex;
    this.int = int;
    this.wis = wis;
    this.agi = agi;
    this.cha = cha;
  }

  public increase(attribute: AttributeKey, amount: number): Attributes {
    return new Attributes({
      sta: attribute === "sta" ? this.sta + amount : this.sta,
      str: attribute === "str" ? this.str + amount : this.str,
      con: attribute === "con" ? this.con + amount : this.con,
      dex: attribute === "dex" ? this.dex + amount : this.dex,
      int: attribute === "int" ? this.int + amount : this.int,
      wis: attribute === "wis" ? this.wis + amount : this.wis,
      agi: attribute === "agi" ? this.agi + amount : this.agi,
      cha: attribute === "cha" ? this.cha + amount : this.cha,
    });
  }
}
