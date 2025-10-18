var websitesObject;

var largeArrayD = [];
var largeArrayO = [];
var counterD = 1;
var counterO = 1;
var maxD = 0;
var maxO = 0;
var endD = 0;
var endO = 0;

// Call to function with anonymous callback
function initWebsites() {
  Utils.loadJSON("sajtovi.json", function (response) {
    websitesObject = JSON.parse(response);
    for (i in websitesObject.web_dizajn) {
      largeArrayD.push(
        new Array(
          websitesObject.web_dizajn[i].slika,
          websitesObject.web_dizajn[i].link
        )
      );
      maxD++;
    }
    for (i in websitesObject.opšte) {
      largeArrayO.push(
        new Array(websitesObject.opšte[i].slika, websitesObject.opšte[i].link)
      );
      maxO++;
    }
  });
}

initWebsites();

window.onload = start;

function start() {
  dChangeToRight();
  oChangeToRight();
}

// Functions for listing
function dChangeToRight() {
  counterD++;
  var imageD = document.getElementById("srednjiD");
  if (counterD <= maxD) endD = counterD;
  else endD = counterD = 1;

  imageD.style.background =
    "-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) " +
    '30%,rgba(255,255,255,1) 70%), url("' +
    largeArrayD[endD - 1][0] +
    '")';
  imageD.style.backgroundSize = "cover";
  imageD.href = largeArrayD[endD - 1][1];
}

function dChangeToLeft() {
  counterD--;
  var imageD = document.getElementById("srednjiD");
  if (counterD >= 1) endD = counterD;
  else endD = counterD = maxD;

  imageD.style.background =
    "-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) " +
    '30%,rgba(255,255,255,1) 70%), url("' +
    largeArrayD[endD - 1][0] +
    '")';
  imageD.style.backgroundSize = "cover";
  imageD.href = largeArrayD[endD - 1][1];
}

function oChangeToRight() {
  counterO++;
  var imageO = document.getElementById("srednjiO");
  if (counterO <= maxO) endO = counterO;
  else endO = counterO = 1;

  imageO.style.background =
    "-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) " +
    '30%,rgba(255,255,255,1) 70%), url("' +
    largeArrayO[endO - 1][0] +
    '")';
  imageO.style.backgroundSize = "cover";
  imageO.href = largeArrayO[endO - 1][1];
}

function oChangeToLeft() {
  counterO--;
  var imageO = document.getElementById("srednjiO");
  if (counterO >= 1) endO = counterO;
  else endO = counterO = maxO;

  imageO.style.background =
    "-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) " +
    '30%,rgba(255,255,255,1) 70%), url("' +
    largeArrayO[endO - 1][0] +
    '")';
  imageO.style.backgroundSize = "cover";
  imageO.href = largeArrayO[endO - 1][1];
}
