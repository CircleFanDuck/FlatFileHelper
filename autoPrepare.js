/**
 * Created by JetBrains WebStorm.
 * User:
 * Date: 12-8-8
 * Time: 下午10:39
 * To change this template use File | Settings | File Templates.
 */

var EMPTY='-EMPTY-';
var EMPTY_VAL='-';
var Y = 'Y';
var N = 'N';
var NA=[Y,N];

var STAFF_N_LENGTH = 5;
var IC_N_LENGTH = 9;
var BASIC_STRING = '0000000000';


function roles(eles, condition){
	var val = [];
	var conditions = {};
	var ele = eles.filter('[condition='+condition+']');
	eles.each(function(){
		var ele = $(this).filter('select,input[type!=button][type!=checkbox]');
		if(ele.length>0){
			if(ele.val()==EMPTY){
				val.push('-');
			} else {
				val.push(ele.val());
			}
			conditions[ele.attr('condition')*1] = val[val.length-1];
		}
	});
	eles.find('.note').text(val.join(', '));
	//ROLES
	var rolesMap= {
		'11,21':(conditions[11]==Y&&conditions[21]==Y),
		'1,11': (conditions[1]==N&&conditions[11]!=N),
		'1,12': (conditions[1]==N&&conditions[12]!=N),
		'11,12':(conditions[11]==N&&conditions[12]==Y),
		'1,13':(conditions[1]==N&&conditions[13]!=N),
		'2,21': (conditions[2]==N&&conditions[21]==Y),
		'2,22': (conditions[2]==N&&conditions[22]==Y),
		'21,22':(conditions[21]==N&&conditions[22]==Y),
		'3,4':(conditions[21]==Y&&conditions[22]==Y)
	};
	var errorMap = {};
	for(var p in rolesMap){
		if(!rolesMap[p]){
			continue;
		}
		var arr = p.split(',');
		for(var q in arr){
			errorMap[arr[q]] = 'error';
		}
	}
	delete errorMap[condition];

	eles.filter('.note').text(val.join(', '));

	eles.each(function(){
		var ele = $(this).filter('select,input[type!=button][type!=checkbox]');
		if(ele.length>0){
			if(errorMap[ele.attr('condition')]){
				ele.addClass('error');
			}else{
				ele.removeClass('error');
			}
		}
		if(ele.val()==EMPTY){
			ele.addClass('error');
		}
	})
	
	if(ele.val()!=EMPTY){
		ele.removeClass('error');
	}
}
Properties = [
	{//1
		condition:1,
		title:'Staff work current exist:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//2
		condition:2,
		title:'Staff work future exist:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//3
		condition:11,
		title:'DB Current dept = file:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//4
		condition:12,
		title:'DB Current deptid = file deptid:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//5
		condition:13,
		title:'DB Current dept = file old dept:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//6
		condition:21,
		title:'DB Future dept = file dept:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//7
		condition:22,
		title:'DB Future deptid = file deptid:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//8
		condition:3,
		title:'Future section unit exist:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//9
		condition:4,
		title:'Future transfer exist:',
		val:[EMPTY, Y, N],
		change:roles
	},
	{//10
		condition:5,
		title:'Action Code:',
		val:[EMPTY, 'A', 'C', 'D'],
		change:roles
	},
	{//11
		condition:6,
		title:'Next Action Code:',
		val:[EMPTY, ' ', 'EXTEND', 'REHIRE'],
		change:roles
	},
	{//12
		condition:7,
		title:'',
		val:'',
		tag:'span',
		klass:'note'
	},
	{//13
		condition:8,
		title:'',
		val:'Parse',
		tag:'input',
		type:'button',
		click:function(eles, condition){
			if(eles.filter('.error').length>0){
				eles.filter('.note').html('<span class=error>Error exist!</span>');
				return null;
			}
			
			
		}
	}
];

var DEPT_MAP = {
	1 : {
		'YYY':"'0','ADM','B'",
		'YYN':"'0','LOG','B'",
		'YNN':"'0','LS0','C'",
		3:['0','PLG'],
		4:['B'],
		'NNN':null
	},
	2 : {
		'YYY': "'3','3','K'",
		'YYN': "'4','4','K'",
		'YNN': "'1','1','T'",
		'NNN':null
	},
	13:{
		'Y': "'0','ADM','B'",
		'N': "'10',' ','KE'"
	}
}


function formatBasic(para){
	var re = {};
	if(!para.prefix){
	    para.prefix = 'Q';
	}
	re['staffN'] = (para.prefix + BASIC_STRING).substring(0, STAFF_N_LENGTH-sq.length)+ para.sq;
	re['icN']    = (para.prefix + BASIC_STRING).substring(0, IC_N_LENGTH-sq.length)+ para.sq;
	re['startDt'] = TO_DATE('"+re['+para.sysdate+']+"','DD/MM/YYYY') - (para.offsetPreDate?para.offsetPreDate:0);
	re['endDt'] = TO_DATE('"+re['+para.sysdate+']+"','DD/MM/YYYY') + (para.offsetAfterDate?para.offsetAfterDate:1);

	var condition = para.condition;
	re['cDeptId'] = DEPT_MAP[1][condition[1]+condition[11]+condition[12]];
	re['fDeptId'] = DEPT_MAP[2](condition[2]+condition[21]+condition[22]);
	re['oDeptId'] = DEPT_MAP[13](condition[13]);
	
	var flatfileDept;
}
function formatSql(para){
    
	var env = formatBasic(para);
	
	var SQLArr = [
			"DELETE STAFF_WORK WHERE IC_N = '"+ re['icN'] +"';",
			"DELETE STAFF_TRANSFER WHERE IC_N = '"+ re['icN'] +"';",
			"DELETE STAFF_SECTION_UNIT WHERE IC_N '"+ re['icN'] +"';",
			"DELETE STAFF WHERE IC_N '"+ re['icN'] +"';",
		];
	
	var staffWork = ['oDeptId', 'cDeptId', 'fDeptId'];
	
	for(var p in staffWork){
	    if(re[staffWork[p]]){
			var deptId = re[staffWork[p]];
			SQLArr.push( "INSERT INTO STAFF_WORK(staff_n, ic_n, home_department_c, section_n, unit_c, start_dt, end_dt, work_department_c, nts_i, appointment_type_c, roster_scheme_n) VALUES ('"
			+re['staffN']+"', '"+ re['icN'] +"', " + deptId + "," + re['startDt'] + "," + re['endDt'] + ", 'A','1','J','0')");
		}
	}
	


	var SQLArr = {
		'condition_3_Y' : [//Future section unit exist
			"IINSERT INTO staff_section_unit(ic_n, section_n, unit_c, effective_d) VALUES('"+ re['icN'] +"', 'A','B', TO_DATE('"+re['sysdate']+"','DD/MM/YYYY') + " + re['endDt'] + ")"
		],
		'condition_4_Y' : [//Future transfer unit exist
			"INSERT INTO staff_transfer(ic_n,transfer_d,out_department_c,in_department_c)  VALUES ('"+ re['icN'] +"',TO_DATE('"+re['sysdate']+"','DD/MM/YYYY') + " + re['endDt'] + ", 'AA','BB')"
		]
	};
}


(function(exports){

	function BaseRole(baseId, properties){
		this.rootId = baseId;
		this.root = $('#'+baseId);
		this.properties = properties;
		//format basic table
		this.root.empty();
		this.root.appendNewEle('table');
		var table = this.root.find('table');
		this.headCon = table.appendNewEle('thead');
		var tr = table.appendNewEle('tbody').appendNewEle('tr');
		this.header = tr.appendNewEle('td').attr('valign','top').appendNewEle('div').appendNewEle('table')
			.addClass('autoRoleHeader').appendNewEle('tbody');
		this.roleCon = this.header;
		this.index = 0;
		this.addRole(properties, 'title', {1:['title']});
		var divScroll=tr.appendNewEle('td').attr('valign','top').appendNewEle('div')
			.attr('id','autoRoleCon');

		this.roleCon = divScroll.appendNewEle('table').appendNewEle('tbody');
		this.roleCon.appendNewEle('tr').addClass('emptyNotice').appendNewEle('td').appendNewEle('label').text('');
		divScroll.width(this.root.width()-this.header.parent().width());
		divScroll.height(this.header.parent().height()+20);

	}
	BaseRole.fn = BaseRole.prototype;

	BaseRole.fn.getAttr = function(attrName){
		return this[attrName];
	};
	BaseRole.fn.getRootId = function(attrName){
		return this.rootId;
	};
	BaseRole.fn.formatEle = function(base, batchClass, valSrc){
		base = $(base).appendNewEle('td').addClass(batchClass).appendNewEle('div');
		var val = valSrc.val||valSrc.title;
		var newEle = null;
		if(val instanceof Array){
			//array or int or string
			newEle = base.appendNewEle('select').addClass('val');
			for(var p in val){
				newEle.appendNewEle('option').val(val[p]).text(val[p]);
			}
		} else {
			if(valSrc.tag){
				newEle = base.appendNewEle(valSrc.tag, valSrc.type).addClass('val').val(val);
			} else {
				newEle = base.appendNewEle('label').addClass('val').text(val);
			}
		}

		for(var p in valSrc){
			if(p == 'val'|| p=='title'||p=='tag'||p=='type'){
				continue;
			}
			if(valSrc[p] instanceof Function){
				newEle.bind(p, function(){
					var eles = $('.'+batchClass).find('.val');
					valSrc[p](eles, valSrc.condition);
				});
			}else{
				if(p=='klass'){
					newEle.addClass(valSrc[p]);
				}else{
					newEle.attr(p, valSrc[p]);
				}
			}

		}
		return base.parent();
	}
	BaseRole.fn.bindParse = function(autoParse){
	    
	}
	BaseRole.fn.addRoleMultiple = function(properties, baseRole, filter, defaultVal){
		if($.trim(defaultVal)!=''){
			var defaultArr = [defaultVal];
			while(defaultArr[0].indexOf('NA')>=0){
				var val = defaultArr.shift();
				defaultArr.push(val.replace('NA','Y'));
				defaultArr.push(val.replace('NA','N'));
			}
		}
		var offset = 0;
		function addRoleSingle(){
			var index = baseRole.index;
		    var val = defaultArr[offset];
			baseRole.index  = baseRole.addRole(properties, index, filter, val);
			setTimeout(function(){
			    baseRole.clearErrorRole(index);
			},5)
			offset++;
			if(offset<defaultArr.length){
			    setTimeout(addRoleSingle,10);
			}
		}
		addRoleSingle();
	}

	BaseRole.fn.clearErrorRole = function(batchIndex){
		var eles = this.roleCon.find('.condition_'+batchIndex);
		var errors = eles.find('.error')
		var length = 0;
		for(var index=0; index<errors.length; index++){
			var ele = errors.eq(index);
			if(ele.val()==EMPTY){
				length++;
			}
		}
		if (errors.length!=length){
			eles.remove();
		}
	}
	BaseRole.fn.addRole = function(properties, batchIndex, filter, defaultVal){
		var batchClass = 'condition_'+ (batchIndex++);
		if(batchIndex=='title'){
			batchClass = 'title_0';
			batchIndex = 0;

		}
		for(var index in properties){
			var property = properties[index];

			this.roleCon.find('.emptyNotice').remove();

			var tr = this.roleCon.find('.role_'+index);
			if(tr.length==0){
				tr = this.roleCon.appendNewEle('tr').addClass('role_'+index);
			}

			var val = property;
			if(filter){
				val = {};
				if(filter[1]){
					var arr = filter[1];
					for(var p in arr){
						val[arr[p]] = property[arr[p]];
					}
				}else if(filter[0]){
					var arr = filter[0];
					for(var p in property){
						val[p] = property[p];
					}
					for(var p in arr){
						val[arr[p]] = null;
					}
				}
			}
			var newEle = this.formatEle(tr, batchClass, val);
			tr.append(newEle);
		}
		if(defaultVal){
			var inputs = this.roleCon.find('.'+batchClass).find('input,select');
			var vals = defaultVal.split(',');
			for(var p in vals){
				inputs.eq(p).val(vals[p]);
			}
			inputs.eq(0).trigger('change');
		}

		return batchIndex;
	};


	/*
	* Export outside
	*
	* */
	function AutoParse(baseRole){
		this.bindCreateHandler(baseRole);
		baseRole.bindParse(this)
		return;
       this.createCondition(baseId);
	}
	AutoParse.fn = AutoParse.prototype;

	AutoParse.fn.createCondition = function(baseId){

		var base = $(baseId);
		if(base.filter('[index]').size()==0){
			base.attr('index','0');
		}
		base.attr('index', base.attr('index')*1+1);
		var indexOfCon = 'con'+base.attr('index');

		var conditions = base.find('tr');
		conditions.each(function(index){
		    var removeClass = indexOfCon;
			var base = baseId;
			var example = $(this).find('.example').html();
			var td = $(this).append('<td class="con"></td>').find('td:last');
			td.addClass(indexOfCon).html(example);
			td.find('input[type=button]').addClass('clickable');
			//bind remove btn
			td.find('.removeCondition').click(function(){
			    $(base).find('.'+removeClass).remove();
			})
		})
		this.bindParseStatus(base.find('.'+indexOfCon));
		this.registerAddBtn(baseId, indexOfCon);
	}
	AutoParse.fn.setConditionArr = function(condition, eles){
	    var arr = condition.splite(',');
		for(var p in arr){
			ele.find('.condition'+p).children().val(arr[p]);
		}
	}
	AutoParse.fn.registerAddBtn = function(baseId){
		$('#addConditionBtn').unbind('click').bind('click',function(){
			createNewCondition(baseId)
		})
	}
	AutoParse.fn.bindParseStatus = function(tds){
		tds.find('input,select').change(function(){
			tds.find('.parse').removeAttr('disabled');
		})
	}
	AutoParse.fn.bindCreateHandler = function(baseRole){
		var colspan =  baseRole.roleCon.find('tr:first').find('td').length;
		var td = baseRole.headCon.appendNewEle('tr').appendNewEle('td').attr('colspan', 2);
		var valInput = td.appendNewEle('input').attr('id','defaultVal').width('300px');
		var btn = td.appendNewEle('input', 'button').attr('id','createConditionBtn').width('100px').val('Create');
		var btnClear = td.appendNewEle('input', 'button').attr('id','clearConditions').width('100px').val('Clear');
		var label = td.appendNewEle('label').addClass('error');
		btnClear.click(function(){
			baseRole.roleCon.empty().appendNewEle('tr').addClass('emptyNotice')
				.appendNewEle('td').appendNewEle('label').text(EMPTY);
			baseRole.index=0;
		})
		btn.click(function(){
			var defaultVal = valInput.val();
			if($.trim(defaultVal)==''){
				label.text('Please key in value!');
				return;
			}
			var properties = baseRole.properties;
			baseRole.addRoleMultiple(properties, baseRole, {0:['title']}, defaultVal);
		})
		valInput.change(function(){
			label.empty();
		})
		return {
			btn: btn,
			msg: label,
			input: valInput
		}
	}
	//define outside
    exports.createNewCondition = function(baseId, defaultVal){
		var baseRole = new BaseRole('autoRole', Properties);
		//var create = baseRole.bindCreateHandler();
	    return new AutoParse(baseRole);
	}
})(window);



 $.fn.appendNewEle = function(a, type){
 	var ele = document.createElement(a);
	if(type){
		ele.type = type;
	}
 	$(this).append(ele);
 	return $(ele);
 }