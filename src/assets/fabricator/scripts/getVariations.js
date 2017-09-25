'use strict';
require ('./prism');
require ('./getCSS');
var $ = require('jquery');

window.addVariations = function() {
	// dealing with each component's variations block
	$('.f-item-variations').each(function(i, element){
		var componentClasses = $(element).parents('.componentClasses'),
			classList = [],
			preview = componentClasses.siblings('.f-item-preview'),
			baseElement = preview.children()[0],
			previewElement = '',
			hasScript = false,
			iconClass = '',
			iconName = '';

		var classes = element.textContent.split(' ').map(function(className){
			className = className.split('');
			return className.slice(className.indexOf('.')+1, className.length).join('');
		}); // first array element is empty string - generates 'base' rendering

		// figure out if the component needs scripts and flag it
		if (preview.find('script').length > 0) { hasScript = true; }

		preview.html(''); // clears contents of preview section

		classes.forEach(function(className, i, classes){
			previewElement = $(baseElement).clone().attr('variation', (i > 0 ? 'true' : ''));
			if ($(baseElement).is('i.fa')){
				if (className.length > 0) {
					iconClass = className.slice(0,className.indexOf('|'));
					iconName = className.slice(className.indexOf('|')+1);
					iconName = iconName.indexOf('_') > 0 ? iconName.split('_').join(' ') : iconName;
					previewElement.addClass(iconClass).text(' \u00a0 ' + iconName).attr('data-variation','true');
					classList.push(' .' + iconClass);
				} else {
					// get rid of the empty .fa preview element
					previewElement = null;
				}
			} else {
				previewElement.addClass(className);
				if (className === "readonly") {previewElement.attr('readonly', '');}
				if ($(baseElement).is('input[type="text"]')){
					preview.append($('<span class="textInputClasses" input-variation="' + previewElement.attr('class') + '">class: ' + previewElement.attr('class') + '</span>').attr('variation', (i > 0 ? 'true' : '')));
				}
			}
			preview.append( previewElement );

			if ($(baseElement).is('i.fa') && i === classes.length - 1) {
				// reset the 'classes' list to strip out the icon name
				componentClasses.find('code').text('CLASS: .fa +' + classList.join(''));
			}
		});

		addVariationStyles(classes, element);

		// if there was a script on the component, add an empty script block to the end so that the reset button will generate
		if (hasScript) {
			preview.append($('<script/>'));
		}

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
  	if (element.tagName === "SCRIPT") { return; }

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

window.highlightCSS = function() {
	$('[variation]').on('click', function(){
		var CSSSnippets = $(this).parents('.f-item-preview').siblings('.f-item-css').find('code');
		CSSSnippets.removeClass('selected');
		$(CSSSnippets[$(this).index()]).addClass('selected');
	});
}