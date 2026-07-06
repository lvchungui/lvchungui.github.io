function search() {
    $(".search-icon").css("opacity", "1");
    var listIndex = -1;
    var hotList = 0;
    var siteResults = [];
    var siteSearchUrl = "site://nav";
    var siteSearchIcon = "/img/logo.png";
    var searchData = {
        "thisSearch": siteSearchUrl,
        "thisSearchIcon": siteSearchIcon,
        "hotStatus": true,
        "data": [ {
            name: "百度",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -80px 0px",
            position: "0px 0px",
            url: "https://www.baidu.com/s?wd=",
            type: "external"
        }, {
            name: "站内",
            img: siteSearchIcon,
            position: siteSearchIcon,
            url: siteSearchUrl,
            type: "site"
        },{
            name: "谷歌",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png')  -105px 0px",
            position: "-40px 0px",
            url: "https://www.google.com/search?q=",
            type: "external"
        }, {
            name: "必应",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png')  -80px -25px",
            position: "0px -40px",
            url: "https://cn.bing.com/search?q=",
            type: "external"
        }, {
            name: "好搜",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -105px -25px",
            position: "-40px -40px",
            url: "https://www.so.com/s?q=",
            type: "external"
        }, {
            name: "搜狗",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -80px -50px",
            position: "0px -80px",
            url: "https://www.sogou.com/web?query=",
            type: "external"
        }, {
            name: "淘宝",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -105px -50px",
            position: "-40px -80px",
            url: "https://s.taobao.com/search?q=",
            type: "external"
        }, {
            name: "京东",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -80px -75px",
            position: "0px -120px",
            url: "http://search.jd.com/Search?keyword=",
            type: "external"
        }, {
            name: "天猫",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -105px -75px",
            position: "-40px -120px",
            url: "https://list.tmall.com/search_product.htm?q=",
            type: "external"
        }, {
            name: "知乎",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -105px -100px",
            position: "-40px -160px",
            url: "https://www.zhihu.com/search?type=content&q=",
            type: "external"
        }, {
            name: "微博",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -80px -125px",
            position: "0px -200px",
            url: "https://s.weibo.com/weibo/",
            type: "external"
        }, {
            name: "B站",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -105px -125px",
            position: "-40px -200px",
            url: "http://search.bilibili.com/all?keyword=",
            type: "external"
        }, {
            name: "豆瓣",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -80px -150px",
            position: "0px -240px",
            url: "https://www.douban.com/search?source=suggest&q=",
            type: "external"
        }, {
            name: "优酷",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -105px -150px",
            position: "-40px -240px",
            url: "https://so.youku.com/search_video/q_",
            type: "external"
        }, {
            name: "GitHub",
            img: "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png') -80px -175px",
            position: "0px -280px",
            url: "https://github.com/search?utf8=✓&q=",
            type: "external"
        }]
    };
    var localSearchData = localStorage.getItem("searchData");
    if (localSearchData) {
        try {
            searchData = JSON.parse(localSearchData)
        } catch (error) {
            localStorage.removeItem("searchData")
        }
    }

    ensureSiteSearchEngine();

    function ensureSiteSearchEngine() {
        if (!Array.isArray(searchData.data)) {
            searchData.data = [];
        }

        var hasSiteSearch = searchData.data.some(function (item) {
            return item.url === siteSearchUrl
        });

        if (!hasSiteSearch) {
            searchData.data.unshift({
                name: "站内",
                img: siteSearchIcon,
                position: siteSearchIcon,
                url: siteSearchUrl,
                type: "site"
            })
        }

        searchData.data.forEach(function (item) {
            if (!item.type) {
                item.type = item.url === siteSearchUrl ? "site" : "external"
            }

            if (item.url === siteSearchUrl) {
                item.name = "站内";
                item.img = siteSearchIcon;
                item.position = siteSearchIcon;
                item.type = "site"
            }
        });

        if (!searchData.thisSearch) {
            searchData.thisSearch = siteSearchUrl
        }

        if (isSiteSearch()) {
            searchData.thisSearchIcon = siteSearchIcon
        }
    }

    function isSiteSearch() {
        return searchData.thisSearch === siteSearchUrl
    }

    function showMessage(message) {
        if (window.layer && typeof window.layer.msg === "function") {
            layer.msg(message, { time: 700 }, function () {
                $("#txt").focus()
            });
            return;
        }

        alert(message);
        $("#txt").focus()
    }

    function clearSuggestions() {
        $("#box ul").html("");
        $("#box").removeClass("site-search-results").css("display", "none");
        hotList = 0;
        siteResults = [];
        listIndex = -1
    }

    function normalizeSearchText(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, "")
    }

    function getSiteItems() {
        return $(".site-card-col").map(function () {
            var $item = $(this);
            return {
                element: this,
                name: $item.attr("data-search-name") || "",
                description: $item.attr("data-search-description") || "",
                url: $item.attr("data-search-url") || "",
                category: $item.attr("data-search-category") || "",
                subCategory: $item.attr("data-search-sub-category") || ""
            }
        }).get()
    }

    function scoreSiteItem(item, keyword) {
        var name = normalizeSearchText(item.name);

        if (name === keyword) {
            return 100
        }

        if (name.indexOf(keyword) === 0) {
            return 80
        }

        if (name.indexOf(keyword) !== -1) {
            return 60
        }

        return 0
    }

    function renderSiteResults(value) {
        var keyword = normalizeSearchText(value);
        var $list = $("#box ul");

        $list.html("");
        $("#box").addClass("site-search-results");
        siteResults = [];
        hotList = 0;
        listIndex = -1;

        if (!keyword) {
            $("#box").css("display", "none");
            return
        }

        siteResults = getSiteItems()
            .map(function (item) {
                item.score = scoreSiteItem(item, keyword);
                return item
            })
            .filter(function (item) {
                return item.score > 0
            })
            .sort(function (left, right) {
                return right.score - left.score
            })
            .slice(0, 8);

        hotList = siteResults.length;

        if (!siteResults.length) {
            $("<li>", { class: "site-search-empty", text: "没有找到站内结果" }).appendTo($list);
            $("#box").css("display", "block");
            return
        }

        siteResults.forEach(function (item, index) {
            var categoryText = item.subCategory ? item.category + " / " + item.subCategory : item.category;
            var $li = $("<li>", { "data-site-index": index });
            $("<span>", { text: index + 1 }).appendTo($li);
            $("<strong>", { text: item.name }).appendTo($li);
            $("<small>", { text: categoryText }).appendTo($li);
            $("<p>", { text: item.description }).appendTo($li);
            $li.on("click", function () {
                activateSiteResult(siteResults[index])
            });
            $li.appendTo($list)
        });

        $("#box").css("display", "block")
    }

    function activateSiteResult(result) {
        if (!result || !result.element) {
            return
        }

        function activateSubCategory() {
            if (!result.subCategory) {
                return
            }

            var $parentLinks = $(".sub-category-link[data-parent-category][data-sub-category]").filter(function () {
                return $(this).attr("data-parent-category") === result.category
            });
            var $targetLinks = $parentLinks.filter(function () {
                return $(this).attr("data-parent-category") === result.category &&
                    $(this).attr("data-sub-category") === result.subCategory
            });
            var $parentPanels = $(".sub-category-panel[data-parent-category][data-sub-category]").filter(function () {
                return $(this).attr("data-parent-category") === result.category
            });
            var $targetPanels = $parentPanels.filter(function () {
                return $(this).attr("data-sub-category") === result.subCategory
            });

            $parentLinks.removeClass("is-current");
            $targetLinks.addClass("is-current");
            $parentPanels.removeClass("is-active");
            $targetPanels.addClass("is-active");
            $(".nav-category").removeClass("is-active").filter(function () {
                return $(this).attr("data-category") === result.category
            }).addClass("is-active")
        }

        activateSubCategory();

        function scrollInnerContainer($target) {
            var $scrollBox = $target.closest(".nav-card-scroll.has-inner-scroll");

            if (!$scrollBox.length) {
                return
            }

            var targetTop = $target.position().top + $scrollBox.scrollTop() - 12;

            $scrollBox.animate({
                scrollTop: Math.max(targetTop, 0)
            }, {
                duration: 300,
                easing: "swing"
            })
        }

        window.setTimeout(function () {
            var $target = $(result.element);
            var $widget = $target.find(".xe-widget").first();
            var $scrollBox = $target.closest(".nav-card-scroll.has-inner-scroll");
            var topTarget = $scrollBox.length ? $scrollBox.closest(".nav-category") : $target;
            var top = Math.max(topTarget.offset().top - 96, 0);

            scrollInnerContainer($target);

            $("html, body").animate({
                scrollTop: top
            }, {
                duration: 360,
                easing: "swing",
                complete: activateSubCategory
            });

            $(".site-search-hit").removeClass("site-search-hit");
            $widget.addClass("site-search-hit");

            window.setTimeout(function () {
                $widget.removeClass("site-search-hit")
            }, 1800);
        }, 80);

        clearSuggestions()
    }

    function submitSiteSearch() {
        var textValue = $("#txt").val();

        if (!textValue) {
            showMessage("请输入关键词！");
            return
        }

        if (!siteResults.length) {
            renderSiteResults(textValue)
        }

        if (siteResults.length) {
            var selectedResult = siteResults[listIndex] || siteResults[0];
            activateSiteResult(selectedResult);
            return
        }

        showMessage("没有找到站内结果")
    }

    function filterChildren(element) {
        var thisText = $(element).contents().filter(function (index, content) {
            return content.nodeType === 3
        }).text().trim();
        return thisText
    }
    function getHotkeyword(value) {
        $.ajax({
            type: "GET",
            url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
            async: true,
            data: {
                wd: value
            },
            dataType: "jsonp",
            jsonp: "cb",
            success: function (res) {
                $("#box ul").text("");
                hotList = res.s.length;
                if (hotList) {
                    $("#box").css("display", "block");
                    for (var i = 0; i < hotList; i++) {
                        $("#box ul").append("<li><span>" + (i + 1) + "</span> " + res.s[i] + "</li>");
                        $("#box ul li").eq(i).click(function () {
                            var thisText = filterChildren(this);
                            $("#txt").val(thisText);
                            window.open(searchData.thisSearch + thisText);
                            $("#box").css("display", "none")
                        });
                        if (i === 0) {
                            $("#box ul li").eq(i).css({
                                "border-top": "none"
                            });
                            $("#box ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#f54545"
                            })
                        } else {
                            if (i === 1) {
                                $("#box ul span").eq(i).css({
                                    "color": "#fff",
                                    "background": "#ff8547"
                                })
                            } else {
                                if (i === 2) {
                                    $("#box ul span").eq(i).css({
                                        "color": "#fff",
                                        "background": "#ffac38"
                                    })
                                }
                            }
                        }
                    }
                } else {
                    $("#box").css("display", "none")
                }
            },
            error: function (res) {
                console.log(res)
            }
        })
    }
    $("#txt").keyup(function (e) {
        if (isSiteSearch()) {
            if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
                return
            }
            renderSiteResults($(this).val());
            return
        }

        if ($(this).val()) {
            if (e.keyCode == 38 || e.keyCode == 40 || !searchData.hotStatus) {
                return
            }
            getHotkeyword($(this).val())
        } else {
            $(".search-clear").css("display", "none");
            $("#box").css("display", "none")
        }
    });
    $("#txt").keydown(function (e) {
        if (e.keyCode === 40) {
            if (!hotList) {
                return
            }
            listIndex === (hotList - 1) ? listIndex = 0 : listIndex++;
            $("#box ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = isSiteSearch() && siteResults[listIndex] ? siteResults[listIndex].name : filterChildren($("#box ul li").eq(listIndex));
            $("#txt").val(hotValue)
        }
        if (e.keyCode === 38) {
            if (!hotList) {
                return
            }
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.returnValue) {
                e.returnValue = false
            }
            listIndex === 0 || listIndex === -1 ? listIndex = (hotList - 1) : listIndex--;
            $("#box ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = isSiteSearch() && siteResults[listIndex] ? siteResults[listIndex].name : filterChildren($("#box ul li").eq(listIndex));
            $("#txt").val(hotValue)
        }
        if (e.keyCode === 13) {
            if (isSiteSearch()) {
                submitSiteSearch();
                return
            }

            window.open(searchData.thisSearch + $("#txt").val());
            $("#box").css("display", "none");
            $("#txt").blur();
            $("#box ul li").removeClass("current");
            listIndex = -1
        }
    });
    $("#txt").focus(function () {
        $(".search-box").css("box-show", "inset 0 1px 2px rgba(27,31,35,.075), 0 0 0 0.2em rgba(3,102,214,.3)");
        if (isSiteSearch()) {
            renderSiteResults($(this).val());
            return
        }

        if ($(this).val() && searchData.hotStatus) {
            getHotkeyword($(this).val())
        }
    });
    $("#txt").blur(function () {
        setTimeout(function () {
            $("#box").css("display", "none")
        }, 250)
    });
    function applySearchIcon(icon) {
        if (/^https?:\/\//i.test(icon) || icon.indexOf("/") === 0) {
            $(".search-icon").css({
                "background-image": "url('" + icon + "')",
                "background-position": "center",
                "background-size": "cover",
                "background-repeat": "no-repeat"
            });
            return
        }

        $(".search-icon").css({
            "background-image": "url('https://npm.elemecdn.com/hassan-assets/navi/search_icon.png')",
            "background-position": icon,
            "background-size": "auto",
            "background-repeat": "no-repeat"
        })
    }

    for (var i = 0; i < searchData.data.length; i++) {
        var iconStyle = /^https?:\/\//i.test(searchData.data[i].img) || searchData.data[i].img.indexOf("/") === 0
            ? "background-image:url('" + searchData.data[i].img + "');background-position:center;background-size:cover;background-repeat:no-repeat;"
            : "background:" + searchData.data[i].img + ";";

        $(".search-engine-list").append('<li><span style="' + iconStyle + '"/></span>' +
            searchData.data[i].name + "</li>")
    }
    $(".search-icon, .search-engine").hover(function () {
        $(".search-engine").css("display", "block")
    }, function () {
        $(".search-engine").css("display", "none")
    });
    $("#hot-btn").click(function () {
        $(this).toggleClass("off");
        searchData.hotStatus = !searchData.hotStatus;
        localStorage.searchData = JSON.stringify(searchData)
    });
    searchData.hotStatus ? $("#hot-btn").removeClass("off") : $("#hot-btn").addClass("off");
    $(".search-engine-list li").click(function () {
        var index = $(this).index();
        searchData.thisSearchIcon = searchData.data[index].position;
        applySearchIcon(searchData.thisSearchIcon);
        searchData.thisSearch = searchData.data[index].url;
        $(".search-engine").css("display", "none");
        localStorage.searchData = JSON.stringify(searchData);

        if (isSiteSearch()) {
            renderSiteResults($("#txt").val())
        } else {
            clearSuggestions()
        }
    });
    applySearchIcon(searchData.thisSearchIcon);
    $("#search-btn").click(function () {
        var textValue = $("#txt").val();
        if (isSiteSearch()) {
            submitSiteSearch();
            return
        }

        if (textValue) {
            window.open(searchData.thisSearch + textValue);
            $("#box ul").html("")
        } else {
            showMessage("请输入关键词！")
        }
    })
}

//夜间模式切换
function switchNightMode() {
    var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
    if (night == '0') {
        document.body.classList.add('night');
        document.cookie = "night=1;path=/"
        console.log(' ');
    } else {
        document.body.classList.remove('night');
        document.cookie = "night=0;path=/"
        console.log(' ');
    }
}
