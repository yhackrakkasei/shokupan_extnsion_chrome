"use strict";

// socket.ioを使うため、インスタンスを作成
var socket = io.connect('http://210.129.193.23:3000/');
var name = "";

// elements
var btn = $('<div/>').attr("id", "shokupan_btn").css({
    "width"    : "80px",
    "height"   : "110px",
    "position" : "absolute",
    "right"    : "10px",
    "bottom"   : 0,
    "z-index"  : "10",
    "overflow" : "hidden",
});
var a = $('<a/>').attr({
    "href": "http://yahoo.co.jp",
    "id"  : "shokupan_a"
});
var img_open  = $('<img>').attr({
    "src": "chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/img/open.gif",
    "id" : "shokupan_img_open"
});
var img_close = $('<img>').attr({
    "src": "chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/img/close.gif",
    "id" : "shokupan_img_close"
});
a.append(img_open);

// 音
var sound = new Audio('http://taira-komori.jpn.org/sound/gamesf01/Crrect_answer3.mp3');
sound.volume = 0.5;

// ボタン出現
var dispBtn = function(){
    if ($('#shokupan_btn').size() === 0) {
        // 開花
        btn.append(a);
        btn.click(function() {
            send_reunion();
        });
        $('body').append(btn);
        sound.play();

        // しおれる
        setTimeout(function(){
            $('#shokupan_a').remove();
            $('#shokupan_btn').append(img_close);
        }, 5000);

        // お掃除
        setTimeout(function(){
            $('#shokupan_img_close').remove();
            $('#shokupan_btn').remove();
        }, 7000);
    }
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
    dispBtn();
});

// 再会できなかったデータを受け取る
socket.on('noreunion', function(data) {
    console.log('no reunion!');
    dispBtn();
});

// 再会情報をサーバに送る
var send_reunion = function() {
    if (name !== '') {
        console.log('reunion:user='+name);
        socket.emit('reunion', {name:name});
    }
};
