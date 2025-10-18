var projectsObject;

function openModal() {
  document.getElementById("myModal").style.display = "block";
}
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  // var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  // for (i = 0; i < dots.length; i++) {
  //     dots[i].className = dots[i].className.replace(" active", "");
  // }
  slides[slideIndex - 1].style.display = "block";
  // dots[slideIndex-1].className += " active";
  // captionText.innerHTML = dots[slideIndex-1].alt;
}

function initProjects(callback) {
  if (projectsObject) {
    callback(); // If data exists, just run the callback immediately
    return;
  }
  Utils.loadJSON("projekti.json", function (response) {
    //projectsObject = JSON.parse(response.replace(/\r/g, "\\\\r"));
    projectsObject = JSON.parse(response);

    callback();
  });
}

function showProject(type) {
  var html = "";
  var project = projectsObject[type];
  //var count = 0
  for (item in project) {
    var projectItem = project[item];
    //count = 0
    html += '<div class="mySlides">';
    html +=
      '<div class="row" id="title"><p>' +
      projectItem.codeName +
      '</p><span class="close cursor" onclick="closeModal()">&times;</span></div>';
    html += '<div class="row" id="previewRow">';
    html += '<div class="col-md-7" id="modalCodes">';
    for (codePart in projectItem.fullCode) {
      //count++
      html += "<div>" + projectItem.fullCode[codePart].name + "<br>";
      html += projectItem.fullCode[codePart].code;
      html += "</div>";
    }
    html += "</div>";
    html += '<div class="col-md-5" id="modalImage">';
    html +=
      '<img class="img-responsive" id="smallImage" src="' +
      projectItem.image +
      '" alt="animation">';
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += '<a class="prev" onclick="plusSlides(-1)">&#10094;</a>';
    html += '<a class="next" onclick="plusSlides(1)">&#10095;</a>';
  }
  document.getElementById("dynamicText").innerHTML = html;
}
