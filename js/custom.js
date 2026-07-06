// 网页刷新时判断系统时间，适配深浅模式
// window.onload = function checkTime() {
// 	var t = new Date().getHours();
// 	if (t >= 18 || t <= 6) {
// 		document.body.classList.add('night');
// 		document.cookie = "night=1;path=/"
// 	} else {
// 		document.body.classList.remove('night');
// 		document.cookie = "night=0;path=/"
// 	}
// }

// 鼠标滑过网址卡片、输入框触发背景模糊 -----------------------------开始
// 提示：一定要用querySelector来选择，用其它没效果
// var card = document.querySelectorAll('.box2');
// var bg = document.querySelector('.bg');
// var search = document.querySelector('.search')
// var speed;
// var timer = null;
// var timer1 = null;
// var blur = 0;
// var search_btn = document.querySelector('.search-btn') 
// 利用循环绑定注册事件
// for (var i = 0; i < card.length; i++) {
// 	card[i].onmouseout = function () {
// 		Blur(0);
// 	}
// 	card[i].onmouseover = function () {
// 		Blur(2.6);
// 	}
// }
// search.onmouseout = function () {
// 	Blur(0);
// }
// search.onmouseover = function () {
// 	Blur(2.6);
// }
// 匀速过渡 - 模糊
// function Blur(target) {
// 	clearInterval(timer);
// 	timer = setInterval(function () {
// 		target > blur ? speed = 0.1 : speed = -0.1;
// 		if (blur == target) {
// 			clearInterval(timer);
// 		}
// 		else {
// 			blur += speed;
// 			bg.style.filter = 'blur(' + blur + 'px)';
// 		}
// 	}, 8)
// }
// 鼠标滑过网址卡片、输入框触发背景模糊 -----------------------------结束

// 卖萌标题
// var OriginTitle = document.title;
// var titleTime;
// document.addEventListener('visibilitychange', function () {
// 	if (document.hidden) {
// 		$('[rel="icon"]').attr('href', "/img/favicon.ico");
// 		document.title = '(つェ⊂) 你脸上有点东西~~';
// 		clearTimeout(titleTime);
// 	} else {
// 		$('[rel="icon"]').attr('href', "/img/favicon.ico");
// 		document.title = '(*´∇｀*) 有点可爱~~  ' + OriginTitle;
// 		titleTime = setTimeout(function () {
// 			document.title = OriginTitle;
// 		}, 2000);
// 	}
// });

document.title = '北极熊说它怕冷的个人导航';

// 右侧父分类内切换二级分类内容
(function switchSubCategoryPanels() {
  function setup() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.sub-category-link[data-parent-category][data-sub-category]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.sub-category-panel[data-parent-category][data-sub-category]'));

    if (!links.length || !panels.length) {
      return;
    }

    function setPanel(parentName, subName) {
      var parentSections = Array.prototype.slice.call(document.querySelectorAll('.nav-category'));
      var sidebarLinks = Array.prototype.slice.call(document.querySelectorAll('.sidebar-menu .main-menu a[href^="#"]'));

      links.forEach(function (link) {
        var isSameParent = link.getAttribute('data-parent-category') === parentName;
        var isSameSub = link.getAttribute('data-sub-category') === subName;

        if (isSameParent) {
          link.classList.toggle('is-current', isSameSub);
        }
      });

      panels.forEach(function (panel) {
        var isSameParent = panel.getAttribute('data-parent-category') === parentName;
        var isSameSub = panel.getAttribute('data-sub-category') === subName;

        if (isSameParent) {
          panel.classList.toggle('is-active', isSameSub);
        }
      });

      parentSections.forEach(function (section) {
        section.classList.toggle('is-active', section.getAttribute('data-category') === parentName);
      });

      sidebarLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var targetName = '';

        try {
          targetName = decodeURIComponent(href.slice(1));
        } catch (error) {
          targetName = href.slice(1);
        }

        var isCurrentParent = targetName === parentName;
        var item = link.closest('li');

        link.classList.toggle('is-current', isCurrentParent);

        if (item) {
          item.classList.toggle('is-current', isCurrentParent);
        }
      });

      if (window.lozad) {
        window.lozad('.lozad').observe();
      }
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        setPanel(link.getAttribute('data-parent-category'), link.getAttribute('data-sub-category'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

// 阻止侧边栏滚轮穿透到右侧内容区
(function lockSidebarWheel() {
  function setup() {
    var sidebarInner = document.querySelector('.sidebar-menu.fixed .sidebar-menu-inner');

    if (!sidebarInner) {
      return;
    }

    if (window.public_vars) {
      window.public_vars.wheelPropagation = false;
    }

    if (window.jQuery && typeof window.jQuery.fn.perfectScrollbar === 'function') {
      var $sidebarInner = window.jQuery(sidebarInner);

      try {
        $sidebarInner.perfectScrollbar('destroy');
      } catch (error) {
        // The plugin throws when it has not been initialized yet.
      }

      $sidebarInner.perfectScrollbar({
        wheelSpeed: 1,
        wheelPropagation: false
      });
    }

    sidebarInner.addEventListener('wheel', function (event) {
      event.stopPropagation();

      var scrollingUp = event.deltaY < 0;
      var scrollingDown = event.deltaY > 0;
      var atTop = sidebarInner.scrollTop <= 0;
      var atBottom = Math.ceil(sidebarInner.scrollTop + sidebarInner.clientHeight) >= sidebarInner.scrollHeight;

      if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
        event.preventDefault();
      }
    }, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

// 同步当前分类高亮
(function syncCurrentCategory() {
  function decodeTarget(value) {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  }

  function setup() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.nav-category'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.sidebar-menu .main-menu a[href^="#"]'));
    var subCategoryLinks = Array.prototype.slice.call(document.querySelectorAll('.sub-category-link[data-parent-category][data-sub-category]'));
    var ticking = false;
    var hasActiveCategory = Boolean(window.location.hash);

    if (!sections.length || (!navLinks.length && !subCategoryLinks.length)) {
      return;
    }

    function getSectionName(section) {
      return section.getAttribute('data-category') || '';
    }

    function getLinkTarget(link) {
      var href = link.getAttribute('href') || '';
      return decodeTarget(href.slice(1));
    }

    function setActive(name) {
      var activeParentItems = [];
      var menuItems = Array.prototype.slice.call(document.querySelectorAll('.sidebar-menu .main-menu li'));
      var sidebarActiveName = name;
      hasActiveCategory = true;

      sections.forEach(function (section) {
        var sectionName = getSectionName(section);

        section.classList.toggle('is-active', sectionName === name);
      });

      navLinks.forEach(function (link) {
        link.classList.remove('is-current');
      });

      subCategoryLinks.forEach(function (link) {
        var isParentLink = link.getAttribute('data-parent-category') === name;

        if (!isParentLink) {
          link.classList.remove('is-current');
        }
      });

      menuItems.forEach(function (item) {
        item.classList.remove('is-current', 'is-current-parent');
      });

      navLinks.forEach(function (link) {
        var isCurrent = getLinkTarget(link) === sidebarActiveName;
        var item = link.closest('li');
        var parentItem = item && item.parentElement ? item.parentElement.closest('li') : null;

        if (!isCurrent) {
          return;
        }

        link.classList.add('is-current');

        if (item) {
          item.classList.add('is-current');
        }

        if (parentItem) {
          activeParentItems.push(parentItem);
        }
      });

      activeParentItems.forEach(function (item) {
        item.classList.add('is-current-parent');
      });
    }

    function clearActive() {
      var menuItems = Array.prototype.slice.call(document.querySelectorAll('.sidebar-menu .main-menu li'));

      sections.forEach(function (section) {
        section.classList.remove('is-active');
      });

      navLinks.forEach(function (link) {
        link.classList.remove('is-current');
      });

      menuItems.forEach(function (item) {
        item.classList.remove('is-current', 'is-current-parent');
      });
    }

    function getWatchLine() {
      var navbar = document.querySelector('nav.navbar.user-info-navbar');
      var navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 0;

      return Math.min(Math.max(navbarBottom + 64, 112), window.innerHeight * 0.32);
    }

    function findCurrentSection() {
      var watchLine = getWatchLine();
      var current = sections[0];
      var closestDistance = Infinity;

      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var containsWatchLine = rect.top <= watchLine && rect.bottom > watchLine;

        if (containsWatchLine) {
          current = section;
          closestDistance = 0;
          return;
        }

        if (rect.top <= watchLine) {
          var distance = watchLine - rect.top;

          if (distance < closestDistance) {
            closestDistance = distance;
            current = section;
          }
        }
      });

      return current;
    }

    function updateActive() {
      ticking = false;
      setActive(getSectionName(findCurrentSection()));
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActive);
      }
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setActive(getLinkTarget(link));
        window.setTimeout(requestUpdate, 360);
      });
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', function () {
      if (hasActiveCategory) {
        requestUpdate();
      }
    }, { passive: true });
    window.addEventListener('hashchange', function () {
      hasActiveCategory = true;
      requestUpdate();
    });

    if (window.location.hash) {
      setActive(decodeTarget(window.location.hash.slice(1)));
      window.setTimeout(requestUpdate, 180);
    } else {
      clearActive();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
