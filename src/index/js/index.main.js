require("../../commons/css/footer1.css");
require("../../commons/css/reset.css");
require("../../commons/css/background.css");
require("../../commons/css/header1.css");
require("../css/index.css");

var $ = require("jquery");
var adpatScreen = require("../../commons/js/adapt_screen.js");


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
var clientWidth = window.screen.width

console.log(clientWidth);
$(window).ready(function(){

	adpatScreen(bcDom,clientWidth);
	
	window.onresize = function(){
		adpatScreen(bcDom,clientWidth);
	};
	$('.searchInput').focus(focusHandler).blur(blurHandler);
})
