	function formatHTML(){
	    var htmlSrc = $('.htmlSrc').find('textarea').val();
		var hide = $('.htmlDes #hideFormat').html(htmlSrc);
		console.log(hide.text())
		$('.htmlDes #showFormat').html(hide.text());
	}
	function changeHelper(ele){
	    var selectedHelper = $(ele).attr('des');
		var helperUsing = $('#menu .selected').eq(0);
		if(helperUsing.length==0||selectedHelper != helperUsing.attr('des')){
		    //change helper
			$('#menu .selected').removeClass('selected');
			$(ele).addClass('selected');
			$('.contentTb').hide().filter('#'+selectedHelper).show();
		}
	}
	
	function prepareRule(){
	    if(window.RULE&&$('#selRule').length>0){
		    
		}else{
		    setTimeout(prepareRule, 100);
		}
	}
	
	function setAuto(){
		var ruleName = $('#selRule').val();
	    if(!window.RULE[ruleName+'-example']){
		    return;
		}
	    $('#inputFlatFile textarea').val(window.RULE[ruleName+'-example']);
		splitFile();
	}
	
	function setRule(){
	    $('#ruleTbody').empty()
		var ruleName = $('#selRule').val();
		if(ruleName==''){
		    return;
		}
		var rules = window.RULE[ruleName];
		
		if(rules==undefined){
		    $('#log').html('Undefined!');
		    printMsg('Undefined!')
			return;
		}
		for(var i=0; i<rules.length; i++){
		    var rule = rules[i];
		    var newRule = addRule(rule)
		}
		if(window.RULE[ruleName+'-example']){
		    $('#setAutoBtn').show();
		}else{
		    $('#setAutoBtn').hide();
		}
	}
	
	function printMsg(msg){
		$('#log').html(msg);
	}
	
	function addRule(rule){
	    var ruleCon = $('#ruleTbody');
		var templete =  $('#templete');
		var newRule = templete.clone().attr('id','');
		if(rule){
			newRule.find('.fieldName input').val(rule[0]);
			newRule.find('.startPos input').val(rule[1]);
			newRule.find('.endPos input').val(rule[2]);
			newRule.find('.value input').val(rule[3]?rule[3]:'');
			if(rule[4]){
			    var fieldName = newRule.find('.fieldName input');
			    for(var arr in rule[4]){
			        fieldName.css(arr, rule[4][arr]);
				}
			}else{
			    var name = rule[0];
				var fieldName = newRule.find('.fieldName input');
				if(name.replace('(new)','')!=name){
				     fieldName.css('color', 'green');
				}else if(name.replace('(old)','')!=name){
				     fieldName.css('color', 'red').css('text-decoration','line-through');
				}
			}
		}
		ruleCon.append(newRule);
		return newRule;
	}
	function splitFile(){
	    var file = $('#inputFlatFile textarea').val();
		var maxLendth = file.length;
		var rules = $('#ruleTbody tr');
		
		var ruleName = $('#selRule').val();
		
		//handle no rule selected status
		if(rules.length==0){
		    $('#selRule').val($('#selRule').find('option[value!=""]').eq(0).val());
			setRule()
			splitFile();
			return;
		}
		
		for(var i=0; i<rules.length; i++){
		    var rule = $(rules[i]);
			if(rule.filter('#templete').length>0){
			    continue;
			}
			var fieldName = rule.find('.fieldName input').val();
			var startPos = rule.find('.startPos input').val()*1;
			var endPos = rule.find('.endPos input').val()*1;
			if(startPos<0||endPos<0||startPos>endPos){
			    printMsg('Wrong start/end pos for field ['+fieldName+']!');
				return;
			}
			//var length = endPos - startPos;
			if(maxLendth<endPos){
			    printMsg('File length is not enough!');
				return;
			}
			var value = jQuery.trim(file.substring(startPos, endPos));
			if(('TransId'==fieldName||'Trans Id'==fieldName) && value!=ruleName){
			    //handle dif rule selected status
			    $('#selRule').val(value);
				if($('#selRule').val()!=value){
				    printMsg('Can not find this role['+value+']!')
				}else{
					setRule()
					splitFile();
				}
				return;
			}
			if(rule.find('.keep input:checked').length>0){
			    continue;
			}
			rule.find('.value input').val(value);
			
			if(idNeedTransMap[fieldName]){
			    var discription = getDeptDetail(value);
				var discriptionContent = rule.find('.discription').width('29%').show()
			    discriptionContent.html(discription);
				rule.find('.value input').width('68%');
			}else{
			    rule.find('.discription').hide();
			}
		}
		
		printMsg('');
	}
	
	function combineFileByDom(){
		var map = {};
		var rules = $('#ruleTbody tr');
		for(var i=0; i<rules.length; i++){
		    var rule = $(rules[i]);
			if(rule.filter('#templete').length>0){
			    continue;
			}
			var fieldName = rule.find('.fieldName input').val();
			var startPos = rule.find('.startPos input').val()*1;
			var endPos = rule.find('.endPos input').val()*1;
			var value = rule.find('.value input').val(); 
			if(startPos<0||endPos<0||startPos>endPos){
			    printMsg('Wrong start/end pos for field ['+fieldName+']!');
				return;
			}
			
			if(value.length>(endPos-startPos)){
			    printMsg('Value of ['+fieldName+'] is too long!');
				return;
			}
			
			map[startPos] = {
			    startPos : startPos,
			    endPos : endPos,
			    value : value
			};
		}
		var message = combineFile(map);
		$('#outputFlatFile textarea').val(message);
	}
	/*
	*	map[startPos] = {
	*		startPos : startPos,
	*		endPos : endPos,
	*		value : value
	*	};
	*/
	function combineFile(map){
		var startArr = []
		var sortBase = '00000';
		for(var start in map){
		    var s = ''+start;
			startArr.push(sortBase.substring(0, sortBase.length - s.length)+s);
		}
		startArr = startArr.sort();
		
		var base = '          ';
		var result = [];
		var length = 0;
		for(var j=0; j<startArr.length; j++){
		    var rule = map[startArr[j]*1];
			while(length<rule.startPos){
			    if(rule.startPos-length>base.length){
				    result.push(base);
					length+=base.length;
				}else{
				    var addition = base.substring(0, (rule.startPos-length));
				    result.push(addition);
					length+=addition.length;
				}
			}
			result.push(rule.value);
			length = length + rule.value.length
			while(length<rule.endPos){
				if(rule.endPos-length>base.length){
					result.push(base);
					length+=base.length;
				}else{
					var addition = base.substring(0,(rule.endPos-length));
					result.push(addition);
					length+=addition.length;
				}
			}
		}
		
		return result.join('');
	}
