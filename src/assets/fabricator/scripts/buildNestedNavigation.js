'use strict';
var $ = require('jquery');

// if page is components.html
// add all component elements to nested lists of links in the main nav

window.buildNestedNavigation = function (){
// PART 1: BUILD NESTED NAVIGATION
  // make sure we're on the right page
  if (!/components.html$/.test(window.location.pathname)) {return;}

  // look through the main menu li and only loop through until we come up "true"
  $.makeArray($('.f-menu > ul li')).some(function(li, i){
    // if this menu li doesn't have a link to "components.html", skip the rest of this function and check the next li
    if ($(li).find('a').attr('href') !== "components.html" ) {return false;}

    // add the scrollSpy class to this list so that we know what to track with our spy
    $(li).addClass('scrollSpy');

    // if we've gotten this far, we know that we're working on the components list
    // loop through the LI in the components list and build a nested list
    // each LI that we're looping through represents a group of components in the content area
    $(li).find('li').each(function(j, header){

      var nested = $('<ul class="nested"/>'),
          idName = $(header).find('a').attr('href');
          idName = idName.slice(idName.indexOf('#'));

      // loop through each component in the group
      $(idName).find('.f-item-group').each(function(k, component){

        $(component).attr('id', $(component).attr('id').replace(/\./i, '-'));

        nested.append(
          $('<li/>').append(
            $('<a href="#'+$(component).attr('id')+'"/>').text($(component).find('h3.f-item-heading').text())
          )
        );

      });

      $(header).append(nested);
    });

    // after we've looped through each group heading in the main nav and built a list of links under it, we know we're done
    // return true tells the 'some' function we're in to stop running.
    return true;
  });

// PART 2: BUILD SCROLLSPY -- built based on https://jsfiddle.net/mekwall/up4nu/
  // Cache selectors
  var lastId,
      nav = $('.scrollSpy'),
      topOffset = 30, //number of pixels before the top that the selection should change
      // All list items
      menuItems = nav.find("a"),
      // Anchors corresponding to menu items
      scrollItems = menuItems.map(function(){
        var item = $($(this).attr("href"));
        if (item.length) { return item; }
      });

  // Bind click handler to menu items
  // so we can get a fancy scroll animation
  menuItems.click(function(e){
    var href = $(this).attr('href');
    // this compensates for the built-in 'components.html' portion of main-nav links
    var href = href.slice(href.indexOf('#')),
        newPosition = $(href).offset().top;

    $('html, body').stop().animate({
        scrollTop: newPosition
    }, 300);
    e.preventDefault();
  });

  // Bind to scroll
  $(window).scroll(function(){
     // Get container scroll position
     var fromTop = $(this).scrollTop()+topOffset;

     // Get id of current scroll item
     var cur = scrollItems.map(function(){
       if ($(this).offset().top < fromTop)
         return this;
     });
     // Get the id of the current element
     cur = cur[cur.length-1];
     var id = cur && cur.length ? cur[0].id : "";

     if (lastId !== id) {
         lastId = id;
         // Set/remove active class
         menuItems.removeClass('f-active').end().parents('.nested').prev('a').removeClass('f-active');
         menuItems.filter("[href='#"+id+"']").addClass('f-active').parents('.nested').prev('a').addClass('f-active');
     }
  });
}