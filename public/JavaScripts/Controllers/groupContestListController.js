/**
 * Created by wcq on 15-3-31.
 */
/**
 * Created by wungcq on 15/3/7.
 */
window.groupContestListController = {};

groupContestListController.page = 1;

groupContestListController.ContestNumberEachPage = 20;
groupContestListController.currentContestList = {};


groupContestListController.convertPageToSize = function (page) {
    if (page == null || typeof page == "undefined" || isNaN(page)) {
        var pageNumber = groupContestListController.page;
    }
    groupContestListController.start = groupContestListController.ContestNumberEachPage * (pageNumber - 1);
    return groupContestListController.start;
};

groupContestListController.showContestList = function (page, group_id) {
    groupContestListController.scopeBlock = document.getElementById('group-contest');
    if (groupContestListController.scopeBlock.getElementsByTagName("table").length == 0) {
        var group_id = group_id || window.currentGroup.group_id;
        ContestListModel.prototype.loadTemplate();
        var startPosition = groupContestListController.convertPageToSize(page);

        var pageData = {
            //start: startPosition,
            //size: groupContestListController.ContestNumberEachPage
        };


        groupContestListController.currentContestList = new ContestListModel();

        groupContestListController.currentContestList.RETRIEVE(pageData, group_id, function () {
            var contestListPageText = groupContestListController.currentContestList.renderPage();
            //contestListPageText += juicer(contestListPageText,{"page":{"page":groupContestListController.page}});
            groupContestListController.scopeBlock.innerHTML += contestListPageText;
            //groupContestListController.scopeBlock._css('display', 'block');
            var AnchorsToBind = groupContestListController.scopeBlock.getElementsByTagName("a");
            jRouter.parseAnchor(AnchorsToBind);
            //$('#contest-list').DataTable();
        });
    }


};