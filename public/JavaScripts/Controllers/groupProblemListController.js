/**
 * Created by wcq on 15-3-31.
 */
window.groupProblemListController = {};

groupProblemListController.page = 1;


groupProblemListController.ProblemNumberEachPage = 20;
groupProblemListController.currentProblemList = {};


groupProblemListController.convertPageToSize = function (page) {
	if (page == null || typeof page == "undefined" || isNaN(page)) {
		var pageNumber = groupProblemListController.page;
	}
	groupProblemListController.start = groupProblemListController.ProblemNumberEachPage * (pageNumber - 1);
	return groupProblemListController.start;
};

groupProblemListController.showProblemList = function (page,group_id) {
	groupProblemListController.scopeBlock = document.getElementById('group-problem');
	if(groupProblemListController.scopeBlock.getElementsByTagName("table").length == 0){
		ProblemListModel.prototype.loadTemplate();
		var page = page || 1;
		var startPosition = groupProblemListController.convertPageToSize(page) || 0;

		var pageData = {
			start: startPosition,
			size: groupProblemListController.ProblemNumberEachPage
		};

		groupProblemListController.currentProblemList = new ProblemListModel();
		groupProblemListController.currentProblemList.RETRIEVE(pageData,group_id, function (Data) {
			//var problemListPageText = groupProblemListController.currentProblemList.renderPage();
			var problemListPageText = juicer(ProblemListModel.prototype.template,Data);
			//problemListPageText += juicer(problemListPageText,{"page":{"page":groupProblemListController.page}});
			groupProblemListController.scopeBlock.innerHTML += problemListPageText;
			//groupProblemListController.scopeBlock._css('display', 'block');
			var AnchorsToBind = groupProblemListController.scopeBlock.getElementsByTagName("a");
			jRouter.parseAnchor(AnchorsToBind);
		});

	}


};
