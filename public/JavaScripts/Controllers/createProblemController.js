/**
 * Created by wcq on 15-3-26.
 */
 var createProblemController = function(){
    return this;
};
createProblemController.prototype = new ProblemModel();
createProblemController.prototype.templatePath = Model.XHRPathHead()+'/templates/newProblem.html';



