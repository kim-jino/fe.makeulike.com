var UI = (function() {
  var $el = {
    gnb: $('.l-nav'),
    header: $('.l-header'),
    portfolio: {
      main: $('.l-main > .portfolio'),
      work: $('.l-work > .portfolio')
    },
    page: {
      main: $('.l-main'),
      work: $('.l-work'),
      adPlatform: $('.l-ad-platform')
    }
  };
  
  var is = {
    stickyHeader: true // is Sticky at Header
  };

  /**
   * GNB Navigation Toggle
   * @pages: common
   */
  var toggleNavBar = function() {
    var offsetY = $(window).scrollTop();

    if ($el.gnb.css('display') === "none") {
      is.stickyHeader = false;

      /** Blur Tests */
      $('.section, .l-footer').css('-webkit-filter', 'blur(3px)');

      $('body').addClass('is-fixed').find('#viewport').css('top', (offsetY * -1));
      $el.gnb.fadeIn().addClass('is-visible');
    } else {
      is.stickyHeader = true;

      var tmpY = parseInt($('#viewport').css('top')) * -1;

      $('body').removeClass('is-fixed').find('#viewport').css('top', 'auto');
      $(window).scrollTop(tmpY);

      $el.gnb.removeClass('is-visible');
      setTimeout(function() {
        $el.gnb.hide();
        $('.section, .l-footer').css('-webkit-filter', 'none');
      }, 200);
    }
  };

  var toggleHeader = function() {
    if (!is.stickyHeader)
      return true;

    var cond = $el.header.innerHeight(),
      tmpY = $(window).scrollTop();

    if (tmpY > cond) {
      $el.header.addClass('is-sticky');
    } else {
      $el.header.removeClass('is-sticky');
    }

  };

  /**
   * 메인페이지 포트폴리오 목록이 자동으로 슬라이딩 되게 하는 기능
   * @pages: Main
   */
  var setFocusPortfolio = function() {
    if ($el.portfolio.main.length > 0) {
      var i = 0;
      setInterval(function() {
        $el.portfolio.main.find('li').removeClass('is-hover');
        $el.portfolio.main.find('li').eq(i).addClass('is-hover');

        i++;
        if (i === $el.portfolio.main.find('li').length)
          i = 0;
      }, 2000);
    }
  };
  /**
   * 메인페이지 로딩 시 실행되어야 할 메소드
   * @return {[type]} [description]
   */
  var mainProcedure = function() {    
    setFocusPortfolio();

    sliderFactory($('.l-main .owl-carousel'));
    Work.init('main');
  };

  var workInterface = function() {
    Work.init('work');
  };

  var sliderFactory = function($target) {
    var options = {
      loop: true,
      autoplay: true,
      margin: 0,
      items: 1
    };

    return $target.owlCarousel(options);
  }

  var init = function() {
    scrollInterface();
    resizeInterface();

    /**
     * 메인페이지 영역이 존재하면 실행
     */
    if ($el.page.main.length > 0) {
      $el.page.main.find('.cont').css('height', $(window).innerHeight());
      mainProcedure();
    }

    /**
     * WORK 영역이 존재하면 실행
     */
    if ($el.page.work.length > 0) {
      workInterface();
    }

    /**
     * Ad Platform 페이지
     * 리팩토링 필요
     */
    if ($el.page.adPlatform.length > 0) {
      var $sliderTarget = [
        $('#insight-slider'),
        $('#viscuit-slider'),
        $('#game-juice-slider')
      ]

      var $slider = [
        sliderFactory(($sliderTarget[0])),
        sliderFactory(($sliderTarget[1])),
        sliderFactory(($sliderTarget[2]))
      ];
    }

  };

  var scrollInterface = function() {
    /**
     * 메인페이지 영역이 존재하면 실행
     */
    if ($el.page.main.length > 0) {
      toggleHeader();
    }
  };

  var resizeInterface = function() {

  };

  return {
    init: init,
    scrollInterface: scrollInterface,
    resizeInterface: resizeInterface,
    toggleNavBar: toggleNavBar,
    is: is
  };
}() || {});

;(function() {
  UI.init();
  /**
   * jQuery Event Handlers
   */

  /** GNB Icon Toggle */
  $('.ico.nav-bar').on('click', function(e) {
    e.preventDefault();
    
    UI.toggleNavBar();

    $(this).toggleClass('is-toggle');
  });

  // Ad-Platform Tab
  $('.l-ad-platform .tab-nav a').on('click', function(){
    mui.util.goToPosition(0);
  })

  $(window).scroll(function() {
    UI.scrollInterface();
  });

  // Event Listening
  window.addEventListener('orientationchange', function(ev){
    console.log(window.orientation)
    if(window.orientation === 0){
      $('.is-landscape').hide();
    } else {
      $('.is-landscape').show();
    }
  });

}());


Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});
