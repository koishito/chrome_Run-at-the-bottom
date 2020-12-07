// 現時点でのruleをクリア(removeRules)して
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  // 新たなruleを追加する
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      // アクションを実行する条件
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {schemes: ['https']}
      })
    ],
    // 実行するアクション
    actions: [
      new chrome.declarativeContent.ShowPageAction()
    ]
  }]);
});

// scriptの初期値の入力
window.onload = function () {
  var jstext = `//test01
  test01`
  savescript(jstext);
    // sleep(2000);
    var jstitle = jstext.split(/\r\n|\r|\n/)[0];
    chrome.storage.local.get([jstitle], function(items) {
    // itemsの値は、例えば{'hoge': 'hogeValue'}のようになる。
    alert(items[jstitle]);
  });
}

function savescript(jstext){
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.local.set({[jstitle] : jstext}, function () {
    // alert("Value is set to " + jstext);
  });
}
function sleep(waitMsec) {
  var startMsec = new Date();
 
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}