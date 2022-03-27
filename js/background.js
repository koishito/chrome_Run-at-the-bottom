// const curKey = String.fromCharCode(189);
const c = {black: '\u001b[30m',red: '\u001b[31m',green: '\u001b[32m',yellow: '\u001b[33m',blue: '\u001b[34m',magenta: '\u001b[35m',cyan: '\u001b[36m',white: '\u001b[37m'};
const systemDataKey = `${String.fromCharCode(1)}System data : excluded URLs & Script template${String.fromCharCode(1)}`;
const dispMatchedRegPattsCode = `
(window.onload = function(){
  var text = \`**matchedRegPatts**\`;
  var mbox=document.createElement("div");
  mbox.style.cssText="font-size:30px;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:10px;text-align:left;z-index:19999;";
  //mbox.style.opacity = '0.8';
  mbox.style.background = 'black';
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

})();`;

// Fired when the active tab in a window changes.
chrome.tabs.onActivated.addListener(activeInfo => {
  // console.log(`\n${c.green}tabs.onActivated.${c.black}\nactiveInfo : ${activeInfo.tabId}`);
  setTimeout(onChangedActiveTab(), 200);
});

// Fired when a tab is closed.
// chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
//   // if (removeInfo.status == "complete" && tab.active) {
//     console.log(`onRemoved. \ntabId : ${tabId}`);
//     setTimeout(onChangedActiveTab(tabId+0), 200);
//     // }
// });

// Fired when a tab is updated.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete" && tab.active) {
    // console.log(`\n${c.yellow}tabs.onUpdated.${c.black}\ntabId : ${tabId}\nchangeInfo.status : ${changeInfo.status}\ntab : ${JSON.stringify(tab, null, '\t')}`);
    setTimeout(onChangedActiveTab(), 200);
  }
});

// 機能拡張のインストール・アップデート時に実行
chrome.runtime.onInstalled.addListener(details => {
  // console.log(`\n${c.green}onInstalled${c.black}: ${details.reason}`);
  if (localStorage.getItem('curKey') == null){
    // alert(`initialLoad`);
    initialLoad();
  }
  setTimeout(onChangedActiveTab(0), 200);

});

// // 機能拡張の起動時に実行
// chrome.runtime.onStartup.addListener(() => {
//   console.log("onStartup");

// });

function onChangedActiveTab() {
  // console.log(`${c.green}onChangedActiveTab.${c.black} tabId : ${tabId}`);
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if (tabs) {
      checkCurrentTabMatched(tabs[0])
    } else {
      console.log(`tabs error !`);
      setTimeout(onChangedActiveTab, 100);
    }
  });
}

function checkCurrentTabMatched(curTab) {
  // console.log(`\n${c.green}checkCurrentTabMatched${c.black}\ncurTab : ${JSON.stringify(curTab, null, '\t')}`);
  chrome.storage.sync.get(null, items => {
    setIcon(``, `Unmatched` );
    let toolTip = ``;
    let floatText = ``;
    let scriptText = ``;
    for (key in items) {
      let item = items[key];
      let matchPattern = checkUrlMatched(curTab.url, item.regPattForURL);
      if (matchPattern) {
        console.log(`matchPattern : ${matchPattern}`);
        if (key == systemDataKey) {
          setIcon(`excpt`, `${key}\n${matchPattern}`);
          return;
        }
        toolTip += `\n"${key}"\n${matchPattern}`;
        floatText += `\n${key}\n`;
        scriptText += `\n${items[systemDataKey].script}`
                        .replace(/\*\*name\*\*/, key)
                        .replace(/\*\*regular expression pattern for url matching\*\*/, matchPattern)
                        .replace(/\*\*script\*\*/, item.script)
      }
    }
    if (toolTip) {
      setIcon(`set`, toolTip.slice(1));
      scriptText += `\n${dispMatchedRegPattsCode}`.replace(/\*\*matchedRegPatts\*\*/, floatText.slice(1,-1));
      // console.log(`${c.red}toolTip : ${toolTip + c.green}\nscriptText : ${scriptText + c.magenta}\nfloatText : ${floatText}`);
      let response = executeScript(curTab.id, scriptText);
      localStorage.setItem('curKey', key);
    }
    // return;
    
    // const keys = Object.keys(items);
    // const tabId = curTab.id;
    // const url = curTab.url;
    // const title = curTab.title;
    // setIcon(``, `Unmatched` );
    // // Check URL
    // for (let i = 0 ; i < keys.length; i++) {
    //   var key = keys[i];
    //   var item = items[key];
    //   var regPattForURLArray = item.regPattForURL.split(/\r\n|\r|\n/)
    //   var matchedRegPatts = "";
    //   for (let j = 0; j < regPattForURLArray.length; j++) {
    //     var regPattForURL = regPattForURLArray[j];
    //     var matchedURL = url.match(RegExp(regPattForURL.substr( 1, regPattForURL.length - 2 )));
    //     if ((/\/.+\//.test(regPattForURL)) && (matchedURL)) {
    //       console.log(i, j, url, matchedURL);
    //       matchedRegPatts += '\n' + regPattForURL;
    //     }
    //   }
    //   item.match = (matchedRegPatts) ? `\n` + key + matchedRegPatts : ``;
    // }
    // // Processing based on the check result
    // const excludedMatch = items[systemDataKey].match;
    // let errorPage = !(/^http/.test(title)) && (url.indexOf(title) >= 0);

    // if (excludedMatch || errorPage) {
    //   setIcon(`excpt`, excludedMatch.slice(1));
    // } else {
    //   // make matchedRegPatts
    //   var matchedRegPatts = "";
    //   for (let i = 0 ; i < keys.length; i++) {
    //     var key = keys[i];
    //     var item = items[key];
    //     var match = item.match;
    //     if ((key != systemDataKey) && (match)) {
    //       matchedRegPatts += match;
    //       var execScript = items[systemDataKey].script;
    //       execScript = execScript.replace(/\*\*name\*\*/, key);
    //       var curregPattForURL = match.split(/\r\n|\r|\n/)[2]; //[0] is .[1] is name.
    //       execScript = execScript.replace(/\*\*regular expression pattern for url matching\*\*/, curregPattForURL);
    //       execScript = execScript.replace(/\*\*script\*\*/, item.script);
    //       // console.log(`execScript : ` + execScript);
    //       console.log(`execScript : ${execScript}`);
    //       var response = executeScript(tabId, execScript);
    //       localStorage.setItem('curKey', key);
    //     }
    //   }
    //   if (matchedRegPatts) {
    //     setIcon(`set`, matchedRegPatts.slice(1));
    //     // dispFloatBox(matchedRegPatts, tabId);
        
    //     // var execScript = localStorage.getItem('dispMatchedRegPattsCode');
    //     // var matchedKeys = matchedRegPatts.split(/\r\n|\r|\n/)
    //     //   .reduce((acc, val, idx) => acc += (idx % 2 == 1) ? `\n` + val: ``).slice(1);
    //     // execScript = execScript.replace(/\*\*matchedRegPatts\*\*/, matchedKeys);
    //     // var response = executeScript(tabId, execScript);
    //   }
    // }

  })
}

// function dispFloatBox(matchedRegPatts, tabId) {
//   var matchedKeys = matchedRegPatts.split(/\r\n|\r|\n/)
//     .reduce((acc, val, idx) => acc += (idx % 2 == 1) ? `\n` + val: ``).slice(1);
//   execScript = dispMatchedRegPattsCode.replace(/\*\*matchedRegPatts\*\*/, matchedKeys);
//   var response = executeScript(tabId, execScript);
// }

function checkUrlMatched(url, urlPatterns) {
  for (pattern of urlPatterns.split(/\r\n|\r|\n/)) {
    if (RegExp(pattern.slice(1,-1)).test(url)) {
      return pattern;
    }
  }
  return ``;
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
    (response) => {
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
name : systemDataKey,
regPattForURL : 
`/^file:\\/\\/\\//
/^https:\\/\\/bitbucket\.org\\//
/^chrome.+$/
/^.+(docs|translate|calendar|mail)\\.google.+$/
/^.+github.+$/
/^.+amazon.+$/
/^.+rakuten.+$/`,
script :
`// The part enclosed in ** is replaced.
(window.onload = () => {
function onScroll() {
  document.addEventListener('scroll', () => {
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    let scrollTop =
      document.documentElement.scrollTop || // IE、Firefox、Opera
      document.body.scrollTop;              // Chrome、Safari
      console.log(parseInt(scrollHeight - window.innerHeight - scrollTop));
    if (parseInt(scrollHeight - window.innerHeight - scrollTop) < 10) {
      scriptAtBottom();
    };
  });
}

function dispPosition() {
  let a=document.createElement("div");
  a.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:silver;padding:10px;text-align:center;z-index:19999;";
  a.onclick = () => {
    document.body.removeEventListener("mousemove", dispPosition);
    a.parentNode.removeChild(a);
  };
  a.style.fontSize = '12px';
  x=document.createElement("input");
  x.type="text";
  x.size="3"
  x.id="xxx";
  y=document.createElement("input");
  y.type="text";
  y.size="3"
  y.id="yyy";
  a.appendChild(x);
  a.appendChild(y);
  document.body.appendChild(a);

  document.body.addEventListener("mousemove", dispPosition);
  function dispPosition(e){
    document.getElementById("xxx").value = "x : " + e.clientX;
    document.getElementById("yyy").value = "y : " + e.clientY;
  };

}

function floatBox_to(text) {

  var mbox=document.createElement("div");
  mbox.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:10px;text-align:center;z-index:19999;";
  mbox.style.opacity = '0.8';
  mbox.style.background = 'silver';
  mbox.style.border = '1px solid #aaa';
  mbox.style.fontSize = '20px';
  text.split(/\\r\\n|\\r|\\n/).forEach(element => {
    mbox.appendChild(document.createTextNode(element));
    mbox.appendChild(document.createElement('br'));
    mbox.appendChild(document.createElement('br'));
  });
  document.body.appendChild(mbox);

  /* setTimeout(closenode, 1500);
    function closenode() {mbox.parentNode.removeChild(mbox);}*/

  setTimeout(() =>{mbox.parentNode.removeChild(mbox);}, 1000);

}

function curclepoint(x, y) {
  //x-=10;y-=10;
  let cp=document.createElement("div");
  cp.style.cssText="position:fixed;top:"+ y +"px;left:"+ x +"px;width: 20px;height:20px;border-radius:50%;background-color:#f00;";
  document.body.appendChild(cp);
  setTimeout(() =>{cp.parentNode.removeChild(cp);}, 2000)
}

const regPattForURL = **regular expression pattern for url matching**;
console.log(location.href.match(regPattForURL));
const matchedPartInURL = location.href.match(regPattForURL)[0];
**script**
//floatBox_to("**name**");
})();`
}
];

  localStorage.clear();
  localStorage.setItem('systemDataKey', systemDataKey);
  localStorage.setItem('curKey', systemDataKey);

  for (let i = 0; i < arr.length; i++) {
    var obj = {[arr[i].name]: {regPattForURL: arr[i].regPattForURL, script: arr[i].script/*, match: ``*/}};
    chrome.storage.sync.set(obj, () => {});
  }
  chrome.storage.sync.get(null, data => { console.info(data) });
}
