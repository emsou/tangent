jQuery(function($){
    var $loginError = $('#loginError');
    var $loginForm = $('#setUsername');
    var $loginBox = $('#username');

    $loginForm.submit(function (e){
        e.preventDefault();
        socket.emit('set user', $loginBox.val(), function(data){
            //if(data){
                $('#login').toggle();
                $('#chat').toggle();
            //}else{
                loginError.html("Someting happened entering " + loginBox.val());
            //}
        });
        $loginBox.val();
    });
});