require("../../commons/css/footer2.css");
require("../../commons/css/reset.css");
require("../../commons/css/header2.css");
require("../../commons/css/backBtn.css");
require("../css/student_imformation.css");
var $ = require("jquery");
var url1 = $("#url1").text();
var url2 = $("#url2").text();

function createMainBox(title,li1,li2){
	var obj = {};
	// 获取信息，构造对象
	obj.title = title;
	obj.li1 = li1;
	obj.li2 = li2;
	// 定义目前的状态，normal表示平时，edit表示正在编辑，send为课发送状态
	obj.status = "normal"
	// 记录当前编辑的记录
	obj.data = {};

	obj.handler = {
		eidtHandler:function(){
			if(this.status=="edit"){
				return;
			}

			for(index in this.li1){
				$('.'+this.title).find('.'+this.li1[index]).css('display','none').siblings('input').css('display','inline-block').siblings('label').css('display','inline-block');
			}
			for(index in this.li2){
				$('.'+this.title).find('.'+this.li2[index]).attr('disabled',false);
			}
			// 聚焦第一个input
			this.methods.focus.apply(obj);
			// 变成edit状态
			this.status = 'edit';
		},
		cansoleHandler:function(){
			if(this.status=="normal"){
				return;
			}
			// 变回原形
			for(index in this.li1){
				$('.'+this.title).find('.'+this.li1[index]).css('display','inline-block')
				.siblings('input').css('display','none')
				.siblings('label').css('display','none');
			}
			for(index in this.li2){
				$('.'+this.title).find('.'+this.li2[index]).attr('disabled','disabled');
			}
			// 回到normalz
			this.status = 'normal';
		},
		saveHandler:function(){
			if(this.status=="normal"){
				return;
			}
			// 改变数据
			for(index in this.li1){
				// 处理单选框
				if(this.li1[index]=='ifPoor' || this.li1[index]=='ifInsurance'){
					var value = $("input[name='"+this.li1[index]+"']:checked").val();
					this.data[this.li1[index]] = value;
					$('.'+this.li1[index]).html(value);
					continue;
				}

				var value = $("input[name='"+this.li1[index]+"']").val();
				this.data[this.li1[index]] = value;
				$('.'+this.li1[index]).html(value);
			}
			for(index in this.li2){
				this.data[this.li2[index]] = $('.'+this.li2[index]).val();
			}
			// 变回原形
			for(index in this.li1){
				$('.'+this.title).find('.'+this.li1[index]).css('display','inline-block')
				.siblings('input').css('display','none')
				.siblings('label').css('display','none');
			}
			for(index in this.li2){
				$('.'+this.title).find('.'+this.li2[index]).attr('disabled','disabled');
			}
			// 发送数据
			var _this = this;
			$.post(url1,{
				type : this.title,
				data : this.data
			},function(data,status){
				// console.log(_this.data);
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
			})
			// 回到normalz
			this.status = 'normal';
		},
		showInsurance:function(){
			console.log($('input[name="ifInsurance"]:checked').val());
			if($('input[name="ifInsurance"]:checked').val()=='有'){
				$('input[name="insurance"]').css("display","inline-block")
			}
			if($('input[name="ifInsurance"]:checked').val()=='无'){
				$('input[name="insurance"]').css("display","none").val("");
			}
		}
	}

	obj.methods = {
		initFormData:function(){
			for(index in this.li1){
				// 处理单选框
				if(this.li1[index]=='ifPoor' || this.li1[index]=='ifInsurance'){
					var value = $('.'+this.li1[index]).html();
					this.data[this.li1[index]] = value;
					$("input[name='"+this.li1[index]+"'][value='"+value+"']").attr("checked","true");
					continue;
				}

				var value = $('.'+this.li1[index]).html();
				this.data[this.li1[index]] = value;
				$("input[name='"+this.li1[index]+"']").val(value);
			}

			for(index in this.li2){
				this.data[this.li2[index]] = $('.'+this.title).find('.'+this.li2[index]).val()
			}
		},
		bindHandler:function(){
			var _this = this;
			$('.'+this.title).find('.editBtn').click(function(){
				if(_this.status=='edit'){
					_this.handler.cansoleHandler.apply(_this);
					$(this).text("编辑")
					return;
				}
				if(_this.status=='normal'){
					_this.handler.eidtHandler.apply(_this);
					$(this).text("取消")
					return;
				}
				
			});

			$('.'+this.title).find('.saveBtn').click(function(){
				_this.handler.saveHandler.apply(_this);
			});

			// console.log(this.li1);
			for(index in _this.li1){
				if(_this.li1[index]=='ifInsurance'){

					$("input[name='ifInsurance']").change(function(){
						// console.log(x);
						_this.handler.showInsurance.apply(_this);
					})
				}
			}
		},
		focus:function(){
			// console.log($('.'+this.title).find('input'));
			var input1 = $('.'+this.title).find('input').eq(0);
			if(!input1){
				$('.'+this.title).find('textarea').eq(0);
				return;
			}
			input1.focus();
		}
		// changeKey:function(){
		// 	var d = {};
		// 	var map = {
		// 		"sex":,
		// 		"id":,
		// 		"nativePlace":,
		// 		"grade":,
		// 		"sourcePlace":,
		// 		"collage":,
		// 		"major":,
		// 		"phoneNumber":,
		// 		"className":,
		// 		"birthday":,
		// 		"idCard":,
		// 		"dormitory":,
		// 		"dormManager":,
		// 	}
		// }
	}

	obj.init = function(){
		var _this = this;
		//绑定事件
		_this.methods.bindHandler.apply(_this);
		//初始化表单数据
		_this.methods.initFormData.apply(_this);
	}

	return obj;
}
var studentTitle = 'student';
var studentLi1 = [
	"sex",
	// "id",
	"nativePlace",
	"grade",
	"sourcePlace",
	"collage",
	"major",
	"phoneNumber",
	"className",
	"birthday",
	"idCard",
	"dormitory",
	"dormManager",
]
var studentLi2 = ["note"];

var urgentTitle = ['urgent'];
var urgentLi1 = [
	"firstConnect",
	"connectNumber",
	"ifPoor",
	"ifInsurance",
	"insurance",
	"counselor",
	"counselorId",
]
var urgentLi2 = [];

var markTitle = ['mark'];
var markLi1 = [];
var markLi2 = ["note"];

var loadMore = {
	page:1,
	ifHasAlert:false,
	ajaxSemaphore:true,
	addMore:function(data){
		var data = JSON.parse(data);
		if(!data && !this.ifHasAlert){
			alert("已经没有更多记录");
			this.ifHasAlert = true;
			return;
		}

		var record = $(".changeRecord ul");
		for(index in data){
			var recordDom = $("<li></li>").attr("class","record");
			var timeDom = $("<span></span>").attr("class","recordTime").html(data[index].time);
			var mainDom = $("<span></span>").attr("class","recordMain").html(data[index].main);

			recordDom.append(timeDom,mainDom);
			record.append(recordDom);
		}
		this.page++;
	},
	bindHandler:function(){
		var _this = this;
		$(window).bind("scroll",function(){
			var scrollTop = $(this).scrollTop();//当前窗口的滚动距离
			var clientHeight = document.documentElement.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight;
			var offsetHeight = document.body.offsetHeight;
			var scrollBottom = offsetHeight-scrollTop-clientHeight;
			// console.log(scrollTop+"  "+scrollHeight+"  "+clientHeight+"  "+offsetHeight);
			if(scrollBottom<1){
				_this.loadMoreHandler();
			}
		})
	},
	loadMoreHandler:function(){
		var _this = this;
		if(_this.ajaxSemaphore){
			_this.ajaxSemaphore = false;
			$.ajax({
				typa:"GET",
				url:url2,
				data:{
					name:$(".student boxTitle").text(),
					page:_this.page
				},
				success:function(data,status){
					_this.addMore(data);
					var t = setTimeout(function(){
						_this.ajaxSemaphore = true;
					}, 300);
					
				},
				error:function(error){
					// alert("服务器出现故障，请稍后重试");
					var t = setTimeout(function(){
						_this.ajaxSemaphore = true;
					}, 300);
				}
			})
		}
		// $.get(url2,{
		// 	name:$(".student boxTitle").text(),
		// 	page:this.page
		// },function(data,status){
		// 	_this.addMore(data);
		// })
	},
	init:function(){
		this.bindHandler();
	}
}
$('window').ready(function(){
	var student = createMainBox(studentTitle,studentLi1,studentLi2);
	var urgent = createMainBox(urgentTitle,urgentLi1,urgentLi2);
	var mark = createMainBox(markTitle,markLi1,markLi2);

	student.init();
	urgent.init();
	mark.init();
	loadMore.init();
})