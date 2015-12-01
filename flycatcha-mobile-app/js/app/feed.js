$(function(){
    var page_num = 0,
        rating_mode = false,
        feed_ratings;
    //Reply Button
    postStatusBtn =
        '<div class="btn-group btn-group-justified">'
        +'<div class="btn-group">'
        +'<a href="create-status.html" class="btn btn-danger"><i class="fa fa-pencil-square-o"></i>Status</a>'
        +'</div>'
        +'</div>';
    postStatusBtn =
        '<div class="btn-group btn-group-justified">'
        +'<div class="btn-group">'
        +'<a href="create-status.html" class="btn btn-danger"><i class="fa fa-pencil-square-o"></i>Status</a>'
        +'</div>'
        +'</div>';

    // $('.status-post').append(postStatusBtn);

    getRateAverages(getPosts, page_num);

    //Like Button
    $( "#feed").on('click', '.status_like', function(event) {
      event.preventDefault();
      var parent = $(this).parents(".feed_post");
      
      if (parent.find(".rating_sec").length > 0 && rating_mode) { return false; }
      if (parent.find(".rating_sec").length == 0 && rating_mode) { cancelRating(); }
      rating_mode = true;


      var feed_post = $(this).parents(".feed_post"),
          feed_post_pos = feed_post.position(),
          window_scroll_pos = $(window).scrollTop(),
          new_pos = ((feed_post_pos.top - 100) < 0) ? 0 : feed_post_pos.top - 100;

      $("body").animate({scrollTop: new_pos}, 200+"px", function() {
          if($("body").find("#rating_sec").length == 0) {
            // run getRatingData fn to get the average rating
            // for each post and display it on feed

            // generates the rating elements for a particular post
            displayRatingMode(feed_post);
          }
      });

      //likeStatus($(this).attr('id'));
      /* Act on the event */
    });

    // Report User Button
    $( "#feed").on('click', '.status_report_user', function(event) {
        event.preventDefault();
         ($(this).attr('id'));
     });

    // Report Content Button
    $( "#feed").on('click', '#show_more', function(event) {
        event.preventDefault();
        page_num++;
        getPosts(page_num);
     });

    //Feed Share Button
    $("#feed").on('click', '.feed_share', function(e) {
    	e.preventDefault();
    	var img = $(this).parents(".feed_post").find(".feed_image img").attr("src");
    	img = img.substring(0, img.length - 14);
    	share_photo(img);
    })
    
    //Rating Save Button
    $("#feed").on('click', '.rating_sec .save', function(e) {
    	var feed_parent = $(this).parents(".feed_post"),
    		rate_val = $(this).parents(".rating_sec").find(".rating").val(),
    		nid = feed_parent.data('nid');
    	
    	saveRating(feed_parent, rate_val, nid);
    });

    //Rating Cancel Button
    $("#feed").on('click', '.rating_sec .cancel', cancelRating);

    //LOAD MORE ITEMS ON SCROLL
    $(window).scroll(function(){
      event.preventDefault();
        var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
        var  scrolltrigger = 0.95;
        if  ((wintop/(docheight-winheight)) > scrolltrigger) {
         //console.log('scroll bottom');
         page_num++;
         getPosts(page_num);
        }
    });
});

function cancelRating() {
    $(".rating_sec").parents(".feed_image").css("border", "none");
    $(".rating_sec").remove();
    rating_mode = false;
}

function saveRating(parent, rate_val, current_nid) {
    // save rating number ajax call
	var url = 'http://flycatcha.com/drupal/rest/votingapi/set_votes',
		rate_num = rate_val * 20,
		params = jQuery.param(
			{
	            votes : {
	                vote : {
	                    entity_id : current_nid, 
	                    value : rate_num
	                }
	            }
	        }
		);
	
	$.ajax({
		type: "POST",
		url : url,
		dataType : 'json',
		data: params,
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		      alert(errorThrown);
		      console.log(JSON.stringify(XMLHttpRequest));
		      console.log(JSON.stringify(textStatus));
		      console.log(JSON.stringify(errorThrown));
		},
		success: function (data){
		    
		    var rating = data.node[current_nid][1]['value'],
		    	average_rating = rating / 20;
		    
		    console.log(average_rating);
		    parent.find(".flypoints").text(""+average_rating+"");
		    cancelRating();
		}
	});

}

function getRateAverages(callback, page_num) {
	$.ajax({
	    type: "POST",
	    url: "http://flycatcha.com/drupal/rest/votingapi/select_votes",
	    dataType: 'json',
	    data: {type: 'votes'},
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
	      alert(errorThrown);
	      console.log(JSON.stringify(XMLHttpRequest));
	      console.log(JSON.stringify(textStatus));
	      console.log(JSON.stringify(errorThrown));
	    },
	    success: function (data){
	      feed_ratings = data;
	      if(callback && arguments[1] != undefined) {
	    	  callback(page_num);
	      }
	    }
	});
	
}

function displayRatingMode(feed) {
    var rating_wrap = feed.find(".feed_image"),
        rating_html = "<div class='rating_sec'>" +
                      "<div class='col-xs-8'>" +
                      "<input type='hidden' class='rating'/>" +
                      "</div>" +
                      "<div class='col-xs-4 style='margin-top:10px;''>" +
                      "<button type='button' class='btn btn-sm cancel' aria-label='Left Align'>" +
                      "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" +
                      "</button>" +
                      "<button type='button' class='btn btn-sm save' aria-label='Left Align'>" +
                      "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>" +
                      "</button>" +
                      "</div></div>",
        rating_sec = $(rating_html);

    // this can be placed in the style.css but for now
    // the css is generated here
    rating_wrap.css({
        "border-width": "1px",
        "border-style": "solid",
        "border-color": "#DAA520"
    });

    rating_sec.find("button").css({
        float: "left",
        marginRight: "5px",
        background: "transparent",
        border: "none"
    });

    rating_sec.css({
        padding: "5px 0",
        position : "absolute",
        width: "100%",
        height: "50px",
        backgroundColor: "rgba(0,0,0,0.8)",
        bottom: "0",
        left: "0",
        zIndex: "100"
    });

   rating_wrap.append(rating_sec);
   rating_wrap.find(".rating").rating({
       filled: "fa fa-star fa-3x",
       empty: "fa fa-star-o fa-3x"
   });
}

/*function loadMore(page_num){
        // $('div#lastPostsLoader').html('<img src="bigLoader.gif"/>');
        // $('#loader').show();
        $.get("loadmore.php", function(data){
            if (data != "") {
                //console.log('add data..');
                $(".items").append(data);
            }
            // $('div#lastPostsLoader').empty();
            // $('#loader').hide();
        });
};*/

/**/
function likeStatus(nid){
  /*User based like, if the user clicks the like buttn a like is added.*/
  $.post('http://flycatcha.com/drupal/rest/system/connect.json',function(data, textStatus, xhr) {
    var uid = data.user.uid;
    var param = jQuery.param({
      flag_name:'flypoint',
      content_id:nid,
      action:'flag',
      uid: uid,
      skip_permission_check:true
    });
    $.post('http://flycatcha.com/drupal/rest/flag/flag.json', param, function(data, textStatus, xhr) {
      location.reload();
    });
  });
}

function getPosts(i){
  $.getJSON('http://flycatcha.com/drupal/rest/views/status', {page: i}, function(data, textStatus) {
        if(data!=""){

        //POST STATUS AND UPLOAD PHOTO BUTTON
        $.each(data.nodes, function(index, val) {
          var post_date = (val.node["Post date"] != "") ? val.node["Post date"].substring(0, val.node["Post date"].length -8) : "";
          
          if(val.node.image!=""){
           image = "<img src='"+val.node.image+"' width='100%' class='img-responsive'/>";
           if(val.node.thumbnail!=""){
            thumbnail = "<img src='"+val.node.thumbnail+"' width='25'/>";
           }
           else{
            thumbnail = "<img src='images/default-user.png' width='25'/>";
           }
           var nid = val.node.nid,
           	   author = val.node.username,
               body = val.node.body,
               flypoints = "N/A";
           
           //loop through feed_ratings to find object that has a matching nid
           $.each(feed_ratings, function(i, val) {
        	   if(parseInt(val["entity_id"]) == nid) {
        		   flypoints = val["value"] / 20;
        	   }
           });

           shareBtn = "<a href='#' class='feed_share'><img src='images/icons/reply.png' width='25'/></a>";
           commentBtn = "<a href='comments.html#"+nid+"'><img src='images/icons/comment.png' width='25'/></a>";
           likeBtn = "<a href='#' id="+val.node.nid+" class='status_like' data-toggle='modal' data-target='#ratingModal'><img src='images/like-btn.png' width='25' /></a>";
           menuBtn = "<a href='#' id="+val.node.nid+" class='status_menu' data-toggle='modal' data-target='#statusModal'><img src='images/icons/menu.png' width='25'/></a>";//Menu Button
           menuModal = '<div class="modal fade" id="statusModal" tabindex="-1" role="dialog" aria-labelledby="statusModalLabel" aria-hidden="true">'
          +'<div class="modal-dialog">'
          +'<div class="modal-content">'
          +'<div class="modal-header">'
          +'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
          +'<h4 class="modal-title" id="statusModalLabel">Select An Option</h4>'
          +'<div class="modal-body">'
          +'<div><button class="btn btn-danger center-block status_report_user" id="'+val.node.nid+'">Report User</button></div>'
          +'<div><button class="btn btn-danger center-block status_flag_content" id="'+val.node.nid+'">Flag Content</button></div>'
          +'</div>'
          +' </div>'
          +' </div>'
          +'</div>'
          +'</div>';
           $('.status-post').append(
            "<div class='container feed_post' data-nid='" + val.node.nid + "'><div class='row'>"
        	+"<div class='col-xs-1'>"+thumbnail+"</div>"
            +"<div class='col-xs-4'>"+author+"</div>"
            +"<div class='col-xs-7'>"+post_date+"</div>"
            +"</div>"
            +"<div class='row'>"
            +"<div class='col-xs-12 feed_image'>"+image+"</div></div>"
            +"<div class='row'>"
            +"<div class='col-xs-8'>"+likeBtn+"<span class='flypoints'>"+flypoints+"</span></div>"
            +"<div class='col-xs-1'>"+commentBtn+"</div>"
            +"<div class='col-xs-1'>"+shareBtn+"</div>"
            +"<div class='col-xs-1'>"+menuBtn+"</div>"
            +"</div></div></div>"
            +menuModal
            );
         }
        });//End each
  }//End if statement
  });
}

function share_photo(img) {
	window.plugins.socialsharing.share(
			null, // Message
			null, // Subject
			img, // Image
			null // Link
	);
}

/*Report a user for inappropriate content*/
function reportUser(nid){
  /*User based like, if the user clicks the like buttn a like is added.*/
  $.post('http://flycatcha.com/drupal/rest/system/connect.json',function(data, textStatus, xhr) {
    var uid = data.user.uid;
    var param = jQuery.param({
      flag_name:'bad_user',
      content_id:nid,
      action:'flag',
      uid: uid,
      skip_permission_check:true
    });
    $.post('http://flycatcha.com/drupal/rest/flag/flag.json', param, function(data, textStatus, xhr) {
      $('#statusModal').modal('hide');
    });
  });
}

/**/
function flagContent(nid){
  /*User based like, if the user clicks the like buttn a like is added.*/
  $.post('http://flycatcha.com/drupal/rest/system/connect.json',function(data, textStatus, xhr) {
    var uid = data.user.uid;
    var param = jQuery.param({
      flag_name:'bad_content',
      content_id:nid,
      action:'flag',
      uid: uid,
      skip_permission_check:true
    });
    $.post('http://flycatcha.com/drupal/rest/flag/flag.json', param, function(data, textStatus, xhr) {
      $('#statusModal').modal('hide');
    });
  });
}
