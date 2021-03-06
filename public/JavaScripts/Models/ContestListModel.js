/**
 * Created by wungcq on 15/3/5.
 */
window.ContestListModel = function (ContestListData) {
    if (typeof this.modelData == "undefined" && typeof ContestListData != "undefined") {
        this.modelData = ContestListData;
        this.init(ContestListData);
    }
    this.loadTemplate();
    return this;
};

//ContestList 继承自数据模型类
ContestListModel.prototype = new Model();

//需要设置每个数据模型的增删改查路径和参数
(function () {
    //todo 伪造json数据
    ContestListModel.prototype.templatePath = Model.XHRPathHead() + '/templates/contestList.html';
    ContestListModel.prototype.groupRetrievePath = Model.XHRPathHead() + '/api/contest/list';
    ContestListModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/contest/list/global';
})();

ContestListModel.prototype.init = function (ContestListData) {
    this.modelData = {"content": ContestListData};
    //for(var key in ContestListData){
    //    this[key] = ContestListData[key];
    //}
};


//通过pageData获取分页信息
ContestListModel.prototype.RETRIEVE = function (pageData, group_id, callback) {
    var data = pageData;
    if (group_id) {
        data.group_id = group_id;
    } else {
        data.group_id = -1;
    }
    var url = data.group_id == -1 ? ContestListModel.prototype.RetrievePath : ContestListModel.prototype.groupRetrievePath;
    data.user_id = window.currentUser == undefined ? cookieMethods.getCookie("user_id") : window.currentUser.user_id;


    $.ajax(
        {
            url: url,
            data: data,
            type: ContestListModel.prototype.Retrievemethod,
            async: false,
            dataType: "json",
            beforeSend: function (request) {
                var session_id = cookieMethods.getCookie("token");
                var user_id = cookieMethods.getCookie("user_id");
                if (user_id != undefined) {
                    request.setRequestHeader("user-Id", user_id);
                }
                else {
                    request.setRequestHeader("user-Id", -1);
                }
                if (session_id != undefined) {
                    request.setRequestHeader("Session-Id", session_id);
                }
                else {
                    request.setRequestHeader("Session-Id", -1);
                }

            },
            success: function (Data) {
                if (Data.code == 1)//返回无误
                {
                    for (var i = 0; i < Data.content.length; i++) {
                        Data.content[i].start_time = new Date(Data.content[i].start_time).toLocaleTimeString();
                        Data.content[i].end_time = new Date(Data.content[i].end_time).toLocaleTimeString();
                    }
                    if (typeof callback == "function") {
                        contestListController.currentContestList = new ContestListModel(Data.content);
                        callback();
                    }
                    return true;
                }
                else {
                    topMessage({
                        Message: Data.message,
                        Type: 'fail'
                    });
                    return true;
                }
            },
            fail: function () {
                topMessage({
                    Message: '服务器连接异常，请检查网络或稍后重试',
                    Type: 'fail'
                });
            }
        }
    );

};