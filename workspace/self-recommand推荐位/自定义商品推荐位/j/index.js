//商品推荐位置Janpro_moduleB_21
var d1 = { restype: 2001, moduleKeys: 'Janpro_moduleB_21', hasInstock: 0, version: 2 } //Janpro_moduleB_21 np_fupin_goodlist_004
$.getJSON('http://search.' + JEND.server.uleUrl + '/api/recommend?jsoncallback=?', d1, function (obj) {
    //获取出现最多的店铺
    for (var i = 0; i < obj["Janpro_moduleB_21"].length; i++)
    {
        storeId_Count.push(obj["Janpro_moduleB_21"][i].storeId);//给店铺数组附值
    }
    for (var i = 0; i < obj["Janpro_moduleB_21"].length; i++) {
        if (obj["Janpro_moduleB_21"][i].storeId == MaxStoreId(storeId_Count))//只显示最多店铺id
        {
            $(".nzsd_scz_ul").append
             (
             '<li class="nzsd_scz_li">' +
                  ' <div class="nzsd_cp_img">' +
                      '<a href="' + obj["Janpro_moduleB_21"][i].listingUrl + '" target="_blank" >' +
                            '<img src=" ' + obj["Janpro_moduleB_21"][i].imgUrl + '" width="232" height="225" />' +
                             '</a>' +
                       ' </div>' +
                    '<p class="nzsd_cp_title">' +
                        '<a href="' + obj["Janpro_moduleB_21"][i].listingUrl + '" target="_blank">' +
                            '<span>' + obj["Janpro_moduleB_21"][i].listingName + '</span>' +
                        '</a>' +
                    '</p>' +
                   '<div class="nzsd_cp_maxPrice">' +
                       //' <span>￥</span>' +
                       // '<font>' + obj["Janpro_moduleB_21"][i].maxPrice + '</font>' +
                    '</div>' +
                    '<div class="nzsd_cp_minPrice">' +
                        '<label>活动价</label>' +
                        '<span>￥</span>' +
                        '<font>' + obj["Janpro_moduleB_21"][i].minPrice + '</font>' +
                    '</div>' +
                    '<div class="btns">' +
                        '<a class="btn" href="' + obj["1212sanchongli"][i].listingUrl + '" target="_blank" title="立即购买" >立即购买</a>' +
                  '</div>' +
                     '<div style="position: relative;  margin-top: -50px; margin-left:150px;  "><input  listingId= ' + obj["1212sanchongli"][i].listingId + ' onclick="checkAll(this)"   type="checkbox" name="abc" value="1" style="zoom:300%;" /></div>'
          )
        }
    }
});

//http://search.ule.com/api/getJsonItem?listingId=2986453

//过滤相同店铺
var storeId_Count = []; //遍历字符串
function MaxStoreId(arr)//最多店铺id
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
}
//checkbox选中之后触发 
function checkAll(checkbox)
{
    var listingId = $(checkbox).attr("listingId");//商品编号
    var checkbox_name = checkbox.name;//选中3个后禁用

    if (checkbox.checked == true)
    {
        //商品规格弹框
        checkboxnumber(checkbox_name);//选中3个后禁用
        spgg(listingId);//传入listingId购物规格弹出框

    } else {
        //移除checkbox至灰
        $("input:checkbox[name='" + checkbox_name + "']").each(function () { // 遍历name=test的多选框
            if (!$(this).is(":checked"))
            {
                $(this).attr("disabled", false);
            }
        });
    }
}
//选中3个后禁用
function checkboxnumber(checkboxname)
{
    var checks = document.getElementsByName(checkboxname);
    var n = 0;//个数
    for (i = 0; i < checks.length; i++)
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
}
//购物规格弹出框
function spgg(listingId)
{
    $.ajax({
        type:"GET",
        url: "http://search.ule.com/api/getJsonItem?" + "listingId?" + listingId,
        data:{"listingId": listingId},
        dataType: "json",
        success: function (data) {
            alert(data);
        }

    });
}

