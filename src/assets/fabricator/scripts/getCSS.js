'use strict';
require ('./prism');
var $ = require('jquery');
var specificity = require('specificity');

window.getParseFilterCSS = function (cssElement) {
  // section 1 variables
  var sheets = document.styleSheets, arrayOfMatchingRules = [];
  // section 2 variables
  var mappedMatchingRules, selectors, matchingSelectors;
  // section 3 variables
  var nestedArrayOfProperties, arrayOfProperties = [], listOfProperties = {}, duplicativeListOfSelectors, listOfSelectors = [], arr;

  cssElement.matches = cssElement.matches || cssElement.webkitMatchesSelector || cssElement.mozMatchesSelector || cssElement.msMatchesSelector || cssElement.oMatchesSelector;

  function removeVendorPrefixSelectors (selectorText) {
    if (/::-/.test(selectorText) || /::placeholder/.test(selectorText) ) {
      //do nothing
    } else {
      return selectorText;
    }
  }

/**
 * SECTION 1
 1 Get all rules
 2 Filter rules for matching selectors
 3 Return array of matching rule strings //["a, .link, button {display: inline-block; padding: 5px;}", "a, input, .bold {font-weight: bold; border: 1px solid blue;}"]
 */
  var rule, rules;
  if (cssElement.matches && typeof cssElement.matches === 'function') {
    for (var i in sheets) {
      rules = sheets[i].rules || sheets[i].cssRules;
      for (var r in rules) {
        // console.log(r)
        rule = removeVendorPrefixSelectors(rules[r].selectorText);

        if (cssElement.matches(rule)) {
          arrayOfMatchingRules.push(rules[r].cssText); // ["*, ::before, ::after { box-sizing: inherit; }", "a, area, button, [role="button"], input, label, se…summary, textarea { touch-action: manipulation; }", "input, button, select, optgroup, textarea { margin…erit; font-size: inherit; line-height: inherit; }", "button, input { overflow: visible; }", "button, select { text-transform: none; }", "button, html [type="button"], [type="reset"], [type="submit"] { -webkit-appearance: button; }", ".btn { display: inline-block; font-weight: normal;…us: 0.25rem; transition: all 0.15s ease-in-out; }", ".btn-primary { color: rgb(255, 255, 255); backgrou…b(0, 130, 252); border-color: rgb(0, 130, 252); }"]
        }
      }
    }
  } else {
    console.log('cssElement.matches is ', cssElement.matches);
  }

/**
 * SECTION 2
 1 Split selectors per rule
 2 Filter for matching selectors (if we're working on an <a>, remove the '.link' and 'button' selectors from the first rule in the SECTION 1 example, and remove 'input' and '.bold' from the second rule)
 3 Sort rules by specificity (using Specificity.js)
 4 Return an array of matching rule objects [ { selector: 'CSS selector', properties: 'some CSS properties' } , { selector: 'CSS selector', properties: 'some CSS properties' } ]
 */
  // split arrayOfMatchingRules into an array of objects, filter for matching rules, and sort objects by SPECIFICITY
  // mappedMatchingRules = [ { selector: 'CSS selector', properties: 'some CSS properties' } ]
  mappedMatchingRules = arrayOfMatchingRules.map(function(rule){
    // rule "*, ::before, ::after { box-sizing: inherit; }"
    selectors = rule.slice(0 , rule.indexOf('{') ).split(','); // [*, ::before, ::after]
    matchingSelectors = selectors.map(function(selector){
      if (cssElement.matches && typeof cssElement.matches === 'function' && cssElement.matches(selector) && selector !== '*'){
        return selector;
      }
    }).filter(function( selector ) {
      return selector !== undefined;
    });
    if (!matchingSelectors.length) {
      return;
    } else if (matchingSelectors.length === 1) {
      matchingSelectors = matchingSelectors[0];
    } else {
      matchingSelectors =  matchingSelectors.sort(function(a, b){return specificity.compare(a, b);})[matchingSelectors.length-1];
    }
    // is there is only one element in the array? if so, return only that element instead of the whole array
    // if there is more than one element, find the most specific selector and get rid of the others
    return { selector: matchingSelectors , properties: rule.slice( (rule.indexOf('{')+1) , -1) };
  }).sort(function(a, b){
    return specificity.compare(a.selector, b.selector);
  }).filter(function( style ) {
    return style !== undefined;
  });;

/**
 * SECTION 3
 1 Create an object with CSS properties as keys
 2 Flatten arrays
 3 Eliminate duplicate & 'undefined' elements
 4 Return nested array of aggregate properties and selectors // [ [selector, selector, selector] , {property: value, property: value, property: value} ]
 */
  // create an object and add a key for each property.
  // if a key already exists, it will be overwritten.
  // mappedMatchingRules = [ { selector: 'CSS selector', properties: 'some CSS properties' } ]
  nestedArrayOfProperties = mappedMatchingRules.map(function(rule){
    arr = rule.properties.split(';').map(function(properties){
      return properties.split(':');
    }); // ['property:value', 'property:value']

    //if the last element is an array containing a single whitespace, remove that array. Should be replaced with a .filter() if these arrays start appearing in the middle of the results.
    if (arr[arr.length - 1] == " ") {arr.pop();}

    return arr; // [ [property, value] , [property, value] ]
  }).forEach(function(potentiallyNestedArray){
    if (potentiallyNestedArray.reduce(function(a,b){
        return a === null ? b : a.concat(b);
      }, []).length > 2) {
      potentiallyNestedArray.forEach(function(array){
        arrayOfProperties.push(array);
      });
    } else {
      arrayOfProperties.push(potentiallyNestedArray[0]);
    }
  });
  arrayOfProperties.forEach(function(propertySet){
    if (propertySet === undefined) {
      // do nothing
    } else {
      listOfProperties[ propertySet[0].trim() ] = propertySet[1].trim();
    }
  });

  // create a list of all of the selectors that properties are being drawn from, and filter duplicates
  // mappedMatchingRules = [ { selector: [CSS selector(s)], properties: 'some CSS properties' } ]
  duplicativeListOfSelectors = mappedMatchingRules.map(function(rule){
    return listOfSelectors.indexOf(rule.selector.trim()) == -1 ? rule.selector.trim() : undefined;
  });
  $.each(duplicativeListOfSelectors, function(i, el){
    if($.inArray(el, listOfSelectors) === -1) listOfSelectors.push(el);
  });

  return [listOfSelectors, listOfProperties];
  //listOfSelectors ["*", "button", ".btn", … ]
  //listOfProperties {margin: "0px", font-family: "inherit", font-size: "1rem", … }
};

window.writeToBody = function (jqueryElement) {
  var computedProperties = getParseFilterCSS(jqueryElement[0]);
  var selectors = computedProperties[0], unorderedProperties = computedProperties[1], orderedProperties = {}, cssPropertiesArray = [];

  var cssPreNode = jqueryElement.parent('.f-item-preview').siblings('.f-item-css').find('pre');
  var cssCodeNode = cssPreNode.find('code');

  var propertiesToFilter = ["touch-action", "-webkit-appearance", "-webkit-text-decoration-skip", "display", "overflow", "flex-direction", "float", "clear", "white-space", "word-wrap", "transition", "background-clip", "cursor", "user-select", "pointer-events"];
  var propertyValuePairsToFilter = [
      {"background-color": "transparent"},
      {"background-image": "none"},
      {"background-position": "initial initial"},
      {"background-repeat": "initial initial"},
      {"font-family": "inherit"},
      {"font-size": "1rem"},
      {"font-weight": "normal"},
      {"line-height": "1"},
      {"opacity": "1"},
      {"position": "relative"},
      {"text-transform": "none"},
      {"-webkit-user-select": "none"}
    ];

  if (cssPreNode.find('.inherits-heading').length > 1) {
    // console.log(selectors);
  }
  cssPreNode.prepend($('<p/>')
           .append($('<span class="inherits-heading"/>')
             .text('inherits from: '))
           .append($('<span class="inherits-elements"/>')
             .text(selectors.join(', '))
           )
         );

  // filter out "meaningless" properties that don't affect marketing, design, or desktop development
  propertiesToFilter.forEach(function(property, i){
    delete unorderedProperties[property];
  });

  // alphabetize the properties
  Object.keys(unorderedProperties).sort().forEach(function(key) {
    orderedProperties[key] = unorderedProperties[key];
  });


  // write the properties to an array
  for (var property in orderedProperties) {

    // TODO: Multiply out rem values to px values
    // 1. If there's an instance of 'rem' in orderedProperties[property]
    // 2. Slice to orderedProperties[property].indexof('rem')
    // 3. Multiply sliced value by 16
    // 4. Add 'px' to the string
    // 5. Assign the result to orderedProperties[property]

    cssPropertiesArray.push(property + ': ' + orderedProperties[property] + '; ');
  }

  cssCodeNode.text('compiled properties {\n\t' + cssPropertiesArray.join('\n\t') + '\n}');

  Prism.highlightElement(cssCodeNode[0]);
};

window.fillAllCssBlocks = function() {
  // find all elements with CSS 'front-matter'
  var elements = $('.f-item-css').siblings('.f-item-preview');
  elements.each(function(i, element){
    if ($(element).children()[0] !== undefined) {
      // only get styles for the first child element
      element = $(element).children()[0];

      // run the element through writeToBody()
      writeToBody($(element));
    }
  });
};