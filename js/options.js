// const curkey = String.fromCharCode(189);
const systemDataKey =  localStorage.getItem('systemDataKey');
if (systemDataKey == null) {initialLoad();}
// const QuotationMark = `\b` //String.fromCharCode(8);
var itemsOnMemory;

chrome.storage.sync.get(null, function(items) {
  itemsOnMemory = items;
  const keys = Object.keys(items);
  // make items of listbox
  const SelectItem = document.getElementById('select');
  keys.forEach(key => {
    let option = document.createElement('option');
    option.setAttribute('value', key);
    option.innerHTML = '<xmp>' + key + '</xmp>';
    SelectItem.appendChild(option);
  });
  SelectItem.value = localStorage.getItem('curkey');

  // document.getElementById('scripts').value = createSettingText();

  onSellectMenuChange();
  document.getElementById('select').addEventListener('change', onSellectMenuChange);
  document.getElementById('new').addEventListener('click', onNewButtonClick);
  document.getElementById('save').addEventListener('click', onSaveButtonClick);
  document.getElementById('remove').addEventListener('click', onRemoveButtonClick);
  document.getElementById('ConvRegExp').addEventListener('click', onConvRegExpButtonClick);

  document.getElementById('read_file').addEventListener('change', onReadFileButtonClick);
  document.getElementById('export').addEventListener('click', onExportButtonClick);
  document.getElementById('import').addEventListener('click', onImportButtonClick);
  // document.getElementById('scripts').addEventListener('dblclick', (() => {document.getElementById('scripts').value = createSettingText();}));

});

// redgister initial data
// function initialLoad() {
//   localStorage.clear();
//   localStorage.setItem('systemDataKey', systemDataKey);
//   localStorage.setItem('curkey', systemDataKey);

// }

// From here, single function processing for each button
function onSellectMenuChange() {
  chrome.storage.sync.get(null, function(items) {
    // var keys = Object.keys(items);
    const curkey = document.getElementById('select').value;
    console.log('curkey : ' + curkey);
    if (curkey.length > 0) {
      const curitem = items[curkey];
      document.getElementById('name').value = curkey;
      document.getElementById('regPattForURL').value = curitem.regPattForURL /*.replace(/\\/g, '\\$&')*/;
      document.getElementById('script').value = curitem.script /*.replace(/\\/g, '\\$&')*/;
      localStorage.setItem('curkey', curkey);
      console.log("set current '" + curkey + "'");
    }

    const isSystemData = (curkey == systemDataKey);
    document.getElementById('name').disabled = isSystemData;
    document.getElementById('remove').disabled = isSystemData;

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
  if (/\"/g.test(namevalue)) {namevalue = namevalue.replace(/\"/g,`'`);};
  const regPattForURLvalue = document.getElementById('regPattForURL').value;
  const scriptvalue = document.getElementById('script').value;
  const obj = {[namevalue.trim()]: {regPattForURL: regPattForURLvalue.trim(), script: scriptvalue.trim(), match: ``}};
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
  let regPattForURLarr = regPattForURL.value.split(/\r\n|\r|\n/);
  let sourceURL = regPattForURLarr[0];
  if (/^\//.test(sourceURL)) {return;}
  let targetURL = convURLtoRegExp(sourceURL);
  //regPattForURL.value = targetURL + regPattForURL.value;
  regPattForURL.value = regPattForURL.value.replace(sourceURL, targetURL);
  onSaveButtonClick();

}

function convURLtoRegExp(sourceURL) {
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

function onReadFileButtonClick (evt) {
  let input = evt.target;
  if (input.files.length == 0) {/*alert('No file selected');*/ return;}

  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('scripts').innerHTML = reader.result;
  };
  reader.readAsText(file);
  
}

function onImportButtonClick () {
  // const arr = document.getElementById('scripts').value.split(`\bname:\b\n`);
  // return;

  var obj = {};
  const arr2 = document.getElementById('scripts').value.split(/(name:\n|regPattForURL:\n|script:\n)/);
  for (let i = -1; i < arr2.length; i = i + 6) {
    obj[(arr2[i + 1] == '') ? systemDataKey : arr2[i + 1]] = {regPattForURL: arr2[i + 3].trim(), script: arr2[i + 5].trim(), update: 'true'};
  }

  const arr = document.getElementById('scripts').value.split(/name:\n/);
  // const arr2 = arr.forEach(element=>{element.split(/(regPattForURL:\n|script:\n)/)});;
  // var obj = {};
  // arr//.filter(element => {(element != '')})
  // .forEach(element=>{
  //   let item = element.split(/(regPattForURL:\n|script:\n)/)
  //   let name = item[0].trim();
  //   if (name == '') {name = systemDataKey;}
  //   obj[name] = {regPattForURL: item[1].trim(), script: item[2].trim(), update: 'true'};
  //   // chrome.storage.sync.set(obj, function () {});
  
  // });

  if (arr.length == 0) {return;}
  for (let item of arr) {
    if (item != '') {
      let itemarr = item.split(`regPattForURL:\n`);
      let name = itemarr[0].trim();
      if (name == '') {name = systemDataKey;}
      let itemarr1 = itemarr[1].split(`script:\n`)
      let regPattForURL = itemarr1[0].trim();
      let script = itemarr1[1].trim();

      var obj = {[name]: {regPattForURL: regPattForURL, script: script, update: 'true'}};
      chrome.storage.sync.set(obj, function () {});
    }
  }

  chrome.storage.sync.get(null, function(items) {
    Object.keys(items).forEach(key => {
      let item = items[key];
      if (item.update != 'true') {
        chrome.storage.sync.remove(key, () => {});
        const obj = {['(delete?)' + key]: {regPattForURL: item.regPattForURL, script: item.script}};
        chrome.storage.sync.set(obj, () => {});
      }
    })
  });

}

function onExportButtonClick() {
  // const namevalue = document.getElementById('name').value;
  // const regPattForURLvalue = document.getElementById('regPattForURL').value;
  // const scriptvalue = document.getElementById('script').value;
  // let text = createSettingText();

  chrome.storage.sync.get(null, function(items) {
    const keys = Object.keys(items);
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
    let blob = new Blob([text],{type:"text/plain"});
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    link.download = "export.txt";
    link.click();
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

// function createSettingText() {
//     console.log(itemsOnMemory);
//     let text = "";
//     Object.keys(itemsOnMemory).forEach(key => {
//       let item = itemsOnMemory[key];
//       if (key != systemDataKey) {
//         text += `\n${QuotationMark}name:${QuotationMark}\n` + key;
//       }
//       text += `\n${QuotationMark}regPattForURL:${QuotationMark}\n` + item.regPattForURL;//.replace(/\\/g, /\\\\/);
//       text += `\n${QuotationMark}script:${QuotationMark}\n` + item.script;//.replace(/\\/g, /\\\\/);
//     })
//     return text.slice(1);

// }
