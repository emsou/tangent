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
    timestamp: {type: Date, default: Date.now}
});
var Message = mongoose.model('Message', testSchema);

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
    
    socket.on('chat message', function(msg){
        var msgDoc = new Message({message: msg, name: 'Anonymous'});
        msgDoc.save(function(err){
            if(err) throw err;
            io.emit('chat message', msg);
        });
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});