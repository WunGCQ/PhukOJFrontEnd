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


//Group 继承自数据模型类
GroupModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function () {
    GroupModel.prototype.templatePath = Model.XHRPathHead() + '/templates/group.html';
    GroupModel.prototype.AddPath = Model.XHRPathHead() + '/api/group/create';
    GroupModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/group/info';
    //GroupModel.prototype.UpdatePath   = Model.XHRPathHead() + '/api/group/update';
    GroupModel.prototype.joinPath = Model.XHRPathHead() + '/api/group/membership/transfer';
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
            if (GroupModel.prototype.GroupDataCache[i].id = id) {
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
GroupModel.prototype.RETRIEVE = function (id, callback) {
    if (typeof id == 'undefined') {
        var data = null;
    } else {
        var data = {'id': id};
    }
    var groupData = GroupModel.getGroupDataCache(id);//从缓存的题目数据中获取
    if (groupData != false) { //存在于缓存中，说明之前取过。
        //当前题目对象不存在的情况
        if (window.currentGroup == null || typeof window.currentGroup == "undefined") {
            window.currentGroup = new GroupModel(groupData);
        }
        else {
            //如果当亲题目就是这个题目
            if (window.currentGroup.id = id) {
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
                        if (window.currentGroup == null || typeof window.currentGroup == "undefined") {
                            window.currentGroup = new GroupModel(Data.group);
                        }
                        else {
                            window.currentGroup.init(Data.group);
                        }
                        GroupModel.pushGroupDataCache(Data.group);
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

