window.discussionController = {};

discussionController.showDiscussionList = function(problem_id) {
	discussionController.scope = document.getElementById("discussion-section");
	if($(discussionController.scope).css("display")=="none") {
		var d = new DiscussionModel();
		d.RETRIEVE(problem_id,function(Data){
			d.init(Data);
			d.convertContentToMD();
			var text = d.renderPage();
			$(discussionController.scope).html(text);
			$('pre code').each(function(i, block) {
				hljs.highlightBlock(block);
			});
			$(discussionController.scope).show();
		});
	}else {
		$(discussionController.scope).hide();
	}
};

discussionController.create_discussion = function(problem_id) {
	var content = document.getElementById("create-discussion-div").value;
	var d = new DiscussionModel();
	d.ADD(problem_id,content,function() {

	});
};