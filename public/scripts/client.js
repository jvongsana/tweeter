/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const unixTimeDayDifference = function(posted, current) {
  let difference = current - posted;
  let daysDifference = Math.floor((((difference / 1000) / 60) / 60) / 24);

  return daysDifference;
};

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));

  return div.innerHTML;
};

const createTweetElement = function(tweet) {
  const profilePic = escape(tweet.user.avatars);
  const displayName = escape(tweet.user.name);
  const username = escape(tweet.user.handle);
  const tweetText = escape(tweet.content.text);
  const postDate = escape(tweet.created_at);
  const currentDate = new Date();
  const daysAgo = unixTimeDayDifference(postDate, currentDate);

  const $tweet = `
  <article class="tweet">
    <header>
      <div class="tweeter-pic">
        <img src="${profilePic}" alt="User profile pic">
        <span class="name">${displayName}</span>
      </div>
      <span class="username">${username}</span>
    </header>
    <p class="tweet-content">${tweetText}</p>
    <footer>
      <span>${daysAgo} days ago</span>
      <div class="interaction-icons">
        <a href=""><img class="flag-img" src="/images/flag.png"></a>
        <a href=""><img class="retweet-img" src="/images/retweet.png"></a>
        <a href=""><img class="heart-img" src="/images/heart.png"></a>
      </div>
    </footer>
  </article>`;

  return $tweet;
};

const errorMessage = function(message) {
  $('div.error-message').slideDown('fast', function() {
    $('div.error-message p').text(message);
    setTimeout(function() {
      $('div.error-message').slideUp();
    }, 5000);
  });
};

const renderTweets = function(tweets) {
  $("#tweets-container").empty();
  
  for (const tweet of tweets) {
    let readyTweet = createTweetElement(tweet);
    $("#tweets-container").append(readyTweet);
  }
};

const loadTweets = function() {
  $.get('/tweets', function(data) {
    renderTweets(data.reverse());
  });
};


$(document).ready(function() {

  $('.new-tweet-toggle').click(function() {
    $('.compose-tweet').toggle('fast', function() {
    });
  });
  
  $('.jump-to-top').click(function() {
    $(window).scrollTop(0);
  });
  
  $(".tweet-form").submit(function(event) {
    event.preventDefault();
    const charsInArea = $('#tweet-text').val().length;

    if (charsInArea > 140) {
      errorMessage('Tweet exceeds character limit');
      return;
    } else if (charsInArea === 0) {
      errorMessage('Tweet is empty');
      return;
    }

    $.post('/tweets', $(this).serialize())
      .then(function() {
        loadTweets();
        $("textarea#tweet-text").val('');
        $('output.counter').text('140');
      })
      .catch(function(err) {
        console.log("err", err);
      });
  });

  loadTweets();
});