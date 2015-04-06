/**
 * Created by wungcq on 15/2/24.
 */
window.ProblemListModel = function (ProblemListData) {

    if (typeof ProblemListData != "undefined") {
        this.init(ProblemListData);
        this.modelData = ProblemListData;
    }
    this.loadTemplate();
    return this;
};

//ProblemList 继承自数据模型类
ProblemListModel.prototype = new Model();

//需要设置每个数据模型的增删改查路径和参数
(function () {
    ProblemListModel.prototype.templatePath = Model.XHRPathHead() + '/templates/problemlist.html';
    ProblemListModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/problem/list/global';
    ProblemListModel.prototype.groupRetrievePath = Model.XHRPathHead() + '/api/problem/list';
    ProblemListModel.prototype.template = '<table id="problem-list-table" class="styled-table" style="width:600px"><thead><tr><th width="10%">编号</th><th width="50%">名称</th><th width="15%">作者</th><th width="10%">提交数</th><th width="15%">通过数</th></tr></thead><tbody>{@each problem_list as problem}<tr><td>${problem.id}</td><td><a href="/problem/${problem.id}">${problem.title}</a></td><td><a href="/user/${problem.creater_id}">${problem.creater_name}</a></td><td><span>${problem.total_submit}</span></td><td><span>${problem.total_accepted}</span></td></tr>{@/each}</tbody></table>';
})();

ProblemListModel.prototype.init = function (ProblemListData) {
    this.modelData = ProblemListData;
    return ProblemListData;
};

//ProblemListModel.prototype.loadTemplate = function()
//{
//
//};

//通过pageData获取分页信息
ProblemListModel.prototype.RETRIEVE = function (pageData, group_id, callback) {
    var data = pageData;
    if (group_id) {
        data.group_id = group_id;
    } else {
        data.group_id = -1;
    }
    var url = data.group_id == -1 ? ProblemListModel.prototype.RetrievePath : ProblemListModel.prototype.groupRetrievePath;
    data.user_id = window.currentUser == undefined ? cookieMethods.getCookie("user_id") : window.currentUser.user_id;
    $.ajax(
        {
            url: url,
            data: data,
            type: ProblemListModel.prototype.Retrievemethod,
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
                    problemListController.currentProblemList = new ProblemListModel(Data);
                    if (typeof callback == "function") {

                        callback(Data);
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
