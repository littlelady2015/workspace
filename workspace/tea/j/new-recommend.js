//推荐位模块
var Rachel =
    {
        data: {restype: 2001, moduleKeys: 'event_yichang_01'},
        init: function () {
            this.substitute();
            this.getList();
        },
        apis: {
            recommendApi: "//search.ule.com/api/recommend?jsoncallback=?"
        },
        substitute: function (a) {
            return a && "object" == typeof a ? this.replace(/\{([^{}]+)\}/g, function (b, c) {
                var d = a[c];
                return void 0 !== d ? "" + d : ""
            }) : this.toString()
        },
        addImg: function () {
            var self = this;
            var newItem = document.createElement("div");
            newItem.setAttribute("class", "insertImg");
            //获取外层标签
            var itemNode = $(".item .r_wrapper")[0];
            itemNode.insertBefore(newItem, itemNode.firstChild);

        },
        getList: function () {
            var self = this;
            $.getJSON("//search.ule.com/api/recommend?jsoncallback=?", self.data, function (O) {
                    //数据列表
                    var itemData = O[self.data.moduleKeys];
                    console.log(itemData);
                    //获取模板 初始化
                    var itemHTml = '';
                    var html = $('#itemTpl').html();
                    for (var i = 0; i < itemData.length; i++) {
                        itemData[i].imgUrl = ~itemData[i].imgUrl.indexOf('http') ? itemData[i].imgUrl : 'http:' + itemData[i].imgUrl;
                        //载入数据  第一个推荐位
                        switch (i) {
                            case 0:
                                itemHTml += html.substitute(itemData[0]);
                                $('.item_1').append(itemHTml);
                                break;
                            case 1:
                                itemHTml = '';
                                for (var j = 1; j < 13; j++) {
                                    itemHTml += html.substitute(itemData[j]);
                                }
                                $('.item_2').append(itemHTml);
                                break;
                            default:
                                break;
                        }
                    }
                    //添加图片
                    self.addImg();
                }
            )
        },

        //载入样式
        //考虑懒加载图片
    }
$(function () {
    Rachel.init();
});