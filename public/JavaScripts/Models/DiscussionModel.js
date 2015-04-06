/**
 * Created by wcq on 15-4-6.
 */
/**
 * Created by wungcq on 15/2/24.
 */
window.DiscussionModel = function (DiscussionListData) {

	if (typeof DiscussionListData != "undefined") {
		this.init(DiscussionListData);
		this.modelData = DiscussionListData;
	}
	this.loadTemplate();
	return this;
};

//DiscussionList 继承自数据模型类
DiscussionModel.prototype = new Model();

//需要设置每个数据模型的增删改查路径和参数
(function () {
	DiscussionModel.prototype.templatePath = Model.XHRPathHead() + '/templates/discussion.html';
	DiscussionModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/problem/discussion/list';
	DiscussionModel.prototype.AddPath = Model.XHRPathHead() + '/api/problem/discussion/create';

	var strVar = "";
	strVar += "{@each discussion_list as discussion}";
	strVar += "<article class=\"discussion\">";
	strVar += "";
	strVar += "    <div class=\"discussion-content markdown-body\">";
	strVar += "        $${discussion.content}";
	strVar += "        <a class=\"underline-a\" onclick=\"replyController.showReply(${problem_id},this);\" style=\"text-indent: 15px;\">回复(${discussion.reply_count})<\/a>";
	strVar += "    <\/div>";
	strVar += "";
	strVar += "    <section class=\"reply-list\">";
	strVar += "";
	strVar += "    <\/section>";
	strVar += "<\/article>";
	strVar += "{@/each}";
	strVar += "<textarea placeholder=\"发表你的看法吧\" id=\"create-discussion-div\" ><\/textarea>";
	strVar += "<a class=\"underline-a\">取消<\/a>";
	strVar += "<a class=\"button\" onclick=\"discussionController.create_discussion(${problem_id});\">发表<\/a>";

	DiscussionModel.prototype.template =strVar;
})();

DiscussionModel.prototype.init = function (DiscussionListData) {
	this.modelData = DiscussionListData;
	return DiscussionListData;
};

DiscussionModel.prototype.convertContentToMD= function(){
	for(var i = 0; i<this.modelData.discussion_list.length; i++) {
		this.modelData.discussion_list[i].content = marked(this.modelData.discussion_list[i].content);
	}
};
DiscussionModel.prototype.RETRIEVE = function (problem_id, callback) {
	var data = {};
	data.problem_id = problem_id;
	data.user_id = window.currentUser == undefined ? cookieMethods.getCookie("user_id") : window.currentUser.user_id;
	$.ajax(
		{
			url: DiscussionModel.prototype.RetrievePath,
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
					Data.problem_id = problem_id;
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

DiscussionModel.prototype.ADD = function (problem_id,content, callback) {
	var data = {};
	data.problem_id = problem_id;
	data.user_id = window.currentUser == undefined ? cookieMethods.getCookie("user_id") : window.currentUser.user_id;
	data.content = content;
	$.ajax(
		{
			url: DiscussionModel.prototype.AddPath,
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
