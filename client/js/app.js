var app=angular.module('myApp',[]);

app.controller('mainController',['$scope',function($scope){
    var socket = io.connect();
    $scope.send = function(){
        socket.emit('chat message', $scope.message);
        $scope.message="";
    }
    socket.on('load messages', function(docs){
        for(var i = docs.length-1; i >= 0; i--){
            displayMsg(docs[i].message);
        }
    });
    socket.on('chat message', function(msg){
        displayMsg(msg);
    });

    function displayMsg(msg){
        var li=document.createElement("li");
        li.appendChild(document.createTextNode(msg));
        document.getElementById("messages").appendChild(li);
    }
}]);