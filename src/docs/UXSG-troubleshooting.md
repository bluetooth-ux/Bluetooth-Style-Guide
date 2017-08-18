In order to create the desired behaviors and output in this style guide, some `library` files had to be modified. This presents a potential maintenance issue in which the modifications could be wiped out or overwritten by updating the libraries or frameworks this style guide is built upon.

Please use the template when updating this document.

This document should list all library files that have been modified. Each entry should include the:

1. reason for modifying a library file
1. absolute file path
1. approximate line number(s) that have been modified <!-- LINE ~#-# -->
1. modified code, with comments <!-- use Prism values and a 'code fence' to block out code. Put the line numbers at the top inside each code block -->
1. reason for modifying the library files, including: <!-- L5 heading, bold - ##### __filename__ -->
    - a summary of the default behavior
    - an explanation of the problem
    - an explanation of the solution

<!-- TEMPLATE
#### reason for modifying the file
`absolute/file/path.md`

```css (this can be any supported PRISM language)
LINE ~##-##
  code //try to keep this lean
  code //comment only what was changed
  code
  code //explain the changes below
  code
```

##### __Default Behavior__
Some succinct explanation.

##### __Problem__
Some explanation of how this is causing an undesirable effect. Provide additional code snippets here to demonstrate the issue if it will add clarity or aid in understanding.

##### __Solution__
Some explanation of how the solution at the top solves the problem.

---

-->

---

#### Set Custom Bootstrap Overrides
`/node_modules/bootstrap/scss/bootstrap.scss`

```css
LINE ~8-12
  // Core variables and mixins
  @import "custom"; //moved this line to the top of the list of imports
  @import "variables";
  @import "mixins";
```

##### __Default Behavior__
Variables in the Bootstrap 4 `variables.scss` file are all defined with the `!default` property, meaning that the variables won't be re-assigned if they already have a value.

##### __Problem__
_Example Code_
```css
// _variables.scss
$white: #fff !default;
$input-bg: $white !default;

// _custom-variables.scss
$white: #f0f0f0;

// _forms.scss
.form-control {
  background-color: $input-bg;
}
```

In this example I want to change the value of $white from `#fff` to `#f0f0f0`.

I can override it inside _custom-variables.scss; however, the output of `.form-control` is still:

```css
.form-control {
  background-color: #fff;
}
```

The problem is that since `$white` is being referenced in `$input-bg` before it is overwritten in `_custom-variables.scss`, the `$input-bg` variable is defined using the initial value of `$white`.

This behavior is true for every reference to `$white` throughout the style sheet. It is possible to redefine every component that references the custom variables, but that solution requires ongoing maintenance to ensure that all instances of `$white` correctly update to `#f0f0f0` as Bootstrap is updated. This problem also grows significantly as the number of customizations increases.

##### __Solution__
By importing the `_custom.scss` partial before the `_variables.scss` partial, we're able to set our custom properties as defaults without worrying about the `_variables.scss` values overwriting them. This also means that all of our custom values will automatically cascade throughout the rest of the style sheets.

---

<!-- USE TEMPLATE COMMENTED ABOVE -->