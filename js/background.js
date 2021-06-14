// const curkey = String.fromCharCode(189);
const systemDataKey = `'System data : excluded URLs & Script template'`;

// Fired when the active tab in a window changes.
chrome.tabs.onActivated.addListener(function (activeInfo) {
  // console.log(activeInfo.tabId);
  setTimeout(onChangedActiveTab, 200);
});

// Fired when a tab is closed.
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  // if (removeInfo.status == "complete" && tab.active) {
    setTimeout(onChangedActiveTab, 200);
    // }
});

// Fired when a tab is updated.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.active) {
    setTimeout(onChangedActiveTab, 200);
  }
});

// 機能拡張のインストール・アップデート時に実行
chrome.runtime.onInstalled.addListener(function (details) {
  console.log("onInstalled: " + details.reason);
  // if (details.reason = 'install') {
  //   initialLoad();
  // }
  if (localStorage.getItem('dispMatchedRegPattsCode') == null){
    initialLoad();
  }
  setTimeout(onChangedActiveTab, 200);

});

// // 機能拡張の起動時に実行
// chrome.runtime.onStartup.addListener(function () {
//   console.log("onStartup");

// });

function onChangedActiveTab(){ // This function is a recursive function.
  chrome.storage.sync.get(null, function(items) {
    let keys = Object.keys(items);
    // localstorage('dispMatchedRegPattsCode')が空の場合に、各storageの初期値を設定
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      if ((tabs == undefined) || (tabs.length < 1)) {
        console.log(`tabs error !`);
        setTimeout(onChangedActiveTab, 100);
      } else {
        const tabId = tabs[0].id;
        const url = tabs[0].url;
        const title = tabs[0].title;
        setIcon(``, `Unmatched` );
        // Check URL
        for (let i = 0 ; i < keys.length; i++) {
          var key = keys[i];
          var item = items[key];
          var regPattForURLArray = item.regPattForURL.split(/\r\n|\r|\n/)
          var matchedRegPatts = "";
          for (let j = 0; j < regPattForURLArray.length; j++) {
            var regPattForURL = regPattForURLArray[j];
            var matchedURL = url.match(RegExp(regPattForURL.substr( 1, regPattForURL.length - 2 )));
            if ((/\/.+\//.test(regPattForURL)) && (matchedURL)) {
              console.log(i, j, url, matchedURL);
              matchedRegPatts += '\n' + regPattForURL;
            }
          }
          item.match = (matchedRegPatts) ? `\n` + key + matchedRegPatts : ``;
        }
        // Processing based on the check result
        const excludedMatch = items[systemDataKey].match;
        let errorPage = !(/^http/.test(title)) && (url.indexOf(title) >= 0);

        if (excludedMatch || errorPage) {
          setIcon(`excpt`, excludedMatch.slice(1));
        } else {
          // make matchedRegPatts
          var matchedRegPatts = "";
          for (let i = 0 ; i < keys.length; i++) {
            var key = keys[i];
            var item = items[key];
            var match = item.match;
            if ((key != systemDataKey) && (match)) {
              matchedRegPatts += match;
              var execScript = items[systemDataKey].script;
              execScript = execScript.replace(/\*\*name\*\*/, key);
              var curregPattForURL = match.split(/\r\n|\r|\n/)[2]; //[0] is .[1] is name.
              execScript = execScript.replace(/\*\*regular expression pattern for url matching\*\*/, curregPattForURL);
              execScript = execScript.replace(/\*\*script\*\*/, item.script);
              // console.log(`execScript : ` + execScript);
              var response = executeScript(tabId, execScript);
              localStorage.setItem('curkey', key);
            }
          }
          if (matchedRegPatts) {
            setIcon(`set`, matchedRegPatts.slice(1));

            var execScript = localStorage.getItem('dispMatchedRegPattsCode');
            var matchedKeys = matchedRegPatts.split(/\r\n|\r|\n/)
              .reduce((acc, val, idx) => acc += (idx % 2 == 1) ? `\n` + val: ``).slice(1);
            execScript = execScript.replace(/\*\*matchedRegPatts\*\*/, matchedKeys);
            var response = executeScript(tabId, execScript);
          }
        }
      }
    });
  });
}

function setIcon(badgeText, toolTip) {
  chrome.browserAction.setBadgeText({ text: badgeText });
  chrome.browserAction.setTitle({ title: toolTip });
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
//   const arr = [
// {
// name : systemDataKey,
// regPattForURL :
// `/^file:\\/\\/\\//
// /^https:\\/\\/bitbucket\.org\\//
// /^chrome.+$/
// /^.+(docs|translate|calendar|mail)\\.google.+$/
// /^.+github.+$/
// /^.+amazon.+$/
// /^.+rakuten.+$/`,
// script :
// `// The part enclosed in ** is replaced.
// (window.onload=function(){
// function onScroll() {
//   document.addEventListener('scroll',  function() {
//     const scrollHeight = Math.max(
//       document.body.scrollHeight, document.documentElement.scrollHeight,
//       document.body.offsetHeight, document.documentElement.offsetHeight,
//       document.body.clientHeight, document.documentElement.clientHeight
//     );
//     let scrollTop =
//       document.documentElement.scrollTop || // IE、Firefox、Opera
//       document.body.scrollTop;              // Chrome、Safari
//       console.log(parseInt(scrollHeight - window.innerHeight - scrollTop));
//     if (parseInt(scrollHeight - window.innerHeight - scrollTop) < 10) {
//       scriptAtBottom();
//     };
//   });
// }

// function dispPosition() {
//   let a=document.createElement("div");
//   a.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:silver;padding:10px;text-align:center;z-index:19999;";
//   a.onclick=function(){
//     document.body.removeEventListener("mousemove", dispPosition);
//     a.parentNode.removeChild(a);
//   };
//   a.style.fontSize = '12px';
//   x=document.createElement("input");
//   x.type="text";
//   x.size="3"
//   x.id="xxx";
//   y=document.createElement("input");
//   y.type="text";
//   y.size="3"
//   y.id="yyy";
//   a.appendChild(x);
//   a.appendChild(y);
//   document.body.appendChild(a);

//   document.body.addEventListener("mousemove", dispPosition);
//   function dispPosition(e){
//     document.getElementById("xxx").value = "x : " + e.clientX;
//     document.getElementById("yyy").value = "y : " + e.clientY;
//   };

// }

// function floatBox_to(text) {

//   var mbox=document.createElement("div");
//   mbox.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:10px;text-align:center;z-index:19999;";
//   mbox.style.opacity = '0.8';
//   mbox.style.background = 'silver';
//   mbox.style.border = '1px solid #aaa';
//   mbox.style.fontSize = '20px';
//   text.split(/\\r\\n|\\r|\\n/).forEach(element => {
//     mbox.appendChild(document.createTextNode(element));
//     mbox.appendChild(document.createElement('br'));
//     mbox.appendChild(document.createElement('br'));
//   });
//   document.body.appendChild(mbox);

//   /* setTimeout(closenode, 1500);
//     function closenode(){mbox.parentNode.removeChild(mbox);}*/

//   setTimeout(() =>{mbox.parentNode.removeChild(mbox);}, 1000);

// }

// function curclepoint(x, y) {
//   //x-=10;y-=10;
//   let cp=document.createElement("div");
//   cp.style.cssText="position:fixed;top:"+ y +"px;left:"+ x +"px;width: 20px;height:20px;border-radius:50%;background-color:#f00;";
//   document.body.appendChild(cp);
//   setTimeout(() =>{cp.parentNode.removeChild(cp);}, 2000)
// }

// const regPattForURL = **regular expression pattern for url matching**;
// console.log(location.href.match(regPattForURL));
// const matchedPartInURL = location.href.match(regPattForURL)[0];
// **script**
// //floatBox_to("**name**");
// })();`
// },
// {
// name : `Open the link for the next article starting with /次|>|＞|next|→/`,
// regPattForURL :
// `/^https:\\/\\/seiga\\.nicovideo\\.jp\\/watch\\/mg\\d{6}\\?track=/
// /^https:\\/\\/toyokeizai\\.net\\/articles\\/\\-\\/\\d+\\?page=/
// /^https:\\/\\/ncode.syosetu.com\\/n\\d{4}[a-z]{2}\\//
// /^https:\\/\\/book.dmm.com\\/library\\//`,
// script :
// `const linkTextStartingWith= /次|>|＞|next|→/;
// var nextArticle = '';
// console.log("matchedPartInURL : " + matchedPartInURL);
// const dlinks = document.links;
// for (var i = dlinks.length-1; i >= 0; i--){
//   var dlink = dlinks[i];
//   var dlinkPath = dlink.href;
//   console.log("dlink.textContent.search : " + dlink.textContent.search(linkTextStartingWith));
//   console.log("dlinkPath.match : " + dlinkPath.match(regPattForURL));
//   if(('textContent' in dlink ) && (dlink.textContent.search(linkTextStartingWith) == 0) &&
//     (dlinkPath.match(regPattForURL) == matchedPartInURL)) {
//     console.log("dlinkPath : " + dlinkPath);
//     nextArticle = dlinkPath;
//     onScroll();
//     break;
//   }
// }
// function scriptAtBottom() {
//   location.href = nextArticle;
// }`
// }
// ];

  localStorage.clear();
  localStorage.setItem('systemDataKey', systemDataKey);
  localStorage.setItem('curkey', systemDataKey);
  localStorage.setItem('dispMatchedRegPattsCode',
`javascript:(function(){
  var text = \`**matchedRegPatts**\`;
  var mbox=document.createElement("div");
  mbox.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:10px;text-align:left;z-index:19999;";
  mbox.style.opacity = '0.8';
  mbox.style.background = 'silver';
  mbox.style.border = '1px solid #aaa';
  mbox.style.fontSize = '14px';
  text.split(/\\r\\n|\\r|\\n/).forEach(element => {
    mbox.appendChild(document.createElement('br'));
    mbox.appendChild(document.createTextNode(element));
    mbox.appendChild(document.createElement('br'));
  });
  mbox.appendChild(document.createElement('br'));
  document.body.appendChild(mbox);

  /* setTimeout(closenode, 3000);
    function closenode(){mbox.parentNode.removeChild(mbox);}*/

  setTimeout(() =>{mbox.parentNode.removeChild(mbox);}, 1500);

})();`);

  for (let i = 0; i < arr.length; i++) {
    var obj = {[arr[i].name]: {regPattForURL: arr[i].regPattForURL, script: arr[i].script, match: ``}};
    chrome.storage.sync.set(obj, function () {});
  }
  chrome.storage.sync.get(null, function (data) { console.info(data) });
}
