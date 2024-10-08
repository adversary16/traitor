VERY simple implementation of traits mechanism in Javascript.

Why Traitorous? Because there already is a package named traitor, dedicated to the same cause :-)

## usage

- initialite a trait via Trait function. You can assign Trait to a variable and use it that way, or simply call the function.

```
Trait('MyTrait`, {
    property: 'value',
    method: function(){

    }
})

const OtherTrait = Trait('MyOtherTrait', {
    property2: 'secondvalue'
})
```

- apply traits to a class via Trait**s** function:

```
class WithTraits extends Traits('MyTrait', 'MyOtherTrait'){

}

// alternatively, you can extend from trait classes:
class WithTraits2 extends Traits(OtherTrait){

}
```

Trait-check classes via instanceof:

```
 instanceOf Trait('HasTrait')
 instanceOf IsOtherTrait
```

Trait-check for multiple traits:

```
hasTraits(yourObject, 'traitName1', TraitInstance2)
```
