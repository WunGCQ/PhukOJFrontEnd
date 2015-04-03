/**
 * Created by wcq on 15-3-26.
 */
var createProblemController = function(group_id) {
    this.group_id = group_id;
    return this;
};


(function() {

    createProblemController.prototype = new ProblemModel();
    createProblemController.prototype.scope = document.getElementById("create-problem-section");
    createProblemController.prototype.templatePath = Model.XHRPathHead() + '/templates/newProblem.html';
    createProblemController.prototype.template = "<style>#create-problem-table tbody td{border:1px solid #ccc;text-align:center}#create-problem-table tr{background:transparent!important}#problem-description{width:100%;height:300px;outline:0;resize:vertical}#problem-description:focus{border:1px solid #16a085;box-shadow:0 0 6px 1px rgba(27,212,179,.1)}#problem-preview{width:100%;box-sizing:border-box;padding:10px;text-align:left}<\/style><form id=\"create-problem-form\"><table id=\"create-problem-table\" class=\"styled-table\" style=\"width:800px\"><thead><tr><th colspan=\"2\"><h2>创建题目<\/h2><\/th><\/tr><tr style=\"display:none\"><th width=\"400\"><\/th><th width=\"400\"><\/th><\/tr><\/thead><tbody><tr><td colspan=\"2\"><input type=\"text\" name=\"title\" class=\"\" placeholder=\"题目标题\" required><\/td><\/tr><tr><td>是否公开<\/td><td><select name=\"access_level\"><option value=\"0\" selected>不公开<\/option><option value=\"1\">小组内部可见<\/option><option value=\"2\">公开<\/option><\/select><\/td><\/tr><tr><td><textarea id=\"problem-description\" name=\"description\" class=\"\" placeholder=\"题目描述\" required><\/textarea><\/td><td style=\"vertical-align:top\"><div id=\"problem-preview\" class=\"markdown-body\"><\/div><\/td><\/tr><tr><td>文件版本<\/td><td><input type=\"text\" name=\"files_version\" placeholder=\"文件版本\"><\/td><\/tr><tr><td>支持语言<\/td><td><label><input type=\"checkbox\" name=\"support_lang\" placeholder=\"支持语言\" value=\"C\"> C<\/label><label><input type=\"checkbox\" name=\"support_lang\" placeholder=\"支持语言\" value=\"CPP\"> C++<\/label><label><input type=\"checkbox\" name=\"support_lang\" placeholder=\"支持语言\" value=\"JAVA\"> JAVA<\/label><\/td><\/tr><tr><td>内存限制<\/td><td><input type=\"text\" name=\"memory_limit\" placeholder=\"内存限制\"><\/td><\/tr><tr><td>总时间限制<\/td><td><input type=\"text\" name=\"time_limit_global\" placeholder=\"总时间限制\"><\/td><\/tr><tr><td>每轮时间限制<\/td><td><input type=\"text\" name=\"time_limit_case\" placeholder=\"每轮时间限制\"><\/td><\/tr><tr><td>标准输入文件 <a class=\"button\" onclick=\"addFileInputs(&quot;input-file-scope&quot;,&quot;standard_input_files&quot;)\">添加文件<\/a><script>function addFileInputs(e,t){var n=(new Date).getTime();$(\"#\"+e).append('<input type=\"file\" name=\"'+t+n+'\" style=\"width:240px\"/>')}<\/script><\/td><td id=\"input-file-scope\" style=\"width:300px!important\"><input type=\"file\" name=\"standard_input_files\" placeholder=\"标准输入文件\" style=\"width:240px\"><\/td><\/tr><tr><td style=\"width:300px!important\">标准输出文件 <a class=\"button\" onclick=\"addFileInputs(&quot;output-file-scope&quot;,&quot;standard_output_files&quot;)\">添加文件<\/a><\/td><td id=\"output-file-scope\"><input type=\"file\" name=\"standard_output_files\" placeholder=\"标准输出文件\" style=\"width:240px\"><\/td><\/tr><tr><td>每轮权重<\/td><td><input type=\"text\" name=\"round_weight\" placeholder=\"每轮权重\"><\/td><\/tr><tr><td>通过条件<\/td><td><input type=\"text\" name=\"compare_ac_level\" placeholder=\"通过条件\"><\/td><\/tr><tr><td>大小写错误敏感<\/td><td><input type=\"text\" name=\"compare_pre_case_insensitive\" placeholder=\"大小写错误敏感\"><\/td><\/tr><tr><td>特殊检测<\/td><td><input type=\"text\" name=\"compare_special\" placeholder=\"特殊检测\"><\/td><\/tr><tr><td colspan=\"2\" style=\"text-align:center\"><a class=\"button submit\" style=\"margin-right: 50px;\">提交<\/a> <a class=\"button back\" onclick=\"history.back()\">返回<\/a><\/td><\/tr><\/tbody><\/table><\/form>";
})();



createProblemController.prototype.showPage = function() {
    var scope = this.scope;
    var groupListPageParam = jRouter.getUrlParam(window.location.href).params[1] - 0;
    this.group_id = groupListPageParam;
    var text = this.loadTemplate();
    $(scope).html(text);
    scope._css('display', 'block');
    var AnchorsToBind = scope.getElementsByTagName("a");
    jRouter.parseAnchor(AnchorsToBind);
    this.divBlock = document.getElementById("create-problem-section");
    this.submitButton = this.divBlock.getElementsByClassName('submit')[0];
    this.submitButton.addEventListener('click', function() {
        createProblemControllerEntity.createProblem();
    });
    this.bindTextAreaListener();

};
createProblemController.prototype.bindTextAreaListener = function() {
    var textarea = document.getElementById('problem-description');
    $(textarea).each(function() {
        $(this).keydown(function(eve) {
            if (eve.target != this)
                return;
            if (eve.keyCode == 13)
                last_blanks = getCurrentLineBlanks(this);
            else if (eve.keyCode == 9) {
                eve.preventDefault();
                insertAtCursor(this, "  ");
                this.returnValue = false;
            }
        }).keyup(function(eve) {
            if (eve.target == this && eve.keyCode == 13) {
            }
            var text = textarea.value;
            var previewText = marked(text);
            $("#problem-preview").html('<p>预览</p>' + previewText);

        });
    });
};

function insertAtCursor(obj, txt) {
    obj.focus();
    //IE support
    if (document.selection) {
        sel = document.selection.createRange();
        sel.text = txt;
    }
    //MOZILLA/NETSCAPE support
    else {
        var startPos = obj.selectionStart;
        var scrollTop = obj.scrollTop;
        var endPos = obj.selectionEnd;
        obj.value = obj.value.substring(0, startPos) + txt + obj.value.substring(endPos, obj.value.length);
        startPos += txt.length;
        obj.setSelectionRange(startPos, startPos);
        obj.scrollTop = scrollTop;
    }
}
function getCaretPos(ctrl) {
    var caretPos = 0;
    if (document.selection) {
        // IE Support
        var range = document.selection.createRange();
        // We'll use this as a 'dummy'
        var stored_range = range.duplicate();
        // Select all text
        stored_range.moveToElementText(ctrl);
        // Now move 'dummy' end point to end point of original range
        stored_range.setEndPoint('EndToEnd', range);
        // Now we can calculate start and end points
        ctrl.selectionStart = stored_range.text.length - range.text.length;
        ctrl.selectionEnd = ctrl.selectionStart + range.text.length;
        caretPos = ctrl.selectionStart;
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0')
    // Firefox support
        caretPos = ctrl.selectionStart;
    return (caretPos);
}

function getCurrentLineBlanks(obj) {
    var pos = getCaretPos(obj);
    var str = obj.value;
    var i = pos - 1;
    while (i >= 0) {
        if (str.charAt(i) == '\n')
            break;
        i--;
    }
    i++;
    var blanks = "";
    while (i < str.length) {
        var c = str.charAt(i);
        if (c == ' ' || c == '\t')
            blanks += c;
        else
            break;
        i++;
    }
    return blanks;
}
function setCursorPos(inputObj, pos) {

    if (navigator.userAgent.indexOf("MSIE") > -1) {
        var range = document.selection.createRange();
        var textRange = inpObj.createTextRange();
        textRange.moveStart('character', pos);
        textRange.collapse();
        textRange.select();
    } else {
        inputObj.setSelectionRange(n, n);
    }
}
function getCursorPos(inputObj) {
    if (navigator.userAgent.indexOf("MSIE") > -1) { // IE
        var range = document.selection.createRange();
        range.text = '';
        range.setEndPoint('StartToStart', inpObj.createTextRange());
        return range.text.length;
    } else {
        return inputObj.selectionStart;
    }
}

createProblemController.prototype.createProblem = function() {
    if (this.checkData()) {
        var data = this.getSendFormData();
        if (window.currentProblem == undefined || window.currentProblem == null) {
            window.currentProblem = new ProblemModel();
        }

        this.ADD(data);
    }
};

createProblemController.prototype.getSendFormData = function() {
    var fd = new FormData();
    var f = this.getForm().getElementsByTagName('input');
    for (var i = 0; i < f.length; i++) {
        if (f[i]) {
            if (f[i].getAttribute("type") == 'file') {
                var temp = this.getFilesArray(this.getForm().id, f[i].name);
                fd.append(f[i].name, f[i].files);
            } else if (f[i].getAttribute("type") == 'checkbox') {
                var lang_arr = [];
                for (var x = 0; x < f[i].length; x++) {
                    if (f[i][x].checked) {
                        lang_arr.push(f[i][x].value);
                    }
                }
                fd.append(f[i].name, lang_arr);
            }
            else {
                if (f[i].value.length == 0) {
                    topMessage({
                        Message: f[i].getAttribute("placeholder") + "字段不能为空!",
                        Type: "warning"
                    });

                }
                //fd.append(f[i].name, f[i].value);
            }
        }

    }
    var t = this.getForm().getElementsByTagName('textarea');
    fd.append(t[0].name, t[0].value);
    fd.append("access_level", this.getForm().getElementsByTagName('select')[0].value);
    //return fd;
    var fd2 = new FormData(this.getForm());
    return fd2;

};

createProblemController.prototype.getFilesArray = function(formId, name) {
    var arr = [];
    for (var i = 0; i < $('#' + formId).get(0)[name].files.length; i++) {
        arr.push($('#' + formId).get(0)[name].files[i]);
    }
    return arr;
};





createProblemController.prototype.getInput = function(name) {
    if (this.divBlock.querySelectorAll('input[name="' + name + '"]')) {
        return this.divBlock.querySelectorAll('input[name="' + name + '"]')[0];
    }
    else {
        return false;
    }

};

createProblemController.prototype.getForm = function() {
    return $(this.divBlock).children('form').get(0);
};
createProblemController.prototype.getFormData = function() {
    this.problemData = {};
    this.form = document.querySelectorAll("#create-problem-section form")[0];
    for (var i = 0; i < this.form.length; i++) {
        if (i == this.form.length - 1) {

            this.problemData[this.form[i].name] = this.form[i].value;

        } else {

            this.problemData[this.form[i].name] = {"value": this.form[i].value,"placeholder": this.form[i].getAttribute("placeholder")};

        }
    }
    return this.problemData;
};

//设置表单样式
createProblemController.prototype.setInputError = function(name) {
    //已经有的话先去掉，这样可以保证有shake动效触发
    if (this.getInput(name)) {
        this.getInput(name).classList.remove('error-input');
        this.getInput(name).classList.add('error-input');
    }


};

createProblemController.prototype.removeInputError = function(name) {
    if (this.getInput(name)) {
        this.getInput(name).classList.remove('error-input');
        this.getInput(name).classList.remove('shake');
    }

};



//检查数据合法与否（不是内容的正确性而是格式的合理性）
createProblemController.prototype.checkData = function() {
    //每次检查前都要重新获取一次数据
    this.getFormData();
    var isDataLegal = true;
    for (var i in this.problemData) {
        var placeholder = this.problemData[i].placeholder;
        console.log(this.problemData[i]);
        if (this.problemData[i].hasOwnProperty("value")) {
            if (this.problemData[i].value.length == 0) {
                topMessage(
                    {
                        Message: '您输入的' + placeholder + '为空，请验证后重新输入',
                        Type: 'warning'
                    });
                this.setInputError(i);
                isDataLegal = false;
            } else {
                this.removeInputError(i);
            }
        }

    }

    //var des = this.problemData.description;
    //this.problemData.description = escape2Html(des);
    return isDataLegal;
};


