


$(document).ready(function(){

/*---------------Pojavljivanje slike----------------*/
  function fIn() {
    $('#sasa').fadeIn();
  }
  function fOut() {
    $('#sasa').fadeOut();
  }
  function skloni() {
    $('#sasa').css('transition', 'box-shadow 0.5s ease-in-out');
    $('#sasa').css('box-shadow', '0 0 0 #fff');
  }


  function OtkrijSasu() {
    $('#container').css('visibility', 'hidden');
    $('#sasa').css('transition', 'opacity 0.5s');
    $('#sasa').css('opacity', '1')
    $('#sasa').addClass('sijanje');
    setTimeout(skloni, 500);
    
  }

  setTimeout(OtkrijSasu , 400);
/*----------------------------------------------------*/

    var homePos = $("#pocetna").offset().top;
    var aboutPos = $("#omeni").offset().top;
    var portfolioPos = $("#projekti").offset().top;
    var contactPos = $("#kontakt").offset().top;



   /*Nestajanje slike*/
   $(document).scroll(function() {
      homePos = $("#pocetna").offset().top;
      aboutPos = $("#omeni").offset().top;
      portfolioPos = $("#projekti").offset().top;
      contactPos = $("#kontakt").offset().top;

      var y = $(this).scrollTop();
      if (y > portfolioPos - 100) {
      $('#sasa').fadeOut();
      } else {
      $('#sasa').fadeIn();
      }
   });

   /*Animacija skrolovanja*/
   $("#home_page").click(function(){
      $("#start").hide();
      $("html, body").animate({scrollTop:homePos -50}, 700, function(){
         $(":focus").blur();
         $("#start").show();
         init();
      });
      return false;
   });
   $("#about_page").click(function(){
      $("html, body").animate({scrollTop:aboutPos -50}, 700, function(){
         $(":focus").blur();
      });
      return false;
   });
   $(".portfolio_page").click(function(){
      $("html, body").animate({scrollTop:portfolioPos -50}, 700, function(){
         $(":focus").blur();
      });
      return false;
   });
   $("#contact_page").click(function(){
      $("html, body").animate({scrollTop:contactPos -50}, 700, function(){
         $(":focus").blur();
      });
      return false;
   });

   // Pokretanje SVG animacije
  var anim1 = $('#anim1'), anim2 = $('#anim2'), anim3 = $('#anim3'), anim4 = $('#anim4'), anim5 = $('#anim5'), anim6 = $('#anim6'), anim7 = $('#anim7'), anim8 = $('#anim8')

  function animacija(x) {
    x[0].beginElement();
  }

  function otkrivanjePocetna() {
    $('.navbar-nav > li:nth-child(2)').find('span').css("visibility", "visible")
    $('.navbar-nav > li:nth-child(2)').find('svg').css("visibility", "hidden");
  }

  function otkrivanjeOmeni() {
    $('.navbar-nav > li:nth-child(3)').find('span').css("visibility", "visible")
    $('.navbar-nav > li:nth-child(3)').find('svg').css("visibility", "hidden");
  }

  function otkrivanjeProjekti() {
    $('.navbar-nav > li:nth-child(4)').find('span').css("visibility", "visible")
    $('.navbar-nav > li:nth-child(4)').find('svg').css("visibility", "hidden");
  }

  function otkrivanjeKontakt() {
    $('.navbar-nav > li:nth-child(5)').find('span').css("visibility", "visible")
    $('.navbar-nav > li:nth-child(5)').find('svg').css("visibility", "hidden");
  }

  var flag1 = true;

  $('.navbar-nav > li:nth-child(2)').mouseenter(function() {
    if(flag1) {
      flag1 = false;
      $(this).find('a > span').css("visibility", "hidden");
      $(this).find('svg').css("visibility", "visible");
      setTimeout(animacija, 50, anim1);
      setTimeout(animacija, 250, anim2);
      setTimeout(otkrivanjePocetna, 1000);
    }
    
    setTimeout(function() { flag1 = true; }, 2000);
    
  });

  var flag2 = true;

  $('.navbar-nav > li:nth-child(3)').mouseenter(function() {
    if(flag2) {
      flag2 = false;
      $(this).find('a > span').css("visibility", "hidden");
      $(this).find('svg').css("visibility", "visible");
      setTimeout(animacija, 50, anim3);
      setTimeout(animacija, 250, anim4);
      setTimeout(otkrivanjeOmeni, 1000);
    }
    
    setTimeout(function() { flag2 = true; }, 2000);
  });

  var flag3 = true;

  $('.navbar-nav > li:nth-child(4)').mouseenter(function() {
    if(flag3) {
      flag3 = false;
      $(this).find('a > span').css("visibility", "hidden");
      $(this).find('svg').css("visibility", "visible");
      setTimeout(animacija, 50, anim5);
      setTimeout(animacija, 250, anim6);
      setTimeout(otkrivanjeProjekti, 1000);
    }
    
    setTimeout(function() { flag3 = true; }, 2000);
    
  });

  var flag4 = true;

  $('.navbar-nav > li:nth-child(5)').mouseenter(function() {
    if(flag4) {
      flag4 = false;
      $(this).find('a > span').css("visibility", "hidden");
      $(this).find('svg').css("visibility", "visible");
      setTimeout(animacija, 50, anim7);
      setTimeout(animacija, 250, anim8);
      setTimeout(otkrivanjeKontakt, 1000);
    }
    
    setTimeout(function() { flag4 = true; }, 2000);
    
  });

  
/*Prozor sa statistikom*/
        var moveLeft = 20;
        var moveDown = 10;
        
        $('a#trigger').hover(function(e) {
          $('div#pop-up').show("slow");
          //.css('top', e.pageY + moveDown)
          //.css('left', e.pageX + moveLeft)
          //.appendTo('body');
        }, function() {
          $('div#pop-up').hide();
        });
        
        $('a#trigger').mousemove(function(e) {
          $("div#pop-up").css('top', e.pageY + moveDown).css('left', e.pageX + moveLeft);
        });

//Guranje sadrzaja na dole pri otvaranju togle dugmeta menija
        $(".collapse").on('show.bs.collapse', function(){
            $('body').animate({
                marginTop: "227px"
            }, 300);
            // $('#pocetna').css("background-position", "top 227px");
            $('.navbar-nav').css("overflow", "hidden");
            $('.navbar-nav > li:nth-child(n + 2):nth-child(-n + 5) > svg').css("left", "42%");
            $('.dropdown-content > a').css("left","250%");
            $('.dropdown-content > a').css("top","-46px");
        });
        $(".collapse").on('hide.bs.collapse', function(){
            $('body').animate({
                marginTop: "0px"
            }, 240);
            // $('#pocetna').css("background-position", "top 0");
            $('.navbar-nav').css("overflow", "initial");
            $('.navbar-nav > li:nth-child(n + 2):nth-child(-n + 5) > svg').css("left", "0");
            $('.dropdown-content > a').css("left","0");
            $('.dropdown-content > a').css("top","0");
        });    
        

//Ovo hendluje ako dodamo marginTop, a izadjemo iz meni kolapsa
  $( window ).resize(function() {
    if($(window).width() > 768) {
      $('body').css("margin-top", "0px")
      $('.navbar-collapse').collapse('hide');
    } 
  }); 
  //----------------------------------------------------------------   


//Dodavanje sjaja elementu
$('#skolica').hover(
       function(){ $(this).addClass('sijanje') },
       function(){ $(this).removeClass('sijanje') }
)
$('#crveno').hover(
      function(){ $('#sasa').css('transition', 'box-shadow 0.5s ease-in-out');
      $('#sasa').css('box-shadow', '0 0 50px 20px red'); },
      function(){ $('#sasa').css('transition', 'box-shadow 0.5s ease-in-out');
      $('#sasa').css('box-shadow', '0 0 0 #fff'); }
)

$('#plavo').mouseenter(
      function(){ 
        $('.navbar-nav > li:nth-child(2) span').addClass('sijanjePlavo');
        setTimeout(function(){ 
          $('.navbar-nav > li:nth-child(2) span').removeClass('sijanjePlavo');
        }, 300);
        setTimeout(function(){
          $('.navbar-nav > li:nth-child(3) span').addClass('sijanjePlavo');}, 300);
        setTimeout(function(){ 
          $('.navbar-nav > li:nth-child(3) span').removeClass('sijanjePlavo');
        }, 600);
        setTimeout(function(){
          $('.navbar-nav > li:nth-child(4) span').addClass('sijanjePlavo');}, 600);
        setTimeout(function(){ 
          $('.navbar-nav > li:nth-child(4) span').removeClass('sijanjePlavo');
        }, 900);
        setTimeout(function(){
          $('.navbar-nav > li:nth-child(5) span').addClass('sijanjePlavo');}, 900);
        setTimeout(function(){ 
          $('.navbar-nav > li:nth-child(5) span').removeClass('sijanjePlavo');
        }, 1200);
      }
      
)

});
