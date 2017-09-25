'use strict';
var $ = require('jquery');

// add reset switches to components with scripts
// ELSE gray-out content toggles for pages where they are irrelevant
window.buildResetSwitches = function() {

  if (/components.html$/.test(window.location.pathname)) {
    var reset = $('<span class="btn f-ui-btn resetContent disabled">reset</span>'),
    previewContainers = $('.f-item-preview script').parents('.f-item-preview'),
    resetContent;

    previewContainers.each(function(i, preview){
      var thisReset = reset.clone();
      $(preview).closest('.f-item-group').find('.f-item-heading-group').prepend(thisReset);

      $(preview).on('click','*',function(){
        $(this).closest('.f-item-group').find('.resetContent').removeClass('disabled');
      });

      $(preview).closest('.f-item-group').on('click','.resetContent:not(.disabled)',function(){
        // `this` refers to the reset link
        $(this).addClass('disabled');
        $(this).closest('.f-item-group').find('.f-item-preview').fadeOut(function(){
          // `this` refers to the '.f-item-preview'
          $(this).html(JSON.parse($(this).data('resetContent')));

        }).fadeIn();
      });

      $(preview).data('resetContent', JSON.stringify(preview.innerHTML));
    });

  } else {
  	$('.f-controls').addClass('inactive');
  }
}