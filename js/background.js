// const curkey = String.fromCharCode(189);
const excludedURLsList = `"System data : excluded URLs & Script template"`;
localStorage.setItem('excludedURLsList', excludedURLsList);

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
  // if (details.reason = 'install') {
    chrome.storage.sync.clear();
  // }
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
        const tabId = tabs[0].id;
        const url = tabs[0].url;
        console.log(url);
        setIcon(``, `Unmatched` );
        // Check URL
        for (let i = 0 ; i < keys.length; i++) {
          var key = keys[i];
          var item = items[key];
          var excludedURLs = item.regPattUrl.split(/\r\n|\r|\n/)
          var inclmatchedURL = "";
          for (let i = 0; i < excludedURLs.length; i++) {
            var excludedURL = excludedURLs[i];
            var matchUrl = url.match(RegExp(excludedURL.substr( 1, excludedURL.length - 2 )));
            if ((/\/.+\//.test(excludedURL)) && (matchUrl)) {
              inclmatchedURL += '\n' + excludedURL;
            }
          }
          item.match = (inclmatchedURL) ? `\n` + key + inclmatchedURL : ``;
        }
        // Processing based on the check result
        var inclmatchedURL = "";
        const excludedMatch = items[excludedURLsList].match;
        if (excludedMatch) {
          setIcon(`excpt`, excludedMatch.slice(1));
        } else {
          for (let i = 0 ; i < keys.length; i++) {
            var key = keys[i];
            var item = items[key];
            var match = item.match;
            if ((key != excludedURLsList) && (match)) {
              inclmatchedURL += match;
              var execScript = items[excludedURLsList].script;
              var curRegPattUrl = item.regPattUrl.split(/\r\n|\r|\n/)[0];
              execScript = execScript.replace(/\*\*regular expression pattern for url matching\*\*/, curRegPattUrl);
              execScript = execScript.replace(/\*\*script\*\*/, item.script);
              // console.log(`execScript : ` + execScript);
              var response = executeScript(tabId, execScript);
            }
          }
          if (inclmatchedURL) {
            setIcon(`set`, inclmatchedURL.slice(1));
          }
        }
      });
    }
  });
}

function setIcon(badgeText, title) {
  chrome.browserAction.setBadgeText({ text: badgeText });
  chrome.browserAction.setTitle({ title: title });
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
regPattUrl : 
`/^chrome.+$/
/^.+google.+$/
/^.+github.+$/`,
script : 
`// The part enclosed in ** is replaced.
(function(){
function onScroll() {
  document.addEventListener('scroll',  function() {
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    var scrollTop =
      document.documentElement.scrollTop || // IE、Firefox、Opera
      document.body.scrollTop;              // Chrome、Safari
    if (parseInt(scrollHeight - window.innerHeight - scrollTop) < 1) {
      scriptAtBottom();
    };
  });
}

const regPattUrl = **regular expression pattern for url matching**;
const path = location.href.match(regPattUrl)[0];
**script**
})();`
},
{
name : `カクヨム's next article`,
regPattUrl : 
`/^https:\\/\\/kakuyomu.jp\\/works\\/\\d{19}\\/episodes\\//`,
script : 
`const id = 'contentMain-readNextEpisode';
var nextArticle = '';
const targetElement = document.getElementById(id);
if(('href' in targetElement ) && (targetElement.href.match(regPattUrl)[0] == path)) {
  nextArticle = targetElement.href;
  onScroll();
}

function scriptAtBottom() {
  location.href = nextArticle;
}`
},
{
name : `「次」から始まる next article`,
regPattUrl : 
`/^https:\\/\\/ncode.syosetu.com\\/n\\d{4}\[a-z]{2}\\//`,
script : 
`const linkText= "次";
var nextArticle = '';
console.log("path : " + path)
const dlinks = document.links;
for (var i = dlinks.length-1; i >= 0; i--){
  console.log(dlinks[i].textContent, (('textContent' in dlinks[i] ) && (dlinks[i].textContent.indexOf(linkText) == 0)))
  if(('textContent' in dlinks[i] ) && (dlinks[i].textContent.indexOf(linkText) == 0) &&
    (dlinks[i].href.match(regPattUrl) == path)) {
    nextArticle = dlinks[i].href;
    onScroll();
    break;
  }
}
function scriptAtBottom() {
  location.href = nextArticle;
}`
}
  ];

  localStorage.setItem('curkey', excludedURLsList);
  
  for (var i = 0; i < arr.length; i++) {
    var json = {[arr[i].name]: {regPattUrl: arr[i].regPattUrl, script: arr[i].script, match: ``}};
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