
window.onload = promena;

var lastScrollTop = 0;
var skrivanje
var sasaslika
var foot

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

		window.onload = start;
		window.onresize = promena;

		// function flicker() {
		// 	var element = document.getElementById('start');
		//   var treperenje = setInterval(function(){element.toggleClass('hidden');}, 200);
		//   	setTimeout(function(){clearInterval(treperenje);}, 1000);
		//
		// }

		function start(){
			promena();
			init();
			initProjekti();
		}

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
				var rand = Math.round(Math.random() * (150 - 50)) + 50;
				if(counter>40 && brj===2)
		    	return;
				else
					setTimeout(funkcija, rand);

			}
			funkcija();
		}
		
		function promena(){
			var element = document.getElementById('start');
			var positionInfo = element.getBoundingClientRect();
			var sirina = positionInfo.width;
			var visina = positionInfo.height;

			element.style.visibility = "visible";
			element.style.top = window.innerHeight/2 - visina/2 + "px";
			element.style.left = window.innerWidth/2 - sirina/2 + "px";
		}


