/**
 * Created by wungcq on 15/3/20.
 */
/**
 * Created by wungcq on 15/2/15.
 */
//MembershipController.currentMembership = null;//全局对象，记录当前的题目
window.MembershipModel = function (membershipData) {
    if (membershipData != null || typeof membershipData != "undefined") {
        this.init(membershipData);
    }
    //避免重复加载原型模板
    if (this.template == null || typeof this.template == "undefined") {
        this.loadTemplate();
    }

    return this;
};
MembershipModel.prototype.template = '<table id="membership-table" class="styled-table"><thead><tr><th>用户名</th><th>昵称</th><th>加入时间</th><th colspan="3">操作</th></tr></thead><tbody>{@if membership.auth.madmin == "1"} {@each membership.content as group_member}<tr><td>${group_member.username}</td><td><span>${group_member.nickname}</span> <input type="hidden" value="${group_member.nickname}"></td><td>${group_member.join_time}</td><td><a class="button edit-nickname-link" data-id="${group_member.user_id}">修改昵称</a></td><td><a class="button edit-privilege" data-id="${group_member.user_id}">修改权限</a></td><td><a class="button remove-group-member" data-id="${group_member.user_id}">删除成员</a></td></tr>{@/each} {@/if} {@if membership.auth.madmin == "0"} {@each membership.content as group_member}<tr><td><a href="/user/${group_member.user_id}">${group_member.username}</a></td><td><span>${group_member.nickname}</span> <input type="hidden" value="${group_member.nickname}"></td><td>${group_member.join_time}</td><td><a class="button disabled edit-nickname-link" data-id="${group_member.user_id}">修改昵称</a></td><td><a class="button disabled edit-privilege" data-id="${group_member.user_id}">修改权限</a></td><td><a class="button disabled remove-group-member" data-id="${group_member.user_id}">删除成员</a></td></tr>{@/each} {@/if}</tbody></table>';


//Membership 继承自数据模型类
MembershipModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function () {
    MembershipModel.prototype.templatePath = Model.XHRPathHead() + '/templates/membership.html';
    MembershipModel.prototype.AddPath = Model.XHRPathHead() + '/api/group/membership/';
    MembershipModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/group/membership/list';
    MembershipModel.prototype.UpdatePath = Model.XHRPathHead() + '/api/group/membership/update';
    MembershipModel.prototype.RemovePath = Model.XHRPathHead() + '/api/group/membership/remove';
    MembershipModel.prototype.joinPath = Model.XHRPathHead() + '/api/group/membership/';
    MembershipModel.prototype.retievePrivilegePath = Model.XHRPathHead() + '/api/group/membership/privilege';
    MembershipModel.prototype.updatePrivilegePath = Model.XHRPathHead() + '/api/group/membership/privilege/update';
    MembershipModel.prototype.applyListPath = Model.XHRPathHead() + '/api/group/membership/application/list';
    MembershipModel.prototype.applyAcceptPath = Model.XHRPathHead() + '/api/group/membership/accept';
    // MembershipModel.prototype.MembershipDataCache = new Array();//题目的缓存,缓存的是对象的json Data,省去向服务器查询
})();

//
MembershipModel.prototype.init = function (membershipData) {
    this.modelData = {
        'membership': membershipData
    };
    if (!membershipData instanceof Array) {
        for (var key in membershipData) {
            this[key] = membershipData[key];
        }
    }

};

//MembershipModel.getMembershipDataCache = function(id){
//    if(typeof MembershipModel.prototype.MembershipDataCache != "undefined" && MembershipModel.prototype.MembershipDataCache.length>0){
//        for(var i = 0;i < MembershipModel.prototype.MembershipDataCache.length; i++){
//            if(MembershipModel.prototype.MembershipDataCache[i].user_id = id){
//                return MembershipModel.prototype.MembershipDataCache[i];
//            }
//        }
//    }
//    return false;
//};
MembershipModel.pushMembershipDataCache = function (data) {
    MembershipModel.prototype.MembershipDataCache.push(data);
    return;
};

MembershipModel.convertMembershipTimeToString = function (data) {
    for (var i = 0; i < data.length; i++) {
        var d = new Date(data[i]["join_time"]);
        data[i]["join_time"] = d.toLocaleString();
    }
    return data;
};

//通过id获取题目信息
//todo 想清楚应不应该放在原型中，是否需要实例去调用？
MembershipModel.prototype.RETRIEVE = function (group_id, callback) {
    if (typeof group_id == 'undefined') {
        var data = null;
    } else {
        var data = {
            'group_id': group_id
        };
    }
    // var membershipData = MembershipModel.getMembershipDataCache(id);//从缓存的题目数据中获取
    // if(membershipData!=false){ //存在于缓存中，说明之前取过。
    //     //当前题目对象不存在的情况
    //     if(window.currentMembership == null || typeof window.currentMembership == "undefined"){
    //         window.currentMembership = new MembershipModel(membershipData);
    //     }
    //     else{
    //         //如果当亲题目就是这个题目
    //         if(window.currentMembership.id = id){
    //             //什么都不做
    //         }
    //         else{
    //             //如果不是
    //             window.currentMembership.init(membershipData);
    //         }
    //     }
    //     if(typeof callback == "function"){
    //         callback();
    //     }
    //
    // }
    if (1) {
        $.ajax({
            url: MembershipModel.prototype.RetrievePath,
            data: data,
            type: MembershipModel.prototype.Retrievemethod,
            async: false,
            dataType: "json",
            beforeSend: function (request) {
                var session_id = cookieMethods.getCookie("token");
                var user_id = cookieMethods.getCookie("user_id");
                if (user_id != undefined) {
                    request.setRequestHeader("user-Id", user_id);
                } else {
                    request.setRequestHeader("user-Id", -1);
                }
                if (session_id != undefined) {
                    request.setRequestHeader("Session-Id", session_id);
                } else {
                    request.setRequestHeader("Session-Id", -1);
                }

            },
            success: function (Data) {
                if (Data.code == 1) //返回无误
                {
                    var content = Data.content;
                    var d = {};

                    content = MembershipModel.convertMembershipTimeToString(content);
                    d.auth = window.currentGroup.modelData.group.auth;
                    d.content = content;
                    if (MembershipController.currentMembership == null || typeof MembershipController.currentMembership == "undefined") {
                        MembershipController.currentMembership = new MembershipModel(d);
                    } else {
                        MembershipController.currentMembership.init(d);
                    }
                    //MembershipModel.pushMembershipDataCache(Data.membership);
                    if (typeof callback == "function") {
                        callback();
                    }
                    return true;
                } else {
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
        });
    }

};
MembershipModel.prototype.retrievePrivilege = function (user_id, group_id, callback) {
    var data = {
        "user_id": user_id,
        "group_id": group_id
    };
    $.ajax({
        url: MembershipModel.prototype.retievePrivilegePath,
        data: data,
        type: 'POST',
        dataType: "json",
        beforeSend: function (request) {
            var session_id = cookieMethods.getCookie("token");
            if (session_id != undefined) {
                request.setRequestHeader("Session-Id", session_id);
            } else {
                request.setRequestHeader("Session-Id", -1);
            }

        },
        success: function (Data) {

            if (Data.code == 1) {
                if (typeof callback != 'undefined') {
                    callback.call(this, Data);
                }
            }

            else {
                topMessage({
                    Message: Data.message,
                    Type: 'fail'
                });
            }
        },
        //压根没连上
        fail: function () {
            topMessage({
                Message: '服务器连接异常，请检查网络或稍后重试',
                Type: 'fail'
            });
        }
    });

};
MembershipModel.prototype.UPDATE = function (data, callback) {

    //向服务器发送注销的消息
    $.ajax({
        url: MembershipModel.prototype.UpdatePath,
        data: data,
        type: 'POST',
        dataType: "json",
        beforeSend: function (request) {
            var session_id = cookieMethods.getCookie("token");
            if (session_id != undefined) {
                request.setRequestHeader("Session-Id", session_id);
            } else {
                request.setRequestHeader("Session-Id", -1);
            }

        },
        success: function (Data) {
            //返回数据
            if (Data.code == 1) {
                topMessage({
                    Message: '修改成功～',
                    Type: 'success'
                });
                if (typeof callback != 'undefined') {
                    callback.call(this, Data);
                }
            } else {
                topMessage({
                    Message: Data.message,
                    Type: 'fail'
                });
            }
        },
        //压根没连上
        fail: function () {
            topMessage({
                Message: '服务器连接异常，请检查网络或稍后重试',
                Type: 'fail'
            });
        }
    });

};
MembershipModel.prototype.updatePrivilege = function (data, callback) {
    $.ajax({
        url: MembershipModel.prototype.updatePrivilegePath,
        data: data,
        type: 'POST',
        dataType: "json",
        beforeSend: function (request) {
            var session_id = cookieMethods.getCookie("token");
            if (session_id != undefined) {
                request.setRequestHeader("Session-Id", session_id);
            } else {
                request.setRequestHeader("Session-Id", -1);
            }

        },
        success: function (Data) {
            if (Data.code == 1) {
                topMessage({
                    Message: '修改成功',
                    Type: 'success'
                });
                if (typeof callback != 'undefined') {
                    callback.call(this, Data);
                }
            } else {
                topMessage({
                    Message: Data.message,
                    Type: 'fail'
                });
            }
        },
        //压根没连上
        fail: function () {
            topMessage({
                Message: '服务器连接异常，请检查网络或稍后重试',
                Type: 'fail'
            });
        }
    });

};

MembershipModel.prototype.REMOVE = function (data, callback) {

    $.ajax({
        url: MembershipModel.prototype.RemovePath,
        data: data,
        type: 'POST',
        dataType: "json",
        beforeSend: function (request) {
            var session_id = cookieMethods.getCookie("token");
            if (session_id != undefined) {
                request.setRequestHeader("Session-Id", session_id);
            } else {
                request.setRequestHeader("Session-Id", -1);
            }

        },
        success: function (Data) {
            //返回数据
            if (Data.code == 1) {
                topMessage({
                    Message: '已将成员从小组中溢出',
                    Type: 'normal'
                });
                if (typeof callback != 'undefined') {
                    callback.call();
                }
            } else {
                topMessage({
                    Message: Data.message,
                    Type: 'fail'
                });
            }
        },
        //压根没连上
        fail: function () {
            topMessage({
                Message: '服务器连接异常，请检查网络或稍后重试',
                Type: 'fail'
            });
        }
    });

};
MembershipModel.prototype.REMOVE = function (data, callback) {

    $.ajax({
        url: MembershipModel.prototype.RemovePath,
        data: data,
        type: 'POST',
        dataType: "json",
        beforeSend: function (request) {
            var session_id = cookieMethods.getCookie("token");
            if (session_id != undefined) {
                request.setRequestHeader("Session-Id", session_id);
            } else {
                request.setRequestHeader("Session-Id", -1);
            }

        },
        success: function (Data) {
            //返回数据
            if (Data.code == 1) {
                topMessage({
                    Message: '已将成员从小组中移除',
                    Type: 'normal'
                });
                if (typeof callback != 'undefined') {
                    callback.call();
                }
            } else {
                topMessage({
                    Message: Data.message,
                    Type: 'fail'
                });
            }
        },
        //压根没连上
        fail: function () {
            topMessage({
                Message: '服务器连接异常，请检查网络或稍后重试',
                Type: 'fail'
            });
        }
    });

};
MembershipModel.prototype.getApplicationList = function (data, callback) {

    $.ajax({
        url: MembershipModel.prototype.applyListPath,
        data: data,
        type: 'POST',
        dataType: "json",
        beforeSend: function (request) {
            var session_id = cookieMethods.getCookie("token");
            if (session_id != undefined) {
                request.setRequestHeader("Session-Id", session_id);
            } else {
                request.setRequestHeader("Session-Id", -1);
            }

        },
        success: function (Data) {
            //返回数据
            if (Data.code == 1) {

                if (typeof callback != 'undefined') {
                    Data.content = MembershipModel.convertMembershipTimeToString(Data.content);
                    Data.apply_number = Data.content.length;
                    callback.call(this, Data);
                }
            } else {
                topMessage({
                    Message: Data.message,
                    Type: 'fail'
                });
            }
        },
        //压根没连上
        fail: function () {
            topMessage({
                Message: '服务器连接异常，请检查网络或稍后重试',
                Type: 'fail'
            });
        }
    });

};
MembershipModel.prototype.acceptApply = function (data, callback) {

    $.ajax({
        url: MembershipModel.prototype.applyAcceptPath,
        data: data,
        type: 'POST',
        dataType: "json",
        beforeSend: function (request) {
            var session_id = cookieMethods.getCookie("token");
            if (session_id != undefined) {
                request.setRequestHeader("Session-Id", session_id);
            } else {
                request.setRequestHeader("Session-Id", -1);
            }

        },
        success: function (Data) {
            //返回数据
            topMessage({
                Message: '已经添加该成员',
                Type: 'normal'
            });
            if (Data.code == 1) {
                if (typeof callback != 'undefined') {
                    callback.call(this, Data);
                }
            } else {
                topMessage({
                    Message: Data.message,
                    Type: 'fail'
                });
            }
        },
        //压根没连上
        fail: function () {
            topMessage({
                Message: '服务器连接异常，请检查网络或稍后重试',
                Type: 'fail'
            });
        }
    });

};

