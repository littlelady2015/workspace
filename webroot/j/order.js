/* 表单验证消息提示 */
$.fn.showErrorString = function (str) {
    var err = this.siblings('span.error'), that = this;
    if (err.size() == 0) {
        err = $('<span class="error"></span>');
        this.parent().append(err);
    }
    err.html(str || '');
    if (str) { err.css('display', 'inline-block'); } else { err.hide(); }
    return this;
};
$.fn.validSelection = function () {
    var element = this;
    var params = this.data('validParam');
    var val = element.val().trim();
    var emptyChar = params.emptyChar || '';
    if (params.validEmpty && val == emptyChar) {
        element.showErrorString(params.emptyError);
        element.data('error', true);
    } else if (params.validItems && params.validItems.indexOf(val) >= 0) {
        element.showErrorString(params.itemsError);
        element.data('error', true);
    } else {
        element.showErrorString();
        element.data('error', false);
    }
    element.data('valid', true);
};
var IdCard18 = function (val) {
    var r18 = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/);
    return r18.test(val.trim());
};
/* 表单元素校验 */
$.fn.validFormElement = function (params) {
    var regChars = /^[A-Za-z0-9\s.,\-_#\*\(\)\+\~\@\$ \u4E00-\u9FA5]+$/;
    this.data('validParam', params);
    if (this.tagName() == 'select') {
        this.change(function () {
            $(this).validSelection();
        });
        return this;
    }
    this.blur(function () {
        var element = $(this), params = $(this).data('validParam'), isValidMethod = true;
        var val = element.val().trim(), emptyChar = params.emptyChar || '';
        if (params.validMethod == 'isIDCard' && $("#sel_UserID")[0].options.selectedIndex != 0) {
            isValidMethod = false;
        }
        if (params.validEmpty && (val == emptyChar || val == '')) {
            element.showErrorString(params.emptyError);
            element.data('error', true);
        } else if (val == emptyChar || val == '') {
            element.showErrorString();
            element.data('error', false);
        } else if (isValidMethod && params.validMethod) {
            if (val[params.validMethod](params.methodParam)) {
                if (IdCard18(val)) {
                    val = val.substr(6, 2);
                    if (val == "20" || val == "19" || val == "18") {
                        element.showErrorString();
                        element.data('error', false);
                    } else {
                        element.showErrorString(params.methodError);
                        element.data('error', true);
                    }
                } else {
                    element.showErrorString();
                    element.data('error', false);
                }
            } else {
                element.showErrorString(params.methodError);
                element.data('error', true);
            }
        } else if (params.validRegex && !params.validRegex.test(val)) {
            element.showErrorString(params.regexError);
            element.data('error', true);
        } else if (params.validChars && !regChars.test(val)) {
            element.showErrorString(params.charsError);
            element.data('error', true);
        } else {
            //console.log([checkedCard,oldCardVal,CardVal])
            if (params.callback && params.callback.call) {
                var pt = element.parent();
                var checkedCard = pt.data('checkedCard');
                var oldCardVal = pt.data('oldCardVal');
                var group = pt.find("input.txt-cardgroup").val().trim();
                var code = pt.find("input.txt-cardno").val().trim();
                if (!group || !code) { return false; }
                var CardVal = group + '|' + code;
                if ((!oldCardVal || oldCardVal != CardVal) || (!checkedCard || checkedCard != 1)) {
                    params.callback({
                        code: code, group: group, fn: function (err) {
                            if (err == "") { //success
                                pt.data('checkedCard', 1);
                                pt.data('oldCardVal', CardVal);
                                element.showErrorString();
                                element.data('error', false);
                            } else {
                                pt.data('checkedCard', 0);
                                element.showErrorString(err || '券号错误！');
                                element.data('error', true);
                            }
                        }
                    });
                } else {
                    element.showErrorString();
                    element.data('error', false);
                }
            } else {
                element.showErrorString();
                element.data('error', false);
            }
        }
        element.data('valid', true);
    });
    return this;
};
$.fn.autoSplitLetters = function () {
    this.css('ime-mode', 'disabled');
    return this.keypress(function (e) {
        try {
            if (e.shiftKey) return false;
            var code = e.which || e.keyCode || 0;
            return code == 8 || code == 32 || (e.which == 0 && e.keyCode == 37) || (e.which == 0 && e.keyCode == 39) || (code >= 48 && code <= 57) || (e.which == 0 && e.keyCode == 46);
        } catch (err) { }
    });
};
$.fn.autoUpperCase = function () {
    return this.keyup(function () {
        this.value = this.value.toUpperCase();
    });
};
// 添加中奖号码和组的校验
$.fn.validElementPostCard = function () {
    this.autoSplitLetters().validFormElement({
        validRegex: /^([\d]{1,10})$/, regexError: '兑奖号码位数不正确！', validEmpty: true, emptyError: '兑奖号码不能为空！'
    })
        .siblings("input.txt-cardgroup").autoUpperCase().validFormElement({
        validRegex: /^(\w)+$/, regexError: '请输入组号！', validEmpty: true, emptyError: '组号不能为空！'
    });
    return this;
};
// 检查Element校验情况
checkFormElements = function () {
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (element.size() > 1) {
            for (var j = 0; j < element.size() ; j++) {
                var elm = element.eq(j);
                if (!elm.data('valid')) elm[elm.tagName() == 'select' ? 'validSelection' : 'blur']();
                if (elm.data('error')) {
                    if (elm.tagName() == 'input') elm.focus();
                    return false;
                }
            }
        } else {
            if (!element.data('valid')) element[element.tagName() == 'select' ? 'validSelection' : 'blur']();
            if (element.data('error')) {
                if (element.tagName() == 'input') element.focus();
                return false;
            }
        }
    }
    return true;
};
function getMoreList(ObjItem, ObjItemAll, startIndex, pageSize, oneOrTwo) {
    _ObjItemAll = $(ObjItemAll + ' li');
    var count = _ObjItemAll.length;
    if (count > 0) {

        var html = '<li class="li_top"><span class="li_1">包裹号</span><span class="li_2">包裹状态</span><span class="li_3">商品数量</span></li><li class="li_top"><span class="li_1">包裹号</span><span class="li_2">包裹状态</span><span class="li_3">商品数量</span></li>';
        if (oneOrTwo == 2) {
            html = '<li class="li_top">奖券卡号</li><li class="li_top">奖券卡号</li>';
        }

        $(ObjItem).find('ul').html("");
        var end = count > (startIndex + pageSize) ? (startIndex + pageSize) : count;
        for (var j = startIndex; j < end; j++) {
            html += '<li class="li_con">' + _ObjItemAll.eq(j).html() + '</li>';
        }
        $(ObjItem).find('ul').html(html);
        var pageDiv = $(ObjItem).find(".order_page");
        if (count <= pageSize) {
            pageDiv.hide();
        } else {
            pageDiv.html('').show();
            var totalPagef = parseFloat(count / pageSize);
            var totalPagei = parseInt(count / pageSize);
            if (totalPagef != totalPagei) {
                totalPagei = totalPagei + 1;
            }
            var newcount = parseInt(startIndex / pageSize) + 1;
            if (newcount > 1) {
                pageDiv.append('<a class="pageupon" title="上一页" href="#">&lt;上一页</a><a href="#">1</a>');
            } else {
                pageDiv.append('<span class="pageupoff" title="上一页">&lt;上一页</span><a class="selected" href="#">1</a>');
            }
            for (var k = 2; k <= totalPagei; k++) {
                if (newcount == k) {
                    pageDiv.append('<a class="selected" href="#">' + k + '</a>');
                } else {
                    pageDiv.append('<a href="#">' + k + '</a>');
                }
            }
            if (newcount != totalPagei) {
                pageDiv.append('<a class="pagedownon" title="下一页" href="#">下一页&gt;</a>共' + totalPagei + '页')
            } else {
                pageDiv.append('<span class="pagedownoff" title="下一页" href="#">下一页&gt;</span>共' + totalPagei + '页')
            }
            $(pageDiv).find('a').click(function () {
                var that = $(this);
                var pageDiv = that.parent();
                var number = that.text();
                var totalPage = $(pageDiv).find('a').size();
                if (that.hasClass('selected') || that.hasClass('pageupoff') || that.hasClass('pagedownoff')) {
                    return false;
                } else {
                    if (that.hasClass('pageupon')) {
                        number = parseInt(pageDiv.find('.selected').text()) - 1;
                    };
                    if (that.hasClass('pagedownon')) {
                        number = parseInt(pageDiv.find('.selected').text()) + 1;
                    };
                    number = number >= totalPage ? totalPage : number;
                    var offset = (number - 1) * pageSize;
                    getMoreList(ObjItem, ObjItemAll, offset, pageSize, oneOrTwo);
                    return false;
                }
            });
            if (oneOrTwo == 1) {
                orderOpenBox();
            }
        }
    }
}
function orderOpenBox() {
    $('#order_list_con1').css('z-index', '99').find('.li_con a').click(function () {
        var _deleveryOrderId = $(this).attr('name');
        $.getJSON('http://my.' + JEND.server.uleUrl + '/myorder/postCardPostMailInfo.do?jsonCallBack=?', { deleveryOrderId: _deleveryOrderId }, function (obj) {
            //alert(obj);
            if (obj) {
                var _html = '<div class="order_boxt"><a href="#"></a><span>包裹详细信息</span></div>';
                _html += '<div class="order_boxtit">包裹号：' + obj.orderPackage + '<span>' + obj.orderPackageStatus + '</span></div>';
                _html += '<ul class="order_boxul">';
                for (var i = 0; i < obj.mailInfos.length; i++) {
                    _html += '<li>' + obj.mailInfos[i].dealTime + '<span class="ml10">' + obj.mailInfos[i].dealRemark + '</span></li>';
                    //dealCompany
                }
                _html += '</ul><a href="#" class="allmost"></a></div>';
                $('#order_box').html(_html).show();
                orderBoxInto();
            }
        });
        return false;
    });
}
function orderBoxInto() {
    $('#order_box .order_boxt a').click(function () {
        $('#order_box').hide();
        return false;
    });
    $('#order_box .allmost').click(function () {
        $('#order_box　.order_boxul').css('height', 'auto');
        $(this).hide();
        return false;
    });
}
$.fn.aasdsad = function (event_list, event_nav, Menu) {
    var $this = this, win = $(window);
    var _top = 300;
    var _scroll = 0;
    var _run = function () {
        _scroll = win.scrollTop();
        if (_scroll > _top) {
            Menu.show();
            var _index = 0;
            event_list.each(function (index) {
                if (_scroll > ($(this).offset().top - 100)) {
                    _index = index;
                }
            });
            event_nav.removeClass();
            event_nav.eq(_index).addClass('tool_' + (_index + 1));
        } else {
            Menu.hide();
        }
    }
    win.scroll(_run);
    _run();
};
$(function () {
    document.domain = 'ule.com';
    //活动兑换页
    if ($('.event_page').length > 0) {
        $('.tool').aasdsad($('#list_1,#list_2,#list_3,#event_bottom'), $('#tool_1,#tool_2,#tool_3,#tool_4'), $('#tool'));
        $("ul.pc_qa_list .hide").hide();
        var pcqa_list = $("ul.pc_qa_list").each(function () {
            var pcqa_li = $(this).find("li.hide"), more_up = $(this).next("a.up"), more_qa = $(more_up).next("a.more_qa");
            if (pcqa_li.length) {
                more_qa.click(function () {
                    $(pcqa_li).show();
                    more_qa.hide();
                    more_up.show();
                });
                more_up.click(function () {
                    $(pcqa_li).hide();
                    more_qa.show();
                    more_up.hide();
                });
            } else { more_qa.hide() }
        });
        var qa_tab = $("ul.qa_tab");
        qa_tab.find("li").click(function () {
            var id = qa_tab.find("li.on").removeClass("on").attr("action");
            $(id).hide();
            this.className = "on";
            var id = this.getAttribute("action");
            $(id).show();
        });
        $('#tool_1,#tool_2,#tool_3,#tool_4').click(function () {
            var n = this.href;
            if (n) {
                n = n.split("#")[1];
                if (n != "") {
                    var a = $("#" + n), t = 0;
                    if (a.length) { t = a.offset().top; }
                    window.scrollTo(0, t);
                }
            }
            return false;
        });
        $('#top_close').click(function () {
            window.scrollTo(0, 0);
            return false;
        });

        $('#list_tab li').click(function () {
            $(this).addClass('on_' + $(this).attr('inx')).siblings().removeClass();
            $('#list_3 .list_con').hide();
            $('#list_3 #list_con_' + $(this).attr('inx')).show();
        });
    }



    //订单页
    if ($('#packagedata li').length > 6) {
        getMoreList('#order_list_con1', '#packagedata', 0, 6, 1);
    } else {
        orderOpenBox();
    }
    if ($('#postcarddata li').length > 6) {
        getMoreList('#order_list_con2', '#postcarddata', 0, 6, 2);
    }

    $('#goto_wallet,#ingoto_order').click(function () {
        var _href = '';
        if ($(this).attr('id') == 'goto_wallet') {
            _href = 'http://postcard.' + JEND.server.uleUrl + '/2013/postcard/wallet.do'
        } else if ($(this).attr('id') == 'ingoto_order') {
            _href = 'http://my.' + JEND.server.uleUrl + '/myorder/postOrderView.do?buyType=1&beginPage=1'
        }
        $.getJSON(JEND.page.header.data.url.ansycUrl, function (data) {
            var userid = data.useronlyid;
            var loginname = data.loginname;
            if ((data.mall_cookie || data.mall_cookie != "") && data.groupId != 80) {
                window.location.href = _href;
                //window.open(_href);
            } else {
                if (data.groupId == 80) {
                    loginGroup(_href);
                } else {
                    JEND.login.pop(_href);
                }
            }
        });
        return false;
    });
    $('#goto_order').click(function () {
        var _href = 'http://' + JEND.server.uleUrl + '/404.html'
        //window.location.href=_href;
        window.open(_href);
        return false;
    });

    //弹出层
    $('.event_top_2 a').click(function () {
        var _html = '<div id="xingyunbox">';
        _html += '<dl class="postcard-card prize1"><dt>奖券号码：</dt><dd><div class="focus"><input type="text" maxlength="4" class="txt-cardgroup" name="prizeGroup"><span class="txt-mid">组</span><input type="text" maxlength="16" class="txt-cardno" name="prizeCode" style="ime-mode: disabled;"></div></dd></dl>';
        _html += '<dl class="postcard-pwd" style="padding:0;"><dt>校验码：</dt><dd><div><input type="password" maxlength="8" class="txt-verifyCode" name="verifyCode"></div></dd></dl>';
        _html += '<dl class="verify-code" style="height:40px;"><dt>验证码：</dt><dd><div><input type="hidden" id="validateKey" name="validateKey"><input type="text" size="4" class="inputbox" maxlength="4" id="validateValue" name="validateValue"><img style="width:56px;height:28px;" class="vcodeImg" name="tom_verify_img" id="tom_verify_img"><a id="newValidCode" href="javascript:void(0);">看不清换一张</a></div></dd></dl>';
        _html += '<dl><dt>&nbsp;</dt><dd><a class="btn-orange" href="#"><em>马上验证</em></a></dd></dl>';
        _html += '</div>';

        JEND.load('util.dialog', 'open', {
            title: '贺卡中奖查询',
            content: _html,
            width: 530,
            height: 200, top: 150
        });
        setTimeout(function () {
            initCard();
        }, 200);
        return false;
    });

    //选择查看订单方式
    if ($('#xz_order').length > 0) {
        $('.ccq li').click(function () {
            if ($(this).attr('id') != 'ingoto_order') {
                $('.ccq li').removeClass('selected');
                $(this).addClass('selected');
                $('.qform').hide();
                $('#' + $(this).find('label').attr('class')).show();
            }
            return false;
        });
        $('#mobile').validFormElement({ validMethod: 'isMobile', methodError: '请输入正确的手机号码!', validEmpty: true, emptyError: '手机号码不能为空！' });
        $('#checkCode').validFormElement({ validRegex: /^([\w]{6})$/, regexError: '请输入验证码！', validEmpty: true, emptyError: '验证码不能为空！' });

        $('#getCode').click(function () {
            var v = $('#mobile').val();
            if (checkFormElements($('#mobile'))) {
                var data = { mobile: $('#mobile').val().trim() };
                $.getJSON('http://prize.' + JEND.server.uleUrl + '/json/PostOrder/SendVcode.action?jsonCallBack=?', data, function (obj) {
                    if (obj.msg) {
                        if (obj.msg == '0') {
                            var count = 60, time;
                            if ($('#reGetCode')[0]) {
                                $('#getCode').hide();
                                $('#reGetCode').show().text(count + '秒后重新获取验证码');
                            } else {
                                $('#getCode').hide().after('<button class="reGetCode" disabled="disabled" id="reGetCode">' + count + '秒后重新获取验证码</button>')
                            }
                            function djs() {
                                if (count <= 0) {
                                    $('#getCode').show();
                                    $('#reGetCode').hide();
                                    clearInterval(time);
                                }
                                $('#reGetCode').text(count + '秒后重新获取验证码');
                                count--;
                            }
                            time = setInterval(djs, 1000);
                        } else {
                            JEND.page.alert('验证码发送失败，请稍后再试。')
                        }
                    } else {
                        JEND.page.alert('验证码发送失败，请稍后再试。')
                    }


                });
            }
            return false;
        });
        $('#formBTN2').click(function () {
            if (!checkFormElements($('#mobile'), $('#checkCode'))) return false;
            var _href = 'http://my.' + JEND.server.uleUrl + '/myorder/postOrderNewView.do?mobile=' + $('#mobile').val().trim();
            var data = { mobile: $('#mobile').val().trim(), vcode: $('#checkCode').val().trim() };
            $.getJSON('http://prize.' + JEND.server.uleUrl + '/json/PostOrder/Confirm.action?jsonCallBack=?', data, function (obj) {
                var _html = '';
                if (obj.msg == "0000") {
                    window.location.href = _href;
                    return false;
                } else if (obj.msg == "3619") {
                    _html = "手机号码非法!";
                } else if (obj.msg == "3609") {
                    _html = "验证码为空";
                } else if (obj.msg == "3615") {
                    _html = "请发送验证码后再进去确定！";
                } else if (obj.msg == "3610") {
                    _html = "验证码无效";
                } else if (obj.msg == "3616") {
                    _html = "验证码已过期，请重新领取验证码";
                } else if (obj.msg == "9999") {
                    _html = "系统忙,请稍后...";
                }
                JEND.page.alert(_html);
            });
            return false;
        });
    }
});
//弹出层相关
function initCard() {
    $('input.txt-cardno').validElementPostCard().focus(function () {
        $(this).parent().attr("class", "focus");
    });
    $('input.txt-verifyCode').validFormElement({ validRegex: /^(\w)+$/, regexError: '请输入密码！', validEmpty: true, emptyError: '密码不能为空！' });
    $('#validateValue').validFormElement({ validRegex: /^([\w]{4})$/, regexError: '请输入验证码！', validEmpty: true, emptyError: '验证码不能为空！' });
    var keyurl = 'http://postcard.' + JEND.server.uleUrl + '/2013/MemRandomCode?';
    function getKey() {
        $.getJSON(keyurl + 'callback=?&_=' + (new Date()).getTime(), function (obj) {
            if (obj) {
                $('#tom_verify_img').attr('src', keyurl + 'key=' + obj.key).attr('key', obj.key);
            }
        });
    }
    $('#newValidCode').click(function () {
        getKey();
        return false;
    });
    getKey();
    $('.btn-orange').click(function () {
        postCard();
        return false;
    });
};
function postCard() {
    if (!checkFormElements($('input.txt-cardno'), $('input.txt-cardgroup'), $('input.txt-verifyCode'), $('#validateValue'))) return false;
    var data = { prizeType: 1, prizeGroup: $('input.txt-cardgroup').val().trim(), prizeCode: $('input.txt-cardno').val().trim(), verifyCode: $('input.txt-verifyCode').val().trim(), validateValue: $('#validateValue').val().trim(), validateKey: $('#tom_verify_img').attr('key') };
    $.getJSON('http://postcard.' + JEND.server.uleUrl + '/2013/postcard/query.do?jsonCallback=?', data, function (obj) {
        if (obj.code) {
            if (obj.code == '0000') {
                if (obj.cards.length == 2) {
                    var aa = 0; bb = 0;cc=0, _html = '';
                    if (obj.cards[0].level == 1) {
                        aa = obj.cards[0].status;
                        cc = obj.cards[1].status;
                    } else if (obj.cards[0].level == 2) {
                        bb = obj.cards[0].status;
                        cc = obj.cards[1].status;
                    }
                    else if (obj.cards[1].level == 2) {
                        cc = obj.cards[0].status;
                        bb = obj.cards[1].status;
                    }
                    else if (obj.cards[1].level == 1) {
                        cc = obj.cards[0].status;
                        aa = obj.cards[1].status;
                    }
                    if (aa == 2 && cc == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为一、三等奖的双重中奖号码</span><br />双重奖皆已完成兑换，感谢您对邮政业务的支持';
                    } else if (aa == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为一、三等奖的双重中奖号码</span><br />您可以在本专区兑换三等奖的礼品，为避免错过活动兑换时间请尽快领取，感谢您对邮政业务的支持(一等奖已完成兑换)。';
                    } else if (aa == 1 && cc == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为一、三等奖的双重中奖号码</span><br />您可以在本专区兑换一等奖的礼品，为避免错过活动兑换时间请尽快领取，感谢您对邮政业务的支持(三等奖已完成兑换)。';
                    } else if (aa == 1) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为一、三等奖的双重中奖号码</span><br />您可以在本专区分别兑换两种等级的礼品，为避免错过活动兑换时间请尽快领取，感谢您对邮政业务的支持。';
                    } else if (aa == 0 && cc == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为一、三等奖的双重中奖号码</span><br />三等奖已完成兑换，一等奖在使用前需要至附近邮政营业网点进行激活后方能在本专区兑换。';
                    } else if(obj.cards[0].level == 1&&aa==0) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为一、三等奖的双重中奖号码</span><br />您可以在本专区分别兑换两种等级的礼品，一等奖在使用前需要至附近邮政营业网点进行激活后方能在本专区兑换，三等奖现在即可兑换。';
                    }
                    else if (bb == 2 && cc == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为二、三等奖的双重中奖号码</span><br />双重奖皆已完成兑换，感谢您对邮政业务的支持';
                    } else if (bb == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为二、三等奖的双重中奖号码</span><br />您可以在本专区兑换三等奖的礼品，为避免错过活动兑换时间请尽快领取，感谢您对邮政业务的支持(二等奖已完成兑换)。';
                    } else if (bb == 1 && cc == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为二、三等奖的双重中奖号码</span><br />您可以在本专区兑换二等奖的礼品，为避免错过活动兑换时间请尽快领取，感谢您对邮政业务的支持(三等奖已完成兑换)。';
                    } else if (bb == 1) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为二、三等奖的双重中奖号码</span><br />您可以在本专区分别兑换两种等级的礼品，为避免错过活动兑换时间请尽快领取，感谢您对邮政业务的支持。';
                    } else if (bb == 0 && cc == 2) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为二、三等奖的双重中奖号码</span><br />三等奖已完成兑换，二等奖在使用前需要至附近邮政营业网点进行激活后方能在本专区兑换。';
                    } else if (obj.cards[0].level == 2 && bb == 0) {
                        _html = '<div id="xingyunbox2"><span class="orange">您所输入的兑奖号码为二、三等奖的双重中奖号码</span><br />您可以在本专区分别兑换两种等级的礼品，二等奖在使用前需要至附近邮政营业网点进行激活后方能在本专区兑换，三等奖现在即可兑换。';
                    }
                    openBox(_html);
                } else {
                    if (obj.cards[0].status == 0 && obj.cards[0].level != 3) {
                        var _html = '<div id="xingyunbox2" style="padding:15px 10px;"><span class="orange">恭喜您，该奖号为中奖号码</span><br />您的奖券在使用之前需要至附近邮政营业网点进行激活验证后方能在本专区进行兑换，为避免错过活动兑换时间请尽快前去验证并回来兑换，感谢您对邮政业务的支持';
                        openBox(_html);
                    } else if (obj.cards[0].status == 0 || obj.cards[0].status == 1) {
                        var _html = '<div id="xingyunbox2"><span class="orange">恭喜您，该奖号为中奖号码</span><br />您可在本专区内选择心仪的礼品进行兑换，为避免<br />错过活动兑换时间请尽快领取，感谢您对邮政业务的支持';
                        openBox(_html);
                    } else if (obj.cards[0].status == 2) {
                        var _html = '<div id="xingyunbox2">您所输入的兑奖号码为中奖号码，<br />该号码已于' + obj.cards[0].usedTime.parseDate().format('yyyy年m月d日') + '完成奖品兑换，<br />感谢您对邮政业务的支持';
                        openBox(_html);
                    } else {
                        var _html = '<div id="xingyunbox2">您所填写的兑奖号码信息有误，<br />请核对您邮政贺卡上的信息重新输入进行验证';
                        openBox(_html);
                    }
                }
            } else if (obj.code == '0001') {
                alert('请输入正确的验证码！');
                $('#newValidCode').click();
            } else if (obj.code == '0002') {
                alert('参数错误请正确输入！');
                $('#newValidCode').click();
            } else if (obj.code == '0003') {
                var _html = '<div id="xingyunbox2">您所输入的兑奖号码未中奖，<br />感谢您对邮政业务的支持'; openBox(_html);
            }
        } else {
            alert('系统错误请重试！');
        }
    });
    return false;
}
function openBox(_html) {
    JEND.load('util.dialog', 'open', {
        title: '温馨提示',
        content: _html + '<br /><a href="#" class="btn-orange"><em>确&nbsp;&nbsp;&nbsp;定</em></a></div>',
        width: 400,
        height: 180, top: 150
    });
    setTimeout(function () {
        $('#xingyunbox2 a.btn-orange').click(function () {
            JEND.util.dialog.close();
        });
    }, 200);
}
//重写弹窗登录
var loginNum = 4;
function loginGroup(_href) {
    JEND.load('util.dialog', 'open', {
        title: '温馨提示',
        content: '<div id="xingyunbox3" style="text-align:center;padding:30px 10px;font-size:14px;line-height:25px;">登录邮乐账户后方能继续使用该功能<br /><br /><a href="#" class="btn-orange"><em>知道了，现在重新登录</em></a></div>',
        width: 400,
        height: 180
    });
    setTimeout(function () {
        $('#xingyunbox3 a.btn-orange').click(function () {
            loginLast();
            loginNum = 4;
            var _html = '<iframe style="display:none" id="userlast" src="http://my.' + JEND.server.uleUrl + '/usr/logout.do"></iframe>';
            $('body').append(_html);
            function startRemove() {
                if (loginNum != 0) {
                    loginNum--;
                    setTimeout(function () {
                        $.getJSON(JEND.page.header.data.url.ansycUrl, function (data) {
                            if (data.mall_cookie || data.mall_cookie != "") {
                                startRemove();
                            } else {
                                $('#userlast').remove();
                                JEND.login.pop(_href);
                            }
                        });
                    }, 800);
                } else {
                    alert('退出登录异常，请重试。');
                }
            }
            startRemove();
            JEND.util.dialog.close();
        });
    }, 200);
}
function loginLast() {
    JEND.login.pop = function (param, callback) {
        if (!callback) {
            callback = param;
            param = null;
        }
        var loginCallback = function () { };
        if ($.isFunction(callback)) {
            loginCallback = callback;
        } else if (typeof (callback) == 'string' && callback != '') {
            loginCallback = function () {
                document.location.href = callback;
            }
        }
        if (JEND.cookie.get("mall_cookie") && JEND.cookie.get("mall_cookie") != '' && JEND.cookie.get("groupId") != 80) {
            loginCallback();
        } else {
            JEND.page.setDomain();
            var url = 'http://my.' + JEND.server.uleUrl + '/usr/toQuickRegister.do';
            if (param) url = url + '?' + $.param(param);
            JEND.page.dialog.pop({ title: '快速登录', url: url, width: 750, height: 365 });
            JEND.login.success = function () {
                JEND.util.dialog.close();
                if (JEND.page && JEND.page.header) JEND.page.header.refreshUserInfo();
                loginCallback();
            };
        }
        return false;
    };
}