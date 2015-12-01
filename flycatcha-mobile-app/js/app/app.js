$(function(){
  //PREVENT SCROLL TO TOP FOR HASH
  $( 'a[href="#"]' ).click( function(e) {
      e.preventDefault();
   } );

  $.ajaxSetup({
    beforeSend: function() {
       $('#loader').show();
    },
    complete: function(){
       $('#loader').hide();
    },
    /*headers: {
        'Authorization': "Basic Zmx5Y2F0Y2g6Q2F0Y2hhMTIz"
      },*/
    success: function() {}
  });
  $.ajax({
        type: "POST",
        url: "http://flycatcha.com/drupal/rest/system/connect",
        dataType: 'json',
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert(errorThrown);
          console.log(JSON.stringify(XMLHttpRequest));
          console.log(JSON.stringify(textStatus));
          console.log(JSON.stringify(errorThrown));
        },
        success: function (data){
          console.log(data);
        },
  });
  $('#header').load('template/header.html');

});
