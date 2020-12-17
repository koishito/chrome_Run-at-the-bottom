const curkey = String.fromCharCode(189);

window.onload = function () {

  chrome.storage.sync.get(null, function(items) {
    var keys = Object.keys(items);
    // When there is no element other than the current element, the remove button is disabled
    const select = document.getElementById("select");
    select.disabled = (keys.length == 1) ? true : false;
    const button = document.getElementById("remove");
    button.disabled = (keys.length == 1) ? true : false;

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
        // Paste current jstext
        const textarea = document.getElementById('cur_js');
        textarea.value = items[curvalue];
      }
    }

  });

  document.getElementById('select').addEventListener('change', onSellectMenuChange);
  document.getElementById('save').addEventListener('click', onSaveButtonClick);
  document.getElementById('remove').addEventListener('click', onRemoveButtonClick);

}

// 現在有効のjstextの key : value は、String.fromCharCode(189) : jstitleとした。
function saveCurrentjstext(jstext){
  var jstitle = jstext.split(/\r\n|\r|\n/)[0];
  chrome.storage.sync.set({[curkey]: jstitle}, function () {});
  console.log("save as current '" + jstitle + "'");
  if (jstext.split(/\r\n|\r|\n/)[1] != undefined) {
    chrome.storage.sync.set({[jstitle]: jstext}, function () {});
    console.log("save '" + jstitle + "'");
    var SelectItem = document.getElementById('select');
    SelectItem.value = jstitle;
    var textarea = document.getElementById('cur_js');
    textarea.value = jstext;
  }
}

// function savejstext(jstext){
//   var jstitle = jstext.split(/\r\n|\r|\n/)[0];
//   chrome.storage.sync.set({[jstitle]: jstext}, function () {});
//   console.log("save '" + jstitle + "'");
// }

// From here, single function processing for each button
function onSellectMenuChange() {
  chrome.storage.sync.get(null, function(items) {
    // var keys = Object.keys(items);
    var SelectItem = document.getElementById('select');
    var jstitle = SelectItem.value;
    var jstext = items[jstitle];

    saveCurrentjstext(jstext);
    console.log("select '" + jstitle + "'");
  });
}

function onSaveButtonClick() {
  var textarea = document.getElementById('cur_js');
  var jstext = textarea.value;
  if (!jstext) {
    alert("There is no script.");
  } else {
    // savejstext(jstext);
    saveCurrentjstext(jstext);
  }
}

function onRemoveButtonClick() {
  chrome.storage.sync.get(null, function(items) {
    var SelectItem = document.getElementById('select');
    var jstitle = SelectItem.value;

    var keys = Object.keys(items);
    for (var i = 0; i < keys.length; i++) {
      console.log(nextcurtext);
      if (keys[i] == jstitle) {
        var nextcurtext = ((nextcurtext == undefined) && (i + 1 == keys.length)) ? items[keys[i + 1]] : nextcurtext;
        break;
      }
      var nextcurtext = (keys[i] == curkey) ? nextcurtext : items[keys[i]];
    }
    chrome.storage.sync.remove(jstitle, function() {
    console.log("removed '" + jstitle + "'");
    });
    saveCurrentjstext(nextcurtext);
  });
}

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