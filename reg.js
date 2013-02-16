    // サーバからメッセージ表示
    socket.on('message', function(data) {
        $('#message_other').prepend($('<div/>').text(data.text));
    });

    // ユーザ登録イベント
    $('#regist').click(function() {
        var name    = $('#name').val();
        var gender  = $('#gender').val();
        var profile = $('#profile').val();
        if (name !== '') {
            socket.emit('regist', {name:name, gender:gender, profile:profile});
            $('#message_own').prepend($('<div/>').text(get_date()+":[regist]"+name));
            $('#input').val('');
        }
    });
