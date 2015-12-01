$(function() {
  var muid = window.location.hash.split("#")[1] ? window.location.hash.split("#")[1]: "";
  getProfile(muid);
  getLooks();
  getFriends();
  getTopFriends();
  //FRIENDS TITLE
  $('#friends-title').hide();
  $('#top-friends-title').hide();

  //LOOKS BUTTON
  $('#looks_btn').click(function(event) {
    $('#looks').show();
    $('#friends').hide();
    $('#about').hide();
  });

  //ABOUT BUTTON
  $('#about_btn').click(function(event) {
    $('#looks').hide();
    $('#friends').hide();
    $('#about').show();
  });

  //FRIENDS BUTTON
  $('#friends_btn').click(function(event) {
    $('#looks').hide();
    $('#top-friends-title').show();
    $('#friends-title').show();
    $('#top-friends').show();
    $('#friends').show();
    $('#about').hide();
  });

});

function getLooks() {
  $.getJSON('http://flycatcha.com/drupal/rest/views/status/profile', function(data, textStatus) {
      console.log(data);
      //POST STATUS AND UPLOAD PHOTO BUTTON
      $.each(data.nodes, function(index, val) {
        var image = val.node.image;
        var flypoints = val.node.flypoints;
        var nid = val.node.nid;
        var username = val.node.username;
        var star = "<img src='images/gold-star.png' width='15'/>";
        var looks = '<a href="comments.html#'+nid+'">'
          +'<div class="col-xs-4 profile-look">'
          +'<img src="'+image+'" class="center-block img-circle img-responsive"/>'
          +'<div class="flypoints center-block text-center">'+star+flypoints+'</div>'
          +'</div>'
          +'</a>';
        $('.photo-posts').append(looks);
      });
  });
  //End getLooks function
}

function getProfile(user) {
  $.getJSON('http://flycatcha.com/drupal/rest/user/profile/'+user, function(data, textStatus) {
      /*optional stuff to do after success */
      console.log(data);
      $.each(data.users, function(index, val) {
         /* iterate through array or object */
         var name = val.user.name;
         var about = val.user.about;
         var city = val.user.city;
         var state = val.user.state;
         var profile_picture = val.user.profile_background;
         var slogan = val.user.slogan;

         //HIDE ABOUT BY DEFAULT
         $('#about').hide();
         $('#friends').hide();
         $('#top_friends').hide();
         $('#about').append('<p>'+about+'</p>');
         $('#username').append(name);
         $('#location').append(city+', '+state);
         $('#slogan').append(slogan);
         $('#profile-image').css('background', 'url('+profile_picture+') no-repeat top center fixed');
         $('#profile-image').css('background-size', 'cover');
         $('#profile-image').css('-webkit-background-size', 'cover');
         $('#profile-image').css('-moz-background-size', 'cover');
         $('#profile-image').css('-o-background-size', 'cover');
         $('#profile-image').css('background-color', 'black');
      });
  });
}

function getTopFriends() {
  $('#top-friends-title').append('<h4>Top Friends</h4>');
  $.getJSON('http://flycatcha.com/drupal/rest/top-friends',function(data, textStatus) {
      /*optional stuff to do after success */
      console.log(data);
      $.each(data.friends, function(index, val) {
         /* iterate through array or object */
        var name = val.friend.username;
        var picture = val.friend.profile_picture;
        var uid = val.friend.uid;
        if(val.friend.profile_picture!=""){
          var friend = '<div class="col-xs-4 friend ">'
            +'<img src="'+picture+'" width="20%" class="center-block img-circle img-responsive"/>'
            +'<div class="center-block text-center">'+name+'</div>'
            +'</div>';
          $('.top-friends-posts').append(friend);
        }
        else{
          picture = "images/default-user.png";
          var friend = '<div class="col-xs-4 friend">'
            +'<img src="'+picture+'" width="20%" class="center-block img-circle img-responsive"/>'
            +'<div class="center-block text-center">'+name+'</div>'
            +'</div>';

          $('.top-friends-posts').append(friend);
        }
      });
  });
}

function getFriends() {
  $('#friends-title').append('<h4>Friends</h4>');
  $.getJSON('http://flycatcha.com/drupal/rest/user-friends',function(data, textStatus) {
      /*optional stuff to do after success */
      console.log(data);
      $.each(data.friends, function(index, val) {
         /* iterate through array or object */
        var name = val.friend.username;
        var picture = val.friend.profile_picture;
        var uid = val.friend.uid;
        if(val.friend.profile_picture!=""){
          var friend = '<div class="row">'
            +'<div class="col-xs-3 friend">'
            +'<img src="'+picture+'" width="25%" class="center-block img-circle img-responsive"/>'
            +'</div>'
            +'<div class="col-xs-9 friend">'
            +'<a href="profile.html#'+uid+'">'+name+'</a>'
            +'</div><hr>';
          $('.friends-posts').append(friend);
        }
        else{
          picture = "images/default-user.png";
          var friend = '<div class="row">'
            +'<div class="col-xs-3 friend">'
            +'<img src="'+picture+'" width="25%" class="center-block img-circle img-responsive"/>'
            +'</div>'
            +'<div class="col-xs-9 friend">'
            +'<a href="profile.html#'+uid+'">'+name+'</a>'
            +'</div><hr>';
          $('.friends-posts').append(friend);
        }
      });
  });
}
