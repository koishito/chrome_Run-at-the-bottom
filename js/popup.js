// backgroundで受け取った値をコンソールに表示
function logBackgroundValue () {
    var test = chrome.extension.getBackgroundPage().test_value;
    console.log(test);
    return;
}

// 現在アクティブなタブにデータを送信
function sendToContents(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            JSON.stringify({ contents: "test value from popup" }),
            function (response) {
            });
    });    
}

document.getElementById('log').addEventListener('click', logBackgroundValue);
document.getElementById('send').addEventListener('click', sendToContents);