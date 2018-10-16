jQuery(function($){
    var $loginError = $('#loginError');
    var $loginForm = $('#setUsername');
    var $usernameBox = $('#username');
    var $passwordBox = $('#password');

    $loginForm.submit(function (e){
        e.preventDefault();
        socket.emit('set user', $usernameBox.val(), $passwordBox.val(), function(data){
            if(data){
                $('#login').toggle();
                $('#chat').toggle();
            }else{
                loginError.html("Incorrect password.");
            }
        });
        $usernameBox.val();
    });
});