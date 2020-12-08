function OnSaveButtonClick() {
    // alert("OnSaveButtonClick");
    ret = OnButtonClick("Save");
    if (ret == 0) {return;}

}

function OnRemoveButtonClick() {
    // alert("OnSaveButtonClick");
    ret = OnButtonClick("Remove");
    if (ret == 0) {return;}

}

function OnButtonClick(command) {
    // alert("OnSaveButtonClick");
    var jstext = document.getElementById("cur_js").value;
    if (!jstext) {
        alert("No Scripts!");
        return 0;
    }
    // savescript(jstext);
    chrome.runtime.sendMessage({command: [command], jstext: [jstext]},
        function (response) {
            tabURL = response.navURL;
            $("#tabURL").text(tabURL);
        });
    // alert("No return");
}

function OnDeleteButtonClick() {
    alert("OnDeleteButtonClick");
}

window.onload = function () {
    document.getElementById('Save').addEventListener('click', OnSaveButtonClick);
    document.getElementById('Remove').addEventListener('click', OnRemoveButtonClick);

    let month = document.getElementById('month');
    document.createElement('option')
    for(let i = 1; i <= 12; i++){
        let option = document.createElement('option');
        option.setAttribute('value', i);
        option.innerHTML = i + '月';
        month.appendChild(option);
    };

    initalscript();

    // alert("onload");
};

function savescript(jstext){
    var jstitle = jstext.split(/\r\n|\r|\n/)[0];
    chrome.storage.local.set({[jstitle] : jstext}, function () {
    });
    chrome.storage.local.get([jstitle], function(items) {
        // itemsの値は、例えば{'hoge': 'hogeValue'}のようになる。
        alert(items[jstitle]);
    });
}

function initalscript{

    var jstext = `//test01
    let's test01`
    savescript(jstext);

    var jstext = `//test02
    let's test02`
    savescript(jstext);

}
