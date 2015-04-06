/**
 * Created by wcq on 15-3-26.
 */
var createGroupController = function () {
    return this;
};
createGroupController.prototype = new Model();
createGroupController.prototype.templatePath = Model.XHRPathHead() + '/templates/newGroup.html';

createGroupController.prototype.template = '<form action="#"><table id="create-group-table" class="styled-table" style="width:320px"><thead><tr><th colspan="2"><h2>创建小组</h2></th></tr><tr style="display:none"><th width="80"></th><th width="240"></th></tr></thead><tbody><tr><td>小组名称</td><td><input type="text" name="name" class="" placeholder="小组名称" required></td></tr><tr><td>小组描述</td><td><input type="text" name="description" class="" placeholder="描述一下你的小组～" required></td></tr><tr><td colspan="2"><a class="button submit">提交</a> <a class="button back" onclick="history.back()">返回</a></td></tr></tbody></table></form>';


createGroupController.prototype.showPage = function () {


    var scope = document.getElementById("create-group-section");
    var text = this.loadTemplate();
    $(scope).html(text);
    scope._css('display', 'block');
    var AnchorsToBind = scope.getElementsByTagName("a");
    jRouter.parseAnchor(AnchorsToBind);
    this.divBlock = document.getElementById("create-group-section");
    this.submitButton = this.divBlock.getElementsByClassName('submit')[0];
    this.submitButton.addEventListener('click', function () {
        createGroupControllerEntity.createGroup();
    });


};
createGroupController.prototype.createGroup = function () {
    if (this.checkData()) {
        var data = this.groupData;
        if (window.currentGroup == undefined || window.currentGroup == null) {
            window.currentGroup = new GroupModel();
        }
        window.currentGroup.ADD(data);
    }
};


createGroupController.prototype.getInput = function (name) {
    return this.divBlock.querySelectorAll('input[name="' + name + '"]')[0];
};

createGroupController.prototype.getForm = function () {
    return this.divBlock.getElementsByTagName('form')[0];
};
createGroupController.prototype.getFormData = function () {
    this.groupData = {};
    this.form = document.querySelectorAll("#create-group-section form")[0];
    for (var i = 0; i < this.form.length; i++) {
        if (i == this.form.length - 1) {

            this.groupData[this.form[i].name] = this.form[i].value;

        } else {

            this.groupData[this.form[i].name] = this.form[i].value;

        }
    }
    return this.groupData;
};

//设置表单样式
createGroupController.prototype.setInputError = function (name) {
    //已经有的话先去掉，这样可以保证有shake动效触发
    this.getInput(name).classList.remove('error-input');
    this.getInput(name).classList.add('error-input');
};

createGroupController.prototype.removeInputError = function (name) {
    this.getInput(name).classList.remove('error-input');
    this.getInput(name).classList.remove('shake');
};

//检查数据合法与否（不是内容的正确性而是格式的合理性）
createGroupController.prototype.checkData = function () {
    //每次检查前都要重新获取一次数据
    this.getFormData();
    var isDataLegal = true;
    if (this.groupData["name"].length == 0) {
        topMessage(
            {
                Message: '您输入的小组名为空，请验证后重新输入',
                Type: 'warning'
            });
        this.setInputError('name');
        isDataLegal = false;
    } else {
        this.removeInputError('name');
        var name = this.groupData["name"];
        this.groupData["name"] = escape2Html(name);
    }
    var des = this.groupData.description;
    this.groupData.description = escape2Html(des);
    return isDataLegal;
};
