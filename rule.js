(function(exports){
	exports.RULE = []
	var JOB = [];
	JOB.push(['message type',0,1,'1'])
	JOB.push(['TransId',1,16,'JOB'])
	JOB.push(['Action',16,17])
	JOB.push(['icN',43,54])
	JOB.push(['userId',96,104,'USERID'])
	JOB.push(['oldDeptId',262,272])
	JOB.push(['deptId',272,282])
	JOB.push(['start Dt',306,314])
	JOB.push(['designation code',330,336,'SLS'])
	JOB.push(['apptTyC',378,380,'J'])
	JOB.push(['psaEmplType',384,386])
	JOB.push(['hireDt',394,402,'19900101'])
	JOB.push(['terminationDtAsString',426,434])
	JOB.push(['oldNextStartAction',510,516])
	JOB.push(['nextAction',516,522])
	JOB.push(['nextStartDt',530,538])
	JOB.push(['end Dt',558,566])
	JOB.push(['nameKnown',682,732,'NAMEKNOWTEST'])

	exports.RULE['JOB'] = JOB;
	exports.RULE['JOB-example'] = "1JOB            CC20120803153839F7392632R  F7392632R  LSD   LSD                         YAPBH   YAPBH                         20120803201208040  0  ATAIYAP BOON HENG                                     YAP BOON HENG                                     PSASGPSASGP01TLS40--P01TLS40--P01P01TT4040    2011020120091030PSA01PSA01SLS   SLS   2011070120110701PSASTPSAST  001391001391J J PP    2009103020091030                        20120804        20120803SR LASHING SPECIALIST         SR LASHING SPECIALIST                                     TERMIN      20120804                                                                          YAP BOON HENG                                     YAP BOON HENG                                     ";

	var SNPECONTACT = [];
	SNPECONTACT.push(['Message type',0,1,1])
	SNPECONTACT.push(['Trans Id',1,16,'SNPECONTACT'])
	SNPECONTACT.push(['icN',32,43])
	SNPECONTACT.push(['contactName',83,133])
	SNPECONTACT.push(['phoneN',133,157])
	exports.RULE['SNPECONTACT'] = SNPECONTACT;

	var SNPADDR = [];
	SNPADDR.push(['Message type',0,1,1])
	SNPADDR.push(['Trans Id',1,16,'SNPADDR'])
	SNPADDR.push(['icN',32,43])
	SNPADDR.push(['address1',90,145])
	SNPADDR.push(['address2',145,200])
	SNPADDR.push(['address3',200,255])
	SNPADDR.push(['address4',255,310])
	exports.RULE['SNPADDR'] = SNPADDR;

	var SNPPER = [];
	SNPPER.push(['Message type',0,1,1])
	SNPPER.push(['Trans Id',1,16,'SNPPER'])
	SNPPER.push(['icN',32,43])
	SNPPER.push(['birthDt',59,67])
	SNPPER.push(['userId',133,141])
	SNPPER.push(['name',141,191])
	exports.RULE['SNPPER'] = SNPPER;

	var SNPPHONE = [];
	SNPPHONE.push(['Message type',0,1,1])
	SNPPHONE.push(['Trans Id',1,16,'SNPPHONE'])
	SNPPHONE.push(['icN',32,43])
	SNPPHONE.push(['phoneType',83,87])
	SNPPHONE.push(['phoneN',87,111])
	exports.RULE['SNPPHONE'] = SNPPHONE;

	var SNPCOMPEN = [];
	SNPCOMPEN.push(['Message type',0,1,1])
	SNPCOMPEN.push(['Trans Id',1,16,'SNPCOMPEN'])
	SNPCOMPEN.push(['icN',32,43])
	SNPCOMPEN.push(['compEffDtAsString',83,91,1])
	SNPCOMPEN.push(['compRateC',94,102])
	SNPCOMPEN.push(['eligibilityI',112,113])
	exports.RULE['SNPCOMPEN'] = SNPCOMPEN;

	var DEL_ID = [];
	DEL_ID.push(['Message type',0,1,1])
	DEL_ID.push(['Trans Id',1,16,'DEL_ID'])
	DEL_ID.push(['icN',32,43])
	exports.RULE['DEL_ID'] = DEL_ID;

	var SNPJOBF = [];
	SNPJOBF.push(['Message type',0,1,'1'])
	SNPJOBF.push(['TransId',1,16,'SNPJOBF'])
	SNPJOBF.push(['Action',16,17])
	SNPJOBF.push(['icN',32,43])
	SNPJOBF.push(['psaDeptC',43,49])
	SNPJOBF.push(['userId',60,68, 'USERID'])
	SNPJOBF.push(['preEmpId',68,79])
	SNPJOBF.push(['deptId',147,157])
	SNPJOBF.push(['Start date',165,173])
	SNPJOBF.push(['designation code',178,184,'SLS'])
	SNPJOBF.push(['apptTyC',204,206,'J'])
	SNPJOBF.push(['psaEmplType',207,209])
	SNPJOBF.push(['hireDt',209,217,'19900101'])
	SNPJOBF.push(['nextAction',271,277])
	SNPJOBF.push(['nextStartDt',277,285])
	SNPJOBF.push(['End date&termination date',291,299])
	SNPJOBF.push(['nameKnown',332,382,'NAMEKNOWTEST'])
	exports.RULE['SNPJOBF'] = SNPJOBF;
	exports.RULE['SNPJOBF-example'] = "1SNPJOBF        AF20120803153832F1643139R  PPT1             WENWEI             201210010  TIWONG WEN WEI                                      PSASGP01TP390--P01T90  20110411PSA01CESYCO20110411PSAST 001683J P  20110411        2012041020120409CONT EQPT SPEC (YC)                                                                        WONG WEN WEI                                      "

	var CHG_ID = [];
	CHG_ID.push(['Message type',0,1,1])
	CHG_ID.push(['Trans Id',1,16,'CHG_ID'])
	CHG_ID.push(['Action (condition 10)',16,17])
	CHG_ID.push(['icN',32,43])
	CHG_ID.push(['newEmpId',43,54])
	CHG_ID.push(['userId',74,82])
	exports.RULE['CHG_ID'] = CHG_ID;


	exports.idNeedTransMap = {}
	idNeedTransMap['deptId'] = true;
	idNeedTransMap['oldDeptId'] = true;
})(window)