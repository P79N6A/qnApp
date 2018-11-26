$(function(){
    
    function getQueryStringByName(name){
        var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));

        if(result == null || result.length < 1){

            return "";
        }

         return result[1];
    }
    var apptoken=getQueryStringByName('apptoken');
    var creater=getQueryStringByName('creator');
    var app = new Vue({
        el:"#app",
        data:{
            listMessage:[],
            mescroll:null,
            page:1,
            pagesize:3,
            count:null,
            lock:false,
            timeoutMessage:[],
        },
        methods:{
            getList:function(){
                var that=this;
                $.ajax({
                    url:URL+"/app/manager/channellist",
                    type:"get",
                    dataType:"json",
                    data:{
                        token:apptoken,
                        creator:creater,
                        pagecount:this.pagesize,
                        startindex:this.page
                    },
                    success:function(data){
                        that.page++;
                        console.log(data);
                        if(data.state.rc==0){
                            that.count=data.pagingrows.totalcount;
                            for(var i=0;i<data.pagingrows.rows.length;i++){
                                that.listMessage.push(data.pagingrows.rows[i]);
                            }
                            console.log(that.listMessage);
                            that.lock=true;
                            that.listMessage.forEach(function(item){
                                var isHave=that.timeoutMessage.indexOf(item);
                                if( item.count_num && (isHave==-1)){
                                    that.timeoutMessage.push(item);
                                }
                            });
                                
                            
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            },
            checkTime:function(i){
                if(i<10) {
                     i = "0" + i;
                 }
                 return i;
             },
            leftTimea:function(time){
            
                var leftTime = time; //计算剩余的毫秒数
                var hours = parseInt(leftTime / 1000 / 60 / 60 , 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                hours = this.checkTime(hours);
                minutes = this.checkTime(minutes);
                seconds = this.checkTime(seconds);
                //document.getElementById("timer").innerHTML =  hours+":" + minutes+":"+seconds;
                time = hours+":" + minutes+":"+seconds;
                return time;
         },
            pushLive:function(item){
                listId=item.id;
                console.log(JSON.stringify(item));
                console.log(URL);
                window.channelsoft.loading();
                var postData={
                    token:apptoken,
                    channelid:item.id
                };
                $.ajax({
                    url:URL+"/webapi/livechannel/start",
                    type:"post",
                    dataType:"json",
                    data:JSON.stringify(postData),
                    success:function(data){
                        console.log(data);
                        if(data.state.rc>=0){
                            window.channelsoft.startPushLive(JSON.stringify(item));
                        }
                    },
                    error:function(err){
                       
                        console.log(err);
                    }
                });
                
            },
            interLive:function(item){
                console.log(JSON.stringify(item));
                window.channelsoft.startInterLive(JSON.stringify(item));
            },
            share:function(item){
                var shareData={
                    "sharepageurl":item.share,
                    "column_name":item.column_name,
                    "name":item.name
                };
                window.channelsoft.shareLiveInfo(JSON.stringify(shareData));
            },
            getScrollTop:function(el){
                 return document.getElementById(el).scrollTop;
            },
            getClientHeight:function(el){
                return document.getElementById(el).clientHeight;
            },
            getScrollHeight:function(el){
                return document.getElementById(el).scrollHeight;
             },
             loadMore:function(){
                 var loadMoreCount=Math.ceil(this.count/(this.pagesize));
                if(this.page<=loadMoreCount){
                    this.getList();
                }
            },
            downCallback:function(){
                var that=this;
                $.ajax({
                    url:URL+"/app/manager/channellist",
                    type:"get",
                    dataType:"json",
                    data:{
                        token:apptoken,
                        creator:creater,
                        pagecount:this.pagesize,
                        startindex:1
                    },
                    success:function(data){
                        // that.page++;
                        console.log(data);
                        if(data.state.rc==0){
                            that.count=data.pagingrows.totalcount;
                            that.listMessage=[];
                            for(var i=0;i<data.pagingrows.rows.length;i++){
                                that.listMessage.push(data.pagingrows.rows[i]);
                            }
                            console.log(that.listMessage);
                            that.lock=true;
                            that.timeoutMessage=[];
                            that.listMessage.forEach(function(item){
                                var isHave=that.timeoutMessage.indexOf(item);
                                if( item.count_num && (isHave==-1)){
                                    that.timeoutMessage.push(item);
                                }
                            });
                                
                          mescroll.endSuccess();  
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            }
                
        },
        created:function(){
            var that=this;
            this.getList();
             mescroll = new MeScroll("mescroll", {
				down: {
					auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
					callback: that.downCallback //下拉刷新的回调
				}
			});
            console.log(that.timeoutMessage)
            setInterval(function(){
                that.timeoutMessage.forEach(function(item,index){
                    
                    // if(that.page==2){
                        item.count_num -=1000;
                    // }else if(that.page==3){
                    //     item.count_num -=500;
                    // }
                    
                    if(item.count_num<=0){
                        $('.apportTimeout').eq(index).css('display','none');
                        window.location.reload();
                    }else{
                        var time=that.leftTimea(item.count_num)
                        $('.timeFont').eq(index).html(time);
                    }
                  
                });
           },1000);
        //    $('.list').on('scroll',function(){
        //         console.log(123);
        //         if(that.getScrollTop() + that.getClientHeight() >= (that.getScrollHeight())-60) {
        //                 if(that.lock){
        //                     that.loadMore();   
        //                     that.lock=false; 
        //                 }            
        //         }
        //    })
           document.getElementById('mescroll').onscroll=function(){
                console.log(123);
                if(that.getScrollTop('mescroll') + that.getClientHeight('mescroll') >= (that.getScrollHeight('mescroll'))-60) {
                        if(that.lock){
                            that.loadMore();   
                            that.lock=false; 
                        }            
                }
           }
        }
    });
    window.stopLive=function(state){
        var stopData={
            channelid:listId,
            token:apptoken
        };
       
        if(state==1){
            $.ajax({
                url:URL+"/webapi/livechannel/close",
                type:"post",
                dataType:"json",
                data:JSON.stringify(stopData),
                success:function(data){
                   
                    if(data.state.rc>=0){
                        
                        window.channelsoft.stopLiveSuccess();
                    }else{
                        window.channelsoft.closeLiveFailed();
                    }
                },
                error:function(err){
                   
                    console.log(err);
                    showTip('退出直播失败');
                    window.channelsoft.closeLiveFailed();
                }
            });
        }else if(state==0){
            $.ajax({
                url:URL+"/webapi/livechannel/pause",
                type:"post",
                dataType:"json",
                data:JSON.stringify(stopData),
                success:function(data){
                   
                    if(data.state.rc>=0){
                        window.channelsoft.pauseLiveSuccess();
                    }
                },
                error:function(err){
                   
                    console.log(err);
                    showTip('暂停直播失败');
                    window.channelsoft.closeLiveFailed();
                }
            });
        }
    }
})