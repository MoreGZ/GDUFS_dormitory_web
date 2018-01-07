require("../../commons/css/footer2.css");
require("../../commons/css/reset.css");
require("../../commons/css/header2.css");
require("../../commons/css/backBtn.css");
require("../css/dormitory_imformation_b.css");
var $ = require("jquery");

var url1 = $("#url1").text();
var url2 = $("#url2").text();
var url3 = $("#url3").text();
var url4 = $("#url4").text();

function studentFactury(_this){
	var student = {};
	student.data = {};
	student.dataCopy = {};
	// status有五种状态，null，have，edit，haveEdit
	student.status = _this.attr("class").split(" ")[1];
	student.thisDom = _this;
	student.ifDormManager = 0;

	student.selectObject = JSON.parse(localStorage.getItem("selectObject"));
	student.initData = function(){
		var _this = this;

		// 初始化select的option
			// 学院
			this.selectObject.forEach(function(item){
				if(item.college.college) {
					var option = $("<option>").text(item.college.college).val(item.college.college);
					_this.thisDom.find("select[name='collage']").append(option);
				}
			})

			var collegeValue = this.thisDom.find(".collage").text();
			var selectObj;
			this.selectObject.forEach(function(item){
				if(item.college.college) {
					if(item.college.college==collegeValue) selectObj = item;
					return;
				}
			})
			// 年级
			selectObj.major.forEach(function(item){
				if(item.major) {
					
					var option = $("<option>").text(item.major).val(item.major);
					_this.thisDom.find("select[name='major']").append(option);
				}
			})
			// 专业
			selectObj.grade.forEach(function(item){
				if(item.grade) {
					
					var option = $("<option>").text(item.grade).val(item.grade);
					_this.thisDom.find("select[name='grade']").append(option);
				}
			})
		// 初始化data
		var value = this.thisDom.find(".value");
		value.each(function(){
			var key = $(this).attr("class").split(" ")[1];
			var value = $(this).html();
			_this.setData(key,value);
		})
		var x = {
			"a":1,
			"b":0
		}
		var n = this.thisDom.find(".boxTitle").text();
		this.setData("name",n);

		this.data.id = this.thisDom.find(".id").text();
		// 初始化宿舍长
		var k = this.thisDom.find(".ifDormManager").attr("class").split(" ")[1];
		this.setDormManager(x[k]);

		// 初始化status
		this.setStatus();
	};
	student.setDormManager = function(value){
		this.ifDormManager = value;
		var o = ["b","a"];
		var a = ['设为宿舍长',"宿舍长"];
		this.thisDom.find(".ifDormManager").attr("class","ifDormManager "+o[value]).val(a[value]);
	};
	student.setData = function(key,value){
		this.data[key] = value;

		if(key=="name") {
			this.thisDom.find(".boxTitle").text(value);
			return;
		}
		this.thisDom.find("."+key).html(value);
		this.thisDom.find("input[name='"+key+"']").val(value);
		this.thisDom.find("select[name='"+key+"']").val(value);
	};
	student.bindHandler = function(){
		var _this = this;

		this.thisDom.find(".add").click(this.editHandler);
		// this.thisDom.find(".add").click();
		this.thisDom.find(".cansoleBtn").click(this.cansoleHandler);
		this.thisDom.find(".editBtn").click(function(){
			var thisEle = this;
			if(_this.status=="have") {
				$.ajax({
					type:"POST",
					data:{
						number:_this.thisDom.find(".id").text(),
						type:"student"
					},
					url:url4,
					success:function(data,status){
						data = JSON.parse(data);
						if(data.authority){
							$(thisEle).text("取消");
							_this.haveEditHandler();	
						}else {
							alert("对不起，你没有修改权限")
						}
					},
					error:function(error){
						alert("服务器出现了点问题，请稍后重试")
					},
				})

				return ;
			}

			if(_this.status=='haveEdit') {
				$(thisEle).text("编辑");
				_this.cansoleEditHandler();
				return;
			}
		});
		this.thisDom.find(".student_main .saveBtn").click(this.saveHandler);
		// this.thisDom.find("select[name='collage']").change();
		var inputs = this.thisDom.find(".student_main input[type='text']");
		var selects = this.thisDom.find(".student_main select");
		inputs.each(function(){
			$(this).change(function(){
				var key,value;

				value = $(this).val();
				key = $(this).attr("name");
				_this.setData(key,value);
			})
		})
		selects.each(function(){
			$(this).change(function(e){
				var key,value;

				value = $(this).val();
				key = $(this).attr("name");
				_this.setData(key,value);

				if(key=='collage'){
					_this.changeSelectHandler(e)
				}
			})
		})
	};
	student.setStatus = function(s){
		if(s==undefined) s = this.status;
		this.status = s;
		this.thisDom.attr("class","student "+this.status);
	};
	student.sendData = function(sd){
		$.post(url3,{
			data:sd,
		},function(data,status){
			if (status!="success") {
				alert(status);
				return;
			}
			if(data.stutas== 0){
				alert("保存失败，请重试");
				return;
			}
		})
	};
	student.editHandler = (function(){
		this.setStatus("edit");
	}).bind(student);

	student.cansoleHandler = (function(){
		this.setStatus("null");
		this.thisDom.find(".input").find("input[type='text']").each(function(){$(this).val("")});
	}).bind(student);

	student.saveHandler = (function(){
		this.thisDom.find(".editBtn").text("编辑")
		this.setStatus("have");
		// 向后台发送数据
		this.dataCopy = {};
		this.sendData(this.data);
	}).bind(student);
	
	student.haveEditHandler = (function(){
		for(key in this.data){
			this.dataCopy[key] = this.data[key];
		}
		this.setStatus("haveEdit");
	}).bind(student);

	student.cansoleEditHandler = (function(){
		for(key in this.dataCopy){
			this.setData(key, this.dataCopy[key]);
		}
		this.dataCopy = {};
		this.setStatus("have");
	}).bind(student);

	student.changeSelectHandler = (function(e){
		var _this = this;
		var collegeValue = e.target.value;
		_this.thisDom.find("select[name='grade']").html("");
		_this.thisDom.find("select[name='major']").html("");

		var selectObj;
		this.selectObject.forEach(function(item){
			if(item.college.college) {
				if(item.college.college==collegeValue) selectObj = item;
				return;
			}
		})
		// 年级
		selectObj.major.forEach(function(item){
			if(item.major) {
				
				var option = $("<option>").text(item.major).val(item.major);
				_this.thisDom.find("select[name='major']").append(option);
			}
		})
		// 专业
		selectObj.grade.forEach(function(item){
			if(item.grade) {
				
				var option = $("<option>").text(item.grade).val(item.grade);
				_this.thisDom.find("select[name='grade']").append(option);
			}
		})

		_this.thisDom.find("select[name='grade']").val("");
		_this.thisDom.find("select[name='major']").val("");
	}).bind(student);

	student.init = function(){
		this.bindHandler();
		this.initData();
	};

	return student;
}
var loadMore = {
	page:1,
	ifHasAlert:false,
	ajaxSemaphore:true,
	dorm:undefined,
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
			if(scrollBottom<20){
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
					dorm:_this.dorm,
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
		// 	page:this.page
		// },function(data,status){
		// 	_this.addMore(data);
		// })
	},
	init:function(dorm){
		this.dorm = dorm;
		this.bindHandler();
	}
}

function sendDormManage(dorm,name,id){
	$.post(url1,{
		dorm:dorm,
		name:name,
		id:id
	},function(data,status){
		if (status!="success") {
			alert(status);
			return;
		}
		if(data.stutas== 0){
			alert("保存失败，请重试");
			return;
		}
	})
}
$(window).ready(function(){
	var dormStr = $(".sectionTitle h5").text();
	var dorm = {};
	dorm['build'] = new RegExp('苑([0-9]*?)栋').exec(dormStr)[1];
	dorm['room'] = new RegExp('([0-9]*?)宿舍').exec(dormStr)[1];
	switch (dormStr.substring(0, 1)) {
		case '南':
			dorm['area'] = "south";
			break;
		case '北':
			dorm['area'] = "north";
			break;
		case '师':
			dorm['area'] = "teacher";
			break;
		case '友':
			dorm['area'] = "friend";
			break;
		default:
			dorm['area'] = "";
			break;
	}
	// console.log(dorm);
	loadMore.init(dorm);

	// console.log(dorm)
	var students = $(".student");
	var studentsObj = [];
	students.each(function(index){
		// 利用工厂制造对象
		studentsObj[index] = studentFactury($(this));
		// 初始化对象
		studentsObj[index].init();
	})


	// 绑定设置宿舍长事件
	$(".ifDormManager").each(function(index){
		var i = index;
		$(this).click(function(){

			$.ajax({
				type:"POST",
				data:{
					number:studentsObj[i].data.id,
					type:"student"
				},
				url:url4,
				success:function(data,status){
					data = JSON.parse(data);
					if(data.authority){
						
						for(index in studentsObj){
							studentsObj[index].setDormManager(0);
						}
						var value = Math.abs(studentsObj[i].ifDormManager-1);
						studentsObj[i].setDormManager(value);

						// 向后台发送数据
						sendDormManage(dorm,studentsObj[i].data.name,studentsObj[i].data.id);	
					}else {
						alert("对不起，你没有修改权限")
					}
				},
				error:function(error){
					alert("服务器出现了点问题，请稍后重试")
				},
			})
		})
	})
})