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
    let SelectItem = document.getElementById('Select');
    option = document.createElement('option');

    for (var i in keys) {
      srckey = keys[i];
      let option = document.createElement('option');
      console.log(i, srckey);
      if (srckey.charCodeAt(0) == 6){
        document.getElementById("cur_js").value = items[srckey].replace(srckey + '\n', '');
      }
      else{
        option.setAttribute('value', srckey);
        option.innerHTML = '<xmp>' + srckey + '</xmp>';
        SelectItem.appendChild(option);
      }
    }
  });

  document.getElementById('Select').addEventListener('change', OnSelectMenuChange);
  document.getElementById('Save').addEventListener('click', OnSaveButtonClick);
  document.getElementById('Remove').addEventListener('click', OnRemoveButtonClick);
}

function getStorageItems() {



}

function OnSelectMenuChange() {
  ret = sendCommand("Change");
  if (ret == 0) {return;}
}

function OnSaveButtonClick() {
  // alert("OnSaveButtonClick");
  ret = sendCommand("Save");
  if (ret == 0) {return;}
}

function OnRemoveButtonClick() {
  // alert("OnSaveButtonClick");
  ret = sendCommand("Remove");
  if (ret == 0) {return;}
}

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

