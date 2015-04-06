/**
 * Created by wungcq on 15/3/5.
 */
window.groupController = {};

groupController.scopeBlock = document.getElementById("group-section");
//加载题目页面内容
groupController.showGroup = function (group_id) {
    if (window.currentGroup == null) {
        window.currentGroup = new GroupModel();
    }

    window.currentGroup.loadTemplate();
    window.currentGroup.RETRIEVE(group_id, function () {
        var groupPageText = window.currentGroup.renderPage();
        $(groupController.scopeBlock).html(groupPageText);
        groupController.group_id = group_id;
        //初始化成员列表
        MembershipController.isMemberShow = false;
        MembershipController.isApplicationListShow = false;
        //绑定切换tab
        jRouter.parseAnchor(groupController.scopeBlock.getElementsByTagName("a"));
        groupController.bindNavTab();

        //加载成员列表
    });


};
groupController.bindNavTab = function () {
    $("#group-nav .nav-item").click(function () {
        var tab_id = this.getAttribute("data-click-target");


        if (tab_id == "group-member") {
            if (!document.getElementById("membership-table")) {
                MembershipController.showMembership(groupController.group_id);
            }
        } else if (tab_id == "group-problem") {

            groupProblemListController.showProblemList(1, groupController.group_id);

        } else if (tab_id == "group-contest") {

            groupContestListController.showContestList(1, groupController.group_id);

        }

        $("#group-nav .nav-item").attr("class", "nav-item");
        this.classList.add("active");

        $(".group-tab-page").attr("class", "group-tab-page");
        document.getElementById(tab_id).classList.add("active");
    });
};
groupController.submitGroupApplication = function (group_id) {
    var data = {};
    data["group_id"] = group_id;
    data["user_id"] = window.currentUser != undefined ? window.currentUser.user_id : cookieMethods.getCookie("user_id");
    data["nickname"] = window.currentUser != undefined ? window.currentUser.nickname : cookieMethods.getCookie("username");

    $.ajax(
        {
            url: GroupModel.prototype.joinPath,
            data: data,
            type: 'POST',
            async: true,
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
                    topMessage({
                        Message: '你的申请已经成功提交~耐心等候吧~',
                        Type: 'normal'
                    });
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