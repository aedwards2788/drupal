$(document).ready(function () {
  $(".register").click(function () {
    var username = $("#username").val();
    var password = $('#password').val();
    var email = $('#email').val();
    var registerData = {name: username, pass: password, mail: email};
    var registerData = jQuery.param(registerData);
    //Check if user filled out username
    if(!username){alert('Please enter username'); return false;}
    //Check if user filled out password
    if(!password){alert('Please enter password'); return false;}
    //Check if user filled out password
    if(!email){alert('Please enter email'); return false;}
    $.ajax({
      type: "POST",
      url: "http://flycatcha.com/drupal/rest/user/register.json",
      data: registerData,
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function(data){
        console.log(data);
        alert( "Registered Account Successfully");
        window.location = "index.html";
      },
    });
    return false;
  });//End register btn
  return false;
});//End ready function
