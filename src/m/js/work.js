var Work = (function() {

  var URL = {
    work: '/_interface/_json/list.html',
    main: '/_interface/_json/main.html',
    contents: '/_interface/getContents.php'
  };

  var tmpl = {
    main: './templates/main-work-item.hbs',
    work: './templates/work-item.hbs',
    viewerHeader: './templates/viewer-header.hbs',
    viewerSection: './templates/viewer-section.hbs'
  };

  var $el = {
    main: $('#main-work-list'),
    work: $('#work-list'),
    workViewer: $('#work-viewer')
  };

  var tmpYPos = 0;
  var referel;
  var category = "all";

  var videoViewer =
    '<div id="popup-video" class="modal" data-role="modal">' +
    '<div class="modal-content">' +
    '<div class="movie-frame">' +
    '<iframe id="work-video" src="./images/spacer.png" frameborder="0"></iframe>' +
    '</div>' +
    '<a href="javascript:void(0)" data-rel="back" class="modal-btn-close">' +
    '<img src="./images/btn-video-close.png" alt="닫기">' +
    '</a>' +
    '</div>' +
    '</div>';


  /**
   * Work 목록 불러오기
   * @param  {String} type 페이지 이름
   */
  var init = function(type) {
    //$el.workViewer.closest('#viewport').append('<article id="work-viewer" class="viewer"></article>');
    $('body').append(videoViewer);

    referel = type;
    setTemplate();
  };

  var getList = function(type) {
    var param = {};

    mui.ajax.call('GET', URL[type], param, function(rtn) {
      var data = JSON.parse(rtn);

      if (data.status != "1") {
        alert('오류가 발생하였습니다.\n페이지를 새로고침합니다.');
        window.history.go();
      }

      setList(type, $el[type], data.data);
    }, function(e) {
      console.log(e);
    });

  };

  /** ## Getters ## */

  /**
   * Work 상세 내용 불러오기
   * @param  {String} type 페이지 이름
   */
  var getContents = function(id) {
    var param = {
      idx: id
    };

    if( referel === 'main'){
      param.mode = referel;
    } else if ( referel === 'work' ){
      param.mode = category;
    }

    mui.ajax.call('GET', URL.contents, param, function(rtn) {
      var data = JSON.parse(rtn);

      if (data.status != "1") {
        alert('오류가 발생하였습니다.\n페이지를 새로고침합니다.');
        window.history.go();
      }

      // Index, Work 메뉴에 대한 분기
      if (referel === "work")
        $el.work.css('top', tmpYPos * -1);
      else if (referel === "main") {
        $el.main.parent().css({
          'position': 'fixed',
          'top': tmpYPos * -1
        });
        UI.is.stickyHeader = false;
      }

      setViewerHeader(data.data);
      setViewerContents(data.filedata);

    }, function(e) {
      console.log(e);
    });
  };

  /** ## Setters ## */

  // Handlebars External Template Load
  var setTemplate = function() {
    $.get(tmpl.main, function(source) {
      tmpl.main = source;
      getList(referel);
    });
    $.get(tmpl.work, function(source) {
      tmpl.work = source;
      getList(referel);
    });
    $.get(tmpl.viewerHeader, function(source) {
      tmpl.viewerHeader = source;
    });
    $.get(tmpl.viewerSection, function(source) {
      tmpl.viewerSection = source;
    });
  };

  var setList = function(type, $el, data) {
    var template = Handlebars.compile(tmpl[type]);
    $el.html(template(data));
  };

  var setViewerHeader = function(data) {
    var template = Handlebars.compile(tmpl.viewerHeader);
    var data = data;

    data.title = decodeURIComponent(data.title.replace(/\+/g, ' '));
    data.subtitle = decodeURIComponent(data.subtitle.replace(/\+/g, ' '));
    data.text = decodeURIComponent(data.text.replace(/\+/g, ' ')); //  URI 에서 + 를 제외

    $el.workViewer.empty().append(template(data));

  };

  var setViewerContents = function(data) {
    var data = data;
    var template = Handlebars.compile(tmpl.viewerSection);

    $el.workViewer.append(template(data)).promise().done(function() {
      sliderFactoy(data);

      $el.workViewer.closest('#viewport').addClass('is-view');
      $el.workViewer.css('transform', 'none');
      setTimeout(function() {
        $('.viewer-lnb').fadeIn();
      }, 400);
      $(window).scrollTop(0);
    });

  };

  var sliderFactoy = function(data) {
    var options = {
      loop: true,
      margin: 2,
      items: 1
    };

    if (data.W && Object.keys(data.W).length !== 1) {
      $('.l-work-website').owlCarousel(options);
    } else {
      $('.l-work-website').addClass('active');
    }

    if (data.B && Object.keys(data.B).length !== 1) {
      $('.l-work-banner').owlCarousel(options);
    } else {
      $('.l-work-banner').addClass('active');
    }

    if (data.X && Object.keys(data.X).length !== 1) {
      $('.l-work-banner-x').owlCarousel(options);
    }

    if (data.O && Object.keys(data.O).length !== 1) {
      $('.l-work-offline').owlCarousel(options);
    }

    if (data.M && Object.keys(data.M).length !== 1) {
      $('.l-work-media').owlCarousel(options);
    }
    
    if (data.I && Object.keys(data.I).length !== 1) {
      $('.l-work-icon').owlCarousel(options);
    }

    if (data.R && Object.keys(data.R).length !== 1) {
      $('.l-work-bi').owlCarousel(options);
    }

    if (data.S && Object.keys(data.S).length !== 1) {
      $('.l-work-sticon').owlCarousel(options);
    }

    if (data.T && Object.keys(data.T).length !== 1) {
      $('.l-work-timeboard').owlCarousel(options);
    }

  };

  // WORK 탭 버튼
  $('.l-work .tab-nav a').on('click', function(e) {
    e.preventDefault();

    var target = $(this).attr('href');

    category = target.replace('#', '');

    /** LNB Anchor toggle class */
    $('.l-work .tab-nav li').removeClass('active');
    $(this).parent().addClass('active');

    mui.util.goToPosition(0);

    $('[data-kind]').show();

    if (target === "#brand") {
      $('[data-kind="G"]').hide();
    } else if (target === "#game") {
      $('[data-kind="B"]').hide();
    }

  });


  // WORK 각 항목 클릭 이벤트 (index)
  $el.main.on('click', '.list-item > a', function(e) {
    e.preventDefault();
    var idx = $(this).attr('href').replace('#', '');

    tmpYPos = $(window).scrollTop();

    getContents(idx, referel);
  });

  // WORK 각 항목 클릭 이벤트 (work)
  $el.work.on('click', '.list-item > a', function(e) {
    e.preventDefault();
    var idx = $(this).attr('href').replace('#', '');

    tmpYPos = $(window).scrollTop();

    getContents(idx, referel);
  });


  // WORK 사이트 및 배너 상세페이지 확인
  $el.workViewer.on('click', '.viewer-item', function(e) {
    e.preventDefault();

    var src = '';

    $('#viewer-detail-img').removeAttr('class');// 불필요한 클래스 제거
    
    if ($(this).closest('.viewer-section').hasClass('l-work-banner')) {
      src = $(this).css('background-image').split('(')[1].replace(/[\)\"]/g, '');
    } else if($(this).closest('.viewer-section').hasClass('l-work-website')) {

      var targetHeight = $(this).closest('div').find('.viewer-item > img')[0].clientHeight;    

      src = $(this).find('img').attr('src');
      
      $('#viewer-detail-img').addClass('is-website'); // 사이트의 경우 하단에 상태표시줄 느낌 추가

      // 이미지 크기가 브라우저 창 높이보다 작으면 이미지를중앙정렬 하는 클래스 지정
      if( targetHeight < $(window).innerHeight() - 10 )
        $('#viewer-detail-img').addClass('is-overflow');
    } else {
      return true;
    }
 
    $('#viewer-detail-img').attr('src', src);

    mui.modal.open('popup-viewer-detail');

    $(window).scrollTop(0);
  });


  // 전체보기 버튼을 내용영역 밖으로 빼면서 추가 수정 (.viewer-item 트리깅)
  $el.workViewer.on('click', '.viewer-btn-expend', function(e) {
    e.preventDefault();
    $(this).parent().find('.viewer-item').trigger('click');
  });

  // WORK 상세페이지 닫기
  $el.workViewer.on('click', '.viewer-btn-close', function(e) {
    e.preventDefault();

    //$el.workViewer.closest('#viewport').removeClass('is-view');
    $el.workViewer.closest('#viewport').addClass('is-close');
    $('.viewer-lnb').hide();

    $el.workViewer.css('transform', 'translate3d(100%,0,0)');
  });

  $el.workViewer.on('click', '.viewer-btn-prev, .viewer-btn-next', function() {
    var idx = $(this).attr('href').replace('#', '');
    getContents(idx);
  });

  $el.workViewer.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
    //$el.workViewer.closest('#viewport').removeClass('is-close');
    if ($el.workViewer.closest('#viewport').hasClass('is-close')) {
      $el.workViewer.closest('#viewport').removeClass('is-view is-close');

      // Index, Work 메뉴에 대한 분기
      if (referel === "work") {
        $el.work.removeAttr('style');
      } else if (referel === "main") {
        $el.main.parent().removeAttr('style');
        UI.is.stickyHeader = true;
      }

      $el.workViewer.removeAttr('style');
      $(window).scrollTop(tmpYPos);
    }
  });

  $(document).on('click', '[data-video]', function(e) {
    e.preventDefault();
    
    var target = $(this).data('video');
    var href = $(this).attr('href').replace('#', '');

    $('#work-video').attr('src', 'https://www.youtube.com/embed/' + target + '?autoplay=1&rel=0&amp;controls=1&amp;showinfo=0');
    mui.modal.open(href);
  });

  $(document).on('click', '#popup-video [data-rel="back"]', function() {
    var href = $(this).closest('[data-role="modal"]').attr('id').replace('#', '');

    $('#work-video').attr('src', '');
    mui.modal.close(href);
  });

  return {
    init: init,
    getList: getList
  };

}());
