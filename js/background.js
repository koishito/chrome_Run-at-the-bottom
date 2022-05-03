// const curKey = String.fromCharCode(189);
const c = {black: '\u001b[30m',red: '\u001b[31m',green: '\u001b[32m',yellow: '\u001b[33m',blue: '\u001b[34m',magenta: '\u001b[35m',cyan: '\u001b[36m',white: '\u001b[37m'};
const systemDataKey = `${String.fromCharCode(1)}System data : excluded URLs & Script template${String.fromCharCode(1)}`;
const dispMatchedRegPattsCode = `
(window.onload = function(){
  var text = \`**matchedRegPatts**\`;
  var mbox=document.createElement("div");
  mbox.style.cssText="color:black;font-weight:bold;font-size:30px;background:aquamarine;opacity:0.5;border:20px solid silver;width:70%;"
                    +"position:fixed;top:0%;left:50%;transform:translate(-50%, 0%);padding:50px;text-align:center;z-index:19999;";
  text.split(/\\r\\n|\\r|\\n/).forEach(element => {
    mbox.appendChild(document.createElement('br'));
    mbox.appendChild(document.createTextNode(element));
    mbox.appendChild(document.createElement('br'));
  });
  mbox.appendChild(document.createElement('br'));
  document.body.appendChild(mbox);

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
        localStorage.setItem('curKey', key);
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
    }
  })
}

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
  chrome.browserAction.setTitle({ title: toolTip + `\n` });
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
  const initialObj = {
[systemDataKey]: {
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
  mbox.style.cssText="font-weight:bold;font-size:20px;background:white;opacity:1;border:100px solid silver;"
                    +"position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:10px;text-align:center;z-index:19999;";
  text.split(/\\r\\n|\\r|\\n/).forEach(element => {
    mbox.appendChild(document.createTextNode(element));
    mbox.appendChild(document.createElement('br'));
    mbox.appendChild(document.createElement('br'));
  });
  document.body.appendChild(mbox);

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
};

  localStorage.clear();
  localStorage.setItem('systemDataKey', systemDataKey);
  localStorage.setItem('curKey', systemDataKey);

  chrome.storage.sync.set(initialObj, () => {});
  chrome.storage.sync.get(null, data => { console.info(data) });
}
