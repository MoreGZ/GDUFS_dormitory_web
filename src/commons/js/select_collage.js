var $ = require("jquery");
function collageSeletor(selectListDom,inputDom,status){
	this.selectListDom = selectListDom;
	this.inputDom = inputDom;
	this.value = "all";
	this.valueList = {};
	this.status = status || 0;
}

collageSeletor.prototype = {
	animate:[
		function(){
			// 显示选择框
			this.selectListDom.slideDown(200);
			// 旋转箭头
			$(".selectBtn img").css("transform","rotate(180deg)");
			// 设置status的值
			this.status = 1;
		},
		function(){
			// 显示选择框
			this.selectListDom.slideUp(200);
			// 旋转箭头
			$(".selectBtn img").css("transform","rotate(0deg)");
			// 设置status的值
			this.status = 0;
		}
	],
	selectorHandler:function(){
		this.animate[this.status].apply(this);
	},
	chooseHandler:function(_this){
		var thisEle = $(_this);

		// 改变value的值
		this.value = thisEle.attr("name");
		// 改变li的样式
		this.selectListDom.find("li").css("color","#333");
		thisEle.css("color","#3080EE");
		// console.log(this.inputDom.val());
		// 改变选择框的选择值
		this.inputDom.val(this.value);
		// console.log(this.inputDom.val());		
	},
	bindHandler:function(){
		var _this = this;
		// 绑定选择框事件
		$(".selectBtn").bind("click",this.selectorHandler.bind(this))

		// 绑定选择事件
		this.selectListDom.find('li').each(function(){
			$(this).bind("click",function(){
				_this.chooseHandler(this);
			})
		})
	},
	initData:function(){
		var _this = this;
		// 根据statuss设置是否可见
		var see = ['none','block'];
		this.selectListDom.css("display",see[this.status]);

		// 根据select来初始化valueList
		this.inputDom.find('option').each(function(){
			var thisEle = $(this);
			var key = thisEle.attr("value");
			var value  = thisEle.text();

			// push进去valuelist
			_this.valueList[key] = value;
			// push进dom里面
			var li = $("<li></li>").attr("name",key).text(value);
			// 判断是否为当前选项
			if(thisEle.attr('selected')=="selected"||thisEle.attr('selected')=="true"){
				li.css("color","#3080EE");
				_this.value = key;
			}
			_this.selectListDom.find("ul").append(li);
		})
	},
	init:function(){
		this.initData();
		this.bindHandler();
	},
}

module.exports = collageSeletor;