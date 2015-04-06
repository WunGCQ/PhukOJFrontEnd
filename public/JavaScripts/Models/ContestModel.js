/**
 * Created by wungcq on 15/3/5.
 */

window.currentContest = null;//全局对象，记录当前的题目
window.ContestModel = function (contestData) {
    if (contestData != null || typeof contestData != "undefined") {
        this.init(contestData);
    }
    //避免重复加载原型模板
    if (this.template == null || typeof this.template == "undefined") {
        this.loadTemplate();
    }

    return this;
};


//Contest 继承自数据模型类
ContestModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function () {
    ContestModel.prototype.templatePath = Model.XHRPathHead() + '/templates/contest.html';
    ContestModel.prototype.AddPath = Model.XHRPathHead() + '/api/contest/create';
    ContestModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/contest/get';
    ContestModel.prototype.UpdatePath = Model.XHRPathHead() + '/api/contest/update';
    ContestModel.prototype.ContestDataCache = [];//题目的缓存,缓存的是对象的json Data,省去向服务器查询
})();

//
ContestModel.prototype.init = function (contestData) {
    this.modelData = {'contest': contestData};
    for (var key in contestData) {
        this[key] = contestData[key];
    }
};

ContestModel.getContestDataCache = function (id) {
    for (var i = 0; i < ContestModel.prototype.ContestDataCache.length; i++) {
        if (ContestModel.prototype.ContestDataCache[i].id = id) {
            return ContestModel.prototype.ContestDataCache[i];
        }
    }
    return false;
};
ContestModel.pushContestDataCache = function (data) {
    ContestModel.prototype.ContestDataCache.push(data);
    return;
};


//通过id获取题目信息
//todo 想清楚应不应该放在原型中，是否需要实例去调用？
ContestModel.prototype.RETRIEVE = function (id, callback) {
    if (typeof id == 'undefined') {
        var data = null;
    } else {
        var data = {'id': id};
    }
    var contestData = ContestModel.getContestDataCache(id);//从缓存的题目数据中获取
    if (contestData != false) { //存在于缓存中，说明之前取过。
        //当前题目对象不存在的情况
        if (window.currentContest == null || typeof window.currentContest == "undefined") {
            window.currentContest = new ContestModel(contestData);
        }
        else {
            //如果当亲题目就是这个题目
            if (window.currentContest.id = id) {
                //什么都不做
            }
            else {
                //如果不是
                window.currentContest.init(contestData);
            }
        }
        if (typeof callback == "function") {
            callback();
        }

    }
    else {
        $.ajax(
            {
                url: ContestModel.prototype.RetrievePath,
                data: data,
                type: ContestModel.prototype.Retrievemethod,
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
                        if (window.currentContest == null || typeof window.currentContest == "undefined") {
                            window.currentContest = new ContestModel(Data.contest);
                        }
                        else {
                            window.currentContest.init(Data.contest);
                        }
                        ContestModel.pushContestDataCache(Data.contest);
                        if (typeof callback == "function") {
                            callback();
                        }
                        return true;
                    }
                    else {
                        topMessage({
                            Message: Data.error,
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