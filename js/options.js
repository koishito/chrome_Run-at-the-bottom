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
  document.getElementById('save').addEventListener('click', onSaveButtonClick);
  document.getElementById('remove').addEventListener('click', onRemoveButtonClick);
  document.getElementById('ConvRegExp').addEventListener('click', onConvRegExpButtonClick);

});

// From here, single function processing for each button
function onSellectMenuChange() {
  chrome.storage.sync.get(null, function(items) {
    // var keys = Object.keys(items);
    const curkey = document.getElementById('select').value;
    const curitem = items[curkey];
    document.getElementById('name').value = curkey;
    document.getElementById('regPattForURL').value = curitem.regPattForURL/*.replace(/\\/g, '\\$&')*/;
    document.getElementById('script').value = curitem.script/*.replace(/\\/g, '\\$&')*/;
    localStorage.setItem('curkey', curkey);
    console.log("set current '" + curkey + "'");

    const isSystemData = (curkey == systemDataKey);
    document.getElementById("name").disabled = isSystemData;
    document.getElementById("remove").disabled = isSystemData;

  });

}

function onSaveButtonClick() {
  const namevalue = document.getElementById('name').value;
  const regPattForURLvalue = document.getElementById('regPattForURL').value;
  const scriptvalue = document.getElementById('script').value;
  const json = {[namevalue]: {regPattForURL: regPattForURLvalue, script: scriptvalue}};
  chrome.storage.sync.set(json, function () {console.log("saved '" + namevalue + "'")});
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
  const regPattForURL = document.getElementById('regPattForURL');
  var regPattForURLarr = regPattForURL.value.split(/\r\n|\r|\n/);
  var sourceURL = regPattForURLarr[regPattForURLarr.length - 1];
  var targetURL = convURLtoRegExp(sourceURL);
  regPattForURL.value += `\n` + targetURL;
  onSaveButtonClick();
}

function convURLtoRegExp(sourceURL) {
  /* var sourceURL = `https://www.suruga-ya.jp/pcmypage/action_favorite_list/detail/68366?page=1`;*/
  var targetURL = sourceURL.match(/^https?:\/\/([\w-]+\.)([\w-]+\.)([\w-]+\/)/)[0];
  sourceURL = sourceURL.replace(targetURL, ``);
  targetURL = '/^' + targetURL.replace(/\//g,'\\\/');
  
  while (sourceURL) {
    var alf = sourceURL.match(/^[A-Za-z_]+/);
    var num = sourceURL.match(/^\d+/);
    var zen = sourceURL.match(/\x01-\x7E/);
    var sym = sourceURL.match(/^[\.\+\*\?\|\\\/\[\]\{\}\(\)=&%]/);
    if (alf) {
      targetURL += '[\\u\\l]{' + alf[0].length  +'}';
      sourceURL = sourceURL.replace(alf[0], ``);
    }
    if (num) {
      targetURL += '\\d{' + num[0].length  +'}';
      sourceURL = sourceURL.replace(num[0], ``);
    }
    if (zen) {
      targetURL += zen[0];
      sourceURL = sourceURL.replace(zen[0], ``);
    }
    if (sym) {
      targetURL += '\\' + sourceURL[0];
      sourceURL = (sourceURL.length > 1) ? sourceURL.slice(1) : '';
    }
    if ((!alf) && (!num) && (!zen) && (!sym)) {break;}
    // console.log(targetURL+' '+sourceURL);
  }
  targetURL += '/'
  console.log(targetURL+' '+sourceURL);
  return targetURL;

}