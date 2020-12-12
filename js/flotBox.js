var videosrc = document.querySelector("video[src]");
if(videosrc != null){

  var bf = buttonfunc;
  var json = { 
    text1:  "PlayRate : ",
    button075: {text: "0.75", func: buttonfunc, arg: 0.75},
    button100: {text: "1.00", func: buttonfunc, arg: 1},
    button125: {text: "1.25", func: buttonfunc, arg: 1.25},
    button150: {text: "1.50", func: buttonfunc, arg: 1.5},
    button200: {text: "2.00", func: buttonfunc, arg: 2},
    default: defaultfunc
  };


  function buttonfunc(btn){
    btn.stopPropagation();
    console.log(btn.target.value);
    videosrc.playbackRate = btn.target.value;
    clearTimeout(sto);
    sto = setTimeout(closenode, 5000);

  };
  
  function defaultfunc() {
    mbox.parentNode.removeChild(mbox);
  }

  var mbox=document.createElement("div");
  mbox.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:50px;background:silver;border:1px solid #aaa;text-align:center;z-index:19999;";
  /*mbox.style.cssText="margin:auto auto;width:200px;height:200px;padding:10px;background:silver;border:1px solid #aaa;text-align:center;";
  mbox.style.cssText="position:fixed;top:150px;left:0;width:100%25;padding:10px;background:silver;border:1px solid #aaa;text-align:center;z-index:19999;";*/
  mbox.onclick=json["default"];
  
  for (let key in json) {
    if (key.match(/^text.*$/)) {
      var tnode = document.createTextNode(json[key]);
      //tnode.style.cssText="margin:4px;";
      mbox.appendChild(tnode);

    }else if(key.match(/^button.*$/)) {
      btn = document.createElement("button");
      btn.type="button";
      btn.innerHTML=json[key].text;
      btn.style.cssText="margin:4px;";
      btn.value=json[key].arg;
      btn.onclick=json[key].func;
      mbox.appendChild(btn);
    
    }
  }

  mbox.style.fontSize = '14px';
  document.body.appendChild(mbox);
  sto = setTimeout(closenode, 5000);

  function closenode(){mbox.parentNode.removeChild(mbox);}
};
