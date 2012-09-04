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

var STAFF_N_LENGTH = 4;
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
		'3,4':(conditions[21]==Y&&conditions[22]==Y),
		'1,2,4':((conditions[1]==N||conditions[2]==N)&&conditions[4]==Y),
		'1,2,3':((conditions[1]==N&&conditions[2]==N)&&conditions[3]==Y)
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
		check:function(eles, condition){
			if(eles.filter('.error').length>0){
				eles.filter('.note').html('<span class=error>Error exist!</span>');
				return false;
			}
			return true;
		}
	}
];

var DEPT_MAP = {
	1 : {
		'YYY':["'0'","'ADM'","'B'"],
		'YYN':["'0'","'LOG'","'B'"],
		'YNN':["'0'","'LS0'","'C'"],
		3:['0','PLG'],
		4:['B'],
		'NNN':null
	},
	2 : {
		'YYY': ["'3'","'3'","'K'"],
		'YYN': ["'4'","'4'","'K'"],
		'YNN': ["'1'","'1'","'T'"],
		'NNN':null
	},
	13:{
		'Y': ["'0'","'ADM'","'B'"],
		'N': ["'10'","' '","'KE'"]
	}
};


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
	BaseRole.fn.setParse = function(autoParse){
	    if(autoParse){
			this.autoParse = autoParse
		}
	}
	BaseRole.fn.bindParse = function(index, autoParse){
	    this.setParse(autoParse);
		if(!this.autoParse){
		    return 'Can not Parse without bind parse mod.'
		}
		
		var conditionEles = this.roleCon.find('.condition_'+index+' [condition]');
		var conditions = {};
		for(var i = 0; i<conditionEles.length; i++){
		    var ele = conditionEles.eq(i);
			var val = ele.val();
			if(!val){
			    val = ele.text();
			}
		    conditions[ele.attr('condition')] = val;
		}
		
		var env = {};
		env['condition'] = conditions;
		env['sq'] =''+index;
		env['sysdate'] = '04/09/2012';
		
		//TODO: option settings prefix:,sysdate:,offsetPreDate:,offsetAfterDate:
		
		env['SQLArr'] = this.autoParse.formatSql(env);
		this.autoParse.publishBoard.trigger('publish', env);
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
		var batchClass = 'condition_'+ batchIndex;
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
		
		var inputs = this.roleCon.find('.'+batchClass).find('input,select');
		if(defaultVal){
			var vals = defaultVal.split(',');
			for(var p in vals){
				inputs.eq(p).val(vals[p]);
			}
			inputs.eq(0).trigger('change');
		}
		
		if(inputs.length>0){
			var bindIndex = batchIndex;
			var bRole = this;
			inputs.filter('[condition=8]').bind('click',function(){
				var pass = $(this).eq(0).trigger('check');
				if(pass){
					bRole.bindParse(bindIndex);
				}
			});
		}
		
		batchIndex++;
		return batchIndex;
	};


	/*
	* Export outside
	*
	* */
	function AutoParse(baseRole, publishId){
		this.bindCreateHandler(baseRole, publishId);
		this.bindPublishHandle(publishId);
		baseRole.setParse(this);
	}
	AutoParse.fn = AutoParse.prototype;

	AutoParse.fn.formatBasic = function(para){
		var re = {};
		if(!para.prefix){
			para.prefix = 'Q';
		}
		
		re['staffN'] = (para.prefix + BASIC_STRING).substring(0, STAFF_N_LENGTH-para.sq.length)+ para.sq;
		re['icN']    = "'"+(para.prefix + BASIC_STRING).substring(0, IC_N_LENGTH-para.sq.length)+ para.sq+"'";
		re['startDt'] = "TO_DATE('"+para.sysdate+"','DD/MM/YYYY') - " + (para.offsetPreDate?para.offsetPreDate:0);
		re['endDt'] = "TO_DATE('"+para.sysdate+"','DD/MM/YYYY') + " + (para.offsetAfterDate?para.offsetAfterDate:1);

		var condition = para.condition;
		var cDeptId = DEPT_MAP[1][condition[1]+condition[11]+condition[12]];
		var fDeptId = DEPT_MAP[2][condition[2]+condition[21]+condition[22]];
		var oDeptId = DEPT_MAP[13][condition[13]];
		if(cDeptId){
		    re['cDeptId-staffN'] = "'"+cDeptId[2].substring(1,2) + re['staffN']+"'";
			re['cDeptId'] = cDeptId.join(',');
		}
		if(fDeptId){
		    re['fDeptId-staffN'] = "'"+fDeptId[2].substring(1,2) + re['staffN']+"'";
			re['fDeptId'] = fDeptId.join(',');
		}
		if(oDeptId){
			re['oDeptId-staffN'] = "'"+oDeptId[2].substring(1,2) + re['staffN']+"'";
			re['oDeptId'] = oDeptId.join(',');
		}
		
		//set unit section record
		if(condition[3]==Y){
			//section_n, unit_c, effective_d
			re['sectionTransfer'] = {
				'section_n': DEPT_MAP[1][3][0],
				'unit_c': DEPT_MAP[1][3][1]
			}
		}
		
		//set transfer record
		if(condition[4]==Y){
			//transfer_d,out_department_c,in_department_c
			re['deptTransfer'] = {
				'out_department_c': cDeptId[2],
				'in_department_c': fDeptId[2]
			}
		}
		
		return re;
	}
	
	AutoParse.fn.formatSql = function(para){
		var env = this.formatBasic(para);
		
		//prepare sql, delete all exist record for select staff
		var RemoveSQLArr = [
				"DELETE STAFF_WORK WHERE IC_N = "+ env['icN'] + ";",
				"DELETE STAFF_TRANSFER WHERE IC_N = "+ env['icN'] + ";",
				"DELETE STAFF_SECTION_UNIT WHERE IC_N = "+ env['icN'] + ";",
				"DELETE STAFF WHERE IC_N = "+ env['icN'] + ";"
			];
		var SettingSQLArr = ["INSERT INTO staff(ic_n,staff_m,employment_dt,termination_dt,actual_staff_m,user_id,designation_c,personal_id_n) VALUES(" + env['icN'] + ",'nameKnown',TO_DATE('19900101', 'yyyymmdd'), TO_DATE('20200101', 'yyyymmdd'),'nameKnown','userId',NULL,'0000');"];
		//get dept and section/unit for each type
		if(env['cDeptId']){
			var deptId = env['cDeptId'];
			var staffN = env['cDeptId-staffN'];
			var SQL = "INSERT INTO STAFF_WORK(staff_n, ic_n, section_n, unit_c, home_department_c, start_dt, end_dt, work_department_c, nts_i, appointment_type_c, roster_scheme_n) VALUES ("
				+staffN+", "+ env['icN'] +", " + deptId + "," + env['startDt'] + "," + env['endDt'] + ", 'A','1','J','0');"
			SettingSQLArr.push(SQL );
		}
		if(env['fDeptId']){
			var deptId = env['fDeptId'];
			var staffN = env['fDeptId-staffN'];
			var SQL = "INSERT INTO STAFF_WORK(staff_n, ic_n, section_n, unit_c, home_department_c, start_dt, end_dt, work_department_c, nts_i, appointment_type_c, roster_scheme_n) VALUES ("
				+staffN+", "+ env['icN'] +", " + deptId + "," + env['endDt'] + ", null , 'A','1','J','0');"
			SettingSQLArr.push(SQL );
		}
		
		if(env['deptTransfer']){
			var deptTransfer = env['deptTransfer'];
			var SQL = "INSERT INTO staff_transfer(ic_n,transfer_d,out_department_c,in_department_c)  VALUES ("
			+ env['icN'] +"," + env['endDt'] + ", "+deptTransfer['out_department_c']+", "+deptTransfer['in_department_c']+");"
			SettingSQLArr.push( SQL );
		}
		
		if(env['sectionTransfer']){
			var sectionTransfer = env['sectionTransfer'];
			var SQL = "IINSERT INTO staff_section_unit(ic_n, section_n, unit_c, effective_d) VALUES("
			+ env['icN'] +", "+sectionTransfer['section_n']+", "+sectionTransfer['unit_c']+", " + env['endDt'] + ");";
			SettingSQLArr.push(SQL);
		}
		
		var EnquireSQLArr = [
				"SELECT * FROM STAFF_WORK WHERE IC_N = "+ env['icN'] + ";",
				"SELECT * FROM STAFF_TRANSFER WHERE IC_N = "+ env['icN'] + ";",
				"SELECT * FROM STAFF_SECTION_UNIT WHERE IC_N = "+ env['icN'] + ";",
				"SELECT * FROM STAFF WHERE IC_N = "+ env['icN'] + ";"
		];
		return {
		    RemoveSQLArr: RemoveSQLArr,
			SettingSQLArr: SettingSQLArr,
			EnquireSQLArr: EnquireSQLArr,
			icN : env['icN']
		};
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
	}
	AutoParse.fn.bindPublishHandle = function(publishId){
	    this.publishBoard = $('#'+publishId);
		var root = this.publishBoard;
	    var publishTitle = root.appendNewEle('div').attr('class','menu').appendNewEle('ul').attr('class', 'title menu');
		var publishBoard = root.appendNewEle('div').appendNewEle('ul').attr('class', 'content');

		root.bind('publish',function(event, para1){
			var env = para1;
		    var icN = env['SQLArr']['icN'];
		    var index = icN.substring(1, icN.length-1) +'-'+env.sysdate+'-'+env.condition[7]
		    var title = publishTitle.appendNewEle('li').attr('index', index);
			title.appendNewEle('span').text(index);
			
			var con = publishBoard.appendNewEle('li').attr('class', 'sqlContent').attr('index', index);
			var RemoveSQLArr = env['SQLArr'].RemoveSQLArr;
			var SettingSQLArr = env['SQLArr'].SettingSQLArr;
			var EnquireSQLArr = env['SQLArr'].EnquireSQLArr;
			var blocks = ['RemoveSQLArr','SettingSQLArr','EnquireSQLArr'];
			var sqlArr = ['--------------------'+index];
			for(var i=0; i < blocks.length; i++){
			    var blockName =  blocks[i];
				var sqls = env['SQLArr'][blockName];
			    con.appendNewEle('div').attr('class', blockName+' sqlBlock')
				    .html('<span>'+ sqls.join('</span><span>')  + '</span>');
			    sqlArr.push('--------------------' + blocks[i]);
				sqlArr.push(sqls.join('\n'))
			    sqlArr.push('');
			}
			con.appendNewEle('textarea').val(sqlArr.join('\n'))
			
			title.trigger('click', index);
		})
		
		publishTitle.delegate('li','click',function(event, index){
		    root.find('.selected').removeClass('selected')
		    var index = $(this).addClass('selected').attr('index');
			publishBoard.trigger('change', index);
		})
		
		publishBoard.bind('change',function(event, index){
			publishBoard.find('li').hide().filter('[index="'+ index +'"]').show();
		})
	}
	//define outside
    exports.createNewCondition = function(baseId, publishId){
		var baseRole = new BaseRole(baseId, Properties);
	    return new AutoParse(baseRole, publishId);
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