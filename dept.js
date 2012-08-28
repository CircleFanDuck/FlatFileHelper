var deptMap = {};
var trimed = false;
function getDeptDetail(key){
    if(!trimed){
	    deptMapOri = deptMap;
		deptMap = {};
		for(var p in deptMapOri){
			deptMap[jQuery.trim(p)]=jQuery.trim(deptMapOri[p]);
		}
		trimed = true;
	}
	if(deptMap[key]){
	    return deptMap[key];
	}else{
	    return '<label class=error>Not exist!</label>'
	}
}

//SQL: use to refre the  DB value
//SELECT  'deptMap["', KEY_M, '"]="', VALUE_X, '";' FROM RES_CONFIG where value_x like '%,%,%' and key_m like 'P01%'

deptMap["	P011	"]="	1,1,1	";
deptMap["	P012	"]="	2,2,2	";