// const curkey = String.fromCharCode(189);
const systemDataKey =  localStorage.getItem('systemDataKey');

const status = localStorage.getItem('status');
if (status == 'import') {
  localStorage.setItem('status', '');
  window.onload = () =>{
    const SelectItem = document.getElementById('select');
    for (let str of ['', '&emsp;** import mode **', ' ', `&emsp;enter export data in the 'script' area.`]) {
      var option = document.createElement('option');
      option.setAttribute('value', str);
      option.innerHTML = str;
      SelectItem.appendChild(option);
    }
    document.getElementById('name').disabled = true;
    document.getElementById('regPattForURL').disabled = true;

    for (let id of ["new", "save", "If", "remove", "ConvRegExp"]) {
      document.getElementById(id).style.visibility = 'hidden';
    }

    document.getElementById('import').innerHTML = 'ok';
    document.getElementById('export').innerHTML = 'cancel';
    document.getElementById('import').addEventListener('click', onImportOkButtonClick);
    document.getElementById('export').addEventListener('click', () => {});

    document.getElementById('script').focus();

  };

  function onImportOkButtonClick () {
    chrome.storage.sync.clear();
    const arr = document.getElementById('script').value.split(/name:\n/);
    for (let item of arr) {
      if (item != '') {
        let itemarr = item.split(/regPattForURL:\n/);
        let name = itemarr[0].trim();
        if (name == '') {name = systemDataKey;}
        let itemarr1 = itemarr[1].split(/script:\n/)
        let regPattForURL = itemarr1[0].trim();
        let script = itemarr1[1].trim();

        var obj = {[name]: {regPattForURL: regPattForURL, script: script, match: ``}};
        chrome.storage.sync.set(obj, function () {});
      }
    }
  }

} else {
  chrome.storage.sync.get(null, function(items) {
    // console.log(JSON.stringify(items));
    const keys = Object.keys(items);
    // console.log(keys);
    // make items of listbox
    const SelectItem = document.getElementById('select');
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      var option = document.createElement('option');
      option.setAttribute('value', key);
      option.innerHTML = '<xmp>' + key + '</xmp>';
      SelectItem.appendChild(option);
    }
    SelectItem.value = localStorage.getItem('curkey');
  
    onSellectMenuChange();
    document.getElementById('select').addEventListener('change', onSellectMenuChange);
    document.getElementById('new').addEventListener('click', onNewButtonClick);
    document.getElementById('save').addEventListener('click', onSaveButtonClick);
    document.getElementById('remove').addEventListener('click', onRemoveButtonClick);
    document.getElementById('ConvRegExp').addEventListener('click', onConvRegExpButtonClick);
    document.getElementById('import').addEventListener('click', onImportButtonClick);
    document.getElementById('export').addEventListener('click', onExportButtonClick);
  
  });
}

// From here, single function processing for each button
function onSellectMenuChange() {
  chrome.storage.sync.get(null, function(items) {
    // var keys = Object.keys(items);
    const curkey = document.getElementById('select').value;
    console.log('curkey : ' + curkey);
    if (curkey.length > 0) {
      const curitem = items[curkey];
      document.getElementById('name').value = curkey;
      document.getElementById('regPattForURL').value = curitem.regPattForURL/*.replace(/\\/g, '\\$&')*/;
      document.getElementById('script').value = curitem.script/*.replace(/\\/g, '\\$&')*/;
      localStorage.setItem('curkey', curkey);
      console.log("set current '" + curkey + "'");
    }

    const isSystemData = (curkey == systemDataKey);
    document.getElementById('name').disabled = isSystemData;
    document.getElementById('remove').disabled = isSystemData;
    // document.getElementById("import").disabled = !(isSystemData);
    // document.getElementById("export").disabled = !(isSystemData);

  });

}

function onNewButtonClick() {
  localStorage.setItem('curkey', '');
  
  document.getElementById('name').disabled = false;
  document.getElementById('remove').disabled = true;

}

function onSaveButtonClick() {
  let namevalue = document.getElementById('name').value;
  if (namevalue.length == 0) {namevalue = new Date().toLocaleString();};
  const regPattForURLvalue = document.getElementById('regPattForURL').value;
  const scriptvalue = document.getElementById('script').value;
  const obj = {[namevalue.trim()]: {regPattForURL: regPattForURLvalue.trim(), script: scriptvalue.trim()}};
  chrome.storage.sync.set(obj, function () {console.log("saved '" + namevalue + "'")});
  localStorage.setItem('curkey', namevalue);
  console.log("set current '" + namevalue + "'");

}

function onRemoveButtonClick() {
  const namevalue = document.getElementById('name').value;
  chrome.storage.sync.remove(namevalue, function() {console.log("removed '" + namevalue + "'");});
  localStorage.setItem('curkey', systemDataKey);
  console.log("set current '" + systemDataKey + "'");

}

function onConvRegExpButtonClick() {
  let regPattForURL = document.getElementById('regPattForURL');
  var regPattForURLarr = regPattForURL.value.split(/\r\n|\r|\n/);
  var sourceURL = regPattForURLarr[0];
  var targetURL = convURLtoRegExp(sourceURL);
  regPattForURL.value = targetURL + regPattForURL.value;
  onSaveButtonClick();

}

function convURLtoRegExp(sourceURL) {
  if (/^\/\^/.test(sourceURL)) {return ''}

  for (let singlestring of [...`\'".*+?^$-|/{}()[]`]) {
    // console.log(singlestring, new RegExp('\\' + singlestring, "g") , '\\' + singlestring);
    sourceURL = sourceURL.replace(new RegExp('\\' + singlestring, "g") , '\\' + singlestring);
  }

  for (let parts of sourceURL.split(/\D/)) {
    if (parts.length > 3) {
      sourceURL = sourceURL.replace(parts, `\\d\{` + parts.length + `\}`);
    }
  }

  return '/^' + sourceURL + '/\r';

}

function onImportButtonClick() {
    localStorage.setItem('status', 'import');

};

function onExportButtonClick() {
  const namevalue = document.getElementById('name').value;
  const regPattForURLvalue = document.getElementById('regPattForURL').value;
  const scriptvalue = document.getElementById('script').value;

  chrome.storage.sync.get(null, function(items) {
    const keys = Object.keys(items);
    // console.log(keys);
    // make items of listbox
    let text = "";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let item = items[key];
      if (isContainedReservedWord(key + `\n` + item.regPattForURL + `\n` + item.script, [`name:`, `regPattForURL:`, `script:`])) {return;}
      if (key != systemDataKey) {
        text += "\nname:\n" + key;
      }
      text += "\nregPattForURL:\n" + item.regPattForURL;//.replace(/\\/g, /\\\\/);
      text += "\nscript:\n" + item.script;//.replace(/\\/g, /\\\\/);
    }
    text = text.slice(1);
    
    // alert(JSON.parse(JSON.stringify(items)));
    // let blob = new Blob([JSON.stringify(items).replace(/\\/g, '\\\\')],{type:"text/plain"});
    let blob = new Blob([text],{type:"text/plain"});
    // let blob = new Blob([items],{type:"application/octet-stream"});
    // console.log("blob : " + blob);

    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    // link.setAttribute('href', 'data:.json;charset=utf-8,');

    link.download = "export.txt";
    link.click();
    // let obj = JSON.parse(JSON.stringify(items));
    // alert(obj);
  });

}

function isContainedReservedWord(MultipleLine, reservedWordarr) {
  for (line of MultipleLine.split(/\r\n|\r|\n/)) {
    for (reservedWord of reservedWordarr) {
      if (line == reservedWord) {
        alert(`Contains reserved words "` + reservedWord + `"`);
        return true;
      }
    }
  }
  return false;

}
