// const curKey = String.fromCharCode(189);
const systemDataKey = localStorage.getItem('systemDataKey');
const reDrow = () => window.location.reload();
if (systemDataKey == null) {initialLoad();}
// const QuotationMark = `\b` //String.fromCharCode(8);
var itemsOnMemory;

chrome.storage.sync.get(null, items => {
  itemsOnMemory = items;
  const keys = Object.keys(items);
  // make items of listbox
  const selectItem = document.getElementById('select');
  keys.forEach(key => {
    let option = document.createElement('option');
    option.setAttribute('value', key);
    option.innerHTML = '<xmp>' + key + '</xmp>';
    selectItem.appendChild(option);
  });
  const curKey = localStorage.getItem('curKey');
  selectItem.value = curKey;

  // document.getElementById("expand-toggle").addEventListener('change', onModeButtonClick);
  selectItem.addEventListener('change', onSellectMenuChange);
  const nameItem = document.getElementById('name');
  nameItem.addEventListener("input", (e) => {
    if (e.inputType === `insertLineBreak`) {nameItem.value = nameItem.value.trim();}
  }, false);
  document.getElementById('new').addEventListener('click', onNewButtonClick);
  // document.getElementById('save').addEventListener('click', onSaveButtonClick);
  document.getElementById('remove').addEventListener('click', onRemoveButtonClick);
  document.getElementById('ConvRegExp').addEventListener('click', onConvRegExpButtonClick);

  document.getElementById('import').addEventListener('change', onImportInputChange);
  document.getElementById('export').addEventListener('click', onExportButtonClick);

  if (!localStorage.getItem('curFocusId')) {localStorage.setItem('curFocusId', `name`);}

  const formElement = document.getElementById('form');

  formElement.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    onSaveButtonClick();

  });

  formElement.addEventListener('focusin', (event) => {
    event.target.style.background = 'honeydew';
    const focusId = document.activeElement.id;
    const oldFocusId = localStorage.getItem('curFocusId');
    const isRecordingTargetId = /^(select|name|regPattForURL|script)$/.test(focusId);
    console.log(`focus in : "${focusId}"`, isRecordingTargetId);
    if (isRecordingTargetId) {
      localStorage.setItem('curFocusId', focusId);
      document.getElementById(focusId).focus();
    } else {
      document.getElementById(oldFocusId).focus();
    }

  });
  
  onSellectMenuChange();

});

// function onModeButtonClick() {
//   if (!document.getElementById("expand-toggle").checked) {reDrow();}
//   // else {document.getElementById(`scripts`).focus();}
// }

// From here, single function processing for each button
function onSellectMenuChange() {
  chrome.storage.sync.get(null, items => {
    // var keys = Object.keys(items);
    const curKey = document.getElementById('select').value;
    console.log(`curKey : "${curKey}"`);
    if (curKey.length > 0) {
      const curItem = items[curKey];
      document.getElementById('name').value = curKey;
      document.getElementById('regPattForURL').value = curItem.regPattForURL;
      document.getElementById('script').value = curItem.script;
      localStorage.setItem('curKey', curKey);
      console.log(`Selected : set current "${curKey}"`);
    }

    const isSystemData = (curKey == systemDataKey);
    document.getElementById('name').disabled = isSystemData;
    document.getElementById('remove').disabled = isSystemData;
    const curFocusId = localStorage.getItem('curFocusId');
    document.getElementById((isSystemData && curFocusId == `name`) ? `script` : curFocusId).focus();

  });

}

function onNewButtonClick() {
  localStorage.setItem('curKey', '');
  localStorage.setItem('curFocusId', `name`);
  document.getElementById('remove').disabled = true;

}

function onSaveButtonClick() {
  const slelctValue = document.getElementById('select').value;
  let nameValue = document.getElementById('name').value;
  // if (document.getElementById('select').value) {onRemoveButtonClick();}
  const isNoName = (nameValue.length == 0);
  if (isNoName) {nameValue = new Date().toLocaleString();}
  else {onRemoveButtonClick();}
  // if (/\"/g.test(nameValue)) {nameValue = nameValue.replace(/\"/g,`'`);};
  const regPattForURLvalue = document.getElementById('regPattForURL').value;
  const scriptvalue = document.getElementById('script').value;
  const obj = {[nameValue.trim()]: {regPattForURL: regPattForURLvalue.trim(), script: scriptvalue.trim(), match: ``}};
  chrome.storage.sync.set(obj, () => {console.log(`saved "${nameValue}"`)});
  localStorage.setItem('curKey', nameValue);
  console.log(`saved : set current "${nameValue}"`);
  if (slelctValue != nameValue) {reDrow();}

}

function onRemoveButtonClick() {
  const selectvalue = document.getElementById('select').value;
  chrome.storage.sync.remove(selectvalue, () => {console.log(`removed "${selectvalue}"`);});
  localStorage.setItem('curKey', systemDataKey);
  console.log(`Removed : set current "${systemDataKey}"`);

}

function onConvRegExpButtonClick() {
  const regPattForURL = document.getElementById('regPattForURL');
  const regPattForURLarr = regPattForURL.value.split(/\r\n|\r|\n/);
  const sourceURL = regPattForURLarr[0];
  if (/^\//.test(sourceURL)) {return;}
  const targetURL = convURLtoRegExp(sourceURL);
  regPattForURL.value = regPattForURL.value.replace(sourceURL, targetURL);
  onSaveButtonClick();

}

function convURLtoRegExp(sourceURL) {
  for (let singlestring of [...`\'".*+?^$-|/{}()[]`]) {
    sourceURL = sourceURL.replace(new RegExp(`\\${singlestring}`, "g") , `\\${singlestring}`);
  }

  for (let parts of sourceURL.split(/\D/)) {
    if (parts.length > 3) {
      sourceURL = sourceURL.replace(parts, `\\d\{${parts.length}\}`);
    }
  }

  return `/^${sourceURL}/\r`;

}

function onImportInputChange (event) {
  // var obj = document.activeElement;
  // obj.nextElementSibling.focus();
  const input = event.target;
  if (input.files.length == 0) {/*alert('No file selected');*/ return;}

  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    console.log(`onImportInputChange:reader.onload`);
    const scripts = reader.result;
    if (!scripts.includes(systemDataKey.split(String.fromCharCode(1)).join(`\\u0001`))) {alert(`Invalid file.`);return;}
    const obj = JSON.parse(scripts);
    Object.keys(obj).forEach(key => obj[key].update = true);
    chrome.storage.sync.set(obj, () => {});
  
    chrome.storage.sync.get(null, items => {
      Object.keys(items).forEach(key => {
        let item = items[key];
        if (item.update) {
          delete item.update;
        } else {
          chrome.storage.sync.remove(key, () => {console.log(`removed "${key}"`);});
          delete items[key];
          items[`${String.fromCharCode(2)}(added?)${key}`] = item;
          // obj = {[String.fromCharCode(2) + '(added?)' + key]: {regPattForURL: item.regPattForURL, script: item.script}};
        }
      })
      chrome.storage.sync.set(items, () => {});
      localStorage.setItem('curKey', systemDataKey);
      reDrow();
    });
  }
  reader.readAsText(file);

}


// function onReadFileButtonClick (event) {
//   const input = event.target;
//   if (input.files.length == 0) {/*alert('No file selected');*/ return;}

//   const file = input.files[0];
//   const reader = new FileReader();
//   reader.onload = () => {
//     document.getElementById('scripts').innerHTML = reader.result;
//   };
//   reader.readAsText(file);

// }

// function onImportButtonClick () {
//   const scripts = document.getElementById('scripts').value;
//   if (!scripts.includes(systemDataKey.split(String.fromCharCode(1)).join(`\\u0001`))) {alert(`Invalid file.`);return;}
//   // const arr = scripts.split(/name:\n/);
//   if (scripts.length == 0) {return;}
//   // if (scripts.charAt(0) == `{`) {
//   const obj = JSON.parse(scripts);
//   Object.keys(obj).forEach(key => obj[key].update = true);
//   chrome.storage.sync.set(obj, () => {});
//   /*} else {
//     for (let item of arr) {
//       if (item != '') {
//         let itemarr = item.split(`regPattForURL:\n`);
//         let name = itemarr[0].trim();
//         if (name == '') {name = systemDataKey;}
//         let itemarr1 = itemarr[1].split(`script:\n`)
//         let regPattForURL = itemarr1[0].trim();
//         let script = itemarr1[1].trim();

//         var obj = {[name]: {regPattForURL: regPattForURL, script: script, update: 'true'}};
//         chrome.storage.sync.set(obj, () => {});
//       }
//     }
//   }*/

//   chrome.storage.sync.get(null, items => {
//     Object.keys(items).forEach(key => {
//       let item = items[key];
//       if (item.update) {
//         delete item.update;
//       } else {
//         chrome.storage.sync.remove(key, () => {console.log(`removed "${key}"`);});
//         delete items[key];
//         items[`${String.fromCharCode(2)}(added?)${key}`] = item;
//         // obj = {[String.fromCharCode(2) + '(added?)' + key]: {regPattForURL: item.regPattForURL, script: item.script}};
//       }
//     })
//     chrome.storage.sync.set(items, () => {});
//     localStorage.setItem('curKey', systemDataKey);

//   });

// }

function onExportButtonClick() {
  chrome.storage.sync.get(null, items => {
    /*const keys = Object.keys(items);
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
    link.click();*/

    //export json
    const json = JSON.stringify(items, undefined, 4);
    blob = new Blob([json],{type:"text/plain"});
    link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    link.download = "export.json";
    link.click();

  });

}