window.onload = init

var CMD = {
    setValue  : setValue,
    setValues : setValues,
    getValue  : getValue,
    getValues : getValues
};

function init() {
    chrome.extension.onRequest.addListener( function (message, sender, sendResponse) {
        var retVal = (CMD[message.action] || function(){}).apply(CMD, message.args);
        sendResponse({values: retVal});
    });
}

function getValues(list) {
    for(var i in list) {
        list[i] = getValue(i, list[i]);
    }

    return list;
}

function getValue(name, def) {
    if( !localStorage[name]) {
        localStorage[name] = def;
    }
    return localStorage[name];
}

function setValues(list) {
    for(var i in list) {
        setValue(i, list[i]);
    }
}

function setValue(name, value) {
    localStorage[name, value];
}
