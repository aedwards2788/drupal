$(function() {
    $.ajax
      ({
        type: "POST",
        url: "http://flycatcha.com/drupal/rest/user/logout",
        dataType: 'json',
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log(JSON.stringify(XMLHttpRequest));
          console.log(JSON.stringify(textStatus));
          console.log(JSON.stringify(errorThrown));
        },
        success: function (data){
          console.log(data);
          window.location = "index.html";
        },
      });
      //return false;
});
