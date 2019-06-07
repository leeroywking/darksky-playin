'use-strict'


function hideThemChitlins(hideThese) {
    hideThese.forEach(item => {
        console.log(`hiding ${item} `)
        $(`#${item}`).hide()
    });
}


localStorage.undesireables = JSON.stringify(['cloudCover', 'saveTime'])


hideThemChitlins(JSON.parse(localStorage.undesireables))