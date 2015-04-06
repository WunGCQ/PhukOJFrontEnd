window.UserModel = function (UserData) {
    if (typeof this.modelData == "undefined" && typeof UserData != "undefined") {
        this.modelData = {'user': UserData};
        this.init(UserData);

    }
    //避免重复加载原型模板
    if (this.template == null || typeof this.template == "undefined") {
        this.loadTemplate();
    }

    return this;
};

//User 继承自数据模型类
UserModel.prototype = new Model();

//需要设置每个数据模型的增删改查路径和参数
(function () {
    UserModel.prototype.templatePath = Model.XHRPathHead() + '/templates/user.html';
    UserModel.prototype.AddPath = Model.XHRPathHead() + '/api/user/register';
    UserModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/user/info';
    UserModel.prototype.UpdatePath = Model.XHRPathHead() + '/api/user/update';
    UserModel.prototype.LoginPath = Model.XHRPathHead() + '/api/user/login';
    UserModel.prototype.LogoutPath = Model.XHRPathHead() + '/api/user/logout';
    UserModel.prototype.UpdatePWDPath = Model.XHRPathHead() + '/api/user/password/update';
})();

UserModel.prototype.init = function (UserData) {
    var UserData = UserData || this.modelData;
    if (typeof UserData != "undefined") {
        for (var i in UserData) {
            this[i] = UserData[i];
        }
    }
    this.modelData = {'user': UserData};
    this.isUserInfoShown = false;
};


UserModel.prototype.writeCookie = function (user_id, name, token) {
    var username = name || this.username;
    cookieMethods.setCookie('isLogin', 'true');
    cookieMethods.setCookie('user_id', user_id);
    cookieMethods.setCookie('username', name);
    if (token != undefined) {
        cookieMethods.setCookie('token', token);
    }

};


//激活用户菜单栏
UserModel.prototype.setUserBarLog = function (username) {
    var userBar = document.getElementById('user-bar');
    userBar.classList.remove('unlog');
    userBar.classList.add('log');
    //顺便塞上用户名
    document.getElementById('user-nav').getElementsByClassName('user-name')[0].innerHTML = username;
};


//禁用用户菜单栏
UserModel.prototype.setUserBarUnLog = function () {
    var userBar = document.getElementById('user-bar');
    userBar.classList.remove('log');
    userBar.classList.add('unlog');
};


//登出
UserModel.prototype.logout = function () {
    var isLogin = cookieMethods.getCookie('isLogin');
    if (isLogin == 'true') {
        if (typeof arg == 'undefined') {
            var data = {
                "user_id": this.user_id
            };
        }
        //向服务器发送注销的消息
        $.ajax(
            {
                url: UserModel.prototype.LogoutPath,
                data: data,
                type: 'POST',
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
                    //返回数据，而且注销成功
                    if (Data.code == 1) {
                        UserModel.prototype.setUserBarUnLog();
                        //设为false
                        cookieMethods.delCookie('isLogin');
                        cookieMethods.setCookie('isLogin', 'false');
                        topMessage({
                            Message: '注销成功',
                            Type: 'success'
                        });
                        jRouter.getControllerByUrl('')
                    }
                    //没有注销成功，但服务器返回错误
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
            }
        );

        //UserModel.prototype.setUserBarLog(username);
    }
    else {
        //提示下
        topMessage({
            Message: '少侠您还没登陆QAQ',
            Type: 'normal'
        });
    }
};


//查找一个用户(获取用户信息)
UserModel.prototype.RETRIEVE = function (arg,callback) {
    if (typeof arg == 'undefined') {
        var data = null;
    } else {
        var data = arg;
    }

    //数据为空表示着向服务器session查找当前用户，用于已经登陆的用户打开新页面的时候的操作
    $.ajax(
        {
            url: UserModel.prototype.RetrievePath,
            data: data,
            type: UserModel.prototype.Retrievemethod,
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
                if (Data.code == 1) {
                    window.currentUser = new UserModel(Data.user);
                    window.currentUser.writeCookie(Data.user.user_id, Data.user.username, Data.token);
                    cookieMethods.setCookie("nickname",Data.user.nickname);
                    if(typeof callback == 'function') {
                        callback(Data);
                    }
                    //TODO 后续工作包括了渲染用户设置的模板，用户下拉菜单等
                }
                else {
                    topMessage({
                        Message: Data.message,
                        Type: 'fail'
                    });
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
};
UserModel.prototype.renderUserInfo = function () {
    //如果还没加载过这个模块
    if (!this.isUserInfoShown) {
        //由于UserModel的构造函数决定了一定已经有模板了
        var text = juicer(this.getTemplateText(), {user: this.modelData});
        //document.getElementById('user-info-section').innerHTML = text;
        $('#user-info-section').html(text);
        this.isUserInfoShown = true;
    }
};
//资料面板
UserModel.prototype.showCurrentUserInfo = function () {
    this.renderUserInfo();
    document.getElementById('user-info-section').style["display"] = "block";
    return;
};

//更新用户信息
UserModel.prototype.UPDATE = function (arg) {
    if (typeof arg == 'undefined') {
        var data = null;
    } else {
        var data = arg;
    }

    $.ajax(
        {
            url: UserModel.prototype.UpdatePath,
            data: data,
            type: UserModel.prototype.Updatemethod,
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
                if (Data.code == 1) {
                    window.currentUser = new UserModel(Data.user);
                    for (var x in data) {
                        window.currentUser[x] = data[x];
                        window.currentUser.modelData.user[x] = data[x];
                    }
                    //window.currentUser.writeCookie(Data.user.username);
                    //TODO 后续工作包括了渲染用户设置的模板，用户下拉菜单等
                    topMessage({
                        Message: '修改成功~',
                        Type: 'success'
                    });
                    //同时再更新一下用户信息
                    window.currentUser.renderUserInfo();
                }
                else {
                    topMessage({
                        Message: Data.message,
                        Type: 'fail'
                    });
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
};
//更新用户信息
UserModel.prototype.UPDATEPASSWORD = function (arg) {
    if (typeof arg == 'undefined') {
        var data = null;
    } else {
        var data = arg;
        data["user_id"] = window.currentUser.user_id;
    }

    $.ajax(
        {
            url: UserModel.prototype.UpdatePWDPath,
            data: data,
            type: UserModel.prototype.Updatemethod,
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
                if (Data.code == 1) {
                    //window.currentUser = new UserModel(Data.user);
                    //window.currentUser.writeCookie(Data.user.username);
                    topMessage({
                        Message: '修改成功~',
                        Type: 'success'
                    });

                }
                else {
                    topMessage({
                        Message: Data.message,
                        Type: 'fail'
                    });
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
};