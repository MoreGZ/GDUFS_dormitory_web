require("../../commons/css/footer2.css");
require("../../commons/css/reset.css");
require("../../commons/css/header2.css");
require("../../commons/css/backBtn.css");
require("../css/student.css");
var selectCollage = require("../../commons/js/select_collage.js");
var $ = require("jquery");

var main = {
	currentPage:1,
	endPage: 0,
	firstPage: 1,
	data:[],
	apiUrl:$("#url1").text(),
	initData:function(){
		this.endPage = parseInt($(".page").eq($(".page").length-1).html());
		this.firstPage = parseInt($(".page").eq(0).html());

		var opd = [];
		var firstPageDom = $(".result").find("a");

		firstPageDom.each(function(){
			var x = $(this).find("ul li");
			var obj = {};
			obj.main = {};
			obj.main.name = x.eq(0).html();
			obj.main.id = x.eq(1).html();
			obj.main.major = x.eq(2).html();
			obj.main.collage = x.eq(3).html();

			obj.link = $(this).attr("href");
			opd.push(obj);
		})

		this.data.push(opd);

		this.getDataHandler();
	},
	bindHandler:function(){
		var _this = this;
		$('.nextPage').click(function(){
			_this.turnPageHandler(_this.currentPage+1,this,1);
		});
		$('.lastPage').click(function(){
			_this.turnPageHandler(_this.currentPage-1,this,-1);
		});

		$(".firstPage").click(function(){
			_this.turnPageHandler(_this.firstPage,this,0);
		});
		$(".endPage").click(function(){
			_this.turnPageHandler(_this.endPage,this,0);
		});

		$('.page').each(function(index){
			$(this).click(function(){
				var _thisPage = parseInt($(this).html());
				if(_thisPage=="...") return;
				_this.turnPageHandler(_thisPage,this,0);
			})
		})
	},
	turnPageHandler:function(aimPage,_this,type){
		if(type == undefined) type = 0;

		var _this = this;
		// 如果是当前page，直接返回
		if(this.currentPage == aimPage) return;
		// 如果是最后一页，返回
		if(this.currentPage == this.endPage && type == 1) return;
		// 如果是第一页，返回
		if(this.currentPage == this.firstPage && type == -1) return;


		this.currentPage = aimPage;
		$(".result a ul").css('opacity','0');
		$(".loading").css('opacity','1');

		// 改变按钮的内容
		this.changePageBtn(aimPage);

		// 改变按钮的颜色
		$(".pages button").each(function(){
			$(this).removeClass("select");

			if($(this).html()==aimPage) {
				$(this).addClass("select");
			}
		})

		if(this.data[aimPage-1] != undefined){
			this.changePageAnimate(aimPage);
			return;
		}

		this.getDataHandler(function(){
			_this.changePageAnimate(aimPage);
		},aimPage-1);
	},
	changePageBtn:function(aimPage){
		var _this = this;
		// 此情况不用变换btn里面的内容
		if(aimPage<this.firstPage+3) {
			$(".page").each(function(index){
				if(index<5) $(this).html(index+1);

				if(index==5) $(this).html("...");

				if(index==7) $(this).html(_this.endPage);
			})
			return;
		}

		if(aimPage>=this.endPage-3){
			$(".page").each(function(index){
				if(index>1) $(this).html(_this.endPage+index-6);

				if(index==1) $(this).html("...");

				if(index==0) $(this).html(_this.firstPage);
			})
			return;
		}

		$(".page").each(function(index){
			if(index<5) $(this).html(aimPage-2+index);

			if(index==5) $(this).html("...");

			if(index==7) $(this).html(_this.endPage);
		})
	},
	changePageAnimate:function(aimPage){
		var _this = this;
		var aimPageDom = $(".result").find("a");
		aimPageDom.each(function(index){
			var x = $(this).find("ul li");

			// x.eq(0).html(_this.currentPage);			
			x.eq(0).html(_this.data[aimPage-1][index].main.name);			
			x.eq(1).html(_this.data[aimPage-1][index].main.id);			
			x.eq(2).html(_this.data[aimPage-1][index].main.major);			
			x.eq(3).html(_this.data[aimPage-1][index].main.collage);

			$(this).attr("href",_this.data[aimPage-1][index].link);

			$(".loading").css("opacity","0");
		})

		var allCount = aimPageDom.length;
		var count = 0;
		var t = setInterval(function(){
			aimPageDom.eq(count).find("ul").css({
				"opacity":"1",
				"transition":"opacity 0.05s linear"
			});
			if(count==allCount){
				clearInterval(t);
			}
			count++;
		}, 50)
	},
	getDataHandler:function(handler,page){
		if(page==undefined) page = this.currentPage;

		var _this = this;
		if(!handler){
			handler = function(){};
		}
		$.get(this.apiUrl,{
			page:this.currentPage-1
		},function(data,status){
			data = JSON.parse(data);
			if(data.length<10){
				var obj = {};
				obj.link = "";
				obj.main = {name:"",id:"",collage:"",major:""};
				while (data.length<10) {
					data.push(obj);
				}
			}
			_this.data[page] = data;
			console.log(_this.data);
			handler();
		})
	},
	init:function(){
		// 初始化属性数据
		this.initData();
		// 绑定事件
		this.bindHandler();
	},

}


$(window).ready(function(){
	main.init();
	var selectCollage1 = new selectCollage($(".selectList"),$(".search select"),0);
	selectCollage1.init();
})