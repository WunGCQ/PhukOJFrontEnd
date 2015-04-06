/**
 * Created by wcq on 15-4-6.
 */
/**
 * Created by wungcq on 15/2/24.
 */
window.ReplyModel = function (ReplyListData) {

	if (typeof ReplyListData != "undefined") {
		this.init(ReplyListData);
		this.modelData = ReplyListData;
	}
	this.loadTemplate();
	return this;
};

//ReplyList 继承自数据模型类
ReplyModel.prototype = new Model();

//需要设置每个数据模型的增删改查路径和参数
(function () {
	ReplyModel.prototype.templatePath = Model.XHRPathHead() + '/templates/discussion.html';
	ReplyModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/problem/discussion/reply/list';
	ReplyModel.prototype.AddPath = Model.XHRPathHead() + '/api/problem/discussion/reply/create';
	ReplyModel.prototype.template ='';
})();

ReplyModel.prototype.init = function (ReplyListData) {
	this.modelData = ReplyListData;
	return ReplyListData;
};


ReplyModel.prototype.RETRIEVE = function (discussion_id, callback) {
	var data = {};
	data.discussion_id = discussion_id;
	data.user_id = window.currentUser == undefined ? cookieMethods.getCookie("user_id") : window.currentUser.user_id;
	$.ajax(
		{
			url: ReplyModel.prototype.RetrievePath,
			data: data,
			type: 'POST',
			async: false,
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
				if (Data.code == 1)//返回无误
				{
					if (typeof callback == "function") {
						callback(Data);
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

};


ReplyModel.prototype.ADD = function (discussion_id,content, callback) {
	var data = {};
	data.discussion_id = discussion_id;
	data.user_id = window.currentUser == undefined ? cookieMethods.getCookie("user_id") : window.currentUser.user_id;
	data.content = content;
	$.ajax(
		{
			url: ReplyModel.prototype.RetrieveReplyPath,
			data: data,
			type: 'POST',
			async: false,
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
				if (Data.code == 1)//返回无误
				{
					if (typeof callback == "function") {
						callback(Data);
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

};

