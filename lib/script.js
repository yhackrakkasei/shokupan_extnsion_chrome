"use strict";

// socket.ioを使うため、インスタンスを作成
var socket = io.connect('http://210.129.193.23:3000/');
var name = "";

// elements
var $body = $('body');
var $btn = $('<div/>').attr("id", "shokupan_btn").css({
    "width"    : "80px",
    "height"   : "110px",
    "right"    : "10px",
    "bottom"   : 0,
    "z-index"  : "10",
    "overflow" : "hidden",
    "position" : "fixed"
});
var $img_open  = $('<img>').attr({
    "src": "chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/img/open.gif",
    "id" : "shokupan_img_open"
});
var $img_close = $('<img>').attr({
    "src": "chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/img/close.gif",
    "id" : "shokupan_img_close"
});
var $mask  = $('<div/>').attr({
    "id": "shokupan_mask"
}).css({
    "position" : "absolute",
    "left"     : "0",
    "top"      : "0",
    "z-index"  : "9000",
    "display"  : "none",
    "background" : "rgba(0, 0, 0, 0.8)"
});
var $mask_content = $('<div/>');
var $question = $('<div/>').css({
    "background-color": "red"
});
                    
// 動画
//var $video = $('<video/>').attr({
//    "id"    : "shokupan_video",
//    "height": "480",
//    "width" : "640"
//});
//var $source = $('<source/>').attr({
//    "src"   : "http://video-js.zencoder.com/oceans-clip.webm",
//    "type"  : "video/webm; codecs=&quot;vorbis,vp8&quot;"
//});
//$video.append($source);
var $video = $('<video id="shokupan_video" width="640" height="480"><source src="http://www.html5rocks.com/en/tutorials/video/basics/Chrome_ImF.webm" type="video/webm; codecs=&quot;vorbis,vp8&quot;"></video>');
$mask_content.append($video);
$mask.append($mask_content);


// 音
var sound = new Audio('http://taira-komori.jpn.org/sound/gamesf01/Crrect_answer3.mp3');
sound.volume = 0.5;

// ボタン出現
var dispBtn = function(){
    if ($('#shokupan_btn').size() === 0 && $('#shokupan_mask').size() === 0) {
        // 開花
        $btn.append($img_open);
        $body.append($btn);
        sound.play();

        // しおれる
        setTimeout(function(){
            $('#shokupan_img_open').remove();
            $('#shokupan_btn').append($img_close);
        }, 5000);

        // お掃除
        setTimeout(function(){
            $('#shokupan_img_close').remove();
            $('#shokupan_btn').remove();
        }, 7000);

    }
};

// 運命モード
$(document).on("click", "#shokupan_img_open", function(){
    send_reunion();
});

// 再会処理
var reunion = function(){
    masked();
});

// マスク
var masked = function(){
    $('#shokupan_btn').remove();

    // マスクの設定
    var height = $(document).height();
    var width  = $(document).width();
    $mask.css({
        "width"  : width,
        "height" : height
    });
    $body.append($mask);

    // videoの設定
    var window_height = window.innerHeight;
    var window_width = window.innerWidth;
    var y = window_height/2-240;
    var x = window_width/2-320;
    $mask_content.css({
        "position" : "absolute",
        "top"      : y,
        "left"     : x
    });   

    // 開始
    $mask.fadeIn(1000, function(){
        var v = document.getElementById('shokupan_video');
        v.play();
        v.addEventListener("ended", function(){
            $(v).remove();
            $mask_content.append($question);
            
        });
    });
};

// サーバからぶつかった判定を受け取ったときの処理
socket.on('crash', function(data) {
    console.log('crash!');
    dispBtn();
});

// サーバからぶつかられた判定を受け取ったときの処理
socket.on('crashed', function(data) {
    console.log('crashed!');
    dispBtn();
});

// ユーザ情報を受け取る
chrome.extension.sendRequest({
    //localStorageからnameを読み込む
    action : "getValues",
    args   : [{
        "name" : "",
    }]
}, function(response){
    name = response.values["name"] || "";

    //データの準備が整ったらスクリプト実行
    send_watching_page();
});

// 見ているページ情報をサーバに送る
var send_watching_page = function() {
    var page = CybozuLabs.MD5.calc(document.URL);
    if (name !== '' && page !== '') {
        console.log('watching_page:user='+name+',page='+page);
        socket.emit('watching_page', {name:name, page:page});
    }
};

// 再会データを受け取る
socket.on('reunion', function(data) {
    console.log('reunion!');
});

// 再会されたデータを受け取る
socket.on('reunioned', function(data) {
    console.log('reunioned!');
    reunion();
});

// 再会できなかったデータを受け取る
socket.on('noreunion', function(data) {
    console.log('no reunion!');
    reunion();
});

// 再会情報をサーバに送る
var send_reunion = function() {
    if (name !== '') {
        console.log('reunion:user='+name);
        socket.emit('reunion', {name:name});
    }
};
