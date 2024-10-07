/**
 * 
 * @param {string} name 
 * @param {object|undefined} structure if omitted, Trait will return currently defined Trait by that name,
 * or throw an error if no Trait is present.
 * @returns 
 */
function Trait(name = "", structure = {}) {
  // check if there already is a trait by this name.
  if (globalThis[Symbol.for(name)]) {
    if (structure) {
      throw new Error(`Trait ${name} is already defined elsewhere. Call \'Trait(\'${name}\')\' to access it`);
    }
    return globalThis[Symbol.for(name)]
  }

  if (!structure) throw new Error('No such trait defined');
  const xCLass = class {};
  Object.defineProperty(xCLass, "name", { value: name });
  const mergedPrototype = Object.assign(xCLass.prototype, structure);
  Object.setPrototypeOf(xCLass, mergedPrototype);
  globalThis[Symbol.for(name)] = xCLass;
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
      if (typeof f !== "string" || !globalThis[Symbol.for(f)]) {
        throw new Error("No such trait", f);
      }
      Object.setPrototypeOf(globalThis[Symbol.for(f)].prototype, acc.prototype);
      return globalThis[Symbol.for(f)];
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
