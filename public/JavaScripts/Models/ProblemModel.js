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
    var strVar = "";
    strVar += "<style>";
    strVar += "    #create-submission-section, #discussion-section{";
    strVar += "        display: block;";
    strVar += "        display: none;";
    strVar += "        width: 600px;";
    strVar += "";
    strVar += "    }";
    strVar += "    #create-submission-section td, #discussion-section td ,#create-submission-section tr, #discussion-section tr {";
    strVar += "        background-color: transparent;";
    strVar += "        border: none;";
    strVar += "    }";
    strVar += "    #create-submission-code {";
    strVar += "        width: 100%;";
    strVar += "        box-sizing: border-box;";
    strVar += "        background-color: #fff;";
    strVar += "        color: #555;";
    strVar += "        padding: 10px;";
    strVar += "        font-family: consolas,monospace;";
    strVar += "        font-size: 16px;";
    strVar += "        outline: none;";
    strVar += "        resize: vertical;";
    strVar += "    }";
    strVar += "    #create-submission-code:focus {";
    strVar += "        background: #333;";
    strVar += "        color: #fff;";
    strVar += "    }";
    strVar += "    #test-setting-table {";
    strVar += "        width: auto;";
    strVar += "    }";
    strVar += "    #test-setting-table tr>td:first-child {";
    strVar += "        text-align: right;";
    strVar += "        padding-right: 20px;";
    strVar += "    }";
    strVar += "    #test-setting-table tr>td:last-child {";
    strVar += "        text-align: left;";
    strVar += "        padding-left: 20px;";
    strVar += "        padding-right: 20px;";
    strVar += "        color: #16A085;";
    strVar += "    }";
    strVar += "    .underline-a {";
    strVar += "        color: #008080;";
    strVar += "        cursor: pointer;";
    strVar += "        transition: all ease .5s;";
    strVar += "    }";
    strVar += "    .underline-a:hover {";
    strVar += "        color: #16A085;";
    strVar += "        text-decoration: underline;";
    strVar += "    }";
    strVar += "<\/style>";
    strVar += "<article class=\"article-box markdown-body\">";
    strVar += "    <h2> ${problem.title}<\/h2>";
    strVar += "    <input type=\"hidden\" data-problem-id=\"{problem.id}\"/>";
    strVar += "    <span>编号: ${problem.id}<\/span>";
    strVar += "    <span>作者：<a class=\"underline-a\" href=\"/user/${problem.owner.owner_id}\">${problem.owner.owner_name}<\/a> <\/span>";
    strVar += "    <span>所属小组:<a class=\"underline-a\" href=\"/group/${problem.belong_group.group_id}\">${problem.belong_group.group_name}<\/a><\/span>";
    strVar += "    <time>最后编辑时间: ${problem.lastedit_time}<\/time>";
    strVar += "";
    strVar += "    <section class=\"markdown-body\">";
    strVar += "        $${problem.description}";
    strVar += "    <\/section>";
    strVar += "    <div style=\"margin: 10px auto\">";
    strVar += "        <table  id=\"test-setting-table\" class=\"styled-table\">";
    strVar += "            <thead>";
    strVar += "            <tr style=\"visibility: hidden\">";
    strVar += "                <th width=\"150\"><\/th>";
    strVar += "                <th ><\/th>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <th colspan=\"2\">";
    strVar += "                    测试参数";
    strVar += "                <\/th>";
    strVar += "            <\/tr>";
    strVar += "            <\/thead>";
    strVar += "            <tbody>";
    strVar += "            <tr>";
    strVar += "                <td>";
    strVar += "                    测试轮数";
    strVar += "                <\/td>";
    strVar += "                <td>";
    strVar += "                    ${problem.test_setting.test_round_count}";
    strVar += "                <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td>";
    strVar += "                    每轮权重";
    strVar += "                <\/td>";
    strVar += "                <td>";
    strVar += "                    {@each　problem.test_setting.round_weight as weight}";
    strVar += "                    <span>${weight},<\/span>";
    strVar += "                    {@/each}";
    strVar += "                <\/td>";
    strVar += "            <\/tr>";
    strVar += "";
    strVar += "            <tr>";
    strVar += "                <td>";
    strVar += "                    内存限制(KB)";
    strVar += "                <\/td>";
    strVar += "                <td>";
    strVar += "                    ${problem.test_setting.memory_limit}";
    strVar += "                <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td>";
    strVar += "                    总时间限制(ms)";
    strVar += "                <\/td>";
    strVar += "                <td>";
    strVar += "                    ${problem.test_setting.time_limit_global}";
    strVar += "                <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td>";
    strVar += "                    每轮时间限制";
    strVar += "                <\/td>";
    strVar += "                <td>";
    strVar += "                    {@each　problem.test_setting.time_limit_case as time}";
    strVar += "                    <span>${time},<\/span>";
    strVar += "                    {@/each}";
    strVar += "                <\/td>";
    strVar += "            <\/tr>";
    strVar += "";
    strVar += "            <\/tbody>";
    strVar += "";
    strVar += "        <\/table>";
    strVar += "    <\/div>";
    strVar += "    <a class=\"underline-a\" onclick=\"submissionController.showSubmissionEditor()\" style=\"margin-right: 30px\">编辑答案<\/a>";
    strVar += "    <a class=\"underline-a\" onclick=\"discussionController.showDiscussionList(${problem.id})\">查看讨论(${problem.discuss_count}条)<\/a>";
    strVar += "<\/article>";
    strVar += "<section id=\"create-submission-section\">";
    strVar += "    <table class=\"styled-table\" style=\"width: 600px;\">";
    strVar += "        <thead>";
    strVar += "            <tr style=\"visibility: hidden\">";
    strVar += "                <th width=\"200\"><\/th>";
    strVar += "                <th width=\"400\"><\/th>";
    strVar += "            <\/tr>";
    strVar += "        <\/thead>";
    strVar += "        <tbody>";
    strVar += "            <tr>";
    strVar += "                <td>";
    strVar += "                    选择语言";
    strVar += "                <\/td>";
    strVar += "                <td>";
    strVar += "                    <select name=\"select-language\" id=\"select-language\">";
    strVar += "                        {@each problem.test_setting.support_lang as lang}";
    strVar += "                        <option value=\"${lang}\">${lang}<\/option>";
    strVar += "                        {@/each}";
    strVar += "                    <\/select>";
    strVar += "                <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td colspan=\"2\">";
    strVar += "                    <textarea name=\"code\" id=\"create-submission-code\" cols=\"30\" rows=\"20\"><\/textarea>";
    strVar += "                <\/td>";
    strVar += "            <\/tr>";
    strVar += "        <\/tbody>";
    strVar += "    <\/table>";
    strVar += "    <a class=\"button submit\" onclick=\"submissionController.submit(${problem.id});\" style=\"margin-right: 20px;\">提交<\/a>";
    strVar += "    <a class=\"button cancel\" onclick=\"submissionController.showSubmissionEditor();\">取消<\/a>";
    strVar += "<\/section>";
    strVar += "<section id=\"discussion-section\">";
    strVar += "";
    strVar += "<\/section>";
    ProblemModel.prototype.template= strVar;
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
                    Type: 'success'
                });
            }else {
                topMessage({
                    Message: Data.message,
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