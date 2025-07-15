
var objekatSajtovi

var velikiNizD = []
	var velikiNizO = []
	var counterD = 1
	var counterO = 1
	var maxD = 0
	var maxO = 0
	var krajD = 0
	var krajO = 0


		// Call to function with anonymous callback
function initSajtovi() {
	loadJSON("sajtovi.json", function(response) {

    objekatSajtovi = JSON.parse(response);
    for(i in objekatSajtovi.web_dizajn) {
			velikiNizD.push(new Array(objekatSajtovi.web_dizajn[i].slika, objekatSajtovi.web_dizajn[i].link))
			maxD++;
		};
	for(i in objekatSajtovi.opšte) {
			velikiNizO.push(new Array(objekatSajtovi.opšte[i].slika, objekatSajtovi.opšte[i].link))
			maxO++;
		};
});
}

initSajtovi()


window.onload = start

function start(){
		dPromeniNaDesno()
		oPromeniNaDesno()
	}


//_________________Funkcije__________________

function loadJSON(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

//Funkcije za listanje
function dPromeniNaDesno() {
		counterD++
		var slikaD = document.getElementById('srednjiD');
		if(counterD<=maxD)
			krajD = counterD
		else
			krajD = counterD = 1

		slikaD.style.background = '-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) ' +
			'30%,rgba(255,255,255,1) 70%), url("' + velikiNizD[krajD-1][0] + '")'
		slikaD.style.backgroundSize = 'cover'
		// slika.style.backgroundImage = 'url("' + velikiNiz[kraj-1][0] + '")'
		slikaD.href = velikiNizD[krajD-1][1]
	}
	function dPromeniNaLevo() {
		counterD--
		var slikaD = document.getElementById('srednjiD');
		if(counterD>=1)
			krajD = counterD
		else
			krajD = counterD = maxD

		slikaD.style.background = '-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) ' +
			'30%,rgba(255,255,255,1) 70%), url("' + velikiNizD[krajD-1][0] + '")'
		slikaD.style.backgroundSize = 'cover'
		slikaD.href = velikiNizD[krajD-1][1]
	}

	function oPromeniNaDesno() {
		counterO++
		var slikaO = document.getElementById('srednjiO');
		if(counterO<=maxO)
			krajO = counterO
		else
			krajO = counterO = 1

		slikaO.style.background = '-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) ' +
			'30%,rgba(255,255,255,1) 70%), url("' + velikiNizO[krajO-1][0] + '")'
		slikaO.style.backgroundSize = 'cover'
		// slika.style.backgroundImage = 'url("' + velikiNiz[kraj-1][0] + '")'
		slikaO.href = velikiNizO[krajO-1][1]
	}
	function oPromeniNaLevo() {
		counterO--
		var slikaO = document.getElementById('srednjiO');
		if(counterO>=1)
			krajO = counterO
		else
			krajO = counterO = maxO

		slikaO.style.background = '-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) ' +
			'30%,rgba(255,255,255,1) 70%), url("' + velikiNizO[krajO-1][0] + '")'
		slikaO.style.backgroundSize = 'cover'
		slikaO.href = velikiNizO[krajO-1][1]
	}



// $(document).ready(function(){

// 	$.getJSON("sajtovi.json", function(json) {
// 		//alert("dobro je procitao");
// 		for(i in json.web_dizajn) {
// 			velikiNizD.push(new Array(json.web_dizajn[i].slika, json.web_dizajn[i].link))
// 			maxD++;
// 		};
// 	});

// });