See the [Fabricator 'Materials' documentation](http://fbrctr.github.io/building-a-toolkit/materials.html) for basic guidelines.

Materials have been extended in the following way:

1. By adding "front-matter" data, you can also add code-highlighted CSS to any material.

Be aware, there should already be a JavaScript utility running that collects the relevant rules and properties for each material and adds that code to the styles section for each component.

```markup
---
notes: This is a note in `markup`.
css: |
  .btn {some: styles;}
  .btn-grey {some: other styles;}
---
```

"Front-matter" `css` data is written in the `f-item-content.html` template with `{{data.css}}`. It is rendered as highlighted code in the `Styles` section of the material.