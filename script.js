// URLハッシュ
console.log(document.URL);
console.log(CybozuLabs.MD5.calc(document.URL));

// elements
var btn = $('<div/>').attr("id", "shokupan_btn").css({
    "width"    : "80px",
    "height"   : "110px",
    "position" : "absolute",
    "right"    : "10px",
    "bottom"   : 0,
    "z-index"  : "10",
    "overflow" : "hidden",
    "position" : "fixed"
});
var a = $('<a/>').attr({
    "href": "http://yahoo.co.jp",
    "id"  : "shokupan_a"
});
var img_open  = $('<img>').attr({
    "src": "chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/open.gif",
    "id" : "shokupan_img_open"
});
var img_close = $('<img>').attr({
    "src": "chrome-extension://gjncemgkdjhpofeiaclefaegbpkefimk/close.gif",
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


$('body').click(dispBtn);
