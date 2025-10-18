window.onload = start;
window.onresize = handleResize;

function start() {
  // canvas();
  // var elList = Array.prototype.slice.call(document.getElementsByClassName('navbar-nav'))
  // elList.forEach(function(item){
  //    	console.log(item);
  // });
  handleResize();
  init();
  // Pre-load projects data (optional callback)
  initProjects(function () {
    // Data loaded successfully
  });
}

var lastScrollTop = 0;
var menuElement;
var profileImage;
var footerElement;

// var c, ctx, ctx1

// function kanvas() {
// 	c = document.getElementById("myCanvas");

// 	ctx = c.getContext("2d");
// 	ctx1 = c.getContext("2d");

// 	// initCanvas();
// }

// function initCanvas() {
// 	window.addEventListener('resize', resizeCanvas, false);
// 	// window.addEventListener('scroll', resizeCanvas, false);
//     resizeCanvas();
// }
// function redraw() {
// 	c = document.getElementById("myCanvas");
// 	var elemStart = document.getElementById('start');
// 	var elemSasa = document.getElementById('sasa');

// 	ctx = c.getContext("2d");
// 	ctx1 = c.getContext("2d");

// 	ctx.beginPath();
// 	ctx.lineWidth = "2";
// 	ctx.strokeStyle = "blue";
// 	ctx.moveTo(parseInt(elemStart.style.left, 10),parseInt(elemStart.style.top, 10));
// 	ctx.lineTo(50, 50);
// 	// ctx.lineTo(parseInt(elemSasa.style.left, 10),parseInt(elemSasa.style.top, 10));
// 	ctx.stroke();

// 	ctx1.beginPath();
// 	ctx1.strokeStyle = "red";
// 	ctx.moveTo(parseInt(elemStart.style.left, 10),parseInt(elemStart.style.top, 10));
// 	ctx1.lineTo(1000,30);
// 	ctx1.stroke();
// }
// function resizeCanvas() {
// 	c.width = window.innerWidth;
//     c.height = window.innerHeight;
//     redraw();
// }

// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
/*var eventList = ["scroll", "resize"];
for(event of eventList) {
    element.addEventListener(event, function() {
        
    });
}*/

window.addEventListener(
  "scroll",
  function () {
    // or window.addEventListener("scroll"....
    if (window.innerWidth > 768) {
      var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      var oP =
        window.pageYOffset +
        document.getElementById("omeni").getBoundingClientRect().top -
        50;
      var pP =
        window.pageYOffset +
        document.getElementById("projekti").getBoundingClientRect().top -
        50;
      var kP = Math.floor(
        window.pageYOffset +
          document.getElementById("kontakt").getBoundingClientRect().top -
          50
      );
      /// var aPoz = aP.getBoundingClientRect().bottom - 100

      if (
        st < lastScrollTop ||
        Math.abs(st - oP) < 5 ||
        Math.abs(st - pP) < 5 ||
        Math.abs(st - kP) < 5
      ) {
        menuElement = document.getElementById("meni");
        menuElement.classList.remove("menuUp");
        menuElement.classList.add("menuDown");
        profileImage = document.getElementById("sasa");
        profileImage.classList.remove("profileUp");
        profileImage.classList.add("profileDown");
        footerElement = document.getElementById("foot");
        footerElement.classList.remove("footerUp");
        footerElement.classList.add("footerDown");
      } else {
        menuElement = document.getElementById("meni");
        menuElement.classList.remove("menuDown");
        menuElement.classList.add("menuUp");
        profileImage = document.getElementById("sasa");
        profileImage.classList.remove("profileDown");
        profileImage.classList.add("profileUp");
        footerElement = document.getElementById("foot");
        footerElement.classList.remove("footerDown");
        footerElement.classList.add("footerUp");
      }

      lastScrollTop = st;
    }
  },
  false
);

// function flicker() {
// 	var element = document.getElementById('start');
//   var treperenje = setInterval(function(){element.toggleClass('hidden');}, 200);
//   	setTimeout(function(){clearInterval(treperenje);}, 1000);
//
// }

function setState(number) {
  if (number === 1) {
    document.getElementById("start").style.visibility = "hidden";
  } else if (number === 2) {
    document.getElementById("start").style.visibility = "visible";
  }
}

function init() {
  var counter = 0;
  var flickerFunction = function () {
    counter++;
    var num = 2;
    num = Math.floor(Math.random() * 2) + 1;
    setState(num);
    var rand = Math.round(Math.random() * (100 - 50)) + 50;
    if (counter > 40 && num === 2) return;
    else setTimeout(flickerFunction, rand);
  };
  flickerFunction();
}

function handleResize() {
  var startElement = document.getElementById("start");
  var startPosition = startElement.getBoundingClientRect();
  var width = startPosition.width;
  var height = startPosition.height;

  startElement.style.visibility = "visible";
  startElement.style.top = window.innerHeight / 2 - height / 2 + "px";
  startElement.style.left = window.innerWidth / 2 - width / 2 + "px";
}
