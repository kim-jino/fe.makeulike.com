var Contact = (function() {
  var $form = $('.contact-form');
  var URL = "http://send.makeulike.co.kr/sendmail.php?callback=?";

  var contactValidate = function() {
    if (!mui.validate.input($('#contact-name'))) {
      alert('이름을 입력하여 주십시오.');
      return false;
    } else if (!mui.validate.input($('#contact-email'))) {
      alert('이메일을 입력하여 주십시오.');
      return false;
    } else if (!mui.validate.input($('#contact-email'), 'email')) {
      alert('이메일을 정확히 입력하여 주십시오.');
      return false;
    } else if (!mui.validate.input($('#contact-contents'))) {
      alert('내용을 입력하여 주십시오.');
      return false;
    } else if (!mui.validate.checkbox($('#contact-form-agreement'))) {
      alert('개인정보 수집·이용에 동의하여 주십시오.');
      return false;
    }
    return true;
  };

  var contactSubmit = function() {
    var param = {
      "user_name": $('#contact-name').val(),
      "user_email": $('#contact-email').val(),
      "contents": $('#contact-contents').val()
    };

    $.ajax({ type: "get", url: URL, dataType: 'jsonp', data: param, success: function(data) {
        if (data.status == "1") {
          alert("메일 전송이 완료되었습니다.\n감사합니다.");

          mui.validate.init($form);
          return false;
        } else {
        alert("메일 전송이 실패되었습니다.\n페이지를 새로고침 합니다.");
          history.go(0);
          return false;
        }
      }
    });
  };

  $form.submit(function(e) {
    e.preventDefault();
    if (contactValidate())
      contactSubmit();
  });

}());
