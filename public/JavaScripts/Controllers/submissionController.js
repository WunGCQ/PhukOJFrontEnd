/**
 * Created by wcq on 15-4-5.
 */
window.submissionController = {};
submissionController.showSubmissionEditor = function(){
	var user_id = window.currentUser==undefined? cookieMethods.getCookie("user_id") : window.currentUser.user_id;
	if(user_id == undefined || user_id ==null || user_id == -1){
		topMessage({
			Message:'请先登陆',
			Type:'warning'
		})
	}
	if($('#create-submission-section').css("display")=="block") {
		$('#create-submission-section').hide();
	} else {
		preventTextAreaTab();
		$('#create-submission-section').show();
	}

};
submissionController.getSubmissionData = function(){

};
submissionController.submit = function(problem_id){
	var problem_id = problem_id;
	var user_id = window.currentUser==undefined? cookieMethods.getCookie("user_id") : window.currentUser.user_id;

	var language = document.getElementById("select-language").value;
	var code = document.getElementById("create-submission-code").value;
	if(code.length==0){
		topMessage({
			Message:"提交得代码不能为空",
			Type:"warning"
		});
		return;
	}
	var data = {
		"problem_id" : problem_id,
		"user_id" : user_id,
		"code": code,
		"language" : language
	};
	var new_sub = new SubmissionModel(data);
	new_sub.ADD(function(){
		submissionController.showSubmissionEditor();
	});

};