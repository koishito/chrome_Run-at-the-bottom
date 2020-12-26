// 機能拡張のインストール・アップデート時に実行
chrome.runtime.onInstalled.addListener(function (details) {
  console.log("onInstalled: " + details.reason);
  chrome.storage.sync.clear();
  // storageが空の場合に、jstextの初期値を設定
  chrome.storage.sync.get(null, function(items) {
    if (Object.keys(items).length === 0){
      var jstext1 = { 
        name : `Excluded URL pattern`,
        regPattUrl : `List below`,
        script : `/^chrome:\/\/.+$//n/^.+google.+$/`
      }
      var jstext2 = `//test02\n02`
      saveCurrentjstext(jstext2); //Default
      savejstext(jstext1);
      savejstext(jstext2);
    }
  });


  
});

class storageProcess {



  
}

(function(){
  const regPattUrl = /^https:\/\/ncode.syosetu.com\/n\d{4}\u{2}\//;
  const path = location.href.match(regPattUrl);
  const linkText= `次へ >>`;
  const dlinks = document.links;
  const dlink = dlinks.find(dlink => dlink.textContent === linkText);
  // document.links.forEach( function( dlinks ) {
    console.log(dlink.textContent,(dlinks.textContent == linkText));
    // if(('textContent' in dlinks ) && (dlinks.textContent == linkText) &&
    //   (dlinks.href.match(regPattUrl) == path)) {
    // // location.href = dlinks.href;
    // }
  // }
})();




function saveCurrentjstext(jstext){
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[String.fromCharCode(189)]: jstitle}, function () {});
}

function savejstext(jstext){
  // console.log(jstext);
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[jstitle]: jstext}, function () {});
}

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

// 機能拡張の起動時に実行
chrome.runtime.onStartup.addListener(function () {
  console.log("onStartup");


});

// options.html からの指示を受け取る
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {

  var srcCommand = request.command
  var srcValue = request.jstext;
  var srckey = srcValue.split(/\r\n|\r|\n/)[0];

  if (srcCommand == "Change") {
    savejstext(String.fromCharCode(6)+`\n` + srcValue);
    console.log("set curent : '"+ srckey + "'");
  }

  if (srcCommand == "Save") {
    savejstext(srcValue);
    console.log("saved '"+ srckey + "'");
  }

  if (srcCommand == "Remove") {
    chrome.storage.sync.remove(srckey, function() {
      console.log("removed '" + srckey + "'");
    });
    // 最初の要素をデフォルトに設定する
    chrome.storage.sync.get(null, function(items) {
      firstKey = Object.keys(items)[0];
      firstValue = items[firstKey];
      savejstext(String.fromCharCode(6)+`\n` + firstValue );
      console.log("set curent : '"+ firstKey + "'");
    });
  }

  //一覧を戻す
  chrome.storage.sync.get(null, function(items) {
    sendResponse( {allvalue: [items]} );
    // var allkeys = Object.keys(items);
    // console.log(allkeys);
  });

})