$(function(){
  $.getJSON('http://flycatcha.com/drupal/rest/views/explore', function(data, textStatus) {
      console.log(data);
      //POST STATUS AND UPLOAD PHOTO BUTTON
      $.each(data.nodes, function(index, val) {
        var image = val.node.image;
        var flypoints = val.node.flypoints;
        var nid = val.node.nid;
        var username = val.node.username;
        console.log(nid);
        //Print if image is available
        if(image!=''){
          var looks = '<a href="comments.html#'+nid+'">'
            +'<div class="col-xs-4 explore-photo">'
            +'<img src="'+image+'" class="center-block img-responsive"/>'
            +'</div>'
            +'</a>';
          $('.explore-row').append(looks);
        }
      });
  });
});
