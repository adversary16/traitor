import { expect, test } from "vitest";
import { Trait, Traits } from "index.js";

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
  class TestClass extends Traits("HasProp", "HasMethod") {}
  expect(new TestClass().value).toBe(TEST_VALUE);
  expect(new TestClass().method()).toBe(true);
});

test("validly works with instanceof", () => {
  class TestClass extends Traits("HasProp") {}

  expect(new TestClass() instanceof Traits("HasProp")).toBe(true);
  expect(new TestClass() instanceof TraitWithProp).toBe(true);
  expect(new TestClass() instanceof TraitWithMethod).toBe(false);
});
