require("../../commons/css/footer2.css");
require("../../commons/css/reset.css");
require("../../commons/css/header2.css");
require("../../commons/css/backBtn.css");
require("../css/counselor.css");

var $ = require("jquery");
function selector(value,dom){
	this.selectStatus = 0;
	this.value = value;
	this.dom = dom;
	this.options = [];
}

selector.prototype = {
	bindHandler:function(){
		var _this = this;
		// 绑定展示和隐藏选项事件
		this.dom.find('.select_title').bind('click',function(){
			if(_this.selectStatus == 0){
				_this.showSelectAnimate.apply(_this);
				_this.selectStatus = 1;
				return;
			}

			if(_this.selectStatus == 1){
				_this.hideSelectAnimate.apply(_this);
				_this.selectStatus = 0;
				return;
			}
		});
		// this.dom.bind('mouseleave',this.hideSelectAnimate.bind(this));
		// 绑定选择选项事件
		this.dom.find('li').each(function(index){
			$(this).bind("click",function(){
				_this.changeCounselorHandler(index);
				_this.hideSelectAnimate.apply(_this);
				_this.selectStatus = 0;
			});
		});
	},
	setCounselor:function(value){
		this.value = value;
		this.changeDomStatus();
	},
	changeCounselorHandler:function(index){
		this.setCounselor(this.options[index]);
	},
	changeDomStatus:function(){
		this.dom.find('.select_title').text(this.value);
	},
	showSelectAnimate:function(){
		this.dom.find('img').css("transform","rotate(180deg)");
		this.dom.css('boxShadow','0px 0px 20px 0px rgba(48,128,238,0.2)').children("ul").css('zIndex','2').slideDown(200);
	},
	hideSelectAnimate:function(){
		this.dom.find('img').css("transform","rotate(0deg)");
		this.dom.css('boxShadow','').children("ul").slideUp(200);
	},
	initOption:function(){
		var _this = this;
		this.dom.find("li").each(function(){
			_this.options.push($(this).text());
		})
	},
	init:function(){
		this.bindHandler();
		this.initOption();
	}
}


var main = {
	apiUrl1:$("#url1").text(),
	apiUrl2:$("#url2").text(),
	data:[],
	sendData:[],
	currentPage:1,
	firstPage:1,
	endPage:NaN,
	status:1,
	selector:[],
	selectValue:[],
	init:function(){
		this.initData();
		this.bindHandler();
	},
	bindHandler:function(){
		var _this = this;
		// 绑定选择事件
		for(index in this.selector){
			this.selector[index].init();
		}

		// 绑定编辑事件
		$(".changeBtn").bind("click",this.changeHandler.bind(this))

		// 绑定取消编辑事件
		$(".cansoleChangeBtn").bind("click",this.cansoleChangeHandler.bind(this))

		// 绑定保存事件
		$(".saveBtn").bind("click",this.saveHandler.bind(this))

		// 绑定换页事件
		$('.nextPage').click(function(){
			_this.turnPageHandler(_this.currentPage+1,this,1);
		});
		$('.lastPage').click(function(){
			_this.turnPageHandler(_this.currentPage-1,this,-1);
		});

		$(".firstPage").click(function(){
			_this.turnPageHandler(_this.firstPage,this,0);
		})
		$(".endPage").click(function(){
			_this.turnPageHandler(_this.endPage,this,0);
		})

		$('.page').each(function(index){
			$(this).click(function(){
				var _thisPage = parseInt($(this).html());
				if(_thisPage=="...") return;
				_this.turnPageHandler(_thisPage,this,0);
			})
		})
	},
	initData:function(){
		var _this = this;

		// 初始化data和selector
		// 获取第一页的数据
		_this.data[0] = [];
		var selectorDoms = $(".select");
		$(".main_body_main").find('.li').each(function(index){
			var obj = ['collage','className','counselor']
			var _index = index;
			_this.data[0][_index] = {};
			$(this).children('ul').children("li").each(function(index){
				_this.data[0][_index][obj[index]] = $(this).text();
			})
			// 初始换selector
			_this.selector[_index] = new selector(_this.data[0][_index]['counselor'],selectorDoms.eq(_index));
		})
		// 获取第二页的数据
		this.getDataHandler();

		// 初始化page数据
		this.endPage = parseInt($(".page").eq($(".page").length-1).html());
		this.firstPage = parseInt($(".page").eq(0).html());
	},
	setCounselor:function(){
		for(i in this.selectValue){
			for(j in this.selectValue[i]){
				if(this.data[i][j].counselor != this.selectValue[i][j]){
					this.data[i][j].counselor = this.selectValue[i][j];
					$('.li').eq(j).find('li').eq(2).text(this.data[this.currentPage-1][j].counselor)
					this.sendData.push(this.data[i][j]);
				}
			}
		}
	},
	editSendData:function(index){	
	},
	setSelectValue:function(){
		this.selectValue[this.currentPage-1] = [];
		for(index in this.selector){
			this.selectValue[this.currentPage-1][index] = this.selector[index].value;
		}
		console.log(this.selectValue);
	},
	reSetSelectValue:function(){
		// 将selectValue变回编辑前
		for(var j=0;j<this.data.length;j++){
			this.selectValue[j] = [];
			for(var i=0;i<this.data[j].length;i++){
				this.selectValue[j][i] = this.data[j][i].counselor;
			}
		}
		for(var i=0;i<this.data[this.currentPage-1].length;i++){
			this.selector[i].setCounselor(this.data[this.currentPage-1][i].counselor);
		}
		console.log(this.selectValue);
	},
	getDataHandler:function(handler,page){
		if(page==undefined) page = this.currentPage;

		var _this = this;
		if(!handler){
			handler = function(){};
		}

		// 后台获取数据
		$.get(this.apiUrl1,{
			page:this.currentPage
		},function(data,status){
			data = JSON.parse(data);
			_this.data[page] = data;
			console.log(_this.data);
			handler();
		})
	},
	sendDataHandler:function(){
		console.log(this.sendData);
		// 向后台发送数据
		var _this = this;
		$.post(this.apiUrl2,{
			data : this.sendData
		},function(data,status){
			if (status!="success") {
				_this.status = "send";
				alert(status);
				return;
			}

			if(data.status == 0){
				_this.stutas = "send";
				alert("保存失败，请重试");
				return;
			}

			_this.sendData = [];

		})
	},
	changeHandler:function(){
		this.setStatus(0);
		console.log(this.selectValue);
	},
	cansoleChangeHandler:function(){
		this.setStatus(1);
		this.reSetSelectValue();
	},
	saveHandler:function(){
		this.setStatus(1);
		this.setSelectValue();
		this.setCounselor();
		this.sendDataHandler();
	},
	setStatus:function(status){
		this.status = status;
		this.changeDomStatus();
	},
	changeDomStatus:function(){
		if(this.status == 0){
			$(".main_body_main").removeClass('normal').addClass('edit').find('ul li').eq(2).css('opacity','0');
			$(".changeBtn").css('display','none');
			$(".cansoleChangeBtn").css('display','inline-block');
			return;
		}

		if(this.status == 1){
			$(".main_body_main").removeClass('edit').addClass('normal').find('ul li').eq(2).css('opacity','1');
			$(".changeBtn").css('display','inline-block');
			$(".cansoleChangeBtn").css('display','none');
			return;
		}
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

		// 保存选择框的数据
		this.setSelectValue();

		this.currentPage = aimPage;
		$(".main_body_main .li").children('ul').each(function(){
			$(this).css('opacity','0')
		});
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
		var aimPageDom = $(".li").children("ul");
		// 改变内容
		aimPageDom.each(function(index){
			var x = $(this).find("li");
			x.eq(0).html(_this.data[aimPage-1][index].collage);					
			x.eq(1).html(_this.data[aimPage-1][index].className);			
			x.eq(2).html(_this.data[aimPage-1][index].counselor);			

		 	_this.selector[index].setCounselor(_this.selectValue[aimPage-1] ? _this.selectValue[aimPage-1][index] : _this.data[aimPage-1][index].counselor);
			$(".loading").css("opacity","0");
		})

		// 出现动画
		var allCount = aimPageDom.length;
		var count = 0;
		var t = setInterval(function(){
			aimPageDom.eq(count).css({
				"opacity":"1",
				"transition":"opacity 0.05s linear"
			});
			if(count==allCount){
				clearInterval(t);
			}
			count++;
		}, 50)
	},

}

$(window).ready(function(){
	main.init();
})