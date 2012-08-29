var deptMap = {};
var deptIdMap = {};
var trimed = false;
function getDeptDetail(key){
    if(!trimed){
	    deptMapOri = deptMap;
		deptMap = {};
		for(var p in deptMapOri){
		    var arr = jQuery.trim(deptMapOri[p]).split(',');
			var key = jQuery.trim(p);
			deptMap[key] = arr;
			if(!deptIdMap[arr[2]]){
			    deptIdMap[arr[2]] = [];
			}
			deptIdMap[arr[2]].push(key);
		}
		trimed = true;
	}
	if(deptMap[key]){
	    return deptMap[key].join(', ');
	}else{
	    return '<label class=error>Not exist!</label>'
	}
}

function getRandomDept(){
    var deptArr = ['B','T','C','K'];
    var random = a.getSeconds();
	return deptArr[random%deptArr.length];
}

function getRandomDeptIdByDept(dept){
    var deptIdArr = deptIdMap[dept]
    var random = a.getSeconds();
	return deptIdArr[random%deptIdArr.length];
}

//SQL: use to refre the  DB value
//SELECT  'deptMap["', KEY_M, '"]="', VALUE_X, '";' FROM RES_CONFIG where value_x like '%,%,%' and key_m like 'P01%'

deptMap["	P011	"]="	1,1,1	";
deptMap["	P012	"]="	2,2,2	";