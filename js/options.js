// const curkey = String.fromCharCode(189);
const systemDataKey =  localStorage.getItem('systemDataKey');

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
    document.getElementById("name").disabled = isSystemData;
    document.getElementById("remove").disabled = isSystemData;
    document.getElementById("import").disabled = !(isSystemData);
    document.getElementById("export").disabled = !(isSystemData);

  });

}

function onNewButtonClick() {
  localStorage.setItem('curkey', null);
  
  document.getElementById("name").disabled = false;
  document.getElementById("remove").disabled = true;

}

function onSaveButtonClick() {
  let namevalue = document.getElementById('name').value;
  if (namevalue.length == 0) {namevalue = new Date().toLocaleString();};
  const regPattForURLvalue = document.getElementById('regPattForURL').value;
  const scriptvalue = document.getElementById('script').value;
  const obj = {[namevalue]: {regPattForURL: regPattForURLvalue, script: scriptvalue}};
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
  var sourceURL = regPattForURLarr[regPattForURLarr.length - 1];
  var targetURL = convURLtoRegExp(sourceURL);
  regPattForURL.value += targetURL;
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

  return '\r/^' + sourceURL + '/';

}

function onImportButtonClick() {
  var input = document.createElement('input');
  input.type = 'file';
  input.name="import";
  input.accept=".json";
  input.onchange = e => { 
     var file = e.target.files[0];
  }
  
  input.click();

}

function onExportButtonClick() {
  // let link = document.createElement('a');
  // link.setAttribute('href', 'data:.json;charset=utf-8,' + encodeURIComponent(export));
  // link.setAttribute('download', filename);

  // var input = document.createElement('input');
  // input.type = 'file';
  // input.name="import";
  // input.accept=".json";
  // input.onchange = e => { 
    // var file = e.target.files[0];
    chrome.storage.sync.get(null, function(items) {
      // alert(JSON.parse(JSON.stringify(items)));
      let blob = new Blob([JSON.stringify(items).replace(/\\/g, '\\\\')],{type:"text/plain"});
      console.log("blob : " + blob);

      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      // link.setAttribute('href', 'data:.json;charset=utf-8,');

      link.download = "export.json";
      link.click();
    });
  // }
  // pom.click();

  // input.click();

}