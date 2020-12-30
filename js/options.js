const curkey = String.fromCharCode(189);
const excludedURLsName = `"Regular expression pattern for excluded URLs"`;

window.onload = function () {
  // console.log(excludedURLsName);
  chrome.storage.sync.get(null, function(items) {
    const keys = Object.keys(items);
    console.log(keys);
    // make items of listbox
    const SelectItem = document.getElementById('select');
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key == curkey) {
        var curvalue = items[key];
      } else {
        var option = document.createElement('option');
        option.setAttribute('value', key);
        option.innerHTML = '<xmp>' + key + '</xmp>';
        SelectItem.appendChild(option);
      }
    }
    SelectItem.value = curvalue;

    onSellectMenuChange();
    document.getElementById('select').addEventListener('change', onSellectMenuChange);
    document.getElementById('save').addEventListener('click', onSaveButtonClick);
    document.getElementById('remove').addEventListener('click', onRemoveButtonClick);

  });

};


// 現在有効のjstextの key : value は、String.fromCharCode(189) : jstitleとした。
// function saveCurrentjstext(jstext){
//   var jstitle = jstext.split(/\r\n|\r|\n/)[0];
//   chrome.storage.sync.set({[curkey]: jstitle}, function () {});
//   console.log("save as current '" + jstitle + "'");
//   if (jstext.split(/\r\n|\r|\n/)[1] != undefined) {
//     chrome.storage.sync.set({[jstitle]: jstext}, function () {});
//     console.log("save '" + jstitle + "'");
//     var SelectItem = document.getElementById('select');
//     SelectItem.value = jstitle;
//     var textarea = document.getElementById('cur_js');
//     textarea.value = jstext;
//   }
// }

// function savejstext(jstext){
//   var jstitle = jstext.split(/\r\n|\r|\n/)[0];
//   chrome.storage.sync.set({[jstitle]: jstext}, function () {});
//   console.log("save '" + jstitle + "'");
// }

// From here, single function processing for each button
function onSellectMenuChange() {
  chrome.storage.sync.get(null, function(items) {
    // var keys = Object.keys(items);
    const SelectItem = document.getElementById('select');
    const curvalue = SelectItem.value;
    const curitem = items[curvalue];
    console.log("item : " + curitem);
    const name = document.getElementById('name');
    name.value = curvalue;
    const regPattUrl = document.getElementById('regPattUrl');
    regPattUrl.value = curitem.regPattUrl/*.replace(/\\/g, '\\$&')*/;
    console.log("item.regPattUrl : "+curitem.regPattUrl);
    const script = document.getElementById('script');
    script.value = curitem.script/*.replace(/\\/g, '\\$&')*/;
    console.log("item.script : " + curitem.script);

    chrome.storage.sync.set({[curkey]: curvalue}, function () {console.log("set current '" + curvalue + "'")});

    document.getElementById("remove").disabled = (curvalue == excludedURLsName);

  });
}

function onSaveButtonClick() {
  const name = document.getElementById('name');
  const namevalue = name.value;
  const regPattUrl = document.getElementById('regPattUrl');
  const script = document.getElementById('script');
  const json = {[namevalue]: {regPattUrl: regPattUrl.value, script: script.value}};
  chrome.storage.sync.set(json, function () {console.log("saved '" + namevalue + "'")});
  chrome.storage.sync.set({[curkey]: namevalue}, function () {console.log("set current '" + namevalue + "'")});

}

function onRemoveButtonClick() {
  const name = document.getElementById('name');
  const namevalue = name.value;
  chrome.storage.sync.remove(namevalue, function() {console.log("removed '" + namevalue + "'");});
  chrome.storage.sync.set({[curkey]: excludedURLsName}, function () {console.log("set current '" + excludedURLsName + "'")});
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