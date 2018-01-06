require("../../commons/css/footer1.css");
require("../../commons/css/reset.css");
require("../../commons/css/background.css");
require("../../commons/css/header1.css");
require("../css/index.css");

var $ = require("jquery");
// var adpatScreen = require("../../commons/js/adapt_screen.js");


var bcDom = $(".background .img");

var focusHandler = function(){
	$('.searchBox').css('boxShadow','0px 0px 18px 0px rgba(0,0,0,0.5)').find('label').css('opacity','0');
}
var blurHandler = function(){
	$('.searchBox').css('boxShadow','');
	var inputValue = $('.searchInput').val();
	if(inputValue==''){
		$('.searchBox label').css('opacity','1');
	}
}

function getSelectObject(){
	var url1 = $("#url1").text();
	$.ajax({
		type:"POST",
		data:{},
		url:url1,
		success:function(data,status){
			data = JSON.parse(data);
			if(data.code==5){
				alert("未登录，请先登录系统");
				return;
			}

			if(data.code==1){
				var selectObject = JSON.stringify(data.msg);
				localStorage.setItem("selectObject",selectObject);
			}
		},
		error:function(error){
			alert("服务器出现了点问题，请稍后重试")
		},
	})
}

$(window).ready(function(){
	getSelectObject();

	$('.searchInput').focus(focusHandler).blur(blurHandler);
})
