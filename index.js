/// Errors

class TraitError extends Error {
  constructor(traitName = ''){
    super()
    this.traitName = traitName;
  }
}

class NoSuchTraitError extends TraitError {
  get message(){
    return `Trait \'${this.traitName}\' is not declared.`
  }
}

class AlreadyDefinedError extends TraitError{
  get message(){
    return `
Trait \'${this.traitName}'\ has already been declared, can't redeclare.
Call Trait with only the name argument to access existing trait instance`
  } 
}

class TraitStructureError extends Error {
  constructor(structureType = '') {
    super()
    this.structureType = structureType;
  }

  get message(){
    return `Trait body should an object as in Record<string, any>, not ${this.structureType}.`
  }
}


const TRAIT_REGISTRY_KEY = Symbol.for('traitRegistry');
globalThis[TRAIT_REGISTRY_KEY] = globalThis[TRAIT_REGISTRY_KEY] ?? new Map();

const traitMap = globalThis[TRAIT_REGISTRY_KEY];


/**
 * 
 * @param {string} name 
 * @param {object|undefined} structure if omitted, Trait will return currently defined Trait by that name,
 * or throw an error if no Trait is present.
 * @returns 
 */
function Trait(name = "", structure) {
  // die if there is no such trait, and no structure is provided.
  if (!structure && !traitMap.has(name)) {
      throw new NoSuchTraitError(name)
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
  if (typeof structure !== 'object' || Array.isArray(structure)) {
    throw new Error(typeof structure)
  }

  // create and store a trait, if name is not occupied, and structure is defined.
  const xCLass = class {};
  Object.defineProperty(xCLass, "name", { value: name });
  const mergedPrototype = Object.assign(xCLass.prototype, structure);
  Object.setPrototypeOf(xCLass, mergedPrototype);
  traitMap.set(name, xCLass)
  return xCLass;
}

/**
 *
 * @param  {...string} names accepts names of traits to be appended to a class
 * @returns class with these traits
 */
function Traits(...names) {
  const mergedClass = names.reduce(
    (acc, f) => {
      Object.setPrototypeOf(Trait(f).prototype, acc.prototype);
      return Trait(f);
    },
    class {},
  );
  Object.defineProperty(mergedClass, "name", { value: [names.join("_")] });
  return mergedClass;
}

module.exports = {
  Trait,
  Traits,
};
