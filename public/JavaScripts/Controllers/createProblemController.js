/**
 * Created by wcq on 15-3-26.
 */
var createProblemController = function (group_id) {
    this.group_id = group_id;
    return this;
};


(function () {

    createProblemController.prototype = new ProblemModel();
    createProblemController.prototype.scope = document.getElementById("create-problem-section");
    createProblemController.prototype.templatePath = Model.XHRPathHead() + '/templates/newProblem.html';
    var strVar = "";
    strVar += "<style>";
    strVar += "    #create-problem-table {";
    strVar += "";
    strVar += "    }";
    strVar += "";
    strVar += "    #create-problem-table tbody td {";
    strVar += "        border: 1px solid #ccc;";
    strVar += "        text-align: center;";
    strVar += "    }";
    strVar += "";
    strVar += "    #create-problem-table tr {";
    strVar += "        background: transparent !important;";
    strVar += "    }";
    strVar += "";
    strVar += "    #problem-description {";
    strVar += "        width: 100%;";
    strVar += "        height: 300px;";
    strVar += "        outline: none;";
    strVar += "        resize: vertical;";
    strVar += "    }";
    strVar += "";
    strVar += "    #problem-description:focus {";
    strVar += "        border: 1px solid #16a085;";
    strVar += "        box-shadow: 0 0 6px 1px rgba(27, 212, 179, .1);";
    strVar += "    }";
    strVar += "";
    strVar += "    #problem-preview {";
    strVar += "        width: 100%;";
    strVar += "        box-sizing: border-box;";
    strVar += "        padding: 10px;";
    strVar += "        text-align: left;";
    strVar += "    }";
    strVar += "";
    strVar += "<\/style>";
    strVar += "<form id=\"create-problem-form\">";
    strVar += "    <table id=\"create-problem-table\" class=\"styled-table\" style=\"width: 800px\">";
    strVar += "        <thead>";
    strVar += "        <tr>";
    strVar += "            <th colspan=\"2\">";
    strVar += "                <h2>创建题目<\/h2>";
    strVar += "            <\/th>";
    strVar += "        <\/tr>";
    strVar += "        <tr style=\"display: none;\">";
    strVar += "            <th width=\"400\"><\/th>";
    strVar += "            <th width=\"400\"><\/th>";
    strVar += "        <\/tr>";
    strVar += "        <\/thead>";
    strVar += "        <tbody>";
    strVar += "        <tr>";
    strVar += "            <td colspan=\"2\">";
    strVar += "                <input type=\"text\" name=\"title\" class=\"\" placeholder=\"题目标题\" required=\"required\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                是否公开";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <select name=\"access_level\">";
    strVar += "                    <option value=\"0\" selected>不公开<\/option>";
    strVar += "                    <option value=\"1\">小组内部可见<\/option>";
    strVar += "                    <option value=\"2\">公开<\/option>";
    strVar += "                <\/select>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                <textarea id=\"problem-description\" name=\"description\" class=\"\" placeholder=\"题目描述\"";
    strVar += "                          required=\"required\"><\/textarea>";
    strVar += "            <\/td>";
    strVar += "            <td style=\"vertical-align: top;\">";
    strVar += "                <div id=\"problem-preview\" class=\"markdown-body\">";
    strVar += "                <\/div>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        ";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                支持语言";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <label>";
    strVar += "                    <input type=\"checkbox\" name=\"support_lang\" placeholder=\"支持语言\" value=\"C\"/>";
    strVar += "                    C";
    strVar += "                <\/label>";
    strVar += "                <label>";
    strVar += "                    <input type=\"checkbox\" name=\"support_lang\" placeholder=\"支持语言\" value=\"CPP\"/>";
    strVar += "                    C++";
    strVar += "                <\/label>";
    strVar += "                <label>";
    strVar += "                    <input type=\"checkbox\" name=\"support_lang\" placeholder=\"支持语言\" value=\"JAVA\"/>";
    strVar += "                    JAVA";
    strVar += "                <\/label>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                评测轮次";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"test_round_count\" placeholder=\"评测轮次\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                内存限制(KB)";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"memory_limit\" placeholder=\"内存限制\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                总时间限制(ms)";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"time_limit_global\" placeholder=\"总时间限制\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                每轮时间限制(ms)";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"time_limit_case\" placeholder=\"每轮时间限制\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                标准输入文件";
    strVar += "                <a class=\"button\" onclick=\"addFileInputs('input-file-scope','standard_input_files')\">添加文件<\/a>";
    strVar += "                <script>";
    strVar += "                    function addFileInputs(scopeId, name) {";
    strVar += "                        var t = new Date().getTime();";
    strVar += "                        $(\"#\" + scopeId).append('<input type=\"file\" name=\"' + name + t + '\" style=\"width:240px\"/>');";
    strVar += "                    }";
    strVar += "                <\/script>";
    strVar += "            <\/td>";
    strVar += "            <td id=\"input-file-scope\" style=\"width:300px !important;\">";
    strVar += "                <input type=\"file\" name=\"standard_input_files\" placeholder=\"标准输入文件\" style=\"width:240px\"/>";
    strVar += "            <\/td>";
    strVar += "";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td style=\"width:300px !important;\">";
    strVar += "                标准输出文件";
    strVar += "                <a class=\"button\" onclick=\"addFileInputs('output-file-scope','standard_output_files')\">添加文件<\/a>";
    strVar += "";
    strVar += "            <\/td>";
    strVar += "            <td id=\"output-file-scope\">";
    strVar += "                <input type=\"file\" name=\"standard_output_files\" placeholder=\"标准输出文件\" style=\"width:240px\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                每轮权重";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"round_weight\" placeholder=\"每轮权重\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                通过条件";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"compare_ac_level\" placeholder=\"通过条件\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                大小写错误敏感";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"compare_pre_case_insensitive\" placeholder=\"大小写错误敏感\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td>";
    strVar += "                特殊检测";
    strVar += "            <\/td>";
    strVar += "            <td>";
    strVar += "                <input type=\"text\" name=\"compare_special\" placeholder=\"特殊检测\"/>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <tr>";
    strVar += "            <td colspan=\"2\" style=\"text-align: center\">";
    strVar += "                <a class=\"button submit\">";
    strVar += "                    提交";
    strVar += "                <\/a>";
    strVar += "                <a class=\"button preview\" style=\"margin: auto 20px;\">";
    strVar += "                    预览";
    strVar += "                <\/a>";
    strVar += "                <a class=\"button back\" onclick=\"history.back();\">";
    strVar += "                    返回";
    strVar += "                <\/a>";
    strVar += "            <\/td>";
    strVar += "        <\/tr>";
    strVar += "        <\/tbody>";
    strVar += "    <\/table>";
    strVar += "<\/form>";
    strVar += "";
    createProblemController.prototype.template = strVar;
})();


createProblemController.prototype.showPage = function () {
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
    this.submitButton.addEventListener('click', function () {
        createProblemControllerEntity.createProblem();
    });
    this.bindTextAreaListener();

};
createProblemController.prototype.bindTextAreaListener = function () {
    var textarea = document.getElementById('problem-description');
    $(textarea).each(function () {
        $(this).keydown(function (eve) {
            if (eve.target != this)
                return;
            if (eve.keyCode == 13)
                last_blanks = getCurrentLineBlanks(this);
            else if (eve.keyCode == 9) {
                eve.preventDefault();
                insertAtCursor(this, "  ");
                this.returnValue = false;
            }
        }).keyup(function (eve) {
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

createProblemController.prototype.createProblem = function () {
    if (this.checkData()) {
        var data = this.getSendFormData();
        if (window.currentProblem == undefined || window.currentProblem == null) {
            window.currentProblem = new ProblemModel();
        }

        this.ADD(data);
    }
};

createProblemController.prototype.getSendFormData = function () {
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

createProblemController.prototype.getFilesArray = function (formId, name) {
    var arr = [];
    for (var i = 0; i < $('#' + formId).get(0)[name].files.length; i++) {
        arr.push($('#' + formId).get(0)[name].files[i]);
    }
    return arr;
};


createProblemController.prototype.getInput = function (name) {
    if (this.divBlock.querySelectorAll('input[name="' + name + '"]')) {
        return this.divBlock.querySelectorAll('input[name="' + name + '"]')[0];
    }
    else {
        return false;
    }

};

createProblemController.prototype.getForm = function () {
    return $(this.divBlock).children('form').get(0);
};
createProblemController.prototype.getFormData = function () {
    this.problemData = {};
    this.form = document.querySelectorAll("#create-problem-section form")[0];
    for (var i = 0; i < this.form.length; i++) {
        if (i == this.form.length - 1) {

            this.problemData[this.form[i].name] = this.form[i].value;

        } else {

            this.problemData[this.form[i].name] = {
                "value": this.form[i].value,
                "placeholder": this.form[i].getAttribute("placeholder")
            };

        }
    }
    return this.problemData;
};

//设置表单样式
createProblemController.prototype.setInputError = function (name) {
    //已经有的话先去掉，这样可以保证有shake动效触发
    if (this.getInput(name)) {
        this.getInput(name).classList.remove('error-input');
        this.getInput(name).classList.add('error-input');
    }


};

createProblemController.prototype.removeInputError = function (name) {
    if (this.getInput(name)) {
        this.getInput(name).classList.remove('error-input');
        this.getInput(name).classList.remove('shake');
    }

};


//检查数据合法与否（不是内容的正确性而是格式的合理性）
createProblemController.prototype.checkData = function () {
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

    return isDataLegal;
};


