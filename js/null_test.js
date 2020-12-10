//目的：キーボード入力不可でかつ、keyとして有効な文字の調査
//chr(189)を採用

var tm = {null : "ABC", nulla : "BCD"};
for (var k in tm) {
  var i=k
  console.log("項目： " + k);
  console.log("内容： " + tm[k]);
};
console.log(k);

var keys = Object.keys(tm);
console.log((keys[0] + "a" == keys[1]));
console.log((keys[0] + "a" == "nulla"));

//test chr(6)
chr6 = string.fromCharCode(6);
chr6a = string.fromCharCode(6) + "a";

var tm = {[chr6] : "ABC", [chr6a] : "BCD"};
for (var k in tm) {
  var i=k
  console.log("項目： " + k);
  console.log("内容： " + tm[k]);
};

// test chr(189)
chr189 = String.fromCharCode(189);
chr189a = String.fromCharCode(189) + "a";

var tm = {[chr189] : "ABC", [chr189a] : "BCD"};
for (var k in tm) {
  var i=k
  console.log("項目： " + k);
  console.log("内容： " + tm[k]);
};

var keys = Object.keys(tm);
console.log((keys[0] + "a" == keys[1]));
