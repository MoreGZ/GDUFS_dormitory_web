require("../../commons/css/footer2.css");
require("../../commons/css/reset.css");
require("../../commons/css/header2.css");
require("../css/user.css");

var $ = require("jquery");

var page = {
	data:{
		password:$(".password-text").text(),
		status:"normal",
		url:$("#url1").text()
	},
	dom:{
		passwordDom:$(".password-text"),
		inputPasswordDom:$(".password-input"),
		ul:$(".main ul"),
		btn:$(".editBtn")
	},
	methods:{
		bindHandler:function(){
			var _this = this;
			$(".editBtn").click(function(){
				_this.editBtnHandler.apply(page);
			})
		},
		editBtnHandler:function(){
			if(this.data.status=="normal"){
				this.methods.editPassword.apply(page);
				return
			}
			if(this.data.status=="edit"){
				var c = confirm("确定要保存吗？");
				if(c) {
					this.methods.save.apply(page);
				}else {
					this.methods.cansole.apply(page);
				}

				return;
			}
		},
		editPassword:function(){
			this.dom.inputPasswordDom.focus();
			this.methods.setStatus.call(this,"edit");
		},
		save:function(){
			this.methods.setStatus.call(this,"normal");
			this.methods.setPassword.call(this,this.dom.inputPasswordDom.val());
			this.methods.sendPassword.call(this);
		},
		cansole:function(){
			this.methods.setStatus.call(this,"normal");
			this.dom.inputPasswordDom.val(this.data.password);
		},
		setStatus:function(status){
			this.data.status = status;
			this.dom.ul.attr("class","");
			this.dom.ul.addClass(status);
			if(status=='normal'){
				this.dom.btn.text("修改密码")
			}else {
				this.dom.btn.text("保存")
			}
		},
		setPassword:function(password){
			this.data.password = password;
			this.dom.passwordDom.text(password);
		},
		sendPassword:function(){
			var _this = this;
			$.ajax({
				type:"post",
				url:this.data.url,
				data:{
					pwd:_this.data.password,
				},
				success:function(data,status){
					console.log(status);
				},
				error:function(error){
					alert("服务器出现故障，请稍后重试");
					console.log(error);
				}
			})
		}
	},
	init:function(){
		this.methods.bindHandler();
	}
}

$(window).ready(function(){
	page.init();
})







