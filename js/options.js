window.onload = function () {
  // let month = document.getElementById('month');
  // document.createElement('option')
  // for(let i = 1; i <= 12; i++){
  //   let option = document.createElement('option');
  //   option.setAttribute('value', i);
  //   option.innerHTML = i + '月';
  //   month.appendChild(option);
  // };

  chrome.storage.sync.get(null, function(items) {
    var keys = Object.keys(items);
    const SelectItem = document.getElementById('Select');

    for (var i in keys) {
      srckey = keys[i];
      console.log(i, srckey));
      if (srckey == `current`) {
        document.getElementById("cur_js").value = items[srckey];
      }
      else{
        const option = document.createElement('option');
        option.setAttribute('value', srckey);
        option.innerHTML = '<xmp>' + srckey.slice(1) + '</xmp>';
        SelectItem.appendChild(option);
      }
    }
  });

  document.getElementById('Select').addEventListener('change', OnSelectMenuChange);
  document.getElementById('Save').addEventListener('click', OnSaveButtonClick);
  document.getElementById('Remove').addEventListener('click', OnRemoveButtonClick);
}

// 現在有効のjstextのkeyは、`current`とし、登録用のkeyは１文字目がキーボード入力が不可能なchr(6)とした。
// それにより、現在有効とそれ以外を区別する。
function saveCurrentjstext(jstext){
  chrome.storage.sync.set({[`current`]: jstext}, function () {});
}

// slice(1)は、先頭のchr(6)を削除するために必要。
function savejstext(jstext){
  console.log(jstext);
  var jstitle = jstext.slice(1).split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[jstitle]: jstext}, function () {});
}

function OnSelectMenuChange() {
  ret = sendCommand("Change");
  if (ret == 0) {return;}
}

function OnSaveButtonClick() {
  var jstext = document.getElementById("cur_js").value;
  if (!jstext) {
    alert("No Scripts!");
    return 0;
  }
  saveCurrentjstext(jstext);
  savejstext(jstext);
  // console.log("saved '"+ srckey + "'");
  // alert("OnSaveButtonClick");
  // ret = sendCommand("Save");
  // if (ret == 0) {return;}
}

function OnRemoveButtonClick() {
  // alert("OnSaveButtonClick");
  ret = sendCommand("Remove");
  if (ret == 0) {return;}
}

function savejstext(jstext){
  console.log(jstext);
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[jstitle]: jstext}, function () {});
  // chrome.storage.sync.get([jstitle], function(items) {
  //   console.log("get: " + items[jstitle]);
  // });
}
/*// options.html からの指示を受け取る
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {

  var srcCommand = request.command
  var srcValue = request.jstext;
  var srckey = srcValue.split(/\r\n|\r|\n/)[0];

  if (srcCommand == "Change") {
    savejstext(String.fromCharCode(6)+`\n` + srcValue);
    console.log("set curent : '"+ srckey + "'");
  }

  if (srcCommand == "Save") {
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

})*/

function sendCommand(command) {

  var jstext = document.getElementById("cur_js").value;
  if (!jstext) {
    alert("No Scripts!");
    return 0;
  }

  chrome.runtime.sendMessage({command: [command], jstext: [jstext]},
    function (response) {
      var ret = response.allvalue;
      console.log(ret);
    }
  );
  return ret;
}