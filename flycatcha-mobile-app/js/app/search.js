$(function(){
  $('#search-btn').click(function(event) {
    //Clear any previous results.
    $(".content-search").empty();
    $(".user-search").empty();
    /* Act on the event */
    var search_type = $('#search-type').val();
    var search_text = $('#search').val();
    // console.log(search_type);
    // console.log(search_text);
    if(search_type==="user"){
      searchUser(search_text);
    }
    if(search_type==="content"){
      searchContent(search_text);
    }
  });
});

function searchUser(user){
  $.getJSON('http://flycatcha.com/drupal/rest/search-user', {name: user}, function(json, textStatus) {
      /*optional stuff to do after success */
      console.log(json);

      $.each(json.users, function(index, val) {
         /* iterate through array or object */
        var name = val.user.username;
        var profile_picture = val.user.profile_picture;
        var picture = val.user.picture;
        var uid = val.user.uid;
        var user = '<div class="row">'
            +'<a href="profile.html#'+uid+'">'
            +'<div class="col-xs-4 friend">'
            +'<img src="'+picture+'" class="center-block img-circle img-responsive"/>'
            +'</div>'
            +'<div class="col-xs-8 friend">'
            +name
            +'</div>';
            +'</a>';
          $('.user-search').append(user);
      });
  });
}

function searchContent(content){
  $.getJSON('http://flycatcha.com/drupal/rest/search-content', {title: content}, function(json, textStatus) {
      /*optional stuff to do after success */
      console.log(json);
      $.each(json.nodes, function(index, val) {
         /* iterate through array or object */
          var image = val.node.image;
          var nid = val.node.nid;
          var post = '<div class="col-xs-4 explore-photo">'
            +'<a href="comments.html#'+nid+'"><img src="'+image+'" class="center-block img-responsive"/></a>'
            +'</div>';
          $(".content-search").append(post);
      });
  });
}
