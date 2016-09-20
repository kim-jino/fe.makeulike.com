var UI = (function() {
  var $el = {
    gnb: $('.l-nav'),
    header: $('.l-header'),
    news: $('#popup-news .news'),
    newsSlider: $('#news-slider'),
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

  var URL = {
    news: 'http://new.makeulike.co.kr/mgr/news.php?callback=?',
    newsLatest: 'http://new.makeulike.co.kr/mgr/news_latest.php?callback=?'
  };

  var tmpl = {
    news: './templates/main-news.hbs'
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
   * 메인페이지 공지사항 더 보기 기능 추가
   * @pages: Main
   * @date: 160810
   */
  var toggleNews = function(type){
    if( type === "on" ){
      mui.modal.open('popup-news');
      $('#viewport').css('-webkit-filter', 'blur(3px)');
      
      setTimeout(function(){
        $('body').addClass('is-expanded-news');
      }, 50);
    }else if ( type === "off" ){
      $('body').removeClass('is-expanded-news');
      $('#viewport').css('-webkit-filter', 'none');

      setTimeout(function(){
        mui.modal.close('popup-news');
      }, 50);
    }
  };

  /**
   * setNewsTemplate
   */
  var setNewsTemplate = function(){
    $.get(tmpl.news, function(source){
      tmpl.news = source;
      getNews();
    });
  };

  var getNews = function(){
    var param = {};

    mui.ajax.jsonp(URL.newsLatest, function(rtn){
      var 
      data =  rtn;      
      data.data = JSON.parse(data.data);

      
      if (data.status != "1") {
        alert('오류가 발생하였습니다.\n페이지를 새로고침합니다.');
        window.history.go();
      }

      setNews($el.newsSlider, data.data);
    }, function(e) {
      console.log(e);
    });

    mui.ajax.jsonp(URL.news, function(rtn){
      var 
      data =  rtn;      
      data.data = JSON.parse(data.data);

      if (data.status != "1") {
        alert('오류가 발생하였습니다.\n페이지를 새로고침합니다.');
        window.history.go();
      }

      setNews($el.news, data.data);
    }, function(e) {
      console.log(e);
    });

  };

  var setNews = function($target, data){
    var template = Handlebars.compile(tmpl.news);
    
    $target.append(template(data)).promise().done(function(){
      // 뉴스 슬라이더
      if( $target === $el.newsSlider ){
        // 슬라이더 팩토리 가동!! 메인 페이지 뉴스 슬라이드
        sliderFactory($('#news-slider'), function(){
          // 더 보기 버튼 추가
          var 
          $_self = $(this)[0].$element;
          $_self.append('<button class="btn-news-more"> <i class="uri-common ico-more-news"></i></button>');

          $('#news-slider .btn-news-more').on('click', function(){
            toggleNews('on');
          });

          $('.l-news .ico.nav-bar').on('click', function(){
            toggleNews('off');
          });
        });

      }
    });
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
    setNewsTemplate();  
    setFocusPortfolio();

    Work.init('main');
  };

  var workInterface = function() {
    Work.init('work');
  };

  var sliderFactory = function($target, cb) {
    var options = {
      loop: true,
      autoplay: true,
      margin: 0,
      items: 1,
      smartSpeed: 750,
      autoplayTimeout: 5000,
      onInitialized : cb
    };

    return $target.owlCarousel(options);
  };

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
      ];

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
  $('.l-header .ico.nav-bar').on('click', function(e) {
    e.preventDefault();
    
    UI.toggleNavBar();

    $(this).toggleClass('is-toggle');
  });

  // index

  // Ad-Platform Tab
  $('.l-ad-platform .tab-nav a').on('click', function(){
    mui.util.goToPosition(0);
  });

  $(window).scroll(function() {
    UI.scrollInterface();
  });

  $('.btn-scroll-down').on('click', function(e){
    e.preventDefault();
    mui.util.goToPosition( $($(this).attr('href')).offset().top - $('.l-header').innerHeight() );
  });

  // Event Listening
  window.addEventListener('orientationchange', function(ev){
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

Handlebars.registerHelper('breaklines', function(text) {
    return new Handlebars.SafeString(text.replace(/(\r\n|\n|\r)/gm, '<br>'));
});
