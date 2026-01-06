export default class Attributes {
  #sta;
  #str;
  #con;
  #dex;
  #int;
  #wis;
  #agi;
  #cha;
  constructor({ sta, str, con, dex, int, wis, agi, cha }) {
    if (
      [sta, str, con, dex, int, wis, agi, cha].some(
        (v) => !Number.isInteger(v) || v <= 0,
      )
    ) {
      throw new Error("Attributes must be positive");
    }
    this.#sta = sta;
    this.#str = str;
    this.#con = con;
    this.#dex = dex;
    this.#int = int;
    this.#wis = wis;
    this.#agi = agi;
    this.#cha = cha;
  }
  get sta() {
    return this.#sta;
  }
  get str() {
    return this.#str;
  }
  get con() {
    return this.#con;
  }
  get dex() {
    return this.#dex;
  }
  get int() {
    return this.#int;
  }
  get wis() {
    return this.#wis;
  }
  get agi() {
    return this.#agi;
  }
  get cha() {
    return this.#cha;
  }

  increase(attribute, amount) {
    return new Attributes({
      sta: attribute === "sta" ? this.#sta + amount : this.#sta,
      str: attribute === "str" ? this.#str + amount : this.#str,
      con: attribute === "con" ? this.#con + amount : this.#con,
      dex: attribute === "dex" ? this.#dex + amount : this.#dex,
      int: attribute === "int" ? this.#int + amount : this.#int,
      wis: attribute === "wis" ? this.#wis + amount : this.#wis,
      agi: attribute === "agi" ? this.#agi + amount : this.#agi,
      cha: attribute === "cha" ? this.#cha + amount : this.#cha,
    });
  }
}
