
$(document).ready(function () {
  //img lazy loaded
  const observer = lozad();
  observer.observe();

  $(document).on('click', '.has-sub', function () {
    var _this = $(this)
    if (!$(this).hasClass('expanded')) {
      setTimeout(function () {
        _this.find('ul').attr("style", "")
      }, 300);

    } else {
      $('.has-sub ul').each(function (id, ele) {
        var _that = $(this)
        if (_this.find('ul')[0] != ele) {
          setTimeout(function () {
            _that.attr("style", "")
          }, 300);
        }
      })
    }
  })
  $('.user-info-menu .hidden-sm').click(function () {
    if ($('.sidebar-menu').hasClass('collapsed')) {
      $('.has-sub.expanded > ul').attr("style", "")
    } else {
      $('.has-sub.expanded > ul').show()
    }
  })
  $("#main-menu li ul li").click(function () {
    $(this).siblings('li').removeClass('active'); // 删除其他兄弟元素的样式
    $(this).addClass('active'); // 添加当前元素的样式
  });
  $("a.smooth").click(function (ev) {
    ev.preventDefault();

    public_vars.$mainMenu.add(public_vars.$sidebarProfile).toggleClass('mobile-is-visible');
    ps_destroy();
    $("html, body").animate({
      scrollTop: $($(this).attr("href")).offset().top - 30
    }, {
      duration: 500,
      easing: "swing"
    });
  });
  return false;
});

var href = "";
var pos = 0;
$("a.smooth").click(function (e) {
  $("#main-menu li").each(function () {
    $(this).removeClass("active");
  });
  $(this).parent("li").addClass("active");
  e.preventDefault();
  href = $(this).attr("href");
  pos = $(href).position().top - 30;
});
(function () {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") === '') {
    if (new Date().getHours() > 22 || new Date().getHours() < 6) {
      document.body.classList.add('night');
      document.cookie = "night=1;path=/";
      console.log('夜间模式开启');
    } else {
      document.body.classList.remove('night');
      document.cookie = "night=0;path=/";
      console.log('夜间模式关闭');
    }
  } else {
    var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
    if (night == '0') {
      document.body.classList.remove('night');
    } else if (night == '1') {
      document.body.classList.add('night');
    }
  }
})();

(function () {
  function shouldUseNightMode(date) {
    var hour = date.getHours();
    return hour >= 18 || hour < 6;
  }

  function applyNightMode(enable) {
    if (enable) {
      document.body.classList.add('night');
      document.cookie = "night=1;path=/";
      return;
    }

    document.body.classList.remove('night');
    document.cookie = "night=0;path=/";
  }

  function getNextSwitchTime(now) {
    var next = new Date(now.getTime());
    var hour = now.getHours();

    if (hour < 6) {
      next.setHours(6, 0, 0, 0);
      return next;
    }

    if (hour < 18) {
      next.setHours(18, 0, 0, 0);
      return next;
    }

    next.setDate(next.getDate() + 1);
    next.setHours(6, 0, 0, 0);
    return next;
  }

  function syncNightModeByTime() {
    applyNightMode(shouldUseNightMode(new Date()));
  }

  function scheduleNextNightModeSync() {
    var now = new Date();
    var next = getNextSwitchTime(now);
    var delay = Math.max(next.getTime() - now.getTime() + 1000, 1000);

    window.setTimeout(function () {
      syncNightModeByTime();
      scheduleNextNightModeSync();
    }, delay);
  }

  syncNightModeByTime();
  scheduleNextNightModeSync();
})();
