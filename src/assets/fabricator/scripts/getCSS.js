'use strict';
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

// SECTION 1
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

// SECTION 2
  // split arrayOfMatchingRules into an array of objects, filter for matching rules, and sort objects by SPECIFICITY
  // mappedMatchingRules = [ { selector: [CSS selector(s)], properties: 'some CSS properties' } ]
  mappedMatchingRules = arrayOfMatchingRules.map(function(rule){
    // rule "*, ::before, ::after { box-sizing: inherit; }"
    selectors = rule.slice(0 , rule.indexOf('{') ).split(','); // [*, ::before, ::after]
    matchingSelectors = selectors.map(function(selector){
      if(cssElement.matches && typeof cssElement.matches === 'function' && cssElement.matches(selector)){
        return selector;
      }
    }).filter(function( selector ) {
      return selector !== undefined;
    });
    matchingSelectors = matchingSelectors.length === 1 ? matchingSelectors[0] : matchingSelectors; // if there is only one element in the array, just return that one element instead of an array containing that one element.
    return { selector: matchingSelectors , properties: rule.slice( (rule.indexOf('{')+1) , -1) };
  }).sort(function(a, b){
    return specificity.compare(a.selector, b.selector);
  });

// SECTION 3
  // create an object and add a key for each property.
  // if a key already exists, it will be overwritten.
  // mappedMatchingRules = [ { selector: [CSS selector(s)], properties: 'some CSS properties' } ]
  nestedArrayOfProperties = mappedMatchingRules.map(function(rule){
    arr = rule.properties.split(';').map(function(properties){
      return properties.split(':');
    }); // ['property:value', 'property:value']

    //if the last element is an array containing a single whitespace, remove that array. Should be replaced with a .filter() if these arrays start appearing in the middle of the results.
    if (arr[arr.length - 1] == " ") {arr.pop();}

    return arr; // [ [property, value] , [property, value] ]
  }).forEach(function(potentiallyNestedArray){
    if (potentiallyNestedArray.reduce(function(a,b){return a.concat(b);}).length > 2) {
      potentiallyNestedArray.forEach(function(array){
        arrayOfProperties.push(array);
      });
    } else {
      arrayOfProperties.push(potentiallyNestedArray[0]);
    }
  });
  arrayOfProperties.forEach(function(propertySet){
    listOfProperties[ propertySet[0].trim() ] = propertySet[1].trim();
  });

  // create a list of all of the selectors that properties are being drawn from, and filter duplicates
  // mappedMatchingRules = [ { selector: [CSS selector(s)], properties: 'some CSS properties' } ]
  duplicativeListOfSelectors = mappedMatchingRules.map(function(rule){
    return listOfSelectors.indexOf(rule.selector.trim()) == -1 ? rule.selector.trim() : undefined;
  });
  $.each(duplicativeListOfSelectors, function(i, el){
    if($.inArray(el, listOfSelectors) === -1) listOfSelectors.push(el);
  });

  console.log(listOfSelectors, listOfProperties);
}

window.writeToBody = function (cssElement) {
  getParseFilterCSS(cssElement).forEach(function(rule){
    rule = rule.split("{").join("{<ul><li>").split(";").join(";</li><li>").split("<li> }").join("</ul>}");
    $('body').append($('<div style="margin-left:300px;"/>').append($('<pre/>').html(rule)));
  });
};

//writeToBody($(**SOME_ELEMENT**));