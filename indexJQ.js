


$(document).ready(function(){

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
      if (y > 800) {
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
        });
        $(".collapse").on('hide.bs.collapse', function(){
            $('body').animate({
                marginTop: "0px"
            }, 240);
        });    
        

//Ovo hendluje ako dodamo marginTop, a izadjemo iz meni kolapsa
  $( window ).resize(function() {
    if($(window).width() > 768) {
      $('body').css("margin-top", "0px")
        $('.navbar-collapse').collapse('hide');
    } 
  }); 
  //----------------------------------------------------------------   

});
