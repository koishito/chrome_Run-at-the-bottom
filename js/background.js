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
  savejstext(jstext);
    // var jstitle = jstext.split(/\r\n|\r|\n/)[0];
    // chrome.storage.local.get([jstitle], function(items) {
    // itemsの値は、例えば{'hoge': 'hogeValue'}のようになる。
    // alert(items[jstitle]);
  // });
}

function savejstext(jstext){
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[jstitle] : jstext}, function () {
    // alert("Value is set to " + jstext);
  });
}

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {

  var srckey = jstext.split(/\r\n|\r|\n/)[0];

  if (request.command == "Save") {
    savejstext(request.jstext);
    alert("saved '"+ srckey + "'");
    var curvalue = jstext;
  }

  if (request.command == "Remove") {
    chrome.storage.sync.remove(srckey, function() {
      alert("removed '" + srckey + "'");
    });
  }

  //key一覧を取得
  chrome.storage.sync.get(null, function(items) {
  var allvalue = Object.keys(items);
  alert(allvalue);
  });

  if (request.command <> "save") {
    curvalue = allvalue[0];
  }
  
  sendResponse( {curvalue: [curvalue], allvalue: [allvalue]} );


  // if( request.greeting === "GetURL" )
  // {
  //     var tabURL = "Not set yet";
  //     chrome.tabs.query({active:true},function(tabs){
  //         if(tabs.length === 0) {
  //             sendResponse({});
  //             return;
  //         }
  //         tabURL = tabs[0].url;
  //         sendResponse( {navURL:tabURL} );
  //     });        
  // }
})