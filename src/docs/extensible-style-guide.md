### Front-Matter Data
Any 'front-matter' data added to a material can be automatically added to the style guide output. (see [Materials](#materials) for instructions on adding 'front-matter' data to materials)

To create additional content types and corresponding toggles, the following files will need to be updated:

#### fabricator.js
`src/assets/fabricator/scripts/fabricator.js`


```javascript
LINE ~14
  fabricator.options = {
    toggles: {
      labels: true,
      notes: true,
      code: false,
      css: false,
      NEW_TOGGLE_NAME: {true/false determines if it is checked by default}, //note the trailing comma
    },

LINE ~87
  fabricator.allItemsToggles = () => {
    const itemCache = {
      labels: document.querySelectorAll('[data-f-toggle="labels"]'),
      notes: document.querySelectorAll('[data-f-toggle="notes"]'),
      code: document.querySelectorAll('[data-f-toggle="code"]'),
      css: document.querySelectorAll('[data-f-toggle="css"]'),
      NEW_TOGGLE_NAME: document.querySelectorAll('[data-f-toggle="NEW_TOGGLE_NAME"]'), //note the trailing comma
    };
```

#### f-icons.html
`src/views/layouts/includes/f-icons.html`

```markup
  <symbol id="f-icon-NEW_TOGGLE_NAME" viewBox="0 0 512 512">
    <path d="SOME SVG PATH"/>
  </symbol>
```

This icon will be used both in the main navigation and as the toggle for each individual section. You can save any path from Illustrator as an SVG to use here. Start with a 512pt x 512pt file and 'export' it with the following settings:

```javascript
//Export
'Format': SVG
[X]'Use artboards'

//SVG Options
'Styling': Inline Style
'Font': Convert To Outlines
'Images': Preserve //don't use images
'Object IDs':_ Layer Names //this doesn't matter
'Decimal': 2 //this doesn't matter
[X]'Minify' [X]'Responsive'
```

Open the SVG in your code editor. The output will include a `<svg>` tag, a `<title>` tag, and (probably) one `<path>` tag per shape. Copy all of the `<path>` tags and paste them into the corresponding `symbol` declaration (replace the `<path d="SOME SVG PATH"/>` in the sample markup above). At the end of each path tag, Illustrator adds a `style` property with a fill color. Remove that style property to allow the SVG to recolor according to the Fabricator styles.

#### f-controls.html
`src/views/layouts/includes/f-controls.html`

This adds the toggle to the main navigation.

```markup
  <div class="f-control f-global-control" data-f-toggle-control="NEW_TOGGLE_NAME" title="Toggle NEW_TOGGLE_NAME">
    <svg>
      <use xlink:href="#f-icon-NEW_TOGGLE_NAME" />
    </svg>
  </div>
```

#### f-item-controls.html
`src/views/layouts/includes/f-item-controls.html`

This adds the toggle to the individual component controls.

```markup
  {{#if data.NEW_TOGGLE_NAME}}
  <span class="f-control f-icon" data-f-toggle-control="NEW_TOGGLE_NAME" title="Toggle NEW_TOGGLE_NAME">
    <svg>
      <use xlink:href="#f-icon-NEW_TOGGLE_NAME" />
    </svg>
  </span>
  {{/if}}
```

#### f-item-content.html
`src/views/layouts/includes/f-item-content.html`

Add this content wherever you want the content to appear in the component template.

```markup
  {{#if data.NEW_TOGGLE_NAME}}
  <div class="f-item-NEW_TOGGLE_NAME" data-f-toggle="NEW_TOGGLE_NAME">
    <pre><code class="language-NEW_TOGGLE_NAME">{{{data.NEW_TOGGLE_NAME}}}</code></pre>
  </div>
  {{/if}}
```

#### OPTIONAL: index.js
`node_modules/fabricator-assemble/index.js`

If for some reason your data isn't rendering or you need a discrete entity that isn't bundled under data, you can update the __node_module__ for the assembler. When using this method, omit the `data.` from the blocks in the `content` and `controls` files above.

```javascript
LINE ~332
  // capture meta data for the material
  if (!isSubCollection) {
    assembly.materials[collection].items[key] = {
      name: toTitleCase(id),
      notes: (fileMatter.data.notes) ? md.render(fileMatter.data.notes) : '',

      NEW_TOGGLE_NAME: (fileMatter.data.NEW_TOGGLE_NAME) ? md.render(fileMatter.data.NEW_TOGGLE_NAME) : '',

      data: localData
    };
  } else {
    assembly.materials[parent].items[collection].items[key] = {
      name: toTitleCase(id.split('.')[1]),
      notes: (fileMatter.data.notes) ? md.render(fileMatter.data.notes) : '',

      NEW_TOGGLE_NAME: (fileMatter.data.NEW_TOGGLE_NAME) ? md.render(fileMatter.data.NEW_TOGGLE_NAME) : '',

      data: localData
    };
  }
```

### Handlebars Helpers
#### index.js
`node_modules/fabricator-assemble/index.js`

Add a `{{#NEW_HELPER}}` function.

```javascript
LINE ~219
  /* HANDLEBARS HELPER */
  Handlebars.registerHelper('NEW_HELPER', function(n, block) {
    // do something to 'block'
  });
```

##### Usage
```css
  {{#NEW_HELPER}}
    //html or handlebars block
  {{/NEW_HELPER}}
```
This will apply the helper to the inner block.