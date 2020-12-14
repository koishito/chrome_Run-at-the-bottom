const curkey = String.fromCharCode(189);

window.onload = function () {

  chrome.storage.sync.get(null, function(items) {
    var keys = Object.keys(items);
    // make items of listbox
    var SelectItem = document.getElementById('select');
    var curvalue = items[curkey]; //curvalue format is key format
    console.log(curkey, curvalue);
    for (var i in keys) {
      srckey = keys[i];
      if (srckey != curkey) {
        var option = document.createElement('option');
        option.setAttribute('value', srckey);
        if (srckey == curvalue) {
        option.setAttribute('selected', srckey);
        }
        option.innerHTML = '<xmp>' + srckey + '</xmp>';
        SelectItem.appendChild(option);
      }
    }
    // Paste current jstext
    const textarea = document.getElementById('cur_js');
    textarea.value = items[curvalue];

  });

  document.getElementById('select').addEventListener('change', {command: 'select', handleEvent: onClick});
  document.getElementById('save').addEventListener('click', {command: 'save', handleEvent: onClick});
  document.getElementById('remove').addEventListener('click', {command: 'remove', handleEvent: onClick});

}

// 現在有効のjstextの key : value は、null : jstitleとした。
function saveCurrentjstext(jstext){
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[curkey]: jstitle}, function () {});
  console.log("save as current '" + jstitle + "'");
  var SelectItem = document.getElementById('select');
  SelectItem.value = jstitle;
}

function savejstext(jstext){
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[jstitle]: jstext}, function () {});
  console.log("save '" + jstitle + "'");
}

function onClick() {
  var command = this.command
  chrome.storage.sync.get(null, function(items) {
    var keys = Object.keys(items);
    var SelectItem = document.getElementById('select');
    var textarea = document.getElementById('cur_js');
    var jstitle = SelectItem.value;

    if (command == 'select') {
      var jstext = items[jstitle];
      textarea.value = jstext;
      saveCurrentjstext(jstext);
      console.log("select '" + jstitle + "'");

    } else if (command == 'save') {
      var jstext = textarea.value;
      if (!jstext) {
        alert("No Scripts!");
      } else {
        savejstext(jstext);
        saveCurrentjstext(jstext);
      }

    } else if (command == 'remove') {
      chrome.storage.sync.remove(jstitle, function() {
        console.log("removed '" + jstitle + "'");
      });
      // current以外の最初の要素をcurrentに設定する
      for (var i in keys) {
        var jstitle = keys[i];
        if (jstitle != curkey) {
          var jstext = items[jstitle];
          saveCurrentjstext(jstext);
          console.log("select '" + jstitle + "'");
          break;
        }
      }
    }
  });
}





// function OnSelectMenuChange() {
//   const SelectItem = document.getElementById('Select');
//   const textarea = document.getElementById('cur_js');
//   textarea.value = items[SelectItem.value];
// ret = sendCommand("Change");
//   if (ret == 0) {return;}
// }

// function OnSaveButtonClick() {
//   alert("OnSaveButtonClick");
//   var jstext = document.getElementById("cur_js").value;
//   if (!jstext) {
//     alert("No Scripts!");
//     return 0;
//   }
//   saveCurrentjstext(jstext);
//   savejstext(jstext);
//   // console.log("saved '"+ srckey + "'");
//   // alert("OnSaveButtonClick");
//   // ret = sendCommand("Save");
//   // if (ret == 0) {return;}
// }

// function OnRemoveButtonClick() {
//   // alert("OnSaveButtonClick");
//   ret = sendCommand("Remove");
//   if (ret == 0) {return;}
// }

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

// function sendCommand(command) {

//   var jstext = document.getElementById("cur_js").value;
//   if (!jstext) {
//     alert("No Scripts!");
//     return 0;
//   }

//   chrome.runtime.sendMessage({command: [command], jstext: [jstext]},
//     function (response) {
//       var ret = response.allvalue;
//       console.log(ret);
//     }
//   );
//   return ret;
// }

document.addEventListener('scroll',  function() {
  const scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  var scrollTop =
  document.documentElement.scrollTop || // IE、Firefox、Opera
  document.body.scrollTop;              // Chrome、Safari

  console.log("scrollHeight : " + scrollHeight);
  console.log("window.innerHeight : " + window.innerHeight);
  console.log("bottom : " + (scrollHeight - window.innerHeight));
  console.log("currrent : " + document.documentElement.scrollTop);
  console.log("Difference : " + parseInt(scrollHeight - window.innerHeight - document.documentElement.scrollTop));
  if(parseInt(scrollHeight - window.innerHeight - document.documentElement.scrollTop) < 1) {
    alert("bottom");
  };
});