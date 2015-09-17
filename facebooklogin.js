function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);

  if (response.status === 'connected') {
    testAPI();
  } else if (response.status === 'not_authorized') {
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}


window.fbAsyncInit = function() {
FB.init({
  appId      : 1521410088150554,
  cookie     : true,  // enable cookies to allow the server to access 
                      // the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v2.2' // use version 2.2
});


FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {

    //profilePicUrl = 'proxy.php?url='+encodeURIComponent('http://graph.facebook.com/'+response.id+'/picture?width=400&height=400&'+ Math.floor(Math.random() * 100));

    profilePicUrl = 'http://localhost:8888/proxy.php?url='+encodeURIComponent('http://graph.facebook.com/'+response.id+'/picture?width=400&height=400&')+ Math.floor(Math.random() * 100)+'&mimeType=image/jpeg';

    //initPixi(profilePicUrl);
    $(document).trigger("PROFILE_PIC_AVAILABLE", profilePicUrl);
  	// var img = $('<img width="" height="" id="centeredImage">')
	  //  .attr('src', profilePicUrl);
   //  $('body').append(img);

   //  //hide bitton
   //  $('#loginButton').hide();
  });
}