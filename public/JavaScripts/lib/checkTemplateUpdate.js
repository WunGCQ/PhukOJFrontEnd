/**
 * Created by wungcq on 15/3/5.
 */
function checkTemplateUpdate() {
    $.ajax(
        {
            url: Model.XHRPathHead() + '/api/version',
            data: null,
            type: "POST",
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
                if (Data.code == 1) {
                    window.templateVersionInfo = Data.versionInfo;
                    for (t in Data.versionInfo) {
                        var ver = localStorage.getItem(t + ".Version");
                        if (ver == null || ver != Data.versionInfo[t]) {//版本不一致
                            localStorage.removeItem(t);
                        }
                    }
                }
                else {
                    topMessage({
                        Message: Data.message,
                        Type: 'fail'
                    });
                }
            }
        }
    );
}