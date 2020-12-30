const splitter = String.fromCharCode(189);
const excludedURLsName = ` Regular expression pattern for excluded URLs`;

window.onload = function () {
  // console.log(excludedURLsName);
  chrome.storage.sync.get(null, function(items) {
    var keys = Object.keys(items);
    console.log(keys);
    // When there is no element other than the current element, the remove button is disabled
    // const select = document.getElementById("select");
    // select.disabled = nodata;
    // const button = document.getElementById("remove");
    // button.disabled = nodata;

    // make items of listbox
    var SelectItem = document.getElementById('select');
    // var curvalue = items[excludedURLsName]; //curvalue format is key format
    for (var i = 0; i < keys.length; i++) {
      // console.log(keys[i]);
      // srckey = keys[key];
      var option = document.createElement('option');
      option.setAttribute('value', keys[i]);
      option.innerHTML = '<xmp>' + keys[i] + '</xmp>';
      // if (keys[i] == excludedURLsName) {
      //   option.setAttribute('selected', keys[i]);
      // }
      SelectItem.appendChild(option);
    }
    SelectItem.value = excludedURLsName;
    // SelectItem.setAttribute('selected', excludedURLsName);

    // Paste current jstext
    onSellectMenuChange();
    document.getElementById('select').addEventListener('change', onSellectMenuChange);
    document.getElementById('save').addEventListener('click', onSaveButtonClick);
    document.getElementById('remove').addEventListener('click', onRemoveButtonClick);

  });

};


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
    var item = items[SelectItem.value];
    console.log("item : "+item);
    const name = document.getElementById('name');
    name.value = SelectItem.value;
    const regPattUrl = document.getElementById('regPattUrl');
    regPattUrl.value = item.regPattUrl.replace(/\\/g, '\\$&');
    console.log("item.regPattUrl : "+item.regPattUrl);
    const script = document.getElementById('script');
    script.value = item.script.replace(/\\/g, '\\$&');
    console.log("item.script : "+item.script);

    // var jstitle = SelectItem.value;
    // var jstext = items[jstitle];

    // saveCurrentjstext(jstext);
    // console.log("select '" + jstitle + "'");
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
        for (var j = i + 1; i < keys.length; i++) {
          var nextcurtext = ((nextcurtext == undefined) && (keys[j] != curkey)) ? items[keys[j]] : nextcurtext;
        }
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