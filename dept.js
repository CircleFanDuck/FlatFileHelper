var deptMap = {};
var trimed = false;
function getDeptDetail(deptid){
    if(!trimed){
	    deptMapOri = deptMap;
		deptMap = {};
		for(var p in deptMapOri){
		    var arr = jQuery.trim(deptMapOri[p]).split(',');
			var key = jQuery.trim(p);
			deptMap[key] = arr;
		}
		trimed = true;
	}
	if(deptMap[deptid]){
	    return deptMap[deptid].join(', ');
	}else{
	    return '<label class=error>Not exist!</label>'
	}
}
//SQL: use to refre the  DB value
//SELECT  'deptMap["', KEY_M, '"]="', VALUE_X, '";' FROM RES_CONFIG where value_x like '%,%,%' and key_m like 'P01%'

deptMap["	P011	"]="	1,1,1	";
deptMap["	P012	"]="	2,2,2	";