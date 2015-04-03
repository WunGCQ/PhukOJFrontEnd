/**
 * Created by wungcq on 15/2/15.
 */
window.currentProblem = null;//全局对象，记录当前的题目
window.ProblemModel = function (problemData) {
    if (typeof problemData != "undefined") {
        this.init(problemData);
    }
    //避免重复加载原型模板
    if (this.template == null || typeof this.template == "undefined") {
        this.loadTemplate();
    }

    return this;
};


//Problem 继承自数据模型类
ProblemModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function () {
    ProblemModel.prototype.templatePath = Model.XHRPathHead() + '/templates/contestProblemList.html';
    ProblemModel.prototype.AddPath = Model.XHRPathHead() + '/api/problem/create';
    ProblemModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/problem/info';
    ProblemModel.prototype.UpdatePath = Model.XHRPathHead() + '/api/problem/update';
    ProblemModel.prototype.ProblemDataCache = new Array();//题目的缓存,缓存的是对象的json Data,省去向服务器查询
    ProblemModel.prototype.template= '<article><h2>${problem.title}</h2><input type="hidden" data-problem-id="{problem.id}"> <span>编号: ${problem.id}</span> <span>作者编号：${problem.creator_id}</span> <span>所属小组:<a href="/group/${problem.belong_group.group_id}">${problem.belong_group.group_name}</a></span> <time>最后编辑时间: ${problem.lastedit_time}</time><div class="test_setting"><p><span>时间限制: ${problem.test_setting.time_limit}</span> <span>测试轮数: ${problem.test_setting.round}</span></p></div><section class="markdown-body">$${problem.description}</section></article><a class="button">提交答案</a> <a class="button">查看讨论</a>';
})();

//
ProblemModel.prototype.init = function (problemData) {
    this.modelData = {'problem':problemData};
    for (var key in problemData) {
        this[key] = problemData[key];
    }
};

ProblemModel.getProblemDataCache = function (id) {
    if (ProblemModel.prototype.ProblemDataCache.length > 0) {
        for (var i = 0; i < ProblemModel.prototype.ProblemDataCache.length; i++) {
            if (ProblemModel.prototype.ProblemDataCache[i].id = id) {
                return ProblemModel.prototype.ProblemDataCache[i];
            }
        }
    }
    return false;
};
ProblemModel.pushProblemDataCache = function (data) {
    ProblemModel.prototype.ProblemDataCache.push(data);
    return;
};


//通过id获取题目信息
//todo 想清楚应不应该放在原型中，是否需要实例去调用？
ProblemModel.prototype.RETRIEVE = function (id, callback) {
    if (typeof id == 'undefined') {
        var data = null;
    } else {
        var data = {'problem_id': id};
    }
    var user_id = cookieMethods.getCookie("user_id") || -1;
    data.user_id = user_id;
    var problemData = ProblemModel.getProblemDataCache(id);//从缓存的题目数据中获取
    if (problemData != false) { //存在于缓存中，说明之前取过。
        //当前题目对象不存在的情况
        if (window.currentProblem == null || typeof window.currentProblem == "undefined") {
            window.currentProblem = new ProblemModel(problemData);
        }
        else {
            //如果当亲题目就是这个题目
            if (window.currentProblem.id = id) {
                //什么都不做
            }
            else {
                //如果不是
                window.currentProblem.init(problemData);
            }
        }
        if (typeof callback == "function") {
            callback();
        }

    }
    else {
        $.ajax(
            {
                url: ProblemModel.prototype.RetrievePath,
                data: data,
                type: ProblemModel.prototype.Retrievemethod,
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
                        ProblemModel.pushProblemDataCache(Data);
                        Data.description = marked(Data.description);
                        Data.create_time = new Date(Data.create_time).toLocaleTimeString();
                        Data.lastedit_time = new Date(Data.lastedit_time).toLocaleTimeString();
                        if (window.currentProblem == null || typeof window.currentProblem == "undefined") {
                            window.currentProblem = new ProblemModel(Data);
                        }
                        else {
                            window.currentProblem.init(Data);
                        }

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

ProblemModel.prototype.ADD = function(data, callback) {
    data.append('belong_group',this.group_id);

    var xhr = new XMLHttpRequest();
    xhr.open('post',this.AddPath,false);
    var session_id = cookieMethods.getCookie("token") || -1;
    xhr.setRequestHeader("Session-Id",session_id);
    var user_id = window.currentUser==undefined?cookieMethods.getCookie("user_id"):window.currentUser.user_id;
    data.append('user_id',user_id);
    xhr.setRequestHeader("User-Id",user_id);


    xhr.onreadystatechange = callback;
    function callback(){
        if( xhr.readyState == 4 && xhr.status == 200){
            var Data = JSON.parse(xhr.responseText);
            if(Data.code == 1){
                topMessage({
                    Message: '创建成功',
                    Type: 'fail'
                });
            }else {
                topMessage({
                    Message: Data.Message,
                    Type: 'fail'
                });
            }

        }else if(xhr.status == 413){
            topMessage({
                Message: '上传文件过大，请重试',
                Type: 'fail'
            });
        }else {

        }
    }
    //xhr.onloadstart = function(){
    //    window.progressing.init();
    //};
    //xhr.onprogress = function(event){
    //    progressing.percent(parseInt(100*event.position/event.totalSize));
    //};
    xhr.send(data);
};