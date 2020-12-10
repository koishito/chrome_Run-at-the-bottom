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
      console.log(i, srckey);
      if (srckey == String.fromCharCode(189)) {
        var curkey = items[srckey];
      }
    }

    for (var i in keys) {
      srckey = keys[i];
      console.log(i, srckey);
      if (srckey != String.fromCharCode(189)) {
        const option = document.createElement('option');
        option.setAttribute('value', srckey);
        if (srckey == curkey) {
        option.setAttribute('selected', srckey);
        }
        option.innerHTML = '<xmp>' + srckey + '</xmp>';
        SelectItem.appendChild(option);
      }
    }
    SelectItem.value = curkey;
  });

  document.getElementById('Select').addEventListener('change', OnSelectMenuChange);
  document.getElementById('Save').addEventListener('click', OnSaveButtonClick);
  document.getElementById('Remove').addEventListener('click', OnRemoveButtonClick);

}

// 現在有効のjstextの key : value は、null : jstitleとした。
function saveCurrentjstext(jstext){
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[String.fromCharCode(189)]: jstitle}, function () {});
}

function savejstext(jstext){
  // console.log(jstext);
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[jstitle]: jstext}, function () {});
}

function OnSelectMenuChange() {
  ret = sendCommand("Change");
  if (ret == 0) {return;}
}

function OnSaveButtonClick() {
  alert("OnSaveButtonClick");
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

// function savejstext(jstext){
//   console.log(jstext);
//   var jstitle = jstext.split(/\r\n|\r|\n/)[0];
//   chrome.storage.sync.set({[jstitle]: jstext}, function () {});
  // chrome.storage.sync.get([jstitle], function(items) {
  //   console.log("get: " + items[jstitle]);
  // });
// }
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

// windows.addEventListener('scroll',  function() {
//   const scrollHeight = Math.max(
//     document.body.scrollHeight, document.documentElement.scrollHeight,
//     document.body.offsetHeight, document.documentElement.offsetHeight,
//     document.body.clientHeight, document.documentElement.clientHeight
//   );
//   var scrollTop =
//   document.documentElement.scrollTop || // IE、Firefox、Opera
//   document.body.scrollTop;              // Chrome、Safari

//   console.log("scrollHeight : " + scrollHeight);
//   console.log("window.innerHeight : " + window.innerHeight);
//   console.log("bottom : " + (scrollHeight - window.innerHeight));
//   console.log("currrent : " + document.documentElement.scrollTop);
//   console.log("Difference : " + parseInt(scrollHeight - window.innerHeight - document.documentElement.scrollTop));
//   if(parseInt(scrollHeight - window.innerHeight - document.documentElement.scrollTop) == 0) {
//     alert("bottom");
//   };
// });