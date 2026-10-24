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
          /* 入场动画已改成「滚动进入 zoom-in」（样式在 custom.css 第 10 节，
             逻辑在末尾的 syncCards / replayCards），
             这里只切显隐，不再需要写 animation-delay。 */
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
<<<<<<< HEAD

      /* 入场动画由滚动观察器负责（custom.css 第 10 节 + 末尾 replayCards），
         原来这里写 animation-delay、重放 pm-anim 强制重启动画的两段都停用了。 */
=======
      cards.forEach(function (card, index) {
        card.style.animationDelay = Math.min(index, 18) * 22 + 'ms';
      });

      scroll.classList.remove('pm-anim');
      void scroll.offsetWidth;
>>>>>>> e74c55e976aff21c2b059c1a10dff046a07969f6
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

<<<<<<< HEAD
      /* 二级导航已经搬到标题条下面的副栏（uxEnhance 的 moveNavsToSubbar），
         section 里已经没有 .sub-category-link 了，按 data-parent-category 全局找。
         属性选择器遇特殊字符会抛，失败就退回遍历比较。 */
      var firstSubLink = null;
      try {
        firstSubLink = document.querySelector('.sub-category-link[data-parent-category="' + name + '"]');
      } catch (error) {
        var allSubs = Array.prototype.slice.call(document.querySelectorAll('.sub-category-link'));
        for (var i = 0; i < allSubs.length; i++) {
          if (allSubs[i].getAttribute('data-parent-category') === name) {
            firstSubLink = allSubs[i];
            break;
          }
        }
      }

=======
      var firstSubLink = target.querySelector('.sub-category-link');
>>>>>>> e74c55e976aff21c2b059c1a10dff046a07969f6
      if (firstSubLink && !target.querySelector('.sub-category-panel.is-active')) {
        firstSubLink.click();
      }

      if (window.lozad) {
        try { window.lozad('.lozad').observe(); } catch (error) {}
      }

      try {
        history.replaceState(null, '', '#' + encodeURIComponent(name));
      } catch (error) {}
<<<<<<< HEAD

      /* 通知「滚动显现」按当前位置重新算一次。
         刷新时 URL 带着 #分类，boot() 在首屏 rAF 之后才跑到这里，
         而 syncCards 早就在「这个分类还藏着」的时候跑完了（隐藏面板的卡片被跳过），
         于是新分类的卡片永远停在 opacity:0 —— 刷新后一片空白就是这个原因。 */
      try {
        document.dispatchEvent(new CustomEvent('pm:category', { detail: { name: name } }));
      } catch (error) {}
=======
>>>>>>> e74c55e976aff21c2b059c1a10dff046a07969f6
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

<<<<<<< HEAD
    /* 滚动 / 切换分类时收起气泡。
       气泡是 container:'body' + position:fixed，坐标是我们自己按卡片算一次就固定的，
       它**不会跟着卡片走**。一滚动卡片就换了位置，气泡却还钉在原处，
       看起来就是「只有描述、卡片不见了」。
       这里只收起、不做重定位：滚动中气泡追着卡片跳更晃眼，停下后鼠标一动就会重新弹出。 */
    var tipHideAt = 0;

    function hideTip() {
      if (!window.jQuery) {
        return;
      }

      var now = new Date().getTime();
      if (now - tipHideAt < 120) {
        return; /* 滚动事件很密，节流一下 */
      }
      tipHideAt = now;

      if (!document.querySelector('body > .tooltip')) {
        return;
      }

      if (lastTipHost && window.jQuery(lastTipHost).data('bs.tooltip')) {
        try { window.jQuery(lastTipHost).tooltip('hide'); } catch (error) {}
      } else {
        /* 没有宿主记录（侧栏等）时直接藏掉就好 */
        var tips = document.querySelectorAll('body > .tooltip');
        for (var i = 0; i < tips.length; i++) {
          tips[i].style.display = 'none';
        }
      }
    }

    var tipScrollEl = document.querySelector('.pm-scroll');
    if (tipScrollEl) {
      tipScrollEl.addEventListener('scroll', hideTip, { passive: true });
    }
    window.addEventListener('scroll', hideTip, { passive: true });
    document.addEventListener('pm:category', hideTip);

=======
>>>>>>> e74c55e976aff21c2b059c1a10dff046a07969f6
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
<<<<<<< HEAD

/* ============================================================================
   体验优化（2026-10-23 落地，源自 .workbuddy/参考/动效方案/体验优化/preview-ux.js）
   包含：1 卡片右键菜单（手机长按） / 3 键盘焦点环 + 快捷键 / 5 二级分类 chips /
        6 空分类占位 / 7 图标加载兜底
   演示期的右下浮标、假图 404 开关未搬过来；空状态改成「分类真的没卡片时自动出现」。
   回退：删掉本段 IIFE 与 custom.css 末尾「九、体验优化落地」一节即可。
   ========================================================================== */
(function () {
  'use strict';

  var body = document.body;
  if (!body || !body.classList.contains('pm-mode')) return;

  var scrollEl = document.querySelector('.pm-scroll');
  if (!scrollEl) return;

  var CARD = '.site-card-col';
  var WIDGET = '.xe-widget.xe-conversations';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function closest(el, sel) { return el && el.closest ? el.closest(sel) : null; }

  /* ---------- 卡片信息：优先读 data-search-*，比从 DOM 里猜稳 ---------- */
  function cardInfo(col) {
    var widget = col ? col.querySelector(WIDGET) : null;
    var name = (col && col.getAttribute('data-search-name')) || '';
    var url = (col && col.getAttribute('data-search-url')) || '';

    if (!name && widget) {
      var strong = widget.querySelector('.xe-user-name strong');
      name = strong ? strong.textContent : '';
    }

    var img = col ? col.querySelector('.xe-user-img img') : null;
    var icon = img ? (img.currentSrc || img.getAttribute('src') || img.getAttribute('data-src') || '') : '';

    return { name: name.trim(), url: url.trim(), icon: icon };
  }

  function absoluteUrl(url) {
    if (!url) return '';
    try { return new URL(url, location.href).href; } catch (e) { return url; }
  }

  /* ---------- 剪贴板 ---------- */
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();

    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }

    document.body.removeChild(ta);
    return ok;
  }

  function copyText(text) {
    if (!text) return Promise.resolve(false);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        return legacyCopy(text);
      });
    }

    return Promise.resolve(legacyCopy(text));
  }

  /* 图标多是 png/jpg，剪贴板只吃 png，先转一遍 */
  function toPng(blob) {
    return createImageBitmap(blob).then(function (bmp) {
      var canvas = document.createElement('canvas');
      canvas.width = bmp.width;
      canvas.height = bmp.height;
      canvas.getContext('2d').drawImage(bmp, 0, 0);

      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (png) {
          if (png) { resolve(png); } else { reject(new Error('转码失败')); }
        }, 'image/png');
      });
    });
  }

  function copyImage(url) {
    if (!window.ClipboardItem || !navigator.clipboard || !navigator.clipboard.write) {
      return Promise.reject(new Error('unsupported'));
    }

    return fetch(url, { cache: 'force-cache' }).then(function (resp) {
      if (!resp.ok) throw new Error('图片读取失败');
      return resp.blob();
    }).then(toPng).then(function (png) {
      return navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    });
  }

  /* ---------- 轻提示 ---------- */
  var toastEl = document.createElement('div');
  toastEl.className = 'ux-toast';
  toastEl.innerHTML = '<i class="fas fa-check-circle"></i><span></span>';
  document.body.appendChild(toastEl);

  var toastTimer = 0;

  function toast(message, isError) {
    toastEl.classList.toggle('err', !!isError);
    toastEl.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    toastEl.querySelector('span').textContent = message;
    toastEl.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, isError ? 3200 : 1900);
  }

  /* ==========================================================================
     1. 卡片右键菜单（手机上长按 480ms 等同右键）
     ========================================================================== */
  var menu = document.createElement('div');
  menu.className = 'ux-menu';
  menu.setAttribute('role', 'menu');
  menu.innerHTML =
    '<div class="ux-menu-head"><b></b>卡片操作</div>' +
    '<button class="ux-menu-item" type="button" data-act="link"><i class="fas fa-link"></i>复制链接</button>' +
    '<button class="ux-menu-item" type="button" data-act="name"><i class="fas fa-font"></i>复制名称</button>' +
    '<div class="ux-menu-sep"></div>' +
    '<button class="ux-menu-item" type="button" data-act="img"><i class="fas fa-image"></i>复制图片</button>';
  document.body.appendChild(menu);

  var menuCard = null;

  function openMenu(col, x, y) {
    menuCard = col;

    $$('.ux-menu-target', scrollEl).forEach(function (node) {
      node.classList.remove('ux-menu-target');
    });

    var widget = col.querySelector(WIDGET);
    if (widget) widget.classList.add('ux-menu-target');

    menu.querySelector('b').textContent = cardInfo(col).name || '未命名';

    /* 先上屏再量尺寸，否则 getBoundingClientRect 全是 0 */
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.classList.add('open');

    var rect = menu.getBoundingClientRect();
    var left = Math.min(x, window.innerWidth - rect.width - 10);
    var top = Math.min(y, window.innerHeight - rect.height - 10);

    menu.style.left = Math.max(10, left) + 'px';
    menu.style.top = Math.max(10, top) + 'px';
  }

  function closeMenu() {
    if (!menu.classList.contains('open')) return;

    menu.classList.remove('open');
    menuCard = null;

    $$('.ux-menu-target', scrollEl).forEach(function (node) {
      node.classList.remove('ux-menu-target');
    });
  }

  scrollEl.addEventListener('contextmenu', function (event) {
    var col = closest(event.target, CARD);
    if (!col) return;

    event.preventDefault();
    openMenu(col, event.clientX, event.clientY);
  });

  menu.addEventListener('click', function (event) {
    var btn = closest(event.target, '.ux-menu-item');
    if (!btn || !menuCard) return;

    var info = cardInfo(menuCard);
    var act = btn.dataset.act;

    if (act === 'link') {
      copyText(absoluteUrl(info.url)).then(function (ok) {
        toast(ok ? '链接已复制' : '复制失败，请手动复制', !ok);
        closeMenu();
      });
      return;
    }

    if (act === 'name') {
      copyText(info.name).then(function (ok) {
        toast(ok ? '名称已复制' : '复制失败，请手动复制', !ok);
        closeMenu();
      });
      return;
    }

    if (act === 'img') {
      if (!info.icon) {
        toast('这张卡片没有图标', true);
        closeMenu();
        return;
      }

      copyImage(absoluteUrl(info.icon)).then(function () {
        toast('图片已复制');
      }).catch(function (error) {
        var reason = error && error.message === 'unsupported'
          ? '这个浏览器不支持复制图片'
          : '图片复制失败（跨域或格式不支持）';
        toast(reason, true);
      }).then(closeMenu);
    }
  });

  document.addEventListener('pointerdown', function (event) {
    if (!menu.contains(event.target)) closeMenu();
  }, true);

  scrollEl.addEventListener('scroll', closeMenu, { passive: true });
  window.addEventListener('resize', closeMenu);

  var pressTimer = 0;
  var pressStart = null;
  var pressMoved = false;

  scrollEl.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1) return;

    var col = closest(event.target, CARD);
    if (!col) return;

    pressStart = { x: event.touches[0].clientX, y: event.touches[0].clientY, col: col };
    pressMoved = false;

    clearTimeout(pressTimer);
    pressTimer = setTimeout(function () {
      if (!pressStart || pressMoved) return;
      if (navigator.vibrate) navigator.vibrate(12);
      openMenu(pressStart.col, pressStart.x, pressStart.y);
      pressStart = null;
    }, 480);
  }, { passive: true });

  scrollEl.addEventListener('touchmove', function (event) {
    if (!pressStart) return;

    var touch = event.touches[0];
    if (Math.abs(touch.clientX - pressStart.x) > 8 || Math.abs(touch.clientY - pressStart.y) > 8) {
      pressMoved = true;
      clearTimeout(pressTimer);
      pressStart = null;
    }
  }, { passive: true });

  scrollEl.addEventListener('touchend', function () {
    clearTimeout(pressTimer);
    pressStart = null;
  });

  /* ==========================================================================
     3. 键盘：卡片可聚焦 + / 或 Ctrl+K 聚焦搜索 + Esc 逐层退出
     ========================================================================== */
  function decorateCards() {
    $$(CARD, scrollEl).forEach(function (col) {
      var widget = col.querySelector(WIDGET);
      if (!widget || widget.hasAttribute('tabindex')) return;

      var info = cardInfo(col);
      widget.setAttribute('tabindex', '0');
      widget.setAttribute('role', 'link');
      if (info.name) {
        widget.setAttribute('aria-label', info.name + (info.url ? '，按回车在新标签打开' : ''));
      }

      /* 卡片里那个 href="#" 的标题从 Tab 序列里摘掉，否则每张卡要按两次 Tab */
      var titleLink = widget.querySelector('.xe-user-name');
      if (titleLink) titleLink.setAttribute('tabindex', '-1');
    });
  }

  scrollEl.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    var widget = closest(event.target, WIDGET);
    if (!widget) return;

    event.preventDefault();

    var info = cardInfo(closest(widget, CARD));
    if (info.url) window.open(info.url, '_blank', 'noopener');
  });

  var tipEl = document.createElement('div');
  tipEl.className = 'ux-kbd-tip';
  tipEl.innerHTML = '<kbd>/</kbd> 搜索　<kbd>Esc</kbd> 退出　<kbd>Tab</kbd> 逐项跳转　<kbd>Enter</kbd> 打开卡片';
  document.body.appendChild(tipEl);

  var tipTimer = 0;
  var tipShown = false;

  /* 每个会话只提示一次，别每次刷新都冒出来 */
  try {
    tipShown = window.sessionStorage.getItem('uxKbdTip') === '1';
  } catch (e) {
    tipShown = false;
  }

  function showTipOnce() {
    if (tipShown) return;
    tipShown = true;

    try { window.sessionStorage.setItem('uxKbdTip', '1'); } catch (e) {}

    tipEl.classList.add('show');
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { tipEl.classList.remove('show'); }, 4200);
  }

  var searchBox = $('#txt');

  document.addEventListener('keydown', function (event) {
    var target = event.target || {};
    var tag = String(target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || target.isContentEditable;

    if (event.key === 'Tab') {
      showTipOnce();
      return;
    }

    if (event.key === 'Escape') {
      if (menu.classList.contains('open')) {
        closeMenu();
        return;
      }

      if (searchBox && (document.activeElement === searchBox || searchBox.value)) {
        searchBox.value = '';
        searchBox.blur();

        var panel = $('.search-engine');
        if (panel) panel.style.display = 'none';
        return;
      }

      return;
    }

    if (typing) return;

    var isSlash = event.key === '/';
    var isCmdK = (event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 'k';

    if ((isSlash || isCmdK) && searchBox) {
      event.preventDefault();
      closeMenu();
      searchBox.focus();
      searchBox.select();
    }
  });

  /* ==========================================================================
     5. 二级分类 chips：滑动白块 + 键盘左右切换
     ========================================================================== */
  function setupChips() {
    $$('.sub-category-nav').forEach(function (nav) {
      if (nav.dataset.uxChips) return;
      nav.dataset.uxChips = '1';
      nav.classList.add('ux-chips');

      /* chips 已搬到 .pm-subbar，不能再 closest('.nav-category')，
         按搬家时记下的 data-sub-of 反查面板所在 section。 */
      var section = closest(nav, '.nav-category');
      if (!section) {
        var parentName = nav.getAttribute('data-sub-of') || '';
        var sectionList = $$('.nav-category', scrollEl);
        for (var s = 0; s < sectionList.length; s++) {
          if (sectionList[s].getAttribute('data-category') === parentName) {
            section = sectionList[s];
            break;
          }
        }
      }
      var links = $$('.sub-category-link', nav);
      var panels = section ? $$('.sub-category-panel', section) : [];

      /* ---- 数量徽章：数每个二级面板里真正有几张卡片（CSS 里当前隐藏） ---- */
      links.forEach(function (link) {
        var key = link.getAttribute('data-sub-category');
        var panel = null;

        for (var i = 0; i < panels.length; i++) {
          if (panels[i].getAttribute('data-sub-category') === key) {
            panel = panels[i];
            break;
          }
        }

        if (!panel) return;

        var count = panel.querySelectorAll('.site-card-col').length;
        if (!count) return;

        var badge = document.createElement('i');
        badge.className = 'ux-count';
        badge.textContent = String(count);
        badge.setAttribute('aria-hidden', 'true');
        link.appendChild(badge);
      });

      /* ---- 选中项的流光环 ----
         环用真实元素（伪元素 + conic 角度动画在 Chromium 里不会重绘，屏幕上看是死的），
         滑块要 0.5s 才滑到位，所以环等它停稳（560ms）再淡入，别边滑边亮。 */
      var FLOW_DELAY = 560;
      var flowTimer = null;
      var flowLink = null;

      function currentLink() {
        return nav.querySelector('.sub-category-link.is-current')
          || nav.querySelector('.sub-category-link.is-active')
          || nav.querySelector('.sub-category-link');
      }

      function ringOf(link) {
        if (!link) return null;

        var kids = link.children;
        for (var i = 0; i < kids.length; i++) {
          if (kids[i].classList.contains('ux-ring')) return kids[i];
        }

        var ring = document.createElement('i');
        ring.className = 'ux-ring';
        ring.setAttribute('aria-hidden', 'true');
        ring.innerHTML = '<b></b>';
        link.appendChild(ring);
        return ring;
      }

      function scheduleFlow(link, delay) {
        var ring = link ? ringOf(link) : null;

        /* 已经亮在这项上了：不要灭掉再点一次（点当前项会闪一下） */
        if (ring && ring.classList.contains('on')) return;

        /* 同一次点击会先后冒 focusin / click，目标没变就别把计时往后推 */
        if (link && link === flowLink && flowTimer) return;

        clearTimeout(flowTimer);
        flowLink = link;

        $$('.ux-ring', nav).forEach(function (r) {
          r.classList.remove('on');
        });

        if (!ring) {
          flowTimer = null;
          return;
        }

        flowTimer = setTimeout(function () {
          flowTimer = null;
          ring.classList.add('on');
        }, delay == null ? FLOW_DELAY : delay);
      }

      nav._uxFlow = scheduleFlow;

      /* ---- 键盘：在一排 chip 里用 ←/→ 走，Home/End 跳到两端 ---- */
      nav.addEventListener('keydown', function (event) {
        var list = $$('.sub-category-link', nav);
        var index = list.indexOf(document.activeElement);
        if (index < 0) return;

        var next = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = list.length - 1;

        if (next < 0 || next >= list.length || next === index) return;
        event.preventDefault();
        list[next].focus();
        if (list[next].scrollIntoView) {
          list[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      });

      /* ---- 滑块：把当前项的 offsetLeft/offsetWidth 写成 --ux-pill-x/-w ---- */
      function movePill(target) {
        var link = target
          || nav.querySelector('.sub-category-link.is-current')
          || nav.querySelector('.sub-category-link.is-active')
          || nav.querySelector('.sub-category-link');

        if (!link || !link.offsetWidth) return;

        nav.style.setProperty('--ux-pill-x', (link.offsetLeft - 4) + 'px');
        nav.style.setProperty('--ux-pill-w', link.offsetWidth + 'px');
      }

      /* ---- 放不下才允许横滑 + 边缘渐隐 ----
         桌面默认 overflow-x: clip：不分栏其实也放得下，而 clip 不产生「可滚动区」，
         滑块动画那瞬间多出的 2px 不会把轨道滚歪（滚了右端圆角就像被截掉）。
         所以先量「内容真的超了没有」，超了（> 4px）才加 .is-overflow 换成可滚，
         再由下面的渐隐提示左右还有内容。

         ⚠️ 判溢出**绝对不能读 nav.scrollWidth**：轨道里有两处绝对定位的装饰会被算进去 ——
           ① 滑块 ::before（滑到最右端时正好贴住内边距）
           ② 选中项的流光环 .ux-ring > b（320% 边长的方形旋转盘，居中后左右各伸出约 2/3 个 chip 宽）
         当流光环落在**最后一个** chip 上时，那圈往外伸出去的部分会把 scrollWidth 撑大约 75px，
         于是「6 个 chip 明明放得下」也被判成溢出 → 轨道换成 overflow-x: auto、
         右端再挂 20px 渐变遮罩 → **表现就是「点最后一个二级分类，胶囊轨道右侧缺一块」**。
         （环在第一项时外扩朝左，不计入 scrollWidth，所以只有点最后一项才犯病。）
         改用 chip 自身的布局宽度求和（offsetWidth 不含 transform、与滚动位置无关）来判。 */
      function contentOverflow() {
        var list = $$('.sub-category-link', nav);
        if (!list.length) return 0;

        var cs = window.getComputedStyle(nav);
        var gap = parseFloat(cs.columnGap) || 0;
        var pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        var border = (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0);
        var sum = pad + border + gap * (list.length - 1);

        for (var i = 0; i < list.length; i++) sum += list[i].offsetWidth;

        /* 内容宽 − 轨道宽；正数就是需要横滑的距离 */
        return Math.ceil(sum - nav.offsetWidth);
      }

      function syncFade() {
        /* 不是当前分类的那一条是 display:none，宽度量为 0，
           这时算出来的「溢出」没有意义（会把积累了好几倍的宽度当成要横滑）*/
        if (!nav.offsetWidth) return;

        var over = contentOverflow();
        nav.classList.toggle('is-overflow', over > 4);

        var ox = window.getComputedStyle(nav).overflowX;
        var scrollable = (ox === 'auto' || ox === 'scroll');
        var max = scrollable ? Math.max(0, over) : 0;

        if (max <= 4) {
          nav.style.setProperty('--ux-fade-l', '0px');
          nav.style.setProperty('--ux-fade-r', '0px');
          /* 缩回放得下的宽度时把滚动位置归零，别留个半截 */
          if (nav.scrollLeft) nav.scrollLeft = 0;
          return;
        }

        nav.style.setProperty('--ux-fade-l', nav.scrollLeft > 4 ? '20px' : '0px');
        nav.style.setProperty('--ux-fade-r', (max - nav.scrollLeft) > 4 ? '20px' : '0px');
      }

      nav._uxSync = syncFade;
      nav._uxPill = movePill;
      nav.addEventListener('scroll', syncFade, { passive: true });
      window.addEventListener('resize', function () {
        syncFade();
        movePill();
      });

      /* 分类多到放不下时，鼠标滚轮直接推着横滑（到两端就放行，页面照常滚）。
         同样不能读 scrollWidth：装饰外扩会让放得下的轨道也「看起来能滚」，
         那样这里会 preventDefault 却滚不动 —— 光标停在 chips 上时整页滚不了。 */
      nav.addEventListener('wheel', function (event) {
        var vertical = Math.abs(event.deltaY) > Math.abs(event.deltaX);

        /* 放不下时先让自己横滑 */
        if (vertical && nav.classList.contains('is-overflow')) {
          var max = contentOverflow();
          if (max > 4) {
            var next = nav.scrollLeft + event.deltaY;
            if (next >= 0 && next <= max) {
              event.preventDefault();
              nav.scrollLeft = next;
              return;
            }
          }
        }

        if (!vertical) return;

        /* 搬到副栏之后，鼠标停在 chips 上滚动会「纹丝不动」：
           滚动的目标是「光标所在位置的可滚动祖先链」，而 .pm-scroll 现在是副栏的**兄弟**，
           不在 chips 的祖先链里；链上最高到 .main-content（overflow:hidden，滚不动），
           浏览器就此放弃，页面一层都不动。这里手动把竖直滚动交给主滚动区。
           （手机 ≤767 滚动的是 window，那时 chips 的祖先链可达文档，浏览器自己会滚。） */
        if (window.getComputedStyle(scrollEl).overflowY === 'visible') return;

        if ((event.deltaY < 0 && scrollEl.scrollTop <= 0) ||
            (event.deltaY > 0 && scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight)) return;

        event.preventDefault();
        scrollEl.scrollTop = scrollEl.scrollTop + event.deltaY;
      }, { passive: false });

      /* 键盘用户：焦点进到哪个分段，白块就滑到哪个；离开这一排再退回当前项 */
      nav.addEventListener('focusin', function (event) {
        var link = closest(event.target, '.sub-category-link');
        if (!link) return;
        movePill(link);
        scheduleFlow(link);
      });

      nav.addEventListener('focusout', function () {
        setTimeout(function () {
          if (!nav.contains(document.activeElement)) {
            movePill();
            scheduleFlow(currentLink());
          }
        }, 0);
      });

      /* 点完 chip：把滑块挪过去（等主题切完 is-current），顺手把它滚进视野 */
      nav.addEventListener('click', function (event) {
        var link = closest(event.target, '.sub-category-link');
        if (!link) return;

        /* 环立刻灭掉旧的，等滑块停稳再亮到新项上 */
        scheduleFlow(link);

        setTimeout(function () {
          movePill();

          /* 只有真能横滑时才需要「滚进视野」（桌面 overflow-x: clip 滚也滚不动） */
          if (nav.classList.contains('is-overflow')) {
            var r = link.getBoundingClientRect();
            var nr = nav.getBoundingClientRect();

            if (r.left < nr.left + 4 || r.right > nr.right - 4) {
              nav.scrollTo({ left: nav.scrollLeft + (r.left - nr.left) - 12, behavior: 'smooth' });
            }
          }
          syncFade();
        }, 60);
      });

      setTimeout(movePill, 60);
      setTimeout(movePill, 400);

      /* 首次进来：等滑块滑到位再点亮 */
      scheduleFlow(currentLink(), 600);
    });
  }

  /* ---------- 二级分类副栏 ----------
     把每个分组分类的 .sub-category-nav 搬到滚动区**外面**的一条固定层
     （标题条与 .pm-scroll 之间，见 50-panel.css 的 .pm-subbar）。
     为什么必须挪：要「卡片从二级分类下沿被切平」，这条裁切线只能由滚动容器自己提供 ——
     滚动容器的可视区天然从它的顶边开始，越过顶边的内容会被 overflow 直接裁掉。
     留在滚动区里就只剩 sticky + 手工配一条遮罩两种办法：前者没有裁切线（卡片会从两侧
     和空白处继续往上冒），后者得自己配一份面板底色，而面板是渐变 + 柔光，
     配出来的颜色总会在轨道右侧露出一条灰带（已经失败过两次）。
     挪出去还顺带解决了另一个诉求：导航一直静止在标题条下面，没有「滚到顶才吸附」的过程，
     也就不存在吸顶动画。 */
  var subbarEl = null;

  function ensureSubbar() {
    if (subbarEl && subbarEl.parentNode) return subbarEl;

    subbarEl = $('.pm-subbar');
    if (!subbarEl) {
      subbarEl = document.createElement('div');
      subbarEl.className = 'pm-subbar';
      scrollEl.parentNode.insertBefore(subbarEl, scrollEl);
    }
    return subbarEl;
  }

  /* 搬家只做一次，而且必须在 setupChips() 之前 —— 它要认这批 nav */
  function moveNavsToSubbar() {
    var bar = ensureSubbar();
    if (!bar) return;

    $$('.nav-category').forEach(function (section) {
      var nav = section.querySelector('.sub-category-nav');
      if (!nav || nav.parentNode === bar) return;

      /* 搬出去之后就没父级可查了，把所属分类记在身上 */
      nav.setAttribute('data-sub-of', section.getAttribute('data-category') || '');
      bar.appendChild(nav);
    });
  }

  function syncSubbar() {
    var bar = ensureSubbar();
    if (!bar) return;

    var active = $('.nav-category.pm-active', scrollEl);
    var name = active ? active.getAttribute('data-category') : '';
    var shown = 0;

    $$('.sub-category-nav', bar).forEach(function (nav) {
      var on = !!name && nav.getAttribute('data-sub-of') === name;
      nav.classList.toggle('is-current', on);
      if (on) shown++;
    });

    /* 普通分类一条都没有：整层收掉，不占高度 */
    bar.classList.toggle('is-empty', !shown);
  }

  function syncFades() {
    /* 查整篇文档而不是 scrollEl：chips 已经被搬到 .pm-subbar，
       只有当前分类的那一条是可见的。 */
    $$('.sub-category-nav').forEach(function (nav) {
      if (nav._uxSync) nav._uxSync();
      if (nav._uxPill) nav._uxPill();
    });
  }

  /* ==========================================================================
     6. 空分类占位：当前分类一张卡片都没有时才出现（演示期的开关已去掉）
     ========================================================================== */
  function activeRow() {
    var section = $('.nav-category.pm-active', scrollEl);
    if (!section) return null;

    /* 分组分类（童年回忆）：先定位到当前二级面板；普通分类直接取自己的卡片区 */
    var panel = section.querySelector('.sub-category-panel.is-active') || section.querySelector('.sub-category-panel');
    var scope = panel || section;

    return scope.querySelector('.nav-card-scroll .row') || scope.querySelector('.row');
  }

  function syncEmpty() {
    $$('.ux-empty', scrollEl).forEach(function (node) { node.remove(); });

    var row = activeRow();
    if (!row) return;
    if (row.querySelectorAll(CARD).length) return;

    var box = document.createElement('div');
    box.className = 'ux-empty';
    box.innerHTML =
      '<div class="ux-empty-ico"><i class="fas fa-inbox"></i></div>' +
      '<div class="ux-empty-tit">这个分类还空着</div>' +
      '<div class="ux-empty-sub">去后台「新增站点」挑几个收藏放进来，这里就会热闹起来。</div>';
    row.appendChild(box);
  }

  /* ==========================================================================
     7. 图标兜底：图片加载失败时显示首字母色块
     ========================================================================== */
  function hashHue(text) {
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) % 360000;
    }
    return hash % 360;
  }

  function markFallback(img) {
    var holder = closest(img, '.xe-user-img');
    if (!holder || holder.classList.contains('ux-icon-fallback')) return;

    var col = closest(img, CARD);
    var name = (col && col.getAttribute('data-search-name')) || '?';
    name = String(name).trim() || '?';

    holder.style.setProperty('--ux-hue', String(hashHue(name)));
    holder.setAttribute('data-ux-initial', name.charAt(0).toUpperCase());
    holder.classList.add('ux-icon-fallback');
  }

  /* 资源加载失败不冒泡，只能在捕获阶段接 */
  document.addEventListener('error', function (event) {
    var img = event.target;
    if (!img || img.tagName !== 'IMG') return;
    if (!closest(img, CARD)) return;
    markFallback(img);
  }, true);

  /* ==========================================================================
     8. 卡片滚动进入 / 离开（对齐 https://lcg521.cn/ 的 AOS `zoom-in`）
     · 进入可视区 → 加 .card-in：opacity 0→1、scale .6→1，0.7s easeInOutSine
     · AOS 的判定只看「卡片顶边有没有越过视口底部那条线」（源码 core/applyClasses）：
         scrollBottom > position ? add : (once==="false" → remove)
       上方元素永远满足 scrollBottom > position，所以**已经滚到视口上方的卡片不会被收回**；
       只有「被滚到视口下方」的卡片才会退回初始态（这才是那站往上滚时不闪的原因）。
     · 不用 IntersectionObserver：它只在「相交状态变化」时回调，
       一次跳跃滚动（程序 scrollTo、飞快甩动）会让卡片从「下方」直接跳到「上方」而状态始终是
       「不相交」，回调不触发 → 卡片永远不亮。AOS 本身是每次滚动遍历元素比位置，这里照抄。
     ========================================================================== */
  var cardRaf = 0;
  var cardList = null;
  var replayPending = false; /* 重演已归位、等 syncCards 点亮 */

  /* 进场提前量。AOS 的 offset 是 120，但那是给那站 247px 高的文章卡的。
     我们的导航卡只有 98px —— 若也提前 120，卡片会整张落进「底边-120 ~ 底边」这条带里，
     顶边永远够不到触发线，于是「明明完全在视口内却整张透明」，看上去就是一块空白。
     所以按卡片高度等比取（247:120 ≈ 45%），并夹在 24~120 之间。 */
  var cardH = 0;

  function cardLead() {
    if (!cardH) {
      /* 优先量当前分类：隐藏分类里的卡片 offsetHeight 是 0 */
      var sample = scrollEl.querySelector('.nav-category.pm-active ' + CARD) ||
        scrollEl.querySelector(CARD);
      cardH = (sample && sample.offsetHeight) || 98;
    }
    return Math.max(24, Math.min(120, Math.round(cardH * 0.45)));
  }

  /* 触发线：卡片顶边越过它才算该出现。
     桌面取滚动容器底边、手机取视口底边，再往上让出 cardLead()；
     保证「卡片完全进入视口时一定已经越过它」（提前量 < 卡片高度）。 */
  function cardLine() {
    if (window.innerWidth <= 767) return window.innerHeight - cardLead();
    return scrollEl.getBoundingClientRect().bottom - cardLead();
  }

  /* 容器真正下沿：卡片要完全滚出这里才算离开 */
  function cardEdge() {
    if (window.innerWidth <= 767) return window.innerHeight;
    return scrollEl.getBoundingClientRect().bottom;
  }

  function syncCards() {
    replayPending = false;
    var line = cardLine();
    var edge = cardEdge();
    if (!cardList) cardList = $$(CARD, scrollEl);
    for (var i = 0; i < cardList.length; i++) {
      var col = cardList[i];
      if (!col.offsetParent) continue; /* 隐藏着的二级分类面板不用管 */
      var top = col.getBoundingClientRect().top;
      if (col.classList.contains('card-in')) {
        /* 已经亮着的：要完全滚出下沿才收回。
           小卡片只有 98px 高，若和 AOS 一样在 -120 那条线上就收，
           往上滚时卡片还在屏幕里就会凭空消失（那站卡片 247px 高才不明显）。 */
        if (top >= edge) col.classList.remove('card-in');
      } else if (top < line) {
        col.classList.add('card-in');
      }
    }
  }

  function queueCards() {
    if (cardRaf) return;
    cardRaf = window.requestAnimationFrame(function () {
      cardRaf = 0;
      syncCards();
    });
  }

  /* 隔一帧再算：首屏那一次要让浏览器先画出 opacity:0，过渡才会真的跑 */
  function deferCards() {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(syncCards);
    });
  }

  /* 切分类 / 换二级分类后重演一次入场。
     关键点：**不能只把 .card-in 摘掉**。对「已经亮过」的卡片，摘掉会立刻启动一条
     1→0 的 0.7s 淡出过渡；等两帧后再加回来时过渡只走了 3%，于是看上去只是轻微一抖、
     根本没有缩放入场 —— 表现为「每个分类只有第一次进去有动画，之后再进就没有」。
     正解是先瞬时归位（.card-reset 关掉过渡 + 强制一次样式重算，把 opacity:0/scale(.6)
     真正写成「变化前样式」），再放开过渡交还 syncCards 加点亮类，0→1 的过渡才会跑。 */
  function replayCards(root) {
    var list = $$(CARD, root || scrollEl);
    if (!list.length) return;

    var i;
    for (i = 0; i < list.length; i++) {
      list[i].classList.add('card-reset');
      list[i].classList.remove('card-in');
    }

    cardH = 0; /* 不同分类卡片高度可能不同，提前量重新量 */

    /* 强制样式重算：读一次布局属性即可让上面的 0 态成为「变化前样式」。
       只读一个就够（一次 recalc 覆盖整棵树），不必逐张读。 */
    void list[0].offsetHeight;

    for (i = 0; i < list.length; i++) list[i].classList.remove('card-reset');

    replayPending = true; /* 标记「重演已归位、等 syncCards 点亮」这段窗口 */
    deferCards();
  }

  /* 首屏保险 —— 替代原来 themes/webstack/_config.yml 里那个「3 秒后整批点亮」的盲兜底。
     正常路径下 load 后两帧内 syncCards 就会点亮该出现的卡片，不需要外力。
     这里只检查真正的不动点：「顶边已经越过触发线，却还没拿到 .card-in」。
     只有异常路径才会命中（容器刚被显隐、面板还没激活、图片把布局顶高了一截），
     命中时补上 .card-in 并留一条 warn，绝不去动本来就该在下面等着的卡片。 */
  function cardWatchdog(reason, retried) {
    /* 刚重演完、syncCards 还没跑（重置 → 隔两帧点亮）的这几十毫秒里，
       卡片天然是「该亮还没亮」。这时插手只会误报一条 warn，还会抢在过渡前面加点亮类。
       推迟一次再查；只重试一次，避免异常情况下无限自我调度。 */
    if (replayPending && !retried) {
      window.setTimeout(function () { cardWatchdog(reason, true); }, 450);
      return;
    }

    var line = cardLine();
    var list = cardList || $$(CARD, scrollEl);
    var fixed = 0;
    for (var i = 0; i < list.length; i++) {
      var col = list[i];
      if (!col.offsetParent) continue; /* 藏在未激活面板里的不算 */
      if (col.classList.contains('card-in')) continue;
      if (col.getBoundingClientRect().top < line) {
        col.classList.add('card-in');
        fixed++;
      }
    }
    if (fixed) {
      console.warn('[pm] 卡片显现兜底：' + fixed + ' 张本应显示的卡片没有点亮（' + reason + '）');
    }
  }

  scrollEl.addEventListener('scroll', queueCards, { passive: true });
  window.addEventListener('scroll', queueCards, { passive: true });
  window.addEventListener('resize', function () {
    /* 卡片宽度变了高度也会变，提前量要重新量 */
    cardH = 0;
    queueCards();
  });

  /* 分类切换（含刷新时按 URL 的 #分类 恢复）后重算一次。
     不及时算的话，首屏那次 syncCards 跑在「分类还藏着」的时刻，新分类的卡片会一直透明。 */
  document.addEventListener('pm:category', function () {
    replayCards(scrollEl.querySelector('.nav-category.pm-active') || scrollEl);
    /* 先决定副栏里哪一条可见，syncFades 才量得到它的宽度 */
    syncSubbar();
    syncFades();
    updateHint();
    /* 重演后留 700ms 再查一次，避开「先整批摘掉、两帧后加回」的过渡窗口 */
    window.setTimeout(function () { cardWatchdog('category'); }, 700);
  });

  /* 图片 / 字体加载完高度会变，落定后再对一次 */
  window.addEventListener('load', function () {
    deferCards();
    updateHint();
    /* 拉长到 600ms：给 load 后的两帧 + 过渡留出余量，避免误判 */
    window.setTimeout(function () { cardWatchdog('load'); }, 600);
  });

  /* ==========================================================================
     9. 底部「下面还有内容」提示箭头
     · 只要还能往下滚就浮出来，滚到底部自动收起（留 24px 余量，避免临界抖动）
     · 点一下平滑下滑 80% 视高 —— 比滚轮更直观，触屏用户也不用反复划
     · 桌面滚动容器是 .pm-scroll、手机是 window，两种都挂监听（没滚动的那侧不会触发）
     ========================================================================== */
  var hintEl = null;
  var hintRaf = 0;

  function hintMetrics() {
    if (window.innerWidth <= 767) {
      var de = document.documentElement;
      return { top: window.pageYOffset || de.scrollTop, view: window.innerHeight, full: de.scrollHeight };
    }
    return { top: scrollEl.scrollTop, view: scrollEl.clientHeight, full: scrollEl.scrollHeight };
  }

  function updateHint() {
    if (!hintEl) return;
    var m = hintMetrics();
    hintEl.classList.toggle('is-on', m.full - m.top - m.view > 24);
  }

  function queueHint() {
    if (hintRaf) return;
    hintRaf = window.requestAnimationFrame(function () {
      hintRaf = 0;
      updateHint();
    });
  }

  function setupScrollHint() {
    if (!document.body.classList.contains('pm-mode')) return;
    if (document.querySelector('.pm-scroll-hint')) {
      hintEl = document.querySelector('.pm-scroll-hint');
      updateHint();
      return;
    }

    hintEl = document.createElement('button');
    hintEl.type = 'button';
    hintEl.className = 'pm-scroll-hint';
    hintEl.setAttribute('aria-label', '继续向下滚动');
    hintEl.title = '下面还有内容';
    hintEl.innerHTML = '<i class="fa fa-chevron-down"></i>';

    hintEl.addEventListener('click', function () {
      var step = Math.round(hintMetrics().view * 0.8);
      var smooth = 'smooth';
      if (window.innerWidth <= 767) {
        window.scrollBy({ top: step, behavior: smooth });
      } else {
        scrollEl.scrollBy({ top: step, behavior: smooth });
      }
    });

    /* 挂 body：手机上 .main-content 是 static，挂里面会跟着滚走 */
    document.body.appendChild(hintEl);

    scrollEl.addEventListener('scroll', queueHint, { passive: true });
    window.addEventListener('scroll', queueHint, { passive: true });
    window.addEventListener('resize', queueHint);

    /* 图标/字体加载完高度会变，补几次 */
    updateHint();
    setTimeout(updateHint, 300);
    setTimeout(updateHint, 1200);
  }

  /* ==========================================================================
     方案 C（灵动卡片）落地（2026-10-24，从 demo-c.html 演示层移植）：
     ① 日间三团 mesh 背景（夜间由 CSS display:none 隐藏，柔光接管）；
     ② 光标拖尾光斑（0.12 插值跟随，日夜混合模式由 CSS 切换）；
     ③ 侧栏菜单项 + 搜索框注入 .pm-ring 流光环（mask 挖边 + 内层 conic 盘旋转，
        不能用伪元素 + @property 角度动画 —— Chromium 不重绘，环不会动）。
     显示全部由 CSS 控制（:hover / is-current / 常亮），这里只负责建 DOM。
     ========================================================================== */
  function setupSchemeC() {
    if (!document.body.classList.contains('pm-mode')) return;
    var panel = document.querySelector('.main-content');
    if (!panel || panel._pmSchemeC) return;
    panel._pmSchemeC = 1;

    var mesh = document.createElement('div');
    mesh.className = 'pm-mesh';
    mesh.setAttribute('aria-hidden', 'true');
    mesh.innerHTML = '<i></i><i></i><i></i>';
    panel.appendChild(mesh);

    var blob = document.createElement('div');
    blob.className = 'pm-blob';
    blob.setAttribute('aria-hidden', 'true');
    panel.appendChild(blob);

    var bx = window.innerWidth / 2, by = window.innerHeight / 2, tx = bx, ty = by;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      blob.style.opacity = '1';
    });
    (function loop() {
      bx += (tx - bx) * 0.12;
      by += (ty - by) * 0.12;
      blob.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0) translate(-50%,-50%)';
      window.requestAnimationFrame(loop);
    })();

    function injectRing(host) {
      if (!host || host._pmRing) return;
      host._pmRing = 1;
      var ring = document.createElement('i');
      ring.className = 'pm-ring';
      ring.setAttribute('aria-hidden', 'true');
      ring.appendChild(document.createElement('b'));
      host.appendChild(ring);
    }
    $$('.sidebar-menu .main-menu a').forEach(injectRing);
    injectRing($('.pm-searchbar .sousuo .search-box'));
  }

  /* ==========================================================================
     初始化 + 跟随分类切换
     ========================================================================== */
  function refresh() {
    moveNavsToSubbar();
    syncSubbar();
    decorateCards();
    setupChips();
    syncEmpty();
    syncFades();
    deferCards();
    updateHint();
  }

  setupScrollHint();
  setupSchemeC();
  refresh();

  var menuRoot = document.getElementById('main-menu');
  if (menuRoot) {
      menuRoot.addEventListener('click', function () {
      setTimeout(function () {
        decorateCards();
        syncSubbar();
        syncEmpty();
        syncFades();
        updateHint();
      }, 90);
    }, true);
  }

  /* 换二级分类后：卡片立刻重演，chips 的横滑位置和渐隐等布局落定再算。
     监听挂在 document 上（不是 .pm-scroll）：chips 无论落在文档哪一层都能收到。 */
  document.addEventListener('click', function (event) {
    var link = closest(event.target, '.sub-category-link');
    if (!link) return;

    /* 兜底：万一 chips 不在 .nav-category 里，按 data-parent-category 反查 section */
    var section = closest(link, '.nav-category');
    if (!section) {
      var parent = link.getAttribute('data-parent-category');
      var list = $$('.nav-category', scrollEl);
      for (var i = 0; i < list.length; i++) {
        if (list[i].getAttribute('data-category') === parent) {
          section = list[i];
          break;
        }
      }
    }

    /* 用 setTimeout 0 而不是 140ms：这个监听在捕获阶段，早于链接自身切 is-active，
       等一拍让面板切完显隐就立刻重演（+ 两帧 ≈ 35ms 开始放大）。
       以前统一等 140ms，没被打开过的面板会先空一下再出现。 */
    setTimeout(function () {
      replayCards(section || scrollEl);
      updateHint();
    }, 0);

    setTimeout(syncFades, 140);
  }, true);
})();
=======
>>>>>>> e74c55e976aff21c2b059c1a10dff046a07969f6
