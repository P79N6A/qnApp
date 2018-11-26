/**
 * Created by Administrator on 2018/1/24.
 */
var feed = location.host.split('.')[0];
var URL = window.location.protocol+"//"+feed+'api.v114.com';
var URL='http://liveapi.v114.com';
var listId;
$(".back").click(function () {
    goBack();
});
function timeTranfer(time){
    var date=new Date(time);
    return date.getTime();
}
function getQueryStringByName(name){
    var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));

    if(result == null || result.length < 1){

        return "";
    }

     return result[1];
}
function goBack(){
    window.history.go(-1);
}
function getCompanyId(name){
    var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
    if(result == null || result.length < 1){
        return "";
    }
     return result[1];
}

//获取图片验证码
var timeflag = new Date().getTime();
var timeflag2;
getCode();
function getCode() {
        $(".picImg").prop("src",URL+"/appapi/wx/getimgcode?timeflag="+timeflag);
        timeflag2 = timeflag;
        timeflag = new Date().getTime();
};




/*显示提醒*/
function showTip(msg) {
    var topTip = $("<div class='tip'><div class='fadeIn'>"+msg+"</div></div>");
    $("body").append(topTip);
    setTimeout(function() {topTip.remove();},2000);
}
//显示错误提醒
function showError(className) {
    $("."+className+"").css({"visibility":"visible"});
    setTimeout(
        function() {
            $("."+className+"").css({"visibility":"hidden"});
        },2000);
};

//实现滚动条无法滚动
var mo=function(e){e.preventDefault();};
/***禁止滑动***/
function stop(){
    document.body.style.overflow='hidden';
    document.addEventListener("touchmove",mo,false);//禁止页面滑动
}
/***取消滑动限制***/
function move(){
    document.body.style.overflow='';//出现滚动条
    document.removeEventListener("touchmove",mo,false);
}

function focusId(id){
    if(id.length >0){
        var input = document.getElementById(id);
        var val = input.value;
        input.value = "";
        input.value = val;
        document.getElementById(id).focus();
    }
};


function isPhoneNumber(phoneNumber){
    var isPhone = true;
    if(phoneNumber == null || phoneNumber == ''){
        isPhone =  false;
    }
    if(phoneNumber.length != 11){
        isPhone = false;
    }
    var str = "^[1][3,4,5,7,8][0-9]{9}$";
    //var str=/^[1][3,4,5,7,8][0,9]{9}$/;
    if(!phoneNumber.match(str)){
        isPhone = false;
    }
    return isPhone;
}

// 验证码倒计时
function setRemainTime() {

    if (count <= 0) {
        //	$("#generCode").removeClass("bcolor3").addClass("bcolor2");
        $("#stext").show();
        $("#timer").hide();
        count = 60;
        generate = false;
    } else {
        //	$("#generCode").removeClass("bcolor2").addClass("bcolor3");
        $('#timer').html(count + 's后重发');
        count--;
        setTimeout(setRemainTime, 1000);
    }
};
function checkPhone(phone) {

    var len = phone.length;
    if (len != 11 ||!isPhoneNumber(phone) ) {
        return false;
    }
    return true;
};





























