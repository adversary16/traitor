import { expect, test } from "vitest";
import { Trait, Traits, hasTraits } from "index.js";

const TEST_VALUE = "this is value";

const TraitWithProp = Trait("HasProp", {
  value: TEST_VALUE,
});

const TraitWithMethod = Trait("HasMethod", {
  method: function () {
    return true;
  },
});

test("can extend class with traits by name", () => {
  class TestClass extends Traits("HasProp", "HasMethod") {};
  expect(new TestClass().value).toBe(TEST_VALUE);
  expect(new TestClass().method()).toBe(true);
});

test("can extend class with traits by reference", () => {
  class TestClass extends Traits(TraitWithProp, TraitWithMethod) {};
  expect(new TestClass().value).toBe(TEST_VALUE);
  expect(new TestClass().method()).toBe(true);
});

test("validly works with instanceof", () => {
  class TestClass extends Traits("HasProp") {}
  expect(new TestClass() instanceof Traits("HasProp")).toBe(true);
  expect(new TestClass() instanceof TraitWithProp).toBe(true);
  expect(new TestClass() instanceof TraitWithMethod).toBe(false);
});

test("can multicheck traits with hasTraits properly", () => {
  class TestClass extends Traits("HasProp", TraitWithMethod){};
  Trait('ExtraProp', {
    value: 'extra'
  });
  const classInstance = new TestClass();
  expect(hasTraits(classInstance, "ExtraProp", TraitWithMethod)).toBe(false);
  expect(hasTraits(classInstance, "HasProp", TraitWithMethod)).toBe(true);
  expect(hasTraits(classInstance, TraitWithProp, "HasMethod")).toBe(true);
});