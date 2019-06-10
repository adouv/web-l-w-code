
(function($) {
	
	
	var methods = {
			
		//默认执行方法
		init : function(options) {
			var _this = $(this);
			var theData = {startIndex: -1, curClass: "selectorBox_cur"};
			_this.on("click", "li", function(e){
				handleShiftAndCtrl(e, this, theData);
			});
			_this.on("selectstart", "li", function(){
				return false;
			});
		}
	
	
	};
	
	function handleShiftAndCtrl(e, obj, theData){
		var theEvent = window.event || arguments.callee.caller.arguments[0];
		var isShift = false;
		var isCtrl = false;
		if(theEvent.shiftKey){
			isShift = true;
		}
		if(theEvent.ctrlKey){
			isCtrl = true;
		}
		//shift和ctrl一起按下，则执行shift
		if(isShift){
			clickWithShift(obj, theData);
			return;
		}
		if(isCtrl){
			clickWithCtrl(obj, theData);
			return;
		}
		clickWithNone(obj, theData);
	}

	//如果不是shift，则记录startIndex. 如果是shift，startIndex=-1也记录startIndex
	function markStartIndex(obj, theData){
		theData.startIndex = $(obj).index();
	}
	//按住shift，如果有startIndex，则选中到endindex之间的元素。如果没有startIndex，则标记startIndex
	function clickWithShift(obj, theData){
		var startIndex = theData.startIndex;
		if(startIndex == -1){
			markStartIndex(obj, theData);
		}else{
			var endIndex = $(obj).index();
			selectStartToEnd(obj, theData, startIndex, endIndex);
		}
	}
	function selectStartToEnd(obj, theData, startIndex, endIndex){
		var curClass = theData.curClass;
		var temp = null;
		if(startIndex > endIndex){
			temp = startIndex;
			startIndex = endIndex;
			endIndex = temp;
		}
		//TODO 这里我要取[startIndex~endIndex]的元素，不知道具体语法，先这么写吧
		var parentObj = $(obj).parent();
		parentObj.children(":lt("+startIndex+")").add(parentObj.children(":gt("+endIndex+")")).removeClass(curClass);
		parentObj.children(":lt("+endIndex+"):gt("+startIndex+")").add(parentObj.children(":eq("+startIndex+")")).add(parentObj.children(":eq("+endIndex+")")).addClass(curClass);
	}

	//按住ctrl，就toggleClass
	function clickWithCtrl(obj, theData){
		var curClass = theData.curClass;
		if($(obj).hasClass(curClass)){
			$(obj).removeClass(curClass);
		}else{
			$(obj).addClass(curClass);
		}
	}
	//单纯单击事件，则remove其他选中状态，自个add。并标记索引
	function clickWithNone(obj, theData){
		var curClass = theData.curClass;
		$(obj).siblings().removeClass(curClass);
		$(obj).addClass(curClass);
		//标记索引
		markStartIndex(obj, theData);
	}

	

	$.fn.shiftSelect = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {//如果没有制定的方法,直接使用init
			return methods.init.apply(this, arguments);
		} else {
			$.error('The method ' + method + ' does not exist in $.shiftSelect');
		}
	};
})(jQuery);