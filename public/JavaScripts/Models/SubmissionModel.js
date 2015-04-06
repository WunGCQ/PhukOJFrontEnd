/**
 * Created by wcq on 15-4-5.
 */
window.currentSubmission = null;//全局对象，记录当前的题目
window.SubmissionModel = function (problemData) {
	if (problemData != null || typeof problemData != "undefined") {
		this.init(problemData);
	}
	//避免重复加载原型模板
	if (this.template == null || typeof this.template == "undefined") {
		this.loadTemplate();
	}

	return this;
};


//Submission 继承自数据模型类
SubmissionModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function () {
	SubmissionModel.prototype.templatePath = Model.XHRPathHead() + '/public/templates/submission.html';
	SubmissionModel.prototype.AddPath = Model.XHRPathHead() + '/api/submission/create';
	SubmissionModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/submission';
	SubmissionModel.prototype.UpdatePath = Model.XHRPathHead() + '/api/group/membership/submission';
})();

//
SubmissionModel.prototype.init = function (submissionData) {
	this.modelData = {'submission': submissionData};
	for (var key in submissionData) {
		this[key] = submissionData[key];
	}
};

SubmissionModel.getSubmissionDataCache = function (id) {
	if (SubmissionModel.prototype.SubmissionDataCache.length > 0) {
		for (var i = 0; i < SubmissionModel.prototype.SubmissionDataCache.length; i++) {
			if (SubmissionModel.prototype.SubmissionDataCache[i].id = id) {
				return SubmissionModel.prototype.SubmissionDataCache[i];
			}
		}
	}
	return false;
};
SubmissionModel.pushSubmissionDataCache = function (data) {
	SubmissionModel.prototype.SubmissionDataCache.push(data);
	return;
};


//通过id获取题目信息
//todo 想清楚应不应该放在原型中，是否需要实例去调用？
SubmissionModel.prototype.RETRIEVE = function (id, callback) {
	if (typeof id == 'undefined') {
		var data = null;
	} else {
		var data = {'user_id': id};
	}
	var problemData = SubmissionModel.getSubmissionDataCache(id);//从缓存的题目数据中获取
	if (problemData != false) { //存在于缓存中，说明之前取过。
		//当前题目对象不存在的情况
		if (window.currentSubmission == null || typeof window.currentSubmission == "undefined") {
			window.currentSubmission = new SubmissionModel(problemData);
		}
		else {
			//如果当亲题目就是这个题目
			if (window.currentSubmission.id = id) {
				//什么都不做
			}
			else {
				//如果不是
				window.currentSubmission.init(problemData);
			}
		}
		if (typeof callback == "function") {
			callback();
		}

	}
	else {
		$.ajax(
			{
				url: SubmissionModel.prototype.RetrievePath,
				data: data,
				type: SubmissionModel.prototype.Retrievemethod,
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
					if (Data.code == 1)//返回无误
					{
						if (window.currentSubmission == null || typeof window.currentSubmission == "undefined") {
							window.currentSubmission = new SubmissionModel(Data.problem);
						}
						else {
							window.currentSubmission.init(Data.problem);
						}
						SubmissionModel.pushSubmissionDataCache(Data.problem);
						if (typeof callback == "function") {
							callback();
						}
						return true;
					}
					else {
						topMessage({
							Message: Data.error,
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
	}

};

SubmissionModel.prototype.ADD = function(){
	var data = this.modelData.submission;
	$.ajax(
		{
			url: SubmissionModel.prototype.AddPath,
			data: data,
			type: 'POST',
			async: true,
			dataType: "json",
			beforeSend: function(request) {
				var session_id = cookieMethods.getCookie("token");
				if(session_id!=undefined) {
					request.setRequestHeader("Session-Id",session_id);
				}
				else {
					request.setRequestHeader("Session-Id",-1);
				}
			},
			success: function (Data) {
				if (Data.code == 1)//返回无误
				{
					topMessage({
						Message:'提交成功',
						Type:'success'
					});
					if (typeof callback == "function") {
						callback();
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