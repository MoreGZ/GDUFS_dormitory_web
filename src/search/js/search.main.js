require("../../commons/css/footer2.css");
require("../../commons/css/reset.css");
require("../../commons/css/header2.css");
require("../../commons/css/backBtn.css");
require("../css/search.css");
var $ = require("jquery");
var selectCollage = require("../../commons/js/select_collage.js");
var url3 = $('#url1').text();


var loadMore = {
	page: 1,
	ifHasAlert: false,
	resultCount: $(".main1").length+$(".main2").length,
	liType:["main1","main2"],
	addMore:function(data){
		var data = JSON.parse(data);
		if(!data && !this.ifHasAlert){
			alert("已经没有更多记录");
			this.ifHasAlert = true;
			return;
		}

		var searchResultBox = $(".result");
		for(index in data){

			var link = $("<a></a>").attr("href",data[index].link);
			var liDom = $("<li></li>").attr("class",this.liType[(index+this.resultCount)%2]);
			var ul = $("<ul></ul>");

			for(key in data[index].main){
				var li = $("<li></li>").html(data[index].main[key]);
				ul.append(li);
			}

			liDom.append(ul);
			link.append(liDom);

			searchResultBox.append(link);
			this.resultCount++;
		}
		this.page++;
	},
	bindHandler:function(){
		var _this = this;
		// window.onmousewheel = function(){
		// 	var scrollTop = $(this).scrollTop();//当前窗口的滚动距离
		// 	console.log("xxx");
		// 	var clientHeight = document.documentElement.clientHeight;
		// 	var scrollHeight = document.documentElement.scrollHeight;
		// 	var offsetHeight = document.body.offsetHeight;
		// 	var scrollBottom = offsetHeight-scrollTop-clientHeight;
		// 	// console.log(scrollTop+"  "+scrollHeight+"  "+clientHeight+"  "+offsetHeight);
		// 	if(scrollBottom<20 && ){
		// 		_this.loadMoreHandler();
		// 	}
		// }
		$(window).bind("scroll",function(){
			var scrollTop = $(this).scrollTop();//当前窗口的滚动距离
			var clientHeight = document.documentElement.clientHeight;
			var offsetHeight = document.body.offsetHeight;
			var scrollBottom = parseInt(offsetHeight-scrollTop-clientHeight);
			if(scrollBottom<20){
				_this.loadMoreHandler();
			}
		})
		$(".moreBtn").click(function(){
			_this.loadMoreHandler();
		})
	},
	loadMoreHandler:function(){
		var _this = this;
		$.get(url3,{
			page:this.page
		},function(data,status){
			_this.addMore(data);
		})
	},
	init:function(){
		this.bindHandler();
	}
}



$(window).ready(function(){
	loadMore.init();
	var selectCollage1 = new selectCollage($(".selectList"),$(".search select"),0);
	selectCollage1.init();
})
