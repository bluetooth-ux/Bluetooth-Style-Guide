'use strict';
require ('./prism');
var $ = require('jquery');

window.addVariationTags = function() {
  // find all elements with CSS 'front-matter'
  var elements = $('.f-item-variations').siblings('.f-item-preview').children();
  elements.each(function(i, element){
    $(element).attr('data-variation','true');
    return element;
  });
};