export function validateName(name: string, isMob: boolean): void {
  if (typeof name !== "string") {
    throw new Error("Name must be a string");
  }
  if (name.trim().length === 0) {
    throw new Error("Name cannot be empty");
  }
  if (/\d/.test(name)) {
    throw new Error("Name cannot contain numbers");
  }
  if (!isMob && /\s/.test(name)) {
    throw new Error("Name cannot contain spaces");
  }
}

const utils = {
  validateName,
};

export default utils;

