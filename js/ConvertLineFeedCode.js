function ConvertLineFeedCode(orgString) {
  let inValue = false;
  let retString = ``;
  const orgArr = [...orgString];
  for (let i = 0; i < orgArr.length; i++) {
    orgChr = orgArr[i];
    if (orgChr == `"`) {inValue =!inValue;}
    else if ((inValue) && (orgChr == `\n`)) {orgChr = `\\n`}
    retString += orgChr;
  }
  return retString;
}


function replacer(key, value) {
  return (typeof value == `string`) ? value.split("\n").join("\\n") : value;
}