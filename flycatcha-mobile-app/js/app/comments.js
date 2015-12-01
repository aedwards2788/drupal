$(function(){
  var nid = window.location.hash.split("#")[1] ? window.location.hash.split("#")[1]: "";
  getPost(nid);
  getComments(nid);
  addComment(nid);
});

function addComment(nid, comment){
  $('#add-comment').click(function(){
    var comment = $("#comment").val();
    var text = {und:[{value:comment}]};
    var post = {comment:{nid:nid, subject:comment, comment_body:text}};
    if(!post){alert('Enter Comment'); return false;}
    $.ajax
      ({
        type: "POST",
        url: "http://flycatcha.com/drupal/rest/comment.json",
        dataType: 'json',
        data: post,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("Could not post your status at this time please try again");
          console.log(JSON.stringify(XMLHttpRequest));
          console.log(JSON.stringify(textStatus));
          console.log(JSON.stringify(errorThrown));
        },
        success: function (data){
          relaodComments(nid);
          window.location = "comments.html#"+nid;
        },
      });
      return false;
    });
  return false;
}

function relaodComments(nid) {
	$('.comments').empty();
	getComments(nid);
}

function getComments(nid, i){
  $.getJSON('http://flycatcha.com/drupal/rest/comments/'+nid, function(json, textStatus) {
      /*optional stuff to do after success */
      $.each(json.comments, function(index, val) {
         /* iterate through array or object */
        var name = val.comment.username;
        var picture = val.comment.picture;
        var comment = val.comment.comment;
        var uid = val.comment.uid;
        var comment = '<div class="row">'
            +'<a href="profile.html#'+uid+'">'
            +'<div class="col-xs-2 friend">'
            +'<img src="'+picture+'" width="100%" class="img-circle img-responsive" style="margin-left: 10px"/>'
            +'</div>'
            +'<div class="col-xs-8 friend">'
            +"<span style='color: red;'>"+name+"</span><br>"
            +"<em>"+comment+"</em>"
            +'</div>'
            +'</a>';
          $('.comments').append(comment);
      });
  });
}

function getPost(nid){
  $.getJSON('http://flycatcha.com/drupal/rest/views/status/'+nid, function(json, textStatus) {
      /*optional stuff to do after success */
      $.each(json.nodes, function(index, val) {
         /* iterate through array or object */

         var image = val.node.image;
         var status = '<div class="col-xs-12">'
         +'<img src="'+image+'" class="center-block img-responsive"/>'
         +'</div>';
         $(".post").append(status);
      });
  });
}
