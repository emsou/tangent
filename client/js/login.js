jQuery(function($){
    //login vars
    var $loginError = $('#loginError');
    var $loginForm = $('#setUsername');
    var $usernameBox = $('#username');
    var $passwordBox = $('#password');
    var $toCreation = $('#toCreation');

    //create vars
    var $createError = $('#creationError');
    var $createForm = $('#makeAccount');
    var $newUser = $('#newUsername');
    var $newPass1 = $('#password1');
    var $newPass2 = $('#password2');
    var $backtoLogin = $('#backtoLogin');

    $loginForm.submit(function (e){
        e.preventDefault();
        socket.emit('login user', $usernameBox.val(), $passwordBox.val(), function(data){
            if(data){
                $('#login').toggle();
                $('#chat').toggle();
            }else{
                $loginError.html("Incorrect username or password.");
                $loginForm.trigger('reset');
            }
        });
    });

    $toCreation.submit(function(e){
        e.preventDefault();
        $loginForm.trigger('reset');
        $loginError.html("");
        $('#login').toggle();
        $('#createUser').toggle();
    });

    $createForm.submit(function (e){
        e.preventDefault();
        socket.emit('create user', $newUser.val(), $newPass1.val(), $newPass2.val(), function(data){
            if(data){
                $('#createUser').toggle();
                $('#chat').toggle();
            }else{
                $createError.html("Error creating account. See console for details.");
                $createForm.trigger('reset');
            }
        });
    });

    $backtoLogin.submit(function(e){
        e.preventDefault();
        $createForm.trigger('reset');
        $createError.html("");
        $('#login').toggle();
        $('#createUser').toggle();
    });
});
