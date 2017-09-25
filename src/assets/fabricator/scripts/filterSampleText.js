'use strict';

window.filterSampleText = function () {
  // only filter on components page
  if (!/components.html$/.test(window.location.pathname)) {return;}

  $('code.language-markup').each(function(i, snippet) {

    // only trim sample text from code tags that have a <sample> block
    if (/<sample>/g.test(snippet.textContent)) { splice(snippet); }

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

    // Ideally this code should search for the last instance of <sample> and the find the subsequent </sample>
    // searching as above would allow nested sample blocks, which is relevant when using toolkit components to build modules
    //
    //
    // enabling multi-level nesting would allow for embedding multiple paragraphs in a container and trimming them all to a single ellipsis
    // eg: {{> typography.paragraph}} === <p> <sample> Some text </sample> </p>
    //
    //   <card> <sample>
    //    {{#iterate 3}}
    //       {{> typography.paragraph}}
    //     {{/iterate}}
    //   </sample> </card>
    //
    // preview: <card>
    //           <p> Some Text </p>
    //           <p> Some Text </p>
    //           <p> Some Text </p>
    //         </card>
    //
    // snippet: <card>...</card>

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