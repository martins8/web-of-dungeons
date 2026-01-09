const validateName = (name) => {
  if (typeof name !== "string") {
    throw new Error("Name must be a string");
  }
  if (name.trim().length === 0) {
    throw new Error("Name cannot be empty");
  }
  if (/\d/.test(name)) {
    throw new Error("Name cannot contain numbers");
  }
  if (/\s/.test(name)) {
    throw new Error("Name cannot contain spaces");
  }
};

export default {
  validateName,
};
