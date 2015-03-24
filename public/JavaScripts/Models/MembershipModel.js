/**
 * Created by wungcq on 15/3/20.
 */
/**
 * Created by wungcq on 15/2/15.
 */
//MembershipController.currentMembership = null;//全局对象，记录当前的题目
window.MembershipModel = function(membershipData){
    if(membershipData!=null || typeof membershipData != "undefined"){
        this.init(membershipData);
    }
    //避免重复加载原型模板
    if(this.template==null || typeof this.template == "undefined"){
        this.loadTemplate();
    }

    return this;
};


//Membership 继承自数据模型类
MembershipModel.prototype = new Model();
//需要设置每个数据模型的增删改查路径
(function(){
    MembershipModel.prototype.templatePath = Model.XHRPathHead() + '/templates/membership.html';
    MembershipModel.prototype.AddPath      = Model.XHRPathHead() + '/api/group/membership/';
    MembershipModel.prototype.RetrievePath = Model.XHRPathHead() + '/api/group/membership/list';
    MembershipModel.prototype.UpdatePath   = Model.XHRPathHead() + '/api/group/membership/update';
    MembershipModel.prototype.joinPath     = Model.XHRPathHead() + '/api/group/membership/';
   // MembershipModel.prototype.MembershipDataCache = new Array();//题目的缓存,缓存的是对象的json Data,省去向服务器查询
})();

//
MembershipModel.prototype.init = function(membershipData){
    this.modelData = {'membership':membershipData};
    if(!membershipData instanceof Array){
        for(var key in membershipData){
            this[key] = membershipData[key];
        }
    }

};

//MembershipModel.getMembershipDataCache = function(id){
//    if(typeof MembershipModel.prototype.MembershipDataCache != "undefined" && MembershipModel.prototype.MembershipDataCache.length>0){
//        for(var i = 0;i < MembershipModel.prototype.MembershipDataCache.length; i++){
//            if(MembershipModel.prototype.MembershipDataCache[i].user_id = id){
//                return MembershipModel.prototype.MembershipDataCache[i];
//            }
//        }
//    }
//    return false;
//};
MembershipModel.pushMembershipDataCache = function(data){
    MembershipModel.prototype.MembershipDataCache.push(data);
    return;
};


//通过id获取题目信息
//todo 想清楚应不应该放在原型中，是否需要实例去调用？
MembershipModel.prototype.RETRIEVE = function(id,callback)
{
    if( typeof id == 'undefined'){
        var data = null;
    }else{
        var data = {'id':id};
    }
   // var membershipData = MembershipModel.getMembershipDataCache(id);//从缓存的题目数据中获取
   // if(membershipData!=false){ //存在于缓存中，说明之前取过。
   //     //当前题目对象不存在的情况
   //     if(window.currentMembership == null || typeof window.currentMembership == "undefined"){
   //         window.currentMembership = new MembershipModel(membershipData);
   //     }
   //     else{
   //         //如果当亲题目就是这个题目
   //         if(window.currentMembership.id = id){
   //             //什么都不做
   //         }
   //         else{
   //             //如果不是
   //             window.currentMembership.init(membershipData);
   //         }
   //     }
   //     if(typeof callback == "function"){
   //         callback();
   //     }
   //
   // }
    if(1){
        ajax.send(
            {
                url: MembershipModel.prototype.RetrievePath,
                data: data,
                type: MembershipModel.prototype.Retrievemethod,
                async: false,
                dataType: "json",
                success: function(Data) {
                    if (Data.code == 1)//返回无误
                    {
                        if(MembershipController.currentMembership == null || typeof MembershipController.currentMembership == "undefined"){
                            MembershipController.currentMembership = new MembershipModel(Data.content);
                        }
                        else{
                            MembershipController.currentMembership.init(Data.content);
                        }
                        //MembershipModel.pushMembershipDataCache(Data.membership);
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

