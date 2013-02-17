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
var $question_wrapper = $('<div/>').attr({
    "id" : "shokupan_qwrapper"
}).css({
    "width"  : "640px",
    "height" : "480px",
    "background-image" : "url('chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/img/pan.png')"
});
var $question_content = $('<div/>').css({
    "border"   : "solid 1px black",
    "position" : "relative",
    "left"     : "125px",
    "top"      : "45px",
    "width"    : "390px",
    "height"   : "390px"
}).html('<input type="radio" name="q" value="1">てすと１<br>'+
    '<input type="radio" name="q" value="2">てすと2<br>'+
    '<input type="radio" name="q" value="3">てすと3<br>'+
    '<button id="reunion_submit">送信</button>');
$question_wrapper.append($question_content);
                    
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
var $video = $('<video id="shokupan_video" width="640" height="480"><source src="chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/movie/hit.webm" type="video/webm; codecs=&quot;vorbis,vp8&quot;"></video>');
$mask_content.append($video);
$mask.append($mask_content);

var $video_reunion = $('<video id="shokupan_video_reunion" width="640" height="480"><source src="chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/movie/reunion_m.webm" type="video/webm; codecs=&quot;vorbis,vp8&quot;"></video>');

// 音
var sound = new Audio('chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/movie/open.mp3');
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
    masked();
});

// 再会処理
var reunion = function(){
    $('#shokupan_qwrapper').remove();
    $mask_content.append($video_reunion);
    document.getElementById('shokupan_video_reunion').play();
};

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
            $mask_content.append($question_wrapper);
            
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
    reunion();
});

// 再会されたデータを受け取る
socket.on('reunioned', function(data) {
    console.log('reunioned!');
    reunion();
});

// 再会できなかったデータを受け取る
socket.on('noreunion', function(data) {
    console.log('no reunion!');
    // TODO 元に戻す
});

// 再会情報をサーバに送る
var send_reunion = function() {
    console.log('reunion button');
    if (name !== '') {
        console.log('reunion:user='+name);
        socket.emit('reunion', {name:name});
    }
};

// 再会設問を押したときの処理
$(document).on("click", "#reunion_submit", function(){
   send_reunion();
});
