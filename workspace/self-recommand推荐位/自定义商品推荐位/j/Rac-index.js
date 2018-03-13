JEND.define("JEND.Thrcommend",{
    RecommendModule:'event_xinxiangnianhuojie_0125',
    //遍历店铺Id
    storeId_Count:[],
    getRecommend:function(){
        var list={restype: 2001, moduleKeys: 'event_xinxiangnianhuojie_0125', hasInstock: 0, version: 2 },
        $.getJSON('http://search.' + JEND.server.uleUrl + '/api/recommend?jsoncallback=?', list, function (obj) {
            //获取出现最多的店铺
            for (var i = 0; i < obj[RecommendModule].length; i++)
            {
                storeId_Count.push(obj[RecommendModule][i].storeId);//给店铺数组附值
            }
            for (var i = 0; i < obj[RecommendModule].length; i++) {
                if (obj[RecommendModule][i].storeId == MaxStoreId(storeId_Count))//只显示最多店铺id
                {
                    $(".nzsd_scz_ul").append
                    (
                        '<li class="nzsd_scz_li">' +
                        ' <div class="nzsd_cp_img">' +
                        '<a href="' + obj["event_xinxiangnianhuojie_0125"][i].listingUrl + '" target="_blank" >' +
                        '<img src=" ' + obj["event_xinxiangnianhuojie_0125"][i].imgUrl + '" width="232" height="225" />' +
                        '</a>' +
                        ' </div>' +
                        '<p class="nzsd_cp_title">' +
                        '<a href="' + obj["event_xinxiangnianhuojie_0125"][i].listingUrl + '" target="_blank">' +
                        '<span>' + obj["event_xinxiangnianhuojie_0125"][i].listingName + '</span>' +
                        '</a>' +
                        '</p>' +
                        '<div class="nzsd_cp_maxPrice">' +
                        //' <span>￥</span>' +
                        // '<font>' + obj["event_xinxiangnianhuojie_0125"][i].maxPrice + '</font>' +
                        '</div>' +
                        '<div class="nzsd_cp_minPrice">' +
                        '<label>活动价</label>' +
                        '<span>￥</span>' +
                        '<font>' + obj["event_xinxiangnianhuojie_0125"][i].minPrice + '</font>' +
                        '</div>' +
                        '<div class="btns">' +
                        '<a class="btn" href="' + obj["event_xinxiangnianhuojie_0125"][i].listingUrl + '" target="_blank" title="立即购买" >立即购买</a>' +
                        '</div>' +
                        '<div style="position: relative;  margin-top: -50px; margin-left:150px;  "><input  listingId= ' + obj["event_xinxiangnianhuojie_0125"][i].listingId + ' onclick="checkAll(this)"   type="checkbox" name="abc" value="1" style="zoom:300%;" /></div>'
                    )
                }
            }
        });
    },
    MaxStoreId:function(arr)
    {
        var hash = {};
        var m = 0;
        var trueEl;
        var el;
        for (var i = 0, len = arr.length; i < len; i++)
        {
            el = arr[i];
            hash[el] === undefined ? hash[el] = 1 : (hash[el]++);
            if (hash[el] >= m) {
                m = hash[el];
                trueEl = el;
            }
        }
        return (trueEl);
    },
    checkAll:function(){
        //checkbox选中之后触发
    },
    checkboxnumber:function(checkboxname)
    {
        var checks = document.getElementsByName(checkboxname);
        var n = 0;//个数
        for (i = 0,ilen=checks.length; i < ilen; i++)
        {
            if (checks[i].checked)
            {
                n++;
                if (n >= 3) {
                    $("input:checkbox[name='" + checkboxname + "']").each(function () { // 遍历name=test的多选框
                        if (!$(this).is(":checked")) {
                            $(this).attr("disabled", true);
                        }
                    });
                    break;
                }
            }
        }
    },
    spgg:function(){
        $.ajax({
            type:"GET",
            url: "http://search.ule.com/api/getJsonItem?" + "listingId?" + listingId,
            data:{"listingId": listingId},
            dataType: "json",
            success: function (data) {
                alert(data);
            }

        });
    },
    init:function(){
        this.getRecommend();
    }
},function(){
    JEND.Thrcommend.init();
})




