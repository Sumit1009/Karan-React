function taskRun() {

    // Clockpicker
    var cpInput = $('.clockpicker').clockpicker();
    // auto close picker on scroll
    $('main').scroll(function() {
        cpInput.clockpicker('hide');
    });
}

export default taskRun;
