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
      sections.forEach(function (section) {
        var sectionName = getSectionName(section);

        section.classList.toggle('is-active', sectionName === name);
      });

      subCategoryLinks.forEach(function (link) {
        var isParentLink = link.getAttribute('data-parent-category') === name;

        if (!isParentLink) {
          link.classList.remove('is-current');
        }
      });
    }

    function clearActive() {
      sections.forEach(function (section) {
        section.classList.remove('is-active');
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setActive(getLinkTarget(link));
      });
    });

    if (window.location.hash) {
      setActive(decodeTarget(window.location.hash.slice(1)));
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

// 固定侧栏 + 单分类面板模式 --------------------------------------------------
// 结构由 index.ejs 输出（.pm-topbar / .pm-searchbar / .pm-scroll），
// 这里只负责：分类切换、顶栏信息、滑动指示条、tooltip 挂载与边界处理。
(function panelMode() {
  'use strict';

  function boot() {
    var body = document.body;
    if (!body || !body.classList.contains('pm-mode')) {
      return;
    }

    var main = document.querySelector('.main-content');
    var scroll = main ? main.querySelector('.pm-scroll') : null;
    var topbar = main ? main.querySelector('.pm-topbar') : null;

    if (!main || !scroll || !topbar) {
      return;
    }

    var sections = Array.prototype.slice.call(scroll.children).filter(function (el) {
      return el.classList && el.classList.contains('nav-category');
    });

    if (!sections.length) {
      return;
    }

    var nameEl = topbar.querySelector('.pm-name');
    var countEl = topbar.querySelector('.pm-count');
    var iconEl = topbar.querySelector('.pm-title > i');

    /* ---------- 侧栏 ---------- */
    var menu = document.getElementById('main-menu');
    var menuItems = menu ? Array.prototype.slice.call(menu.children).filter(function (li) {
      return li.querySelector && li.querySelector('a[href^="#"]');
    }) : [];

    var indicator = null;
    if (menu) {
      indicator = document.createElement('span');
      indicator.className = 'pm-indicator';
      menu.appendChild(indicator);
    }

    function moveIndicator() {
      if (!menu || !indicator) {
        return;
      }

      var current = menu.querySelector('li.is-current');
      if (!current) {
        indicator.style.opacity = '0';
        return;
      }

      var menuRect = menu.getBoundingClientRect();
      var itemRect = current.getBoundingClientRect();
      indicator.style.opacity = '1';
      indicator.style.height = itemRect.height + 'px';
      indicator.style.transform = 'translateY(' + (itemRect.top - menuRect.top + menu.scrollTop) + 'px)';
    }

    /* ---------- 切换到某个分类 ---------- */
    function activate(name) {
      var target = null;

      sections.forEach(function (section) {
        if (section.getAttribute('data-category') === name) {
          target = section;
        }
      });

      if (!target) {
        return;
      }

      sections.forEach(function (section) {
        section.classList.toggle('pm-active', section === target);
        section.classList.toggle('is-active', section === target);
      });

      var cards = Array.prototype.slice.call(target.querySelectorAll('.site-card-col'));
      cards.forEach(function (card, index) {
        card.style.animationDelay = Math.min(index, 18) * 22 + 'ms';
      });

      scroll.classList.remove('pm-anim');
      void scroll.offsetWidth;
      scroll.classList.add('pm-anim');

      var heading = target.querySelector('h4');
      var headingIcon = heading ? heading.querySelector('i') : null;

      if (nameEl) {
        nameEl.textContent = name;
      }
      if (countEl) {
        countEl.textContent = cards.length ? cards.length + ' 个站点' : '';
      }
      if (iconEl && headingIcon) {
        iconEl.className = headingIcon.className;
      }

      menuItems.forEach(function (li) {
        var link = li.querySelector('a[href^="#"]');
        li.classList.toggle('is-current', link && decodeURIComponent(link.getAttribute('href').slice(1)) === name);
      });
      moveIndicator();

      scroll.scrollTop = 0;
      if (window.innerWidth <= 767) {
        window.scrollTo(0, 0);
      }

      var firstSubLink = target.querySelector('.sub-category-link');
      if (firstSubLink && !target.querySelector('.sub-category-panel.is-active')) {
        firstSubLink.click();
      }

      if (window.lozad) {
        try { window.lozad('.lozad').observe(); } catch (error) {}
      }

      try {
        history.replaceState(null, '', '#' + encodeURIComponent(name));
      } catch (error) {}
    }

    /* ---------- 绑定侧栏点击（capture 阶段，优先于旧的锚点逻辑） ---------- */
    menuItems.forEach(function (li) {
      var link = li.querySelector('a[href^="#"]');
      if (!link) {
        return;
      }

      link.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        activate(decodeURIComponent(link.getAttribute('href').slice(1)));
      }, true);
    });

    /* 分组内切换二级分类时，内容区回到顶部 */
    Array.prototype.slice.call(document.querySelectorAll('.sub-category-link')).forEach(function (link) {
      link.addEventListener('click', function () {
        scroll.scrollTop = 0;
      });
    });

    window.addEventListener('resize', moveIndicator);

    /* ---------- 初始分类 ---------- */
    var hashName = '';
    try { hashName = decodeURIComponent((location.hash || '').slice(1)); } catch (error) {}

    var initial = '';
    sections.forEach(function (section) {
      if (!initial) {
        initial = section.getAttribute('data-category');
      }
      if (hashName && section.getAttribute('data-category') === hashName) {
        initial = hashName;
      }
    });

    activate(initial || sections[0].getAttribute('data-category'));

    setTimeout(function () {
      if (window.lozad) {
        try { window.lozad('.lozad').observe(); } catch (error) {}
      }
      moveIndicator();
    }, 120);

    /* ---------- 站点描述气泡：挂到 body，避免被卡片层叠上下文遮挡 ---------- */
    function rebindTooltips() {
      if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.tooltip) {
        return;
      }

      var $ = window.jQuery;
      $('[data-toggle="tooltip"]').each(function () {
        var $el = $(this);
        var instance = $el.data('bs.tooltip');
        var placement = (instance && instance.options && instance.options.placement) ||
          $el.attr('data-placement') || 'top';

        try { $el.tooltip('destroy'); } catch (error) {}

        $el.tooltip({
          container: 'body',
          placement: placement,
          trigger: 'hover',
          /* 关掉淡入：气泡先按 bootstrap 默认位置画一帧（底部卡片会被画到视口外），
             再被我们的定位纠正，看起来像是闪一下。直接显示，一出来就在正确位置 */
          animation: false
        });
      });
    }

    var lastTipHost = null;

    /* 气泡定位：插入即摆好，fade 期间也不会先出现在视口外
       （先出现在视口外会把文档撑高，页面滚动条一闪，整页横移，看起来就是抖一下） */
    function clampTooltip() {
      var host = document.querySelector('.main-content');
      if (!host) {
        return;
      }

      var tips = document.querySelectorAll('.tooltip');
      var tip = null;

      for (var i = tips.length - 1; i >= 0; i--) {
        if (tips[i].parentNode === document.body && tips[i].style.display !== 'none') {
          tip = tips[i];
          break;
        }
      }

      if (!tip) {
        return;
      }

      /* 手机端是文档流布局，气泡按默认位置显示即可 */
      if (window.innerWidth <= 767) {
        return;
      }

      var hostRect = host.getBoundingClientRect();
      var pad = 14;
      var tipWidth = tip.offsetWidth;
      var tipHeight = tip.offsetHeight;

      /* 尺寸还没量出来（刚插入那一刻），交给 shown 再摆 */
      if (!tipWidth || !tipHeight) {
        return;
      }

      /* 非卡片触发（例如侧栏）时只做边界钳制 */
      if (!lastTipHost) {
        var tipRect = tip.getBoundingClientRect();
        var shiftX = 0;
        var shiftY = 0;

        if (tipRect.left < hostRect.left + pad) {
          shiftX = (hostRect.left + pad) - tipRect.left;
        } else if (tipRect.right > hostRect.right - pad) {
          shiftX = (hostRect.right - pad) - tipRect.right;
        }

        if (tipRect.top < pad) {
          shiftY = pad - tipRect.top;
        } else if (tipRect.bottom > window.innerHeight - pad) {
          shiftY = (window.innerHeight - pad) - tipRect.bottom;
        }

        /* 气泡是 position:fixed，直接按视口坐标平移 */
        if (shiftX) {
          tip.style.left = (tipRect.left + shiftX) + 'px';
        }
        if (shiftY) {
          tip.style.top = (tipRect.top + shiftY) + 'px';
        }
        return;
      }

      /* 自行计算位置，避免被滚动位置或卡片合成层影响 */
      var cardRect = lastTipHost.getBoundingClientRect();
      var limit = Math.min(window.innerHeight, hostRect.bottom) - 8;
      var minTop = Math.max(hostRect.top, 0) + 8;

      tip.classList.remove('top', 'bottom');

      if ((cardRect.bottom + 5 + tipHeight) > limit && (cardRect.top - 6 - tipHeight) >= minTop) {
        tip.classList.add('top');
        tip.style.top = (cardRect.top - tipHeight - 7) + 'px';
      } else {
        tip.classList.add('bottom');
        /* 上下都放不下时（视口很矮 / 气泡很高）就地夹进视口，别让它顶出页外 */
        var bottomTop = Math.min(cardRect.bottom + 4, limit - tipHeight);
        tip.style.top = Math.max(minTop, bottomTop) + 'px';
      }

      var centerX = cardRect.left + cardRect.width / 2;
      var left = centerX - tipWidth / 2;

      if (left < hostRect.left + pad) {
        left = hostRect.left + pad;
      }
      if (left + tipWidth > hostRect.right - pad) {
        left = hostRect.right - pad - tipWidth;
      }

      tip.style.left = left + 'px';

      var arrow = tip.querySelector('.tooltip-arrow');
      if (arrow) {
        arrow.style.left = (centerX - left) + 'px';
      }
    }

    /* 捕获阶段记录宿主：必须早于 bootstrap 在元素上绑的 hover 处理，
       否则 inserted 触发时 lastTipHost 还是上一次的值 */
    document.addEventListener('mouseover', function (event) {
      var el = event.target && event.target.closest ? event.target.closest('[data-toggle="tooltip"]') : null;
      if (el) {
        lastTipHost = el;
      }
    }, true);

    if (window.jQuery) {
      window.jQuery(document).on('shown.bs.tooltip.pmclamp', clampTooltip);
    }

    /* 主题的 tooltip 初始化在 jQuery ready 中，错开一拍重绑 */
    setTimeout(rebindTooltips, 0);
    setTimeout(rebindTooltips, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

// 搜索引擎下拉：解决「图标到面板之间有间隙，hover 中断导致点不到」的问题 ----------
// 主题在 header.js 里用 hover 直接 display:none，鼠标一离开图标就收起，
// 而面板在图标下方 15px 处，实际根本移不过去。这里换成带延迟的显隐。
(function searchEngineHover() {
  'use strict';

  function boot() {
    if (!window.jQuery) {
      return;
    }

    var $ = window.jQuery;
    var $icon = $('.sousuo .search-icon');
    var $panel = $('.sousuo .search-engine');

    if (!$icon.length || !$panel.length) {
      return;
    }

    /* 先摘掉主题的即时显隐 */
    $icon.off('mouseenter mouseleave');
    $panel.off('mouseenter mouseleave');

    var hideTimer = null;

    function open() {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      $panel.css('display', 'block');
    }

    function closeLater() {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
      }
      hideTimer = window.setTimeout(function () {
        $panel.css('display', 'none');
        hideTimer = null;
      }, 280);
    }

    $icon.add($panel)
      .on('mouseenter', open)
      .on('mouseleave', closeLater);

    /* 点选后立刻收起，不用等延迟 */
    $panel.on('click', '.search-engine-list li', function () {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      $panel.css('display', 'none');
    });

    /* 点到搜索区以外也收起 */
    $(document).on('mousedown.searchengine', function (event) {
      if (!$(event.target).closest('.sousuo').length) {
        $panel.css('display', 'none');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* ============================================================================
   灵动卡片 · 右侧主区交互（正式落地，2026-10-21）
   只增强 .pm-scroll 内的卡片，不触碰左侧栏。
   配套样式在同目录 custom.css 末尾「灵动卡片 · 右侧主区」那一段。
   演示用的右下浮标控制面板已移除（深浅切换用搜索条右端的 .pm-theme-toggle）。
   ========================================================================== */
(function () {
  'use strict';

  function boot() {
    var body = document.body;
    if (!body || !body.classList.contains('pm-mode')) return;

    var scrollEl = document.querySelector('.pm-scroll');
    if (!scrollEl) return;

    var CARD = '.xe-widget.xe-conversations.box2.label-info';

    /* ---------------- 1. 给每张卡片补一个右上角箭头 ---------------- */
    var GO =
      '<span class="ld-go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span>';

    function decorate() {
      var cards = scrollEl.querySelectorAll('.site-card-col > ' + CARD);
      for (var i = 0; i < cards.length; i++) {
        if (!cards[i].querySelector('.ld-go')) {
          cards[i].insertAdjacentHTML('beforeend', GO);
        }
      }
    }
    decorate();

    /* ---------------- 2. 指针高光 / 点击涟漪：已按需求移除 ----------------
       原来这里监听 pointermove 写 --ld-mx/--ld-my、pointerdown 插 .ld-ripple 水波，
       两套都已去掉，卡片悬停只保留 CSS 的上浮 + 流光边框。
       搜索框的流光环后来也按需求移除，所以现在这个脚本只做一件事：补右上角箭头。 */

    /* ---------------- 3. 搜索框流光环：已关闭（2026-10-21 按需求移除） ----------------
       原来这里用 SVG 给 .search-box 插一圈描边做流光，现已删除，不再生成任何节点。
       配套样式（搜索框环那一整套）也在 custom.css 里一并删掉了。 */

    /* ---------------- 4. 分类切换后补装饰（内容未变，仅防御） ---------------- */
    var menu = document.getElementById('main-menu');
    if (menu) {
      menu.addEventListener('click', function () {
        setTimeout(decorate, 60);
      }, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
