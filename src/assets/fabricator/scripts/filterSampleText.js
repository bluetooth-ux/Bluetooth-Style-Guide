'use strict';

window.filterSampleText = function () {
  $('code').each(function(i, snippet) {
    splice(snippet);
  });
}

function splice (snippet) {
  var patternBegin = new RegExp("<sample>"),
      patternEnd = new RegExp("</sample>"),
      partOne = 0,
      partTwo = 0,
      text = $(snippet).text();

  while (patternBegin.test(text)) {
    var stringSlices = [];
    partOne = text.search(patternBegin);
    partTwo = text.search(patternEnd) + 9; // +10 trims off the </sample> (9 characters)
    if (partOne === 0) {
      text = text.slice( partTwo );
    } else if (partTwo === text.length) {
      text = text.slice( 0 , partOne );
    } else {
      stringSlices.push( text.slice( 0 , partOne ) );
      stringSlices.push( text.slice( partTwo ) );
      text = stringSlices.join('...');
    }
  }

  $(snippet).text(text);
}