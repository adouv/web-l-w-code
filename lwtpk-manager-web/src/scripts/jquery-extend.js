//对jquery方法的扩展

$.extend({
	
	/**
	 * 判断浏览器类型，jqeury1.9去除了browser属性
	 */
	browser: {
		mozilla : /firefox/.test(navigator.userAgent.toLowerCase()),
		webkit : /webkit/.test(navigator.userAgent.toLowerCase()),
		opera : /opera/.test(navigator.userAgent.toLowerCase()),
		msie : /msie/.test(navigator.userAgent.toLowerCase()),
		version : (/(webkit)[ \/]([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || /(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || navigator.userAgent.toLowerCase().indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( navigator.userAgent.toLowerCase() ) || [])[2] || "0",
		mobile:(function(){
			var userAgent = navigator["userAgent"]["toLowerCase"]();
			if (userAgent["indexOf"]('iphone') > 0 
				|| userAgent["indexOf"]('ipod') > 0 
				|| userAgent["indexOf"]('ipad') > 0          
				|| userAgent["indexOf"]('Android') > 0 
				|| userAgent["indexOf"]('ios') > 0
				|| userAgent["indexOf"]('symbianos') > 0){
				return true; 
			}
			return false;
		})()
	},
	
	/**
	 * 引用js、css等文件
	 */
	include: function(file,sync){
    	sync = sync==undefined?false:sync==true;
        var files = typeof file == "string" ? [file] : file;
        var head = $("HEAD");
        for (var i = 0; i < files.length; i++){
        	if(!files[i])continue;
            var name = files[i].replace(/^\s|\s$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
            var link = (isCSS ? "href" : "src") + "='" + name + "'";
            if ($(tag + "[" + link + "]").length > 0) {
            	continue;
            }
            if(sync){
            	//解决异步加载父子页面依赖未加载完成的资源文件BUG
            	head.append("<" + tag + attr + link + "></" + tag + ">");
            }else{
            	document.write("<" + tag + attr + link + "></" + tag + ">");
            }
        }
    },
    
	uuid: function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	},
	
	htmlEncode: function(value){
		return !value ? value : String(value).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/ /g, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	},
	
	htmlDecode: function(value){
		return !value ? value : String(value).replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "\'").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
	},
	
	/**
	 * 模板，通过{}来对应key
	 * @param template
	 * @param data
	 * @returns
	 */
	nano: function(template, data){
		return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
			var keys = key.split("."), value = data[keys.shift()];
			$.each(keys, function() {
				value = value[this];
			});
			return (value === null || value === undefined) ? "" : value;
		});
	}
	
});