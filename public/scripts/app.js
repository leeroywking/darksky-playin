'use-strict'

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
