;(function(){
  /** Accordion */
  var $accordion = $('.l-recruit .accordion');

  /** Open the first accordion */
  $accordion.find('.accordion-heading').eq(0).addClass('is-active');
  $accordion.find('.accordion-cont').hide().eq(0).show().addClass('is-active');

  $accordion.find('.accordion-heading').on('click', function(){
    if( $(this).hasClass('is-active') ){
      $(this).removeClass('is-active');
      $(this).next('.accordion-cont').slideUp().removeClass('is-active');

      return true;
    }

    $accordion.find('.accordion-heading').removeClass('is-active');
    $accordion.find('.accordion-cont').hide().removeClass('is-active');

    var offsetY = $(this).offset().top - $('.l-header').innerHeight();
    setTimeout(function(){
      mui.util.goToPosition(offsetY);
    }, 100)

    $(this).addClass('is-active');
    $(this).next('.accordion-cont').slideDown(300).addClass('is-active');

  });
})();