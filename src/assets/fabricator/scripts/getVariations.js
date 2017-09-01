'use strict';
require ('./prism');
require ('./getCSS');
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
			previewElement = $(baseElement).clone().addClass(className).attr('variation', (i > 0 ? 'true' : ''));
			if (className === "readonly") {previewElement.attr('readonly', '');}
			if ($(baseElement).is('input[type="text"]')){
				preview.append($('<span class="textInputClasses">class: ' + previewElement.attr('class') + '</span>').attr('variation', (i > 0 ? 'true' : '')));
			}
			preview.append( previewElement );
		});

		addVariationStyles(classes, element);

		return;
	});
};

function addVariationStyles(variationClasses, element){
	var styleBlock = $('<pre class="language-css variations" />');
	var properties;
	variationClasses.filter(function( selector ) {
      return selector !== '';
    }).forEach(function(className){
    	$('body').append($('<test class='+className+'/>'));
		styleBlock.append($('<code class="language-css" />'));

		properties = getParseFilterCSS($('test')[0]);
		var selector = properties[0],
			unorderedProperties = properties[1],
			orderedProperties = {},
			cssPropertiesArray = [];

		// alphabetize the properties
		Object.keys(unorderedProperties).sort().forEach(function(key) {
		orderedProperties[key] = unorderedProperties[key];
		});

		// write the properties to an array
		for (var property in orderedProperties) {
		cssPropertiesArray.push(property + ': ' + orderedProperties[property] + '; ');
		}

		styleBlock.find('code.language-css:last-of-type').text(selector + ' {\n\t' + cssPropertiesArray.join('\n\t') + '\n}');

		//remove $('test') to reset for next loop
		$('test').remove();
	});
	$(element).parents('.componentClasses').siblings('.f-item-css').append(styleBlock);

	Prism.highlightElement(styleBlock);
}

window.addVariationTags = function() {
  // find all elements with CSS 'front-matter'
  var elements = $('.f-item-variations').parents('.componentClasses').siblings('.f-item-preview').children();
  elements.each(function(i, element){
    $(element).attr('data-variation','true');
    return element;
  });
};

window.bindVariationToggles = function() {
	//individual
	$('[data-f-toggle-control="variations"]').on('click',function(){
		var controls = $(this).parents('.f-item-heading-group'),
			variations = controls.siblings('.f-item-preview').find('[variation="true"]');
		if (variations.hasClass('f-item-hidden')) {
			variations.each(function(i, element){
				$(element).removeClass('f-item-hidden');
			});
		} else {
			variations.each(function(i, element){
				$(element).addClass('f-item-hidden');
			});
		}
	});

	// global
	$('.f-global-control[data-f-toggle-control="variations"]').on('click',function(){
		if ( $(this).hasClass('f-active') ) {
			$('[variation="true"]').removeClass('f-item-hidden');
		} else {
			$('[variation="true"]').addClass('f-item-hidden');
		}
	});
}