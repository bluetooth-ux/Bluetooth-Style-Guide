'use strict';
require ('./prism');
var $ = require('jquery');

window.addVariations = function() {
	//dealing with each component's variations block
	$('.f-item-variations').each(function(i, element){
		var preview = $(element).parents('.componentClasses').siblings('.f-item-preview');
		var baseElement = preview.children()[0];
		var previewElement = '';

		var classes = element.textContent.split(' ').map(function(className){
			//do something
			className = className.split('');
			return className.slice(className.indexOf('.')+1, className.length).join('');
		}); //first array element is empty string - generates 'base' rendering

		preview.html(''); //clears contents of preview section

		classes.forEach(function(className, i){
			previewElement = $(baseElement).clone().addClass(className).attr('data-f-toggle', (i > 0 ? 'variations' : ''));
			if (className === "readonly") {previewElement.attr('readonly', '');}
			preview.append( previewElement );
		});

		return;
	});
};


window.addVariationTags = function() {
  // find all elements with CSS 'front-matter'
  var elements = $('.f-item-variations').parents('.componentClasses').siblings('.f-item-preview').children();
  elements.each(function(i, element){
    $(element).attr('data-variation','true');
    return element;
  });
};
