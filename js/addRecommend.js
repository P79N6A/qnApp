/**
 * Created by Administrator on 2018/2/8.
 */
var app=new Vue({
    el:"#app",
    data:{
        recommendList:[],
        title:null,
        classification:false,
        productName:'全部产品',
        checkProducts:[],
        type:getQueryStringByName('type')
    },
    methods:{
        getRelist:function(tit){
            var that=this;
            $.ajax({
                url:URL+'/app/videoRoom/productlist',
                type:'get',
                dataType:'json',
                data:{
                    username:getQueryStringByName('creator'),
                    title:tit
                },
                success:function(data){
                    console.log(data);
                    if(data.state>=0){
                        that.recommendList=data.data;
                        console.log(that.recommendList);
                        that.checkProducts=[];
                        that.recommendList.forEach(function(item){
                            that.checkProducts.push({
                                title:item.title,
                                imgUrl:item.imgUrl,
                                recommendCode:item.recommendCode,
                                pid:item.pid,
                                checked:false
                            });
                        });
                        console.log(that.checkProducts);
                    }
                    
                },
                error:function(err){
                    console.log(err);
                }
            });
        },
        back:function(){
            window.history.go(-1);
        },
        checkProduct:function(item){
            item.checked=!item.checked;
        },
        addChanPin:function(){
            alreadyAdd=[];
            this.checkProducts.forEach(function(item){
                if(item.checked==true){
                    alreadyAdd.push(item);
                }
            });
            console.log(alreadyAdd);
            if(this.type==0){
                window.location.href='../html/addtrailer.html?selectedProduct='+JSON.stringify(alreadyAdd)+"&creator="+getQueryStringByName('creator')+"&pwd="+getQueryStringByName('pwd')+"&cid="+getQueryStringByName('cid')+"&recommendData="+getQueryStringByName('recommendData');
            }else if(this.type==1){
                window.location.href='../html/enterLive.html?selectedProduct='+JSON.stringify(alreadyAdd)+"&creator="+getQueryStringByName('creator')+"&cid="+getQueryStringByName('cid')+"&apptoken="+getQueryStringByName('apptoken')+"&recommendData="+getQueryStringByName('recommendData')+"&pwd="+getQueryStringByName('pwd');
            }else if(this.type==2){
                window.location.href='../html/editTrailer.html?selectedProduct='+JSON.stringify(alreadyAdd)+"&recommendData="+getQueryStringByName('recommendData')+"&creator="+getQueryStringByName('creator')+"&pwd="+getQueryStringByName('pwd');
            }
           
           //window.location.href="../html/addtrailer.html";
        },
        chooseProduct:function(){
            this.classification=!this.classification;
        },
        allProduct:function(tit){
            this.productName='全部产品';
            this.checkProducts=[];
            this.getRelist();
            this.classification=!this.classification;
        },
        jrProduct:function(tit){
            this.productName='金融产品';
            this.checkProducts=[];
            this.getRelist(tit);
            this.classification=!this.classification;
        },
        jjProduct:function(tit){
            this.productName='基金产品';
            this.checkProducts=[];
            this.getRelist(tit);
            this.classification=!this.classification;
        },
        zbProduct:function(tit){
            this.productName='直播产品';
            this.checkProducts=[];
            this.getRelist(tit);
            this.classification=!this.classification;
        }
    },
    created:function(){
        this.getRelist();
    }
});