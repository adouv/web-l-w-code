/**
 * 把layer包装为jquery插件，调用插件中的方法。
 */
(function($){
	
	$.layer = {
		//需要封装  alert , confirm, dialog, mask
		alert : function(content){
			layer.alert(content, {title:'消息'});
		},			
		//遮罩，有返回值，是取消遮罩的参数
		load : function(){
			var index = layer.load(0);
			return index;
		},
		
		//取消遮罩
		unload : function(index){
			layer.close(index);
		},
		
		//操作成功的tip提示
		success : function(msg){
			var tips = "操作成功";
			if(msg){
				tips = msg;
			}
			layer.msg(tips, {icon: 1, time:2000});//8 9 10
		},

		//操作失败的tip提示
		fail : function(msg){
			var tips = "操作失败";
			if(msg){
				tips = msg;
			}
			layer.msg(tips, {icon: 8, time:2000});
		},
		
		confirm : function(){
			var defaults = {
				content: "",
				okBtn : "确定",
				cancelBtn : "取消",
				title : "提示",
				ok : function(){},
				cancel : function(){}
			};
			if(arguments.length == 1){//传入配置
				var config = arguments[0];
				for (var i in defaults) {
					if (config[i] !== undefined)  defaults[i] = config[i];		
				};
			}
			if(arguments.length >= 2){//使用简单方法调用
				defaults.content = arguments[0];
				defaults.ok = arguments[1];
				if(arguments.length >= 3){
					defaults.cancel = arguments[2];
				}
			}
			layer.confirm(defaults.content, {
					btn: [defaults.okBtn, defaults.cancelBtn], //按钮
					icon: 4,
					title: defaults.title
				}, function(index){
					layer.close(index);
					//defaults.ok();
					typeof defaults.ok=='function' && defaults.ok();
				}, function(index){
					layer.close(index);
					//defaults.cancel();
					typeof defaults.cancel=='function' && defaults.cancel();
				}
			);
		},
		
		//弹出窗口
		open : function(url, config){
			var index = null;
			if(!url){
				index = this.openHtml(config);
				return index;
			}
			var defaults = setDefaultParam(config);
			//Ajax获取
			$.ajax({
			 	type: "POST",
			 	async: false,
			  	url: url,
			  	data: defaults.param,
			  	success: function(data){
			  		defaults.content = data;
			  		index = doOpen(defaults);
			  	}
			});
			return index;
		},
		
		//弹出窗口-直接弹出html内容
		openHtml : function(config){
			var defaults = setDefaultParam(config);
			return doOpen(defaults);
		},		
		close : function(index){
			layer.close(index);
		}
		
	};
	
	function setDefaultParam(config){
		var defaults = {
			param: {},
			content: "loading...",
			okBtn : "确定",
			cancelBtn : "取消",
			btn: [],
			title : "信息",
			width : "",
			height : "",
			shade: 0.3,
			shadeClose: false,
			ok : function(){},
			cancel : function(){},
			end : function(){},
			success:function(){}
		};
		for (var i in defaults) {
			if (config[i] !== undefined)  defaults[i] = config[i];
		};
		if(config["ok"] == undefined){
			defaults.okBtn = null;
			defaults.cancelBtn = "确定";
		}
		if(config["cancel"] == undefined){
			defaults.cancelBtn = null;
		}
		if(defaults["okBtn"]){
			defaults.btn.push(defaults["okBtn"]);
		}
		if(defaults["cancelBtn"]){
			defaults.btn.push(defaults["cancelBtn"]);
		}
		return defaults;
	}
	
	function doOpen(defaults){
		var index = null;
		index = layer.open({
			type: 1,
			content: defaults.content,
			title: defaults.title,
			area: [defaults.width, defaults.height],
			btn: defaults.btn,
			shade: defaults.shade,
			shadeClose: defaults.shadeClose,
			shift: 5,//动画效果
			yes: function(index){
				var closeFlag = defaults.ok();
				if(closeFlag !== false){
					layer.close(index);
				}
			},
			cancel:function(){
				return defaults.cancel();
			},
			end:function(){
				return defaults.end();
			},
			success:function(dom,index){
				return defaults.success(dom,index);
			}
		});
		return index;
	}
	
})(jQuery);


