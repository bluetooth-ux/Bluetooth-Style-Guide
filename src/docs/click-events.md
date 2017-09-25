By default, in every `.f-item-preview` section, all click events are blocked on `button`s and on elements with an `href` attribute.
This allows for clicking and exploring within the guide content without worrying about accidentally refreshing the page, reloading content, submitting forms, etc.

To override this behavior, add the class `.allow` to the element and it will be ignored by the `preventLinkAndButtonEvents()` function (near the end of **fabricator.js**)