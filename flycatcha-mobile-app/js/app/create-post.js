$(function() {
  $('.advanced_options').children().hide();
});
var caman,
	busy = false,
	changed = false,
	  filters = {};

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

render = debounce(function() {
    var filter, value;
    if (busy) {
      changed = true;
      return;
    } else {
      changed = false;
    }
    busy = true;
    caman.revert(false);
    for (filter in filters) {
      if (!filters.hasOwnProperty(filter)) continue;
      value = filters[filter];
      value = parseFloat(value, 10);
      if (value === 0) {
        continue;
      }
      caman[filter](value);
    }
    return caman.render(function() {
      busy = false;
      if (changed) {
        return render();
      }
    });
  }, 300);

function getPicture(camera){
  var source = (camera) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
  navigator.camera.getPicture(onSuccess, onFail, {
    quality : 75,
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : source,
      targetHeight : 500,
      targetWidth : 500,
      allowEdit : true
    });
}
function onSuccess(imageURI) {
  //Hide status upload form
  $('.create-status-page').hide();
  $('#main_nav').hide();
  $('#filter_wrapper').show();
  caman = Caman("#image", imageURI, function () {});
  var filename = imageURI.substr(imageURI.lastIndexOf('/')+1);

  //Load image to canvas
  $('.normal').click(function(event) {
	  $(".advanced_options input").val("");
	  //$(this).find('~ .filter_value').html("0");
	  caman.revert();
	  caman.render();
  });

  $('.greyscale').click(function(event) {
	  caman.greyscale();
	  caman.render();
  });

  $('.sephia').click(function(event) {
    Caman("#image", function () {
      this.revert();
      this.sepia(50).render();
    });
  });

  $('.invert').click(function(event) {
    Caman("#image", function () {
      this.revert();
      this.invert().render();
    });
  });

  $('.exposure').click(function(event) {
    Caman("#image", function () {
      this.revert();
      this.exposure(10).render();
    });
  });
  
  $('nav .brightness').click(function() {
	  $('.advanced_options').fadeIn(250, function() {
		  $('.advanced_options').children().hide();
		  $('.brightness_filter').show();
	  });
  });
  
  $('nav .contrast').click(function() {
	  $('.advanced_options').fadeIn(250, function() {
		  $('.advanced_options').children().hide();
		  $('.contrast_filter').show();
	  });
  });
  
  $('nav .save_image').click(function() {
	  var canvas = document.getElementById('image');
    var dataURL = canvas.toDataURL("image/jpeg");
      // dataURL = dataURL.replace("data:image/jpeg;base64,", "");
	  saveImage(dataURL, filename);
  });

  $('nav .share').click(function(event) {
      var canvas = document.getElementById('image');
      var dataURL = canvas.toDataURL("image/jpeg");
      window.plugins.socialsharing.share(null, filename, dataURL, null);
  });  
  
  $('.filter_setting input').each(function() {
      var filter;
      filter = $(this).data('filter');
      return filters[filter] = $(this).val();
  });
  
  $('.advanced_options').on('change', '.filter_setting input', function() {
      var filter, value;
      filter = $(this).data('filter');
      value = $(this).val();
      filters[filter] = value;
      //$(this).find('~ .filter_value').html(value);
      return render();
  });
}

function saveImage(dataURL, filename){
    //var filename = "flycatcha-"+Math.random().toString(8).slice(2)+'.jpg';
    dataURL = dataURL.replace("data:image/jpeg;base64,", "");
    var data = {
        "file":{
          "file": dataURL,
          "filename":filename,
          "filepath":"public://"+filename,
        }
    };
    //Post image to application
    $.ajax({
      type: "POST",
      url: "http://flycatcha.com/drupal/rest/file",
      dataType: 'json',
      data: data,
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
        alert(JSON.stringify(XMLHttpRequest));
        alert(JSON.stringify(textStatus));
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data){
          alert(JSON.stringify(data));
          image = data.fid;
          // var status = $('#status').val();
          var status = filename;
          var post = {node:{type:'status', title:status, language:'und',
            body:{"und":[{"value":status}]}, field_image: {"und":[{"fid":image}]}}};
            post = jQuery.param(post);
          $.ajax
          ({
            type: "POST",
            url: "http://flycatcha.com/drupal/rest/node.json",
            dataType: 'json',
            data: post,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              alert("Could not post your status at this time please try again");
              console.log(JSON.stringify(XMLHttpRequest));
              console.log(JSON.stringify(textStatus));
              console.log(JSON.stringify(errorThrown));
            },
            success: function (data){
              console.log(data);
              alert('Post created successfully');
              window.location = "feed.html";
              $('#main_nav').show();
            },
          });
      },
  });
}

function onFail(message) {
    alert('Failed because: ' + message);
}
