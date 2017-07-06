var utilObj = {
	envValue:0,
	getApiHost:function(){
		var apiObj = {};
		switch(this.envValue){
			case 0:
				apiObj.baseUrl = 'http://test.3tichina.com:8023/xa-tag-web';
				apiObj.picUrl = 'http://test.3tichina.com:8026';
				break;
			case 1:
				apiObj.baseUrl = 'http://jkjy.3tichina.com:81/xa-blackcat-web';
				apiObj.picUrl = 'http://jkjy.3tichina.com';
				break;
			case 2:
				apiObj.baseUrl = 'http://www.bj-shthinktank.com/xa-blackcat-web';
				apiObj.picUrl = 'http://www.bj-shthinktank.com:81';
				break;
				
		}
		return apiObj;
	},
	ajax: function(params){
		var noToken = {
			'/j_spring_security_check':"",
		};
		if(noToken[params.url]==undefined){
			if(!sessionStorage.getItem("t")){
				sessionStorage.setItem("message","令牌失效，请登录");
				utilObj.navigate('login');
			}
		}
		params.url = utilObj.getApiHost().baseUrl + params.url;
		var ajaxparams= $.extend({},params);
		if(!ajaxparams.data) ajaxparams.data={};

		if(noToken[params.url]==undefined){
			ajaxparams.data.token=sessionStorage.getItem("t");
		}
		ajaxparams.success=function(data,status,xhr){
			if(!data || data.code==0){
				if(data.message){
					if(data.message.indexOf('已失效')!=-1 || data.message.indexOf('无效')!=-1 || data.message.indexOf('超时')!=-1){
						sessionStorage.setItem("message","登录过期,请重新登录");
						sessionStorage.removeItem('t');
						location.reload();
	//					utilObj.navigate("login");
					}else{
						alert('接口出错' + data.message);
					}
				}else {
					alert('接口出错');
				}	
				
			}else {
				if(params.success instanceof Function) params.success(data,status,xhr);
			}
			
		}
		ajaxparams.error=function(xhr){
			if(params.error instanceof Function) params.error(xhr);
		}
		return $.ajax(ajaxparams);
	},
	getRate:function (value) {
		if(value){
			value = parseFloat(value)*100;
//			value = Math.abs(value);
			value = value.toFixed(0)+'%';
		}else {
			value = '0%'
		}
		return value;
	},
	dayStart: function(value){
		return value + ' 00:00:00';
	},
	dayEnd: function(value){
		return value + ' 23:59:59';
	},
	getAryByParam: function(ary,param,func){
		return ary.map(function(x){
			if(func instanceof Function){
				return func(x[param])
			}else{
				return x[param]
			}
		})
	},
	getPieData: function(ary,obj){
		return ary.map(function(x){
			var newObj = {};
			for(var key in obj){
				newObj[key] = x[obj[key]];
			}
			return newObj;
		})
	},
	getMultipleAry: function(obj, param){
		var ary = []
		for(var  key in obj){
			var aryChild = this.getAryByParam(obj[key], param);
			ary.push(aryChild)
		}
		return ary;
	},
	getNameAry: function(obj, param){
		var ary = []
		for(var  key in obj){
			var name = this.getAryByParam(obj[key], param)[0];
			ary.push(name)
		}
		return ary;
	},
	getChartOption: function(option, params, key, extraParams){
		var names = params.names;
		var legendDataObj = option.legend.data[0];
		var legendDataAry = [];
		option.title.text = extraParams.title;
		for(var i=0;i<names.length;i++){
			var newLegendDataObj = $.extend({}, legendDataObj, { name: names[i]});
			legendDataAry.push(newLegendDataObj);
		}
		option.legend.data = legendDataAry;
		option.xAxis.data = params.xAixsData;
		var seriesObj = option.series[0];
		var seriesAry = [];
		for(var j=0;j<params[key].length;j++){
			var newSeriesObj = $.extend({}, seriesObj, { name: names[j], data: params[key][j]});
			seriesAry.push(newSeriesObj);
		}
		option.series = seriesAry;
		return option;
	},
	transferDateAry: function(ary){
		_this = this;
		return ary.map(function(x){
			return _this.transferDate(x);
		})
	},
	transferDate: function(date){
		if(date){
			date = date.toString();
			date = date.slice(0,4) + '-' + date.slice(4,6) + '-' + date.slice(6);
		}
		return date;
	},
	isInteger: function(obj) {
	 return Math.floor(obj) === obj
	},
	transferW: function(value){
		if(value>10000){
			value = value/10000;
			if(!utilObj.isInteger(value)){
				value = value.toFixed(1)
			}
			value = value + 'W+'
		}
		return value;
	},
	getMonth: function(value){
		value = value.toString();
		return value? parseInt(value.slice(-2)) + '月': value;
	},
	getCloudData: function(ary, params){
		return ary.map(function(x){
			return {
				text: x[params['text']],
				weight: x[params['weight']],
			}
		})
	},
	setVmData: function(obj, data){
		for(var key in obj){
			obj[key] = data[key];
		}
	},
	isPositiveNumber: function(value){
		if(value){
			if(parseFloat(value)>0){
				return true;
			}else {
				return false;
			}
		}else {
			return false;
		}
	},
	isNegativeNumber: function(value){
		if(value){
			if(parseFloat(value)<0){
				return true;
			}else {
				return false;
			}
		}else {
			return false;
		}
	},
	showArrow: function(value){
		return {
			'increase-arrow': utilObj.isPositiveNumber(value),
			'decrease-arrow': utilObj.isNegativeNumber(value),
		}
	},
	transferInteger: function(value){
		return parseInt(value);
	},
	transferDoubleFloat: function(value){
		return parseFloat(value).toFixed(2);
	},
	getAryByParams: function(ary, params){
		return ary.map(function(x){
			var obj = {};
			for(var key in params){
				obj[key] = x[params[key]];
			}
			return obj;
		})
	},
	getEmotionData: function(data){
		var ary = [];
		var countObj = {};
		var goodRateObj = {};
		var goodCountObj = {};
		var generalCountObj = {};
		var poorCountObj = {};
		var noSenseCountObj = {};
		
		ary = this.getEmotionAry(countObj, data, '点评数', ary);
		ary = this.getEmotionAry(goodRateObj, data, '好评率', ary);
		ary = this.getEmotionAry(goodCountObj, data, '好评数', ary);
		ary = this.getEmotionAry(generalCountObj, data, '中评数', ary);
		ary = this.getEmotionAry(poorCountObj, data, '差评数', ary);
		ary = this.getEmotionAry(noSenseCountObj, data, '无情感', ary);
		return ary;
	},
	getEmotionAry: function(obj, data, title, ary){
		var dateAry = data.ddate;
		var length = dateAry.length;
		for(var i=0;i<length;i++){
			var curValue = '';
			if(title == '点评数'){
				curValue = data.count[i];
			}else if(title == '好评率'){
				curValue = data.goodRate[i];
			}else if(title == '好评数'){
				curValue = data.goodCount[i];
			}else if(title == '中评数'){
				curValue = data.generalCount[i];
			}else if(title == '差评数'){
				curValue = data.poorCount[i];
			}else if(title == '无情感'){
				curValue = data.noSenseCount[i];
			}
			obj[dateAry[i]] = curValue;
		}
		obj.title = title;
		ary.push(obj);
		return ary;
	},
	getConfigData: function(data){
		var ary = [];
		var dateAry = data.ddate;
		var labels = dateAry.map(function(x){
			x = x.toString();
			return x.slice(4,6) + '-' + x.slice(6);
		})
		ary.push({
			label: '',
			prop: 'title',
		})
		for(var i=0;i<dateAry.length;i++){
			var obj = {
				label: labels[i],
				prop: dateAry[i].toString(),
			}
			ary.push(obj);
		}
		return ary;
	}
};
(function($){
	var ModalBuilder = function(selector, options){
		this._currentZIndex = 1000;
		this._modalClass = null;
		this.selector = selector;
		this.options = {
				title:'提示',//标题
				titlebgColor:'',//标题背景颜色
				containerWidth:'',//容器宽度百分比
				maxWidth : 0.7,
				minWidth : 0.2,
				contentheight:'',//内容高度
				maxHeight : 0.8,
				minHeight: 0.2	,
		};
		$.extend(true, this.options, options);
		this.modal();
	}
	ModalBuilder.prototype = {
		modal:function(){
			this._creatElemHtml();
			$('.'+ this._modalClass).modal();
			var that = this;
			if(this.options.shown){
				$('.'+ this._modalClass).on('shown', function(e){						
					that.options.shown();
				});
			}
			if(this.options.okHide){
				$('.'+ this._modalClass).on('okHide', function(e){						
					that.options.okHide();
				});
			}
			if(this.options.cancelHide){
				$('.'+ this._modalClass).on('cancelHide', function(e){						
					that.options.cancelHide();
				});
			}
			
			if(this.options.hidden){
				$('.'+ this._modalClass).on('hidden', function(e){						
					that.options.hidden();
					$(this).remove();
				});
			}else{
				$('.'+ this._modalClass).on('hidden', function(e){						
					$(this).remove();
				});
			}
			
			if(!this.options.containerWidth){//弹层自定义宽度展示后获取宽度值
				$('.'+ this._modalClass).css('width','auto');					
				var objwidth = $('.'+ this._modalClass).width();
				$('.'+ this._modalClass).css({'margin-left':'-'+(objwidth/2) + 'px','left':'50%'});
			}
			/** 拖拽模态框*/ 			
			this._drapModal();					
			$(".sui-modal-backdrop:last").css("z-index",this._currentZIndex);
			this._currentZIndex++;
			$(".sui-modal:last").css("z-index",this._currentZIndex);
			this._currentZIndex++;
		},
		_creatElemHtml : function(){	
			this._modalClass='modal_'+new Date().valueOf();
			var bodyWidth = document.documentElement.clientWidth;
			var bodyHeight = document.documentElement.clientHeight;	
			$('body').append(template(this.selector));	
			$('body div[role="dialog"]:last').addClass(this._modalClass);					
			$('.'+ this._modalClass + " .modal-body").css({'max-width':this.options.maxWidth*bodyWidth + 'px','min-width':this.options.minWidth*bodyWidth +'px'});
			$('.'+ this._modalClass + " .modal-header h4").text(this.options.title);
			$('.'+ this._modalClass + " .modal-header").css('background',this.options.titlebgColor);
			$('.'+ this._modalClass + " .modal-body").css({'max-height':this.options.maxHeight*bodyHeight+'px','min-height':this.options.minHeight*bodyHeight + 'px'});
			if(this.options.contentheight && this.options.contentheight !='auto'){
				if(this.options.contentheight > this.options.maxHeight){
					$('.'+ this._modalClass + " .modal-body").css({'height':this.options.maxHeight*bodyHeight});
				}else{
					$('.'+ this._modalClass + " .modal-body").css({'height':this.options.contentheight*bodyHeight});
				}
				
			}else{
				$('.'+ this._modalClass + " .modal-body").css({'height':'auto'});
			}
			if(this.options.containerWidth && this.options.containerWidth !='auto'){
				if(this.options.containerWidth > this.options.maxWidth){
					$('.'+ this._modalClass).css({'width':this.options.maxWidth*bodyWidth + 'px','margin-left':'-'+(this.options.maxWidth*bodyWidth/2) + 'px','left':'50%'});
				}else{
					$('.'+ this._modalClass).css({'margin-left':'-'+(this.options.containerWidth*bodyWidth/2) + 'px','width':this.options.containerWidth*bodyWidth + 'px','left':'50%'});
				}
				
			}
		
		},
		_drapModal:function(){
			var p={};
	        function getXY(eve) {
	            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
	            return {x : scrollLeft + eve.clientX,y : scrollTop + eve.clientY };
	        }
	        
	        $(document).on("mouseup",function(ev){
	        	p={};
	        	$(document).off("mousemove");
	        });
	        
	        $(".modal-header:last").on("mousedown",function(ev){
	        	document.body.onselectstart=document.body.ondrag=function(){
					return false;
				}
	        	p.y = ev.pageY - $(this).parents(".sui-modal")[0].offsetTop;
	        	p.x = ev.pageX - $(this).parents(".sui-modal")[0].offsetLeft;
	        	
	            $(document).on("mousemove",function(ev){console.log("a");
	        		var oEvent = ev || event;
	                var pos = getXY(oEvent);
	                $(".sui-modal:last").css({left:(pos.x-p.x) + "px",top:(pos.y-p.y) + "px","margin-left":"10px","margin-top":"10px"});
	            });
	        });
			$(document).on('hidden.bs.modal','.modal',function(e){
				$('.modal-dialog').css({'top': '0px','left': '0px'})
				document.body.onselectstart=document.body.ondrag=null;
			});
		},
		resize:function(){
			var w = 0-$('.'+ this._modalClass).width()/2;
			var h = 0-$('.'+ this._modalClass).height()/2;
			$('.'+ this._modalClass).css({"margin-top":h+"px","margin-left":w+"px"});
		}
	}
	if ( typeof module != 'undefined' && module.exports ) {
		module.exports = treeBuilder;
	} else {
		window.ModalBuilder = ModalBuilder;
	}
})(jQuery)
