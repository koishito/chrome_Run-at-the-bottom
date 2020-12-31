const curkey = String.fromCharCode(189);
const excludedURLsList = `"Regular expression pattern list for excluded URLs"`;
const ScriptTemplate = `"Script template"`;

window.onload = function () {
  // console.log(excludedURLsList);
  chrome.storage.sync.get(null, function(items) {
    const keys = Object.keys(items);
    // console.log(keys);
    // make items of listbox
    const SelectItem = document.getElementById('select');
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key != curkey) {
        var option = document.createElement('option');
        option.setAttribute('value', key);
        option.innerHTML = '<xmp>' + key + '</xmp>';
        SelectItem.appendChild(option);
      }
    }
    SelectItem.value = items[curkey];

    onSellectMenuChange();
    document.getElementById('select').addEventListener('change', onSellectMenuChange);
    document.getElementById('save').addEventListener('click', onSaveButtonClick);
    document.getElementById('remove').addEventListener('click', onRemoveButtonClick);

  });

};

// From here, single function processing for each button
function onSellectMenuChange() {
  chrome.storage.sync.get(null, function(items) {
    // var keys = Object.keys(items);
    const curvalue = document.getElementById('select').value;
    const curitem = items[curvalue];
    document.getElementById('name').value = curvalue;
    document.getElementById('regPattUrl').value = curitem.regPattUrl/*.replace(/\\/g, '\\$&')*/;
    document.getElementById('script').value = curitem.script/*.replace(/\\/g, '\\$&')*/;
    chrome.storage.sync.set({[curkey]: curvalue}, function () {console.log("set current '" + curvalue + "'")});

    const isSystemData = ((curvalue == excludedURLsList) || (curvalue == ScriptTemplate));
    document.getElementById("name").disabled = isSystemData;
    document.getElementById("remove").disabled = isSystemData;

  });
}

function onSaveButtonClick() {
  const namevalue = document.getElementById('name').value;
  const regPattUrlvalue = document.getElementById('regPattUrl').value;
  const scriptvalue = document.getElementById('script').value;
  if (namevalue == curkey) {
    alert("This name cannot be used");
  } else {
    const json = {[namevalue]: {regPattUrl: regPattUrlvalue, script: scriptvalue}};
    chrome.storage.sync.set(json, function () {console.log("saved '" + namevalue + "'")});
    chrome.storage.sync.set({[curkey]: namevalue}, function () {console.log("set current '" + namevalue + "'")});
  }
}

function onRemoveButtonClick() {
  const namevalue = document.getElementById('name').value;
  chrome.storage.sync.remove(namevalue, function() {console.log("removed '" + namevalue + "'");});
  chrome.storage.sync.set({[curkey]: excludedURLsList}, function () {console.log("set current '" + excludedURLsList + "'")});

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

// document.addEventListener('scroll',  function() {
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
//   if(parseInt(scrollHeight - window.innerHeight - document.documentElement.scrollTop) < 1) {
//     alert("bottom");
//   };
// });