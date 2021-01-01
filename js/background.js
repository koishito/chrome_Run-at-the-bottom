const curkey = String.fromCharCode(189);
const excludedURLsList = `"Regular expression pattern list for excluded URLs"`;
const ScriptTemplate = `"Script template"`;

function globalObject() {
  return {curkey, excludedURLsList, ScriptTemplate};
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  // console.log(activeInfo.tabId);
  onActivatedTab();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.active) {
    onActivatedTab();
  }
});

// 機能拡張のインストール・アップデート時に実行
chrome.runtime.onInstalled.addListener(function (details) {
  console.log("onInstalled: " + details.reason);
  chrome.storage.sync.clear();
  onActivatedTab();

});

// // 機能拡張の起動時に実行
// chrome.runtime.onStartup.addListener(function () {
//   console.log("onStartup");

// });

function onActivatedTab(){
  chrome.storage.sync.get(null, function(items) {
    var keys = Object.keys(items);
    // storageが空の場合に、jstextの初期値を設定
    if (keys.length === 0){
      initialLoad();
      onActivatedTab();
    } else {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const url = tabs[0].url;
        console.log(url);
        // Check Eexcluded URL
        const excludedURLs = items[excludedURLsList].script.split(/\r\n|\r|\n/)
        var isEexcludedURL = "";
        for (i = 0; i < excludedURLs.length; i++) {
          var excludedURL = excludedURLs[i];
          if ((/\/.+\//.test(excludedURL)) && (RegExp(excludedURL.substr( 1, excludedURL.length - 2 )).test(url)))
            { isEexcludedURL += '\n' + excludedURL;}
        }
        // Other than Eexcluded URL
        setIcon(`unset`, `Unmatched` );
        if (!isEexcludedURL) {
          var matchName = ``;
          for (i = 0 ; i < keys.length; i++) {
            var key = keys[i];
            var item = items[key];
            var curRegPattUrl = item.regPattUrl;
            if ((key != curkey) && (key != excludedURLsList) && (key != ScriptTemplate)) {
              var regPattUrl =RegExp(curRegPattUrl.substr( 1, curRegPattUrl.length - 2 ));
              var isMatch = regPattUrl.test(url);
              if ((/\/.+\//.test(curRegPattUrl)) && (isMatch)) {
                var execScript = items[ScriptTemplate].script;
                execScript = execScript.replace(/\*\*regular expression pattern for url matching\*\*/, curRegPattUrl);
                execScript = execScript.replace(/\*\*script\*\*/, item.script);
                // console.log(`execScript : ` + execScript);
                var response = executeScript(tabs[0].id, execScript);
                matchName += `\n` + key;
                console.log('matchName :' + matchName);
              }
            }
          }
          if (matchName) {
            setIcon(`set`, matchName.slice(1));
          }

        } else {
          setIcon(`except`, isEexcludedURL.slice(1));
        }
      });
    }
  });
}

function setIcon(BadgeText, Title) {
  chrome.browserAction.setBadgeText({ text: BadgeText });
  chrome.browserAction.setTitle({ title: Title });
}

function executeScript(tabId, execScript) {
  chrome.tabs.executeScript(
    tabId,
    {
      code: execScript,
    },
    function (response) {
      // console.log(`typeof(response) :"` + typeof(response) + `"`);
      // console.log(`response[0] :"` + response[0] + `"`);
      // console.log(`response :"` + response + `"`);
      // console.log(`response.toString() :"` + response.toString() + `"`);
      // return response.toString();
    }
  );
}


function initialLoad() {
  const arr = [
    {
      name : excludedURLsList,
      regPattUrl : ``,
      script : 
`/^chrome.+$/
/^.+google.+$/
/^.+github.+$/`
    },
    {
      name : ScriptTemplate,
      regPattUrl : ``,
      script : 
`// The part enclosed in ** is replaced.
(function(){
document.addEventListener('scroll',  function() {
  const scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  var scrollTop =
  document.documentElement.scrollTop || // IE、Firefox、Opera
  document.body.scrollTop;              // Chrome、Safari

  if(parseInt(scrollHeight - window.innerHeight - document.documentElement.scrollTop) < 1) {
    mainScript();
  };
});

function mainScript() {
  const regPattUrl = **regular expression pattern for url matching**;
  const path = location.href.match(regPattUrl)[0];
  **script**
}
})();`
    },
    {
      name : `カクヨム's next article`,
      regPattUrl : `/^https:\\/\\/kakuyomu.jp\\/works\\/\\d{19}\\/episodes\\//`,
      script : 
`//(function(){
//  const regPattUrl = /^https:\\/\\/kakuyomu.jp\\/works\\/\\d{19}\\/episodes\\//;
//  const path = location.href.match(regPattUrl)[0];
const id = 'contentMain-readNextEpisode';
const targetElement = document.getElementById(id);
if(('href' in targetElement ) && (targetElement.href.match(regPattUrl)[0] == path)) {
  location.href = targetElement.href;
}
//})();`
    },
    {
      name : `小説家になろう's next article`,
      regPattUrl : `/^https:\\/\\/ncode.syosetu.com\\/n\\d{4}\[a-z]{2}\\//`,
      script : 
`//(function(){
//  const regPattUrl = /^https:\\/\\/ncode.syosetu.com\\/n\\d{4}\[a-z]{2}\\//;
//  const path = location.href.match(regPattUrl);
const linkText= "次へ >>";
const dlinks = document.links;
for (var i = dlinks.length-1; i >= 0; i--){
  console.log(dlinks[i].textContent,(dlinks[i].textContent == linkText));
  if(('textContent' in dlinks[i] ) && (dlinks[i].textContent == linkText) &&
  (dlinks[i].href.match(regPattUrl) == path)) {
  location.href = dlinks[i].href;
  }
}
//})();`
    }
  ];

  chrome.storage.sync.set({[curkey]: excludedURLsList}, function () {});

  for (var i = 0; i < arr.length; i++) {
    var json = {[arr[i].name]: {regPattUrl: arr[i].regPattUrl, script: arr[i].script}};
    chrome.storage.sync.set(json, function () {});
  }
  chrome.storage.sync.get(null, function (data) { console.info(data) });
}


// // 現時点でのruleをクリア(removeRules)して
// chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//   // 新たなruleを追加する
//   chrome.declarativeContent.onPageChanged.addRules([{
//     conditions: [
//       // アクションを実行する条件
//       new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {schemes: ['https']}
//       })
//     ],
//     // 実行するアクション
//     actions: [
//       new chrome.declarativeContent.ShowPageAction()
//     ]
//   }]);
// });

// // options.html からの指示を受け取る
// chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {

//   var srcCommand = request.command
//   var srcValue = request.jstext;
//   var srckey = srcValue.split(/\r\n|\r|\n/)[0];

//   if (srcCommand == "Change") {
//     savejstext(String.fromCharCode(6)+`\n` + srcValue);
//     console.log("set curent : '"+ srckey + "'");
//   }

//   if (srcCommand == "Save") {
//     savejstext(srcValue);
//     console.log("saved '"+ srckey + "'");
//   }

//   if (srcCommand == "Remove") {
//     chrome.storage.sync.remove(srckey, function() {
//       console.log("removed '" + srckey + "'");
//     });
//     // 最初の要素をデフォルトに設定する
//     chrome.storage.sync.get(null, function(items) {
//       firstKey = Object.keys(items)[0];
//       firstValue = items[firstKey];
//       savejstext(String.fromCharCode(6)+`\n` + firstValue );
//       console.log("set curent : '"+ firstKey + "'");
//     });
//   }

//   //一覧を戻す
//   chrome.storage.sync.get(null, function(items) {
//     sendResponse( {allvalue: [items]} );
//     // var allkeys = Object.keys(items);
//     // console.log(allkeys);
//   });

// })