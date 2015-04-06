/**
 * Created by wcq on 15-4-6.
 */
window.replyController = {};

replyController.showReply = function(discussion_id,Obj) {
	var scope = Obj.parentNode.nextElementSibling;
	console.log(scope);
	if($(scope).css("display")=="none") {
		var r = new ReplyModel();
		r.RETRIEVE(discussion_id, function(Data) {
			var listObj = scope.getElementsByClassName("reply-list")[0];

		});
	}
};