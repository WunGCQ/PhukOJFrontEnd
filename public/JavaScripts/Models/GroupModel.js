/**
 * Created by wungcq on 15/2/15.
 */
window.currentGroup = null;//全局对象，记录当前的题目
window.GroupModel = function (groupData) {
    if (groupData != null || typeof groupData != "undefined") {
        this.init(groupData);
    }
    //避免重复加载原型模板
    if (this.template == null || typeof this.template == "undefined") {
        this.loadTemplate();
    }

    return this;
};

GroupModel.prototype.template = '<style>#application-section,#membership-section{width:700px;text-align:center;margin:auto}</style><article data-id="${group.group_id}" data-name="${group.name}" data-contest_count="${group.group-contest_count}" data-problem_count="${group.problem_count}" data-member_count="${group.member_count}"><h2>${group.name}</h2><nav id="group-nav"><a class="nav-item active" data-click-target="group-info"><i class="fa fa-info-circle"></i> <span>小组信息</span></a> <a class="nav-item" data-click-target="group-member"><i class="fa fa-users"></i> <span>小组成员</span></a> <a class="nav-item" data-click-target="group-problem"><i class="fa fa-lightbulb-o"></i> <span>小组题目</span></a> <a class="nav-item" data-click-target="group-contest"><i class="fa fa-flag-checkered"></i> <span>小组比赛</span></a></nav><div class="group-tab-page active" id="group-info"><section><table class="styled-table" style="width:600px"><thead style="visibility:hidden"><th width="300"></th><th width="300"></th></thead><tbody><tr><td>创建者</td><td><a href="/user/${group.creater.user_id}">${group.creater.username}</a></td></tr><tr><td>所有者</td><td><a href="/user/${group.owner.user_id}">${group.owner.username}</a></td></tr><tr><td>创建时间</td><td><time>${group.create_time}</time></td></tr><tr><td>比赛场次</td><td>${group.contest_count}</td></tr><tr><td>出题数</td><td>${group.problem_count}</td></tr><tr><td>成员数</td><td><span class="group_member">${group.member_count}</span></td></tr></tbody></table></section></div><div class="group-tab-page" id="group-member"><section id="membership-section"><span id="load-membership" onclick="MembershipController.showMembership(${group.group_id})">+ 显示小组成员列表</span></section>{@if group.auth.madmin == "1" }<section id="application-section"><span id="load-application" onclick="MembershipController.showApplicationList(${group.group_id})">+ 显示申请列表</span></section>{@/if}</div><div class="group-tab-page" id="group-problem"><div>{@if group.auth.pcreate == "1" } <a class="button buttonToParse" href="/createProblem/${group.group_id}" style="width:150px;font-size:16px">创建题目</a> {@/if}</div></div><div class="group-tab-page" id="group-contest"><div>{@if group.auth.ccreate == "1" } <a class="button buttonToParse" href="/createContest/${group.group_id}" style="width:150px;font-size:16px">创建比赛</a> {@/if}</div></div></article>';

//Group 继承自数据模型类
GroupModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function () {
    GroupModel.prototype.templatePath = Model.XHRPathHead() + '/templates/group.html';
    GroupModel.prototype.AddPath = Model.XHRPathHead() + '/api/group/create';
    GroupModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/group/info';
    //GroupModel.prototype.UpdatePath   = Model.XHRPathHead() + '/api/group/update';
    GroupModel.prototype.joinPath = Model.XHRPathHead() + '/api/group/membership/apply';
    GroupModel.prototype.GroupDataCache = new Array();//题目的缓存,缓存的是对象的json Data,省去向服务器查询
})();

//
GroupModel.prototype.init = function (groupData) {
    this.modelData = {'group': groupData};
    for (var key in groupData) {
        this[key] = groupData[key];
    }
};

GroupModel.getGroupDataCache = function (id) {
    if (GroupModel.prototype.GroupDataCache.length > 0) {
        for (var i = 0; i < GroupModel.prototype.GroupDataCache.length; i++) {
            if (GroupModel.prototype.GroupDataCache[i].group_id = id) {
                return GroupModel.prototype.GroupDataCache[i];
            }
        }
    }
    return false;
};
GroupModel.pushGroupDataCache = function (data) {
    GroupModel.prototype.GroupDataCache.push(data);
    return;
};


//通过id获取题目信息
//todo 想清楚应不应该放在原型中，是否需要实例去调用？
GroupModel.prototype.RETRIEVE = function (group_id, callback) {
    if (typeof group_id == 'undefined') {
        var data = null;
    } else {
        var data = {'group_id': group_id};
        var user_id = window.currentUser == undefined? cookieMethods.getCookie("user_id"):window.currentUser.user_id;
        if(user_id!=undefined) {
            data["user_id"] = user_id;
        }
        else {
            data["user_id"] = -1;
        }

    }
    var groupData = GroupModel.getGroupDataCache(group_id);//从缓存的题目数据中获取
    if (groupData != false) { //存在于缓存中，说明之前取过。
        //当前题目对象不存在的情况
        if (window.currentGroup == null || typeof window.currentGroup == "undefined") {
            window.currentGroup = new GroupModel(groupData);
        }
        else {
            //如果当亲题目就是这个题目
            if (window.currentGroup.id = group_id) {
                //什么都不做
            }
            else {
                //如果不是
                window.currentGroup.init(groupData);
            }
        }
        if (typeof callback == "function") {
            callback();
        }
    }
    else {
        $.ajax(
            {
                url: GroupModel.prototype.RetrievePath,
                data: data,
                type: GroupModel.prototype.Retrievemethod,
                async: false,
                dataType: "json",
                beforeSend: function(request) {
                    var session_id = cookieMethods.getCookie("token");
                    var user_id = cookieMethods.getCookie("user_id");
                    if(user_id!=undefined) {
                        request.setRequestHeader("user-Id",user_id);
                    }
                    else {
                        request.setRequestHeader("user-Id",-1);
                    }
                    if(session_id!=undefined) {
                        request.setRequestHeader("Session-Id",session_id);
                    }
                    else {
                        request.setRequestHeader("Session-Id",-1);
                    }

                },
                success: function (Data) {
                    if (Data.code == 1)//返回无误
                    {
                        var t = Data.create_time;
                        var d = new Date(t).toLocaleString();
                        Data.create_time = d;
                        Data["group_id"] = group_id;
                        if (window.currentGroup == null || typeof window.currentGroup == "undefined") {
                            window.currentGroup = new GroupModel(Data);
                        }
                        else {
                            window.currentGroup.init(Data);
                        }
                        //GroupModel.pushGroupDataCache(Data);
                        if (typeof callback == "function") {
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
    }

};

GroupModel.prototype.ADD = function (data, callback) {
    if (typeof data == 'undefined') {
        var data = null;
    } else {
        var data = data;
        data["creater_id"] = window.currentUser.user_id || -1;
    }
    if(1) {
        $.ajax(
            {
                url: GroupModel.prototype.AddPath,
                data: data,
                type: GroupModel.prototype.Retrievemethod,
                async: false,
                dataType: "json",
                beforeSend: function(request) {
                    var session_id = cookieMethods.getCookie("token");
                    var user_id = cookieMethods.getCookie("user_id");
                    if(user_id!=undefined) {
                        request.setRequestHeader("user-Id",user_id);
                    }
                    else {
                        request.setRequestHeader("user-Id",-1);
                    }
                    if(session_id!=undefined) {
                        request.setRequestHeader("Session-Id",session_id);
                    }
                    else {
                        request.setRequestHeader("Session-Id",-1);
                    }

                },
                success: function (Data) {
                    if (Data.code == 1)//返回无误
                    {
                        topMessage({
                            Message: '创建成功',
                            Type: 'success'
                        });
                        if (typeof callback == "function") {
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
    }

};

