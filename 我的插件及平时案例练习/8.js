F.module("sglobal/widget/pic_free_mode_adapter",
function(e, i) {
    return i = _.Widget.extend({
        initialize: function() {
            var e = this.$el,
            i = setTimeout(function() {
                e.addClass("pic_free_mode")
            },
            1e3),
            o = new Image;
            o.onerror = function() {
                clearTimeout(i),
                e.removeClass("pic_free_mode")
            },
            o.src = "//0.0.0.0/"
        }
    })
},
[]);
F.module("sglobal/widget/appStarterConf",
function(t, e) {
    return e = _.Widget.extend({
        initialize: function() {
            PageUnit.load("app_starter_conf_port")
        }
    })
},
[]);
F.module("sglobal/widget/cloudaPush",
function(t, e) {
    var o = "ptpt",
    n = "/mo/q/lightpush/getPushinfobyPushtoken",
    i = "/mo/q/lightpush/updatePushinfo";
    return e = _.Widget.extend({
        initialize: function(t) {
            var e = new Date,
            n = t.uid,
            i = $.cookie(o),
            s = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate();
            if (this.options = $.extend({
                nonce: "",
                csrftoken: "",
                uid: ""
            },
            t), this.todayDateNumber = +new Date(s), this.tomorrowDate = new Date(s + " 23:59:59"), this.cbflag = 0, i) if (0 == n) this.cbflag = 2;
            else {
                if (i == n) return;
                this.cbflag = 1
            } else {
                if (0 == n) return;
                this.cbflag = 1
            }
            clouda.checkSupports(["mbaas.push"], _.bind(this.registerUnicast, this), _.bind(this.cannotGetPushtoken, this))
        },
        registerUnicast: function() {
            var t = this;
            clouda.mbaas.push.registerUnicast({
                nonce: t.options.nonce,
                csrftoken: t.options.csrftoken,
                onsuccess: function(e) {
                    0 == e.error ? t.afterGetPushtoken(e.pushToken) : t.cannotGetPushtoken(e.error)
                },
                onfail: function(e) {
                    t.cannotGetPushtoken(e)
                }
            })
        },
        cannotGetPushtoken: function() {
            this.setCookiefor1d()
        },
        afterGetPushtoken: function(t) {
            1 == this.cbflag ? this.getPushinfobyPushtoken(t) : 2 == this.cbflag && this.updatePushinfo($.cookie(o), t, "offline",
            function() {
                $.removeCookie(o)
            })
        },
        getPushinfobyPushtoken: function(t) {
            var e = this;
            $.getJSON(n, {
                push_token: t
            },
            function(o) {
                e.setCookiefor1d(),
                0 == o.no && (0 == o.data.length || o.data.user_id != e.options.uid || 1e3 * o.data.expire_time < e.todayDateNumber) && e.updatePushinfo(e.options.uid, t, "online")
            })
        },
        updatePushinfo: function(t, e, o, n) {
            $.getJSON(i, {
                user_id: t,
                push_token: e,
                type: o
            },
            function(t) {
                0 == t.no && $.isFunction(n) && n()
            })
        },
        setCookiefor1d: function() {
            $.cookie(o, this.options.uid, this.tomorrowDate)
        }
    })
},
[]);
F.module("spostor/widget/editor_content",
function(t, e) {
    function n(t) {
        var e, n = "height:" + t.height + ";width:" + t.width;
        return e = '<div class="lay_hide"><div class="j_lay_top lay_top"></div><textarea placeholder="' + t.placeholder + '" style="' + n + '" class="j_editor_content editor_input ' + t.contentClassName + '"></textarea>'
    }
    function i(t, e) {
        for (var n = $(t).val(), i = n.length, o = 0, s = 2 * e, r = 0; i > r; r++) if (o += n.charCodeAt(r) > 255 ? 2 : 1, o > s) {
            $(t).val(n.slice(0, r));
            break
        }
    }
    function o(t, e, n, i, o) {
        var s, r = e.offset().height,
        c = e.offset().width,
        a = '<textarea class="j_auto_height_input editor_input ' + i + '" style="position:absolute;left:-10000px;"></textarea>';
        if (!t.find(".j_auto_height_input").length > 0 ? (s = $(a), t.append(s), s.css("width", c + "px")) : (s = t.find(".j_auto_height_input"), s.css("width", c + "px")), !(r == n && r >= e.tbattr("scrollHeight"))) {
            s.val(e.val());
            var h = s.tbattr("scrollHeight");
            o ? h > n && (e.css("height", h), window.scrollTo(0, e.offset().top + e.offset().height - 100)) : e.css("height", Math.max(h, parseInt(n)))
        }
    }
    var s = F.require("page_data"),
    r = function(t) {
        this._outerContainer = t.outerContainer,
        this._config = {
            height: "80px",
            width: "100%",
            placeholder: PageUnit.load("pb_lzl_postor_conf").content[0],
            contentClassName: "editor_content",
            isAutoHeight: !0,
            wordLimit: 5e3,
            isScrollWhenFocus: !1,
            isAutoScrollWhenInput: !0
        },
        this._eventCenter = t.eventCenter,
        this._contentSel,
        this._isEnable = !0,
        $.extend(this._config, t.config),
        $.extend(this, new _.Events)
    };
    return r.prototype = {
        setConfig: function(t) {
            $.extend(this._config, t)
        },
        getContentSel: function() {
            return this._contentSel
        },
        init: function() {
            var t = n(this._config);
            this._container = $(t),
            this._outerContainer.append(this._container),
            this._contentSel = this._container.find(".j_editor_content"),
            this._opBar = this._container.parents("#j_main_editor_container").find(".j_media_bar")
        },
        initEvents: function() {
            var t = this,
            e = 0;
            this._contentSel.bind("focus",
            function() {
                e = t.getContent().length,
                $.editorFocus = !0,
                t._contentSel[0].setSelectionRange(e, e),
                t.trigger("editor_content_focus"),
                t._eventCenter.trigger("editor_content_focus"),
                t.autoHeight()
            }),
            this._contentSel.bind("blur",
            function() {
                $.editorFocus = !1,
                t.trigger("editor_content_blur"),
                t._eventCenter.trigger("editor_content_blur")
            }),
            this._contentSel.bind("input",
            function(e) {
                t.autoHeight(),
                i(e.target, t._config.wordLimit),
                t.trigger("editor_content_input")
            }),
            this._contentSel.bind("keyup",
            function() {}),
            s.is_login || this._contentSel.parent().bind("click",
            function() {
                UserAccount.login()
            })
        },
        removeEvents: function() {
            this._contentSel.off()
        },
        setEnable: function() {
            this._contentSel.removeAttr("disabled"),
            this.setPlaceholder(this._config.placeholder),
            this._isEnable = !0
        },
        setDisable: function() {
            this._contentSel.tbattr("disabled", "disabled"),
            this.setPlaceholder(""),
            this._isEnable = !1
        },
        isEnable: function() {
            return this._isEnable
        },
        reset: function() {
            this.setContent(""),
            this._contentSel.css("height", this._config.height),
            this.setEnable()
        },
        showFloatLayer: function(t, e) {
            var n = this._outerContainer.find(".j_lay_top");
            n.html(t),
            "function" == typeof e && e(n),
            this.setDisable()
        },
        removeFloatLayer: function() {
            this._outerContainer.find(".j_lay_top").html(""),
            this._outerContainer.css("top", "0"),
            this._outerContainer.css("right", 0),
            this.setEnable()
        },
        getHeight: function() {
            return this._contentSel.offset().height
        },
        focus: function() {
            var t = this;
            this._config.isScrollWhenFocus ? (t._contentSel[0].focus(), window.scrollTo(0, this._contentSel.offset().top - 100)) : t._contentSel[0].focus()
        },
        blur: function() {
            this._contentSel[0].blur()
        },
        insertContent: function(t) {
            var e = this._contentSel.val();
            t && this.setContent(e + t)
        },
        setContent: function(t) {
            var e = t || "";
            this._contentSel.val(e),
            this.autoHeight(),
            this.trigger("editor_content_input")
        },
        setPlaceholder: function(t) {
            this._contentSel.tbattr("placeholder", t)
        },
        getContent: function() {
            return this._contentSel.val()
        },
        changeSmileBtnStatus: function(t) {
            var e = this._contentSel.parents("#j_main_editor_container").find(".j_smile_btn_panel"),
            n = this._contentSel.parents("#j_main_editor_container").find(".j_pic_btn_panel");
            "enable" == t ? (e.removeClass("gray"), n.removeClass("gray")) : (e.addClass("gray"), n.addClass("gray"))
        },
        insertSmile: function(t) {
            var e = "(#" + t + ")";
            this.insertContent(e)
        },
        deleteSmile: function() {
            var t = this._contentSel.val(),
            e = t.replace(/\(#[^\)]+\)$/g, "");
            t = e.length == t.length ? t.substring(0, t.length - 1) : e,
            this.setContent(t)
        },
        replyAt: function(t) {
            var e = "";
            "undefined" != typeof t && (e = "\u56DE\u590D " + t + " :"),
            this.setContent(e)
        },
        autoHeight: function() {
            this._config.isAutoHeight && o(this._outerContainer, this._contentSel, this._config.height.replace("px", ""), this._config.contentClassName, this._config.isAutoScrollWhenInput)
        },
        scrollToBottom: function(t) {
            for (var e = this._outerContainer.offset(), n = e.top, i = e.height, o = n + i + t - window.innerHeight, s = window.pageYOffset, r = 200, c = 10, a = r / c, h = ( - s + o) / a, l = 1; a >= l; l++) !
            function(t) {
                window.setTimeout(function() {
                    scrollTo(0, t * h + s)
                },
                t * c)
            } (l)
        }
    },
    e = r
},
[]);
F.module("spostor/widget/captcha",
function(t, e) {
    function a(t, e, a) {
        var i = "",
        s = e || parseInt(4096 * (1 + Math.random()));
        return "old" == t ? i = '<div class="old_vcode_wrapper" style="display:none;"><span class="captcha_text">\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801:</span><div><input type="text" class="j_captcha_input captcha_input" /><a href="#"><img class="captcha_img j_captcha_img" src="about:blank"/></a></div></div>': "new" == t && (i = (1 == a ? '<div class="panel_topbar j_panel_topbar">\u8F93\u5165\u9A8C\u8BC1\u7801<a href="#" class="j_close_panel close_panel"><span class="btn_close"></span></a></div>': "") + '<div class="vcode_panel_outer_wrapper ' + s + '"><div class="vcode_panel_inner_wrapper"><div class="vcode_error_tip"></div><div class="vcode_panel_inner_upper"><div class="upper_id_wrapper"><div class="upper_id_inner_wrapper">' + (1 == a ? '<div class="vcode_input_tip">\u9A8C\u8BC1\u7801:&nbsp;</div>': "") + '<div class="upper_fake_input"><div order="" class="upper_fake_placeholder vcode_baseImg_' + (1 == a ? "big": "small") + '"></div><div order="" class="upper_fake_placeholder vcode_baseImg_' + (1 == a ? "big": "small") + '"></div><div order="" class="upper_fake_placeholder vcode_baseImg_' + (1 == a ? "big": "small") + '"></div><div order="" class="upper_fake_placeholder vcode_baseImg_' + (1 == a ? "big": "small") + '"></div></div><a class="j_vcode_delete upper_delete"><span class="upper_delete_img"></span></a></div></div><div class="j_vcode_target_img upper_target_img vcode_baseImg_' + (1 == a ? "big": "middle") + '"></div>' + (1 == a ? "": '<a class="j_vcode_submit upper_submit upper_submit_disable" href="#">\u786E\u8BA4</a>') + '<div class="j_vcode_tip upper_tip">\u70B9\u51FB\u6846\u5185\u6587\u5B57\u8F93\u5165\u56FE\u4E2D<span class="PIN_red">\u6C49\u5B57\u6216\u62FC\u97F3</span>\u5BF9\u5E94\u6C49\u5B57</div><!--div class="j_vcode_toggle_type toggle_type">\u8FD4\u56DE\u65E7\u7248</div--><input type="hidden" class="j_captcha_input captcha_input" /></div><div class="vcode_panel_grids_wrapper">' + (1 == a ? '<div class="vcode_panel_input_tip">\u8BF7\u70B9\u51FB\u4EE5\u4E0B\u6309\u94AE\u8F93\u5165\u9A8C\u8BC1\u7801</div>': "") + '<div class="grids_line_wrapper"><a data="00000000" class="grid_button" order="0"><span class="grid_img vcode_baseImg_big vbp_0"></span></a><a data="00010000" class="grid_button" order="1"><span class="grid_img vcode_baseImg_big vbp_1"></span></a><a data="00020000" class="grid_button" order="2"><span class="grid_img vcode_baseImg_big vbp_2"></span></a></div><div class="grids_line_wrapper"><a data="00000001" class="grid_button" order="3"><span class="grid_img vcode_baseImg_big vbp_3"></span></a><a data="00010001" class="grid_button" order="4"><span class="grid_img vcode_baseImg_big vbp_4"></span></a><a data="00020001" class="grid_button" order="5"><span class="grid_img vcode_baseImg_big vbp_5"></span></a></div><div class="grids_line_wrapper"><a data="00000002" class="grid_button" order="6"><span class="grid_img vcode_baseImg_big vbp_6"></span></a><a data="00010002" class="grid_button" order="7"><span class="grid_img vcode_baseImg_big vbp_7"></span></a><a data="00020002" class="grid_button" order="8"><span class="grid_img vcode_baseImg_big vbp_8"></span></a></div></div></div></div>'),
        i
    }
    var i = 11,
    s = 0,
    n = 4,
    c = function(t) {
        this._config = {
            request_param: {}
        },
        this._callback = t.callback || {},
        this._isNewCaptcha = t.isNewCaptcha,
        this._Classid = "vcode_panel_id" + parseInt(4096 * (1 + Math.random())),
        this._outerContainer = t.outerContainer || "",
        this._isNeedCaptcha = !1,
        this._isTyping = !1,
        this._isRequesting = !1,
        this._hasRequest = !1,
        this._isShowing = !1,
        this._requestCaptchaType = $.cookie("spostor_vcode_type_switch") || i,
        this._receiveCaptchaType = $.cookie("spostor_vcode_type_switch") || n,
        this._indexArray = [],
        this._md5 = "",
        this._vcodeDomain = t.vcodeDomain || "//tieba.baidu.com/",
        this._url = {
            getCaptcha: t.base_url + "getvcode",
            captchaImg: this._vcodeDomain + "cgi-bin/genimg"
        };
        var e = t.donotHideCaptchaSelector;
        this._donotHideCaptchaSelector = "string" == typeof e ? e: $.isArray(e) ? e.join(",") : null,
        this.fid,
        this.word,
        $.extend(this, new _.Events)
    };
    return c.prototype = {
        init: function() {
            var t = a("old"),
            e = a("new", this._Classid, this._isNewCaptcha);
            this._outerContainer.html(t + e),
            this._containerOld = this._outerContainer.find(".old_vcode_wrapper"),
            this._containerNew = this._outerContainer.find(".vcode_panel_outer_wrapper"),
            this._captchaInput = this._containerOld.find(".j_captcha_input"),
            this._captchaInputNew = this._containerNew.find(".j_captcha_input"),
            this._captchaFakeHolders = this._containerNew.find(".upper_fake_placeholder")
        },
        initEvents: function() {
            var t = this;
            $("body").addClass("portrait"),
            this._captchaInput.bind("keydown",
            function(e) {
                13 == e.key && t.trigger("captcha_enter_key_down")
            }),
            this._outerContainer.delegate(".j_captcha_img", "click",
            function(e) {
                e.preventDefault(),
                t._refreshCaptcha()
            }),
            this._containerNew.delegate(".j_vcode_target_img", "touchstart",
            function(e) {
                e.preventDefault(),
                $(this).addClass("upper_target_img_clicked"),
                t._refreshCaptcha()
            }),
            this._containerNew.delegate(".j_vcode_target_img", "touchend",
            function(t) {
                t.preventDefault(),
                $(this).removeClass("upper_target_img_clicked")
            }),
            this._containerNew.delegate(".grid_button", "touchstart",
            function(e) {
                if (e.preventDefault(), 4 == t._indexArray.length || $(this).hasClass("grid_selected")) return ! 1;
                var a = $(this).addClass("grid_selected grid_clicked").tbattr("order"),
                i = t._captchaFakeHolders[t._indexArray.length],
                s = $(this).tbattr("data");
                $(i).addClass("vbp_" + a).tbattr("order", a),
                t._indexArray.push(s)
            }),
            this.bindGridTouch(),
            this._containerNew.delegate(".j_vcode_delete", "touchstart",
            function(e) {
                e.preventDefault();
                var a = t._captchaFakeHolders[t._indexArray.length - 1],
                i = $(a).tbattr("order"),
                s = "vbp_" + i;
                $(a).removeClass(s),
                t._containerNew.find(".grid_button").eq(i).removeClass("grid_selected"),
                t._indexArray = t._indexArray.slice(0, -1)
            }),
            this._containerNew.delegate(".j_vcode_submit", "click",
            function(e) {
                e.preventDefault(),
                t.triggerVcodeSubmit()
            }),
            $.browser.baiduFrame || 1 == this._isNewCaptcha || $(window).on("orientationchange resize",
            function() {
                0 == window.orientation || 180 == window.orientation ? $("body").removeClass("landscape").addClass("portrait") : $("body").removeClass("portrait").addClass("landscape"),
                t._isShowing && setTimeout(function() {
                    var e = $.trim(t._outerContainer.find(".vcode_error_tip").html());
                    t._scrollToPos(e && 27)
                },
                0)
            }),
            $(document).on("click.hidevcode",
            function(e) {
                var a = $(e.target);
                if (t._config.isListenTouch && !t._isTyping && 0 === a.closest(".vcode_panel_outer_wrapper").length) {
                    if (null !== t._donotHideCaptchaSelector && a.is(t._donotHideCaptchaSelector)) return;
                    t._toggleNewCaptchaPanel("hide")
                }
            }),
            t.initialize()
        },
        _bindTouchEvent: function() {
            this._config.isListenTouch = !0
        },
        _unBindTouchEvent: function() {
            this._config.isListenTouch = !1
        },
        removeEvents: function() {
            this._containerOld.find(".j_captcha_input").off(),
            this._outerContainer.off(),
            this._containerNew.off()
        },
        bindGridTouch: function() {
            this._containerNew.delegate(".grid_button", "touchend",
            function() {
                $(this).removeClass("grid_clicked")
            })
        },
        triggerVcodeSubmit: function() {
            var t = this;
            return 4 !== t._indexArray.length ? !1 : (t._isTyping = !1, t._isShowing = !1, t._captchaInputNew.val(t._indexArray.join("")), t._toggleOutsidePanel("show"), t.trigger("captcha_enter_key_down"), void 0)
        },
        _refreshCaptcha: function() {
            var t = this;
            this._request(function(e, a) {
                t.updateCaptchaImg(e, a, void 0, !0)
            })
        },
        _request: function(t) {
            var e = {},
            a = this;
            this._callback && "function" == typeof this._callback.getCaptchaData && (e = this._callback.getCaptchaData()),
            e.word || (e.word = a.word, e.fid = a.fid),
            e._t = (new Date).getTime(),
            e.tag = this._requestCaptchaType,
            this._isRequesting = !0,
            $.ajax({
                type: "get",
                url: this._url.getCaptcha,
                data: e,
                dataType: "json",
                success: function(e) {
                    a._isRequesting = !1,
                    a._hasRequest = !0,
                    e && 0 == e.no ? (a._isNeedCaptcha = !0, a._md5 = e.data.vcode_md5, a._receiveCaptchaType = e.data.vcode_type, "function" == typeof t && t(e.data.vcode_md5, e.data.vcode_type)) : a._isNeedCaptcha = !1
                },
                error: function() {
                    a._isRequesting = !1
                }
            })
        },
        _scrollToPos: function(t) {
            var e = isNaN(parseInt(t, 10)) ? 0 : parseInt(t, 10);
            90 == window.orientation || -90 == window.orientation ? this.trigger("captcha_page_scroll_to_bottom", 194 + e) : this.trigger("captcha_page_scroll_to_bottom", 218 + e)
        },
        _toggleOutsidePanel: function(t) {
            this.trigger("captcha_toggle_bottom_panel", t)
        },
        _toggleNewCaptchaPanel: function(t, e) {
            "show" == t ? (this._isShowing = !0, this._scrollToPos(e), this._toggleOutsidePanel("hide"), this._containerOld.hide(), this._containerNew.show(), this._outerContainer.show()) : "hide" == t && (this._isShowing = !1, this._toggleOutsidePanel("show"), this._outerContainer.hide(), 1 == this._isNewCaptcha && this.fixPanelTop()),
            1 == this._isNewCaptcha && this.changeTopbarStatus(t)
        },
        _changeNewCaptchaImage: function(t, e) {
            $("body").append("<style>.portrait ." + t + " .vcode_baseImg_big, .landscape ." + t + " .vcode_baseImg_big, ." + t + " .vcode_baseImg_small, ." + t + " .vcode_baseImg_middle{background-image: url(" + e + ");</style>")
        },
        setConfig: function(t) {
            $.extend(this._config, t)
        },
        isNeedCaptcha: function() {
            return this._isNeedCaptcha
        },
        getMD5: function() {
            return this._md5
        },
        getInputCaptcha: function() {
            return this._captchaInput.val() || this._captchaInputNew.val()
        },
        getCaptchaType: function() {
            return this._requestCaptchaType
        },
        getIsTyping: function() {
            return this._isTyping
        },
        focus: function() {
            this._captchaInput.focus()
        },
        blur: function() {
            this._captchaInput.blur()
        },
        hide: function() {
            this._outerContainer.hide()
        },
        reset: function() {
            this._hasRequest = !1,
            this.setCaptchaInput(""),
            this._isNeedCaptcha = !1,
            this._md5 = ""
        },
        setCaptchaInput: function(t) {
            this._captchaInput.val("")
        },
        showCaptchaPanel: function(t, e, a, i, s, n, c) {
            var r = this,
            o = t || this._md5,
            _ = this._outerContainer.find(".vcode_error_tip").html();
            n && (r.fid = s, r.word = n),
            c && this.displayCaptchaErrorTip(c),
            o ? (this.updateCaptchaImg(o, e, a, i, (c || _) && 1), this._isNeedCaptcha = !0, this._hasRequest = !0) : this._hasRequest || this._request(function(t, e) {
                r.updateCaptchaImg(t, e, void 0, !0, c && 1)
            })
        },
        _clearNewCaptchaInput: function(t, e) {
            var a = "string" == typeof t ? t: '\u70B9\u51FB\u6846\u5185\u6587\u5B57\u8F93\u5165\u56FE\u4E2D<span class="PIN_red">\u6C49\u5B57\u6216\u62FC\u97F3</span>\u5BF9\u5E94\u6C49\u5B57';
            this._changeNewCaptchaImage(this._Classid, e),
            this._indexArray = [],
            this._captchaFakeHolders.each(function() {
                $(this).removeClass("vbp_" + $(this).tbattr("order"))
            }),
            this._containerNew.find(".grid_button").each(function() {
                $(this).removeClass("grid_selected")
            }),
            (1 != this._isNewCaptcha || 1 == this._isNewCaptcha && "\u70B9\u51FB\u5237\u65B0\u9A8C\u8BC1\u7801" == a) && this._containerNew.find(".j_vcode_tip").html(a),
            this._isTyping = !0
        },
        updateCaptchaImg: function(t, e, a, c, r) {
            this._md5 = t || this._md5,
            this._receiveCaptchaType = "undefined" == typeof e ? this._receiveCaptchaType: e;
            var o = this._url.captchaImg + "?" + this._md5;
            parseInt(this._receiveCaptchaType) != n ? (this._containerOld.find(".j_captcha_img").tbattr("src", o), this.setCaptchaInput(""), this._containerNew.hide(), this._containerOld.show(), $(".j_top_thread_box_panel").length ? this._outerContainer.css({
                "background-color": "#e1e5e9",
                top: "220px"
            }) : 0 == $(".j_interview_editor").length ? this._outerContainer.css({
                "background-color": "initial",
                top: "250px"
            }) : this._outerContainer.css({
                "background-color": "initial",
                position: "initial"
            }), this._outerContainer.show(), $(".j_panel_topbar").hide(), this._requestCaptchaType = s) : (c && this._clearNewCaptchaInput(a, o), this._toggleNewCaptchaPanel("show", r && 27), this._requestCaptchaType = i)
        },
        displayCaptchaErrorTip: function(t) {
            this._outerContainer.find(".vcode_error_tip").html(t)
        },
        initialize: function() {}
    },
    c.extend = _.extend,
    e = c
},
[]);
F.module("spostor/widget/smile",
function(i, e) {
    function s(i) {
        var e = "",
        s = "";
        return s = ['<div class="j_smile_btn_group smile_btn_group">', '<a class="smile_active smile_btn_pic" href="javascript:;"><span class="smile_icon"></span></a>', '<a class="smile_btn_font" href="javascript:;">^_^</a>', '<a class="smile_btn_del" href="javascript:;"><b class="smile_btn_close"></b></a>', "</div>"].join(""),
        e = t(i) + n(i) + s
    }
    function t(i) {
        for (var e = "",
        s = o.smileFont,
        t = [], n = "", l = s.length, a = Math.ceil(l / i.smileFontLength) * i.smileFontLength, r = 0; a > r; r++) n += l > r ? '<a href="#">' + s[r] + "</a>": '<a href="#"></a>',
        (r + 1) % i.smileFontLength == 0 && (t.push("<li>" + n + "</li>"), n = "");
        return e = '<div style="display:none;" class="j_font smile_container smile_font"><ul class="j_font_container smile_list">' + t.join("") + '</ul><div class="j_slide_aim smile_slide_aim"></div></div>'
    }
    function n(i) {
        var e = "",
        s = o["default"],
        t = [],
        n = [],
        l = 0,
        a = 0,
        r = 0,
        _ = 0;
        for (var c in s) {
            a = o.smile_size[c],
            l = s[c].length;
            for (var m = 0; l > m; m++) n.push('<a href="#" data-smile="' + encodeURIComponent(s[c][m]) + '"><span class="' + c + '" style="background-position-y: -' + a * m + 'px;"></span></a>'),
            r++,
            r % i.smilePicLength == 0 && (t.push("<li><div>" + n.join("") + "</div></li>"), n = [])
        }
        if (_ = i.smilePicLength - r % i.smilePicLength, _ > 0 && _ != i.smilePicLength) {
            for (var h = 0; _ > h; h++) n.push('<a href="#"></a>');
            t.push("<li><div>" + n.join("") + "</div></li>")
        }
        return e = '<div class="j_smile smile_container smile_smile"><ul class="j_smile_container smile_list">' + t.join("") + '</ul><div class="j_slide_aim smile_slide_aim"></div></div>'
    }
    function l(i) {
        return '<a href="#" class="j_smile_btn smile_btn ' + i.enableClass + '"><span class="media_bar_btn_text">\u8868\u60C5</span></a>'
    }
    function a(i) {
        var e = this;
        i.delegate(".j_smile_btn_group", "touchmove",
        function(i) {
            i.preventDefault()
        }),
        i.delegate(".j_slide_aim", "touchmove",
        function(i) {
            i.preventDefault()
        }),
        i.delegate(".j_smile_btn_group a", "click",
        function(s) {
            s.preventDefault();
            var t = i.find(".j_smile"),
            n = i.find(".j_font"),
            l = $(".j_smile_btn_group a", i).index($(s.currentTarget)),
            a = $(".j_smile_btn_group a", i).eq(0).find(".smile_icon");
            if (0 == l) t.show(),
            n.hide(),
            a.removeClass("smile_icon_active");
            else {
                if (1 != l) return e.trigger("smile_delete"),
                void 0;
                a.addClass("smile_icon_active"),
                t.hide(),
                n.show()
            }
            $(".j_smile_btn_group", i).find(".smile_active").removeClass("smile_active"),
            $(this).addClass("smile_active")
        }),
        i.delegate(".j_smile a", "click",
        function(i) {
            var s = $(i.currentTarget),
            t = s.tbattr("data-smile");
            c && (s.addClass("smile_ele_click"), setTimeout(function() {
                s.removeClass("smile_ele_click")
            },
            200)),
            t && e.trigger("smile_insert", decodeURIComponent(t)),
            i.preventDefault()
        }),
        i.delegate(".j_font a", "click",
        function(i) {
            var s = $(i.currentTarget),
            t = s.text();
            c && (s.addClass("smile_ele_click"), setTimeout(function() {
                s.removeClass("smile_ele_click")
            },
            200)),
            t && e.trigger("smile_font_insert", t),
            i.preventDefault()
        })
    }
    var o = {
        smile_size: {
            smile_popo: 30,
            smile_tusiji: 35,
            smile_ali: 35,
            smile_tb10: 30
        },
        "default": {
            smile_popo: ["\u5475\u5475", "\u54C8\u54C8", "\u5410\u820C", "\u554A", "\u9177", "\u6012", "\u5F00\u5FC3", "\u6C57", "\u6CEA", "\u9ED1\u7EBF", "\u9119\u89C6", "\u4E0D\u9AD8\u5174", "\u771F\u68D2", "\u94B1", "\u7591\u95EE", "\u9634\u9669", "\u5410", "\u54A6", "\u59D4\u5C48", "\u82B1\u5FC3", "\u547C~", "\u7B11\u773C", "\u51B7", "\u592A\u5F00\u5FC3", "\u6ED1\u7A3D", "\u52C9\u5F3A", "\u72C2\u6C57", "\u4E56", "\u7761\u89C9", "\u60CA\u54ED", "\u5347\u8D77", "\u60CA\u8BB6", "\u55B7", "\u7231\u5FC3", "\u5FC3\u788E", "\u73AB\u7470", "\u793C\u7269", "\u5F69\u8679", "\u661F\u661F\u6708\u4EAE", "\u592A\u9633", "\u94B1\u5E01", "\u706F\u6CE1", "\u8336\u676F", "\u86CB\u7CD5", "\u97F3\u4E50", "haha", "\u80DC\u5229", "\u5927\u62C7\u6307", "\u5F31", "OK"],
            smile_tusiji: ["Kiss~", "Love", "Yeah", "\u554A!", "\u80CC\u626D", "\u9876\u8D77", "\u6296\u80F8", "88", "\u6C57!", "\u778C\u7761", "\u9C81\u62C9", "\u62CD\u7816", "\u63C9\u8138", "\u751F\u65E5\u5FEB\u4E50"],
            smile_ali: ["\u8D56\u76AE", "\u611F\u52A8", "\u60CA\u8BB6", "\u6012\u6C14", "\u54ED\u6CE3", "\u5403\u60CA", "\u5632\u5F04", "\u98D8\u8FC7", "\u8F6C\u5708\u54ED", "\u795E\u7ECF\u75C5", "\u63EA\u8033\u6735", "\u60CA\u6C57", "\u9690\u8EAB", "\u4E0D\u8981\u561B", "\u9041", "\u4E0D\u516C\u5E73", "\u722C\u6765\u4E86", "\u86CB\u82B1\u54ED", "\u6E29\u6696", "\u70B9\u5934", "\u6492\u94B1", "\u732E\u82B1", "\u5BD2", "\u50BB\u7B11", "\u626D\u626D", "\u75AF", "\u6293\u72C2", "\u6293", "\u8737", "\u6320\u5899", "\u72C2\u7B11", "\u62B1\u6795", "\u543C\u53EB", "\u56B7", "\u5520\u53E8", "\u634F\u8138", "\u72C2\u7B11", "\u90C1\u95F7", "\u6F5C\u6C34", "\u5F00\u5FC3", "\u51B7\u7B11\u8BDD", "\u9876", "\u6F5C", "\u753B\u5708\u5708", "\u73A9\u7535\u8111", "\u5410", "\u54ED\u7740\u8DD1", "\u963F\u72F8\u4FA0", "\u51B7\u6B7B\u4E86", "\u60C6\u6005~", "\u6478\u5934", "\u8E6D", "\u6253\u6EDA", "\u53E9\u62DC", "\u6478", "\u6570\u94B1", "\u62D6\u8D70", "\u70ED", "\u52A01", "\u538B\u529B", "\u8868\u903C\u6211", "\u4EBA\u5462", "\u6447\u6643", "\u6253\u5730\u9F20", "\u8FD9\u4E2A\u5C4C", "\u6050\u614C", "\u6655\u4E4E\u4E4E", "\u6D6E\u4E91", "\u7ED9\u529B", "\u676F\u5177\u4E86"],
            smile_tb10: ["\u8E66\u8E66\u8DF3\u8DF3", "\u6643\u60A0", "\u6447\u6447\u6446\u6446", "\u5927\u6492\u82B1", "\u9AD8\u9AD8\u5174\u5174", "\u5F39\u5409\u4ED6", "\u9B54\u6CD5\u68D2", "\u625B\u5927\u65D7", "\u70B9\u8721\u70DB", "\u5927\u79E7\u6B4C", "\u8D34\u5427\u5341\u5468\u5E74", "\u5341\u5468\u5E74"]
        },
        smileFont: ["^_^", "(-__-)b", "=_=", "\u2299\uFE4F\u2299", "( \uFFE3 \u25BD\uFFE3)", "\u3012\u25BD\u3012", "\u22990\u2299", "\u2229\u2582\u2229", "\u2267\uFE4F\u2266", "\u02CB\u03C9\u02CA", "=\uFFE3\u03C9\uFFE3=", "\u256E(\u256F\u25BD\u2570)\u256D", "(\u22673\u2266)/", "\u2267\u25BD\u2266y", "\uFF08\u252C\uFF3F\u252C\uFF09", "\u256E\uFF08\uFFE3\u25BD\uFFE3\uFF09\u256D", "o(\u2267v\u2266)o", "\u256E(\u256F3\u2570)\u256D", "\uFF1E\u2582\uFF1C", "\u256F0\u2570", "\uFF1E\uFE3F\uFF1C", "\u256F\uFE3F\u2570", "m(_ _)m", "\u2229\u03C9\u2229", "\uFF0B\uFE4F\uFF0B", "\u256F\u2582\u2570", "\uFF1E\uFE4F\uFF1C", "\u256F\u03C9\u2570", "\u02C7\uFE3F\u02C7", "(^ ^)/~~~", "(O ^ ~ ^ O)", "(-_-)zzz", "\u256F\uFE4F\u2570", "(^_-)-\u2606", "\uFF08\uFF3Ev\uFF3E\uFF09", "\uFF3C(\u25CEo\u25CE)\uFF0F", "(@_@)", "(^O^)\uFF0F", "\u256F\u25B3\u2570", "(^_^\u30E1)", "\u222A\uFE4F\u222A", "\uFF08#\uFF0D.\uFF0D\uFF09", "\uFF08\uFF5E\uFFE3\u25BD\uFFE3\uFF5E\uFF09", "<(\uFFE33\uFFE3)>", "\u2261\uFFE3\uFE4F\uFFE3\u2261"]
    },
    r = !1,
    c = !1; !
    function() {
        var i = $.os;
        i.ios && parseInt(i.version) > 4 ? r = !0 : i.android && parseInt(i.version) > 2 && (r = !0),
        i.android && $.browser.uc && $.browser.version && 0 === $.browser.version.search(/^9.(0|1|2)/) && (c = !0)
    } ();
    var m = function(i) {
        this._btnContainer = i.btnContainer,
        this.smileContainer = i.panelContainer,
        this.hasSmileListInit = !1,
        this.smileIsShow = !1,
        this.hasSmileEventInit = !1,
        this._config = {
            enableClass: "smile_enable",
            disableClass: "smile_disable",
            isPageScroll: !1,
            index: 0,
            smilePicLength: 21,
            smileFontLength: 12
        },
        this._isEnable = !0,
        this._isSmileBtnClick = !1,
        this._smileBtn = null,
        this._eventCenter = i.eventCenter,
        $.extend(this, new _.Events)
    };
    return m.prototype = {
        setConfig: function(i) {
            $.extend(this._config, i)
        },
        init: function() {
            var i = this,
            e = $(l(i._config));
            i._btnContainer.html(e),
            i._smileBtn = e
        },
        initEvents: function() {
            var i = this,
            e = i._smileBtn,
            s = this.smileContainer,
            t = {};
            e.bind("click",
            function(e) {
                e.preventDefault(),
                i.smileBtnEvent(),
                t = e
            }),
            !this.hasSmileEventInit && a.call(i, s),
            this.hasSmileEventInit = !0
        },
        removeEvents: function() {},
        setDisable: function() {
            this._isEnable && (this._isEnable = !1, this._smileBtn.removeClass(this._config.enableClass).addClass(this._config.disableClass))
        },
        setEnable: function() {
            this._isEnable || (this._isEnable = !0, this._smileBtn.removeClass(this._config.disableClass).addClass(this._config.enableClass))
        },
        reset: function() {
            this.setEnable()
        },
        hide: function() {
            var i = this;
            i.smileContainer.hide(),
            i.setEnable(),
            this.smileIsShow = !1
        },
        show: function() {
            {
                var i = this;
                i._smileBtn
            }
            i.setDisable(),
            i.smileContainer.show(),
            i.smileIsShow = !0,
            i._eventCenter.trigger("smile_panel_show")
        },
        _scrollAnimateBind: function(i, e) {
            var s = {
                horizon: 1,
                preventDefaultScroll: !0,
                onScrollEnd: function() {
                    i.find(".j_slide_aim>a").removeClass("aim_active").eq(this.currentPage).addClass("aim_active")
                }
            };
            return $.extend(s, e),
            new $.Scroll(i, s)
        },
        _scrollBindAndriod: function(i) {
            function e(i, e) {
                s = i.width(),
                i.css({
                    left: e * s + "px",
                    "-webkit-transition": "left ease .3s"
                }),
                r[1] = e * s
            }
            var s, t, n, l = 0,
            a = 0,
            o = 0,
            r = [0, 0],
            _ = 0,
            c = !1,
            m = i.children().length - 1;
            i.on("touchstart.smile",
            function(i) {
                l = i.touches[0].pageX,
                r[0] = l
            }).on("touchmove.smile",
            function(i) {
                i.preventDefault(),
                c = !0,
                _ = i.touches[0].pageX,
                r[1] += _ > r[0] && 0 == o ? (_ - r[0]) / 2 : _ < r[0] && Math.abs(o) == m ? (_ - r[0]) / 2 : _ - r[0],
                $(this).css("left", r[1] + "px"),
                r[0] = _
            }).on("touchend.smile touchcancel.smile",
            function(i) {
                return c && i.preventDefault(),
                c = !1,
                a = i.changedTouches[0].pageX,
                n = a - l,
                t = $(window).width() / 10,
                Math.abs(n) < t ? (e($(this), o), void 0) : (0 > n && Math.abs(o) < m ? o--:n > 0 && 0 != o && o++, e($(this), o), $(this).parent().find(".j_slide_aim>a").removeClass("aim_active").eq(Math.abs(o)).addClass("aim_active"), void 0)
            }).on("webkitTransitionEnd.smile",
            function() {
                $(this).css("-webkit-transition", "")
            })
        },
        _getAimHtml: function(i, e) {
            for (var s = ""; e > 0;) s += '<a href="#"></a>',
            e--;
            i.find(".j_slide_aim").append(s),
            i.find(".j_slide_aim>a").eq(0).addClass("aim_active")
        },
        animateEvent: function() {
            var i = this.smileContainer,
            e = $(".j_smile_container", i).children().length,
            s = $(".j_font_container", i).children().length,
            t = $(".j_smile", i),
            n = $(".j_font", i);
            this._getAimHtml(t, e),
            this._getAimHtml(n, s),
            $.os.ios ? (this._scrollAnimateBind(t), this._scrollAnimateBind(n)) : (this._scrollBindAndriod($(".j_smile_container", i)), this._scrollBindAndriod($(".j_font_container", i)))
        },
        smileBtnEvent: function() {
            var i = this.smileContainer,
            e = this;
            this.smileIsShow ? this.hide() : (this.hasSmileListInit || (i.append(s(e._config)), e.animateEvent(), this.hasSmileListInit = !0), this.show())
        }
    },
    e = m
},
[]);
F.module("spostor/widget/submit_btn",
function(t, e) {
    function s(t) {
        var e = '<a href="#" class="j_submit_btn submit_btn ' + t.enableEmptyClass + '">' + t.text + "</a>";
        return e
    }
    var i = F.require("page_data"),
    n = function(t) {
        this._config = {
            stateType: "",
            text: "\u56DE\u590D",
            disableClass: "submit_disable",
            enableClass: "submit_enable",
            enableEmptyClass: "submit_enable_empty"
        },
        this._outerContainer = t.outerContainer,
        this._submitBtnSel = null,
        this._state_type = "enable_empty",
        $.extend(this, new _.Events)
    };
    return n.prototype = {
        setConfig: function(t) {
            $.extend(this._config, t)
        },
        init: function() {
            var t = s(this._config);
            this._submitBtnSel = $(t),
            this._outerContainer.html(this._submitBtnSel)
        },
        initEvents: function() {
            var t = this;
            this._outerContainer.delegate(".j_submit_btn", "click",
            function(e) {
                e.preventDefault(),
                t.clickSubmitBtn()
            })
        },
        removeEvents: function() {
            this._outerContainer.undelegate(".j_submit_btn")
        },
        setDisable: function() {
            this._state_type = "disable",
            this._submitBtnSel.removeClass(this._config.enableClass).removeClass(this._config.enableEmptyClass).addClass(this._config.disableClass)
        },
        setEnable: function() {
            this._state_type = "enable",
            this._submitBtnSel.removeClass(this._config.enableEmptyClass).removeClass(this._config.disableClass).addClass(this._config.enableClass)
        },
        setEnableEmpty: function() {
            this._state = "enable_empty",
            this._submitBtnSel.removeClass(this._config.enableClass).removeClass(this._config.disableClass).addClass(this._config.enableEmptyClass)
        },
        clickSubmitBtn: function() {
            return i.is_light_app && !i.is_login ? (UserAccount.login(), void 0) : ("disable" != this._state_type && this.trigger("submit_post"), void 0)
        },
        setSubmitText: function(t) {
            this._submitBtnSel.text(t || this._config.text)
        }
    },
    e = n
},
[]);
F.module("spostor/widget/uploador",
function(t, n) {
    var e = {
        FileStatus: {
            NONE: 0,
            RUNNING: 1,
            ERROR: 2,
            COMPLETE: 3
        },
        ProcessorStatus: {
            NOTSTART: 0,
            RUNNING: 1,
            PAUSE: 2,
            COMPLETE: 4,
            ERROR: 5
        },
        ProcessorCommand: {
            PAUSE: 0,
            STOP: 1,
            NONE: 2
        },
        Error: {
            NONE: {
                no: 0,
                msg: ""
            },
            FILE_SIZE_OVERFLOW: {
                no: 1,
                msg: "\u6587\u4EF6\u5927\u5C0F\u8D85\u51FA\u9650\u5236"
            },
            NETWORK_ERROR: {
                no: 2,
                msg: "\u7F51\u7EDC\u9519\u8BEF"
            },
            JSON_PARSE_ERROR: {
                no: 3,
                msg: "\u6570\u636E\u8F6C\u6362\u5931\u8D25"
            },
            QUEUE_EXCEED: {
                no: 4,
                msg: "\u6587\u4EF6\u6570\u8D85\u51FA\u4E0A\u9650"
            },
            INVALID_TYPE: {
                no: 5,
                msg: "\u6587\u4EF6\u7C7B\u578B\u9519\u8BEF"
            }
        }
    },
    r = function() {
        var t = null,
        n = null,
        e = function() {
            t = document.createElement("canvas"),
            n = t.getContext("2d")
        };
        this.compress = function(e) {
            var o = e.quality ? e.quality: 1,
            a = e.imageType ? e.imageType: "image/jpeg",
            s = 1,
            i = e.image.width,
            u = e.image.height;
            if (e.maxWidth && e.maxHeight) {
                var l = i / e.maxWidth,
                c = u / e.maxHeight;
                s = l > c ? 1 / l: 1 / c
            }
            s = e.rate ? e.rate: s;
            var h = e.isIos ? r(e.image, i, u) : 1;
            t.width = i * s,
            t.height = u * s,
            n.clearRect(0, 0, i, u),
            n.scale(s, s / h),
            n.drawImage(e.image, 0, 0);
            var d = t.toDataURL(a, o),
            m = (d.length - 814) / 1.37;
            return e.maxSize && e.maxSize < m && (o = e.maxSize / m, d = t.toDataURL(a, o)),
            d
        };
        var r = function(e, r, o) {
            t.width = 1,
            t.height = o,
            n.drawImage(e, 0, 0);
            for (var a = n.getImageData(0, 0, 1, o).data, s = 0, i = o, u = o; u > s;) {
                var l = a[4 * (u - 1) + 3];
                0 === l ? i = u: s = u,
                u = i + s >> 1
            }
            var c = u / o;
            return 0 === c ? 1 : c
        };
        this.detectVerticalSquash = r,
        e()
    };
    r.instance = new r;
    var o = {};
    o._createImage = function(t) {
        var n = new Image;
        return n.size = t.file.size || 0,
        n.name = t.file.name || "",
        n.type = t.file.type || "",
        n.percent = 0,
        n.status = e.FileStatus.NONE,
        n.response = "",
        n.errorCode = 0,
        n.errorMessage = "",
        n.onLoaded = t.onLoaded,
        n.getData = function() {
            return o._getImageData(n.src)
        },
        n.getPostData = function() {
            return o._getPostData(n)
        },
        n
    },
    o._getPostData = function(t) {
        return {
            file: {
                filename: t.name,
                type: t.type,
                content: t.getData()
            }
        }
    },
    o._getImageData = function(t) {
        return t.split(",")[1]
    },
    o._calImageSize = function(t) {
        return (t.length - 814) / 1.37
    },
    o._readImage = function(t, n) {
        var e = new FileReader;
        e.onload = function(t) {
            n && n(t.target.result)
        },
        e.readAsDataURL(t)
    },
    o._compressImage = function(t, n, e, o, a) {
        var s = new r;
        return t.width > e || t.height > o ? s.compress({
            image: t,
            maxWidth: e,
            maxHeight: o,
            maxSize: a
        }) : t.src
    },
    o.create = function(t) {
        var n = (new r, null);
        return n = o._createImage(t),
        n.onload = o._onLoad(n, t),
        o._readImage(t.file,
        function(t) {
            n.src = t
        }),
        n
    },
    o._onLoad = function(t, n) {
        var e = !1;
        return function() { ! e && n.maxWidth && n.maxHeight && (t.width > n.maxWidth || t.height > n.maxHeight || t.size > n.maxSize) ? (t.src = o._compressImage(t, t.type, n.maxWidth, n.maxHeight, n.maxSize), t.size = o._calImageSize(t.src), e = !0) : (t.onLoaded && (t.onLoaded(t), t.onLoaded = null), e = !1)
        }
    };
    var a = function() {
        this._queue = [],
        this._index = 0,
        this.push = function(t) {
            "Array" != typeof t ? this._queue.push(t) : this._queue.concat(t)
        },
        this.pop = function() {
            return this._queue[this._index++]
        },
        this.remove = function(t) {
            this._queue.splice(t, 1)
        },
        this.insert = function(t, n) {
            this._queue.splice(t, n, 0)
        },
        this.clear = function() {
            this._queue = [],
            this._index = 0
        },
        this.length = function() {
            return this._queue.length
        },
        this.remainLength = function() {
            return this._queue.length - this._index
        },
        this.get = function(t) {
            return this._queue[t]
        },
        this.getIndex = function(t) {
            for (var n = 0; n < this._queue.length; n++) if (this._queue[n] == t) return n;
            return - 1
        },
        this.toArray = function() {
            return this._queue
        }
    },
    s = function(t) {
        a.call(this);
        var n = 0,
        r = t.maxLength || 10,
        s = t.maxWidth || 0,
        i = t.maxSize || 3145728,
        u = t.maxHeight || 0,
        l = this,
        c = t.onLoaded || null,
        h = t.onItemLoaded || null,
        d = t.onError || null,
        m = function(t) {
            t.status = e.FileStatus.NONE,
            l.push(t),
            h && h(t),
            n == l.length() && c && c(l.toArray())
        },
        f = function(t) {
            o.create({
                file: t,
                maxWidth: s,
                maxHeight: u,
                maxSize: i,
                onLoaded: m
            })
        };
        this.pop = function() {
            for (var t = null; this._index < this._queue.length;) if (t = this._queue[this._index++], t.status == e.FileStatus.NONE) return t;
            return null
        },
        this.concat = function(t) {
            var o = n;
            n = n + t.length > r ? r: n + t.length;
            for (var a = o; n > a; a++) f(t[a - o]);
            o + t.length > r && d && d({
                errorCode: e.Error.QUEUE_EXCEED.no,
                errorMessage: e.Error.QUEUE_EXCEED.msg
            })
        },
        this.isComplete = function() {
            for (var t = 0,
            n = 0; n < this.length(); n++) this.get(n).status != e.FileStatus.NONE && this.get(n).status != e.FileStatus.RUNNING && t++;
            return t == this.length()
        },
        this.getCompleteItems = function() {
            for (var t = [], n = 0; n < this.length(); n++) this.get(n).status != e.FileStatus.NONE && this.get(n).status != e.FileStatus.RUNNING && t.push(this.get(n));
            return t
        },
        this.remove = function(t) {
            this._queue.splice(t, 1),
            n--
        },
        this.reset = function() {
            this.clear(),
            n = 0
        }
    },
    i = function(t, n) {
        var e = null,
        r = this,
        o = function() {
            e = new XMLHttpRequest,
            a()
        },
        a = function() {
            e.sendAsBinary || (e.sendAsBinary = function(t) {
                var n = Array.prototype.map.call(t,
                function(t) {
                    return 255 & t.charCodeAt(0)
                });
                e.send(new Uint8Array(n).buffer)
            })
        },
        s = function(t) {
            var n = new FormData;
            for (var e in t) n.append(e, t[e]);
            return n
        },
        i = function(t) {
            var n = "----WebKitFormBoundary" + Math.random(),
            e = "--" + n,
            r = [];
            for (var o in t) r.push(e),
            "object" == typeof t[o] ? (r.push('Content-Disposition: form-data; name="' + o + '"; filename="' + t[o].filename + '"'), r.push("Content-Type: " + t[o].type), r.push(""), r.push(atob(t[o].content))) : (r.push('Content-Disposition: form-data; name="' + o + '"'), r.push(""), r.push(t[o]));
            return r.push(e + "--"),
            {
                boundary: n,
                payload: r.join("\r\n")
            }
        },
        u = function(t) {
            if (t) for (var n in t) r.bind(n, t[n])
        };
        this.bind = function(t, n) {
            e[t] = n,
            "onprogress" == t && (e.upload[t] = n)
        },
        this.sendAsBinary = function(t, n, r) {
            var o = i(n);
            u(r),
            e.open("POST", t, !0),
            e.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + o.boundary),
            e.sendAsBinary(o.payload)
        },
        this.sendAsForm = function(t, n, r) {
            var o = s(n);
            u(r),
            e.open("POST", t, !0),
            e.send(o)
        },
        o(),
        u(n)
    },
    u = function() {
        this.conf = {},
        this.handler = {
            onPause: null,
            onContinue: null,
            onStop: null,
            onProcessing: null,
            onComplete: null,
            onError: null
        },
        this._command = e.ProcessorCommand.NONE,
        this._status = e.ProcessorStatus.NOTSTART,
        this.bind = function(t, n) {
            this.handler[t] = n
        },
        this.runHandler = function(t, n) {
            t && t(n)
        },
        this.process = function() {
            this._status = e.ProcessorStatus.RUNNING,
            this._command = e.ProcessorCommand.NONE
        },
        this.pause = function() {
            this._command = e.ProcessorCommand.PAUSE
        },
        this.goOn = function() {
            this._status = e.ProcessorStatus.RUNNING,
            this._command = e.ProcessorCommand.NONE
        },
        this.stop = function() {
            this._command = e.ProcessorCommand.STOP
        },
        this.extend = function(t, n) {
            for (var e in n) t[e] = n[e]
        }
    },
    l = function(t, n) {
        u.call(this);
        var r = null,
        o = this,
        a = null;
        $.extend(this.conf, {
            timeout: 300,
            postType: 0,
            url: ""
        }),
        o.extend(this.conf, {
            timeout: t.timeout || 300,
            url: t.url || ""
        }),
        o.extend(this.handler, n);
        var s = function() {
            a = new i({
                timeout: o.timeout
            },
            {
                onprogress: c,
                onload: h,
                ontimeout: d,
                onabort: m,
                onerror: m
            })
        },
        l = function(t, n) {
            o.runHandler(t, n)
        },
        c = function(t) {
            var n = t.lengthComputable ? t.loaded / t.total: 0;
            r.percent = n,
            l(o.handler.onProcessing, r)
        },
        h = function(t) {
            r.response = null;
            try {
                r.response = JSON.parse(t.target.responseText),
                r.status = e.FileStatus.COMPLETE,
                o._status = e.ProcessorStatus.COMPLETE,
                o.handler.onComplete && l(o.handler.onComplete, r)
            } catch(n) {
                o._status = e.ProcessorStatus.ERROR,
                r.status = e.FileStatus.ERROR,
                r.errorCode = e.Error.JSON_PARSE_ERROR.no,
                r.errorMessage = e.Error.JSON_PARSE_ERROR.msg,
                o.runHandler(o.handler.onError, r)
            }
        },
        d = function() {
            o._status = e.ProcessorStatus.ERROR,
            r.status = e.FileStatus.ERROR,
            r.errorCode = e.Error.NETWORK_ERROR.no,
            r.errorMessage = e.Error.NETWORK_ERROR.msg,
            o.runHandler(o.handler.onError, r)
        },
        m = function() {
            o._status = e.ProcessorStatus.ERROR,
            r.status = e.FileStatus.ERROR,
            r.errorCode = e.Error.NETWORK_ERROR.no,
            r.errorMessage = e.Error.NETWORK_ERROR.msg,
            o.runHandler(o.handler.onError, r)
        };
        this.process = function(n) {
            var o = n.url ? n.url: t.url;
            o = o + "&r=" + Math.random();
            n.file.getData();
            r = n.file,
            r.status = e.FileStatus.RUNNING,
            this._status = e.ProcessorStatus.RUNNING,
            this.conf.postType ? a.sendAsBinary(o, r.getPostData()) : a.sendAsForm(o, r.getPostData())
        },
        s()
    },
    c = function(t, n) {
        u.call(this);
        var r = null,
        o = [],
        a = this,
        s = 0;
        a.extend(a.conf, {
            maxLength: t.maxLength || 2,
            url: t.url || "",
            postType: t.postType || 0
        }),
        a.extend(a.handler, {
            onItemComplete: null,
            onItemStart: null,
            onItemError: null,
            onItemProcessing: null,
            onComplete: null,
            onStart: null,
            onError: null,
            onPause: null,
            onProcessing: null
        }),
        n && a.extend(a.handler, n);
        var i = function(t) {
            a.runHandler(a.handler.onItemComplete, t),
            E(),
            g(),
            p()
        },
        c = function(t) {
            a.runHandler(a.handler.onItemError, t),
            a.runHandler(a.handler.onError, t),
            E(),
            g(),
            p()
        },
        h = function(t) {
            a.runHandler(a.handler.onItemProcessing, t);
            var n = r.getCompleteItems();
            s = Math.floor(100 * n.length / r.length()),
            a.runHandler(a.handler.onProcessing, {
                percent: s,
                imageList: r.toArray()
            })
        },
        d = function() {
            return new l({
                url: a.conf.url,
                id: o.length
            },
            {
                onComplete: i,
                onProcessing: h,
                onError: c
            })
        },
        m = function() {
            for (var t = null,
            n = 0; n < o.length; n++) if (o[n]._status != e.ProcessorStatus.RUNNING) {
                t = o[n];
                break
            }
            return null == t && o.length < a.conf.maxLength && (t = d(), o.push(t)),
            t
        },
        f = function() {
            for (var t = 0,
            n = 0; n < o.length; n++) o._status != e.ProcessorStatus.RUNNING && t++;
            return t == o.length
        },
        g = function() {
            a._status != e.ProcessorStatus.COMPLETE && a._command == e.ProcessorCommand.NONE && a.process({
                queue: r
            })
        },
        p = function() {
            a._command == e.ProcessorCommand.PAUSE && a._status == e.ProcessorStatus.RUNNING && f() && (a._status = e.ProcessorStatus.PAUSE, a.runHandler(a.handler.onPause, {
                percent: s,
                imageList: r.toArray()
            }))
        },
        E = function() {
            return r.isComplete() && a._status != e.ProcessorStatus.COMPLETE ? (a._status = e.ProcessorStatus.COMPLETE, a.runHandler(a.handler.onComplete, {
                percent: 100,
                imageList: r.toArray()
            }), !0) : !1
        },
        _ = function() {
            if (r && (a._command = e.ProcessorCommand.NONE, a._status = e.ProcessorStatus.RUNNING, !E())) for (; r.remainLength() > 0;) {
                var t = m();
                if (null == t) break;
                var n = r.pop();
                n && (a.runHandler(a.handler.onItemStart, n), t.process({
                    file: n
                }))
            }
        };
        this.process = function(t) {
            a.conf.url = t.url || a.conf.url,
            r = t.queue,
            a.runHandler(a.handler.onStart, {
                percent: 0,
                imageList: r.toArray()
            }),
            _()
        },
        this.pause = function() {
            this._command = e.ProcessorCommand.PAUSE
        },
        this.goOn = function() {
            _()
        },
        this.bind = function(t, n) {
            a.handler[t] = n
        },
        this.reset = function() {
            this._command = e.ProcessorCommand.NONE,
            this._status = e.ProcessorStatus.NOTSTART,
            s = 0
        }
    },
    h = function(t, n) {
        u.call(this);
        var r = this,
        o = null,
        a = null,
        i = null;
        r.extend(r.conf, {
            maxWidth: 0,
            maxHeight: 0,
            maxSize: 3145728,
            container: null,
            isAutoUp: !1,
            queueLen: 10,
            workLen: 2,
            postType: 1,
            postUrl: ""
        }),
        r.extend(r.conf, t),
        r.extend(r.handler, {
            onFileChanged: null,
            onFileSelected: null,
            onStartUpload: null,
            onProgressListen: null,
            onStopUpload: null,
            onError: null,
            onComplete: null,
            onImageLoaded: null
        }),
        n && r.extend(r.handler, n);
        var l = function() {
            i = $("<input type='file' accept='image/*' />").css("opacity", "0").tbattr("multiple", "multiple"),
            r.conf.container && r.conf.container.bind("click",
            function() {
                i.trigger("click")
            }),
            i.bind("change", d),
            a = new c({
                maxLength: r.conf.workLen,
                url: r.conf.postUrl,
                postType: r.conf.postType
            }),
            h()
        },
        h = function() {
            a.bind("onComplete",
            function(t) {
                r.runHandler(r.handler.onComplete, t),
                o.reset()
            }),
            a.bind("onProcessing",
            function(t) {
                r.runHandler(r.handler.onProgressListen, t)
            }),
            a.bind("onError",
            function(t) {
                r.runHandler(r.handler.onError, t)
            }),
            a.bind("onStart",
            function(t) {
                r.runHandler(r.handler.onStartUpload, t)
            }),
            a.bind("onPause",
            function(t) {
                r.runHandler(r.handler.onStopUpload, t)
            })
        },
        d = function(t) {
            r.handler.onFileChanged && r.handler.onFileChanged(t.target.files),
            o || (o = new s({
                maxLength: r.conf.queueLen,
                onLoaded: g,
                onItemLoaded: f,
                onError: r.handler.onError,
                maxWidth: r.conf.maxWidth,
                maxHeight: r.conf.maxHeight,
                maxSize: r.conf.maxSize
            })),
            o.concat(t.target.files),
            m()
        },
        m = function() {
            i.val("")
        },
        f = function(t) {
            t.size > r.conf.maxSize && (t.status = e.FileStatus.ERROR, t.errorCode = e.Error.FILE_SIZE_OVERFLOW.no, t.errorMessage = e.Error.FILE_SIZE_OVERFLOW.msg, r.runHandler(r.handler.onError, t)),
            r.runHandler(r.handler.onImageLoaded, t)
        },
        g = function(t) {
            r.runHandler(r.handler.onFileSelected, {
                percent: 0,
                imageList: t
            }),
            r._command == e.ProcessorCommand.NONE && r.conf.isAutoUp && r.startUpload()
        };
        this.startUpload = function() {
            a.process({
                queue: o
            })
        },
        this.stopUpload = function() {
            a.pause()
        },
        this.conUpload = function() {
            a.process({
                queue: o
            })
        },
        this.clearList = function() {
            o.reset()
        },
        this.triggerSelector = function(t) {
            t ? i.tbattr("multiple", "multiple") : i.removeAttr("multiple"),
            i.trigger("click")
        },
        this.getQueue = function() {
            return o
        },
        l()
    },
    d = {
        Enum: e,
        MImage: o,
        Queue: a,
        ImageQueue: s,
        FilePoster: i,
        Processor: u,
        Uploador: l,
        UploadorPool: c,
        MultiUploador: h,
        Compressor: r
    };
    return n = d
},
[]);
F.module("spostor/widget/upload_pic/base_object",
function(i, t) {
    var n = (F.require("page_data"),
    function() {
        this.conf = {},
        this.handler = {},
        this.runHandler = function(i, t) {
            i && i(t)
        },
        this.bind = function(i, t) {
            this.handler[i] = t
        },
        this.destroy = function() {}
    }),
    e = function() {
        n.call(this),
        this.doms = {
            container: null
        },
        this.disalbe = function() {},
        this.enable = function() {},
        this.hide = function() {
            this.doms.container.hide()
        },
        this.show = function() {
            this.doms.container.show()
        },
        this.appendTo = function(i) {
            this.doms.container.appendTo(i)
        },
        this.reset = function() {},
        this.destroy = function() {
            for (var i in this.doms) this.doms[i].remove && this.doms[i].remove(),
            this.doms[i].destroy && this.doms[i].destroy(),
            this.doms[i] = null
        }
    },
    s = function() {
        e.call(this),
        $.extend(this.doms, {
            block: $("<a/>").tbattr({
                "class": "upload-block enable",
                href: "javascript:;"
            }).html('<span class="media_bar_btn_text">\u7167\u7247</span>'),
            count: $("<span>").tbattr({
                "class": "upload-block-count"
            }),
            input: $("<input/>").tbattr({
                type: "file",
                name: "pic",
                id: "pic",
                accept: "image/*",
                "class": "upload-input"
            })
        }),
        $.extend(this.handler, {
            changed: null,
            onBlockClick: null
        }),
        this.initialize = function() {
            this._initializeBlock()
        },
        this._initializeBlock = function() {
            var i = this,
            t = this.doms;
            t.container.length > 1 ? t.container.each(function(t, n) {
                var e = $("<a/>").tbattr({
                    "class": "upload-block enable",
                    href: "javascript:;"
                }).html('<span class="media_bar_btn_text">\u7167\u7247</span>'),
                s = $("<input/>").tbattr({
                    type: "file",
                    name: "pic",
                    id: "pic",
                    accept: "image/*",
                    "class": "upload-input"
                });
                s.bind("change",
                function(t) {
                    i.runHandler(i.handler.changed, t),
                    $(this).val("")
                }),
                e.appendTo(n).append(s)
            }) : (t.input.appendTo(this.doms.block), t.input.bind("change",
            function(t) {
                i.runHandler(i.handler.changed, t),
                $(this).val("")
            }), t.block.appendTo(this.doms.container), t.count.appendTo(this.doms.block))
        },
        this._initializeClientGuide = function() {
            if ($.os.android) {
                var i = this,
                t = F.require("spostor/widget/upload_pic/client_guide");
                t.needShow(this.conf.network, i.conf.baseUrl) && (i.doms.input.remove(), i.doms.block.unbind("click").bind("click",
                function() {
                    t.init({
                        func: function() {
                            i.doms.input.appendTo(i.doms.block),
                            i.doms.block.unbind("click"),
                            i.doms.input.trigger("click")
                        },
                        func_new: function() {
                            i.doms.input.appendTo(i.doms.block),
                            i.doms.block.unbind("click")
                        },
                        baseUrl: i.conf.baseUrl
                    })
                }))
            }
        },
        this.enable = function() {
            this.doms.block.removeClass("disable"),
            this.doms.block.addClass("enable"),
            this.doms.count.hide()
        },
        this.disable = function() {
            this.doms.block.removeClass("enable"),
            this.doms.block.addClass("disable"),
            this.doms.count.show()
        },
        this.getImageInfo = function() {
            return ""
        },
        this.reset = function() {}
    },
    o = function() {
        n.call(this),
        $.extend(this.conf, {
            baseUrl: "",
            container: null
        }),
        $.extend(this.handler, {
            uploaded: null,
            selected: null,
            deleted: null,
            error: null
        }),
        this.container = null,
        this.panel = null,
        this.uploader = null,
        this.preview = null,
        this.init = function() {
            this.conf.container.css("display", "inline-block"),
            this.initialize()
        },
        this.reset = function() {
            this.panel && this.panel.reset()
        },
        this.initEvents = function() {},
        this.removeEvents = function() {},
        this.getImageInfo = function() {
            return this.panel ? this.panel.getImageInfo() : null
        },
        this.setEnable = function() {
            this.panel && this.panel.enable(),
            this.preview && this.preview.enable && this.preview.enable()
        },
        this.setDisable = function() {
            this.panel && this.panel.disable(),
            this.preview && this.preview.disable && this.preview.disable()
        },
        this.upload = function() {
            var i = this;
            this.handler.uploaded && this.handler.uploaded(i)
        },
        this.getImageCount = function() {
            var i = 0;
            return this.preview && this.preview.doms.container && (i = this.preview.doms.container.find("img").size()),
            i + 1
        },
        this.hasImage = function() {
            return ! 1
        },
        this.showResult = function() {},
        this.showPreview = function() {
            this.preview && this.preview.show()
        },
        this.hidePreview = function() {
            this.preview && this.preview.hide()
        },
        this.initialize = null,
        this.createUploader = null,
        this.createPreview = null,
        this.createPanel = null,
        this._validateType = function(i) {
            return ! i.type || /image\/\w+/.test(i.type)
        },
        this._validateSize = function(i) {
            return ! i.size || i.size <= o.CONF.MAX_SIZE
        }
    };
    return o.ERROR_MSG = {
        SIZE_EXCEED: "\u56FE\u7247\u8FC7\u5927\uFF0C\u8BF7\u4E0A\u4F20\u5C0F\u4E8E5M\u7684\u56FE\u7247",
        FORMAT_WRONG: "\u8BF7\u4E0A\u4F20JPG\u3001GIF\u3001PNG\u683C\u5F0F\u7684\u56FE\u7247",
        COMMON: "\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20"
    },
    o.CONF = {
        MAX_WIDTH: 960,
        MAX_HEIGHT: 960,
        MAX_SIZE: 5242880,
        COMPRESS_SIZE: 1048576
    },
    o.NETWORK = {
        WIFI: 1,
        THREEG: 3,
        TWOG: 2
    },
    t = {
        MDom: e,
        MObject: n,
        Panel: s,
        Manager: o
    }
},
[]);;
F.module("spostor/widget/upload_pic/no_manager",
function(o, i) {
    var e = F.require("spostor/widget/upload_pic/base_object"),
    t = function(o) {
        e.Panel.call(this),
        this.doms.dialog = null,
        this.conf.baseUrl = o.baseUrl,
        this.doms.container = o.container;
        var i = !1;
        if ($.client.device && "vivo X510t" === $.client.device.family) {
            var t = $.os.version ? $.os.version.split(".") : [],
            n = t[0],
            s = t[1];
            4 >= n && 2 >= s && (i = !0)
        }
        var a = this,
        l = function() {
            if (i) a.doms.dialog = new Dialog({
                mask: !0,
                closebtn: !0,
                title: "<div style='font:normal 16px/22px Microsoft YaHei;'>\u62B1\u6B49~\u5F53\u524D\u7CFB\u7EDF\u7248\u672C\u4E0D\u652F\u6301<br/>\u4E0A\u4F20\u56FE\u7247\u670D\u52A1</div>",
                okbtn: "\u5173\u95ED"
            }),
            a.doms.dialog.dom.on("ok",
            function() {
                a.doms.dialog.remove()
            }).on("close",
            function() {
                a.doms.dialog.remove()
            });
            else {
                a.doms.dialog = new Dialog({
                    mask: !0,
                    closebtn: !0,
                    title: "<div style='font:normal 16px/22px Microsoft YaHei;'>\u4E0B\u8F7D\u8D34\u5427\u5BA2\u6237\u7AEF<br />\u968F\u65F6\u968F\u5730\u4E0A\u4F20\u56FE\u7247</div>",
                    okbtn: "\u4E0B\u8F7D"
                });
                var o = $.os.ios ? "https://itunes.apple.com/cn/app/id477927812": "http://c.tieba.baidu.com/c/s/download/wap?src=waptb";
                a.doms.dialog.dom.on("ok",
                function() {
                    $.location.setHref(a.conf.baseUrl + "redirect?tbjump=" + encodeURIComponent(o) + ($.os.ios ? "&lp=editor_ios_client": "&lp=editor_android_client")),
                    a.doms.dialog.remove()
                }).on("close",
                function() {
                    a.doms.dialog.remove()
                })
            }
        },
        c = function() {
            $.os.ios ? d() : a.doms.dialog ? a.doms.dialog.rebuild() : l()
        },
        d = function() {
            var o = new Date;
            return setTimeout(function() {
                if (new Date - o < 2500) {
                    var i = a.conf.baseUrl + "redirect?tbjump=" + encodeURIComponent("https://itunes.apple.com/cn/app/id477927812") + "&lp=editor_ios_client";
                    $.location.setHref(i)
                }
            },
            1500),
            $.ajax({
                url: a.conf.baseUrl + "?pv=editor_ios_click_client"
            }),
            $.location.setHref("com.baidu.tieba://"),
            !1
        };
        this.initialize = function() {
            this.doms.block.appendTo(this.doms.container),
            this.doms.block.bind("click", c),
            this.doms.block.addClass("download")
        },
        this.initialize()
    },
    n = function(o, i) {
        e.Manager.call(this),
        $.extend(this.conf, o),
        $.extend(this.handler, i);
        var n = this;
        this.initialize = function() {
            this.createPanel()
        },
        this.createPanel = function() {
            this.panel = new t(n.conf)
        }
    };
    return i = n
},
[]);;
F.module("spostor/widget/upload_pic/low_manager",
function(e, i) {
    var n = F.require("spostor/widget/upload_pic/form_uploador"),
    t = F.require("spostor/widget/upload_pic/base_object"),
    o = t.Manager,
    a = t.Panel,
    s = function(e) {
        var i = null,
        n = "<div class='preview-title'>\u56FE\u7247\u4E0A\u4F20</div>",
        t = "<div class='preview-content'><img id='j_dialog_preview' src='" + e.imageSrc + "'/><div>\u4F60\u786E\u5B9A\u5220\u9664\u56FE\u7247\u5417?</div></div>",
        o = {
            ok: e.ok,
            cancel: e.cancel
        },
        a = null;
        this.initialize = function() {
            i = new Dialog({
                mask: !0,
                closebtn: !1,
                title: n,
                okbtn: "\u5220\u9664",
                content: t,
                cancelbtn: "\u53D6\u6D88"
            });
            i.dom.on("ok",
            function() {
                o.ok && o.ok(),
                i.remove()
            }).on("cancel",
            function() {
                i.remove()
            }),
            a = $("#j_dialog_preview")
        },
        this.show = function(e) {
            a.tbattr("src", e),
            i.rebuild()
        },
        this.hide = function() {},
        this.initialize()
    },
    r = function(e) {
        a.call(this);
        var i = this;
        this.conf.baseUrl = e.baseurl,
        this.conf.network = e.network,
        $.extend(this.doms, {
            form: $("<form/>").tbattr({
                name: "uploadForm",
                enctype: "multipart/form-data",
                method: "post",
                action: this.conf.baseUrl + "cooluploadpic?r=" + Math.random(),
                target: "j_uploadFrame",
                "class": "upload-form"
            }),
            hidden: $("<input/>").tbattr({
                type: "hidden"
            }),
            preview: null,
            progress: null
        }),
        $.extend(this.handler, {
            changed: e.changed,
            deleted: e.deleted,
            iConClick: e.iConClick
        }),
        this.initialize = function() {
            this._initializeBlock(),
            this._initializeForm(),
            n()
        },
        this._initializeForm = function() {
            this.doms.form.appendTo(this.doms.container).append(this.doms.block),
            this.doms.hidden.appendTo(this.doms.container)
        };
        var n = function() {
            i.doms.input.unbind("change").bind("change",
            function(e) {
                "" != i.doms.input.val() && i.runHandler(i.handler.changed, e.target.files[0]),
                $(e.target).val("")
            })
        },
        t = function() {
            i.doms.block.remove()
        },
        o = function() {
            i.doms.input.remove()
        },
        s = function() {
            i._initializeClientGuide()
        },
        r = function() {
            i.doms.preview = $("<img/>").tbattr({
                "class": "upload-preview"
            })
        },
        l = function() {
            i.doms.preview && (i.doms.preview.remove(), i.doms.preview.unbind("click"))
        };
        this.getForm = function() {
            return this.doms.form
        },
        this.disable = function() {
            this.doms.block.removeClass("enable").addClass("disable"),
            o()
        },
        this.enable = function() {
            this.doms.block.removeClass("disable").addClass("enable"),
            s()
        },
        this.setAsUploading = function() {
            t(),
            this.doms.preview ? this.doms.preview.unbind("click") : r(),
            this.doms.preview.tbattr({
                src: "//tb2.bdstatic.com/tb/mobile/sglobal/img/loading.gif"
            }).appendTo(this.doms.form)
        },
        this.getImageInfo = function() {
            return this.doms.hidden.val()
        },
        this.setAsSuccess = function(e) {
            var n = e.imageSrc;
            t(),
            this.doms.hidden.val(e.imageInfo),
            this.doms.preview.tbattr("src", n).bind("click",
            function() {
                i.runHandler(i.handler.iConClick, n)
            })
        },
        this.reset = function() {
            l(),
            this.doms.input.val(""),
            this.doms.block.parent().length < 1 && this.doms.form.append(this.doms.block),
            this.doms.hidden.val("")
        },
        this.deleteImage = function() {
            this.reset(),
            this.runHandler(this.handler.deleted, null)
        },
        this.doms.container = e.container,
        this.initialize()
    },
    l = function(e, i) {
        o.call(this),
        $.extend(this.conf, e),
        $.extend(this.handler, i);
        var t = this;
        this.initialize = function() {
            this.createPanel(),
            this.createUploador()
        },
        this.createUploador = function() {
            var e = this;
            e.uploader = new n({
                form: e.panel.getForm(),
                error: e._onUploadError,
                success: e._onUploadSuccess
            })
        },
        this.createPreview = function(e) {
            var i = this;
            i.preview = new s({
                imageSrc: e,
                ok: function() {
                    i.panel.deleteImage()
                }
            })
        },
        this.createPanel = function() {
            var e = this;
            e.panel = new r({
                container: e.conf.container,
                baseurl: e.conf.baseUrl,
                changed: e._onFileChanged,
                deleted: e.handler.deleted,
                iConClick: e._onIconClick,
                network: e.conf.network
            })
        },
        this._onIconClick = function(e) {
            t.preview ? t.preview.show(e) : t.createPreview(e)
        },
        this._onFileChanged = function(e) {
            t.validateFile(e) && (_.eventCenter.trigger("browser_click_update", 1), t.uploader.upload(), t.panel.setAsUploading())
        },
        this.validateFile = function(e) {
            return this._validateType(e) ? this._validateSize(e) ? !0 : (this.runHandler(t.handler.error, o.ERROR_MSG.SIZE_EXCEED), !1) : (this.runHandler(t.handler.error, o.ERROR_MSG.FORMAT_WRONG), !1)
        },
        this.hasImage = function() {
            var e = this.getImageInfo();
            return !! e && "" != e
        },
        this._onUploadSuccess = function(e) {
            t.panel.setAsSuccess(e),
            t.runHandler(t.handler.selected, null)
        },
        this._onUploadError = function(e) {
            t.panel.reset(),
            e = e ? e: o.ERROR_MSG.COMMON,
            t.runHandler(t.handler.error, e)
        }
    };
    return i = l
},
[]);;
F.module("spostor/widget/upload_pic/form_uploador",
function(o, e) {
    var r = F.require("spostor/widget/upload_pic/base_object"),
    n = function(o) {
        r.MDom.call(this);
        var e = o.form;
        $.extend(this.handler, {
            error: o.error,
            success: o.success
        }),
        this.doms = {
            button: null,
            iframe: null
        };
        var n = this;
        this.upload = function() {
            this.doms.button = $("<input/>").tbattr({
                type: "submit",
                name: "button",
                style: "display:none;"
            }).appendTo(e),
            this.doms.iframe = $("<iframe/>").tbattr({
                style: "display:none",
                name: "j_uploadFrame"
            }).appendTo(e).bind("load",
            function() {
                n.doms.iframe.window && n.doms.iframe.window.imageUploadResult || (n.runHandler(n.handler.error, r.Manager.ERROR_MSG.COMMON), n.destroy())
            }),
            window.uploadSuccess = function(o) {
                n.runHandler(n.handler.success, o),
                n.destroy()
            },
            window.uploadFailed = function(o) {
                n.runHandler(n.handler.error, o),
                n.destroy()
            },
            e[0].submit()
        }
    };
    return e = n
},
[]);;
F.module("spostor/widget/upload_pic/high_manager",
function(e, n) {
    var o = F.require("spostor/widget/uploador"),
    t = F.require("spostor/widget/upload_pic/base_object"),
    r = t.Manager,
    a = F.require("spostor/widget/upload_pic/low_manager"),
    i = F.require("spostor/widget/upload_pic/multi_upload_panel"),
    l = F.require("spostor/widget/upload_pic/multi_preview"),
    s = F.require("spostor/widget/upload_pic/confirm"),
    u = (F.require("page_data"), l.Preview),
    d = o.MImage;
    d._readImage = function(e, n) {
        var o = new FileReader;
        o.onload = function(o) {
            var t = o.target.result;
            if (!$.os.ios) {
                var r = e.type && "" != e.type ? e.type: "image/jpeg";
                t = d._getImageData(t),
                t = "data:" + r + ";base64," + t
            }
            n && n(t)
        },
        d.onLoadStart && d.onLoadStart(e),
        o.readAsDataURL(e)
    },
    d.onLoadStart = null,
    d._compressImage = function(e, n, t, r, a) {
        var i = o.Compressor.instance;
        return i.compress({
            image: e,
            maxWidth: t,
            maxHeight: r,
            maxSize: a,
            isIos: !!$.os.ios
        })
    },
    d._getPostData = function(e) {
        return {
            pic: e.getData()
        }
    };
    var c = 8,
    p = function(e, n) {
        a.call(this),
        $.extend(this.conf, e),
        $.extend(this.handler, n),
        e.image_max_length && (c = e.image_max_length);
        var t = this,
        l = null,
        p = "",
        g = function(e) {
            for (var n = [], o = [], r = 0; r < e.length; r++) t._validateType(e[r]) && (e[r].size && e[r].size <= 0 || (t._validateSize(e[r]) ? o.push(e[r]) : n.push(e[r].name)));
            return {
                invalid: n,
                valid: o
            }
        },
        h = function(e) {
            l = l ? l: f();
            var n = g(e.target.files);
            n.invalid.length > 0 && $.toast.send(n.invalid.join(",") + " \u5927\u5C0F\u8D85\u8FC75M!"),
            n.valid.length > 0 && (t.preview ? t.preview.show() : t.createPreview(), l.concat(n.valid), t.conf.eventCenter.trigger("upload_pic_panel_show", t.getImageCount()))
        },
        f = function() {
            return l = new o.ImageQueue({
                maxLength: c,
                maxWidth: r.CONF.MAX_WIDTH,
                maxHeight: r.CONF.MAX_HEIGHT,
                maxSize: r.CONF.COMPRESS_SIZE,
                onLoaded: function(e) {
                    t.runHandler(t.handler.selected, e)
                },
                onItemLoaded: function(e) {
                    t.preview.addImage(e)
                },
                onError: function(e) {
                    $.toast.send(e.errorMessage)
                }
            })
        },
        v = function() {
            t.conf.progress = $("<div class='upload_progress'>\u5B8C\u62100/" + l.length() + "</div>").appendTo(t.conf.submitPanel)
        };
        this.createUploador = function() {
            var e = this;
            e.uploader = new o.UploadorPool({
                maxLength: $.os.ios ? 2 : 1,
                url: e.conf.baseUrl + "cooluploadpic?type=ajax",
                postType: 0
            }),
            e.uploader.bind("onError",
            function() {});
            var n = 0;
            e.uploader.bind("onItemComplete",
            function() {
                n++,
                e.conf.progress.html("\u5B8C\u6210" + n + "/" + l.length()),
                n == l.length() && (n = 0)
            }),
            e.uploader.bind("onComplete",
            function(n) {
                for (var o = "",
                t = 0; t < n.imageList.length; t++) {
                    var r = n.imageList[t];
                    if (r.response && "" != r.response) {
                        var a = r.response;
                        "" == a.errorMsg && (o += ("" != o ? "|": "") + a.imageInfo)
                    }
                }
                p = o,
                I(),
                e.handler.uploaded && e.handler.uploaded(e)
            })
        },
        this.getImageInfo = function() {
            return p
        },
        this.createPreview = function() {
            this.preview = new u({
                maxLength: c,
                eventCenter: t.conf.eventCenter,
                outerContainer: t.conf.outerContainer
            },
            {
                onDone: null,
                onDelete: function(e) {
                    l.remove(l.getIndex(e)),
                    l.length() <= 0 && t.handler.deleted && t.handler.deleted(t)
                },
                onCancel: null,
                onAdd: h
            }),
            d.onLoadStart = function() {
                t.preview.readyToLoad()
            },
            this.preview.appendTo(t.conf.outerContainer)
        },
        this.createPanel = function() {
            this.panel = new i({
                container: t.conf.container,
                baseUrl: t.conf.baseUrl,
                baseurl: t.conf.baseUrl,
                network: t.conf.network,
                eventCenter: t.conf.eventCenter
            },
            {
                changed: h
            })
        },
        this.upload = function(e) {
            this.conf.network != r.NETWORK.WIFI ? m(e) : _()
        };
        var m = function(e) {
            s.show({
                content: "\u56FE\u7247\u603B\u7684\u5927\u5C0F\u4E3A" + w() + "M,\u786E\u8BA4\u4E0A\u4F20\u5417\uFF1F",
                ok_callback: _,
                cancel_callback: e
            })
        },
        w = function() {
            for (var e = 0,
            n = l ? l.toArray() : [], o = 0; o < n.length; o++) e += n[o].size;
            return Math.round(100 * e / 1024 / 1024) / 100
        },
        _ = function() {
            p = "",
            v(),
            t.uploader.process({
                queue: l
            })
        },
        I = function() {
            l = null,
            t.preview && (t.preview.hide(), t.preview = null)
        };
        this.reset = function() {
            l = null,
            t.preview && (t.preview.hide(), t.preview = null),
            p = "",
            t.conf.progress && (t.conf.progress.remove(), t.conf.progress = null)
        },
        this.hasImage = function() {
            return !! l && l.length() > 0
        },
        this.showResult = function() {
            for (var e = l ? l.toArray() : [], n = [], o = 0; o < e.length; o++) 0 != e[o].errorCode && n.push(o + 1);
            n.length > 0 && $.toast.send("\u7B2C" + n.join(",") + "\u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25")
        }
    };
    return n = p
},
[]);;
F.module("spostor/widget/upload_pic/confirm",
function(n, o) {
    var t = function() {
        var n = null,
        o = null,
        t = null,
        c = function() {
            n = new Dialog({
                mask: !0,
                closebtn: !1,
                content: "",
                cancelbtn: "\u53D6\u6D88",
                okbtn: "\u786E\u5B9A",
                fixed: !0
            }),
            n.dom.on("ok",
            function() {
                l(),
                !!o && o()
            }),
            n.dom.on("cancel",
            function() {
                l(),
                !!t && t()
            })
        },
        e = function(e) {
            n ? n.rebuild() : c(),
            e.content && n.setContent("<div style='font-size:18px;'>" + e.content + "</div>"),
            o = e.ok_callback,
            t = e.cancel_callback
        },
        l = function() {
            n.remove()
        };
        return {
            show: e,
            close: l
        }
    } ();
    return o = t
},
[]);;
F.module("spostor/widget/upload_pic/image_editor",
function(t, a) {
    var e = F.require("spostor/widget/uploador"),
    i = e.Compressor,
    n = function() {
        var t = null,
        a = null,
        e = function() {
            t = document.createElement("canvas"),
            a = t.getContext("2d")
        };
        this.rotate = function(e, i) {
            i = Math.abs(i) > 360 ? i % 360 : i,
            i = 0 > i ? 360 + i: i;
            var n = e.width,
            r = e.height,
            s = Math.PI * i / 180,
            h = Math.round(1e3 * Math.cos(s)) / 1e3,
            o = Math.round(1e3 * Math.sin(s)) / 1e3;
            a.clearRect(0, 0, n, r),
            t.height = Math.abs(h * r) + Math.abs(o * n),
            t.width = Math.abs(h * n) + Math.abs(o * r),
            s <= Math.PI / 2 ? a.translate(o * r, 0) : s <= Math.PI ? a.translate(t.width, -h * r) : s <= 1.5 * Math.PI ? a.translate( - h * n, t.height) : a.translate(0, -o * n),
            a.rotate(s),
            a.drawImage(e, 0, 0, n, r);
            var u = t.toDataURL("image/jpeg", 100);
            return u
        },
        this.cut = function(e, i, n, r, s) {
            return t.width = e.width,
            t.height = e.height,
            a.translate( - i, -n),
            a.drawImage(e, i, n, r, s),
            a.save(),
            t.toDataURL("image/jpeg", 100)
        },
        this.scale = function(t, a, e) {
            return i.instance.compress({
                image: t,
                rate: a,
                quality: e,
                isIos: $.os.ios,
                imageType: t.type
            })
        };
        e()
    };
    return n.instance = new n,
    a = n
},
[]);;
F.module("spostor/widget/upload_pic/edit_panel",
function(e, t) {
    var n = F.require("spostor/widget/upload_pic/confirm"),
    i = F.require("spostor/widget/upload_pic/base_object"),
    o = 45,
    a = function(e, t) {
        i.MDom.call(this);
        var a = ['<div class="edit_panel">', '<div class="j_preview preview">', "", "</div>", '<div class="buttons operate">', '<a class="j_rotate_left button rotate_left"></a>', "<span>\u65CB\u8F6C\u56FE\u7247</span>", '<a class="j_rotate_right button rotate_right"></a>', "</div>", '<div class="j_delete button delete"></div>', '<div class="buttons yesno">', '<a class="j_cancel cancel">\u53D6\u6D88</a>', '<a class="j_done done">\u786E\u5B9A</a></div>', "</div>"].join(""),
        s = null;
        $.extend(this.doms, {
            preview: null,
            image: new Image,
            mask: $("<div class='upload_pic_mask'></div>")
        }),
        $.extend(this.conf, e),
        $.extend(this.handler, t);
        var d = {
            enableRotate: !1
        },
        c = this,
        r = function() {
            c.doms.container = $(a);
            var e = c.doms.container;
            c.doms.preview = c.doms.container.find(".j_preview").append($(c.doms.image)),
            e.find(".j_rotate_left").bind("click", g),
            e.find(".j_rotate_right").bind("click", b),
            e.find(".j_delete").bind("click", p),
            e.find(".j_cancel").bind("click", u),
            e.find(".j_done").bind("click", m),
            e.height($(window).height()),
            c.doms.mask.height($(document.body).height()).appendTo($(document.body)),
            c.doms.preview.height($(window).height() - o),
            l()
        },
        l = function() {
            c.doms.image.onload = function() {
                var e = $(window).height() - o;
                c.doms.image.style.marginTop = c.doms.image.height < e ? (e - c.doms.image.height) / 2 + "px": "0px",
                c.enableOperation()
            },
            window.onorientationchange = function() {
                var e = window.orientation,
                t = 0 == e || 180 == e;
                c.doms.container.css("position", t ? "fixed": "absolute"),
                c.doms.container.css("top", t ? "0px": $(window).scrollTop() + "px")
            }
        },
        m = function(e) {
            $(c.doms.image).tbattr("style", ""),
            _(),
            c.disableOperation(),
            setTimeout(function() {
                c.runHandler(c.handler.onDone, h),
                w()
            },
            100),
            e.preventDefault()
        },
        u = function(e) {
            c.disableOperation(),
            c.runHandler(c.handler.onCancel, c.doms.image),
            c.hide(),
            e.preventDefault()
        },
        p = function(e) {
            n.show({
                content: "\u786E\u8BA4\u5220\u9664\u56FE\u7247\u5417\uFF1F",
                ok_callback: function() {
                    c.hide(),
                    c.runHandler(c.handler.onDelete, c.doms.image)
                },
                cancel_callback: null
            }),
            e.preventDefault()
        },
        h = {
            rotate: 0
        },
        f = function(e) {
            var t = $(c.doms.image);
            h.rotate += e,
            t.css("-webkit-transition", "-webkit-transform 0.5s ease-in"),
            t.css("-webkit-transform", "rotate(" + h.rotate + "deg)")
        },
        g = function(e) {
            d.enableRotate && (f( - 90), e.preventDefault())
        },
        b = function(e) {
            d.enableRotate && (f(90), e.preventDefault())
        },
        v = function() {
            c.doms.image.src = "//tb2.bdstatic.com/tb/mobile/sglobal/img/loading.gif"
        },
        w = function() {
            $(c.doms.image).removeAttr("style"),
            h.rotate = 0,
            v()
        };
        this.enableOperation = function() {
            d.enableRotate = !0
        },
        this.disableOperation = function() {
            d.enableRotate = !1
        },
        this.setImage = function(e) {
            c.doms.image.src = e
        },
        this.getImage = function() {
            return s
        },
        this.appendTo = function(e) {
            c.doms.container.appendTo(e)
        },
        this.show = function(e) {
            c.doms.container.show(),
            c.doms.mask.show(),
            e ? c.doms.image.src = e: v()
        };
        var _ = function() {
            c.doms.container.hide(),
            c.doms.mask.hide()
        };
        this.hide = function() {
            _(),
            w()
        },
        r()
    };
    return t = a
},
[]);;
F.module("spostor/widget/upload_pic/multi_upload_panel",
function(i, t) {
    var l = F.require("page_data"),
    e = F.require("spostor/widget/upload_pic/base_object"),
    s = (F.require("spostor/widget/upload_pic/client_guide"),
    function(i, t) {
        e.Panel.call(this),
        $.extend(this.doms, {
            container: i.container,
            multiBlock: null,
            multiInput: null
        }),
        $.extend(this.conf, i),
        $.extend(this.handler, t);
        var s = this,
        o = function() {
            s.doms.multiBlock = $("<a/>").tbattr({
                "class": "upload-block multi enable",
                href: "javascript:;"
            }).html('<span class="media_bar_btn_text">\u56FE\u7247</span>').appendTo(s.doms.container),
            s.doms.multiInput = $("<input class='upload-input' type='file' accept='image/*' multiple='multiple'/>").css("opacity", "0").bind("change",
            function(i) {
                s.runHandler(s.handler.changed, i),
                s.doms.multiInput.val("")
            }).appendTo(s.doms.multiBlock)
        };
        this.initialize = function() {
            var i = this;
            i._initializeBlock(),
            $.os.ios && o(),
            l.is_light_app || $.browser.tieba || i._initializeClientGuide(),
            i.doms.block.bind("click",
            function(t) {
                i.doms.block.hasClass("enable") && i.doms.count.html() - 0 > 0 && (i.conf.eventCenter.trigger("upload_pic_panel_show", i.doms.count.html()), t.preventDefault())
            })
        },
        this.enable = function() {
            this.doms.block.removeClass("disable"),
            this.doms.block.addClass("enable"),
            this.doms.multiBlock && this.doms.multiBlock.removeClass("disable")
        },
        this.disable = function() {
            this.doms.block.removeClass("enable"),
            this.doms.block.addClass("disable"),
            this.doms.multiBlock && this.doms.multiBlock.addClass("disable")
        },
        this.initialize()
    });
    return t = s
},
[]);;
F.module("spostor/widget/upload_pic/multi_preview",
function(e, t) {
    var n = e("spostor/widget/upload_pic/image_editor"),
    i = e("spostor/widget/upload_pic/edit_panel"),
    o = e("spostor/widget/upload_pic/base_object"),
    a = {
        support3d: "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix,
        setTranslateY: function(e) {
            return this.support3d ? "translate3d(0, " + e + "px, 0)": "translate(0, " + e + "px)"
        },
        setTranslateX: function(e) {
            return this.support3d ? "translate3d(" + e + "px, 0, 0)": "translate(" + e + "px, 0)"
        }
    },
    r = function() {
        o.MDom.call(this),
        this.doms.container = $("<div class='j_multi_preview multi_preview'></div>"),
        this.conf.maxLength = 8,
        $.extend(this.handler, {
            onDone: null,
            onDelete: null,
            onCancel: null,
            onAdd: null
        }),
        this._currentImage = null,
        this._currentItem = null,
        this._loadingImage = null,
        this._enable = !0,
        this._candidate = null,
        this._loadings = [],
        this._getItem = function() {
            return this._loadings.length <= 0 ? this._getFreeItem() : this._loadings.pop()
        },
        this._getFreeItem = function() {
            for (var e = this.doms.container.children(), t = 0; t < e.length && t < this.conf.maxLength; t++) if (e.eq(t).find("img").length <= 0) return e.eq(t);
            return null
        },
        this.hasImage = function() {
            return this.doms.container.find("img").length > 0
        },
        this._toHide = function() {
            this.hasImage() || this.hide()
        },
        this._removeImage = function() {},
        this._addImage = function() {},
        this._loading = function(e) {
            var t = $(new Image).tbattr("class", "j_loading loading").tbattr("src", "//tb2.bdstatic.com/tb/mobile/sglobal/img/loading.gif");
            e.unbind("click").append(t)
        },
        this._unLoading = function(e) {
            e.find(".j_loading").remove()
        },
        this._addCloseButton = function(e, t) {
            var n = this,
            i = $("<a href='javascript:;' class='j_item_close item_close'><span class='btn_close'></span></a>");
            i.appendTo(e),
            i.bind("click",
            function(i) {
                n._currentItem = e,
                n._currentImage = t,
                n._removeImage(),
                n.conf.eventCenter.trigger("upload_pic_show_count", n.doms.container.find("img").length),
                i.stopPropagation()
            })
        },
        this.addImage = function(e) {
            var t = $(e),
            n = this._getItem();
            this._addImage(n, t),
            this._addCloseButton(n, t),
            this._currentItem = null
        },
        this.disable = function() {
            this.doms.container.find(".j_item_close").hide(),
            this._enable = !1
        },
        this.enable = function() {
            this.doms.container.find(".j_item_close").show(),
            this._enable = !0
        },
        this.readyToLoad = function() {
            var e = this._candidate ? this._candidate: this._getFreeItem();
            this._currentItem = e,
            this._currentItem.show(),
            this._enable = !1,
            this._loading(e),
            this._readyToLoad(e),
            this._candidate = null,
            this._loadings.push(e)
        },
        this._readyToLoad = function() {},
        this.reset = function() {
            for (var e = _self._getFreeItem(); null != e;) _self._currentItem = e,
            _removeImage(),
            e = _self._getFreeItem()
        }
    },
    s = function(e, t) {
        r.call(this),
        $.extend(this.conf, e),
        $.extend(this.handler, t),
        this.doms.adder = $("<div class='item add'><input class='upload-input' type='file' accept='image/*' /></div>");
        var o = this,
        s = null,
        d = function() {
            c(),
            l(),
            o.gesture || (o.gesture = new $.iGesture({
                container: o.conf.outerContainer,
                selector: ".j_multi_preview",
                zoomed: !1,
                hScroll: !0,
                isDispatchClick: !1,
                onTouchStart: function() {}
            }))
        };
        this._loading = function(e) {
            $.loading(),
            e.unbind("click")
        },
        this._unLoading = function() {
            $.unloading()
        };
        var c = function() {
            for (var e = 0; e < o.conf.maxLength; e++) {
                $("<div class='j_item item' style='display:none;'></div>").appendTo(o.doms.container)
            }
        },
        l = function() {
            o.doms.container.append(o.doms.adder),
            o.doms.adder.find("input").bind("change",
            function(e) {
                o.runHandler(o.handler.onAdd, e),
                $(e.target).val("")
            })
        },
        u = function(e, t) {
            e.onLoaded = function() {
                o._enable = !0,
                h(o._currentItem, o._currentImage)
            },
            e.src = n.instance.rotate(e, t)
        },
        m = function() {
            s = new i({},
            {
                onCancel: null,
                onDone: function(e) {
                    e.rotate % 360 != 0 && (o._enable = !1, o._loading(o._currentItem), o._currentImage.remove(), u(o._currentImage[0], e.rotate))
                },
                onDelete: o._removeImage
            }),
            s.appendTo($(document.body))
        },
        _ = function(e) {
            s || m(),
            s.show(e.src)
        },
        h = function(e, t) {
            o._enable = !0,
            o._unLoading(e),
            e.append(t),
            o.show()
        },
        g = function() {
            o._getFreeItem() ? o.doms.adder.show() : o.doms.adder.hide()
        };
        this._getItemCount = function() {
            for (var e = o.doms.container.children(), t = 0, n = 0; n < e.length && n < o.conf.maxLength; n++) e.eq(n).find("img").length > 0 && (t += 1);
            return t < o.conf.maxLength && (t += 1),
            t
        },
        this._removeImage = function() {
            o._currentItem.hide(),
            o._currentImage.remove(),
            o._currentItem.find(".item_span").remove(),
            o._currentItem.find(".j_item_close").unbind("click").remove(),
            o._currentItem.insertBefore(o.doms.adder),
            o.runHandler(o.handler.onDelete, o._currentImage[0]),
            o._toHide(),
            g(),
            o.doms.container.css("width", 95 * o._getItemCount() + "px")
        },
        this._addImage = function(e, t) {
            h(e, t);
            var n = t.tbattr("src"),
            i = $('<span class="item_span"></span>');
            t.tbattr("class", "j_item_img"),
            t.hide(),
            e.append(i),
            i.css({
                "background-image": "url(" + n + ")",
                "background-repeat": "no-repeat",
                "background-size": "cover",
                "background-position": "center 20%"
            }),
            e.show(),
            $.os.ios && e.bind("click", f(e, t)),
            g();
            var r = 95 * o._getItemCount(),
            s = window.innerWidth - 15;
            o.doms.container.css("width", r + "px"),
            r > s && o.doms.container.css("-webkit-transform", a.setTranslateX(s - r))
        },
        this._readyToLoad = function() {
            g()
        };
        var f = function(e, t) {
            return function() {
                o._enable && (o._currentItem = e, o._currentImage = t, _(t[0]))
            }
        };
        d()
    },
    s = {
        Preview: s
    };
    return t = s
},
[]);;
F.module("spostor/widget/upload_pic",
function(e, t) {
    var r = F.require("spostor/widget/upload_pic/base_object").Manager,
    n = F.require("spostor/widget/upload_pic/no_manager"),
    o = F.require("spostor/widget/upload_pic/low_manager"),
    i = F.require("spostor/widget/upload_pic/high_manager"),
    a = function(e) {
        this.create = function() {
            var r = {
                container: e.container,
                baseUrl: e.baseurl,
                outerContainer: e.outerContainer,
                submitPanel: e.submitPanel,
                network: e.network,
                eventCenter: e.eventCenter,
                image_max_length: e.image_max_length
            },
            d = {
                uploaded: e.uploaded,
                deleted: e.deleted,
                selected: e.selected,
                error: e.error
            };
            return a() ? t() ? new i(r, d) : new o(r, d) : new n(r, d)
        };
        var t = function() {
            var t = !1;
            try {
                document.createElement("canvas").getContext("2d"),
                t = !0
            } catch(n) {
                t = !1
            }
            return t = t && "undefined" != typeof FileReader && null != FileReader && "undefined" != typeof FormData && null != FormData,
            t = t && ($.os.ios || !$.os.ios && e.network == r.NETWORK.WIFI)
        },
        a = function() {
            var e = document.createElement("input");
            if (e.type = "file", $.client.device && "vivo X510t" === $.client.device.family) {
                var t = $.os.version ? $.os.version.split(".") : [],
                r = t[0],
                n = t[1];
                if (4 >= r && 2 >= n) return ! 1
            }
            return ! e.disabled
        }
    };
    return t = a
},
[]);;
F.module("spostor/widget/upload_pic/client_guide",
function(o, e) {
    var n = {},
    t = PageUnit.load("pb_main_postor_uppic_dialog_conf");
    return n.downloadUrl = t.downloadUrl[0],
    n.init = function(o) {
        $.get(o.baseUrl + "pv?lp=9041"),
        dialog = new Dialog({
            mask: !0,
            closebtn: !0,
            content: "\u4F7F\u7528\u8D34\u5427\u624B\u673A\u5BA2\u6237\u7AEF<br>\u4F53\u9A8C\u4F18\u8D28\u7684\u793E\u533A\u670D\u52A1",
            okbtn: "\u8D34\u5427\u5BA2\u6237\u7AEF",
            okbtnStyle: "background-color:#42a2e5;border:1px solid #42a2e5;margin-bottom:15px",
            fixed: !0,
            wrapperClass: "client_download_dlg"
        }),
        dialog.dom.on("ok",
        function() {
            dialog.remove(!0),
            $.location.setHref(o.baseUrl + "redirect?tbjump=" + encodeURIComponent(n.downloadUrl) + "&lp=9043"),
            o && $.isFunction(o.func_new) && o.func_new()
        }).on("close",
        function() {
            dialog.remove(!0),
            o && $.isFunction(o.func) && o.func()
        }).on("cancel",
        function() {
            dialog.remove(!0),
            o && $.isFunction(o.func) && o.func()
        });
        var e = new Date;
        localStorage.setItem("image_upload_client_guide", e.getTime())
    },
    n.needShow = function(o) {
        var e = new Date,
        n = !localStorage.getItem("image_upload_client_guide") || e.getTime() - localStorage.getItem("image_upload_client_guide") > 2592e5 ? !0 : !1;
        return ! n || $.os.baidu || $.os.palmBaidu || 2 == o ? !1 : !0
    },
    e = n
},
[]);
F.module("sglobal/component/float_layer",
function(t, i) {
    var n = {
        support3d: "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix,
        setTranslateY: function(t) {
            return this.support3d ? "translate3d(0, " + t + ", 0)": "translate(0, " + t + ")"
        },
        setTranslateX: function(t) {
            return this.support3d ? "translate3d(" + t + ", 0, 0)": "translate(" + t + ", 0)"
        }
    },
    e = ["top", "right", "bottom", "left"],
    s = $.os.android,
    o = s && parseInt($.os.version.split(".")[0]),
    r = function(t) {
        t = t || {},
        this._layer = null,
        this._isShow = !1,
        this._isNeedAnim = t.isNeedAnim || !1,
        this._container = t.container || $("body"),
        this._showEnd = t.showEnd ||
        function() {},
        this._hideEnd = t.hideEnd ||
        function() {},
        this._intoDirection = t.intoDirection || "right",
        this._isDoNormalTrans = s && 4 > o || !this._isNeedAnim,
        this._animCounter = 0,
        this._init()
    };
    return r.prototype = {
        _init: function() {
            this._createLayer(),
            this._initLayer(),
            this._initListener()
        },
        _createLayer: function() {
            this._layer = $('<div class="j_ui_floatlayer ui_floatlayer"></div>')
        },
        _initLayer: function() {
            this._container.append(this._layer);
            var t = this._getCssStyleByDirection(this._intoDirection),
            i = {};
            this._isNeedAnim && this._layer.addClass("ui_floatlayer_anim"),
            $.extend(i, t.initial),
            this._layer.css(i)
        },
        _getCssStyleByDirection: function(t) {
            var i = {};
            switch (t) {
            case e[0]:
                i.initial = {
                    top: 0 / 0,
                    left: "0px"
                },
                this._isDoNormalTrans ? (i.show = {
                    top: 0
                },
                i.hide = {
                    top: 0 / 0
                }) : (i.show = {
                    "-webkit-transform": n.setTranslateY("100%")
                },
                i.hide = {
                    "-webkit-transform": n.setTranslateY(0)
                });
                break;
            case e[1]:
                i.initial = {
                    top: "0px",
                    left: "100%"
                },
                this._isDoNormalTrans ? (i.show = {
                    left: 0
                },
                i.hide = {
                    left: "100%"
                }) : (i.show = {
                    "-webkit-transform": n.setTranslateX("-100%")
                },
                i.hide = {
                    "-webkit-transform": n.setTranslateX(0)
                });
                break;
            case e[2]:
                i.initial = {
                    top: "100%",
                    left: "0px"
                },
                this._isDoNormalTrans ? (i.show = {
                    top: 0
                },
                i.hide = {
                    top: "100%"
                }) : (i.show = {
                    "-webkit-transform": n.setTranslateY("-100%")
                },
                i.hide = {
                    "-webkit-transform": n.setTranslateY(0)
                });
                break;
            case e[3]:
                i.initial = {
                    top: "0px",
                    left: 0 / 0
                },
                this._isDoNormalTrans ? (i.show = {
                    left: 0
                },
                i.hide = {
                    left: 0 / 0
                }) : (i.show = {
                    "-webkit-transform": n.setTranslateX("100%")
                },
                i.hide = {
                    "-webkit-transform": n.setTranslateX(0)
                })
            }
            return i
        },
        _setLayerSizeAndPos: function() {
            var t = this._getCssStyleByDirection(this._intoDirection),
            i = {};
            $.extend(i, t.initial),
            this._layer.css(i)
        },
        _initListener: function() {
            this._isNeedAnim && this._layer.on("webkitTransitionEnd", _.bind(this._animEndDo, this))
        },
        _animEndDo: function() {
            this._animCounter < 1 && (this._animCounter++, this._isShow ? (this._layer.off("webkitTransitionEnd").removeClass("ui_floatlayer_anim").css("-webkit-transform", "none"), "right" == this._intoDirection || "left" == this._intoDirection ? this._layer.css("left", "0") : this._layer.css("top", "0"), $.isFunction(this._showEnd) && this._showEnd()) : $.isFunction(this._hideEnd) && this._hideEnd())
        },
        show: function() {
            var t = this,
            i = t._getCssStyleByDirection(t._intoDirection);
            t._animCounter = 0,
            t._isNeedAnim ? setTimeout(function() {
                t._layer.css(i.show)
            },
            100) : setTimeout(function() {
                t._layer.css(i.show),
                $.isFunction(t._showEnd) && t._showEnd()
            },
            0),
            t._isShow = !0
        },
        hide: function() {
            var t = this,
            i = t._getCssStyleByDirection(t._intoDirection);
            t._animCounter = 0,
            t._isNeedAnim ? (t._layer.css(i.initial), t._layer.css(i.show), setTimeout(function() {
                t._layer.addClass("ui_floatlayer_anim").on("webkitTransitionEnd", _.bind(t._animEndDo, t)),
                t._layer.css(i.hide)
            },
            100)) : (t._layer.css(i.hide), setTimeout(function() {
                $.isFunction(t._hideEnd) && t._hideEnd()
            },
            0)),
            t._isShow = !1
        },
        getLayer: function() {
            return this._layer
        },
        getIsShow: function() {
            return this._isShow
        },
        render: function(t) {
            var i = null;
            i = "string" == typeof t ? $(t) : t,
            !i.length || i.length <= 0 || this._layer && this._layer.append(i)
        },
        destroy: function() {
            this._layer.off("webkitTransitionEnd"),
            this._layer.remove()
        }
    },
    i = r
},
[]);
F.module("spostor/widget/recommend",
function(t, i) {
    var s = F.require("sglobal/component/float_layer"),
    e = F.require("page_data").base_url + "suggest/topic",
    n = '<div class="blue_kit blue_kit_top"><div class="blue_kit_left"><a class="blue_kit_btn_back blue_kit_btn j_at_return" href="javascript:;"><span class="icon_tieba_logo blue_kit_btn_logo"></span><span class="blue_kit_text">\u9009\u62E9\u8BDD\u9898</span></a></div><div class="blue_kit_right"></div></div><div class="at_search ui_search"><span class="icon_search"></span><input type="text" placeholder="\u8F93\u5165\u4F60\u611F\u5174\u8DA3\u7684\u70ED\u8BAE\u8BCD\u6761" class="ui_search_textbox j_at_search_input"><a class="at_search_btn_close j_at_search_btn_close" href="javascript:;"><span class="btn_close"></span></a></div><div class="at_user_list j_at_user_list overthrow"></div><div class="at_selected_user_list j_at_selected_user_list"></div>',
    a = '<div class="list_item j_user_list_item" data-name="<%=name%>"><a class="list_item_link at_user_list_item_link" href="javascript:;" title="<%= topic_name %>"><span class="user_list_item_name"><%= topic_name %></span><div class="user_list_item_checkbox_wrapper"><%= real_discuss_num %></div></a></div>',
    c = function(t) {
        this.options = $.extend({
            maxAmount: 5
        },
        t),
        this._buildPanel(),
        this._initEvent(),
        this._initUserModel()
    };
    return c.prototype = {
        _buildPanel: function() {
            this.floatLayer = new s({
                showEnd: function() {},
                hideEnd: function() {
                    this.destroy()
                }
            }),
            this.$container = $(this.floatLayer.getLayer()),
            this.$container.append(n).addClass("at_float_layer"),
            this.$userList = this.$container.find(".j_at_user_list"),
            this.$selectedUserList = this.$container.find(".j_at_selected_user_list"),
            function(t) {
                setTimeout(function() {
                    t.floatLayer.show()
                },
                0)
            } (this)
        },
        _initEvent: function() {
            var t = this;
            this.$container.on("click", ".j_at_return", _.bind(function() {
                "function" == typeof this.options.callback.onCancel && this.options.callback.onCancel(),
                this.floatLayer.hide()
            },
            this));
            var i = this.$container.find(".j_at_search_btn_close"),
            s = this.$container.find(".j_at_search_input");
            s.on("input",
            function() {
                var e = $(this).val();
                "" === e ? (i.hide(), t.renderList(t._initTopicList)) : (i.show(), t.query(e,
                function() {
                    return s.val() === e
                }))
            }),
            i.on("click",
            function(t) {
                t.preventDefault(),
                s.val("").trigger("input")
            }),
            this.$userList.on("click", ".at_user_list_item_link",
            function() {
                "function" == typeof t.options.callback.onFinish && t.options.callback.onFinish({
                    title: $.unescapeHTML($(this).tbattr("title"))
                }),
                t.floatLayer.hide()
            })
        },
        _initUserModel: function() {
            this._selectedUsers = [],
            this._allUser = {},
            this._initTopicList = [],
            $.loading(),
            $.getJSON(e, _.bind(function(t) {
                if ($.unloading(), t.data) {
                    var i = [];
                    t.data.user_his_topic.forEach(function(t) {
                        i.push(t)
                    }),
                    t.data.default_topic.forEach(function(t) {
                        var s = !1;
                        i.forEach(function(i) {
                            i.topic_name === t.topic_name && (s = !0)
                        }),
                        s || i.push(t)
                    }),
                    $.each(i, _.bind(function(t, i) {
                        this._initTopicList.push(i)
                    },
                    this)),
                    this.renderList(this._initTopicList)
                }
            },
            this))
        },
        query: function(t) {
            $.loading(),
            $.getJSON(e + "?prefix=" + t, _.bind(function(t) {
                if ($.unloading(), t.data) {
                    var i = t.data.user_his_topic;
                    this._queryInitTopicList = [],
                    $.each(t.data.sug_topic, _.bind(function(t, s) {
                        i.push(s)
                    },
                    this)),
                    $.each(i, _.bind(function(t, i) {
                        this._queryInitTopicList.push(i)
                    },
                    this)),
                    this.$userList.html(""),
                    this.renderList(this._queryInitTopicList)
                }
            },
            this))
        },
        renderList: function(t) {
            t.length && (t = t.slice(0, 20));
            var i = "";
            $.each(t, _.bind(function(t, s) {
                i += this._buildUserListItem(s)
            },
            this)),
            this.$userList.html(i)
        },
        _buildUserListItem: function(t) {
            return baidu.template(a, t)
        }
    },
    i = c
},
[]);
F.module("spostor/widget/editor_title",
function(t, e) {
    function i(t) {
        var e = '<input type="text" value="' + t.prefix + '" placeholder="' + t.placeholder + '" class="j_editor_input editor_input ' + t.inputClassName + '"/><div class="recommend_title_panels"></div>';
        return e
    }
    function n(t) {
        this._outerContainer = t.outerContainer || "",
        this._eventCenter = t.eventCenter || {},
        this._config = {
            inputClassName: "editor_title",
            placeholder: "\u6807\u9898",
            prefix: ""
        },
        this._isEnable = 1,
        this._inputSel = null,
        this.setConfig(t),
        $.extend(this, new _.Events)
    }
    var r = F.require("spostor/widget/recommend");
    return n.prototype = {
        setConfig: function(t) {
            $.extend(this._config, t)
        },
        getTitleSel: function() {
            return this._inputSel
        },
        init: function() {
            var t = i(this._config);
            this._container = $(t),
            this._outerContainer.html(this._container),
            this._outerContainer.find("input").css("width", "92%"),
            this._inputSel = this._container,
            this._opBar = this._container.parents("#j_main_editor_container").find(".j_media_bar"),
            this._topicContainer = this._outerContainer.find(".recommend_title_panels")
        },
        initEvents: function() {
            var t = this;
            this._inputSel.bind("focus",
            function() {
                t._opBar.hide(),
                _.eventCenter.trigger("editor_content_focus")
            }),
            this._inputSel.bind("blur",
            function() {
                t._opBar.show(),
                _.eventCenter.trigger("editor_content_blur")
            }),
            this._inputSel.bind("keyup",
            function(e) {
                13 == e.keyCode && t._eventCenter.trigger("editor_title_enter_key")
            }),
            this._inputSel.bind("input",
            function() {
                t.trigger("editor_title_input")
            }),
            this._topicContainer.on("click",
            function(e) {
                e && e.preventDefault(),
                new r({
                    callback: {
                        onCancel: function() {},
                        onFinish: function(e) {
                            var i = t.getTitle();
                            t.setTitle(i + "#" + e.title + "#"),
                            t.focus()
                        }
                    }
                })
            })
        },
        focus: function() {
            var t = this._inputSel[0];
            t.focus();
            var e = t.selectionEnd;
            t.setSelectionRange(e, e),
            e > 0 && this.trigger("editor_title_input")
        },
        blur: function() {
            this._inputSel[0].blur()
        },
        removeEvents: function() {
            this._inputSel.off()
        },
        setEnable: function() {
            this._inputSel.removeAttr("disabled"),
            this._inputSel.tbattr("placeholder", this._config.placeholder)
        },
        setDisable: function() {
            this._inputSel.tbattr("disabled", "disabled"),
            this._inputSel.tbattr("placeholder", "")
        },
        reset: function() {
            this.setPlaceholder(this._config.placeholder),
            this.setTitle(this._config.prefix),
            this.setEnable()
        },
        getTitle: function() {
            return this._inputSel.val()
        },
        setPlaceholder: function(t) {
            var e = t || "";
            this._inputSel.tbattr("placeholder", e)
        },
        setTitle: function(t) {
            var e = t || "";
            this._inputSel.val(e),
            this.trigger("editor_title_input")
        },
        insertTitle: function(t) {
            var e = t + this.getTitle();
            this.setTitle(e)
        },
        hasPrefix: function() {
            return "" != this._config.prefix && this.getTitle().indexOf(this._config.prefix) > -1 ? 1 : 0
        }
    },
    e = n
},
[]);
F.module("spostor/widget/prefix_editor_title",
function(i, t) {
    function e(i) {
        var t = '<input type="text" value="' + i.prefix + '" placeholder="' + i.placeholder + '" class="editor_input ' + i.inputClassName + '"/><div class="j_prefix_toggle prefix_toggle"><a class="icon arrow ' + i.arrowStyle + ' arrow_up"></a></div><div class="j_prefix_panel prefix_panel"></div><div class="recommend_title_panel"><div>';
        return t
    }
    var n = F.require("spostor/widget/editor_title"),
    s = F.require("page_data"),
    o = F.require("spostor/widget/recommend"),
    r = function(i) {
        $.extend(this, n.prototype);
        var t = i.prefix,
        r = i.editor,
        a = "#type#",
        l = "",
        d = (t.replace(a, ""), i.arrowStyle, i.initMode),
        c = function(i) {
            var e = t.replace(a, i);
            return e
        },
        f = null,
        p = null,
        u = 0;
        _types = i.titlePrefixType.split(" "),
        _types.length > 0 && (l = _types[0], i.prefix = c(_types[0])),
        n.call(this, i);
        var _ = this;
        this.init = function() {
            var i = e(this._config);
            this._outerContainer.html(i),
            this._outerContainer.addClass("prefix_container"),
            this._outerContainer.find("input").css("width", "92%"),
            this._inputSel = this._container = this._outerContainer.find("input"),
            this._topicbtContainer = this._outerContainer.find(".recommend_title_panel"),
            this._initialize()
        };
        var h = function() {
            r.postDraft && r.postDraft.setTitlePrefix && r.postDraft.setTitlePrefix(_._config.prefix)
        },
        g = function() {
            p.show(),
            p.animate({
                height: u
            },
            100, null,
            function() {
                f.find("a").removeClass("arrow_down").addClass("arrow_up"),
                p.show(),
                s.is_light_app && f.removeClass("show").addClass("hide")
            })
        },
        v = function() {
            f.find("a").removeClass("arrow_up").addClass("arrow_down"),
            p.animate({
                height: 0
            },
            100, null,
            function() {
                p.hide(),
                f.find("a").removeClass("arrow_up").addClass("arrow_down"),
                s.is_light_app && f.removeClass("hide").addClass("show")
            })
        },
        C = function() {
            f.unbind("click").bind("click",
            function() {
                "none" != p.css("display") ? v() : g()
            }).removeClass("disable"),
            _._outerContainer.removeClass("disable")
        },
        x = function() {
            f.unbind("click").addClass("disable"),
            _._outerContainer.addClass("disable"),
            v()
        },
        w = function() {
            var i = _.getTitle();
            if (i.indexOf(_._config.prefix) > -1) return _._config.prefix;
            for (var t = 0,
            e = 0; e < _._config.prefix.length && i[e] == _._config.prefix[e]; e++) t++;
            return t > 10 ? _._config.prefix.substring(0, t) : ""
        },
        b = function() {
            C()
        };
        this.initEvents = function() {
            var i = this,
            t = this;
            p.find(".j_item").bind("click",
            function(t) {
                var e = i.getTitle(),
                n = w();
                i._config.prefix = c($(t.target).text()),
                n.length > 0 ? i.setTitle(e.replace(n, i._config.prefix)) : i.setTitle(i._config.prefix),
                h(),
                v(),
                i.focus()
            });
            var e = !1;
            this._inputSel.on("touchend",
            function() {
                return e ? !0 : (i.focus(), $.os.ios ? !1 : void 0)
            }).bind("focus",
            function() {
                e = !0
            }).bind("blur",
            function() {
                e = !1
            }),
            this._inputSel.bind("keyup",
            function(t) {
                13 == t.keyCode && i.eventCenter.trigger("editor_title_enter_key")
            }),
            this._inputSel.bind("input",
            function() {
                b(),
                "none" != p.css("display") && v(),
                t.trigger("editor_title_input")
            }),
            this._topicbtContainer.on("click",
            function(t) {
                t && t.preventDefault(),
                new o({
                    callback: {
                        onCancel: function() {},
                        onFinish: function(t) {
                            var e = i.getTitle();
                            i.setTitle(e + "#" + t.title + "#"),
                            i.focus()
                        }
                    }
                })
            }),
            r.editorContent.on("editor_content_focus",
            function() {
                v()
            })
        },
        this._initialize = function() {
            this._outerContainer.css("position", "relative").css("height", "43px"),
            f = this._outerContainer.find(".j_prefix_toggle").eq(0),
            p = this._outerContainer.find(".j_prefix_panel").eq(0);
            for (var i = 0; i < _types.length; i++) p.append("<span class='j_item item'>" + _types[i] + "</span>");
            C(),
            u = p.height(),
            "show" == d ? (p.css("height", u + "px").css("overflow", "hidden"), p.show()) : (p.css("height", "0px").css("overflow", "hidden"), p.hide(), s.is_light_app && (u -= 10, f.removeClass("show").addClass("hide")), f.find("a").removeClass("arrow_up").addClass("arrow_down"))
        },
        this.setEnable = function() {
            this._inputSel.removeAttr("disabled"),
            this._inputSel.tbattr("placeholder", this._config.placeholder),
            b()
        },
        this.setDisable = function() {
            this._inputSel.tbattr("disabled", "disabled"),
            this._inputSel.tbattr("placeholder", ""),
            x()
        },
        this.reset = function() {
            this.setPlaceholder(this._config.placeholder),
            this.setTitle(this._config.prefix),
            this.setEnable(),
            b()
        },
        this.hasPrefix = function() {
            return "" != this._config.prefix && this.getTitle().indexOf(this._config.prefix) > -1 ? 2 : 0
        }
    };
    return t = r
},
[]);
F.module("sglobal/component/app_starter",
function(e, a) {
    var o = new
    function() {
        window.app = window.app || {};
        this.bind = function(e, a) {
            var o = this,
            r = a;
            e.bind("click",
            function() {
                return function(e) {
                    return e.preventDefault(),
                    o.triggerAppStarter(r),
                    !1
                }
            } ())
        },
        this.delegate = function(e, a, o) {
            var r = this,
            n = o;
            $("body").on(e, a,
            function() {
                return function(e) {
                    return e.preventDefault(),
                    r.triggerAppStarter(n),
                    !1
                }
            } ())
        },
        this.triggerAppStarter = function(e) {
            return e.downloadUrl || !$.browser.baidu && !$.browser.baiduFrame ? ((void 0 === e.isIos ? $.os.ios: e.isIos) ? t(e) : r(e), void 0) : (o(e), !1)
        };
        var e = function(e) {
            e.locate = e.locate ? e.locate: "\u8C03\u8D77\u6210\u529F",
            a(e),
            $.isFunction(e.onSucc) && e.onSucc()
        },
        a = function(e) {
            return ! 0
        },
        o = function(e) {
            e.locate = e.locate ? e.locate: "\u8C03\u8D77\u5931\u8D25",
            a(e);
            var o = F.require("uri"),
            r = new o($.location.getHref()).getQueryParamValue("_client_version");
            return e.onFail ? (e.onFail && e.onFail(e.downloadUrl), void 0) : r ? void 0 : ($.location.setHref(e.downloadUrl), void 0)
        },
        r = function(a) {
            var r;
            a.url ? (r = "http://applink.baidu.com/?url=" + encodeURIComponent(a.url) + "&from=tieba", $.location.setHref(r), e(a)) : o(a)
        },
        n = function(e, a) {
            if (e) {
                var o = document.createElement("iframe");
                o.style.display = "none";
                var r, n = document.body,
                t = function(e) {
                    clearTimeout(r),
                    i(e, !1)
                },
                i = function(e, r) {
                    "function" == typeof a && a(r),
                    window.removeEventListener("pagehide", t, !0),
                    window.removeEventListener("pageshow", t, !0),
                    o && (o.onload = null, n.removeChild(o), o = null)
                };
                window.addEventListener("pagehide", t, !0),
                window.addEventListener("pageshow", t, !0),
                o.onload = i,
                o.src = e,
                n.appendChild(o);
                var u = +new Date;
                r = setTimeout(function() {
                    r = setTimeout(function() {
                        var e = +new Date;
                        u - e > 1300 ? i(null, !1) : i(null, !0)
                    },
                    1200)
                },
                60)
            }
        },
        t = function(a) {
            var r;
            switch (a.page) {
            case "sfrs":
            case "frs":
                r = "jumptoforum?tname=" + a.param;
                break;
            case "spb":
            case "pb":
                r = "jumptoforum?kz=" + a.param;
                break;
            case "im":
                r = "jumptoforum?groupid=" + a.param + "=groupname=" + a.groupname;
                break;
            case "help":
                r = "jumptoforum?fid=" + a.param.fid + "=fname=" + a.param.fname;
                break;
            case "member":
                r = a && a.param ? "jumptoforum?membership=purchase&statCode=" + a.param.statCode + "&from_scene=" + a.param.from_scene: "jumptoforum?membership=purchase";
                break;
            case "fudaiservice":
                r = "jumptoforum?forumId=" + a.param.fid + "=forumName=" + a.param.fname;
                break;
            case "rpb":
                r = "jumptoforum?ftid=" + a.param.ftid;
                break;
            default:
                r = ""
            }
            if (null != a.packageName) var t = $.trim(a.packageName) ? a.packageName: "com.baidu.tieba";
            else var t = "com.baidu.tieba";
            var i = t + "://" + r,
            u = new Date;
            setTimeout(function() {
                new Date - u < 2500 && o(a)
            },
            2e3),
            e(a),
            setTimeout(function() {
                $.browser.safari ? n(i,
                function() {}) : document.location.href = i
            },
            100)
        }
    };
    return a = o
},
[]);
F.module("spostor/widget/at",
function(t, e) {
    var s = F.require("sglobal/component/float_layer"),
    i = F.require("page_data").base_url + "relateduser",
    a = '<div class="blue_kit blue_kit_top"><div class="blue_kit_left"><a class="blue_kit_btn_back blue_kit_btn j_at_return" href="javascript:;"><span class="icon_tieba_logo blue_kit_btn_logo"></span><span class="blue_kit_text">\u9009\u62E9\u597D\u53CB</span></a></div><div class="blue_kit_right"><a class="blue_kit_btn j_at_finish" href="javascript:;">\u5B8C\u6210</a></div></div><div class="at_search ui_search"><span class="icon_search"></span><input type="text" placeholder="\u641C\u7D22" class="ui_search_textbox j_at_search_input"><a class="at_search_btn_close j_at_search_btn_close" href="javascript:;"><span class="btn_close"></span></a></div><div class="at_user_list j_at_user_list overthrow"></div><div class="at_selected_user_list j_at_selected_user_list"></div>',
    n = '<div class="list_item j_user_list_item" data-name="<%=name%>"><a class="list_item_link at_user_list_item_link" href="javascript:;"><img src="https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/<%=portrait%>" class="user_list_item_portrait" width="46" height="46"/><span class="user_list_item_name"><%= name_show === "" ? name : name_show %></span><div class="user_list_item_checkbox_wrapper"><input type="checkbox" class="j_user_list_item_checkbox ui_checkbox" id="checkbox_<%=name%>"<% if (selected){ %> checked="checked"<%}%>/><label class="user_list_item_label" for="checkbox_<%=name%>"></label></div></a></div>',
    c = '<img src="https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/<%=portrait%>" data-name="<%=name%>" class="at_selected_user_list_item j_at_selected_user_list_item"/>',
    r = function(t) {
        this.options = $.extend({
            maxAmount: 5
        },
        t),
        this._buildPanel(),
        this._initEvent(),
        this._initUserModel()
    };
    return r.prototype = {
        _buildPanel: function() {
            this.floatLayer = new s({
                showEnd: function() {},
                hideEnd: function() {
                    this.destroy()
                }
            }),
            this.$container = $(this.floatLayer.getLayer()),
            this.$container.append(a).addClass("at_float_layer"),
            this.$userList = this.$container.find(".j_at_user_list"),
            this.$selectedUserList = this.$container.find(".j_at_selected_user_list"),
            function(t) {
                setTimeout(function() {
                    t.floatLayer.show()
                },
                0)
            } (this)
        },
        _initEvent: function() {
            var t = this;
            this.$container.on("click", ".j_at_return", _.bind(function() {
                "function" == typeof this.options.callback.onCancel && this.options.callback.onCancel(),
                this.floatLayer.hide()
            },
            this)),
            this.$container.on("click", ".j_at_finish", _.bind(function() {
                "function" == typeof this.options.callback.onFinish && this.options.callback.onFinish({
                    users: this._selectedUsers
                }),
                this.floatLayer.hide()
            },
            this));
            var e = this.$container.find(".j_at_search_btn_close"),
            s = this.$container.find(".j_at_search_input");
            s.on("input",
            function() {
                var i = $(this).val();
                "" === i ? (e.hide(), t.renderList(t._initUserNameList)) : (e.show(), t.query(i,
                function() {
                    return s.val() === i
                }))
            }),
            e.on("click",
            function(t) {
                t.preventDefault(),
                s.val("").trigger("input")
            }),
            this.$userList.on("click", ".j_user_list_item",
            function(e) {
                e.preventDefault();
                var s = $(this).find(".j_user_list_item_checkbox:checked").length,
                i = $(this).tbdata("name");
                s ? t.removeUser(i) : t.addUser(i)
            }),
            this.$selectedUserList.on("click", ".j_at_selected_user_list_item",
            function() {
                var e = $(this).tbdata("name");
                t.removeUser(e)
            })
        },
        _initUserModel: function() {
            this._selectedUsers = [],
            this._allUser = {},
            this._initUserNameList = [],
            $.loading(),
            $.getJSON(i, _.bind(function(t) {
                $.unloading(),
                t.data && ($.each(t.data, _.bind(function(t, e) {
                    e.selected = !1,
                    this._initUserNameList.push(e.name),
                    this._allUser[e.name] = e
                },
                this)), this.renderList(this._initUserNameList))
            },
            this))
        },
        query: function(t, e) {
            $.loading(),
            $.getJSON(i + "?q=" + t, _.bind(function(t) {
                if ($.unloading(), t.data && ("function" != typeof e || e.call(this, t))) {
                    var s = [];
                    $.each(t.data,
                    function(t, e) {
                        s.push(e.name)
                    }),
                    this.renderList(s)
                }
            },
            this))
        },
        addUser: function(t) {
            if (this._selectedUsers.length >= this.options.maxAmount) return $.toast.send("\u6700\u591A\u53EA\u80FD@" + this.options.maxAmount + "\u4E2A\u4EBA"),
            !1;
            if ( - 1 === this._selectedUsers.indexOf(t)) return this._selectedUsers.push(t),
            this._allUser[t].selected = !0,
            this.$userList.find("#checkbox_" + t).tbattr("checked", "checked"),
            this.$selectedUserList.prepend(baidu.template(c, this._allUser[t])),
            !0
        },
        removeUser: function(t) {
            var e = this._selectedUsers.indexOf(t); - 1 !== e && (this._selectedUsers.splice(e, 1), this._allUser[t].selected = !1, this.$userList.find("#checkbox_" + t).removeAttr("checked"), this.$selectedUserList.find('[data-name="' + t + '"]').remove())
        },
        renderList: function(t) {
            t.length && (t = t.slice(0, 200));
            var e = "";
            $.each(t, _.bind(function(t, s) {
                e += this._buildUserListItem(s)
            },
            this)),
            this.$userList.html(e)
        },
        _buildUserListItem: function(t) {
            return baidu.template(n, this._allUser[t])
        }
    },
    e = r
},
[]);
F.module("spostor/widget/at_btn",
function(t, s) {
    var a = (F.require("sglobal/component/app_starter"), F.require("page_data"), F.require("spostor/widget/at")),
    n = function(t) {
        this.options = {
            enableClass: "at_btn_enabled",
            disableClass: "at_btn_disabled"
        },
        $.extend(this.options, t),
        this.$btnPanel = $(t.container)
    };
    return n.prototype = {
        init: function() {
            this.$btnPanel.html('<a class="at_btn" href="javascript:;"><span class="media_bar_btn_text">@\u597D\u53CB</span></a>')
        },
        initEvents: function() {
            var t = this;
            this.$btnPanel.on("click",
            function(s) {
                s && s.preventDefault(),
                new a({
                    callback: t.options.atCallback
                })
            })
        },
        setDisable: function() {
            this.$btnPanel.find(".at_btn").removeClass(this.options.enableClass).addClass(this.options.disableClass)
        },
        setEnable: function() {
            this.$btnPanel.find(".at_btn").removeClass(this.options.disableClass).addClass(this.options.enableClass)
        }
    },
    s = n
},
[]);
F.module("spostor/widget/recommend_btn",
function(n, e) {
    var t = (F.require("sglobal/component/app_starter"), F.require("page_data"), F.require("spostor/widget/recommend")),
    s = function(n) {
        this.options = {
            enableClass: "recommend_btn_enabled",
            disableClass: "recommend_btn_disabled"
        },
        $.extend(this.options, n),
        this.$btnPanel = $(n.container)
    };
    return s.prototype = {
        init: function() {
            this.$btnPanel.html('<a class="recommend_btn" href="javascript:;"><span class="media_bar_btn_text">\u70ED\u8BAE</span></a>')
        },
        initEvents: function() {
            var n = this;
            this.$btnPanel.on("click",
            function(e) {
                e && e.preventDefault(),
                new t({
                    callback: n.options.atCallback
                })
            })
        },
        setDisable: function() {
            this.$btnPanel.find(".recommend_btn").removeClass(this.options.enableClass).addClass(this.options.disableClass)
        },
        setEnable: function() {
            this.$btnPanel.find(".recommend_btn").removeClass(this.options.disableClass).addClass(this.options.enableClass)
        }
    },
    e = s
},
[]);
F.module("spostor/widget/switch",
function(t, i) {
    var s = F.require("sglobal/component/float_layer"),
    n = '<div class="blue_kit blue_kit_top"><div class="blue_kit_left"><a class="blue_kit_btn_back blue_kit_btn j_at_return" href="javascript:;"><span class="icon_tieba_logo blue_kit_btn_logo"></span><span class="blue_kit_text">\u9009\u62E9\u4E00\u4E2A\u5427</span></a></div><div class="blue_kit_right"></div></div><div class="at_search ui_search"><span class="bg">\u4E3A\u60A8\u6311\u9009\u51FA\u4EE5\u4E0B\u53EF\u4EE5\u53D1\u5E16\u7684\u5427</span><a class="at_search_btn_close j_at_search_btn_close" href="javascript:;"><span class="btn_close"></span></a></div><div class="at_user_list j_at_user_list overthrow"></div><div class="at_selected_user_list j_at_selected_user_list"></div>',
    e = '<div class="list_item j_user_list_item" data-name="<%=name%>"><a class="list_item_link at_user_list_item_link" href="javascript:;" name="<%= forum_name %>" forumid="<%= forum_id %>"><span class="user_list_item_name"><%= forum_name %></span></a></div>',
    a = function(t) {
        this.options = $.extend({
            maxAmount: 5
        },
        t),
        this._buildPanel(),
        this._initEvent(),
        this._initUserModel()
    };
    return a.prototype = {
        _buildPanel: function() {
            this.floatLayer = new s({
                showEnd: function() {},
                hideEnd: function() {
                    this.destroy()
                }
            }),
            this.$container = $(this.floatLayer.getLayer()),
            this.$container.append(n).addClass("at_float_layer"),
            this.$userList = this.$container.find(".j_at_user_list"),
            this.$selectedUserList = this.$container.find(".j_at_selected_user_list"),
            function(t) {
                setTimeout(function() {
                    t.floatLayer.show()
                },
                0)
            } (this)
        },
        _initEvent: function() {
            var t = this;
            this.$container.on("click", ".j_at_return", _.bind(function() {
                "function" == typeof this.options.callback.onCancel && this.options.callback.onCancel(),
                this.floatLayer.hide()
            },
            this));
            var i = this.$container.find(".j_at_search_btn_close"),
            s = this.$container.find(".j_at_search_input");
            s.on("input",
            function() {
                var n = $(this).val();
                "" === n ? (i.hide(), t.renderList(t._initTopicList)) : (i.show(), t.query(n,
                function() {
                    return s.val() === n
                }))
            }),
            i.on("click",
            function(t) {
                t.preventDefault(),
                s.val("").trigger("input")
            }),
            this.$userList.on("click", ".at_user_list_item_link",
            function() {
                "function" == typeof t.options.callback.onFinish && t.options.callback.onFinish({
                    name: $(this).tbattr("name"),
                    id: $(this).tbattr("forumid")
                }),
                t.floatLayer.hide()
            })
        },
        _initUserModel: function() {
            function t() {
                var t = location.search,
                i = new Object;
                if ( - 1 != t.indexOf("?")) {
                    var s = t.substr(1);
                    strs = s.split("&");
                    for (var n = 0; n < strs.length; n++) i[strs[n].split("=")[0]] = strs[n].split("=")[1]
                }
                return i
            }
            this._selectedUsers = [],
            this._allUser = {},
            this._initTopicList = [],
            $.loading(),
            $.getJSON("/mo/q/filter/forum?topic_name=" + t().topic_name, _.bind(function(t) {
                $.unloading(),
                t.data && ($.each(t.data.topic_relate_forum, _.bind(function(t, i) {
                    this._initTopicList.push(i)
                },
                this)), $.each(t.data.like_forum, _.bind(function(t, i) {
                    var s = !1;
                    this._initTopicList.forEach(function(t) {
                        t.forum_name === i.forum_name && (s = !0)
                    }),
                    s || this._initTopicList.push(i)
                },
                this)), this.renderList(this._initTopicList))
            },
            this))
        },
        renderList: function(t) {
            t.length && (t = t.slice(0, 20));
            var i = "";
            $.each(t, _.bind(function(t, s) {
                i += this._buildUserListItem(s)
            },
            this)),
            this.$userList.html(i)
        },
        _buildUserListItem: function(t) {
            return baidu.template(e, t)
        }
    },
    i = a
},
[]);
F.module("spostor/widget/switch_btn",
function(n, t) {
    var e = (F.require("sglobal/component/app_starter"), F.require("page_data"), F.require("spostor/widget/switch")),
    s = function(n) {
        this.options = {
            enableClass: "recommend_btn_enabled",
            disableClass: "recommend_btn_disabled"
        },
        $.extend(this.options, n),
        this.$btnPanel = $(n.container)
    };
    return s.prototype = {
        init: function() {},
        initEvents: function() {
            var n = this;
            this.$btnPanel.on("click",
            function(t) {
                t && t.preventDefault(),
                new e({
                    callback: n.options.atCallback
                })
            })
        },
        setDisable: function() {
            this.$btnPanel.find(".recommend_btn").removeClass(this.options.enableClass).addClass(this.options.disableClass)
        },
        setEnable: function() {
            this.$btnPanel.find(".recommend_btn").removeClass(this.options.disableClass).addClass(this.options.enableClass)
        }
    },
    t = s
},
[]);
F.module("spostor/widget/audio_recorder",
function(t, i) {
    var e = F.require("page_data"),
    r = {
        startTimer: function(t, i) {
            var e = window.setTimeout(t, i);
            return e
        },
        stopTimer: function(t) {
            window.clearTimeout(t)
        }
    },
    o = function(t) {
        this.conf = {
            recorderContainer: null,
            eventCenter: null
        },
        $.extend(this.conf, t),
        this.STATUS_LIST = {
            UNRECORD: 0,
            RECORDING: 1,
            RECORDED: 2,
            PLAYING: 3,
            UPLOADED: 4
        },
        this.cur_status = null,
        this.$panel = null,
        this.$recorder = null,
        this.$player = null,
        this.hasStart = !1,
        this.hasStoppedRecord = !1,
        this.file = {
            length: 0,
            name: "tbla_audio.amr",
            path: "/sdcard/",
            stamp: "",
            md5: "",
            getRecordingPath: null
        },
        this.timer = {
            count: 0,
            startRecord: 0,
            endRecord: 0,
            recordStart: 0,
            recordProcess: 0,
            playProcess: 0
        },
        this.uploadUrl = {
            domain: e.domain,
            chunk: e.base_url + "voiceChunkUpload",
            finish: e.base_url + "voiceFinChunkUpload"
        }
    };
    return o.prototype = {
        initialize: function() {
            var t = this;
            this.cur_status = this.STATUS_LIST.UNRECORD,
            t._MediaLib = "undefined" == typeof clouda ? null: clouda.device.media,
            t._FileLib = "undefined" == typeof clouda ? null: clouda.device.fs
        },
        reset: function() {
            var t = {
                length: 0,
                name: "tbla_audio.amr",
                path: "/sdcard/",
                stamp: "",
                md5: "",
                getRecordingPath: null
            };
            $.extend(this.file, t),
            this.cur_status = this.STATUS_LIST.UNRECORD,
            this.conf.eventCenter.trigger("voice_btn_clear_voice"),
            this.showPanel(),
            this.hidePopupTip()
        },
        show: function() {
            this.showPanel()
        },
        showPanel: function() {
            null == this.$panel ? this.initPanel() : this.$panel.show(),
            this.cur_status == this.STATUS_LIST.RECORDED || this.cur_status == this.STATUS_LIST.UPLOADED ? this.showPlayer() : this.showRecorder()
        },
        hide: function() {
            this.hidePanel()
        },
        hidePanel: function() {
            this.$panel && this.$panel.hide()
        },
        initPanel: function() {
            var t = this.conf.recorderContainer,
            i = ['<div class="j_ar_panel ar_panel">', '<div class="j_popup_tip popup_tip"></div>', '<div class="j_ar_recorder ar_recorder">', '<div class="j_ar_btn_record ar_btn_record">&nbsp;</div>', "</div>", '<div class="j_ar_player ar_player">', '<div class="j_ar_btn_retry ar_player_item ar_btn_retry">\u91CD\u5F55</div>', '<div class="j_ar_btn_play ar_player_item ar_btn_play">&nbsp;', '<div class="j_ar_btn_time ar_btn_time"></div>', '<div class="j_ar_btn_progress ar_btn_progress">', '<div class="j_ar_btn_pie_left ar_btn_pie ar_btn_pie_left"></div>', '<div class="j_ar_btn_pie_right ar_btn_pie ar_btn_pie_right"></div>', "</div>", "</div>", "</div>", '<p class="j_ar_tip ar_tip">\u957F\u6309\u5F00\u59CB\u5F55\u97F3</p>', "</div>"];
            t && t.append(i.join("")),
            this.$panel = $(".j_ar_panel", t),
            this.$popupTip = $(".j_popup_tip", t),
            this.$recorder = $(".j_ar_recorder", t),
            this.$player = $(".j_ar_player", t),
            this.$tip = $(".j_ar_tip", t),
            this.$playTime = $(".j_ar_btn_time", t),
            this._initPanelEvent()
        },
        initRecord: function() {
            var t = this;
            t.showTip("\u957F\u6309\u5F00\u59CB\u5F55\u97F3"),
            r.stopTimer(t.timer.recordProcess),
            t.$recorder.css("background-position", "50% 0px"),
            t.cur_status == t.STATUS_LIST.RECORDED && t.removeFile()
        },
        _initPanelEvent: function() {
            var t = this,
            i = this.conf.recorderContainer;
            i.on("touchstart", ".j_ar_btn_record",
            function() {
                t.$recorder.css("background-position", "50% -110px"),
                t.timer.recordStart = r.startTimer(_.bind(t.startRecord, t), 100)
            }).on("touchmove", ".j_ar_btn_record",
            function() {
                t.canelRecord()
            }).on("touchend", ".j_ar_btn_record",
            function() {
                r.stopTimer(t.timer.recordStart),
                t.hasStart ? t.stopRecord() : t.hasStoppedRecord || setTimeout(function() {
                    t.initRecord(),
                    t.showPopupTip("\u8BED\u97F3\u65F6\u95F4\u592A\u77ED")
                },
                0)
            }).on("touchend", ".j_ar_btn_play", _.bind(t.playAudio, t)).on("click", ".j_ar_btn_retry", _.bind(t.btnClickRetryRecord, t))
        },
        showRecorder: function() {
            this.initRecord(),
            this.$recorder.show(),
            this.$player.hide()
        },
        showPlayer: function() {
            this.$recorder.hide(),
            this.$player.show(),
            this.showPlayTime(this.file.length),
            this.showTip("\u70B9\u51FB\u64AD\u653E")
        },
        hidePlayer: function() {
            this.$player.hide()
        },
        retryRecord: function() {
            var t = this;
            t.reset()
        },
        btnClickRetryRecord: function() {
            var t = this;
            t.stopPlay();
            var i = new Dialog({
                mask: !0,
                content: '<div class="retry_record_tip">\u91CD\u5F55\u5C06\u4F1A\u5220\u9664\u521A\u624D\u7684\u5F55\u97F3</div>',
                okbtn: "\u91CD\u5F55",
                cancelbtn: "\u53D6\u6D88"
            });
            i.dom.on("ok",
            function() {
                i.remove(),
                t.retryRecord()
            }).on("cancel",
            function() {
                i.remove()
            })
        },
        startRecord: function() {
            var t = this;
            t.file.name = (new Date).getTime() + t.file.name,
            t.hasStart = !0,
            t._MediaLib.operateMedia(t.file.name, "startRecord", {
                onsuccess: function() {
                    t.timer.startRecord = (new Date).getTime(),
                    t.showTip("\u677E\u5F00\u7ED3\u675F\u5F55\u97F3"),
                    t.processRecording()
                },
                onfail: function(i) {
                    t.showTip("start fail:" + i)
                }
            })
        },
        processRecording: function() {
            var t = this;
            t.timer.count = t.timer.count + 1;
            var i = 110 * (t.timer.count % 6 + 1),
            e = Math.round(200 * t.timer.count / 1e3);
            t.showTime(e),
            t.$recorder.css("background-position", "50% -" + i + "px"),
            t.timer.recordProcess = r.startTimer(_.bind(t.processRecording, t), 200),
            e >= 40 && (r.stopTimer(t.timer.recordProcess), t.stopRecord(), t.hasStoppedRecord = !0, $.toast.send("\u5F55\u97F3\u65F6\u95F4\u4E0D\u80FD\u8D85\u8FC740s"))
        },
        stopRecord: function() {
            var t = this;
            t._MediaLib.operateMedia(t.file.name, "stopRecord", {
                onsuccess: function(i) {
                    t.file.getRecordingPath = i,
                    t.timer.stopRecord = (new Date).getTime(),
                    t.file.length = Math.round((t.timer.stopRecord - t.timer.startRecord) / 1e3),
                    t.file.length > 1 ? (t.cur_status = t.STATUS_LIST.RECORDED, t.showPlayer(), t.hidePopupTip(), t.conf.eventCenter.trigger("voice_btn_has_new_voice")) : (t.cur_status = t.STATUS_LIST.UNRECORD, t.showPopupTip("\u8BED\u97F3\u65F6\u95F4\u592A\u77ED"), setTimeout(function() {
                        t.initRecord()
                    },
                    200)),
                    t.hasStart = !1,
                    t.timer.count = 0,
                    r.stopTimer(t.timer.recordProcess)
                },
                onfail: function() {
                    t.timer.count = 0,
                    t.hasStart = !1,
                    t.showPopupTip("\u5F55\u97F3\u51FA\u9519\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5"),
                    r.stopTimer(t.timer.recordProcess)
                }
            })
        },
        playAudio: function() {
            var t = this;
            t.cur_status == t.STATUS_LIST.RECORDED ? (t.startPlaying(), t._MediaLib.operateMedia(t.file.name, "play", {
                onsuccess: function() {
                    t.stopPlaying()
                },
                onfail: function() {
                    t.stopPlaying(),
                    t.showPopupTip("\u64AD\u653E\u5F55\u97F3\u51FA\u9519\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5")
                }
            })) : t.stopPlay()
        },
        stopPlay: function() {
            var t = this;
            t.cur_status == t.STATUS_LIST.PLAYING && t._MediaLib.operateMedia(t.file.name, "stop", {
                onsuccess: function() {
                    t.stopPlaying()
                },
                onfail: function() {}
            })
        },
        startPlaying: function() {
            var t = this;
            t.cur_status = t.STATUS_LIST.PLAYING,
            t.$player.css("background-position", "0 -111px"),
            t.showTip("\u70B9\u51FB\u505C\u6B62");
            var i = t.file.length;
            t.showPlayTime(i),
            t.timer.playProcess = setInterval(function() {
                i--,
                t.processPlaying(i)
            },
            1e3)
        },
        processPlaying: function(t) {
            var i = this;
            1 > t ? i.stopPlaying() : i.showPlayTime(t)
        },
        stopPlaying: function() {
            var t = this;
            t.showPlayTime(t.file.length),
            t.showTip("\u70B9\u51FB\u64AD\u653E"),
            t.cur_status = t.STATUS_LIST.RECORDED,
            t.$player.css("background-position", "50% 0"),
            clearInterval(t.timer.playProcess)
        },
        haveVoice: function() {
            return this.file.length > 1
        },
        removeFile: function() {
            this._FileLib.remove(this.file.path + this.file.name, {
                onsuccess: function() {},
                onfail: function() {}
            })
        },
        uploadFile: function(t) {
            var i = this;
            i._FileLib.post(i.file.getRecordingPath, encodeURI(i.uploadUrl.domain + i.uploadUrl.chunk), {
                onsuccess: function(e) {
                    var r = JSON.parse(e.response);
                    r && 0 == r.no ? (i.file.md5 = r.voice_md5, i.cur_status = i.STATUS_LIST.UPLOADED, i.removeFile(), t && t()) : ($.toast.send(r.msg), $.unloading())
                },
                onfail: function(t) {
                    i.console(t),
                    $.toast.send("\u8BED\u97F3\u4E0A\u4F20\u5931\u8D25"),
                    $.unloading(),
                    i.console(JSON.stringify(t))
                },
                param: {},
                uploadKey: "voice_chunk"
            })
        },
        formatTime: function(t) {
            var i = parseInt(t),
            e = "";
            return e = i >= 60 ? parseInt(i / 60) + "'" + i % 60 + '"': i + '"'
        },
        showTime: function(t) {
            var i = this.formatTime(t);
            this.showPopupTip(i)
        },
        showPlayTime: function(t) {
            var i = this.formatTime(t);
            this.$playTime.html(i)
        },
        showTip: function(t) {
            this.$tip.html(t)
        },
        hidePopupTip: function() {
            this.$popupTip.css("visibility", "hidden")
        },
        showPopupTip: function(t) {
            this.$popupTip.css("visibility", "visible").html(t)
        },
        console: function(t) {
            console.log(JSON.stringify(t))
        }
    },
    i = o
},
[]);
F.module("spostor/widget/voice_btn",
function(e, i) {
    var t = F.require("page_data"),
    n = function(e) {
        if (this.options = {
            container: ".j_voice_btn_panel",
            baseUrl: "",
            downloadLp: "",
            enableClass: "voice_btn_enabled",
            disableClass: "voice_btn_disabled",
            recorderContainer: null,
            eventCenter: null
        },
        $.extend(this.options, e), this.$Panel = $(e.container), t.is_light_app) {
            this.$newVoiceTip = null;
            var i = F.require("spostor/widget/audio_recorder");
            this.recorder = new i({
                recorderContainer: this.options.recorderContainer,
                eventCenter: this.options.eventCenter
            }),
            this.recorder.initialize()
        }
    },
    o = PageUnit.load("pb_main_postor_voice_btn_conf"),
    s = PageUnit.load("pb_main_postor_voice_btn_img");
    return n.prototype = {
        init: function() {
            this.$Panel.html('<a class="voice_btn" href="javascript:;"><span class="media_bar_btn_text">\u8BED\u97F3</span></a>')
        },
        initEvents: function() {
            var e = this;
            if (this.$Panel.on("click",
            function(i) {
                setTimeout(function() {
                    e.clickEvent.call(e)
                },
                100),
                $.get(e.options.baseUrl + "pv?lp=" + e.options.downloadLp + "_click&r=" + Math.random()),
                i && i.stopPropagation(),
                i && i.preventDefault(),
                i && i.stopImmediatePropagation && i.stopImmediatePropagation()
            }), t.is_light_app) {
                var i = e.options.eventCenter;
                i.on("voice_btn_has_new_voice", _.bind(e.hasNewVoice, e)),
                i.on("voice_btn_clear_voice", _.bind(e.clearVoice, e))
            }
        },
        setDisable: function() {
            this.$Panel.find(".voice_btn").removeClass(this.options.enableClass).addClass(this.options.disableClass)
        },
        setEnable: function() {
            this.$Panel.find(".voice_btn").removeClass(this.options.disableClass).addClass(this.options.enableClass)
        },
        reset: function() {
            this.setEnable(),
            t.is_light_app && this.recorder.reset()
        },
        startApp: function(e) {
            var i = this,
            t = F.require("sglobal/component/app_starter"),
            n = i.options.tieZiId ? "spb": "sfrs",
            o = i.options.baseUrl,
            s = $.os.ios ? n + "_voice_start_ios": n + "_voice_start_and",
            a = {
                isIos: !!$.os.ios,
                page: n,
                param: i.options.tieZiId ? i.options.tieZiId: i.options.baName,
                baseUrl: o,
                lp: s
            };
            e && (a.downloadUrl = e),
            t.triggerAppStarter(a)
        },
        clickEvent: function() {
            t.is_light_app ? this.sendVoice() : this.goToClient()
        },
        sendVoice: function() {
            var e = this.$Panel.find(".voice_btn"),
            i = this.options.eventCenter;
            e.hasClass(this.options.disableClass) ? i.trigger("voice_panel_hide") : i.trigger("voice_panel_show")
        },
        showPanel: function() {
            this.setDisable(),
            this.recorder.show()
        },
        hidePanel: function() {
            this.setEnable(),
            this.recorder.hide()
        },
        hasNewVoice: function() {
            t.is_light_app && null == this.$newVoiceTip && (this.$Panel.find(".voice_btn").append('<span class="j_voice_new_tip voice_new_tip"></span>'), this.$newVoiceTip = this.$Panel.find(".j_voice_new_tip")),
            this.$newVoiceTip.show()
        },
        clearVoice: function() {
            t.is_light_app && null != this.$newVoiceTip && this.$newVoiceTip.hide()
        },
        goToClient: function() {
            var e = this,
            i = this.options.tieZiId ? "pb": "frs",
            t = $.os.ios ? o.ios_url[0] : o.and_url[0];
            if (t = $.redirect({
                tbjump: t,
                task: "\u667A\u80FD\u7248\u53D1\u8D34\u6846\u8BED\u97F3\u5BA2\u6237\u7AEF\u5BFC\u6D41",
                page: i,
                locate: "\u53D1\u8D34\u6846\u8BED\u97F3\u6309\u94AE"
            }), s) {
                var n = new Dialog({
                    mask: !0,
                    closebtn: !0,
                    content: "<img class='client_layer_img' style='margin: -16px 0 -5px -21px;width: 282px;' onload='_dialogRefreshPosition();' src='" + s + "'/>",
                    fixed: !0
                });
                window._dialogRefreshPosition = function() {
                    n.refreshPosition()
                },
                n.dom.on("close",
                function() {
                    n.remove(!0)
                }).on("click", ".client_layer_img",
                function(i) {
                    i.preventDefault(),
                    e.startApp(t),
                    n.remove(!0)
                })
            } else {
                var n = new Dialog({
                    mask: !0,
                    closebtn: !0,
                    title: o.title[0],
                    content: o.content[0],
                    okbtn: o.okbtn[0],
                    okbtnStyle: "background-color:#42a2e5;border:1px solid #42a2e5;margin-bottom:15px",
                    contentStyle: "margin-top:12px; font-size:14px;line-height:20px",
                    fixed: !1
                });
                n.dom.on("ok",
                function() {
                    e.startApp(t),
                    n.remove(!0)
                }).on("close",
                function() {
                    n.remove(!0)
                }).on("cancel",
                function() {
                    n.remove(!0)
                })
            }
            $.track({
                task: "\u667A\u80FD\u7248\u51B2kpi\u9879\u76EE",
                page: i,
                locate: "voice_btn",
                type: "view"
            }),
            setTimeout(function() {
                e.startApp()
            },
            1e3)
        }
    },
    i = n
},
[]);
F.module("spostor/widget/post_draft",
function(t, e) {
    var i = "_mobile_post_draft_",
    n = 5e3,
    s = 10,
    o = 7,
    r = function(t, e) {
        return function() {
            t.call(e)
        }
    },
    h = function(t) {
        var e = t.getHours(),
        i = t.getMinutes();
        return (10 > e ? "0" + e: e) + ":" + (10 > i ? "0" + i: i)
    },
    l = function(t) {
        this.titlePrevFix = "",
        this.contentPrevFix = "",
        this.prevTitle = "",
        this.prevContent = "",
        this._supportStorage = !0,
        this._interval = null,
        this.opt = {
            container: "",
            claTitle: null,
            claContent: null,
            has_title: "",
            z: "",
            fid: "",
            uid: ""
        },
        $.extend(this.opt, t),
        $.extend(this, new _.Events)
    };
    return l.prototype = {
        init: function() {
            var t = this;
            if (this.support(), this._supportStorage) {
                var e = this.opt.claTitle,
                i = this.opt.claContent;
                e && (e.getTitleSel().on("focus", r(this.start, this)), e.getTitleSel().on("blur", r(this.end, this)), this.titlePrevFix = e.getTitle()),
                i && (i.getContentSel().on("focus", r(this.start, this)), i.getContentSel().on("blur", r(this.end, this)), this.contentPrevFix = i.getContent()),
                this.expire(),
                setTimeout(function() {
                    t.read()
                },
                100)
            }
        },
        support: function() {
            try {
                window.localStorage.setItem("_tem_post_draft_test_", 1),
                window.localStorage.removeItem("_tem_post_draft_test_"),
                this.setEnable()
            } catch(t) {
                this.setDisable()
            }
        },
        start: function() {
            if (this._supportStorage) {
                var t = this;
                clearInterval(this._interval),
                this._interval = setInterval(function() {
                    t.check()
                },
                n)
            }
        },
        end: function() {
            clearInterval(this._interval),
            this.check()
        },
        read: function() {
            var t = {
                uid: this.opt.uid,
                z: this.opt.z,
                fid: this.opt.fid
            },
            e = this.get(t);
            if (e && (this.opt.claContent.setContent(e.content), this.prevContent = e.content, this.opt.has_title)) if (this.titlePrevFix) {
                var i = new RegExp("^(" + e.preTitleFix + ").*").test(e.title),
                n = this.titlePrevFix + e.title;
                i && (n = this.titlePrevFix + e.title.replace(e.preTitleFix, "")),
                this.opt.claTitle.setTitle(n),
                this.prevTitle = n
            } else this.opt.claTitle.setTitle(e.title)
        },
        save: function(t) {
            var e = this.get();
            if (e) if (e[t.uid]) {
                for (var n = [], o = e[t.uid], r = 0, h = o.length; h > r; r++)(t.fid != o[r].fid || t.z != o[r].z) && n.push(o[r]);
                n.push(t),
                n.length > s && n.shift(),
                e[t.uid] = n
            } else e[t.uid] = [t];
            else e = {},
            e[t.uid] = [t];
            $.storage.set(i, JSON.stringify(e)),
            this.showTip()
        },
        check: function(t) {
            var e = this.opt.claContent.getContent(),
            i = "";
            if (this.opt.has_title && (i = this.opt.claTitle.getTitle()), t || i != this.prevTitle || e != this.prevContent) {
                var n = {
                    fid: this.opt.fid,
                    z: this.opt.z,
                    uid: this.opt.uid,
                    title: i,
                    content: e,
                    preTitleFix: this.titlePrevFix,
                    preContentFix: this.contentPrevFix,
                    date: new Date
                };
                this.save(n),
                this.prevTitle = i,
                this.prevContent = e
            }
        },
        get: function(t) {
            var e = $.storage.get(i);
            if (!e) return null;
            if (e = JSON.parse(e), t) {
                if ("string" == typeof t) return e[t];
                if (e = e[t.uid]) for (var n = 0,
                s = e.length; s > n; n++) if (t.fid == e[n].fid && t.z == e[n].z) return e[n];
                return null
            }
            return e
        },
        expire: function() {
            var t = this.get(),
            e = new Date,
            i = 0,
            n = [];
            if (t) for (var s in t) {
                for (var r = 0,
                h = t[s].length; h > r; r++) i = (e - new Date(t[s][r].date)) / 864e5,
                o > i && n.push(t[s][r]);
                t[s] = n
            } else;
        },
        del: function() {
            for (var t = this.get(), e = t[this.opt.uid], n = [], s = 0, o = e.length; o > s; s++)(e[s].fid != this.opt.fid || e[s].z != this.opt.z) && n.push(e[s]);
            t[this.opt.uid] = n,
            $.storage.set(i, JSON.stringify(t))
        },
        setTitlePrefix: function(t) {
            this.titlePrevFix = t,
            this.check(1)
        },
        showTip: function() {
            var t = new Date;
            this.opt.container.html(h(t) + " \u81EA\u52A8\u4FDD\u5B58")
        },
        initEvents: function() {},
        removeEvents: function() {},
        setEnable: function() {
            this._supportStorage = !0
        },
        setDisable: function() {
            this._supportStorage = !1
        },
        reset: function() {}
    },
    e = l
},
[]);
F.module("spostor/widget/new_captcha",
function(t, e) {
    var n = t("spostor/widget/captcha"),
    i = n.extend({
        initialize: function() {
            var t = this;
            $(".j_close_panel").click(function(e) {
                e.preventDefault(),
                t._toggleNewCaptchaPanel("hide")
            }),
            t.fixPanelTop()
        },
        bindGridTouch: function() {
            var t = this;
            t._containerNew.delegate(".grid_button", "touchend",
            function() {
                $(this).removeClass("grid_clicked"),
                t.triggerVcodeSubmit()
            })
        },
        changeTopbarStatus: function(t) {
            var e = $(".j_panel_topbar"),
            n = this;
            "show" == t ? (e.show(), setTimeout(function() {
                n._outerContainer.css("top", "0")
            },
            5)) : setTimeout(function() {
                n._outerContainer.css("top", $(window).height() + "px")
            },
            5)
        },
        fixPanelTop: function() {
            this._outerContainer.css("top", $(window).height() + "px")
        }
    });
    return e = i
});
F.module("spostor/widget/editor",
function(t, i) {
    var e, n, o = F.require("spostor/widget/editor_content"),
    s = F.require("spostor/widget/captcha"),
    a = F.require("spostor/widget/smile"),
    h = F.require("spostor/widget/submit_btn"),
    r = F.require("spostor/widget/upload_pic"),
    c = F.require("spostor/widget/editor_title"),
    l = F.require("spostor/widget/prefix_editor_title"),
    d = F.require("spostor/widget/at_btn"),
    u = F.require("spostor/widget/recommend_btn"),
    p = F.require("spostor/widget/switch_btn"),
    f = F.require("spostor/widget/voice_btn"),
    m = F.require("spostor/widget/post_draft"),
    b = F.require("page_data"),
    v = !1,
    g = function(t) {
        var i = this;
        t.isLightApp = b.is_light_app,
        this.options = t,
        this.eventCenter = t.eventCenter || new _.Events,
        this._data_postor = {
            tbs: "",
            word: "",
            fid: "",
            username: ""
        },
        this._domains = {
            vcode: ""
        },
        this.smile = null,
        this.editorContent = null,
        this.uploadPic = null,
        this.captcha = null,
        this.submitBtn = null,
        this.voiceBtn = null,
        this.postDraft = null,
        this.editorTitle = null,
        this._plugins = {},
        this._container,
        this._outerContainer,
        this._config = {
            has_title: 0,
            has_upload_pic: 1,
            has_smile: 1,
            has_voice_btn: 1,
            has_submit_btn: 1,
            has_at: 1,
            has_toutiao: 0,
            has_recommend: 1,
            login_lay_text: "\u70B9\u51FB\u767B\u5F55,\u9A6C\u4E0A\u56DE\u590D",
            image_max_length: null
        },
        this._options = t,
        $.extend(this, new _.Events),
        $.extend(this._config, t.config),
        $.extend(this._data_postor, t.data_postor),
        $.extend(this._domains, t.domains),
        this._outerContainer = t.outerContainer,
        this._base_url = b.base_url,
        this._isEnable = !0,
        this._container = $(t.editor_html),
        this._container.length > 0 && t.outerContainer.html(this._container),
        this._config.has_title && this._initEditorTitle(),
        this._config.has_upload_pic && this._initUploadPic(),
        this._initEditorContent(),
        this._initCaptcha(),
        this._config.has_smile && this._initSmile(),
        this._config.has_submit_btn && this._initSubmitBtn(),
        this._config.enable_draft && this._initPostDraft(),
        this._config.has_at && this._initAtBtn(),
        this._config.has_recommend && this._initRecommendBtn(),
        this._config.has_toutiao && this._initToutiaoView(),
        setTimeout(function() {
            i._initSwitchBtn()
        },
        1e3),
        "undefined" == typeof clouda ? i.initialize() : clouda.checkSupports(["device.fs", "device.media"],
        function() {
            i._config.has_voice_btn && (i._initVoiceBtn(), i.initialize())
        },
        function() {
            i.initialize()
        })
    };
    return g.prototype = {
        init: function() {
            this._execPluginsFunc("init"),
            this.initEvents(),
            this._execPluginsFunc("initEvents"),
            this._provideEventListener(),
            this.inited = !0
        },
        initEvents: function() {},
        removeEvents: function() {
            this._execPluginsFunc("removeEvents")
        },
        addPlugin: function(t, i) {
            this._plugins[t] = i
        },
        addPluginAsync: function(t, i) {
            this._plugins[t] = i,
            this.inited && (i.init(), i.initEvents())
        },
        reset: function() {
            this._execPluginsFunc("reset")
        },
        _execPluginsFunc: function(t) {
            for (var i in this._plugins)"object" == typeof this._plugins[i] && "function" == typeof this._plugins[i][t] && this._plugins[i][t]()
        },
        _initPostDraft: function() {
            var t = this,
            i = {
                claTitle: t.editorTitle,
                claContent: t.editorContent,
                has_title: this.options.config.has_title,
                fid: "",
                kz: "",
                uid: "",
                container: this._outerContainer.find(".j_savedraft_panel")
            };
            $.extend(i, this._data_postor),
            $.extend(i, this.options.data_editor.user),
            this.postDraft = new m(i),
            this.addPlugin("post_draft", this.postDraft)
        },
        _initEditorTitle: function() {
            var t = this,
            i = this._options.titlePrefixMode && 1 == this._options.titlePrefixMode && "" !== this._options.titlePrefixType ? l: c;
            this.editorTitle = new i({
                outerContainer: this._outerContainer.find(".j_editor_title_panel"),
                prefix: this._options.titlePrefix || "",
                titlePrefixType: this._options.titlePrefixType,
                titlePrefixMode: this._options.titlePrefixMode,
                editor: t,
                arrowStyle: "arrow_line_light",
                initMode: "hide"
            }),
            this.addPlugin("editor_title", this.editorTitle),
            this.editorTitle.on("editor_title_input",
            function() {
                t.isEnableSubmitBtn() ? !!t.submitBtn && t.submitBtn.setEnable() : !!t.submitBtn && t.submitBtn.setEnableEmpty()
            })
        },
        _initEditorContent: function() {
            var t = this;
            this.editorContent = new o({
                outerContainer: this._outerContainer.find(".j_editor_content_panel"),
                eventCenter: this.eventCenter
            }),
            this.addPlugin("editor_content", this.editorContent),
            this.editorContent.on("editor_content_input",
            function() {
                t.isEnableSubmitBtn() ? !!t.submitBtn && t.submitBtn.setEnable() : !!t.submitBtn && t.submitBtn.setEnableEmpty()
            })
        },
        _initCaptcha: function() {
            var t = this;
            1 == t.options.isNewCaptcha && (s = F.require("spostor/widget/new_captcha")),
            this.captcha = new s({
                outerContainer: 0 == this._outerContainer.parents(".j_ui_floatlayer").find(".j_captcha_panel").length ? $(".j_captcha_panel") : this._outerContainer.parents(".j_ui_floatlayer").find(".j_captcha_panel"),
                vcodeDomain: this._domains.vcode,
                base_url: this._base_url,
                callback: {
                    getCaptchaData: function() {
                        return t.getCaptchaData() || {}
                    }
                },
                donotHideCaptchaSelector: ".j_submit_btn",
                isNewCaptcha: t.options.isNewCaptcha
            }),
            this.captcha.on("captcha_enter_key_down",
            function() {
                t.eventCenter.trigger("start_submit_post")
            }),
            this.captcha.on("captcha_toggle_bottom_panel",
            function(i) {
                "hide" == i ? (t.voicePanelHide(), t.smilePanelHide(), t.uploadPicPanelHide(), this._outerContainer.find(".j_post_tip").hide().tbattr("close", !0)) : "show" == i && this._outerContainer.find(".j_post_tip").show().tbattr("close", !0)
            }),
            this.addPlugin("captcha", this.captcha)
        },
        _initToutiaoView: function() {
            var t = this._options.headlineImgUrl;
            n = $('<div class="j_top_thread_box_panel top_thread_box_panel"><p class="top_thread_box_title">\u672C\u5427\u5427\u5934\u56FE</p><img class="top_thread_box_img" src="' + t + '"/></div>'),
            this._outerContainer.find(".j_editor_bottom_panel").append(n)
        },
        _initSmile: function() {
            var t = this,
            i = 28,
            n = 16;
            v = !0,
            e = $('<div class="j_smile_box_panel smile_box_panel"></div>'),
            this._outerContainer.find(".j_editor_bottom_panel").append(e),
            this.smile = new a({
                btnContainer: this._outerContainer.find(".j_smile_btn_panel"),
                panelContainer: e,
                eventCenter: this.eventCenter
            }),
            this.smile.setConfig({
                smilePicLength: i,
                smileFontLength: n
            }),
            this.smile.on("smile_insert",
            function(i) {
                $.track({
                    task: "\u667A\u80FD\u7248\u53D1\u8D34\u8868\u60C5\u70B9\u51FB\u7EDF\u8BA1",
                    page: null,
                    locate: i,
                    type: "click",
                    fid: t._data_postor.fid,
                    fname: t._data_postor.word,
                    uname: t._data_postor.username
                }),
                t.editorContent.insertSmile(i),
                t._config.enable_draft && t.postDraft.check()
            }),
            this.smile.on("smile_delete",
            function() {
                t.editorContent.deleteSmile(),
                t._config.enable_draft && t.postDraft.check()
            }),
            this.smile.on("smile_font_insert",
            function(i) {
                t.editorContent.insertContent(i),
                t._config.enable_draft && t.postDraft.check()
            }),
            this.addPlugin("smile", this.smile)
        },
        _initAtBtn: function() {
            var t = this;
            this.atBtn = new d({
                container: this._outerContainer.find(".j_at_btn_panel"),
                baseUrl: this._base_url,
                baName: this._data_postor.word,
                tieZiId: this._data_postor.z,
                atCallback: {
                    onCancel: function() {
                        t.editorContent.focus()
                    },
                    onFinish: function(i) {
                        var e = i.users;
                        if ("object" == typeof e && void 0 !== e) {
                            var n;
                            n = e.length ? "@" + e.join(" @") + " ": "",
                            t.editorContent.insertContent(n),
                            t.editorContent.focus()
                        }
                    }
                }
            }),
            this.addPlugin("at_btn", this.atBtn)
        },
        _initRecommendBtn: function() {
            function t(t) {
                var i = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
                e = location.search.substr(1).match(i);
                return null != e ? unescape(e[2]) : null
            }
            var i = this;
            setTimeout(function() {
                t("default_title") && i.editorTitle.setTitle("#" + t("default_title") + "#")
            },
            200),
            this.recommendBtn = new u({
                container: this._outerContainer.find(".recommend_btn_panel"),
                baseUrl: this._base_url,
                baName: this._data_postor.word,
                tieZiId: this._data_postor.z,
                atCallback: {
                    onCancel: function() {
                        i.editorContent.focus()
                    },
                    onFinish: function(t) {
                        var e = i.editorContent.getContent();
                        i.editorContent.setContent(e + "#" + t.title + "#"),
                        i.editorContent.focus()
                    }
                }
            }),
            this.addPluginAsync("recommend_btn", this.recommendBtn)
        },
        _initSwitchBtn: function() {
            this.switchBtn = new p({
                container: this._outerContainer.find(".select-forum-switch-button"),
                baseUrl: this._base_url,
                baName: this._data_postor.word,
                tieZiId: this._data_postor.z,
                atCallback: {
                    onCancel: function() {},
                    onFinish: function(t) {
                        $(".select-forum-input").val(t.name),
                        $(".select-forum-input").tbattr("data-forumid", t.id)
                    }
                }
            }),
            this.addPluginAsync("switch_btn", this.switchBtn)
        },
        _initVoiceBtn: function() {
            this.voiceBtn = new f({
                container: this._outerContainer.find(".j_voice_btn_panel"),
                baseUrl: this._base_url,
                downloadLp: "voice_btn_client_download",
                baName: this._data_postor.word,
                tieZiId: this._data_postor.z,
                recorderContainer: this._outerContainer.find(".j_editor_bottom_panel"),
                eventCenter: this.eventCenter
            }),
            this.addPluginAsync("voice_btn", this.voiceBtn)
        },
        _initUploadPic: function() {
            var t = this,
            i = new r({
                container: $(".j_pic_btn_panel"),
                baseurl: this._base_url,
                network: this._config.network,
                outerContainer: this._outerContainer.find(".j_editor_bottom_panel"),
                submitPanel: this._outerContainer.find(".j_submit_btn_panel"),
                eventCenter: this.eventCenter,
                image_max_length: this._config.image_max_length,
                uploaded: function() {
                    t.uploadPicShowCount(0),
                    t.validate() && t.submit()
                },
                selected: function() {
                    t.isEnableSubmitBtn() ? !!t.submitBtn && t.submitBtn.setEnable() : !!t.submitBtn && t.submitBtn.setEnableEmpty()
                },
                deleted: function() {
                    t.isEnableSubmitBtn() ? !!t.submitBtn && t.submitBtn.setEnable() : !!t.submitBtn && t.submitBtn.setEnableEmpty(),
                    t.eventCenter.trigger("upload_pic_panel_hide")
                },
                error: function(i) {
                    t.showPostErrorTip(i)
                }
            });
            this.uploadPic = i.create(),
            this.addPlugin("upload_pic", this.uploadPic)
        },
        _initSubmitBtn: function() {
            var t = this;
            this.submitBtn = new h({
                outerContainer: this._outerContainer.find(".j_submit_btn_panel")
            }),
            this.addPlugin("submit_btn", this.submitBtn),
            this.submitBtn.on("submit_post",
            function() {
                t.startSubmit()
            })
        },
        _provideEventListener: function() {
            this.eventCenter.on("start_submit_post", _.bind(this.startSubmit, this)),
            this.eventCenter.on("voice_panel_show", _.bind(this.voicePanelShow, this)),
            this.eventCenter.on("voice_panel_hide", _.bind(this.voicePanelHide, this)),
            this.eventCenter.on("smile_panel_show", _.bind(this.smilePanelShow, this)),
            this.eventCenter.on("smile_panel_hide", _.bind(this.smilePanelHide, this)),
            this.eventCenter.on("upload_pic_panel_show", _.bind(this.uploadPicPanelShow, this)),
            this.eventCenter.on("upload_pic_panel_hide", _.bind(this.uploadPicPanelHide, this)),
            this.eventCenter.on("upload_pic_show_count", _.bind(this.uploadPicShowCount, this)),
            this.eventCenter.on("editor_content_focus", _.bind(this.editorContentFocus, this)),
            this.eventCenter.on("voice_btn_has_new_voice", _.bind(this.voiceHasNew, this)),
            this.eventCenter.on("voice_btn_clear_voice", _.bind(this.voiceClear, this)),
            this.eventCenter.on("top_thread_hide", _.bind(this.TopThreadViewHide, this))
        },
        editorContentFocus: function() {
            this.voicePanelHide(),
            this.smilePanelHide(),
            this.uploadPicPanelHide(),
            this.TopThreadViewShow()
        },
        voicePanelShow: function() {
            this.voiceBtn && this.voiceBtn.showPanel(),
            this.smile && this.smile.hide(),
            this.uploadPic && (this.uploadPic.panel.enable(), this.uploadPic.hidePreview()),
            this.TopThreadViewHide()
        },
        voicePanelHide: function() {
            this.voiceBtn && this.voiceBtn.hidePanel()
        },
        voiceHasNew: function() {
            this.isEnableSubmitBtn() ? !!this.submitBtn && this.submitBtn.setEnable() : !!this.submitBtn && this.submitBtn.setEnableEmpty()
        },
        voiceClear: function() {
            this.isEnableSubmitBtn() ? !!this.submitBtn && this.submitBtn.setEnable() : !!this.submitBtn && this.submitBtn.setEnableEmpty()
        },
        smilePanelShow: function() {
            this.voiceBtn && this.voiceBtn.hidePanel(),
            this.uploadPic && (this.uploadPic.panel.enable(), this.uploadPic.hidePreview()),
            this.TopThreadViewHide()
        },
        smilePanelHide: function() {
            this.smile && this.smile.hide()
        },
        uploadPicPanelShow: function(t) {
            this.uploadPic && (this.uploadPic.showPreview(), this.uploadPic.panel.disable(), this.uploadPicShowCount(t)),
            this.voiceBtn && this.voiceBtn.hidePanel(),
            this.smile && this.smile.hide(),
            this.TopThreadViewHide()
        },
        uploadPicShowCount: function(t) {
            t - 0 > 0 ? this.uploadPic.panel.doms.count.show().html(t) : this.uploadPic.panel.doms.count.html("").hide()
        },
        TopThreadViewShow: function() {
            n && n.show()
        },
        TopThreadViewHide: function() {
            n && n.hide()
        },
        uploadPicPanelHide: function() {
            var t = null;
            this.uploadPic && (t = this.uploadPic, t.hidePreview(), t.panel.enable(), t.panel.doms.count.html() - 0 <= 0 && t.panel.doms.count.hide())
        },
        isEnableSubmitBtn: function() {
            var t = this;
            return t._config.has_title ? !!$.trim(t.editorTitle.getTitle()) : !!$.trim(t.editorContent.getContent()) || !!t.uploadPic && (t.uploadPic.hasImage() || "" != t.uploadPic.getImageInfo()) || !!t.voiceBtn && !!t.voiceBtn.recorder && t.voiceBtn.recorder.file.length > 0
        },
        startSubmit: function() {
            var t = this;
            t.validate() && (this.voiceBtn && this.voiceBtn.recorder.haveVoice() ? (this.voiceBtn.recorder.stopPlay(), this.setPosting(), this.voiceBtn.recorder.uploadFile(_.bind(this.startSubmitDoPic, this))) : this.startSubmitDoPic())
        },
        startSubmitDoPic: function() {
            var t = this;
            this.uploadPic && this.uploadPic.hasImage() ? (this.setPosting(), this.uploadPic.upload(function() {
                t.setPostEnd()
            })) : this.submit()
        },
        submit: function() {
            var t = {};
            if (this._config.has_title && (t.ti = this.editorTitle.getTitle()), t.co = this.editorContent.getContent(), t._t = (new Date).getTime() - 0, t.tag = this.captcha.getCaptchaType(), this.captcha.isNeedCaptcha()) {
                if (this.captcha.getIsTyping()) return this.eventCenter.trigger("post_need_captch"),
                this.captcha.showCaptchaPanel(),
                !1;
                t.bs = this.captcha.getMD5(),
                t.input_vcode = this.captcha.getInputCaptcha()
            }
            this.uploadPic && (t.upload_img_info = this.uploadPic.getImageInfo()),
            this._options.isLightApp && this.voiceBtn && this.voiceBtn.recorder.file.length > 0 && (t.during_time = this.voiceBtn.recorder.file.length, t.voice_md5 = this.voiceBtn.recorder.file.md5),
            $.extend(t, this.getPostData()),
            this.trigger("editor_start_post", t),
            this._config.enable_draft && this.postDraft.del()
        },
        showLimitPostTip: function(t) {
            this.showPostErrorTip(t)
        },
        showNoUnLink: function(t) {
            this._showLink(t,
            function() {
                UserAccount.fillUname()
            })
        },
        showBindAccountLink: function(t) {
            this._showLink(t,
            function() {
                UserAccount.bindAccount()
            })
        },
        _showLink: function(t, i) {
            var e = this._outerContainer.find(".j_no_un_tip"),
            n = $('<a href="#" class="j_no_un_link">' + t + "</a>");
            e.html(n),
            e.show(),
            n.bind("click",
            function(t) {
                t.preventDefault(),
                "function" == typeof i && i()
            })
        },
        showUserhideInfo: function() {
            var t = this._outerContainer.find(".j_user_hide");
            t.html("\u60A8\u5E10\u53F7\u5F02\u5E38\uFF0C\u53D1\u5E03\u7684\u8D34\u5B50\u5DF2\u88AB\u5C4F\u853D\uFF0C\u53EF\u5230\u7535\u8111\u7248\u5FEB\u901F\u81EA\u52A9\u6062\u590D")
        },
        toggleBottomPanel: function(t) {
            "show" == t ? (this._outerContainer.find(".editor_btn_list").show(), this._outerContainer.find(".j_post_tip").show().tbattr("close", !0)) : "hide" == t && (this._outerContainer.find(".editor_btn_list").hide(), this._outerContainer.find(".j_post_tip").hide().tbattr("close", !1))
        },
        showPostErrorTip: function(t) {
            t && $.toast.send(t)
        },
        clearPostErrorTip: function() {
            var t = this._outerContainer.find(".j_post_tip");
            t.html(""),
            t.hide()
        },
        setEnable: function() {
            this._isEnable = !0,
            this._execPluginsFunc("setEnable")
        },
        setDisable: function() {
            this._isEnable = !1,
            this._execPluginsFunc("setDisable")
        },
        isEnable: function() {
            return this._isEnable
        },
        hasUploadPic: function() {
            return this.uploadPic && "" != this.uploadPic.getImageInfo() ? !0 : !1
        },
        validateTitle: function() {
            return "" == $.trim(this.editorTitle.getTitle()) ? !1 : !0
        },
        validateContent: function() {
            return "" == $.trim(this.editorContent.getContent()) ? !1 : !0
        },
        validateCaptcha: function() {
            return this.captcha.isNeedCaptcha() && "" == $.trim(this.captcha.getInputCaptcha()) ? (this.eventCenter.trigger("post_need_captch"), this.captcha.showCaptchaPanel(void 0, void 0, "\u9A8C\u8BC1\u7801\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801"), !1) : !0
        },
        validateUploadPic: function() {
            return ! this.uploadPic || !this.uploadPic.hasImage() && "" == this.uploadPic.getImageInfo() ? !1 : !0
        },
        validateVoice: function() {
            return ! this.voiceBtn || !this.voiceBtn.recorder || this.voiceBtn.recorder.file.length <= 0 ? !1 : !0
        },
        validate: function() {
            if (this._config.has_title) {
                if (!this.validateTitle()) return this.showPostErrorTip("\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A"),
                !1
            } else if (!this.validateContent() && !this.validateUploadPic() && !this.validateVoice()) return this.showPostErrorTip("\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"),
            !1;
            return this.validateCaptcha() ? !0 : (1 != this.options.isNewCaptcha && this.showPostErrorTip("\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801"), !1)
        },
        login: function() {
            UserAccount.login()
        },
        setPosting: function() {
            $.loading(),
            this.clearPostErrorTip(),
            !!this.submitBtn && this.submitBtn.setDisable(),
            this.smile && this.smile.hide()
        },
        setPostEnd: function() {
            $.unloading(),
            !!this.submitBtn && this.submitBtn.setEnable(),
            this.captcha.hide(),
            this.uploadPic && this.uploadPic.hasImage() && this.uploadPic.showResult(),
            this.uploadPic && this.uploadPic.setEnable && this.uploadPic.setEnable(),
            this.smile && this.smile.setEnable && this.smile.setEnable(),
            this.atBtn && this.atBtn.setEnable && this.atBtn.setEnable(),
            this.voiceBtn && this.voiceBtn.setEnable && this.voiceBtn.setEnable()
        },
        hasTitlePrefix: function() {
            return this._config.has_title ? this.editorTitle.hasPrefix() : ""
        },
        getPostData: function() {
            return {}
        },
        getCaptchaData: function() {
            return {}
        },
        postSuccess: function() {},
        initialize: function() {},
        getOuterContainer: function() {
            return this._outerContainer
        },
        remove: function() {
            this._outerContainer.remove()
        },
        destory: function() {
            this.removeEvents()
        }
    },
    g.extend = _.extend,
    i = g
},
[]);
F.module("spostor/widget/postor/post_state",
function(t, i) {
    var e = function(t) {
        this._editor = t.editor || "",
        this._data_editor = {
            user: {
                is_login: 1,
                no_un: 0,
                userhide: 0,
                is_half_user: 0
            },
            can_post: 1,
            forbid_flag: 0
        },
        this._tip = {
            no_un_not_post: "\u60A8\u8FD8\u6CA1\u6709\u7528\u6237\u540D,\u4E0D\u5141\u8BB8\u56DE\u8D34,\u8BF7\u5148\u586B\u5199\u7528\u6237\u540D",
            half_user_not_post: "\u60A8\u7684\u5E10\u53F7\u4FE1\u606F\u4E0D\u5B8C\u5584,\u4E0D\u5141\u8BB8\u56DE\u8D34,\u8BF7\u5B8C\u5584\u5E10\u53F7\u4FE1\u606F"
        },
        this._needShowLoginTip = t.needShowLoginTip,
        $.extend(this._data_editor, t.data_editor),
        $.extend(this._tip, t.tip)
    };
    return e.prototype = {
        init: function() {
            var t = this._data_editor;
            return t.user.is_login ? t.user.no_un ? (this._editor.setDisable(), t.user.is_half_user ? this._editor.showBindAccountLink(this._tip.half_user_not_post) : this._editor.showNoUnLink(this._tip.no_un_not_post), void 0) : t.can_post ? (this._editor.setEnable(), !!this._editor.submitBtn && this._editor.submitBtn.setEnableEmpty(), t.user.userhide && this._editor.showUserhideInfo(), void 0) : void 0 : (this._editor.setDisable(), this._needShowLoginTip && this._editor.showLoginTip(), void 0)
        },
        getLimitPostTip: function() {
            var t = "\u62B1\u6B49,\u60A8\u76EE\u524D\u65E0\u6CD5\u53D1\u8D34";
            switch (this._data_editor.forbid_flag) {
            case 0:
                t = "";
                break;
            case 1:
                t = "\u62B1\u6B49,\u672C\u5427\u4EC5\u9650\u767B\u5F55\u7528\u6237\u53D1\u8D34";
                break;
            case 2:
                t = "\u62B1\u6B49,\u672C\u5427\u76EE\u524D\u4EC5\u9650\u5427\u52A1\u56E2\u961F\u53D1\u8D34";
                break;
            case 3:
                t = "\u4EC5\u9650\u672C\u54274\u7EA7\u4EE5\u4E0A\u4F1A\u5458\u53D1\u8D34";
                break;
            case 4:
                t = "\u62B1\u6B49,\u672C\u5427\u76EE\u524D\u4EC5\u9650\u5427\u52A1\u56E2\u961F\u53D1\u8D34";
                break;
            case 5:
                t = "\u62B1\u6B49,\u672C\u5427\u76EE\u524D\u53EA\u80FD\u6D4F\u89C8,\u4E0D\u80FD\u53D1\u8D34";
                break;
            case 6:
                t = "\u62B1\u6B49,\u672C\u5427\u76EE\u524D\u53EA\u80FD\u6D4F\u89C8,\u4E0D\u80FD\u53D1\u8D34";
                break;
            case 7:
                t = ""
            }
            return t
        }
    },
    i = e
},
[]);;
F.module("spostor/widget/postor",
function(o, t) {
    function n() {}
    return t = n
},
[]);;
F.module("spostor/widget/postor/post_handle",
function(e, t) {
    var o = F.require("page_data"),
    a = function(e) {
        this.has_chance = e.has_chance,
        this._block = e.block_stat,
        this._hide = e.hide_stat,
        this._vcode = e.vcode_stat,
        this._days = e.days_tofree,
        this._forumname = e.forum_name,
        this._forumid = e.forum_id,
        this.base_url = o.base_url,
        this._url = this.base_url + "apubpost",
        this._editor = e.editor || {},
        this._eventCenter = e.eventCenter || new _.Events,
        this._isNewCaptcha = e.isNewCaptcha,
        this.TopThread = {
            isTopThread: e.headline_img_url && e.headline_img_id >= 0 ? !0 : !1,
            headline_img_url: e.headline_img_url,
            headline_img_id: e.headline_img_id
        }
    };
    return a.prototype = {
        execute: function(e) {
            if (e.ti && "" !== e.ti) {
                var t = e.ti.replace(/#([^#]+)#/g, "");
                if ("" === t) return this._editor.showPostErrorTip("\u5C0F\u8D34\u8D34\u6E29\u99A8\u63D0\u793A\uFF0C\u6807\u9898\u91CC\u4E0D\u80FD\u53EA\u52A0#\u8BDD\u9898#")
            }
            "" === e.word && (e.word = $(".select-forum-input").val(), e.fid = $(".select-forum-input").data("forumid"));
            var o = this.TopThread;
            o.isTopThread && (e.headline_img_url = o.headline_img_url, e.headline_img_id = o.headline_img_id);
            var a = this,
            r = "",
            i = new Date - 0;
            this._editor.setPosting(),
            e = $.xssEncode(e, ["co", "ti"]),
            $.ajax({
                url: a._url + "?_t=" + i,
                type: "POST",
                dataType: "json",
                data: e,
                success: function(t) {
                    a._eventCenter.trigger("top_thread_hide"),
                    a._editor.setPostEnd(),
                    t ? 0 == a.has_chance || 2 != a._block && 1 != a._hide ? 3 == a._block ? (a.bawuFree(), r = "") : r = a._postResult(t, e) : r = '<a href="/mo/q/account_page?" class="post_recover j_post_recover">\u60A8\u7684\u5E10\u53F7\u53EF\u80FD\u5B58\u5728\u4E0D\u5F53\u64CD\u4F5C\uFF0C\u6682\u65E0\u6CD5\u6B63\u5E38\u53D1\u8D34\uFF0C\u60A8\u53EF<span class="post_key_recover">\u7533\u8BF7\u4E00\u952E\u6062\u590D</span></a>': r = "\u7F51\u7EDC\u51FA\u73B0\u5F02\u5E38\uFF0C\u53D1\u8D34\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
                    r && a._editor.showPostErrorTip(r)
                },
                error: function() {
                    a._editor.setPostEnd(),
                    r = "\u7F51\u7EDC\u51FA\u73B0\u5F02\u5E38\uFF0C\u53D1\u8D34\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
                    a._editor.showPostErrorTip(r)
                }
            })
        },
        bawuFree: function() {
            var e = this,
            t = "\u60A8\u5728" + e._forumname + "\u5427\u88AB\u5427\u4E3B\u56E2\u961F\u5C01\u7981" + e._days + "\u5929",
            o = new Dialog({
                mask: !0,
                closebtn: !1,
                title: "",
                content: t,
                cancelbtn: "\u6682\u4E0D\u7533\u8BF7",
                okbtn: "\u7533\u8BF7\u89E3\u5C01",
                wrapperStyle: "border-radius:3px;background-color:#fcfcfc;",
                cancelbtnStyle: "font-size: 14px;border: 1px solid #e6e7e8;margin-bottom: 15px;border-radius: 3px;color: #262626;background: #f3f3f3 -webkit-gradient(linear,left top,left bottom,from(#fafafa),to(#eee));text-shadow: 1px 1px #cccccc;",
                okbtnStyle: "font-size: 14px;border: 1px solid #3984e1;margin-bottom: 15px;border-radius: 3px;color: #fff;background: #1398f5 -webkit-gradient(linear,left top,left bottom,from(#4390f1),to(#2374d8));text-shadow: 1px 1px #4677b3;",
                contentStyle: "font-size: 14px;line-height: 24px;padding: 12px;",
                fixed: !0
            });
            $.get(e.base_url + "pv?lp=bawu_free&_t=" + (new Date).getTime()),
            o.dom.on("cancel",
            function() {
                o.hide()
            }).on("ok",
            function() {
                $.get(e.base_url + "pv?lp=sfrs_post_client_remove&_t=" + (new Date).getTime());
                var t = "/mo/q/m?tn=bdFRE&forum_id=" + e._forumid;
                o.hide(),
                $.location.setHref(t)
            })
        },
        _postResult: function(e, t) {
            var o = "",
            a = "",
            r = this._editor;
            switch (e.no) {
            case 0:
                r.postSuccess(e.data);
                var i = this._vcode,
                s = this._block,
                n = this._hide,
                c = this.has_chance;
                2 != s && 1 != n && 1 == i && 1 != $.cookie("vcode_exception_show") && this._showPostDialog(c);
                break;
            case 402:
                r.captcha.showCaptchaPanel(e.data.vcode_md5, e.data.vcode_type, "\u9A8C\u8BC1\u7801\u8F93\u5165\u9519\u8BEF\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165", !0, null, null, e.error),
                o = "\u9A8C\u8BC1\u7801\u8F93\u5165\u9519\u8BEF,\u8BF7\u91CD\u65B0\u8F93\u5165";
                break;
            case 10101:
                if (this._eventCenter.trigger("post_need_captch"), o = "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801", e.data.word) r.captcha.showCaptchaPanel(e.data.vcode_md5, e.data.vcode_type, '\u70B9\u51FB\u6846\u5185\u6587\u5B57\u8F93\u5165\u56FE\u4E2D<span class="PIN_red">\u6C49\u5B57\u6216\u62FC\u97F3</span>\u5BF9\u5E94\u6C49\u5B57', !0, e.data.fid, e.data.word, e.error);
                else {
                    var d = '\u70B9\u51FB\u6846\u5185\u6587\u5B57\u8F93\u5165\u56FE\u4E2D<span class="PIN_red">\u6C49\u5B57\u6216\u62FC\u97F3</span>\u5BF9\u5E94\u6C49\u5B57';
                    1 == this._isNewCaptcha && 0 != parseInt(r.captcha._receiveCaptchaType) && (o = "", d = "\u70B9\u51FB\u5237\u65B0\u9A8C\u8BC1\u7801"),
                    r.captcha.showCaptchaPanel(e.data.vcode_md5, e.data.vcode_type, d, !0, null, null, e.error)
                }
                break;
            case 411:
                a = this.base_url + "m?tn=bdTSU&tbs=" + t.tbs + "&word=" + encodeURIComponent(t.word) + "&act=id&src=2",
                o = "\u60A8\u7684\u5E10\u53F7\u7531\u4E8E\u4E0D\u6070\u5F53\u64CD\u4F5C\u5DF2\u88AB\u5C01,\u60A8\u53EF\u4EE5\u5728PC\u4E0A\u7533\u8BF7\u89E3\u5C01";
                break;
            case 412:
                a = this.base_url + "m?tn=bdTSU&tbs=" + t.tbs + "&word=" + encodeURIComponent(t.word) + "&act=ip&src=2",
                o = '<a href="' + a + '"></a>';
                break;
            case 9:
                r.reset(),
                o = "\u53D1\u5E03\u6210\u529F\uFF0C\u7B49\u5F85\u5BA1\u6838";
                break;
            case 900:
                o = "\u7531\u4E8E\u5427\u4E3B\u8BBE\u7F6E\uFF0C\u5F53\u524D\u4E0D\u80FD\u56DE\u590D\u672C\u8D34";
                break;
            case 901:
                o = "\u8BE5\u5427\u6216\u8005\u8BE5\u8D34\u4EC5\u9650\u7279\u5B9A\u7528\u6237\u53EF\u4EE5\u53D1\u8D34";
                break;
            case 4010:
                o = "\u60A8\u7684\u8D26\u53F7\u5B58\u5728\u5B89\u5168\u98CE\u9669\u6682\u4E0D\u80FD\u53D1\u8D34\uFF0C\u8BF7\u4F7F\u7528\u7535\u8111\u767B\u5F55\u767E\u5EA6\u8D34\u5427\uFF0C\u5728\u201C\u4E2A\u4EBA\u8D44\u6599\u8BBE\u7F6E\u2014\u2014\u8D26\u53F7\u5B89\u5168\u201D\u4E2D\u7ED1\u5B9A\u624B\u673A\uFF0C\u4FBF\u53EF\u6062\u590D\u53D1\u8D34\u3002";
                break;
            case 4011:
                o = "\u60A8\u7684\u8D26\u53F7\u5B58\u5728\u5B89\u5168\u98CE\u9669\u6682\u4E0D\u80FD\u53D1\u8D34\uFF0C\u8BF7\u4F7F\u7528\u7535\u8111\u767B\u5F55\u767E\u5EA6\u8D34\u5427\uFF0C\u5728\u201C\u4E2A\u4EBA\u8D44\u6599\u201D\u4E2D\u4FEE\u6539\u5BC6\u7801\uFF0C\u4FBF\u53EF\u6062\u590D\u53D1\u8D34\u3002";
                break;
            default:
                o = e.error ? e.error: "\u53D1\u8D34\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u5C1D\u8BD5"
            }
            return o
        },
        _showPostDialog: function(e) {
            var t = this;
            if (0 == e) var o = "\u60A8\u7684\u5E10\u53F7\u5728\u5168\u7AD9\u90FD\u9700\u8981\u9A8C\u8BC1\u7801\u3002\u53EF\u4EE5\u5230\u7535\u8111\u7248\u670D\u52A1\u4E2D\u5FC3\u7533\u8BF7\u6062\u590D~</span>",
            a = "\u786E\u5B9A";
            else var o = "\u60A8\u7684\u5E10\u53F7\u5728\u5168\u7AD9\u90FD\u9700\u8981\u9A8C\u8BC1\u7801\uFF0C\u73B0\u5728\u53BB\u89E3\u9664\u4E48\uFF1F</span>",
            a = "\u7533\u8BF7\u4E00\u952E\u6062\u590D";
            var r = new Dialog({
                mask: !0,
                closebtn: !1,
                title: "",
                content: o,
                cancelbtn: a,
                okbtn: "\u4E0D\u518D\u63D0\u9192",
                wrapperStyle: "border-radius:3px;background-color:#fcfcfc;",
                okbtnStyle: "font-size: 14px;border: 1px solid #e6e7e8;margin-bottom: 15px;border-radius: 3px;color: #262626;background: #f3f3f3 -webkit-gradient(linear,left top,left bottom,from(#fafafa),to(#eee));text-shadow: 1px 1px #cccccc;",
                cancelbtnStyle: "font-size: 14px;border: 1px solid #3984e1;margin-bottom: 15px;border-radius: 3px;color: #fff;background: #1398f5 -webkit-gradient(linear,left top,left bottom,from(#4390f1),to(#2374d8));text-shadow: 1px 1px #4677b3;",
                contentStyle: "font-size: 14px;line-height: 24px;padding: 12px;",
                fixed: !0
            });
            $.get(t.base_url + "pv?lp=sfrs_post_dialog_show&_t=" + (new Date).getTime()),
            r.dom.on("cancel",
            function() {
                $.get(t.base_url + "pv?lp=sfrs_post_client_remove&_t=" + (new Date).getTime());
                var o = "/mo/q/account_page?";
                0 != e && $.location.setHref(o),
                r.hide()
            }).on("ok",
            function() {
                $.cookie("vcode_exception_show", 1, 1),
                r.hide()
            })
        }
    },
    t = a
},
[]);
F.module("spostor/widget/frs_postor/frs_editor",
function(t, i) {
    var e = F.require("spostor/widget/editor"),
    o = e.extend({
        initialize: function() {
            this._device_config = {
                is_show: 0,
                info: ""
            },
            $.extend(this._device_config, this._options.device || {})
        },
        getPostData: function() {
            var t = {};
            return t.fid = this._data_postor.fid,
            t.src = 2,
            t.word = this._data_postor.word,
            t.tbs = this._data_postor.tbs,
            t.lp = 5020,
            t.hasprefix = this.hasTitlePrefix(),
            t
        },
        getCaptchaData: function() {
            var t = {};
            return t.src = 2,
            t.fid = this._data_postor.fid,
            t.word = this._data_postor.word,
            t.ti = this.editorTitle.getTitle(),
            t.co = this.editorContent.getContent(),
            t
        },
        getUploadPicData: function() {
            var t = {};
            return t.fid = this._data_postor.fid,
            t.word = this._data_postor.word,
            t.lp = 6040,
            t.src = 2,
            t
        },
        postSuccess: function(t) {
            this.reset(),
            this.editorTitle.setPlaceholder(""),
            this.editorContent.setPlaceholder(""),
            this.captcha.fixPanelTop(),
            this.showSuccessTip(t)
        },
        showSuccessTip: function(t) {
            var i = this,
            e = "";
            e = "<p>\u53D1\u8868\u4E3B\u9898\u8D34\u6210\u529F\uFF01</p>",
            t.mcount && (e += "<p>\u559C\u4F60\u6210\u4E3A\u672C\u5427\u7B2C" + t.mcount + "\u4F4D\u4F1A\u5458</p>"),
            $.toast.send(e),
            this.eventCenter.trigger("post_success_end"),
            this.voicePanelHide(),
            this.smilePanelHide(),
            this.uploadPicPanelHide(),
            setTimeout(function() {
                i.trigger("editor_see_latest_post")
            },
            1e3)
        },
        login: function() {
            try {
                $.storage.set("login_jump_back_post", 1)
            } catch(t) {
                console.log("The localStorage is disabled!")
            }
            UserAccount.login()
        }
    });
    return i = o
},
[]);;
F.module("spostor/widget/frs_postor/frs_postor_handler",
function(t, e) {
    var i = F.require("sglobal/component/float_layer"),
    s = ['<div class="j_top_bar blue_kit j_postor_blue_head">', '<div class="blue_kit_left">', '<a class="blue_kit_btn blue_kit_btn_back j_postor_blue_kit_btn_return" href="javascript:;">', '<span class="icon_tieba_logo blue_kit_btn_logo"></span>', '<span class="blue_kit_text">\u53D1\u8868\u4E3B\u9898</span>', "</a>", "</div>", '<div class="blue_kit_right">', '<a class="blue_kit_btn j_submit_btn" href="javascript:;">\u53D1\u8D34</a>', "</div>", "</div>", '<div id="j_main_editor_container" class="editor_panel overthrow">', "</div>"],
    n = navigator.userAgent.toLocaleLowerCase().indexOf("uc") >= 0,
    o = function(t) {
        this.postorHtml = s.join(""),
        this.eventCenter = t.eventCenter,
        this.pageYOff = 0,
        this.canPost = t.canPost,
        this.floatLayer = null,
        this.isNeedAnim = !1
    };
    return o.prototype = {
        init: function() {
            this.initFloatLayer(),
            this.initEvent()
        },
        initEvent: function() {
            _.eventCenter.on("frs_postor_show", this.postorShow, this),
            _.eventCenter.on("frs_postor_hide", this.postorHide, this),
            this.eventCenter.on("post_success_end", this.back, this),
            this.floatLayer && this.floatLayer.getLayer().on("click", ".j_postor_blue_kit_btn_return", _.bind(this.back, this)).on("click", ".j_submit_btn", _.bind(this.submitPost, this)),
            $.os.ios && $.os.version >= "7.0" && $.os.version < "8.0" && $("#j_main_editor_container").on("touchend", ".editor_input",
            function(t) {
                t.preventDefault(),
                t.target.focus()
            })
        },
        initFloatLayer: function() {
            n && (this.isNeedAnim = !1),
            this.floatLayer || (this.floatLayer = new i({
                isNeedAnim: this.isNeedAnim,
                showEnd: function() {
                    _.eventCenter.trigger("frs_postor_show_end")
                }
            }), this.floatLayer.render($(this.postorHtml)), this.floatLayer.getLayer().addClass("frs_poster_layer"), this.floatLayer.getLayer().prepend('<div class="j_captcha_panel captcha_panel"></div>'))
        },
        getWindowSize: function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            }
        },
        postorShow: function() {
            if (this.canPost) {
                this.pageYOff = window.pageYOffset,
                this.floatLayer.show()
            } else this.eventCenter.trigger("frs_can_not_post")
        },
        postorHide: function() {
            var t = this;
            _.eventCenter.trigger("frs_postor_hide_before"),
            scrollPos(this.pageYOff, 300),
            setTimeout(function() {
                t.floatLayer.hide()
            },
            100)
        },
        back: function(t) {
            t && t.preventDefault(),
            this.eventCenter.trigger("frs_poster_back")
        },
        submitPost: function() {
            this.eventCenter.trigger("start_submit_post")
        }
    },
    e = o
},
[]);;
F.module("spostor/widget/frs_postor",
function(e, t) {
    function i(e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
        i = location.search.substr(1).match(t);
        return null != i ? unescape(i[2]) : null
    }
    function o() {
        var e = location.search,
        t = new Object;
        if ( - 1 != e.indexOf("?")) {
            var i = e.substr(1);
            strs = i.split("&");
            for (var o = 0; o < strs.length; o++) t[strs[o].split("=")[0]] = strs[o].split("=")[1]
        }
        return t
    }
    function n(e) {
        function t() {
            n.destory()
        }
        function i() {
            n.showLimitPostTip.call(n, d.getLimitPostTip())
        }
        function o() {
            var e = location.search,
            t = new Object;
            if ( - 1 != e.indexOf("?")) {
                var i = e.substr(1);
                strs = i.split("&");
                for (var o = 0; o < strs.length; o++) t[strs[o].split("=")[0]] = strs[o].split("=")[1]
            }
            return t
        }
        var n, d, l, p, u = this,
        f = {},
        m = window._,
        v = new m.Events;
        if (!e.isLogin && "undefined" != typeof UserAccount) return window.UserAccount.loginLayer({
            extendedParams: {
                task: "loginLayer",
                locate: "frs_post_entrance"
            },
            product: "tb",
            onHide: function() {
                u.goBack(e)
            }
        }),
        void 0;
        $.extend(f, e.data_postor || {}),
        p = new _({
            $el: $(".j_container"),
            eventCenter: v,
            canPost: e.data_editor.can_post
        }),
        p.init();
        var g = 1;
        e.headline_img_url && e.headline_img_id >= 0 && (g = 0),
        n = new a({
            editor_html: c.join(""),
            outerContainer: $("#j_main_editor_container"),
            data_postor: f,
            data_editor: e.data_editor || {},
            config: {
                has_title: 1,
                has_upload_pic: 1,
                enable_draft: 1,
                has_voice_btn: 1,
                has_submit_btn: 0,
                has_at: g,
                has_recommend: g,
                has_toutiao: !g,
                network: e.network
            },
            device: e.device || {},
            domains: e.domains,
            titlePrefix: e.titlePrefix,
            titlePrefixType: e.titlePrefixType,
            titlePrefixMode: e.titlePrefixMode,
            eventCenter: v,
            isNewCaptcha: 1,
            headlineImgUrl: e.headline_img_url
        }),
        n.editorTitle.setConfig({
            placeholder: "\u6807\u9898\uFF08\u5FC5\u586B\uFF09"
        }),
        n.editorContent.setConfig({
            height: "80px",
            placeholder: "",
            isAutoHeight: !1,
            isAutoScrollWhenInput: !1
        }),
        n.captcha.setConfig({
            request_param: {
                word: f.word,
                src: 2,
                fid: f.fid
            }
        }),
        d = new r({
            editor: n,
            data_editor: e.data_editor,
            tip: {
                no_un_not_post: "\u60A8\u8FD8\u6CA1\u6709\u7528\u6237\u540D,\u4E0D\u5141\u8BB8\u53D1\u8D34,\u8BF7\u5148\u586B\u5199\u7528\u6237\u540D",
                half_user_not_post: "\u60A8\u7684\u5E10\u53F7\u4FE1\u606F\u4E0D\u5B8C\u5584,\u4E0D\u5141\u8BB8\u53D1\u8D34,\u8BF7\u5B8C\u5584\u5E10\u53F7\u4FE1\u606F"
            }
        }),
        n.init(),
        d.init(),
        l = new s({
            has_chance: e.has_chance,
            block_stat: e.block_stat,
            hide_stat: e.hide_stat,
            vcode_stat: e.vcode_stat,
            days_tofree: e.days_tofree,
            forum_name: e.forum_name,
            forum_id: e.forum_id,
            editor: n,
            eventCenter: v,
            isNewCaptcha: 1,
            headline_img_url: e.headline_img_url,
            headline_img_id: e.headline_img_id
        }),
        e.device.is_show && setTimeout(function() {
            var t = e.device.info,
            i = t.appName,
            o = t.appVersion,
            a = t.os,
            r = t.net,
            s = "";
            s = i + " " + o,
            $.trim(s).length > 0 && (s += ","),
            s += a + ",",
            s += r + ":",
            n.editorContent.setContent(s)
        },
        100),
        n.on("editor_start_post",
        function(e) {
            l.execute(e)
        }),
        n.on("editor_see_latest_post",
        function() {}),
        v.on("frs_poster_back",
        function() {
            u.goBack(e)
        }),
        v.on("frs_can_not_post", i),
        m.eventCenter.on("frs_postor_hide",
        function() {
            n.voicePanelHide(),
            n.smilePanelHide(),
            n.uploadPicPanelHide()
        }),
        m.eventCenter.on("postor_destroy_main", t),
        $.storage.available() && $.storage.get("is_need_show_poster") && ($.loading(), setTimeout(function() {
            $.unloading(),
            m.eventCenter.trigger("frs_postor_show"),
            $.storage.del("is_need_show_poster")
        },
        1e3)),
        $.ajax({
            type: "get",
            url: "/mo/q/filter/forum?topic_name=" + o().topic_name,
            success: function(e) {
                var t = "",
                i = -1;
                if (e.data.topic_relate_forum.length > 0 && (t = e.data.topic_relate_forum[0].forum_name, i = e.data.topic_relate_forum[0].forum_id), e.data.like_forum.length > 0 && (t = e.data.like_forum[0].forum_name, i = e.data.like_forum[0].forum_id), "" === t && (t = e.data.default_forum[0].forum_name, i = e.data.default_forum[0].forum_id), "" !== t) {
                    $(".select-forum-input").val(t),
                    $(".select-forum-input").tbattr("data-forumid", i),
                    n.captcha.setConfig({
                        request_param: {
                            word: t,
                            src: 2,
                            fid: f.fid
                        }
                    });
                    var a = o().topic_name;
                    a && (a = "#" + decodeURIComponent(a) + "#", $(".j_editor_input").val(a), $(".j_editor_input").keyup(function() { - 1 === $(this).val().indexOf(a) && $(this).val(a)
                    })),
                    $(".select-forum-input").keyup(function() {
                        $.ajax({
                            type: "get",
                            url: "/mo/q/hotMessage/getforumid?forum_name=" + $(".select-forum-input").val(),
                            success: function(e) {
                                $(".select-forum-input").data("forumid", e.data.forum_id)
                            }
                        })
                    })
                }
            },
            dataType: "json"
        }),
        this.destory = t,
        this.editor = n
    }
    var a = F.require("spostor/widget/frs_postor/frs_editor"),
    r = F.require("spostor/widget/postor/post_state"),
    s = F.require("spostor/widget/postor/post_handle"),
    _ = (F.require("spostor/widget/postor"), F.require("spostor/widget/frs_postor/frs_postor_handler")),
    d = i("topic_name"),
    l = "";
    d && (l = '<div class="j-select-forum select-forum"><div class="select-forum-container"><span class="select-forum-post-to-text">\u53D1\u8868\u5230:</span><input class="select-forum-input"/><div class="select-forum-switch-button">\u6362\u4E00\u4E2A</div></div></div>'),
    PageUnit.load("pb_main_postor_uppic_dialog_conf"),
    PageUnit.load("pb_lzl_postor_conf"),
    PageUnit.load("pb_main_postor_at_btn_conf"),
    PageUnit.load("pb_main_postor_voice_btn_conf");
    var c = ['<div class="j_editor editor">', l, '<div class="j_editor_title_panel editor_title_panel"></div>', '<div class="j_editor_content_panel editor_content_panel">', '<div class="j_savedraft_panel savedraft_panel"></div>', "</div>", '<div class="j_editor_bottom_panel editor_bottom_panel clearfix">', '<div class="editor_btn_list">', '<div class="j_media_bar media_bar">', '<div class="j_voice_btn_panel voice_btn_panel"></div>', '<div class="j_smile_btn_panel smile_btn_panel"></div>', '<div class="j_pic_btn_panel pic_btn_panel"></div>', '<div class="j_recommend_btn_panel recommend_btn_panel"></div>', '<div class="j_at_btn_panel at_btn_panel"></div>', "</div>", '<div class="j_submit_btn_panel submit_btn_panel"></div>', "</div>", '<div class="j_post_tip post_tip"></div>', '<div class="j_user_hide post_tip"></div>', '<div class="j_no_un_tip no_un_tip"></div>', '<div class="j_device_info device_info"></div>', "</div>", "</div>"];
    return n.prototype = {
        goBack: function(e) {
            function t(e) {
                var t = "";
                return 0 == e.length ? "": (t = e.replace(/&/g, "&amp;"), t = t.replace(/</g, "&lt;"), t = t.replace(/>/g, "&gt;"), t = t.replace(/ /g, "&nbsp;"), t = t.replace(/\'/g, "&#039;"), t = t.replace(/\"/g, "&quot;"), t = t.replace(/\n/g, "<br>"))
            }
            var i = o().topic_name;
            if (e.headline_img_url && e.headline_img_id >= 0) $.location.setHref($.location.getOrigin() + "/n/forum-toutiao/home?jump=finish_this_page&forum_id=" + encodeURIComponent(e.forum_id));
            else if (i) {
                var n = encodeURIComponent(t(decodeURIComponent(i)));
                n = n.replace(/%26nbsp%3B/g, "%20"),
                $.location.setHref($.location.getOrigin() + "/mo/q/hotMessage?topic_name=" + n)
            } else $.location.setHref($.location.getOrigin() + "/f?kw=" + encodeURIComponent(e.forum_name))
        }
    },
    t = n
},
[]);