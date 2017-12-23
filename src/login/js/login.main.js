var $ = require("jquery");
require("../css/login.css");
require("../../commons/css/reset.css");
require("../../commons/css/footer1.css")
require("../../commons/css/background.css")

// var adpatScreen = require("../../commons/js/adapt_screen.js");

var bcDom = $(".background .img");
var clientWidth = window.screen.width

$(window).ready(function(){
	var input1 = $('.username input');
	var input2 = $(".password input");

	input1.focus(function(){
		$(".username").css("background","white");
		$(".username input").css("color","#3080ee");
		$(".username label").css("color","#3080ee");
	})
	input1.blur(function(){
		$(".username").css("background","none");
		$(".username input").css("color","white");
		$(".username label").css("color","#fff");
	})

	input2.focus(function(){
		$(".password").css("background","white");
		$(".password input").css("color","#3080ee");
		$(".password label").css("color","#3080ee");
	})
	input2.blur(function(){
		$(".password").css("background","none");
		$(".password input").css("color","white");
		$(".password label").css("color","#fff");
	})

	// adpatScreen(bcDom,clientWidth);
	
	// window.onresize = function(){
	// 	adpatScreen(bcDom,clientWidth);
	// }
})