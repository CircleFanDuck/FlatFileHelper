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

deptMap["	P01TBT10--	"]="	1,1,1	";
deptMap["	P01TBT12--	"]="	2,2,2	";