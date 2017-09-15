
window.onload = start;
window.onresize = promena;

function start(){
	// kanvas();
	// var elniz = Array.prototype.slice.call(document.getElementsByClassName('navbar-nav'))
	// elNiz.forEach(function(item){
 //    	console.log(item);
	// });
	promena();
	init();
	initProjekti();
}

var lastScrollTop = 0;
var skrivanje
var sasaslika
var foot


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


window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
	if(window.innerWidth > 768) {
	   var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
	   var oP = window.pageYOffset + document.getElementById('omeni').getBoundingClientRect().top -50
	   var pP = window.pageYOffset + document.getElementById('projekti').getBoundingClientRect().top -50
	   var kP = Math.floor(window.pageYOffset + document.getElementById('kontakt').getBoundingClientRect().top -50)
	   /// var aPoz = aP.getBoundingClientRect().bottom - 100
	   	

	   	if (st < lastScrollTop || st==Math.round(pP) || st==Math.round(oP) || st==Math.round(kP)){
	   		skrivanje = document.getElementById('meni')
	    	skrivanje.classList.remove('menigore')
	    	skrivanje.classList.add('menidole')
	    	sasaslika = document.getElementById('sasa')
	    	sasaslika.classList.remove('sasagore')
	    	sasaslika.classList.add('sasadole')
	    	foot = document.getElementById('foot')
	   		foot.classList.remove('footgore')
	   		foot.classList.add('footdole')   
	   } else {
	   		skrivanje = document.getElementById('meni')
	   		skrivanje.classList.remove('menidole')
	   		skrivanje.classList.add('menigore')
	   		sasaslika = document.getElementById('sasa')
	   		sasaslika.classList.remove('sasadole')
	   		sasaslika.classList.add('sasagore')
	   		foot = document.getElementById('foot')
	   		foot.classList.remove('footdole')
	   		foot.classList.add('footgore')		
	   }
	   
	   lastScrollTop = st;
   	}
   
}, false);

		

		// function flicker() {
		// 	var element = document.getElementById('start');
		//   var treperenje = setInterval(function(){element.toggleClass('hidden');}, 200);
		//   	setTimeout(function(){clearInterval(treperenje);}, 1000);
		//
		// }


		function stanje(broj){
			if(broj===1){
				document.getElementById('start').style.visibility = "hidden";
			}
			else if(broj===2){
				document.getElementById('start').style.visibility = "visible";
			}
		}

		function init(){
			var counter = 0
			var funkcija = function(){
				counter++;
				var brj = 2;
				brj = Math.floor(Math.random()*2)+1;
				stanje(brj);
				var rand = Math.round(Math.random() * (100 - 50)) + 50;
				if(counter>40 && brj===2)
		    	return;
				else
					setTimeout(funkcija, rand);

			}
			funkcija();
		}
		
		function promena(){
			var elemStart = document.getElementById('start');
			var posStart = elemStart.getBoundingClientRect();
			var sirina = posStart.width;
			var visina = posStart.height;

			elemStart.style.visibility = "visible";
			elemStart.style.top = window.innerHeight/2 - visina/2 + "px";
			elemStart.style.left = window.innerWidth/2 - sirina/2 + "px";
		}


