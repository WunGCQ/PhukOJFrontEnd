/**
 * Created by wungcq on 15/3/19.
 */
/**
 * Created by wungcq on 15/3/7.
 */
window.MembershipController = {};

MembershipController.page = 1;

MembershipController.scopeBlock = document.getElementById('membership-section');



//显示组员信息
MembershipController.showMembership = function (group_id) {

    MembershipController.group_id = group_id;
    MembershipController.admin_id = (window.currentUser != undefined) ? window.currentUser.user_id : cookieMethods.getCookie("user_id")
    MembershipController.scopeBlock = document.getElementById('membership-section');


    //MembershipModel.prototype.loadTemplate();
    if(!MembershipController.isMemberShow) {
        if(document.getElementById("membership-table")!=null){
            document.getElementById("membership-table")._css("display","table");
            document.getElementById("load-membership").innerHTML = '- 收起列表';
            MembershipController.isMemberShow = true;
        }else {
            MembershipController.currentMembership = new MembershipModel();

            MembershipController.currentMembership.RETRIEVE(group_id, function () {
                var MembershipPageText = MembershipController.currentMembership.renderPage();
                //MembershipPageText += juicer(MembershipPageText,{"page":{"page":MembershipController.page}});
                MembershipController.scopeBlock.innerHTML+=MembershipPageText;
                MembershipController.scopeBlock._css('display', 'block');
                document.getElementById("load-membership").innerHTML = '- 收起列表';
                var AnchorsToBind = MembershipController.scopeBlock.getElementsByTagName("a");
                jRouter.parseAnchor(AnchorsToBind);
                MembershipController.bindEditorLink();
                MembershipController.isMemberShow = true;
                jRouter.parseAnchor(document.getElementById("membership-table").getElementsByTagName("a"));
                //$("#membership-table").DataTable();
            });
        }

    } else {
        document.getElementById("membership-table")._css("display","none");
        document.getElementById("load-membership").innerHTML = '＋ 显示小组成员列表';
        MembershipController.isMemberShow = false;
    }

};

//修改昵称
MembershipController.addChangeNickNameView = function (obj) {
    var link = obj;
    var tr = link.parentNode.parentNode;

    var NickNameInput = tr.getElementsByTagName("input")[0];
    var span = NickNameInput.previousElementSibling;
    var t = NickNameInput.getAttribute("type");
    if (t == "hidden") {
        link.innerHTML = "确认修改";
        span._css("display", "none");
        NickNameInput.setAttribute("type", "text");
    } else {
        //修改完成
        link.innerHTML = "修改昵称";
        var nickname = escape2Html(NickNameInput.value);
        span.innerText = nickname;
        if(nickname.length==0) {
            topMessage({
                Message:"昵称不能位空",
                Type:"warning"
            });
            return;
        }

        NickNameInput.setAttribute("type", "hidden");
        span._css("display", "inline");
        var user_id = link.getAttribute("data-id");
        var updateData = {
            "admin_id" : MembershipController.admin_id,
            "user_id" : user_id,
            "group_id" : MembershipController.group_id,
            "nickname": nickname
        };
        MembershipController.currentMembership.UPDATE(updateData);
    }
};

//修改权限
MembershipController.editMembershipPrivilege = function (obj) {
    var link = obj;
    var user_id = parseInt(link.getAttribute("data-id"));
    MembershipController.editiingMemberId = user_id;
    var tr = link.parentNode.parentNode;
    MembershipController.currentMembership.retrievePrivilege(user_id,MembershipController.group_id,function(Data){
        var template = MembershipController.privilegeTemplate();
        var text = juicer(template,{content:Data});
        MembershipController.scopeBlock.innerHTML+= text;
    });
};

//事件代理
MembershipController.bindEditorLink = function() {
    MembershipController.scopeBlock.addEventListener("click", function (ev) {
        var evt = ev || window.event;
        var target = evt.target;
        if(target.classList.contains("disabled")){
            return;
        } else if (target.classList.contains("edit-nickname-link")) {
            MembershipController.addChangeNickNameView(target);
        } else if (target.classList.contains("edit-privilege")) {
            MembershipController.editMembershipPrivilege(target);
        } else if (target.classList.contains("close-edit-privilege") ||target.id=="change-privilege" ) {
            MembershipController.closePrivilege();
        } else if (target.classList.contains("remove-group-member")) {
            MembershipController.removeMember(target);
        }
    });
};

//发送修改权限
MembershipController.updatePrivilege = function() {
    var dataForm =document.getElementById("privilege-form");
    var privilegeData = {};
    for (var i = 0; i < dataForm.length; i++) {
        privilegeData[dataForm[i].name] = dataForm[i].value;
    }
    privilegeData.admin_id = MembershipController.admin_id;
    privilegeData.user_id = MembershipController.editiingMemberId;
    privilegeData.group_id = MembershipController.group_id;
    MembershipController.currentMembership.updatePrivilege(privilegeData,function(){
        $("#change-privilege").remove();
    });
};

//关闭修改权限窗口
MembershipController.closePrivilege = function() {
    $("#change-privilege").remove();
};

//Ｔ人
MembershipController.removeMember = function(link) {
    var removeData = {};
    removeData.user_id = link.getAttribute("data-id");
    removeData.admin_id = MembershipController.admin_id;
    removeData.group_id = MembershipController.group_id;
    if(confirm("确定要将该成员从小组中移除吗？")){
        MembershipController.currentMembership.REMOVE(removeData,function(){
            //成功后删除行
            var rowToDelete = link.parentNode.parentNode;
            window.currentGroup.modelData.member_count -= 1;
            groupController.scopeBlock.getElementsByClassName("group_member").innerHTML = window.currentGroup.modelData.member_count;
            $(rowToDelete).remove();
        });
    }


};
//申请管理
MembershipController.bindApplicationLink = function() {
    document.getElementById("application-section").addEventListener("click",function(event){
        var ev = event || window.event;
        var target = ev.target;

        if(target.classList.contains("disabled")){
            return;

        } else if(target.classList.contains("accept-join")) {

            MembershipController.acceptApply(target);

        } else if(target.classList.contains("reject-join")) {

            MembershipController.rejectApply(target);

        }
    });
};

MembershipController.acceptApply = function(target) {
    var user_id = target.getAttribute("data-id");

    var data = {
        "user_id":user_id,
        "admin_id":MembershipController.admin_id,
        "group_id":MembershipController.group_id
    };

    MembershipController.currentMembership.acceptApply(data, function() {
        //刷新成员列表
        if(groupController.isMemberShow == true){
            $("#membership-table").remove();
            groupController.isMemberShow = false;
            MembershipController.showMembership(MembershipController.group_id);
        }else {
            $("#membership-table").remove();
        }


        var rowToRemove = target.parentNode.parentNode;
        $(rowToRemove).remove();

        window.currentGroup.modelData.member_count += 1;
        groupController.scopeBlock.getElementsByClassName("group_member").innerHTML = window.currentGroup.modelData.member_count;
        //修改申请列表
        MembershipController.currentMembership.applicationList.apply_number-=1;
        if(MembershipController.currentMembership.applicationList.apply_number==0){
            $("#apply-table tbody>tr:first-child").html('<td colspan="5">目前没有待审核的申请</td>');
        }else {
            $("#apply-table tbody>tr:first-child td:last-child").html(MembershipController.currentMembership.applicationList.apply_number);
        }

    });
};
MembershipController.rejectApply = function(target) {
    if(confirm("确认要拒绝该用户的申请吗？")){
        var user_id = target.getAttribute("data-id");

        var data = {
            "user_id":user_id,
            "admin_id":MembershipController.admin_id,
            "group_id":MembershipController.group_id
        };
        MembershipController.currentMembership.REMOVE(data,function(){
            //成功后删除行
            var rowToDelete = target.parentNode.parentNode;
            $(rowToDelete).remove();
            //修改申请列表
            MembershipController.currentMembership.applicationList.apply_number-=1;
            if(MembershipController.currentMembership.applicationList.apply_number==0){
                $("#apply-table tbody>tr:first-child").html('<td colspan="5">目前没有待审核的申请</td>');
            }else {
                $("#apply-table tbody>tr:first-child td:last-child").html(MembershipController.currentMembership.applicationList.apply_number);
            }
        });
    }

};
//显示申请列表
MembershipController.showApplicationList = function(group_id) {

    if(!MembershipController.isApplicationListShow){
        if(!document.getElementById("apply-table")){
            MembershipController.admin_id = (window.currentUser != undefined) ? window.currentUser.user_id : cookieMethods.getCookie("user_id");
            MembershipController.group_id = group_id;
            var data = {
                "user_id": MembershipController.admin_id,
                "group_id":group_id
            };
            MembershipController.currentMembership = new MembershipModel();
            MembershipController.currentMembership.getApplicationList (data, function(Data) {
                MembershipController.currentMembership.applicationList = {
                    "apply_number":Data.apply_number,
                    "applyList":Data.content
                };
                var text = juicer(MembershipController.applyTemplate(), MembershipController.currentMembership.applicationList);
                document.getElementById("application-section").innerHTML+= text;
                MembershipController.isApplicationListShow = true;
                document.getElementById("load-application").innerHTML = "- 收起申请列表";
                MembershipController.bindApplicationLink();


            });
        } else {
            document.getElementById("apply-table")._css("display","table");
            MembershipController.isApplicationListShow = true;
            document.getElementById("load-application").innerHTML = "- 收起申请列表";
        }

    }else {
        document.getElementById("apply-table")._css("display","none");
        MembershipController.isApplicationListShow = false;
        document.getElementById("load-application").innerHTML = "＋ 显示申请列表";
    }

};

//成员列表模板
MembershipController.privilegeTemplate = function() {

    return '<div class="modal-bg" id="change-privilege" style="width: 100vw;height: 100vw;display: block; position: fixed;z-index: 9999;top:0;left: 0;background-color: rgba(0, 0, 0, .3);text-align: center;"><div style="display:block;position:relative;width: 300px;margin: calc(50vh - 150px) auto;z-index:10000;padding: 10px;background-color: #fff"><table class="styled-table" style="width: 300px;border-radius: 2px;margin: -30px auto 0 auto;"><thead><tr style="visibility: hidden"><th width="150"> </th><th width="150"> </th></tr></thead><tbody><tr><td colspan="2">成员权限管理</td></tr><form id="privilege-form"><tr><td>创建与修改题目</td><td><select name="pcreate">{@if content.pcreate=="1"}<option value="1" selected>是</option><option value="0">否 </option>{@else}<option value="1"> 是 </option><option value="0" selected>否</option>{@/if}</select></td></tr><tr><td>创建与修改赛事</td><td><select name="ccreate">{@if content.ccreate == "1"}<option value="1" selected>是 </option><option value="0">否</option>{@else}<option value="1"> 是 </option><option value="0" selected> 否 </option>{@/if}</select></td></tr><tr><td>管理小组信息</td><td><select name="gedit">{@if content.gedit=="1"}<option value="1" selected> 是 </option><option value="0"> 否 </option>{@else}<option value="1"> 是 </option><option value="0" selected> 否 </option>{@/if}</select></td></tr><tr><td>管理成员权限</td><td><select name="mauth">{@if content.mauth=="1"}<option value="1" selected> 是 </option><option value="0"> 否 </option>{@else}<option value="1"> 是 </option><option value="0" selected> 否 </option>{@/if}</select></td></tr><tr><td>管理小组成员</td><td><select name="madmin">{@if content.madmin == "1"}<option value="1" selected> 是 </option><option value="0"> 否 </option>{@else}<option value="1"> 是 </option><option value="0" selected> 否 </option>{@/if}</select></td></tr><tr><td colspan="2"><a class="button" onclick="MembershipController.updatePrivilege();">修改权限</a><a class="button close-edit-privilege" style="margin-left:20px; " >取消编辑</a></td></tr></form></tbody></table></div></div>';
};

//队列模板
MembershipController.applyTemplate = function() {
    return '<table class="styled-table" id="apply-table"><thead><tr><th width="120">用户名</th><th width="120">昵称</th><th width="160">申请时间</th><th width="200" colspan="2"></th></tr></thead><tbody><tr>            {@if apply_number > 0}<td colspan="3">                待审查申请个数：</td><td colspan="2">                ${apply_number}</td>            {@/if}            {@if apply_number == 0}<td colspan="5">                目前暂无申请</td>            {@/if}</tr>        {@each applyList as apply}<tr><td>                ${apply.username}</td><td>                ${apply.nickname}</td><td>                ${apply.join_time}</td><td><a class="button accept-join" data-id="${apply.user_id}">                    同意申请</a></td><td><a class="button reject-join" data-id="${apply.user_id}">                    拒绝申请</a></td></tr>        {@/each}</tbody></table>';

};