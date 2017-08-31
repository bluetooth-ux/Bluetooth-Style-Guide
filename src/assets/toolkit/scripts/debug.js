// Find elements with inline styles
// USAGE run ` debugInlineStyles() ` in inspector console.
window.debugInlineStyles = function (){
	$('[style]').each(function(i, element){
		$(element).attr('data-localname', element.localName);
	});

	$('body').attr('debug',true);
}