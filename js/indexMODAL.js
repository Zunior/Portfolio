
var objekatProjekti

function openModal() {
  document.getElementById('myModal').style.display = "block";
}
function closeModal() {
  document.getElementById('myModal').style.display = "none";
}
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  // var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  // for (i = 0; i < dots.length; i++) {
  //     dots[i].className = dots[i].className.replace(" active", "");
  // }
  slides[slideIndex-1].style.display = "block";
  // dots[slideIndex-1].className += " active";
  // captionText.innerHTML = dots[slideIndex-1].alt;
}

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

function initProjekti(callback){
     if (objekatProjekti) {
            callback(); // If data exists, just run the callback immediately
            return;
        }
	loadJSON("../projekti.json", function(response) {
		//objekatProjekti = JSON.parse(response.replace(/\r/g, "\\\\r"));
    objekatProjekti = JSON.parse(response);

    callback();
});
}

function proj(tip){
  var html = ""
  var projekat = objekatProjekti[tip]
  //var count = 0
        for(item in projekat){
          var xamlpr = projekat[item]
          //count = 0
          html += '<div class="mySlides">'
          html += '<div class="row" id="naslov"><p>' + xamlpr.imeKoda + '</p><span class="close cursor" onclick="closeModal()">&times;</span></div>'
          html += '<div class="row" id="preglednired">'
          html += '<div class="col-md-7" id="modalkodovi">'
          for(deoKoda in xamlpr.ceo_kod) {
            //count++
            html += '<div>' + xamlpr.ceo_kod[deoKoda].ime + '<br>'
            html +=  xamlpr.ceo_kod[deoKoda].kod
            html += '</div>'
          }
          html += '</div>'
          html += '<div class="col-md-5" id="modalslika">'
          html += '<img class="img-responsive" id="slikica" src="' + xamlpr.slika + '" alt="animacija">'
          html += '</div>'
          html += '</div>'
          html += '</div>'
          html += '<a class="prev" onclick="plusSlides(-1)">&#10094;</a>'
          html += '<a class="next" onclick="plusSlides(1)">&#10095;</a>'
        }
  document.getElementById('dintekst').innerHTML = html
}