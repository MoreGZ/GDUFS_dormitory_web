require("../../commons/css/footer2.css");
require("../../commons/css/reset.css");
require("../../commons/css/header2.css");
require("../../commons/css/backBtn.css");
require("../css/dormitory_imformation_a.css")

var $ = require("jquery");

var list = {
	allData:[],
	nullData:[],
	status:1,
	bindHandler:function(){
		var _this = this;
		$(".show_btn").click(function(){
			if(_this.status==1) {
				_this.showNullHandler();
				_this.status = 0;
				return;
			}
			if (_this.status==0) {
				_this.showAllHandler();
				_this.status = 1;
				return;
			}
		})
	},
	initData:function(){
		var _this = this;
		var x = new RegExp('[0-9]*');
		$(".none_main ul").each(function(){
			$(this).find("a").each(function(){
				var obj = {};
				obj.link = $(this).attr("href");
				obj.room = $(this).find("li").eq(0).text();
				obj.room = x.exec(obj.room)[0]; 
				obj.nullCount = $(this).find("li").eq(1).text();
				obj.nullCount = x.exec(obj.nullCount)[0];

				if(obj.nullCount != 0){
					_this.nullData.push(obj);
					$(this).css("color","#3080EE");
				}
				_this.allData.push(obj);

			})
		})

		console.log(_this.allData);
		console.log(_this.nullData);
	},
	init:function(){
		this.initData();
		this.bindHandler();
	},
	showAllHandler:function(){
		this.changeDom(this.allData);
	},
	showNullHandler:function(){
		this.changeDom(this.nullData);
	},
	changeDom:function(data){
		var _this = this;
		var liDoms = $(".none_main ul");
		var dl = data.length;
		var i = 0;
		// console.log(data);
		liDoms.each(function(){
			$(this).find("a").each(function(){
				var thisDom = $(this);
				thisDom.css("display","inline-block");

				if(i<dl){
					thisDom.attr('href',data[i].link)
					.find("li").eq(0).text(data[i].room+"室").next("li")
					.text(data[i].nullCount+"空床位");


					if(data[i].nullCount!=0){
						thisDom.css("color","#3080EE");
					}else {
						thisDom.css("color","black");
					}
					i++;	
				}else{
					thisDom.css("display","none");
				}
			})
		});
	}
}

$(window).ready(function(){
	list.init();
})