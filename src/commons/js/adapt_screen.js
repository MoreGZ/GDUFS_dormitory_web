var adapt = function($dom,fixedWidth){
	var w  = document.documentElement.clientWidth;  
	var h  = document.documentElement.clientHeight;

	var x = w/h;
	console.log(x);
	if(x<1.75){
		$dom.css("backgroundSize",fixedWidth);
	}else {
		$dom.css("backgroundSize","100%");
	}
}
module.exports = adapt;