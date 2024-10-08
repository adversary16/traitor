/// Errors

class NotATraitError extends Error {
  constructor(obj) {
    super();
    this.message = `This is not a trait: ${obj}`;
  }
}
class TraitError extends Error {
  constructor(traitName = "") {
    super();
    this.traitName = traitName;
  }
}

class NoSuchTraitError extends TraitError {
  get message() {
    return `Trait \'${this.traitName}\' is not declared.`;
  }
}

class AlreadyDefinedError extends TraitError {
  get message() {
    return `
Trait \'${this.traitName}'\ has already been declared, can't redeclare.
Call Trait with only the name argument to access existing trait instance`;
  }
}

class TraitStructureError extends Error {
  constructor(structureType = "") {
    super();
    this.structureType = structureType;
  }

  get message() {
    return `Trait body should an object as in Record<string, any>, not ${this.structureType}.`;
  }
}

const TRAIT_REGISTRY_KEY = Symbol.for("traitorousRegistry");
const TRAIT_ATTRIBUTE = Symbol.for("traitorousTrait");
const TRAITED_ATTRIBUTE = Symbol.for("traitorousTraited");
globalThis[TRAIT_REGISTRY_KEY] = globalThis[TRAIT_REGISTRY_KEY] ?? new Map();

const traitMap = globalThis[TRAIT_REGISTRY_KEY];

/**
 *
 * @param {string} name
 * @param {object|undefined} structure if omitted, Trait will return currently defined Trait by that name,
 * or throw an error if no Trait is present.
 * @returns {class}
 */
function Trait(name = "", structure) {
  const TraitProxy = {
    get(target, prop, receiver) {
      if (prop === Symbol.hasInstance) {
        return (checkedClass) => {
          const objectTraitList =
            checkedClass[TRAITED_ATTRIBUTE] ??
            checkedClass?.prototype[TRAITED_ATTRIBUTE] ??
            [];
          console.log(objectTraitList, target);
          return objectTraitList.includes(target[TRAIT_ATTRIBUTE]);
        };
      }
      return target[prop];
    },
  };

  // die if there is no such trait, and no structure is provided.
  if (!structure && !traitMap.has(name)) {
    throw new NoSuchTraitError(name);
  }

  // die on trait redefinition attempt.
  if (structure && traitMap.has(name)) {
    throw new AlreadyDefinedError(name);
  }

  // if structure arg is not defined, assume a lookup and return an already declared trait.
  if (!structure) {
    return traitMap.get(name);
  }

  // die if structure is not a legit object
  if (typeof structure !== "object" || Array.isArray(structure)) {
    throw new TraitStructureError(typeof structure);
  }

  // create and store a trait, if name is not occupied, and structure is defined.
  const xCLass = class {};
  Object.defineProperty(xCLass, "name", { value: name });
  Object.defineProperty(xCLass, TRAIT_ATTRIBUTE, { value: name });
  const mergedPrototype = Object.assign(xCLass.prototype, structure);
  Object.setPrototypeOf(xCLass, mergedPrototype);
  const classProxy = new Proxy(xCLass, TraitProxy);
  traitMap.set(name, classProxy);
  return classProxy;
}

/**
 *
 * @param  {...string} names accepts names of traits to be appended to a class
 * @returns {class} class with these traits
 */
function Traits(...names) {
  const traits = [];
  const traitNames = [];
  const mergedClass = names.reduce(
    (acc, f) => {
      const traitName = typeof f === "string" ? f : f[TRAIT_ATTRIBUTE];
      if (!traitName) {
        throw new NotATraitError(f);
      }
      Object.assign(acc.prototype, Trait(traitName).prototype);
      traitNames.push(traitName);
      return acc;
    },
    class {},
  );
  mergedClass.prototype[TRAITED_ATTRIBUTE] = traitNames;
  return mergedClass;
}

/**
 *
 * @param {any} obj - object to be checked for traits
 * @param  {...(string|class)} traits - list of traits to check against
 * @returns {boolean}
 */
function hasTraits(obj, ...traits) {
  const objectTraitList =
    obj[TRAITED_ATTRIBUTE] ?? obj?.prototype[TRAITED_ATTRIBUTE] ?? [];
  const normalizedTraits = traits.map((t) =>
    typeof t === "string" ? t : (t[TRAIT_ATTRIBUTE] ?? ""),
  );
  return (
    objectTraitList.find((t) => !normalizedTraits.includes(t)) === undefined
  );
}

module.exports = {
  Trait,
  Traits,
  hasTraits,
};
