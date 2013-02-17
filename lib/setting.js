jQuery(function($) {
    "use strict";
    var socket = io.connect('http://210.129.193.23:3000/');

    // 初期化
    $(document).ready(function(){
        $('#name').val(localStorage["name"] || "");
        $('#gender').val(localStorage["gender"] || "");
        $('#profile').val(localStorage["profile"] || "");
    });

    // サーバからメッセージ表示
    socket.on('message', function(data) {
        $('#message').text(data.text);
    });

    // ユーザ登録イベント
    $('#regist').click(function() {
        var name    = $('#name').val();
        var gender  = $('#gender').val();
        var profile = $('#profile').val();
        if (name !== '') {
            socket.emit('regist', {name:name, gender:gender, profile:profile});

            localStorage["name"]    = name;
            localStorage["gender"]  = gender;
            localStorage["profile"] = profile;
        }
    });
});
