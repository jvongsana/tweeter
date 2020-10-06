$(document).ready(function() {
  let maxLength = 140;

  $('#tweet-text').keyup(function() {
    let tweetLength = $(this).val().length;
    let remainingLength = maxLength - tweetLength;
    let tweetCounter = $(this).parents().find('.counter');

    if (remainingLength < 0) {
      tweetCounter.css({'color': 'red'});
    } else {
      tweetCounter.css({'color': '#545149'});
    }

    tweetCounter.text(remainingLength);
  });
});