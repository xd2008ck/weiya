/**
 * Created by zhangxingcai on 2017/1/4 0004.
 */
var beginTimer; //开始抽奖
var stopTimer; //停止抽奖
var luckTimer;
var scrollRange = 190;
var luckState = true; //抽奖状态
var isLuck = ""; //中奖号
var luckNumber; //抽奖次数
var luckNumberList = 1;
var luckLevel; //等级ID
var showLevel; //等级名称
var autoLuck = false; //自动抽奖
var selectNumber = 1; //保存上一次抽奖人的数量,
var luckScrollTime = 1;
var stopLuckTime; //强制停止抽奖
var luckUl = $("#luck_user ul");
var deleteLuckUser = '';
var alldataarr = [];
var setintIndex = 0;
function getRandom(min, max) {
    var r = Math.random() * (max - min);
    var re = Math.round(r + min);
    re = Math.max(Math.min(re, max), min)

    return re;
}
//获取用户
var getLottery = function () {
    //出现正在获取最新签到成员，请稍候...
    var getUserList = BaseUrl + "user/userList";
    $.ajax({
        async: true,
        url: getUserList,
        success: function (data) {
            alldataarr = data.data;
            //$.each(alldataarr, function (index, item) {
            //    var str = '<li id="'+item.openId+'" data-headpath="' + item.headImgUrl + '" data-userid="' + item.openId + '"><img src="' + item.headImgUrl + '"><br><span>' + item.name + '</span></li>';
            //    luckUl = $("#luck_user ul");
            //    luckUl.append(str);
            //})
            //luckUserList();

            //停止


        }
    })
}
///////////////////////////////////////////////////////////////////////////////抽奖
//复制用户列表(滚动)
var luckUserList = function () {
    luckUl.css("width", $("#luck_user").find("li").length * 190 * 2);
    luckUl.append(luckUl.html());
}
//移除重复标签，用于增加新的用户
var removeUserList = function () {
    luckUl.find("li").each(function (index, element) {
        if ($(this).index() + 1 > luckUl.find("li").length / 2) {
            $(this).remove();
        }
    });
}

var isAuto = function () {
    //换人var alldataarr=[];

    setintIndex = setInterval(function () {
        var user_index = getRandom(0, alldataarr.length);

        $("#span_name").html(alldataarr[user_index].name);
        $("#img_user").attr("src", alldataarr[user_index].headImgUrl);

    }, 100)

    $('#showPrize').hide();
    var userNum = $("select[name='userNum']").val();
    var prize = $("select[name='prize']").val();
    if (userNum > 1) {
        autoLuck = true;
        luckNumberList = userNum;
        selectNumber = userNum;
    } else {
        autoLuck = false;
        selectNumber = 1;
        luckNumberList = 1;
    }
    luckLevel = prize;
    levelMaxNum = $("#showLevel").find("a").attr("data-amount") * 1;
    luckNumber = userNum * 1;
    showLevel = prize;
    if (isLuck != "") {
        luckUl.find('li[data-userid=' + isLuck + ']').remove();
        luckUl.width(luckUl.width() - 380); //移除已中奖人后重新设置宽度
        isLuck = "";
    }
    //判断是否有需要回到奖池的用户
    if (deleteLuckUser != '') {
        removeUserList();
        luckUl.append(deleteLuckUser);
        luckUserList();
        deleteLuckUser = '';
    }
    if ($('#luck_user li').length < 0) {
        showInfo('当前还没有人参加活动', 0);
        return false;
    }
    if ($("#luck_user li").length == 2) {
        $("#luck_user ul li:last").remove();
        luckUl.width(190);
        luckUl.css("left", "170px");
    }
    if (luckLevel == 0) {
        showInfo("请选择抽奖等级", 0);
        return false;
    }
    $('#test').val(luckNumberList);
    if (luckNumberList * 1 > levelMaxNum) {
        showInfo("亲，奖品没那么多!", 0);
        return false;
    }

    if (isLuck != "" && luckNumber > Math.max(1, $("#luck_user li").length / 2 - 1)) {
        showInfo("抽奖人数不够!", 0);
        return false;
    } else if (luckNumber > Math.max(1, $("#luck_user li").length / 2)) {
        showInfo("抽奖人数不够!", 0);
        return false;
    }
    return false;
    beginLuck();

    $('#lottery .condition').addClass('disabled');
}
var beginLuck = function () {  //key 0:只抽一个人奖 1:自动抽奖

    stopLuckTime = 0;
    if (autoLuck == true) {
        $("#beginLuck").hide();
        $("#stopLuck").hide();
        $("#luckIng").show();
        $("#luckIng span").text(luckNumberList);
        setTimeout(function () {
            stopLuck(luckNumberList);
        }, 2000);
    }
    if (luckState) {
        $("#stopLuck").show();
        $("#beginLuck").hide();
        if (isLuck != '') {
            luckUl.find('li[data-userid=' + isLuck + ']').remove();
            luckUl.width(luckUl.width() - 380); //移除已中奖人后重新设置宽度
        }
        //判断奖池是否已经没人了
        if ($("#luck_user li").length == 0) {
            showInfo("已经没有人了!", 0);
            $("#stopLuck").hide();
            $("#beginLuck").show();
            return false;
        }

        if ($("#luck_user li").length == 1) {
            luckUl.width(190);
            luckUl.css("left", "170px");
        }
        if ($("#luck_user li").length == 2) {
            $("#luck_user li:last").remove();
            luckUl.width(190);
            luckUl.css("left", "170px");
        }
        if ($("#luck_user li").length > 2) {
            beginTimer = setInterval(function () {

                luckUl.css({left: -scrollRange});
                scrollRange = scrollRange + 60;
                if (scrollRange > luckUl.width() / 2 + 45) {
                    luckUl.css("left", -20);
                    scrollRange = 190;
                }
                stopLuckTime = stopLuckTime + 100;
                if (autoLuck == true && stopLuckTime > 150000) {
                    clearInterval(beginTimer);
                    console.log(luckNumberList);
                    stopLuck(luckNumberList);
                }
            }, luckScrollTime);
        }
    } else {
        showInfo("抽奖进行中...");
    }

}

//停止抽奖
var stopLuck = function () {
    //
    clearInterval(setintIndex);
//后台选择
    var data = [1, 2, 3];
    var index = 0;
    setInterval(function () {

            console.log("恭喜您中奖了" + data[index]);
            index += 1;
        }

        , 1000)


    return false;
    clearInterval(beginTimer);
    clearInterval(stopTimer);
    luckState = false;
    $("[data-prizeid=" + luckLevel + "]").find("label").html($("[data-prizeid=" + luckLevel + "]").find("label").html() * 1 - 1);
    $("[data-prizeid=" + luckLevel + "]").attr('data-amount', $("[data-prizeid=" + luckLevel + "]").find("label").html() * 1);
    $("#beginLuck").show();
    $("#stopLuck").hide();
    var i = 10; //速度递减
    var j = 2; //时间控制
    if ($("#luck_user li").length > 1) {
        stopTimer = setInterval(function () {
            luckUl.css({left: -scrollRange});
            scrollRange = scrollRange + i;
            j++;
            if (j % 2 == 0) {
                i--;
            }
            if (scrollRange >= parseInt(luckUl.width() / 2) + 45) {
                luckUl.css("left", -20);
                scrollRange = 20;
            }
            if (i <= 1) {
                clearInterval(stopTimer);
                var stopRange = Math.ceil(scrollRange / 190) * 190 + 20;
                luckTimer = setInterval(function () {
                    scrollRange = scrollRange + 1;
                    luckUl.css({left: -scrollRange});
                    if (scrollRange >= parseInt(luckUl.width() / 2) + 45) {
                        luckUl.css("left", -20);
                        scrollRange = 20;
                        stopRange = stopRange - luckUl.width() / 2;
                    }

                    if (scrollRange == stopRange) {
                        clearInterval(luckTimer);
                        luckState = true;
                        $("#submitLottery").removeClass("gray");
                        $("#removeLottery").removeClass("gray");
                        /////////////中奖
                        var luckLi = $('#luck_user li:eq(' + Math.ceil(scrollRange / 190) + ')');
                        isLuck = luckLi.data("userid"); //获取中奖data,也就是中奖人的ID啦
                        var imgUl = luckLi.find("img").attr("src");
                        var userName = luckLi.find("span").html();
                        var headPath = luckLi.data("headpath");
                        if ($("#luckUl").find("#level_" + luckLevel).length < 1) {
                            $("#luckUl").prepend("<div id=level_" + luckLevel + " class='level'></label><ul></ul></div>");
                        }
                        $("#level_" + luckLevel).find("ul").prepend('<li data-hasluck="0" data-headpath="' + headPath + '" data-isluck="' + isLuck + '" data-level="' + luckLevel + '"><span></span><a href="javascript:void(0)">x</a><img src="' + imgUl + '"><font>' + userName + '</font></li>');

                        $("#level_" + luckLevel + " li").each(function (index, element) {
                            $(this).find("span").html($("#level_" + luckLevel + " li").length - $(this).index());
                        });
                        // $("#level_" + luckLevel + " label a").text($("#level_" + luckLevel + " li").length);
                        $("#luckNumber").html($("#luckUl li").length);
                        if (luckNumberList > 1) {
                            luckNumberList--;
                            setTimeout(function () {
                                beginLuck();
                            }, 0);  //重新抽奖
                        } else {
                            $("#luck_number").val(selectNumber); //重新赋值给抽奖人数
                            $("#luckIng").css("display", "none");
                            $('#lottery .condition').removeClass('disabled');
                        }
                        showLuckAnimate(imgUl, showLevel, userName);
                    }
                }, 10);
            }
        }, 30);
    } else {
        setTimeout(function () {
            luckState = true;
            $('#lottery .condition').removeClass('disabled');
            $("#submitLottery").removeClass("gray");
            $("#removeLottery").removeClass("gray");
            isLuck = $("#luck_user li").data("userid");
            var imgUl = $("#luck_user li").find("img").attr("src");
            var userName = $("#luck_user li").find("span").html();
            var headPath = $("#luck_user li").data("headpath");
            if ($("#luckUl").find("#level_" + luckLevel).length < 1) {
                $("#luckUl").prepend("<div id=level_" + luckLevel + " class='level'><ul></ul></div>");
            }
            $("#level_" + luckLevel).find("ul").prepend('<li data-hasluck="0" data-headpath="' + headPath + '" data-isluck="' + isLuck + '" data-level="' + luckLevel + '"><span></span><a href="javascript:void(0)">x</a><img src="' + imgUl + '"><font>' + userName + '</font></li>');

            $("#level_" + luckLevel + " li").each(function (index, element) {
                $(this).find("span").html($("#level_" + luckLevel + " li").length - $(this).index());
            });
            $("#level_" + luckLevel + " label a").text($("#level_" + luckLevel + " li").length);
            $("#luckNumber").html($("#luckUl li").length);
            $("#luck_number").val(selectNumber); //重新赋值给抽奖人数
            $("#luckIng").css("display", "none");
            showLuckAnimate(imgUl, showLevel, userName);
        }, 100);
    }
}
//删除中奖
var deleteThis = function (v, luckLevel) {
    var li = v.parent();
    if (li.data("hasluck") != 1) {
        deleteLuckUser = deleteLuckUser + '<li data-userid="' + li.attr("data-isluck") + '"><img src="' + li.find("img").attr("src") + '"><br><span>' + li.find("font").html() + '</span></li>';
        $("[data-prizeid=" + luckLevel + "]").find("label").html($("[data-prizeid=" + luckLevel + "]").find("label").html() * 1 + 1);
        $("[data-prizeid=" + luckLevel + "]").attr('data-amount', $("[data-prizeid=" + luckLevel + "]").find("label").html() * 1);
        //添加到需要回到奖池的数组
        _parents = $(v).parents(".level");
        li.remove();
        _parents.find("li").each(function (index, element) {  //前面数字排序
            $(element).find("span").html(_parents.find("li").size() - $(element).index());
        });
        if (_parents.find("li").length == 0) { //如果本奖项下没人就清除标题
            _parents.remove();
        }
        _parents.find("label a").text(_parents.find("li").length); //更新人数
        $("#luckNumber").html($("#luckUl li").length);
    }
}

//重新抽奖
var removeLottery = function () {
    if (!$("#removeLottery").hasClass("gray")) {
        $("#removeLottery").addClass("gray");
        $("#submitLottery").addClass("gray");
        $("#luckUl li").each(function (index, element) {
            if ($(element).data("hasluck") != 1) {
                deleteLuckUser = deleteLuckUser + '<li data-userid="' + $(element).attr("data-isluck") + '"><img src="' + $(element).find("img").attr("src") + '"><br><span>' + $(element).find("font").html() + '</span></li>';
                $("[data-prizeid=" + $(element).data("level") + "]").find("label").html($("[data-prizeid=" + $(element).data("level") + "]").find("label").html() * 1 + 1);
                $("[data-prizeid=" + $(element).data("level") + "]").attr('data-amount', $("[data-prizeid=" + $(element).data("level") + "]").find("label").html() * 1);
                //添加到需要回到奖池的数组
                var _parents = $(element).parents(".level");
                $(element).remove();
                _parents.find("li").each(function (i, ele) {  //前面数字排序
                    $(ele).find("span").html(_parents.find("li").size() - $(ele).index());
                });
                if (_parents.find("li").length == 0) { //如果本奖项下没人就清除标题
                    _parents.remove();
                }
                _parents.find("label a").text(_parents.find("li").length); //更新人数
                $("#luckNumber").html($("#luckUl li").length);
            }
        });
        luckUserList();
    }
}

//显示抽奖动画
var showLuckAnimate = function (imgUl, showLevel, userName) {
    //fireWork.show();
    $('body').append('<div class="animate-bg"><div class="light"></div><img class="luckbg" src="images/luckbg.png" /><img src="' + imgUl + '" class="luckUserHead" /><div class="showLuckUserName">' + userName + '</div><div class="showLuckLevel">恭喜<span>' + userName + '</span> 获<span>' + luckLevel + '</span>！</div></div>');
    $(".luckbg").animate({
        "width": "800px",
        "height": "518px",
        "margin-top": "-330px",
        "margin-left": "-400px",
        "opacity": "1"
    }, "fast");
    $(".luckUserHead").animate({"margin-top": "-275px"});
    $(".showLuckLevel").animate({"margin-top": "40px"});
    $(".showLuckUserName").animate({"opacity": "1"});
    setTimeout(function () {
        // fireWork.hide();
        $(".animate-bg").animate({"opacity": "0"}, "slow", function () {
            $(".animate-bg").remove();
        });
        $("#bgsound").remove();
    }, 3000);
}
//提交中奖名单
var SubmitLotteryFans = function (v) {
    var submitCount = $("#luckUl li[data-hasluck!=1]").size();
    if (!$("#removeLottery").hasClass("gray") && submitCount > 0) {
        //loading("正在提交，请稍后...");
        var submitForm = $('<form/>');
        var submitId = [];
        $("#luckUl li[data-hasluck!=1]").each(function (index, element) {
            var isluck = $(element).data('isluck');
            submitForm.append('<input name="[' + index + '].AwardId" type="hidden" value="' + $(element).data('level') + '" />');
            submitForm.append('<input name="[' + index + '].FansId" type="hidden" value="' + isluck + '" />');
            submitForm.append('<input name="[' + index + '].FansNickName" type="hidden" value="' + $(element).find('font').text() + '" />');
            submitForm.append('<input name="[' + index + '].FansHead" type="hidden" value="' + $(element).data('headpath') + '" />');
            submitId.push(isluck);
        });
        submitId = JSON.stringify(submitId);

        var submitLottery = BaseUrl + "user/submitLottery";
        $.ajax({
            type: 'POST',
            url: submitLottery,
            contentType: 'application/json',
            data: submitId,
            success: function (data) {
                loaded("正在提交，请稍后...");
                if (data.message == "成功") {
                    showInfo("提交成功！", 1);
                    $("#removeLottery").addClass("gray");
                    $("#submitLottery").addClass("gray");
                    $("#luckUl li[data-hasluck!=1]").attr('data-hasluck', 1).append('<i class="hasSubmit">已提交</i>').find('a').remove();
                } else {
                    showInfo("提交失败！", 0);
                }
            }
        })
        getLottery();
    }
}


var stopBubble = function () {
    var e = typeof(event) == "undefined" ? arguments.callee.caller.arguments[0] : event;
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        window.event.cancelBubble = true;
    }
}
