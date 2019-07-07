'use-strict'

// function triggered in header partial
function myFunction() {
  document.getElementById('myDropdown').classList.toggle('show');
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName('dropdown-content');
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

$('button.loginButton').click( function() {
  $('form.save').submit();
});

function hideThemChitlins(hideThese) {
  hideThese.forEach(item => {
    console.log(`hiding ${item} `)
    $(`#${item}`).hide()
  });
}

localStorage.undesireables = JSON.stringify(['cloudCover', 'saveTime'])

hideThemChitlins(JSON.parse(localStorage.undesireables));

$(document).ready(function(){
  $('#menu li').hover(function(){
    $('.dropdown-menu', this).slideDown(100);
  }, function(){
    $('.dropdown-menu', this).stop().slideUp(100);
  });
})
