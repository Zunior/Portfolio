


$(document).ready(function(){

   /*Nestajanje slike*/
   $(document).scroll(function() {
      var y = $(this).scrollTop();
      if (y > 800) {
      $('#sasa').fadeOut();
      } else {
      $('#sasa').fadeIn();
      }
   });

   // $(window).scroll($.debounce(250, true, function(){
   //    $('#sasa').fadeIn();
   // }));
   // $(window).scroll($.debounce(250, function(){
   //    $('#sasa').fadeOut();
   // }));


   /*Animacija skrolovanja*/
   var homePos = $("#pocetna").offset().top;
   var aboutPos = $("#omeni").offset().top;
   var portfolioPos = $("#projekti").offset().top;
   var contactPos = $("#kontakt").offset().top;
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
      $("html, body").animate({scrollTop:contactPos -49}, 700, function(){
         $(":focus").blur();
      });
      return false;
   });

});
