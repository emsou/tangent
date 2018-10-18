var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//mongoDB
var mongoose = require('mongoose');
var url = 'mongodb://jim:m3tokur@ds127293.mlab.com:27293/tangent_db';
mongoose.connect(url, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to remote database at ' + url);
});

//message schema
var testSchema = new mongoose.Schema({
    name: String,
    message: String,
    timestamp: {type: Date, default: Date.now},
    branch: {type: Number, default: 1}
});
var Message = mongoose.model('Message', testSchema);

//username schema
var userSchema = new mongoose.Schema({
    name: String,
    password: String
});
var User = mongoose.model('User', userSchema);

//app
app.use('/', express.static(__dirname));
app.use('/', express.static(__dirname + '/../client/'));
app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});
io.on('connection', function(socket){
    console.log('user connected');

    var query =  Message.find({});
    query.sort('-timestamp').limit(100).exec(function(err, docs){
        if(err) throw err;
        socket.emit('load messages', docs);
    });

    var sender = "Anonymous";
    //login function
    socket.on('login user', function(user, pass, callback){
        var existingUsers = User.find({name : user}, function(err, docs){
            if(docs.length == 0){
                console.log('User ' + user + ' does not exist.');
                callback(false);
            }else{
                console.log('Existing User ' + user);
                if(docs[0].password === pass){
                    callback(true);
                    sender = user;
                }else{
                    callback(false);
                }
            }
        });
    });
    //create user function
    socket.on('create user', function(user, pass1, pass2, callback){
        var existingUsers = User.find({name : user}, function(err, docs){
            if(docs.length == 0){
                console.log('New User ' + user);
                if(pass1 === pass2){
                    var newUser = new User({name: user, password: pass1});
                    newUser.save(function(err){
                        if(err) throw err;
                    });
                    sender = newUser;
                    callback(true);
                }else{
                    console.log('Error: Passwords do not match');
                    callback(false);
                }
            }else{
                console.log('Error: User ' + user + ' already exists');
                callback(false);
            }
        });
    });
    
    socket.on('chat message', function(msg){
        var msgDoc = new Message({message: msg, name: sender});
        msgDoc.save(function(err){
            if(err) throw err;
            io.emit('chat message', sender, msg);
        });
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});
