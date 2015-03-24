/**
 * Created by wungcq on 15/3/20.
 */
/**
 * Created by wungcq on 15/2/15.
 */
window.currentPrivilege = null;//全局对象，记录当前的题目
window.PrivilegeModel = function(problemData){
    if(problemData!=null || typeof problemData != "undefined"){
        this.init(problemData);
    }
    //避免重复加载原型模板
    if(this.template==null || typeof this.template == "undefined"){
        this.loadTemplate();
    }

    return this;
};


//Privilege 继承自数据模型类
PrivilegeModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function(){
    PrivilegeModel.prototype.templatePath = Model.XHRPathHead() + '/public/templates/problem.html';
    PrivilegeModel.prototype.AddPath      = Model.XHRPathHead() + '/api/group/membership';
    PrivilegeModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/group/membership/privilege';
    PrivilegeModel.prototype.UpdatePath   = Model.XHRPathHead() + '/api/group/membership/privilege';
    PrivilegeModel.prototype.PrivilegeDataCache = new Array();//题目的缓存,缓存的是对象的json Data,省去向服务器查询
})();

//
PrivilegeModel.prototype.init = function(problemData){
    this.modelData = {'problem':problemData};
    for(var key in problemData){
        this[key] = problemData[key];
    }
};

PrivilegeModel.getPrivilegeDataCache = function(id){
    if(PrivilegeModel.prototype.PrivilegeDataCache.length>0){
        for(var i = 0;i < PrivilegeModel.prototype.PrivilegeDataCache.length; i++){
            if(PrivilegeModel.prototype.PrivilegeDataCache[i].id = id){
                return PrivilegeModel.prototype.PrivilegeDataCache[i];
            }
        }
    }
    return false;
};
PrivilegeModel.pushPrivilegeDataCache = function(data){
    PrivilegeModel.prototype.PrivilegeDataCache.push(data);
    return;
};


//通过id获取题目信息
//todo 想清楚应不应该放在原型中，是否需要实例去调用？
PrivilegeModel.prototype.RETRIEVE = function(id,callback)
{
    if( typeof id == 'undefined'){
        var data = null;
    }else{
        var data = {'id':id};
    }
    var problemData = PrivilegeModel.getPrivilegeDataCache(id);//从缓存的题目数据中获取
    if(problemData!=false){ //存在于缓存中，说明之前取过。
        //当前题目对象不存在的情况
        if(window.currentPrivilege == null || typeof window.currentPrivilege == "undefined"){
            window.currentPrivilege = new PrivilegeModel(problemData);
        }
        else{
            //如果当亲题目就是这个题目
            if(window.currentPrivilege.id = id){
                //什么都不做
            }
            else{
                //如果不是
                window.currentPrivilege.init(problemData);
            }
        }
        if(typeof callback == "function"){
            callback();
        }

    }
    else{
        ajax.send(
            {
                url: PrivilegeModel.prototype.RetrievePath,
                data: data,
                type: PrivilegeModel.prototype.Retrievemethod,
                async: false,
                dataType: "json",
                success: function(Data) {
                    if (Data.code == 1)//返回无误
                    {
                        if(window.currentPrivilege == null || typeof window.currentPrivilege == "undefined"){
                            window.currentPrivilege = new PrivilegeModel(Data.problem);
                        }
                        else{
                            window.currentPrivilege.init(Data.problem);
                        }
                        PrivilegeModel.pushPrivilegeDataCache(Data.problem);
                        if(typeof callback == "function"){
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
                fail:function(){
                    topMessage({
                        Message:'服务器连接异常，请检查网络或稍后重试',
                        Type:'fail'
                    });
                }
            }
        );
    }

};