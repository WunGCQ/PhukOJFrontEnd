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
    MembershipController.scopeBlock = document.getElementById('membership-section');
    MembershipModel.prototype.loadTemplate();

    MembershipController.currentMembership = new MembershipModel();

    MembershipController.currentMembership.RETRIEVE(group_id, function () {
        var MembershipPageText = MembershipController.currentMembership.renderPage();

        //MembershipPageText += juicer(MembershipPageText,{"page":{"page":MembershipController.page}});
        $(MembershipController.scopeBlock).html(MembershipPageText);
        MembershipController.scopeBlock._css('display', 'block');
        var AnchorsToBind = MembershipController.scopeBlock.getElementsByTagName("a");
        jRouter.parseAnchor(AnchorsToBind);
        MembershipController.bindEditorLink();
        //$("#membership-table").DataTable();
    });
};

//修改昵称
MembershipController.addChangeView = function (obj) {
    var link = obj;
    var tr = link.parentNode.parentNode;

    var NickNameInput = tr.getElementsByTagName("input")[0];
    var span = NickNameInput.previousElementSibling;
    var t = NickNameInput.getAttribute("type");
    if (t == "hidden") {
        span._css("display", "none");
        NickNameInput.setAttribute("type", "text");
    } else {
        span.innerHTML = NickNameInput.value;
        NickNameInput.setAttribute("type", "hidden");
        span._css("display", "inline");
    }
};

//修改权限
MembershipController.editMembershipPrivilege = function (obj) {
    var link = obj;
    var user_id = parseInt(link.getAttribute("data-id"));
    var tr = link.parentNode.parentNode;

};

MembershipController.bindEditorLink = function () {
    MembershipController.scopeBlock.addEventListener("click", function (ev) {
        var evt = ev || window.event;
        var target = evt.target;
        if (target.classList.contains("edit-nickname-link")) {
            MembershipController.addChangeView(target);
        } else if (target.classList.contains("edit-privilege")) {
            MembershipController.editMembershipPrivilege(target);
        }
    });
};

MembershipController.privilegeTemplate = function () {
    var str = [
        '<div class="modal-bg" id="change-privilege">',
        '<div class="modal-window">',
        '<table>',
        '<thead>',
        '<tr>',
        '<th>' + '</th>',
        '<th>' + '</th>',
        '</tr>',
        '</thead>',
        '<tbody>',
        '<tr>',
        '<td colspan="2">',
        '</td>',
        '${content.nickname}',
        '</tr>',
        '<form id="privilege-form">',
        '<tr>',
        '<td>',
        '创建与修改题目',
        '</td>',
        '<td>',
        '<select name="pcreate">',
        '{@if content.pcreate=="true"}',
        '<option value="1" select>' + 可创建 + '</option>',
        '<option value="0">' + 不可创建 + '</option>',
        '{@else}',
        '<option value="1">' + 可创建 + '</option>',
        '<option value="0" select>' + 不可创建 + '</option>',
        '{@/if}',
        '</select>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td>',
        '创建与修改赛事',
        '</td>',
        '<td>',
        '<select name="ccreate">',
        '{@if content.ccreate=="true"}',
        '<option value="1" select>' + 可创建 + '</option>',
        '<option value="0">' + 不可创建 + '</option>',
        '{@else}',
        '<option value="1">' + 可创建 + '</option>',
        '<option value="0" select>' + 不可创建 + '</option>',
        '{@/if}',
        '</select>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td>',
        '管理小组信息',
        '</td>',
        '<td>',
        '<select name="gedit">',
        '{@if content.gedit=="true"}',
        '<option value="1" select>' + 可管理 + '</option>',
        '<option value="0">' + 不可管理 + '</option>',
        '{@else}',
        '<option value="1">' + 可管理 + '</option>',
        '<option value="0" select>' + 不可管理 + '</option>',
        '{@/if}',
        '</select>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td>',
        '管理成员权限',
        '</td>',
        '<td>',
        '<select name="mauth">',
        '{@if content.mauth=="true"}',
        '<option value="1" select>' + 可管理 + '</option>',
        '<option value="0">' + 不可管理 + '</option>',
        '{@else}',
        '<option value="1">' + 可管理 + '</option>',
        '<option value="0" select>' + 不可管理 + '</option>',
        '{@/if}',
        '</select>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td>',
        '管理小组成员',
        '</td>',
        '<td>',
        '<select name="madmin">',
        '{@if content.madmin=="true"}',
        '<option value="1" select>' + 可管理 + '</option>',
        '<option value="0">' + 不可管理 + '</option>',
        '{@else}',
        '<option value="1">' + 可管理 + '</option>',
        '<option value="0" select>' + 不可管理 + '</option>',
        '{@/if}',
        '</select>',
        '</td>',
        '</tr>',
        '</form>',
        '</tbody>',
        '</table>',
        '</div>',
        '</div>'
    ].join("");
};