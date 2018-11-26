/**
 * Created by Administrator on 2018/2/2.
 */
$(function(){
    var app = new Vue({
        el:"#app",
        data:{
            listMessage:[],
            datamsg:null,
            desc:null,
            cid:null,
            tid:null
        },
        methods:{
            getList:function(_cid){
                var that=this;
                $.ajax({
                    url:'http://livetapi.v114.com/appapi/question/getquestions',
                    type:"get",
                    dataType:"json",
                    data:{
                        // cid:_cid
                    },
                    success:function(data){
                        if(data.state.rc==0){
                            console.log(data.result);
                            for(var i=0;i<data.result.questions.length;i++){
                                that.listMessage.push(data.result.questions[i]);
                            }
                            that.cid=data.result.c_id;
                            that.tid=data.result.t_id;
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            },
            pushRecommend:function(item,index){
                //var item = item;
               // console.log(item);
                this.datamsg = {'c_id':this.cid,'t_id':this.tid,'q_id':item.q_id};
                this.desc={'questionNumber':index};
                $(".commend").show();
                $(".normal").removeClass("check").eq(index).addClass("check");
            },
            recommend:function () {
                console.log( this.recommendMsg)
                //initDanmu("songlk","5a6893de9151935bc54a5e54af984c00");
                var dataMsg=JSON.stringify(this.datamsg);
                var Desc=JSON.stringify(this.desc);
                onSendQuestion(dataMsg,Desc,'ANSWER');
                $(".normal").removeClass("check");
            }

        },
        beforeCreate:function () {

        },
        created:function(){
            var self=this;
            window.initProduct=function(_cid,userid,topicid) {
                self.getList(_cid);
               // alert('topicid'+topicid);
                initTcDanmu(userid,topicid);
         };
        }
    })
})